# Passenger Information Display System (PIDS)

Ein Web-Projekt zur Anzeige und Verwaltung von Zugfahrplänen in Echtzeit – ähnlich wie die Anzeigetafeln an Bahnhöfen oder Haltestellen.
Probieren Sie alle Tasten, die Sie auf der Webseite finden :)
---

## Live-Demo

Die Anwendung ist live unter **[salmanchik.com](http://salmanchik.com)** erreichbar.

> **Hinweis:** Die Benutzeroberfläche ist aktuell nur für Desktop-Bildschirme ausgelegt und noch nicht für Mobilgeräte optimiert. Auf Tablets muss es jedoch gut aussehen..

---

## Tech Stack

* **Backend:** Java, Spring Boot (Web, Data JPA, Validation), Hibernate
* **Datenbank:** PostgreSQL
* **Frontend:** HTML, CSS, JavaScript (Fetch API)
* **DevOps & Infrastructure:** Docker, Google Compute Engine (GCE), GitHub Actions (CI/CD), Gradle, Git

---

## Features & Architektur

* RESTful API für Fahrpläne und Echtzeit-Updates
* Package-by-Feature Struktur für gute Wartbarkeit
* Automatisierte CI/CD-Pipeline (Testing & Deployment bei jedem Push)
* Containerisierung der Datenbank via Docker