const API_BASE_URL = 'http://localhost:8080';

window.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', sendFeedbackMessage);
    }
});


async function sendFeedbackMessage(event) {
    event.preventDefault();

    const feedbackUserName = document.getElementById('feedback-name').value.trim();
    const feedbackMessage = document.getElementById('feedback-message').value.trim();
    let feedbackUserIp = 'Unknown';
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            feedbackUserIp = ipData.ip;
        }
    } catch (error) {
        console.warn('Could not fetch IP:', error);
    }
    const feedbackResponseMessageEl = document.getElementById('feedback-response-message');

    try{
        feedbackResponseMessageEl.style.color = 'gray';
        feedbackResponseMessageEl.textContent = 'IMMA SENDING IIIIITTT...';

        const response = await fetch(`${API_BASE_URL}/feedback`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: feedbackUserName,
                message: feedbackMessage,
                userInfo: feedbackUserIp
            })
        });

        if(response.ok){
            feedbackResponseMessageEl.style.color = 'green';
            feedbackResponseMessageEl.textContent = 'Feedback gesendet!';
            document.getElementById('feedback-form').reset();
        }else{
            const errorData = await response.json().catch(() => null);
            feedbackResponseMessageEl.style.color = 'red';
            feedbackResponseMessageEl.textContent = errorData?.message
                ? `Fehler: ${errorData.message}`
                : 'Fehler beim Senden des Feedbacks!';
        }

    }catch (error){
        console.error('network error at POST/feedback:', error);
        feedbackResponseMessageEl.style.color = 'red';
        feedbackResponseMessageEl.textContent = 'Versuch es nochmal in 50 Werktagen';
    }
}
