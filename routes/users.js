const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post('/register', async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
		});
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
	storeReturnTo,
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	(req, res) => {
		req.flash('success', 'Welcome Back!');
		const redirectUrl = res.locals.returnTo || '/campgrounds';
		res.redirect(redirectUrl);
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
