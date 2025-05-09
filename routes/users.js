const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post('/register', async (req, res) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		console.log(registeredUser);
		req.flash('success', 'Welcome to Yelp Camp!');
		res.redirect('/campgrounds');
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('register');
	}
});

router.get('/login', (req, res) => {
	res.render('users/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	(req, res) => {
		req.flash('success', 'Welcome Back!');
		res.redirect('/campgrounds');
	}
);

router.get('/logout', (req, res) => {
	req.logout((e) => {
		if (e) {
			return next(e);
		}
		req.flash('success', 'Successfully Logged Out');
		res.redirect('/campgrounds');
	});
});

module.exports = router;
