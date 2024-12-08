export const puppeteerConfig = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--allow-running-insecure-content'
    ],
    executablePath: '/usr/bin/google-chrome',
    setCacheEnabled: true,
    setRequestInterception: true,
    blockedDomains: ['google-analytics.com', 'doubleclick.net', 'ads']
};

