import puppeteer from 'puppeteer';
import fs from 'fs';

async function fetchExamineData(type, query) {
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

        const url = `https://examine.com/${type}/${query.toLowerCase()}/`;
        console.log(`Navigating to ${url}...`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const articleExists = await page.$('article');
        if (!articleExists) {
            throw new Error(`Couldn't find data for type "${type}" and query "${query}"`);
        }

        const data = await page.evaluate(() => {
            const content = document.querySelector('article')?.innerText.trim() || '';
            return { content };
        });

        const paragraphs = data.content.split('\n\n').filter(paragraph => {
            return paragraph.length >= 100 && paragraph.length <= 1000; // filters meaningless comments
        });

        console.log(`Extracted ${paragraphs.length} valid sections.`);

        const filteredData = {
            query,
            type,
            sections: paragraphs
        };

        console.log('Filtered Data:', filteredData);

        const filePath = `${query.toLowerCase()}_filtered_info.json`;
        fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2));
        console.log(`Data written to ${filePath}`);

        return filteredData;
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

(async () => {
    const type = 'supplements'; // Tipo a ser pesquisado
    const query = 'creatine'; // Produto a ser pesquisado
    try {
        const data = await fetchExamineData(type, query);
        console.log('Final Data:', data);
    } catch (error) {
        console.error('Failed to fetch data:', error.message);
    }
})();

