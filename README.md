# ENGO651 Lab 5 - IoT Geoweb Application


A real-time geospatial tracking application that transforms smartphones into IoT sensors using MQTT protocol and Leaflet mapping.

📂 File Structure

ENGO651-Lab5

├── index.html          # Main application interface
├── style.css           # Dark theme styling
├── app.js              # Core application logic
├── README.md           # This documentation


## 📋 Features

- **Real-time Geolocation Tracking** (HTML5 Geolocation API)
- **MQTT over WebSockets** (Paho Client Library)
- **Temperature Visualization** (Color-coded markers)
- **Automatic Reconnection** (5-second retry logic)
- **Secure Connection** (SSL support for port 8081)
- **Mobile-First Design** (Responsive interface)

## ✅ Lab Requirements Met

1. **Configurable MQTT Broker**  
   - Editable host/port inputs
   - Connection state management
2. **Start/Stop Functionality**  
   - Disabled UI elements during connection
   - Clean disconnection handling
3. **Automatic Recovery**  
   - Network failure resilience
   - Geolocation error handling
4. **GeoJSON Messaging**  
   - Structured payload with random temps (-40°C to 60°C)
   - Regular 60-second updates
5. **Visual Mapping**  
   - Leaflet.js integration
   - Temperature-based marker colors:
     - 🔵 Blue (-40°C to 10°C)
     - 🟢 Green (10°C to 30°C)
     - 🔴 Red (30°C to 60°C)
6. **Cross-Device Testing**  
   - Mobile browser support
   - MQTTX verification workflow

## 🛠️ Technologies Used

| Component          | Technology                 |
|--------------------|----------------------------|
| Protocol           | MQTT over WebSockets       |
| Mapping            | Leaflet.js                 |
| MQTT Client        | Paho MQTT                  |
| Geolocation        | HTML5 API                  |
| Styling            | CSS3 Custom Properties     |
| Hosting            | GitHub Pages               |


### Prerequisites
- Modern web browser (Chrome/Firefox recommended)
- [MQTTX Client](https://mqttx.app/) installed
- GitHub account for deployment

### Installation
1. Clone repository:
   ```bash
   git clone https://github.com/NishathRuksana/ENGO-651_Project-5.git
   cd ENGO651-Lab5