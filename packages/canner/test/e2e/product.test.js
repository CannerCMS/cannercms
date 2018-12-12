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
    page = await browser.newPage() 
    await page.goto('http://localhost:8080/demo/products');
    await page.waitForSelector('div[data-testid="products"]');
    // reset localStorage
    await page.evaluate(() => { localStorage.clear(); });
    page.setViewport({ width: 500, height: 2400 })

  });
  
  afterAll(() => {
    browser.close();
  })
  
  test('should render products with table', async () => {
    const trLength = await page.$$eval('div[data-testid="products"] table tr', trs => trs.length);
    // should be 10 products at least, and antd will render more tr for style reasons
    expect(trLength).toBeGreaterThan(10);
  });
})