const Wappalyzer = require('wappalyzer');
const axios = require("axios");
const cheerio = require("cheerio");

const url = 'https://agourmetpet.com/';
// const url = 'https://codingshiksha.com/';

const options = {
  debug: false,
  delay: 500,
  headers: {},
  maxDepth: 3,
  maxUrls: 10,
  maxWait: 10000,
  recursive: true,
  probe: true,
  proxy: false,
  userAgent: 'Wappalyzer',
  htmlMaxCols: 2000,
  htmlMaxRows: 2000,
  noScripts: false,
  noRedirect: false,
};

const wappalyzer = new Wappalyzer(options)

;(async function() {
  try {
    await wappalyzer.init()

    // Optionally set additional request headers
    const headers = {}

    const site = await wappalyzer.open(url, headers)

    // Optionally capture and output errors
    site.on('error', console.error)

    const results = await site.analyze()
    if(results.technologies[4]){
        if(results.technologies[4].slug == 'woocommerce'){
          console.log(results.technologies[4].slug);
        }else{
            console.log("Provided Link not related to woocommerce");
        }
    }else{
      console.log("Provided Link not related to woocommerce");
    }
  } catch (error) {
    console.error(error)
  }

  await wappalyzer.destroy()
  // fetchShelves().then((shelves) => console.log(shelves));
})()
const fetchShelves = async () => {
  try { 
      const response = await axios.get(url);
              
      const html = response.data;
      
      const $ = cheerio.load(html);

      const shelves = [];

          $('.product.type-product').each((_idx, el) => {
          const shelf = $(el);
          const image = shelf.find('img').attr('src');
          

          var price = shelf.find('p > span').text();
              if(!price){
                  var price = shelf.find('.price').text();
              }
          var link = shelf.find('a').attr('href');    
          link = link.substring(0, link.length - 1);
          const title = link.substring(link.lastIndexOf('/') + 1);
          var des = shelf.find('p');
          var description = '';
          des.each(function (item, index) {
              const text = $(index);
              if(text.text().length>10){
                  description = text.text();
              }
          });
          var meta = shelf.find('.product_meta >span').text();
             let element = {
                  title,
                  image,
                  link: `${link}`,
                  price,
                  description,
                  meta,
              }
          
              shelves.push(element)
      });

      return shelves;
  } catch (error) {
      throw error;
  }
};