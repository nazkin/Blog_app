var express     = require("express"),
mongoose        = require("mongoose"),
bodyParser      = require("body-parser"),
methodOverride  = require("method-override"),
app             = express(),
port            = 3000;
//APP CONFIGURATION
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
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
//NEW ROUTE
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
//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err,blogFound){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: blogFound});
        }
    });
    
});
//EDIT ROUTE ***************************************************************
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log("err: cant locate item in database");
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog: foundBlog});      
        }
    });
});
//UPDATE ROUTE THROUGH A PUT REQUEST
app.put("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updBlog){
        if(err){
            console.log("Error: Couldnt update file");
            res.redirect("/blogs");
        } else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});
//DELETE/DESTROY ROUTE
app.delete(`/blogs/:id`, function(req,res){
   //Destroy blog 
    Blog.findByIdAndRemove(req.params.id, function(err, blodDelete){
        if(err){
            console.log("Error: Can't delete the blog");
            res.redirect(`/blogs/${req.params.id}`);
        } else {
            res.redirect(`/blogs`);
        }
    });
   //Redirect to blogs page
});
//************************************************************************************ 
//______________________________________________________________________________________>>>>
 app.listen(port, function(){
     console.log(`Server is listening on port ${port}`);
 });