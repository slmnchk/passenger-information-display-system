window.addEventListener('DOMContentLoaded', () => {
    alert('Hinweis: Die Website befindet sich noch in der Entwicklung. Die Backend-Methoden sind noch nicht vollständig implementiert!');
});

function tabSelected(element, actionType) {
    const isActive = element.classList.contains('active');

    const buttons = document.querySelectorAll('.request-body-function-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    const tableContainer = document.getElementById('connections-table-container');

    if (!isActive) {
        element.classList.add('active');
        if (actionType === 'verbindungen') {
            tableContainer.classList.remove('hidden');
        } else {
            tableContainer.classList.add('hidden');
        }
    } else {
        tableContainer.classList.add('hidden');
    }
}