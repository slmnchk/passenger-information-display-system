import { apiFetch } from './api-config.js';
import { sendDirectTelegramNotification } from './telemetry.js';
import type { JoinedDeparture, PageResponse } from './types.js';

type TabAction = 'verbindungen' | 'aktualisieren';

window.addEventListener('DOMContentLoaded', () => {
    setupTabButtons();
    setupUpdateForm();
    void sendDirectTelegramNotification('Index');
});

function setupTabButtons(): void {
    const buttons = document.querySelectorAll<HTMLElement>('.request-body-function-button');
    buttons.forEach(button => {
        const action = button.dataset.action as TabAction | undefined;
        if (!action) return;
        button.addEventListener('click', () => tabSelected(button, action));
    });
}

function tabSelected(element: HTMLElement, actionType: TabAction): void {
    const isActive = element.classList.contains('active');
    const buttons = document.querySelectorAll<HTMLElement>('.request-body-function-button');
    const tableContainer = document.getElementById('connections-table-container');
    const formContainer = document.getElementById('update-form-container');

    if (!tableContainer || !formContainer) return;

    buttons.forEach(btn => btn.classList.remove('active'));

    if (!isActive) {
        element.classList.add('active');

        if (actionType === 'verbindungen') {
            tableContainer.classList.remove('hidden');
            formContainer.classList.add('hidden');
            void fetchDepartures();
        } else {
            formContainer.classList.remove('hidden');
            tableContainer.classList.add('hidden');
        }
    } else {
        tableContainer.classList.add('hidden');
        formContainer.classList.add('hidden');
    }
}

async function fetchDepartures(): Promise<void> {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;

    try {
        const page = await apiFetch<PageResponse<JoinedDeparture>>('/departures');
        const departures = page.content ?? [];

        tableBody.innerHTML = '';

        if (departures.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5;
            cell.style.textAlign = 'center';
            cell.textContent = 'Keine Verbindungen vorhanden';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        departures.forEach(dept => tableBody.appendChild(renderDepartureRow(dept)));
    } catch (error) {
        console.error('Kein Netz beim GET /departures:', error);
    }
}

function renderDepartureRow(dept: JoinedDeparture): HTMLTableRowElement {
    const tr = document.createElement('tr');

    // TODO: add statusOfDeparture CANCELLED
    const statusColor = dept.statusOfDeparture === 'ON_TIME' ? 'green' : 'orange';

    const makeCell = (text: string): HTMLTableCellElement => {
        const td = document.createElement('td');
        td.textContent = text;
        return td;
    };

    tr.appendChild(makeCell(dept.scheduledTime ?? ''));
    tr.appendChild(makeCell(dept.actualTime ?? dept.scheduledTime ?? ''));
    tr.appendChild(makeCell(dept.trainLine ?? ''));
    tr.appendChild(makeCell(dept.destination ?? ''));
    tr.appendChild(makeCell(String(dept.tripId ?? '')));

    const statusCell = makeCell(dept.statusOfDeparture);
    statusCell.style.color = statusColor;
    statusCell.style.fontWeight = 'bold';
    tr.appendChild(statusCell);

    return tr;
}

function setupUpdateForm(): void {
    const updateForm = document.getElementById('update-live-form');
    if (updateForm instanceof HTMLFormElement) {
        updateForm.addEventListener('submit', handleUpdateLiveTime);
    }
}

async function handleUpdateLiveTime(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const tripIdInput = document.getElementById('trip-id') as HTMLInputElement | null;
    const actualTimeInput = document.getElementById('actual-time') as HTMLInputElement | null;
    const responseMessageEl = document.getElementById('form-response-message');

    if (!tripIdInput || !actualTimeInput || !responseMessageEl) return;

    const tripId = tripIdInput.value.trim();
    const actualTimeRaw = actualTimeInput.value.trim();

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(actualTimeRaw)) {
        responseMessageEl.style.color = 'red';
        responseMessageEl.textContent = 'Ungültiges Zeitformat! Bitte HH:MM eingeben (z.B. 14:25).';
        return;
    }

    const actualTime = actualTimeRaw.length === 5 ? `${actualTimeRaw}:00` : actualTimeRaw;

    try {
        responseMessageEl.style.color = 'gray';
        responseMessageEl.textContent = 'Wird aktualisiert...';

        await apiFetch<void>(`/departures/${tripId}/live`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actualTime })
        });

        responseMessageEl.style.color = 'green';
        responseMessageEl.textContent = `Erfolgreich! Live-Zeit für Reise #${tripId} aktualisiert.`;
        updateForm()?.reset();
    } catch (error) {
        responseMessageEl.style.color = 'red';
        responseMessageEl.textContent = error instanceof Error ? `Fehler: ${error.message}` : 'Fehler beim Aktualisieren der Abfahrtszeit!';
    }
}

function updateForm(): HTMLFormElement | null {
    return document.getElementById('update-live-form') as HTMLFormElement | null;
}