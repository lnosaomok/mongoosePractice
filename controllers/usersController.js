const express = require("express");
const router = express.Router();
const User = require("../models/users").User;
const Tweet = require("../models/users").Tweet;

// NEW USER FORM
router.get("/new", (req, res) => {
    res.render("users/new.ejs", {
        TITLE: "Add User",
    });
});

// CREATE TWEET EMBEDDED IN USER
router.post("/:userId/tweets", (req, res) => {
    console.log(req.body);
    // store new tweet in memory with data from request body
    const newTweet = new Tweet({ tweetText: req.body.tweetText });

    // find user in db by id and add new tweet
    User.findById(req.params.userId, (error, user) => {
        user.tweets.push(newTweet);
        user.save((err, user) => {
            res.redirect(`/users/${user.id}`);
        });
    });
});

// CREATE A NEW USER
router.post("/", (req, res) => {
    User.create(req.body, (error, newUser) => {
        res.redirect(`/users/${newUser.id}`);
    });
});

router.get("/:userId", (req, res) => {
    // find user in db by id and add new tweet
    User.findById(req.params.userId, (error, user) => {
        res.render("users/show.ejs", { user: user, TITLE: `${user.name}` });
    });
});

module.exports = router;