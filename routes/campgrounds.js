var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js")


router.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
		}
	})
})

router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
	// get data from form and add to campground array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author: author}
	//create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	})
})
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/newAdd");
});
router.get("/campgrounds/:id", function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments likes").exec(function(err, foundCampground) {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user});
		}
	});
	// render show template with that campground
});

// add "like" button
router.post("/campgrounds/:id/like", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});
//EDIT 
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	//is logged in?
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground, 						            currentUser: req.user});
		})
});


//UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // find and update the correct campground
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            campground.name = req.body.campground.name;
            campground.description = req.body.campground.description;
            campground.image = req.body.campground.image;
            campground.save(function (err) {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//Destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})

module.exports = router;

