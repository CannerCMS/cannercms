const puppeteer = require('puppeteer')
const {testIdSelector} = require('./utils');

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
    await page.goto('http://localhost:8080/demo/customers');
    await page.waitForSelector(testIdSelector('customers'));
    // reset localStorage
    await page.setViewport({
      width: 900,
      height: 800
    })
  });
  
  afterAll(() => {
    browser.close();
  })
  
  test('should filter only one customers', async () => {
    const trLength = await page.$$eval('div[data-testid="customers"] table tr', trs => trs.length);
    
    // get data from localStorage
    const firstCustomer = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('cannerDEMO')).customers[0]
    });
    
    // add filter
    page.hover(testIdSelector('actions-filter-button'));
    await page.waitForSelector(testIdSelector('actions-filter-dropdown-menu-0'));
    page.click(testIdSelector('actions-filter-dropdown-menu-0'));
    await page.waitForSelector(testIdSelector('text-filter-0'));
    page.type(testIdSelector('text-filter-0'), firstCustomer.name);
    
    // wait until tr length is less than origin
    const hasFiltered = await page.waitFor(trLength => {
      return document.querySelectorAll('div[data-testid="customers"] table tr').length < trLength;
    }, {timeout: 5000}, trLength);
    
    expect(hasFiltered).toBeTruthy();
  });

  test('should fetch origin data after remove filter', async () => {
    const trLength = await page.$$eval('div[data-testid="customers"] table tr', trs => trs.length);

    // add filter
    page.hover(testIdSelector('actions-filter-button'));
    await page.waitForSelector(testIdSelector('actions-filter-dropdown-menu-0'));
    page.click(testIdSelector('actions-filter-dropdown-menu-0'));
    await page.waitForSelector(testIdSelector('text-filter-0'));
    page.type(testIdSelector('text-filter-0'), 'FILTER_STRING');

    // remove filter
    page.click(testIdSelector('filter-0-delete-icon'));

    // wait until tr length is same as origin
    const getOriginData = await page.waitFor(trLength => {
      return document.querySelectorAll('div[data-testid="customers"] table tr').length === trLength;
    }, {timeout: 5000}, trLength);
    expect(getOriginData).toBeTruthy();
  });
});
