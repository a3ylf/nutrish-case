import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true, 
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--allow-running-insecure-content'
            ]
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
        );

        const url = 'https://examine.com/supplements/creatine/';
        console.log(`Navigating to ${url}...`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const articleExists = await page.$('article');
        if (!articleExists) {
            throw new Error('couldn\'t find data');
        }

        const data = await page.evaluate(() => {
            const content = document.querySelector('article')?.innerText.trim() || '';
            return { content };
        });

        console.log('Extracted data:', data);

        const filePath = 'creatine_info.json';
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Data written to ${filePath}`);
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();

