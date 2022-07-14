const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Wappalyzer = require('wappalyzer');
const axios = require("axios");
const cheerio = require("cheerio");
var url = '';
var crash= false;
var results;
require('dotenv').config();
const port = process.env.PORT;

const options = {
    debug: false,
    delay: 500,
    headers: {},
    maxDepth: 3,
    maxUrls: 10,
    maxWait: 80000, 
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
  

// server css as static
app.use(express.static(__dirname));

// get our app to use body parser 
app.use(bodyParser.urlencoded({ extended: true }))

const reqFilter = (req,res,next)=>{ 
    if((req.method == 'POST') && (req.body.url)){
       url = req.body.url;
       (async function() {
        try {
          await wappalyzer.init()
      
          // Optionally set additional request headers
          const headers = {}
          
          const site = await wappalyzer.open(url, headers)
      
          // Optionally capture and output errors
          // site.on('error', console.error)
      
           results = await site.analyze()
         
        } catch (error) {
            console.log(error);
        }
      await wappalyzer.destroy();
       if((results) && (results.technologies)){
              for(p=0; p < results.technologies.length; p++){
                if(results.technologies[p].slug == 'woocommerce'){ 
                  crash = true;
                  res.send('Provided link is verify that it is related with Woocommrce Now Please<a href="/details"> Click here</a> for get product detail ');
                }
            }
            if(!crash){
              res.send('Provided link not related to woocommerce <a href="/">Please use other URL</a>');
            }
          }
      })();
    }else{ 
        next();
    } 
}

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
app.use(reqFilter);
app.listen(port, () => {
  console.log("Application started and Listening on port"+ port);
});



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  
});
app.get("/details", (req, res) => {
  if(!url){
    res.send('Please provide url <a href="/">first here</a>');
  }else{
    fetchShelve().then((shelves) => res.send(shelves));
  }
  
});


