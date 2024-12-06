const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--start-maximized',
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--allow-running-insecure-content'
        ],
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
    );

    // Navegar para a página de creatina
    await page.goto('https://examine.com/supplements/creatine/', { waitUntil: 'networkidle2' });

    // Extraindo informações principais
    const data = await page.evaluate(() => {
        const content = document.querySelector('article').innerText; // Obtém o texto do artigo principal
        const sections = Array.from(document.querySelectorAll('h2, h3, p')).map(el => ({
            tag: el.tagName,
            text: el.innerText.trim()
        }));
        return { content, sections };
    });

    // Exibindo os dados extraídos
    console.log(data);

    // Salvando em arquivo JSON
    fs.writeFile('creatine_info.json', JSON.stringify(data, null, 2), err => {
        if (err) throw err;
        console.log('Data written to file');
    });

    await browser.close();
})();

