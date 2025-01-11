const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://ib.bancobai.ao/retail/#');

  await page.setViewport({width: 1080, height: 1024});

  await page.type('.devsite-search-field', 'automate beyond recorder');

  await page.waitForSelector('.devsite-result-item-link');
  await page.click('.devsite-result-item-link');

  await page.waitForSelector('h1');

  const fullTitle = await page.$eval('h1', el => el.textContent);

  console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
})();
