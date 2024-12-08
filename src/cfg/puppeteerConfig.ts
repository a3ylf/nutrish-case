import chromium from '@sparticuz/chromium';

export const puppeteerConfig = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--allow-running-insecure-content'
    ],
    executablePath: chromium.executablePath(),
    setCacheEnabled: true,
    setRequestInterception: true,
    blockedDomains: ['google-analytics.com', 'doubleclick.net', 'ads']
};

