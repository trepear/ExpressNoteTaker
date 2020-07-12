// Dependencies
var express = require("express");
var path = require("path");
const fs = require("fs");

// Sets up Express App
var app = express();
var PORT = 7070;

// Middlewear Functions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




// HTML ROUTES:
    // GET /notes - Should return the notes.html file
    app.get("/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "/public/notes.html"));
      });

    // GET * - Should return the index.html file
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "/public/index.html"));
      });
    

// API ROUTES:
    // GET /api/notes - Should read the db.json file and return all saved notes as JSON.
    app.get("/api/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "/db/db.json"));
    });

    app.get("/api/notes/:id", function(req, res){
        let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
        res.json(savedNotes[Number(req.params.id)]);
    })

    // POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
    app.post("/api/notes", function(req, res){
        // read saved notes in db.json
        let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
        let newNote = req.body;
        let uniqueID = (savedNotes.length).toString();
        newNote.id = uniqueID;
        savedNotes.push(newNote);
        
        fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
        console.log("Note saved to db.json!", newNote);
        res.json(savedNotes);
    })

    // DELETE /api/notes/:id - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file. 

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});