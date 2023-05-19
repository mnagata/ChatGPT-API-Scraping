import iconv from 'iconv-lite';
import puppeteer from 'puppeteer';

export const getContent = async (url: string): Promise<string> => {
    const browser = await puppeteer.launch({
        headless: 'new',
        channel: 'chrome',
        pipe: true
    });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(url);

    const content = await page.content();
    const encoding = await page.evaluate(() => {
        return document.characterSet;
    });

    const encodeontent = iconv.encode(content, encoding);
    
    await page.close();
    await browser.close();

    return encodeontent.toString();
};
