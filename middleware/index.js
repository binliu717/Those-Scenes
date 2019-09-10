// all the middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground")
var Comment = require("../models/comment")

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back");
			} else {
				//console.log(foundCampground.author.id);
				//console.log(req.user._id);
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "It seems like you don't have permission");
					res.redirect("back");
				}
			}
		});
	} else {
		res.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				//console.log(foundCampground.author.id);
				//console.log(req.user._id);
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "It seems like you don't have permission");
					res.redirect("back");
				}
			}
		});
	} else {
		res.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	} else {
	   req.flash("error", "Hi, you need to log in!");
	   res.redirect("/login");
	}
}

module.exports = middlewareObj;