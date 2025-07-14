//Singleton con la instancia del navegador que esta haciendo scrapping

import { Browser, chromium, Page } from "playwright";

export class MScrapper {
    private static instance: MScrapper | null = null;
    private browser: Browser;
    public currentPage: Page;

    private constructor(browser: Browser, page: Page) {
        this.browser = browser;
        this.currentPage = page;
    }

    public static async getInstance(): Promise<MScrapper> {
        if (!MScrapper.instance) {
            const browser = await chromium.launch({ headless: false });
            const page = await browser.newPage();
            MScrapper.instance = new MScrapper(browser, page);
        }
        return MScrapper.instance;
    }

    public async goToPage(url: string) {
        await this.currentPage.goto(url);
    }

    public async fillInput(selector: string, value: string) {
        await this.currentPage.fill(selector, value).catch(err => console.log('Error filling the input', err));
        return await this.currentPage.inputValue(selector);
    }

    public async clickButton(selector: string) {
        if(await this.currentPage.isVisible(selector)){
            await this.currentPage.click(selector).catch(err => console.log('Error clicking the button', err));
        }
    }

    public async closeBrowser() {
        await this.browser.close();
        MScrapper.instance = null;
    }

    public async downloadFile(url: string) {
        await this.currentPage.goto(url);
        await this.currentPage.click('a[href="/download"]');
    }

    public async changeSelect(selector: string, value: string) {
        await this.currentPage.selectOption(selector, value);
    }

    public async getText(selector: string) {
        return await this.currentPage.textContent(selector);
    }
    
   
}