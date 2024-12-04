const configurePuppeteer = require('./configpup');

(async () => {
  const { browser, page } = await configurePuppeteer();

  try {
    await page.goto('https://example.com', { waitUntil: 'networkidle2' });

    const title = await page.title();
    console.log(`Title: ${title}`);

    await page.screenshot({ path: 'example.png' });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();   }
})();

