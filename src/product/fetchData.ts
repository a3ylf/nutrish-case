import puppeteer from 'puppeteer-core';
import { puppeteerConfig } from '../cfg/puppeteerConfig';

// Function to fetch data from Examine.com
export async function fetchExamineData(type: string, query: string) {
    let browser;
    try {
        // Launching Puppeteer with the custom configuration (from puppeteerConfig)
        browser = await puppeteer.launch(puppeteerConfig);

        // Create a new page to interact with
        const page = await browser.newPage();

        // Setting a user agent to mimic a real browser
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
        );

        // Set cache and request interception configuration from puppeteerConfig
        await page.setCacheEnabled(puppeteerConfig.setCacheEnabled);
        await page.setRequestInterception(puppeteerConfig.setRequestInterception);

        // Intercept requests to block unnecessary resources like images, stylesheets, and ads
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            const url = request.url();

            // If it's an unwanted resource type or a domain from the blocked list, abort the request
            if (
                ['image', 'stylesheet', 'media', 'script'].includes(resourceType) ||
                puppeteerConfig.blockedDomains.some((domain) => url.includes(domain))
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });

        // Construct the URL based on the type and query
        const url = `https://examine.com/${type.toLowerCase()}/${query.toLowerCase()}/`;
        console.log(`Navigating to ${url}...`);

        // Navigate to the URL and wait for the page to load
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Check if the article exists on the page
        const articleExists = await page.$('article');
        if (!articleExists) {
            throw new Error(`Couldn't find data for type "${type}" and query "${query}"`);
        }

        // Extract the content from the article element
        const data = await page.evaluate(() => {
            const content = document.querySelector('article')?.innerText.trim() || '';
            return { content };
        });

        // Split the content into paragraphs based on '\n\n' and filter them based on length
        const paragraphs = data.content.split('\n\n').filter(paragraph => {
            // Filter out paragraphs that are too short or too long
            return paragraph.length >= 100 && paragraph.length <= 1000;
        });

        // Log how many valid sections were extracted
        console.log(`Extracted ${paragraphs.length} valid sections.`);

        // Return the filtered data (query, type, and sections of the content)
        const filteredData = {
            query,
            type,
            sections: paragraphs
        };

        // Return the filtered data to the caller
        return filteredData;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('An error occurred:', error.message);
            throw error; // Optionally re-throw the error
        } else {
            console.error('An unknown error occurred:', error);
            throw new Error('An unknown error occurred');
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

