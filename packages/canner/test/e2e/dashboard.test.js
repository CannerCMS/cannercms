const puppeteer = require('puppeteer')

let browser;
let page;
jest.setTimeout(30000);

describe('on page load', () => {
  beforeAll(async () => { 
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 0,
      devtools: true,
    }) 
    page = (await browser.pages())[0];
    await page.goto('http://localhost:8080/');
    await page.waitForSelector('div[data-testid="dashboard"]');
    page.setViewport({ width: 900, height: 800 })
  });
  
  afterAll(() => {
    browser.close();
  })
  
  test('should render dashboard', async () => {
    const dom = await page.$('div[data-testid="dashboard/banner"]');
    const dom1 = await page.$('[data-testid="dashboard/last7days-visitor-indicator"]');
    const dom2 = await page.$('[data-testid="dashboard/last6month-orders-indicator"]');
    const dom3 = await page.$('[data-testid="dashboard/victory-online-visitors"]');
    const dom4 = await page.$('[data-testid="dashboard/victory-offline-visitor"]');
    const dom5 = await page.$('[data-testid="dashboard/victory-offline-online-visitors"]');
    const dom6 = await page.$('[data-testid="dashboard/sales-online-bar"]');
    const dom7 = await page.$('[data-testid="dashboard/sales-offline-bar"]');
    const dom8 = await page.$('[data-testid="dashboard/sales-offline-online-stack-bar"]');
    expect(dom).not.toBeNull();
    expect(dom1).not.toBeNull();
    expect(dom2).not.toBeNull();
    expect(dom3).not.toBeNull();
    expect(dom4).not.toBeNull();
    expect(dom5).not.toBeNull();
    expect(dom6).not.toBeNull();
    expect(dom7).not.toBeNull();
    expect(dom8).not.toBeNull();
  });
})