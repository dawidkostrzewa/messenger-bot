import dotenv from 'dotenv';
dotenv.config();

import puppeteer from 'puppeteer';
const email = process.env.PUPPETEER_EMAIL;
const password = process.env.PUPPETEER_PASSWORD;
const conversationUrl = process.env.PUPPETEER_CONVERSATION_URL;

async function main(emailArg: string, passwordArg: string, conversationUrlArg: string) {
    const browser = await puppeteer.launch({
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto('https://messenger.com');

    await page.click('button[data-testid=cookie-policy-dialog-accept-button]');
    await page.click('#close');

    await page.waitForSelector('#email');
    await page.type('input[id=email]', emailArg);
    await page.type('input[id=pass]', passwordArg);

    await page.waitForSelector('#loginbutton');

    await Promise.all([page.click('#loginbutton'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);
    await page.goto(conversationUrlArg);

    await page.waitForSelector("div[aria-label='Napisz wiadomość']");
    await page.type("div[aria-label='Napisz wiadomość']", 'Hello World! :) ');

    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await browser.close();
}

main(email, password, conversationUrl);
