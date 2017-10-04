


const express = require('express');
const app = express();
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

app.get('/getVerses', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json", "charset=utf-8");
  const stream = x("http://visna.net/index.php?let=" + req.query, "span.stafrof", [{
    ljod: x("a@href", [ "#content"]),


  }]).stream();
  stream.pipe(res);
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


app.listen(80)



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
// });
