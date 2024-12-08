import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';

async function launchBrowser() {
    const executablePath = await chromium.executablePath();

    const puppeteerConfig = {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--allow-running-insecure-content',
        ],
        executablePath: executablePath,
        setCacheEnabled: true,
        setRequestInterception: true,
        blockedDomains: ['google-analytics.com', 'doubleclick.net', 'ads'],
    };

    const browser = await puppeteer.launch(puppeteerConfig);
    const page = await browser.newPage();
    await page.goto('https://example.com');
    console.log('Page loaded.');
    await browser.close();
}

launchBrowser().catch(error => console.error('Error launching browser:', error));

