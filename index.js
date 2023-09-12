const fs = require('fs'); //file system
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');
/////////////////////////////////
// FILES
// blocking syncronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);

// console.log("File written!");

// nonblocking asyncronous way

// fs.readFile("./txt/start.txt", "utf-8", (err, daata1) => {
//   if (err) {
//     return console.log("Error!");
//   }
//   fs.readFile(`./txt/${daata1}.txt`, "utf-8", (err, daata2) => {
//     console.log(daata2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, daata3) => {
//       console.log(daata3);

//       fs.writeFile(
//         `./txt/final.txt`,
//         `${daata2}\n${daata3}`,
//         "utf-8",
//         (err) => {
//           console.log("your file has been written");
//         }
//       );
//     });
//   });
// });
// console.log("will read file!");

// FILES
//////////////////////////////////////////

//////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productDataObj = JSON.parse(data);

const slugs = productDataObj.map((el) =>
  slugify(el.productName, { lower: true })
);
// console.log(slugs);
const server = http.createServer((req, res) => {
  //console.log(res);
  //console.log(req);
  // console.log(req.url);
  //const pathName = req.url;

  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardHtml = productDataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);
  } // product page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = productDataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } // api
  else if (pathname === '/api') {
    /*
    fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
      const productData = JSON.parse(data);
      console.log(productData);
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      res.end(data);
    });
    */
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      myOwnHeader: 'hi there',
    });
    res.end('<h1>Page not foundd</ h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
