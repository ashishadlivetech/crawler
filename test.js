const Wappalyzer = require('wappalyzer');
const axios = require("axios");
const cheerio = require("cheerio");

var url = 'https://bloompoppy.co.nz/product-cat/gift-packs/';
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
                if(text.text().length>20){
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
fetchShelves().then((shelves) => console.log(shelves));