const express = require("express");
const router = express.Router();
const User = require("../models/users").User;
const Tweet = require("../models/users").Tweet;

// NEW USER FORM
router.get("/new", (req, res) => {
    res.render("users/new.ejs", {
        TITLE: "Add User",
        home_link: "Users",
        other_link: "albums",
        other_link_name: "Albums",
    });
});
/// USERS
router.get("/", (req, res) => {
    User.find({}, (error, users) => {
        res.render("users/index.ejs", {
            TITLE: "Users",
            users,
            home_link: "Users",
            other_link: "albums",
            other_link_name: "Albums",
        });
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

router.get("/:userId/tweets/:tweetId/edit", (req, res) => {
    // set the value of the user and tweet ids
    const userId = req.params.userId;
    const tweetId = req.params.tweetId;
    // find user in db by id
    User.findById(userId, (err, foundUser) => {
        // find tweet embedded in user
        const foundTweet = foundUser.tweets.id(tweetId);
        // update tweet text and completed with data from request body
        res.render("tweets/edit.ejs", {
            foundUser,
            foundTweet,
            TITLE: "Edit Tweet",
            home_link: "Users",
            other_link: "albums",
            other_link_name: "Albums",
        });
    });
});

router.put("/:userId/tweets/:tweetId", (req, res) => {
    console.log("PUT ROUTE");
    // set the value of the user and tweet ids
    const userId = req.params.userId;
    const tweetId = req.params.tweetId;

    // find user in db by id
    User.findById(userId, (err, foundUser) => {
        // find tweet embedded in user
        const foundTweet = foundUser.tweets.id(tweetId);
        // update tweet text and completed with data from request body
        foundTweet.tweetText = req.body.tweetText;
        foundUser.save((err, savedUser) => {
            res.redirect(`/users/${foundUser.id}`);
        });
    });
});

// CREATE A NEW USER
router.post("/", (req, res) => {
    User.create(req.body, (error, newUser) => {
        res.redirect(`/users/${newUser.id}`);
    });
});

router.delete("/:userId/tweets/:tweetId", (req, res) => {
    console.log("DELETE TWEET");
    // set the value of the user and tweet ids
    const userId = req.params.userId;
    const tweetId = req.params.tweetId;

    // find user in db by id
    User.findById(userId, (err, foundUser) => {
        // find tweet embedded in user
        foundUser.tweets.id(tweetId).remove();
        // update tweet text and completed with data from request body
        foundUser.save((err, savedUser) => {
            res.redirect(`/users/${foundUser.id}`);
        });
    });
});

router.get("/:userId", (req, res) => {
    // find user in db by id and add new tweet
    User.findById(req.params.userId, (error, user) => {
        res.render("users/show.ejs", {
            user: user,
            TITLE: `${user.name}`,
            home_link: "Users",
            other_link: "albums",
            other_link_name: "Albums",
        });
    });
});
router.delete("/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id, () => {
        res.redirect("/users");
    });
});

module.exports = router;