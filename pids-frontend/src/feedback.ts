import { apiFetch } from './api-config.js';
import { buildMetadataPayload } from './telemetry.js';

window.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm instanceof HTMLFormElement) {
        feedbackForm.addEventListener('submit', sendFeedbackMessage);
    }
});

async function sendFeedbackMessage(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const nameInput = document.getElementById('feedback-name') as HTMLInputElement | null;
    const messageInput = document.getElementById('feedback-message') as HTMLInputElement | null;
    const responseEl = document.getElementById('feedback-response-message');

    if (!nameInput || !messageInput || !responseEl) return;

    const feedbackUserName = nameInput.value.trim();
    const feedbackMessage = messageInput.value.trim();

    try {
        responseEl.style.color = 'gray';
        responseEl.textContent = 'IMMA SENDING IIIIITTT...';

        await apiFetch<void>('/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: feedbackUserName,
                feedback: feedbackMessage,
                userMetadata: buildMetadataPayload('Feedback')
            })
        });

        responseEl.style.color = 'green';
        responseEl.textContent = 'Feedback gesendet!';
        (document.getElementById('feedback-form') as HTMLFormElement | null)?.reset();
    } catch (error) {
        responseEl.style.color = 'red';
        responseEl.textContent = error instanceof Error ? `Fehler: ${error.message}` : 'Fehler beim Senden des Feedbacks!';
    }
}