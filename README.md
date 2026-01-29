<div align="center">

  <img src="./assets/logo.svg" alt="Aegis IoT Logo" width="400" />

  <br />
  <br />

  [![System Status](https://img.shields.io/badge/System-Operational-2ea44f?style=for-the-badge&logo=statuspage&logoColor=white)](./)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&logo=open-source-initiative&logoColor=white)](./LICENSE)
  [![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-orange?style=for-the-badge&logo=box&logoColor=white)](./)
  [![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ibesuperv/AegisToT)

  <h3>Distributed Accident Response & Telemetry System</h3>

</div>

---

## 🦅 System Overview

**Aegis IoT** is a production-grade safety infrastructure designed to drastically reduce emergency response times for motorcycle accidents. 

Unlike traditional passive trackers, Aegis utilizes an **Event-Driven Architecture** to process real-time telemetry from on-vehicle sensors. It employs disjoint processing (Client vs. Cloud) to ensure that critical accident events are detected locally and verified centrally, eliminating false positives while guaranteeing sub-second alert dispatch.

### 🏆 Key Engineering Highlights for Resume
*   **Distributed Telemetry Processing**: Decoupled sensor ingestion (Firebase) from business logic (Node.js Worker), handling high-throughput location streams.
*   **Idempotent Alerting Pipeline**: Implemented race-condition guards to prevent duplicate SOS signals during sensor spikes.
*   **Hybrid Client Connectivity**: Client switches dynamically between standardized REST APIs (Auth) and Socket-based streams (Data) for optimal battery/network efficiency.

---

## 📂 System Modules

The repository is structured as a monorepo containing the two core pillars of the infrastructure. Please refer to the respective documentation for installation and setup guides.

<div align="center">

| **📱 Mobile Client** | **☁️ Cloud Core** |
| :--- | :--- |
| **[View Documentation](./bike-mobile/README.md)** | **[View Documentation](./bike-backend/README.md)** |
| *React Native • Expo • Zustand* | *Node.js • Express • MySQL • Redis* |
| The rider-facing dashboard. Validates sensor data locally and visualizes real-time status. | The decision engine. Triangulates hospitals via Google Places and dispatches Twilio SMS. |

</div>

---

## 🏗️ High-Level Architecture

The system follows a reactive pattern where state changes in the Realtime Database trigger asynchronous worker processes.

```mermaid
graph LR;
    subgraph Edge Layer [Mobile Device]
        Sensors((Sensors)) -->|Linear Acceleration| App[Aegis Client];
    end

    subgraph Transport Layer [Realtime Stream]
        App -->|Sync <100ms| Firebase[(Firebase RTDB)];
    end

    subgraph Core Layer [Cloud Infrastructure]
        Firebase -.->|Event Trigger| Worker[Accident Worker];
        Worker -->|1. Fetch Profile| DB[(MySQL User Store)];
        Worker -->|2. Geo-Query| Maps[Google Places API];
        Worker -->|3. Dispatch| Twilio[Twilio SMS Gateway];
    end

    subgraph Output
        Twilio -->|SOS + GPS Link| Emergency[Emergency Contacts];
    end
    
    style Worker fill:#d946ef,stroke:#333,stroke-width:2px
    style Firebase fill:#f59e0b,stroke:#333,stroke-width:2px
```

---

## 📜 License
This project is open-source and available under the [MIT License](./LICENSE).