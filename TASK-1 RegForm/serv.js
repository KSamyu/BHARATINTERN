var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const path = require('path'); 
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname)); 
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/RegForm', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/reg", (req, res) => {
    var name = req.body.name;
    var password = req.body.password;
    var dob=req.body.dob;
    var gen=req.body.gen;
    var dept=req.body.dept;
    var phno = req.body.phno;
    var email = req.body.email;
    var data = {
        "name": name,
        "password": password,
        "dob":dob,
        "gen":gen,
       "dept":dept,
       "phno": phno,
        "email": email
    };
 db.collection('regis').insertOne(data, (err, collection) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error inserting ......");
        }
        console.log("Record Inserted Successfully!!!");
        return res.redirect('reg1.html');
    });
});

app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    return res.sendFile(path.join(__dirname, 'reg.html')); 
});


app.get('/reg1.html', (req, res) => {
   
   res.sendFile(path.join(__dirname, 'reg1.html')); 
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
