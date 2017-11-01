const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.RED_HOME_DB}`);
const db = mongoose.connection;
db.once("open", function () {
    console.log("DB Connected!!");
});
db.on("error", function (err) {
    console.log("DB Error: ", err);
});

const dataSchema = mongoose.Schema({
    name: String,
    count: Number
});

const Data = mongoose.model('data', dataSchema);
Data.findOne({name: "myData"}, function (err, data) {
    if (err) return console.log("Data Error : ", err);
    if (!data) {
        Data.create({name: "myData", count:0 }, function (err, data) {
            if (err) return console.log("Data Error : ", err); 
            console.log("Counter initialized :", data);
        });
    }
});

app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res) {
    Data.findOne({name: "myData"}, function (err, data) {
        if (err) return console.log("Data Error : ", err); 
        data.count++;
        data.save(function (err) {
            if (err) return console.log("Data Error : ", err); 
            res.render('my_first_ejs', data);
        });
    });
});

app.get('/reset', function (req, res) {
    setCounter(res, 0);
});

app.get('/set/count', function (req, res) {
    if(req.query.count) 
        data.count = req.query.count;
    else
        getCounter(res);
});

app.get('/set/:num', function (req, res) {
    if (req.param.num) 
        setCounter(res, req.params.num);
    else
        getCounter(res);
});

function setCounter(res, num) {
    console.log("setCounter");
    Data.findOne({name: "myData"}, function (err, data) {
        if (err) return console.log("Data Error : ", err); 
        data.count = num;
        data.save(function (err) {
            if (err) return console.log("Data Error : ", err); 
            res.render('my_first_ejs', data);
        });
    }); 
}

function getCounter(res) {
    console.log("getCounter");
    Data.findOne({name: "myData"}, function (err, data) {
        if (err) return console.log("Data Error : ", err); 
        res.render('my_first_ejs', data);
    }); 
}

app.listen(3000, function() {
    console.log('Server started.');
});
