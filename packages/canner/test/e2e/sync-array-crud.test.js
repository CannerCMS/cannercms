const puppeteer = require('puppeteer');

let browser;
let page;
jest.setTimeout(60000);

describe('on page load', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 0,
    });
    page = (await browser.pages())[0];
    await page.goto('http://localhost:8080/demo/products');
    await page.waitForSelector('div[data-testid="products"]');
    // reset localStorage
    await page.evaluate(() => { localStorage.clear(); });
    await page.setViewport({
      width: 900,
      height: 800,
    });
  });

  afterAll(() => {
    browser.close();
  });

  test('should render products with table', async () => {
    const trLength = await page.$$eval('div[data-testid="products"] table tr', trs => trs.length);
    // should be 10 products at least, and antd will render more tr for style reasons
    expect(trLength).toBeGreaterThan(10);
  });

  test('should change route when click first edit button', async () => {
    await clickAndWait(page, 'button[data-testid="edit-button"]');
    await page.waitForSelector('div[data-testid="products/no"]');
    expect(page.url()).toBe('http://localhost:8080/demo/products/products1');
  });

  test('should navigate and remove changes after reset', async () => {
    await goToProduct(page);
    const previousValue = await getProduct1(page);
    await updateProduct1(page, {
      no: 'number',
      name: 'name',
      price: '1000',
      promo: '800',
    });
    // click reset
    await clickAndWait(page, 'button[data-testid="reset-button"]');
    expect(page.url()).toBe('http://localhost:8080/demo/products');

    // re-reneter products1
    await goToProduct(page);
    const productValue = await getProduct1(page);
    expect(productValue).toMatchObject(previousValue);
  });

  test('should navigate and deploy changes after deplot', async () => {
    await goToProduct(page);
    const previousValue = await getProduct1(page);
    await updateProduct1(page, {
      no: 'number',
      name: 'name',
      price: '1000',
      promo: '800',
    });
    // click reset
    await clickAndWait(page, 'button[data-testid="confirm-button"]');
    expect(page.url()).toBe('http://localhost:8080/demo/products');

    // re-reneter products1
    await goToProduct(page);
    const productValue = await getProduct1(page);
    expect(productValue).toMatchObject({
      no: `${previousValue.no}number`,
      name: `${previousValue.name}name`,
      price: `${previousValue.price}1000`,
      promo: `${previousValue.promo}800`,
    });
  });

  test('should delete item', async () => {
    await goToProductList(page);
    const originTrLength = await page.$$eval('div[data-testid="products"] table tr', trs => trs.length);
    await deleteProduct(page);
    const hasDeleted = await page.waitFor(trLength => document.querySelectorAll('div[data-testid="products"] table tr').length < trLength, {}, originTrLength);
    expect(hasDeleted).toBeTruthy();
  });

  test('should create item', async () => {
    await goToProductList(page);
    await deleteProduct(page);
    const originTrLength = await page.$$eval('div[data-testid="products"] table tr', trs => trs.length);
    await clickAndWait(page, 'button[data-testid="add-button"]');
    await page.waitForSelector('div[data-testid="products/no"]');
    await updateProduct1(page, {
      no: 'number',
      name: 'name',
      price: '1000',
      promo: '800',
    });
    await clickAndWait(page, 'button[data-testid="confirm-button"]');
    await page.waitForSelector('div[data-testid="products"]');
    const hasCreated = await page.waitFor(trLength => document.querySelectorAll('div[data-testid="products"] table tr').length > trLength, {}, originTrLength);
    expect(hasCreated).toBeTruthy();
  });
});

async function getProduct1(page) {
  return await page.evaluate(() => ({
    no: document.querySelector('div[data-testid="products/no"] input').value,
    name: document.querySelector('div[data-testid="products/name"] input').value,
    price: document.querySelector('div[data-testid="products/price"] input').value,
    promo: document.querySelector('div[data-testid="products/promo"] input').value,
  }));
}

async function updateProduct1(page, value) {
  await page.type('div[data-testid="products/no"] input', value.no);
  await page.type('div[data-testid="products/name"] input', value.name);
  await page.type('div[data-testid="products/price"] input', value.price);
  await page.type('div[data-testid="products/promo"] input', value.promo);
}

async function deleteProduct(page) {
  page.click('button[data-testid="delete-button"]');
  await page.waitForSelector('div.ant-popover-buttons');
  await page.evaluate(() => document.querySelector('div.ant-popover-buttons button.ant-btn-danger').click());
}

async function clickAndWait(page, selector) {
  return await Promise.all([
    page.waitForNavigation(),
    page.click(selector),
  ]);
}

async function goToProductList(page) {
  await page.goto('http://localhost:8080/demo/products');
  await page.waitForSelector('div[data-testid="products"]');
}

async function goToProduct(page) {
  await page.goto('http://localhost:8080/demo/products/products1');
  await page.waitForSelector('div[data-testid="products/no"]');
}
