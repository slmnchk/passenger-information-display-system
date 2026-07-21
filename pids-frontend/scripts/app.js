function tabSelected(element, actionType) {
    const isActive = element.classList.contains('active');

    const buttons = document.querySelectorAll('.request-body-function-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (!isActive) {
        element.classList.add('active');
    }
}