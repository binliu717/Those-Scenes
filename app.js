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

var commentsRoutes = require("./routes/comments"),
 	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index"),
	reviewRoutes     = require("./routes/reviews")

//seedDB();
mongoose.connect('mongodb+srv://Mike:5924xiaos@cluster0-rqmrw.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentsRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(process.env.PORT,process.env.IP, function() {
	console.log("Connceted!!")
})

// app.listen(9000, () => {
// 	console.log('server listening on port 3000');
// });