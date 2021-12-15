const User = require('../models/userModel');

const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
	const { name, email, password, userRole } = req.body;
	let hashpassword;

	try {
		if (password) {
			hashpassword = await bcrypt.hash(password, 12);
		}
		const newUser = await User.create({
			name,
			email,
			password: hashpassword,
			userRole,
		});
		req.session.user = newUser;
		newUser.password = hashpassword;
		res.status(201).json({
			status: 'success',
			data: {
				user: newUser,
			},
		});
	} catch (e) {
		res.status(400).json({
			error: e.message,
		});
	}
};

exports.login = async (req, res) => {
	const validateEmail = function (emailInput) {
		const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return valid.test(emailInput);
	};

	const { email, password } = req.body;

	if (!validateEmail(email)) {
		return res.status(404).json({
			status: 'fail',
			message: `Please enter valid email address!`,
		});
	}

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				status: 'fail',
				message: `${email} does not exist in database`,
			});
		}

		const isCorrect = await bcrypt.compare(password, user.password);

		if (isCorrect) {
			req.session.user = user;
			res.status(200).json({
				status: 'success',
				data: {
					name: user.name,
					userRole: user.userRole,
				},
			});
		} else {
			res.status(400).json({
				status: 'fail',
				message: 'incorrect email or password',
			});
		}
	} catch (e) {
		res.status(400).json({
			status: 'fail',
		});
	}
};

exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find().select('email name userRole password');

		res.status(200).json({
			status: 'success',
			results: users.length,
			data: {
				users,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
		});
	}
};

exports.deleteUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		res.status(200).json({
			status: 'User was deleted',
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
		});
	}
};