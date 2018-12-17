const puppeteer = require('puppeteer')

let browser;
let page;
jest.setTimeout(60000);

describe('on page load', () => {
  beforeAll(async () => { 
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 0
    }) 
    page = (await browser.pages())[0]
    await page.goto('http://localhost:8080/demo/products');
    await page.waitForSelector('div[data-testid="products"]');
    // reset localStorage
    await page.evaluate(() => { localStorage.clear(); });
    await page.setViewport({
      width: 900,
      height: 800
    })
  });
  
  afterAll(() => {
    browser.close();
  })
  
  test('should render products with table', async () => {
    const trLength = await page.$$eval('div[data-testid="products"] table tr', trs => trs.length);
    // should be 10 products at least, and antd will render more tr for style reasons
    expect(trLength).toBeGreaterThan(10);
  });

  test('should change route when click first edit button', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[data-testid="edit-button"]')
    ]);
    await page.waitForSelector('div[data-testid="products/no"]'),
    expect(page.url()).toBe('http://localhost:8080/demo/products/products1');
  });

  test('should navigate and remove changes after reset', async () => {
    await page.goto('http://localhost:8080/demo/products/products1');
    await page.waitForSelector('div[data-testid="products/no"]');
    const previousValue = await getProduct1(page);
    await page.type('div[data-testid="products/no"] input', 'number');
    await page.type('div[data-testid="products/name"] input', 'name');
    await page.type('div[data-testid="products/price"] input', '1000');
    await page.type('div[data-testid="products/promo"] input', '800');

    // click reset
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[data-testid="reset-button"]')
    ]);
    expect(page.url()).toBe('http://localhost:8080/demo/products');

    // re-reneter products1
    await page.goto('http://localhost:8080/demo/products/products1');
    await page.waitForSelector('div[data-testid="products/no"]');
    const productValue = await getProduct1(page);
    expect(productValue).toMatchObject(previousValue)
  });

  test('should navigate and deploy changes after deplot', async () => {
    await page.goto('http://localhost:8080/demo/products/products1');
    await page.waitForSelector('div[data-testid="products/no"]');
    const previousValue = await getProduct1(page);
    await page.type('div[data-testid="products/no"] input', 'number');
    await page.type('div[data-testid="products/name"] input', 'name');
    await page.type('div[data-testid="products/price"] input', '1000');
    await page.type('div[data-testid="products/promo"] input', '800');

    // click reset
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[data-testid="confirm-button"]')
    ]);
    expect(page.url()).toBe('http://localhost:8080/demo/products');

    // re-reneter products1
    await page.goto('http://localhost:8080/demo/products/products1');
    await page.waitForSelector('div[data-testid="products/no"]');
    const productValue = await getProduct1(page);
    expect(productValue).toMatchObject({
      no: `${previousValue.no}number`,
      name: `${previousValue.name}name`,
      price: `${previousValue.price}1000`,
      promo: `${previousValue.promo}800`
    })
  });

  test('should delete item', async () => {
    await page.goto('http://localhost:8080/demo/products');
    await page.waitForSelector('button[data-testid="delete-button"]');
    page.click('button[data-testid="delete-button"]');
    await page.waitForSelector('div.ant-popover-buttons');
    const originTrLength = await page.$$eval('div[data-testid="products"] table tr', trs => trs.length);
    await page.evaluate(() => document.querySelector('div.ant-popover-buttons button.ant-btn-danger').click())
    const hasDeleted = await page.waitFor(trLength => {
      return document.querySelectorAll('div[data-testid="products"] table tr').length < trLength;
    }, {}, originTrLength);
    expect(hasDeleted).toBeTruthy();
  });

  test('should create item', async () => {
    await page.waitForSelector('button[data-testid="delete-button"]');
    page.click('button[data-testid="delete-button"]');
    await page.waitForSelector('div.ant-popover-buttons');
    await page.evaluate(() => document.querySelector('div.ant-popover-buttons button.ant-btn-danger').click())
    const originTrLength = await page.$$eval('div[data-testid="products"] table tr', trs => trs.length);
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[data-testid="add-button"]')
    ])
    await page.waitForSelector('div[data-testid="products/no"]');
    await page.type('div[data-testid="products/no"] input', 'number');
    await page.type('div[data-testid="products/name"] input', 'name');
    await page.type('div[data-testid="products/price"] input', '1000');
    await page.type('div[data-testid="products/promo"] input', '800');
    await Promise.all([
      page.waitForNavigation(),
      await page.click('button[data-testid="confirm-button"]')
    ])
    await page.waitForSelector('div[data-testid="products"]');
    const hasCreated = await page.waitFor(trLength => {
      return document.querySelectorAll('div[data-testid="products"] table tr').length > trLength;
    }, {}, originTrLength);
    expect(hasCreated).toBeTruthy();
  });
})

async function getProduct1(page) {
  return await page.evaluate(() => {
    return {
      no: document.querySelector('div[data-testid="products/no"] input').value,
      name: document.querySelector('div[data-testid="products/name"] input').value,
      price: document.querySelector('div[data-testid="products/price"] input').value,
      promo: document.querySelector('div[data-testid="products/promo"] input').value,
    }
  });
}