const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");
const md5 = require("md5")
require("dotenv").config();

const mongooseConnect = require("./authentication/mongooseAuth");
const login = require("./authentication/loginAuth");

mongoose.connect(mongooseConnect, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    qualification: String,
    mobile: Number,
    location: String,
    class: String

});
const locationSchema = new mongoose.Schema({
    location: String

});
const User = mongoose.model("User", userSchema);
const Location = mongoose.model("Location", locationSchema);

app.post("/login", function (req, res) {
    if (md5(req.body.username) === login.username && md5(req.body.password) === login.password) {
        res.send("Success")
    } else {
        res.send("Enter correct username and password")
    }
    // res.send(req.body);
});




app.post("/createUser", function (req, res) {
    // console.log(req.body);

    const user = new User(req.body);
    user.save();
    // console.log("Created")
    res.send("Created");

});


app.post("/addLocation", function (req, res) {
    // console.log(req.body);

    const location = new Location({
        location: req.body.location
    });
    location.save();
    // console.log("Created")
    res.send("Created");

});

app.get("/locationSearchFromDatabase", function (req, res) {

    Location.find(function (err, location) {
        if (err) {
            console.log(err);
        } else {

            // console.log(location.length);
            res.send(location)
        }

    });
});

app.post("/locationsearch", function (req, res) {


    User.find({ "location": req.body.currentLocation }, function (err, user) {
        if (err) {
            console.log(err)
        } else {
            // console.log(user);
            res.send(user)
        }
    });

});

app.post("/customsearch", function (req, res) {

    // console.log(req.body)
    let firstName;
    let lastName;
    let qualification;
    let mobile;
    let location;
    let classIn;

    if (req.body.firstName === "") { firstName = { "$ne": "" } } else { firstName = req.body.firstName }
    if (req.body.lastName === "") { lastName = { "$ne": "" } } else { lastName = req.body.lastName }
    if (req.body.qualification === "") { qualification = { "$ne": "" } } else { qualification = req.body.qualification }
    if (req.body.mobile === "") { mobile = { "$ne": "" } } else { mobile = req.body.lastName }
    if (req.body.location === "") { location = { "$ne": "" } } else { location = req.body.location }
    if (req.body.class === "") { classIn = { "$ne": "" } } else { classIn = req.body.class }

    User.find({
        firstName: firstName,
        lastName: lastName,
        qualification: qualification,
        mobile: mobile,
        location: location,
        class: classIn
    }, function (err, user) {
        if (err) {
            console.log(err)
        } else {
            // console.log(user);
            res.send(user)
        }
    });
    // res.send(req.body);

});
app.post("/deleteUser", function (req, res) {

    User.findOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        qualification: req.body.qualification,
        mobile: req.body.mobile,
        location: req.body.location,
        class: req.body.class
    }, function (err, user) {
        if (err) {
            console.log(err);
            res.send("User Notfound")
        } else {
            if (user === null) {
                res.send("User NotFound")
            } else {
               
                User.deleteOne({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    qualification: req.body.qualification,
                    mobile: req.body.mobile,
                    location: req.body.location,
                    class: req.body.class
                }, function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        // res.send("Deleted")
                        res.send( "( " + user.firstName + " " + user.lastName + " )" + " seccessfully removed from the database!");

                    }
                });
            }
        }
    });

    // res.send(req.body);

});


app.listen(5000, function () {
    console.log("Server started at port 5000")
});