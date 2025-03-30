/* Global variables */
let client;
let map;
let marker;
let watchId;

// Constants for MQTT topic
const courseCode = "ENGO651";
const studentName = "Nishath Ruksana";
const baseTopic = `${courseCode}/${studentName}`; // Base MQTT topic

// Initialize Leaflet map
function initMap() {
  map = L.map("map").setView([51.0447, -114.0719], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
}
initMap();

/**
 * Connects to MQTT broker.
 */
function connect() {
  const host = document.getElementById("host").value;
  const port = parseInt(document.getElementById("port").value);

  client = new Paho.MQTT.Client(
    host,
    port,
    "/mqtt",
    "client_" + Math.random().toString(16).substr(2, 8)
  );

  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  const options = {
    onSuccess: onConnect,
    useSSL: port === 8081,
    mqttVersion: 4,
    keepAliveInterval: 30,
    cleanSession: false,
    onFailure: (err) => {
      updateStatus(`Connection failed: ${err.errorMessage}`, "disconnected");
      setTimeout(connect, 5000); // Attempt reconnection
    },
  };

  updateStatus("Connecting...", "disconnected");
  client.connect(options);
}

/**
 * Callback on successful MQTT connection.
 */
function onConnect() {
  updateStatus("Connected", "connected");

  document.getElementById("connectBtn").disabled = true;
  document.getElementById("disconnectBtn").disabled = false;
  document.getElementById("shareBtn").disabled = false;
  document.getElementById("host").disabled = true;
  document.getElementById("port").disabled = true;

  client.subscribe(`${baseTopic}/my_temperature`, { qos: 1 });
}

/**
 * Disconnects from MQTT broker and stops geolocation tracking.
 */
function disconnect() {
  client.disconnect();
  updateStatus("Disconnected", "disconnected");

  document.getElementById("connectBtn").disabled = false;
  document.getElementById("disconnectBtn").disabled = true;
  document.getElementById("shareBtn").disabled = true;
  document.getElementById("host").disabled = false;
  document.getElementById("port").disabled = false;

  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Handles lost MQTT connection.
 */
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    updateStatus(
      `Connection lost: ${response.errorMessage} - Reconnecting...`,
      "disconnected"
    );
    setTimeout(connect, 5000);
  }
}

/**
 * Updates connection status.
 */
function updateStatus(text, state) {
  const statusElem = document.getElementById("status");
  statusElem.textContent = text;
  statusElem.className =
    state === "connected" ? "status-connected" : "status-disconnected";
}

/**
 * Handles incoming MQTT messages and updates map.
 */
function onMessageArrived(message) {
  try {
    const data = JSON.parse(message.payloadString);
    if (message.destinationName.includes("my_temperature")) {
      updateMapMarker(data);
    }
  } catch (error) {
    console.error("Error parsing incoming message:", error);
  }
}

/**
 * Starts geolocation tracking and publishes data every minute.
 */
function shareStatus() {
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const temp = (Math.random() * 100 - 40).toFixed(1);
      const geojson = {
        type: "Feature",
        properties: {
          temperature: temp,
          timestamp: new Date().toISOString(),
        },
        geometry: {
          type: "Point",
          coordinates: [position.coords.longitude, position.coords.latitude],
        },
      };

      const message = new Paho.MQTT.Message(JSON.stringify(geojson));
      message.destinationName = `${baseTopic}/my_temperature`;
      client.send(message);

      document.getElementById("pubTopic").value = message.destinationName;
      document.getElementById("message").value = JSON.stringify(
        geojson,
        null,
        2
      );

      setTimeout(shareStatus, 60000); // Publish every 1 minute
    },
    handleGeolocationError,
    {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000,
    }
  );
}

/**
 * Updates the map with a new marker including your name.
 */
function updateMapMarker(data) {
  const [lng, lat] = data.geometry.coordinates;
  const temp = data.properties.temperature;

  if (marker) {
    map.removeLayer(marker);
  }

  const iconColor = getTemperatureColor(temp);
  const customIcon = L.divIcon({
    className: "temperature-marker",
    html: `<div style="
      background-color: ${iconColor};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 5px rgba(0,0,0,0.3);
    "></div>`,
  });

  marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
  marker
    .bindPopup(
      `
      <strong>Name:</strong> Nishath Ruksana<br>
      <strong>Temperature:</strong> ${temp}°C<br>
      <strong>Last Update:</strong> ${new Date(
        data.properties.timestamp
      ).toLocaleString()}
    `
    )
    .openPopup();

  map.setView([lat, lng], 13);
}

/**
 * Assigns a color based on temperature.
 */
function getTemperatureColor(temp) {
  if (temp < 10) return "#2980b9"; // Blue for cold
  if (temp < 30) return "#27ae60"; // Green for moderate
  return "#c0392b"; // Red for hot
}

/**
 * Handles geolocation errors.
 */
function handleGeolocationError(error) {
  alert(`Geolocation Error (${error.code}): ${error.message}`);
}
