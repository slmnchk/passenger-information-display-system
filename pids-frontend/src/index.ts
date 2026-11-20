import { apiFetch } from './api-config.js';
import { sendDirectTelegramNotification } from './telemetry.js';
import type { JoinedDeparture, PageResponse } from './types.js';

const board = document.querySelector<HTMLElement>('#connections-table-container')!;
const boardMessage = document.querySelector<HTMLElement>('#board-message')!;
const tableBody = document.querySelector<HTMLTableSectionElement>('#table-body')!;
const pageLabel = document.querySelector<HTMLElement>('#departure-page')!;
const previousPage = document.querySelector<HTMLButtonElement>('#previous-page')!;
const nextPage = document.querySelector<HTMLButtonElement>('#next-page')!;
const tabs = document.querySelectorAll<HTMLButtonElement>('.request-body-function-button');

let pageNumber = 0;
let filters = new URLSearchParams();
let boardRequest: AbortController | undefined;

for (const tab of tabs) {
    tab.addEventListener('click', () => {
        for (const button of tabs) {
            const active = button === tab;
            button.setAttribute('aria-pressed', String(active));
            button.classList.toggle('active', active);
            document.getElementById(button.getAttribute('aria-controls')!)?.classList.toggle('hidden', !active);
        }
        if (!board.classList.contains('hidden')) void fetchDepartures();
    });
}

document.querySelector<HTMLFormElement>('#departure-filters')!.addEventListener('submit', event => {
    event.preventDefault();
    filters = new URLSearchParams();
    new FormData(event.currentTarget as HTMLFormElement).forEach((value, key) => {
        if (String(value).trim()) filters.set(key, String(value).trim());
    });
    pageNumber = 0;
    void fetchDepartures();
});

previousPage.addEventListener('click', () => {
    pageNumber--;
    void fetchDepartures();
});
nextPage.addEventListener('click', () => {
    pageNumber++;
    void fetchDepartures();
});

async function fetchDepartures(): Promise<void> {
    boardRequest?.abort();
    const request = new AbortController();
    boardRequest = request;
    const query = new URLSearchParams(filters);
    query.set('page', String(pageNumber));
    previousPage.disabled = true;
    nextPage.disabled = true;

    try {
        const page = await apiFetch<PageResponse<JoinedDeparture>>(`/departures?${query}`, {
            signal: request.signal
        });
        if (request.signal.aborted) return;
        const lastPage = Math.max(0, page.totalPages - 1);
        if (pageNumber > lastPage) {
            pageNumber = lastPage;
            void fetchDepartures();
            return;
        }
        tableBody.replaceChildren(...page.content.map(renderDepartureRow));
        boardMessage.classList.remove('error');
        boardMessage.textContent = page.totalElements ? '' : 'Keine Verbindungen vorhanden.';
        pageLabel.textContent = page.totalPages ? `Seite ${page.number + 1} von ${page.totalPages}` : '';
        previousPage.disabled = page.number === 0;
        nextPage.disabled = page.number >= lastPage;
    } catch (error) {
        if (request.signal.aborted) return;
        boardMessage.classList.add('error');
        boardMessage.textContent = error instanceof Error ? error.message : 'Abfahrten konnten nicht geladen werden.';
    } finally {
        if (boardRequest === request) boardRequest = undefined;
    }
}

function renderDepartureRow(departure: JoinedDeparture): HTMLTableRowElement {
    const row = document.createElement('tr');
    const cells: [string, string | null][] = [
        ['Zeit', departure.scheduledTime.slice(0, 5)],
        ['Erwartet', departure.actualTime.slice(0, 5)],
        ['Zug', departure.trainLine],
        ['Start', departure.origin],
        ['Ziel', departure.destination],
        ['Gleis', departure.platform],
        ['ID', String(departure.tripId)],
        ['Status', departure.statusOfDeparture]
    ];

    for (const [label, value] of cells) {
        const cell = row.insertCell();
        cell.dataset.label = label;
        cell.textContent = value || '—';
        if (label === 'Status') {
            cell.style.color = departure.statusOfDeparture === 'ON_TIME' ? 'green' : 'darkorange';
            cell.style.fontWeight = 'bold';
        }
    }
    return row;
}

function bindAction(id: string, action: (data: FormData) => Promise<string | undefined>): void {
    const form = document.querySelector<HTMLFormElement>(`#${id}`)!;
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const message = form.querySelector<HTMLElement>('[role="status"]')!;
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (submit.disabled) return;
        submit.disabled = true;
        message.classList.remove('error');
        message.textContent = '';
        try {
            message.textContent = await action(new FormData(form)) ?? '';
        } catch (error) {
            message.classList.add('error');
            message.textContent = error instanceof Error ? error.message : 'Aktion fehlgeschlagen.';
        } finally {
            submit.disabled = false;
        }
    });
}

function jsonRequest(method: string, body: object): RequestInit {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
}

const departureRows = document.querySelector<HTMLElement>('#new-departure-rows')!;
const departureTemplate = document.querySelector<HTMLTemplateElement>('#new-departure-template')!;
const addRowButton = document.querySelector<HTMLButtonElement>('#add-departure-row')!;

function addDepartureRow(): void {
    const row = departureTemplate.content.firstElementChild!.cloneNode(true) as HTMLFieldSetElement;
    const remove = row.querySelector<HTMLButtonElement>('.remove-departure-row')!;
    remove.hidden = departureRows.childElementCount === 0;
    remove.addEventListener('click', () => {
        row.remove();
        addRowButton.disabled = false;
    });
    departureRows.append(row);
    addRowButton.disabled = departureRows.childElementCount >= 100;
}

addDepartureRow();
addRowButton.addEventListener('click', addDepartureRow);

bindAction('create-departures', async () => {
    const departures = Array.from(departureRows.children, row =>
        Object.fromEntries(Array.from(row.querySelectorAll('input'), input => [input.name, input.value.trim()]))
    );
    if (departures.some(departure => !departure.origin && !departure.destination)) {
        throw new Error('Gib für jede Abfahrt einen Startbahnhof oder ein Ziel ein.');
    }
    const created = await apiFetch<{ id: number }[]>('/departures/batch', jsonRequest('POST', { departures }));
    departureRows.replaceChildren();
    addDepartureRow();
    return `Gespeicherte IDs: ${created.map(departure => departure.id).join(', ')}.`;
});

bindAction('update-live-form', async data => {
    const id = String(data.get('id'));
    const origin = String(data.get('origin')).trim();
    const actualTime = String(data.get('actualTime'));
    if (Boolean(id) === Boolean(origin)) {
        throw new Error('Gib entweder eine ID oder einen Startbahnhof ein.');
    }
    if (id) {
        await apiFetch<void>(`/departures/${id}/live`, jsonRequest('POST', { actualTime }));
        return `Live-Zeit für ID ${id} aktualisiert.`;
    }
    const { count } = await apiFetch<{ count: number }>('/departures/live', jsonRequest('PATCH', { origin, actualTime }));
    return `${count} Abfahrt(en) aktualisiert.`;
});

const deleteMode = document.querySelector<HTMLSelectElement>('#delete-departures [name="mode"]')!;
const deleteId = document.querySelector<HTMLInputElement>('#delete-departures [name="id"]')!;
deleteMode.addEventListener('change', () => {
    deleteId.min = deleteMode.value === 'after' ? '0' : '1';
});

bindAction('delete-departures', async data => {
    const id = String(data.get('id'));
    if (data.get('mode') === 'after') {
        if (!window.confirm(`Alle Abfahrten mit ID größer als ${id} löschen?`)) return;
        const { count } = await apiFetch<{ count: number }>(
            `/departures?idGreaterThan=${id}`, { method: 'DELETE' }
        );
        return `${count} Abfahrt(en) gelöscht.`;
    }
    if (!window.confirm(`Abfahrt mit ID ${id} löschen?`)) return;
    await apiFetch<void>(`/departures/${id}`, { method: 'DELETE' });
    return `Abfahrt mit ID ${id} ist entfernt.`;
});

void fetchDepartures();
window.setInterval(() => {
    if (!board.classList.contains('hidden') && !document.hidden && !boardRequest) void fetchDepartures();
}, 3000);
void sendDirectTelegramNotification('Index');
