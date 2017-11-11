const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

mongoose.connect(`mongodb://${process.env.RED_HOME_DB}`);
const db = mongoose.connection;
db.once("open", () => {
    console.log("DB Connected!!");
});
db.on("error", (err) => {
    console.log("DB Error: ", err);
});

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, require: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type:Date }
});

const Post = mongoose.model('post', postSchema);

app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get('/posts', (req, res) => {
    // Post.find({}, (err, posts) => {
    Post.find({}).sort('-createdAt').exec((err, posts) => {
        if (err) {
            return res.json({ success: false, message: err });
        }
        // res.json({ success: true, data: posts })
        res.render("posts/index", { data: posts });
    });
});

app.get('/posts/new', (req, res) => {
    res.render("posts/new");
});

app.post('/posts', (req, res) => {
    Post.create(req.body.post, (err, post) => {
        if (err) {
            return res.json({ success: false, message: err });
        }
        //res.json({ success: true, data: post });
        res.redirect('/posts');
    });
});

app.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            return res.json({ success: false, message: err });
        }
        // res.json({ success: true, data: post });
        res.render("posts/show", {data: post});
    });
});

app.get('/posts/:id/edit', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) { 
            return res.json({ success: false, message: err });
        }
        res.render("posts/edit", {data: post});
    });
});

app.put('/posts/:id', (req, res) => {
    req.body.post.updatedAt = Date.now();
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, post) => {
        if (err) {
            return res.json({ success: false, message: err });
        }
        // res.json({ success: true, message: post.id + " updated" });
        res.redirect('/posts/'+req.params.id);
    });
});;

app.delete('/posts/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id, (err, post) => {
        if (err) {
            return res.json({ success: false, message: err });
        }
        // res.json({ success: true, message: post.id + " deleted" });
        res.redirect('/posts');
    });
});;

app.listen(3000, () => {
    console.log('Server started.');
});
