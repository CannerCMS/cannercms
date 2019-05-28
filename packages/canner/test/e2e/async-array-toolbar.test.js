const puppeteer = require('puppeteer');
const { testIdSelector } = require('./utils');

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
    await page.goto('http://localhost:8080/demo/customers');
    await page.waitForSelector(testIdSelector('customers'));
    // reset localStorage
    await page.setViewport({
      width: 900,
      height: 800,
    });
  });

  afterAll(() => {
    browser.close();
  });

  test('should filter only one customers', async () => {
    const rowLength = await page.$$eval(testIdSelector('edit-button'), buttons => buttons.length);

    // get data from localStorage
    const firstCustomer = await getCustomerFromIndex(page, 0);

    // add filter
    await addCustomerNameFilter(page, firstCustomer.name);

    // wait until tr length is less than origin
    await page.waitFor((rowLength, selector) => document.querySelectorAll(selector).length < rowLength, { timeout: 5000 }, rowLength, testIdSelector('edit-button'));

    const currentRowLength = await page.$$eval(testIdSelector('edit-button'), buttons => buttons.length);

    expect(currentRowLength).toBe(1);
  });

  test('should persist query after click BACK to list', async () => {
    await page.goto('http://localhost:8080/demo/customers');
    await page.waitForSelector(testIdSelector('customers'));
    const rowLength = await page.$$eval(testIdSelector('edit-button'), buttons => buttons.length);

    const firstCustomer = await getCustomerFromIndex(page, 0);
    // add filter
    await addCustomerNameFilter(page, firstCustomer.name);

    // wait until rowLength is less than origin
    await page.waitFor((rowLength, selector) => document.querySelectorAll(selector).length < rowLength, { timeout: 5000 }, rowLength, testIdSelector('edit-button'));

    // entering first customer
    await clickAndWait(page, testIdSelector('edit-button'), testIdSelector('back-button'));

    // [BACK BUTTON] click back button to customer list and the rowLength should be 1 the text filter should exist
    await clickAndWait(page, testIdSelector('back-button'), testIdSelector('edit-button'));
    expect(await page.$$eval(testIdSelector('edit-button'), buttons => buttons.length)).toBe(1);
  });

  test('should persist query after RESET to list', async () => {
    await page.goto('http://localhost:8080/demo/customers');
    await page.waitForSelector(testIdSelector('customers'));
    const rowLength = await page.$$eval(testIdSelector('edit-button'), buttons => buttons.length);

    const firstCustomer = await getCustomerFromIndex(page, 0);
    // add filter
    await addCustomerNameFilter(page, firstCustomer.name);
    // wait until rowLength is less than origin
    await page.waitFor((rowLength, selector) => document.querySelectorAll(selector).length < rowLength, { timeout: 5000 }, rowLength, testIdSelector('edit-button'));

    // entering first customer
    await clickAndWait(page, testIdSelector('edit-button'), testIdSelector('reset-button'));

    // [RESET BUTTON] click reset to customer list and the rowLength should be 1
    await clickAndWait(page, testIdSelector('reset-button'), testIdSelector('edit-button'));
    expect(await page.$$eval(testIdSelector('edit-button'), buttons => buttons.length)).toBe(1);
  });

  test('should persist query after click confirm to list', async () => {
    await page.goto('http://localhost:8080/demo/customers');
    await page.waitForSelector(testIdSelector('customers'));
    const rowLength = await page.$$eval(testIdSelector('edit-button'), buttons => buttons.length);

    const firstCustomer = await getCustomerFromIndex(page, 0);
    // add filter
    await addCustomerNameFilter(page, firstCustomer.name);

    // wait until rowLength is less than origin
    await page.waitFor((rowLength, selector) => document.querySelectorAll(selector).length < rowLength, { timeout: 5000 }, rowLength, testIdSelector('edit-button'));

    // entering first customer
    await clickAndWait(page, testIdSelector('edit-button'), testIdSelector('customers/name'));

    // update customer name
    await page.type(testIdSelector('customers/name'), 'hi', { delay: 100 });

    // [CONFIRM BUTTON] click confirm to customer list and the rowLength should be 1
    await clickAndWait(page, testIdSelector('confirm-button'), testIdSelector('edit-button'));
    expect(await page.$$eval(testIdSelector('edit-button'), buttons => buttons.length)).toBe(1);
  });

  test('should fetch origin data after remove filter', async () => {
    await page.goto('http://localhost:8080/demo/customers');
    await page.waitForSelector(testIdSelector('customers'));
    const trLength = await page.$$eval('div[data-testid="customers"] table tr', trs => trs.length);

    // add filter
    page.hover(testIdSelector('actions-filter-button'));
    await page.waitForSelector(testIdSelector('actions-filter-dropdown-menu-0'));
    page.click(testIdSelector('actions-filter-dropdown-menu-0'));
    await page.waitForSelector(testIdSelector('text-filter-0'));
    page.type(testIdSelector('text-filter-0'), 'FILTER_STRING', { delay: 100 });

    // remove filter
    page.click(testIdSelector('filter-0-delete-icon'));

    // wait until tr length is same as origin
    const getOriginData = await page.waitFor(trLength => document.querySelectorAll('div[data-testid="customers"] table tr').length === trLength, { timeout: 5000 }, trLength);
    expect(getOriginData).toBeTruthy();
  });
});


async function addCustomerNameFilter(page, name) {
  // add filter
  page.hover(testIdSelector('actions-filter-button'));
  await page.waitForSelector(testIdSelector('actions-filter-dropdown-menu-0'));
  page.click(testIdSelector('actions-filter-dropdown-menu-0'));
  await page.waitForSelector(testIdSelector('text-filter-0'));
  page.type(testIdSelector('text-filter-0'), name, { delay: 100 });
}

async function getCustomerFromIndex(page, index) {
  // get data from localStorage
  return await page.evaluate(index => JSON.parse(localStorage.getItem('cannerDEMO')).customers[index], index);
}

async function clickAndWait(page, buttonId, selector) {
  await page.waitFor(500);
  return await Promise.all([
    page.waitForNavigation(),
    page.waitForSelector(selector),
    page.click(buttonId),
  ]);
}
