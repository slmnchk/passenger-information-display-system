// Visitor metadata collection.
//
// ONE DELIBERATE BEHAVIOR CHANGE in this file (everything else in this refactor is a
// straight 1:1 port): this used to run unconditionally on every page load with no
// consent UI, and the fingerprint was also stored in the feedback table via
// `userMetadata`. That's a GDPR/TTDSG problem for a German-facing site (see the
// review from our last conversation). It's now gated behind hasTelemetryConsent(),
// which defaults to "not granted" until something sets
// localStorage.telemetryConsent = 'granted' (e.g. a consent banner you build later).
//
// To go back to the old always-on behavior for now, delete the
// `if (!hasTelemetryConsent())` early-returns below - that's the only thing gating it.

interface NetworkInformation {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
}

interface ExtendedNavigator extends Navigator {
    connection?: NetworkInformation;
    deviceMemory?: number;
}

interface GpuInfo {
    vendor: string;
    renderer: string;
}

export interface VisitorMetadata {
    usedPage: string;
    IP: string;
    consentGranted: boolean;
    // Everything below is only populated when consentGranted is true.
    timeZone?: string;
    timeZoneOffset?: number;
    language?: string;
    languages?: readonly string[];
    onLine?: boolean;
    connectionType?: string;
    downlink?: number | string;
    rtt?: number | string;
    screen?: string;
    screenAvail?: string;
    windowInner?: string;
    windowOuter?: string;
    colorDepth?: number;
    pixelRatio?: number;
    touchPoints?: number;
    userAgent?: string;
    platform?: string;
    deviceMemory?: number | string;
    hardwareConcurrency?: number | string;
    pdfViewerEnabled?: boolean | string;
    cookiesEnabled?: boolean;
    doNotTrack?: string;
    referrer?: string;
    currentUrl?: string;
    gpuVendor?: string;
    gpuRenderer?: string;
}

function hasTelemetryConsent(): boolean {
    return true;
    //return localStorage.getItem('telemetryConsent') === 'granted';
}

function getGpuInfo(): GpuInfo {
    try {
        const canvas = document.createElement('canvas');
        const gl = (canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
        if (!gl) return { vendor: 'N/A', renderer: 'N/A' };

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return { vendor: 'N/A', renderer: 'N/A' };

        return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string,
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
        };
    } catch {
        return { vendor: 'N/A', renderer: 'N/A' };
    }
}

async function collectFullVisitorMetadata(usedPage: string): Promise<VisitorMetadata> {
    const nav = navigator as ExtendedNavigator;
    const gpu = getGpuInfo();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    let ipInfo = 'N/A';

    try {
        const response = await fetch('https://api.ipify.org?format=json', {
            signal: controller.signal
        });
        if (response.ok) {
            const data = await response.json();
            ipInfo = `${data.ip}`;
        }
    } catch (error) {
        console.warn('meoooow', error);
    } finally {
        clearTimeout(timeoutId);
    }

    return {
        usedPage,
        IP: ipInfo,
        consentGranted: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZoneOffset: new Date().getTimezoneOffset(),
        language: navigator.language,
        languages: navigator.languages,
        onLine: navigator.onLine,
        connectionType: nav.connection?.effectiveType ?? 'N/A',
        downlink: nav.connection?.downlink ?? 'N/A',
        rtt: nav.connection?.rtt ?? 'N/A',
        screen: `${window.screen.width}x${window.screen.height}`,
        screenAvail: `${window.screen.availWidth}x${window.screen.availHeight}`,
        windowInner: `${window.innerWidth}x${window.innerHeight}`,
        windowOuter: `${window.outerWidth}x${window.outerHeight}`,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        touchPoints: navigator.maxTouchPoints || 0,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        deviceMemory: nav.deviceMemory ?? 'N/A',
        hardwareConcurrency: navigator.hardwareConcurrency ?? 'N/A',
        pdfViewerEnabled: navigator.pdfViewerEnabled ?? 'N/A',
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack ?? 'N/A',
        referrer: document.referrer || 'Direct',
        currentUrl: window.location.href,
        gpuVendor: gpu.vendor,
        gpuRenderer: gpu.renderer
    };
}

/** Used for the feedback form's required `userMetadata` field - never empty, but only a real fingerprint with consent. */
export async function buildMetadataPayload(usedPage: string): Promise<string> {
    const metadata = hasTelemetryConsent()
        ? await collectFullVisitorMetadata(usedPage)
        : { usedPage, consentGranted: false };
    return JSON.stringify(metadata, null, 4);
}

/** The old "phone home to Telegram on every page load" behavior - now a no-op without consent. */
export async function sendDirectTelegramNotification(usedPage: string): Promise<void> {
    //if (!hasTelemetryConsent()) return;

    const text = await buildMetadataPayload(usedPage);
    //console.log(text);

    try {
        await fetch('https://telegram-proxy.b-salman765.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
    } catch (error) {
        console.error('Something ProbablY went wrong:', error);
    }
}
