const puppeteer = require('puppeteer');
const sentry = require('@sentry/node');

sentry.init({
    dsn: 'https://ae4abb8184284190aacd6320443768f0@o406827.ingest.sentry.io/5662099',
    tracesSampleRate: 1.0,
});

(async () => {

    let url = [
        'https://www.amazon.com/dp/B073X8N1YW/',
        'https://www.amazon.com/dp/B08CD34NZH/',
        'https://www.amazon.com/dp/B07RF1XD36/',
        'https://www.amazon.com/dp/B081V6W99V/',
        'https://www.amazon.com/dp/B08FPL6S4Y',
        'https://www.amazon.com/dp/B07RZTZRW4/',
        'https://www.amazon.com/dp/B07HRV4G8T',
        'https://www.amazon.com/gp/product/B07YGZ7C1K',
        'https://www.amazon.com/dp/B086RRJ82R',
        'https://www.amazon.com/dp/B071ZZTNBM',
        'https://produto.mercadolivre.com.br/MLB-1755052648',
        'https://produto.mercadolivre.com.br/MLB-1646514760',
        'https://produto.mercadolivre.com.br/MLB-1603332712',
        'https://produto.mercadolivre.com.br/MLB-1311309012',
        'https://produto.mercadolivre.com.br/MLB-1209138017',
        'https://produto.mercadolivre.com.br/MLB-1336948810',
        'https://produto.mercadolivre.com.br/MLB-1501021852',
        'https://produto.mercadolivre.com.br/MLB-1441968323',
        'https://produto.mercadolivre.com.br/MLB-1631519713',
        'https://produto.mercadolivre.com.br/MLB-1481638721'
    ]
        
    for (let i = 0; i <= url.length; i++) {
        try {
            let browser = await puppeteer.launch({headless: true});
            let page = await browser.newPage();
            const options = {
                path: 'images/' + i.toString() + '.png',
                fullPage: true,
                omitBackground: true
            }
    
            await page.goto(url[i], {waitUntil: 'networkidle2'});
            await page.screenshot(options);
            let name;
            let description;
            let price;
            let available;
            let pictures;
            let urlProduto = url[i];
            let urlDom = urlProduto.includes('amazon')
            if(urlDom) {
                let data = await page.evaluate(() => {
    
                    name = document.querySelector('div[class="a-section a-spacing-none"] > h1').innerText;
                    description = document.querySelector('div[id="feature-bullets"] > ul').innerText;
                    price = document.querySelector('span[id="priceblock_ourprice"]') != null ? document.querySelector('span[id="priceblock_ourprice"]').innerText : 'Not available';
                    available = document.querySelector('div[id="availability"]') != null ? true : false;
                    pictures = (document.querySelector('div[id="altImages"] > ul').childElementCount - 3);

                    return {
                        name,
                        description,
                        price,
                        available,
                        pictures
                    }
                });

                try {
                    console.log(data);
                }
                catch(ex) {
                    sentry.captureException(ex);
                }
                
                await browser.close();
            }
            else {
                let data = await page.evaluate(() => {

                    name = document.querySelector('div[class="ui-pdp-header__title-container"] > h1').innerText;
                    description = document.querySelector('div[class="ui-pdp-description"] > p').innerText;
                    price = document.querySelector('div[class="ui-pdp-price__second-line"] > span') != null ? document.querySelector('div[class="ui-pdp-price__second-line"] > span').innerText : 'Not available';
                    available = document.querySelector('div[class="ui-pdp-stock-information"] > h3') != null ? true : false;
                    pictures = (document.querySelector('div[class="ui-pdp-gallery__column"]').childElementCount - 1) / 2;

                    return {
                        name,
                        description,
                        price,
                        available,
                        pictures
                    }                    
                });

                try {
                    console.log(data);
                }
                catch(ex) {
                    sentry.captureException(ex);
                }

                await browser.close();
            }
        }
        catch(e)
        {
            sentry.captureException(e);
        }
        
    }

})();