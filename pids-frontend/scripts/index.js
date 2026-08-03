const API_BASE_URL = 'http://localhost:8080';

window.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('update-live-form');
    if (updateForm) {
        updateForm.addEventListener('submit', handleUpdateLiveTime);
    }
});

function tabSelected(element, actionType) {
    const isActive = element.classList.contains('active');
    const buttons = document.querySelectorAll('.request-body-function-button');
    const tableContainer = document.getElementById('connections-table-container');
    const formContainer = document.getElementById('update-form-container');

    buttons.forEach(btn => btn.classList.remove('active'));

    if (!isActive) {
        element.classList.add('active');

        if (actionType === 'verbindungen') {
            tableContainer.classList.remove('hidden');
            formContainer.classList.add('hidden');
            fetchDepartures();
        } else if (actionType === 'aktualisieren') {
            formContainer.classList.remove('hidden');
            tableContainer.classList.add('hidden');
        }
    } else {
        tableContainer.classList.add('hidden');
        formContainer.classList.add('hidden');
    }
}

async function fetchDepartures() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;

    try {
        const response = await fetch(`${API_BASE_URL}/departures`);

        if (!response.ok) {
            console.error('Fehler beim Abrufen der Verbindungen');
            return;
        }

        const pageData = await response.json();
        const departures = pageData.content || [];

        tableBody.innerHTML = '';

        if (departures.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Keine Verbindungen vorhanden</td></tr>`;
            return;
        }

        departures.forEach(dept => {
            const tr = document.createElement('tr');

            let statusColor = 'green';

            if (dept.statusOfDeparture && (dept.statusOfDeparture !== 'ON_TIME' && dept.statusOfDeparture !== 'CANCELLED')) statusColor = 'orange';
            else if (dept.statusOfDeparture && (dept.statusOfDeparture !== 'ON_TIME' && dept.statusOfDeparture === 'CANCELLED')) statusColor = 'red';


            tr.innerHTML = `
                <td>${dept.scheduledTime || ''}</td>
                <td>${(dept.actualTime || dept.scheduledTime) || ''}</td>
                <td>${dept.trainLine || ''}</td>
                <td>${dept.destination || ''}</td>
                <td>${dept.tripId || ''}</td>
                <td style="color: ${statusColor}; font-weight: bold;">${dept.statusOfDeparture}</td>
            `;

            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error('Ошибка сети при запросе GET /departures:', error);
    }
}

async function handleUpdateLiveTime(event) {
    event.preventDefault();

    const tripId = document.getElementById('trip-id').value.trim();
    const actualTimeInput = document.getElementById('actual-time').value.trim();
    const responseMessageEl = document.getElementById('form-response-message');

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(actualTimeInput)) {
        responseMessageEl.style.color = 'red';
        responseMessageEl.textContent = 'Ungültiges Zeitformat! Bitte HH:MM eingeben (z.B. 14:25).';
        return;
    }

    const actualTime = actualTimeInput.length === 5 ? `${actualTimeInput}:00` : actualTimeInput;

    try {
        responseMessageEl.style.color = 'gray';
        responseMessageEl.textContent = 'Wird aktualisiert...';

        const response = await fetch(`${API_BASE_URL}/departures/${tripId}/live`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                actualTime: actualTime
            })
        });

        if (response.ok) {
            responseMessageEl.style.color = 'green';
            responseMessageEl.textContent = `Erfolgreich! Live-Zeit für Reise #${tripId} aktualisiert.`;
            document.getElementById('update-live-form').reset();
        } else {
            const errorData = await response.json().catch(() => null);
            responseMessageEl.style.color = 'red';
            responseMessageEl.textContent = errorData?.message
                ? `Fehler: ${errorData.message}`
                : 'Fehler beim Aktualisieren der Abfahrtszeit!';
        }

    } catch (error) {
        console.error('network error at POST/departures/{id}/live:', error);
        responseMessageEl.style.color = 'red';
        responseMessageEl.textContent = 'Server nicht erreichbar!';
    }
}