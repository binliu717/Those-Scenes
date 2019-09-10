var express = require("express");
	app = express();
	bodyParser = require("body-parser");
	mongoose = require("mongoose");
	Campground = require("./models/campground");
	Comment = require("./models/comment");
	User = require("./models/user");
	seedDB = require("./seeds");
	passport = require("passport");
	LocalStrategy = require("passport-local");
	methodOverride = require("method-override");
	flash = require("connect-flash");
// Passport Configuration



app.use(require("express-session")({
		secret: "i am the cutest dog",
	    resave: false,
		saveUninitialized: false,
		}))
app.use(flash());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

var commentsRoutes = require("./routes/comments")
 	campgroundRoutes = require("./routes/campgrounds")
	indexRoutes = require("./routes/index")

//seedDB();
mongoose.connect(mongodb+srv://Mike:5924xiaos@cluster0-rqmrw.mongodb.net/test?retryWrites=true&w=majority)
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentsRoutes);
// SCHEMA SETUP

//  Campground.create({
// 	name:"Fengle",
// 	image: "http://tipsinahmoundscampground.com/wp-content/uploads/2017/07/IMG_6559-copy.jpg",
// 	description: "wow wow wow sdkfjsdfkjsdf;slkdjf"
// }, function(err, campground) {
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("New Campground: ")
// 		console.log(campground);
// 	}
// })

/*var campgrounds = [
		{name: "Salmon Greek", image: "http://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/cattai-national-park/cattai-campground/cattai-campground-05.jpg"},
		{name: "Fengle", image: "http://tipsinahmoundscampground.com/wp-content/uploads/2017/07/IMG_6559-copy.jpg"},
		{name: "Mountain", image: "https://11mjsg94ex5ggb0b7k6013aj-wpengine.netdna-ssl.com/wp-content/uploads/img_0842-1170x640.jpg"},
		{name: "Fengle2", image: "http://tipsinahmoundscampground.com/wp-content/uploads/2017/07/IMG_6559-copy.jpg"},
		{name: "Mountain3", image: "https://11mjsg94ex5ggb0b7k6013aj-wpengine.netdna-ssl.com/wp-content/uploads/img_0842-1170x640.jpg"},
		{name: "Fengle2", image: "http://tipsinahmoundscampground.com/wp-content/uploads/2017/07/IMG_6559-copy.jpg"},
		{name: "Mountain3", image: "https://11mjsg94ex5ggb0b7k6013aj-wpengine.netdna-ssl.com/wp-content/uploads/img_0842-1170x640.jpg"}
	]
*/



app.listen(process.env.PORT,process.env.IP, function() {
	console.log("Connceted!!")
})