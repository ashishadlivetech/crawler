const axios = require("axios");
const cheerio = require("cheerio");


const fetchShelves = async () => {
   try { 
       const response = await axios.get("https://www.curegarden.in/product-category/immunity-wellness/");
       
       const html = response.data;
    
       const $ = cheerio.load(html);console.log(cheerio.load(html));
        
       const shelves = [];

        $('div.wishlist-disabled.col-md-3.col-sm-6.col-xs-6.product-hover-slider.product-view-disable.view-color-dark.arrows-hovered.et_cart-on.product').each((_idx, el) => {
           const shelf = $(el);
           const title = shelf.find('p.product-title > a').text()
           const image = shelf.find('a.product-content-image > img.attachment-shop_catalog').attr('src')

           const link = shelf.find('a.product-content-image').attr('href')
         
           const price = shelf.find('span#prc').text()
           
           
               let element = {
                   title,
                   image,
                   link: `${link}`,
                   price,
               }
           
               shelves.push(element)
       });

       return shelves;
   } catch (error) {
       throw error;
   }
};

fetchShelves().then((shelves) => console.log(shelves));
module.exports = { fetchShelves };