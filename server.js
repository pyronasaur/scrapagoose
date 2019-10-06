var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = 3000;
var app = express();
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Mongo connection space
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Route Section

// Scrape stuff
app.get("/scrape", function(req, res) {
  axios.get("https://www.espn.com/nfl/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("section").each(function(i, element) {

      var result = {};
      result.title = $(this)
        .children("a")
        .children("div")
        .children("div")
        .children("h1")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // filter results from <section> tags that don't have articles
      if(result.title && result.link) {
      db.Article.create(result)
        .then(function(dbArticle) {     
            console.log(dbArticle);                   
        })
        .catch(function(err) {
          console.log(err);
        });
      }
    });  

    // Response
    res.send("Scrape Complete");
  });
});

//Get all Articles from db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
