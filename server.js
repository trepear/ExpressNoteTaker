// Dependencies
var express = require("express");
var path = require("path");
const fs = require("fs");

// Sets up Express App
var app = express();
var PORT = 4000;


// Middlewear Functions
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML ROUTES:
// GET /notes - Should return the notes.html file
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API ROUTES:
// GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes/", function (req, res) {
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", function (err, data) {
        if (err) throw err;
        res.json(JSON.parse(data))
    });
});

// POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
    // read the file
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", function (err, data) {
        if (err) throw err;
        // give unique id every object
        data = JSON.parse(data);
        if (data.length === 0) {
            req.body.id = 0;
        } else {
            req.body.id = data[data.length -1].id + 1;
        };
        data.push(req.body);

        // write the file with new note
        fs.writeFile(path.join(__dirname + "/db/db.json"), JSON.stringify(data, null, 2), "utf8", function (err) {
            if (err) throw err;
            res.sendStatus(200)
        });
    });
});

// DELETE /api/notes/:id 
app.delete('/api/notes/:id', function (req, res) {
    fs.readFile(path.join(__dirname + "/db/db.json"), 'utf-8', function (err, dbJSON) {
        if (err) throw err;
        let key = req.params.id;
        var data = JSON.parse(dbJSON);
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == key) {
                data.splice(i, 1);
                console.log(data)
            }
        }
        // Write updated dbJSON to db.json
        fs.writeFile(path.join(__dirname + "/db/db.json"), JSON.stringify(data, null, 2), "utf8", function (err) {
            if (err) throw err;
            res.sendStatus(200)
        });
    })
})

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});