const API_BASE_URL = 'http://34.55.160.7:8080';

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
    const feedbackResponseMessageEl = document.getElementById('feedback-response-message');


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

    const metadataString = JSON.stringify(rawMetadata, null, 4);
    console.log(JSON.stringify(rawMetadata, null, 4));

    try {
        feedbackResponseMessageEl.style.color = 'gray';
        feedbackResponseMessageEl.textContent = 'IMMA SENDING IIIIITTT...';

        const response = await fetch(`${API_BASE_URL}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: feedbackUserName,
                feedback: feedbackMessage,
                userMetadata: metadataString
            })
        });

        if (response.ok) {
            feedbackResponseMessageEl.style.color = 'green';
            feedbackResponseMessageEl.textContent = 'Feedback gesendet!';
            document.getElementById('feedback-form').reset();
        } else {
            const errorData = await response.json().catch(() => null);
            feedbackResponseMessageEl.style.color = 'red';
            feedbackResponseMessageEl.textContent = errorData?.message
                ? `Fehler: ${errorData.message}`
                : 'Fehler beim Senden des Feedbacks!';
        }
    } catch (error) {
        console.error('network error at POST /feedback:', error);
        feedbackResponseMessageEl.style.color = 'red';
        feedbackResponseMessageEl.textContent = 'Versuch es nochmal in 50 Werktagen';
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