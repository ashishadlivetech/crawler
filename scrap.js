var scraper = require('product-scraper');

scraper.init('https://www.amazon.com/gp/product/B00X4WHP5E/', function(data){
    console.log(data);
});