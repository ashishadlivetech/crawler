const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rp = require('request-promise');
const axios = require("axios");
const cheerio = require("cheerio");
var url = '';
var pagination =[];
var pageCheck =false;

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

require('dotenv').config();
const port = process.env.PORT;
app.set('view engine', 'ejs');

app.use(express.static(__dirname));


app.use(bodyParser.urlencoded({ extended: true }))

const fetchShelve = async () => {
    try { 
        const response = await axios.get(url);
                
        const html = response.data;
        
        const $ = cheerio.load(html);

        const shelves = [];
        if(!pageCheck){ 
        $('nav.woocommerce-pagination li a').each((ind,ancr) =>{
          var det = $(ancr);
          if(!pagination.includes(det.attr('href'))){
              pagination.push(det.attr('href'));
              pageCheck = true;
              localStorage.setItem('pagination', JSON.stringify(pagination));
              localStorage.setItem('pageCheck', JSON.stringify(pageCheck));
          }
        });
      }
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
    localStorage.removeItem('pagination');
    localStorage.removeItem('pageCheck');
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  url = req.body.url;
  rp(url)
  .then(function(html){ 
    if(html.includes('wp-admin')){
      res.send('<h2>Provided Url related with Wordpress Please  <a href="woocommerce">click here</a> for check Woocommerce</h2>');
    }
  })
  .catch(function(err){
    res.send('<h2>Your Url not related with Wordpress Please  <a href="/">click here</a></h2>');
  });
});

app.get("/woocommerce", (req, res) => {
  rp(url)
  .then(function(html){ 
    if(html.includes('woocommerce')){
      res.send('<h2>Provided Url related with Woocommerce Please check here for get all data <a href="details">click here</a></h2>');
    }
  })
  .catch(function(err){
    res.send('<h2>Your Url not related with woocommerce Please click here <a href="/">first here</a></h2>');
  });
});

app.get("/details", (req, res) => {
  if(!url){
    res.send('Please provide url <a href="/">first here</a>');
  }else{
    fetchShelve().then((shelves) => {
      res.render('next',{shelves,pagination});
  }); 
  }
});

app.get("/paginate/:urlindex", (req, res) => {
  var urlindex = req.params.urlindex;
  pagination = JSON.parse(localStorage.getItem('pagination'));
  url = pagination[urlindex];
  var pageCheck = JSON.parse(localStorage.getItem('pageCheck'));
fetchShelve().then((shelves) => {
// if(pagination.length>0){
  res.render('next',{shelves,pagination});res.end();
// }
});
});


