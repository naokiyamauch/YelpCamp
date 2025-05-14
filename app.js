if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose
	.connect('mongodb://localhost:27017/yelp-camp', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('MongoDB Connection Established');
	})
	.catch((err) => {
		console.log('MongoDB Connection Error');
		console.log(err);
	});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const sessionConfig = {
	name: session,
	secret: 'mysecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use(helmet());

const scriptSrcUrls = ['https://api.mapbox.com', 'https://cdn.jsdelivr.net'];
const styleSrcUrls = ['https://api.mapbox.com', 'https://cdn.jsdelivr.net'];
const connectSrcUrls = [
	'https://api.mapbox.com',
	'https://*.tiles.mapbox.com',
	'https://events.mapbox.com',
];
const fontSrcUrls = [];
const imgSrcUrls = [
	`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
	'https://images.unsplash.com',
];

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", 'blob:'],
			childSrc: ['blob:'],
			objectSrc: [],
			imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.get('/', (req, res) => {
	res.render('home');
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// app.use('*', (req, res, next) => {
//     next(new ExpressError('No Page Found', 404));
// });
// must come after all other routes

// app.use((req, res, next) => {
//     next(new ExpressError('No Page Found', 404));
// });

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong';
	res.status(statusCode).render('error', { err });
});

app.listen(8080, () => {
	console.log('Server is running on http://localhost:8080');
});
