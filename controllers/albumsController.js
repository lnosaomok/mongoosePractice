const express = require("express");
const router = express.Router();
const Album = require("../models/albums").Album;
const Song = require("../models/albums").Song;

router.get("/new", (req, res) => {
    res.render("albums/new.ejs", {
        TITLE: "Add Album",
        home_link: "albums",
        other_link: "users",
        other_link_name: "Users",
    });
});

router.get("/", (req, res) => {
    Album.find({}, (error, albums) => {
        res.render("albums/index.ejs", {
            TITLE: "Albums",
            albums,
            home_link: "albums",
            other_link: "users",
            other_link_name: "Users",
        });
    });
});

router.post("/:albumId/songs", (req, res) => {
    const newSong = new Song({ songName: req.body.songName });
    Album.findById(req.params.albumId, (error, album) => {
        album.songs.push(newSong);
        album.save((err, album) => {
            res.redirect(`/albums/${album.id}`);
        });
    });
});

router.get("/:albumId/songs/:songId/edit", (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;
    Album.findById(albumId, (err, foundAlbum) => {
        const foundSong = foundAlbum.songs.id(songId);
        res.render("songs/edit.ejs", {
            foundAlbum,
            foundSong,
            TITLE: "Edit Song",
            home_link: "albums",
            other_link: "users",
            other_link_name: "Users",
        });
    });
});

router.put("/:albumId/songs/:songId", (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;
    Album.findById(albumId, (err, foundAlbum) => {
        const foundSong = foundAlbum.songs.id(songId);
        foundSong.songName = req.body.songName;
        foundAlbum.save((err) => {
            res.redirect(`/albums/${foundAlbum.id}`);
        });
    });
});

router.post("/", (req, res) => {
    Album.create(req.body, (error, newUser) => {
        res.redirect(`/albums/${newUser.id}`);
    });
});

router.delete("/:albumId/songs/:songId", (req, res) => {
    const albumId = req.params.albumId;
    const songId = req.params.songId;

    Album.findById(albumId, (err, foundAlbum) => {
        foundAlbum.songs.id(songId).remove();
        foundAlbum.save((err, savedUser) => {
            res.redirect(`/albums/${foundAlbum.id}`);
        });
    });
});

router.get("/:albumId", (req, res) => {
    Album.findById(req.params.albumId, (error, album) => {
        res.render("albums/show.ejs", {
            album: album,
            TITLE: `${album.name}`,
            home_link: "albums",
            other_link: "users",
            other_link_name: "Users",
        });
    });
});
router.delete("/:id", (req, res) => {
    Album.findByIdAndDelete(req.params.id, () => {
        res.redirect("/albums");
    });
});

module.exports = router;