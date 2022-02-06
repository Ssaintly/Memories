//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "This is a free portal for people to write their memories.";

const aboutContent = "This page is about writing your memoires, your favourite moments of life which you miss now and think about, this page gives you a portal to present your feelings and emotions openly. Made with Love";
const contactContent = "This application is a practice project made with love by Rishika Giri";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Orihime:1149981@cluster0.tvlj8.mongodb.net/memoDB", {useNewUrlParser: true});




const MemosSchema = {
  title: String,
  content: String
};

const Memo = mongoose.model("Memo", MemosSchema);

const memo1 = {
  title: "Happiness",
  content:"Happiness is an emotional state characterized by feelings of joy, satisfaction, contentment, and fulfillment. While happiness has many different definitions, it is often described as involving positive emotions and life satisfaction."
}

const memo2 = {
  title: "Memories",
  content: "Memories are an essential part of our bodies. They shape our character as the entirety of our insight and past encounters are put away there. We all have Memories, both great and awful. You have Memories from some time in the past and furthermore from ongoing occasions. Besides, a few Memories assist us with getting extreme days and make us happy on great days."
}

defaultMemo = [memo1, memo2];
 


app.get("/", function(req, res){

  Memo.find({}, function(err, newMemo){
    if(newMemo.length===0)
  {
    Memo.insertMany(defaultMemo, function(err){
      if(err)
      {console.log(err);}
      else{ console.log("done successfully")};
    });

    res.redirect("/");

  }

    res.render("home", {title:"Home", para: homeStartingContent, posts:newMemo});
  });
});


app.get("/about", function(req, res){
  res.render("about", {title:"About", para: aboutContent});
})

app.get("/contact", function(req, res){
  res.render("contact", {title:"Contact", para: contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", function(req, res){

  const Newpost = new Memo({
    title:req.body.title,
    content: req.body.postBody
  });
  
  Newpost.save();
 
 //  console.log(posts);
 
  res.redirect("/");
 });


app.get("/posts/:postName", function (req, res) {
  const PostName = _.capitalize(req.params.postName);

  if(PostName === "compose")
    {  res.render("compose"); }

    Memo.findOne({title: PostName}, function(err, foundpost){
        if(!err)
        {
            if(!foundpost)
             {res.render("compose");}
             else
            { res.render("Post", {title:foundpost.title, para: foundpost.content});}
        }
        else{console.log(err);}
    })
});


let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started ");
});
