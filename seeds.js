var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");


function seedDB(){
   //Remove all campgrounds
   Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
         //add a few campgrounds
        
})
}

module.exports = seedDB;