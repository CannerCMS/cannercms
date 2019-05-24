const puppeteer = require('puppeteer');
const faker = require('faker');

let browser;
let page;
jest.setTimeout(60000);

describe('async array crud', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 0,
    });
    page = (await browser.pages())[0];
    await page.goto('http://localhost:8080/demo/customers');
    await page.waitForSelector('div[data-testid="customers"]');
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

  test('should render customers with table', async () => {
    const trLength = await page.$$eval('div[data-testid="customers"] table tr', trs => trs.length);
    // should be 10 customers at least, and antd will render more tr for style reasons
    expect(trLength).toBeGreaterThan(10);
  });

  test('should change route when click first edit button', async () => {
    await clickAndWait(page, 'button[data-testid="edit-button"]');
    await page.waitForSelector('div[data-testid="customers/name"]');
    expect(page.url()).toBe('http://localhost:8080/demo/customers/customers1');
  });

  test('should navigate and remove changes after reset', async () => {
    // update product
    await goToProduct(page);
    const previousValue = await getProductValue(page);
    const updateValue = createUpdateValue();
    await updateProduct1(page, updateValue);

    // click reset
    await clickAndWait(page, 'button[data-testid="reset-button"]');
    expect(page.url()).toBe('http://localhost:8080/demo/customers');

    // re-reneter customers1 and check value
    await goToProduct(page);
    const productValue = await getProductValue(page);
    expect(productValue).toMatchObject(previousValue);
  });

  test('should navigate and deploy changes after deploy', async () => {
    // update product
    await goToProduct(page);
    const previousValue = await getProductValue(page);
    const updateValue = createUpdateValue();
    await updateProduct1(page, updateValue);

    // click confirm
    await clickAndWait(page, 'button[data-testid="confirm-button"]');
    expect(page.url()).toBe('http://localhost:8080/demo/customers');

    // re-reneter customers1 and check value
    await goToProduct(page);
    const productValue = await getProductValue(page);
    expect(productValue).toMatchObject({
      name: `${previousValue.name}${updateValue.name}`,
      email: `${previousValue.email}${updateValue.email}`,
      phone: `${previousValue.phone}${updateValue.phone}`,
    });
  });

  test('should delete item', async () => {
    // get origin customers
    await goToProductList(page);
    const customers = await page.evaluate(() => JSON.parse(localStorage.getItem('cannerDEMO')).customers);
    // delete item
    await deleteProduct(page);
    // check customers size
    await page.waitFor(length => JSON.parse(localStorage.getItem('cannerDEMO')).customers.length < length, { timeout: 5000 }, customers.length);
    const newCustomersLength = await page.evaluate(() => JSON.parse(localStorage.getItem('cannerDEMO')).customers.length);
    expect(newCustomersLength).toBe(customers.length - 1);
  });

  test('should create item', async () => {
    // get origin customers
    await goToProductList(page);
    const customers = await page.evaluate(() => JSON.parse(localStorage.getItem('cannerDEMO')).customers);

    // create item
    await clickAndWait(page, 'button[data-testid="add-button"]');
    await page.waitForSelector('div[data-testid="customers/name"]');
    const updateValue = createUpdateValue();
    await updateProduct1(page, updateValue);
    await clickAndWait(page, 'button[data-testid="confirm-button"]');
    await page.waitForSelector('div[data-testid="customers"]');

    // check customers size
    await page.waitFor(length => JSON.parse(localStorage.getItem('cannerDEMO')).customers.length > length, { timeout: 5000 }, customers.length);
    const newCustomersLength = await page.evaluate(() => JSON.parse(localStorage.getItem('cannerDEMO')).customers.length);
    expect(newCustomersLength).toBe(customers.length + 1);
  });
});

async function getProductValue(page) {
  return await page.evaluate(() => ({
    name: document.querySelector('div[data-testid="customers/name"] input').value,
    email: document.querySelector('div[data-testid="customers/email"] input').value,
    phone: document.querySelector('div[data-testid="customers/phone"] input').value,
  }));
}

async function updateProduct1(page, value) {
  await page.type('div[data-testid="customers/name"] input', value.name);
  await page.type('div[data-testid="customers/email"] input', value.email);
  await page.type('div[data-testid="customers/phone"] input', value.phone);
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
  await page.goto('http://localhost:8080/demo/customers');
  await page.waitForSelector('div[data-testid="customers"]');
}

async function goToProduct(page) {
  await page.goto('http://localhost:8080/demo/customers/customers1');
  await page.waitForSelector('div[data-testid="customers/name"]');
}

function createUpdateValue() {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
  };
}
