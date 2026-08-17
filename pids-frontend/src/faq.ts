import { sendDirectTelegramNotification } from './telemetry.js';
window.addEventListener('DOMContentLoaded', () => {
    void sendDirectTelegramNotification('FAQ');
});