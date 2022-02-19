const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Room = require("../models/Room.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


router.route("/create")
    .get(isLoggedIn, (req, res)=>{
    res.render("rooms/new-room")
    })

    .post(isLoggedIn, (req, res)=>{
        const {name, description, imgUrl} = req.body
        const owner = req.session.userId
    
        Room.create({name, description, imgUrl, owner})
        .then(()=>{ 
            res.redirect("/rooms/rooms-list");
        })
        .catch(error=>{res.render("rooms/new-room")})
        })


router.get("/rooms-list", (req, res) => {
        Room.find()
        .then((rooms)=>{
            res.render("rooms/rooms-list", {rooms} )
                })
            })
        


router.route("/:id/edit")
    .get(isLoggedIn, (req, res) => { 
      const id = req.params.id  
      Room.findById(id)
      .populate("owner")
      .then((room)=>{
          if(req.session.userId === room.owner.id)
          res.render("rooms/edit-room", room)
          })

      .post(isLoggedIn, (req, res)=>{
         const {name, description, imgUrl} = req.body
         const owner = req.session.userId
        
         Room.findByIdAndUpdate(id, {name, description, imgUrl, owner})
            .then(()=>{ 
                res.redirect("/rooms/rooms-list");
            })
            .catch(error=>{res.render("rooms/edit-room")})
            })
 })

    
router.get("/:id", (req, res) => {
    const id =req.params.id
    Room.findById(id)
    .populate("owner")
    .then((room)=>{
         res.render("rooms/room-details", room)
        })
    .catch(error=>{res.render("rooms/rooms-list")})
})


module.exports = router;