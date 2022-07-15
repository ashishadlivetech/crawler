const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rp = require('request-promise');
const axios = require("axios");
const cheerio = require("cheerio");
var url = '';
require('dotenv').config();
const port = process.env.PORT;


app.use(express.static(__dirname));


app.use(bodyParser.urlencoded({ extended: true }))

const fetchShelve = async () => {
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
            let description = '';
            des.each(function (item, index) {
                const text = $(index);
                if(text.text().length > 20){
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

app.listen(port, () => {
  console.log("Application started and Listening on port"+ port);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  url = req.body.url;
  rp(url)
  .then(function(html){ 
    if(html.includes('wp-admin')){
      res.send('Provided Url related with Wordpress Please  <a href="woocommerce">click here</a> for check Woocommerce');
    }
  })
  .catch(function(err){
    res.send('Your Url not related with Wordpress Please  <a href="/">click here</a>');
  });
});

app.get("/woocommerce", (req, res) => {
  rp(url)
  .then(function(html){ 
    if(html.includes('woocommerce')){
      res.send('Provided Url related with Woocommerce Please check here for get all data <a href="details">first here</a>');
    }
  })
  .catch(function(err){
    res.send('Your Url not related with woocommerce Please click here <a href="/">first here</a>');
  });
});

app.get("/details", (req, res) => {
  if(!url){
    res.send('Please provide url <a href="/">first here</a>');
  }else{
    fetchShelve().then((shelves) => res.send(shelves));
  }
  
});


