var express = require("express"),
mongoose    = require("mongoose"),
bodyParser  = require("body-parser"),
app         = express(),
port        = 3000;
//APP CONFIGURATION
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//MONGOOSE CONFIGURATION
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
//test 
// Blog.create({
//     title: "Test Bio Blog",
//     image: "https://images.newscientist.com/wp-content/uploads/2019/05/03155847/gettyimages-932737574-2.jpg",
//     body: "The DNA Helix was discovered by Watson and Crick in the mid 20th century-(test)"
// });
//RESTFUL ROUTING USING EXPRESS
//____________________________________________________________________________________________________________________________>>>>>
app.get("/",function(req,res) {
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res) {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error: Cant retrieve blogs");
        } else{
            res.render("index", {blogs: blogs});
        }
    });
    
});
//NEW PAGE
app.get("/blogs/new", function(req,res){
    res.render("new");
});
//ADD BLOG INPUT
app.post("/blogs", function(req,res){
    //create form , post data
    Blog.create(req.body.blog, function(err, newblog){
        if(err){
            console.log("error: cant add the blog");
        }else{
            res.redirect("/blogs");
        }
    })
    //redirect
});

//______________________________________________________________________________________>>>>
    app.listen(port, function(){
        console.log(`Server is listening on port ${port}`);
    });