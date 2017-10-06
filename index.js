const express = require('express');
const app = express();
const redis = require('./helpers/redis')
const fs = require("fs")
let port = process.env.PORT || 8080;
let request = require('./xray-driver')
const xRay = require('x-ray');
const x = xRay({
filters: {
  trim: function (value) {
    const val = value.replace(/\r/g," ").replace(/\n/g," ").replace(/\t/g," ")
    return typeof value === "string" ? val.trim() : value
  },
  slice: function (value, start , end) {
      return typeof value === 'string' ? value.slice(start, end) : value
    }
}
}).driver(request('Windows-1252'));

let verses;
getVerses = ()=> {
  console.log("Fetching");
  /*
  x('http://visna.net/',  ".container center", {
    results: x(['.stafrof a@href'], { 
      items: x('.container #left', '.menuSubPadd:not(:nth-child(2))', [{
        id: '.menuSubPadd a@href | slice:36',
        title: ".menuSubPadd a",
        text: x('.menuSubPadd a@href', '.container #content .poemtext'),
        author: x(".menuSubPadd a@href", ".container #content .poemauthor"),
      }])
    })
  })((err, obj)=>{
    verses = obj;
    console.log(verses)
    console.log("verses er tilbúið");
  })
  */
  x('http://visna.net/',  ".container", {
    results: x('center .stafrof a@href', ".container #left .menuSubPadd:not(:nth-child(2))", [{
      id: '.menuSubPadd a@href | slice:36',
      title: ".menuSubPadd a",
      text: x('.menuSubPadd a@href', '.container #content .poemtext'),
      author: x(".menuSubPadd a@href", ".container #content .poemauthor"),
    }])
  })((err, obj)=>{
    verses = obj;
    console.log(verses)
    console.log("verses er tilbúið");
  });
}
getVerses();
app.get('/verses', (req, res)=> {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json; charset=utf-8");
  res.json(verses);
 });
 
app.get('/api/verses.json', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json", "charset=utf-8");
  const fileToOpen = "./results.json"; 
  fs.readFile(fileToOpen,function(error,data){
    if (error){
        console.log("error opening file",error);
    }

    console.log("contents",data);
  });
})
app.get('/scraper/verses', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json", "charset=utf-8");
  x('http://visna.net/?let=c',  ".container", {
    items: x('http://visna.net/', '.container #left .menuSubPadd:not(:nth-child(2))', [{
      id: '.menuSubPadd a@href',
      title: ".menuSubPadd a",
      text: x('.menuSubPadd a@href', '.container #content .poemtext'),
      author: x(".menuSubPadd a@href", ".container #content .poemauthor"),
    }]).write('results.json')
  })
  res.send("test")
})


app.get('/category', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json; charset=utf-8");
  const stream = x('http://visna.net', "center", [{
    letter: ["span.stafrof:nth-child(n+3) a"],


  }]).stream();
  stream.pipe(res);
})

//visna.net/index.php?let=.ID.&pid= .ID.


app.get('/category/:id', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json; charset=utf-8");
  const stream = x('http://visna.net/?let=' + req.params.id,  ".container", {
    items: x('http://visna.net/', '.container #left .menuSubPadd:not(:nth-child(2))', [{
      id: '.menuSubPadd a@href',
      title: ".menuSubPadd a",
      text: x('.menuSubPadd a@href', '.container #content .poemtext'),
      author: x(".menuSubPadd a@href", ".container #content .poemauthor"),
    }])
  }).stream();
  stream.pipe(res);
});
console.log("done");


app.listen(port, function() {
  console.log('Our app is running on port: ' + port)
})



// app.get("/new/", function(req, res) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Content-Type", "application/json; charset=utf-8");
//   const stream = x("http://visna.net/?pid=" + req.params.id, "#right",{
//     items: x("http://visna.net/", "container #right .menySubPadd", [{
//       id: "menuSubPadd a@href",
//       title:".menuSubPadd a",
//       text: x(".menuSubPadd a@href", ".container #content poemtext"),
//     }])
//   }).stream();
//   stream.pipe(res);
// })