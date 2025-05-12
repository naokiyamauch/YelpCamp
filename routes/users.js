const express = require('express');
const users = require('../controllers/users');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.route('/register').get(users.renderResister).post(users.register);

router
	.route('/login')
	.get(users.renderLogin)
	.post(
		storeReturnTo,
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
		}),
		users.login
	);

router.get('/logout', users.logout);

module.exports = router;
