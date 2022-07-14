const Crawler = require("crawler");
// const product = require("./node");

let obselete = []; // Array of what was crawled already

let c = new Crawler();

function crawlAllUrls(url) {
    console.log(`Crawling ${url}`);
    c.queue({
        uri: url,
        callback: function (err, res, done) {
            if (err) throw err;
            let $ = res.$;
            var body = $("body");
            for (var i in body) { 
                if(body[i]){console.log(body[i]);
                    // var val = body[i].attribs.href;console.log(val);
                    
                }
                
              }
            
            
            try {
                let urls = $("a");
                // Object.keys(urls).forEach((item) => {
                //     if (urls[item].type === 'tag') {
                //         let href = urls[item].attribs.href;
                //         if (href && !obselete.includes(href)) {
                //             href = href.trim();
                //             obselete.push(href);
                //             // Slow down the
                //             setTimeout(function() {
                //                 href.startsWith('http') ? crawlAllUrls(href) : crawlAllUrls(`${url}${href}`) // The latter might need extra code to test if its the same site and it is a full domain with no URI
                //             }, 5000)

                //         }
                //     }
                // });
            } catch (e) {
                console.error(`Encountered an error crawling ${url}. Aborting crawl.`);
                done()

            }
            
            done();
        }
    })
}

crawlAllUrls('https://bloompoppy.co.nz/');