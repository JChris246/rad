require("dotenv").config();
const services = require("../services");
const MusicLibrary = require("../models/musicLibrary");

// Add the specified path as a music library
module.exports.addLibrary = (req, res) => {
    const path = req.body.path;

    MusicLibrary.find({ path }, (err, lib) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                msg: err
            });
        }
        if (lib?.length < 1) {
            const newLib = new MusicLibrary({ path });
            newLib.save().then(savedLib => {
                if (savedLib === newLib) // if savedLib returned is the same as newLib then saved successfully
                    res.status(201).send({ msg: "Path added to Library successfully" });
                else res.status(500).send({ msg: "Failed to add path to library" });
            });
            services.scanLibraries();
        }
        else res.status(409).send({ msg: "That path is already tracked" });
    });
};