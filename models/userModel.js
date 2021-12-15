const mongoose = require('mongoose');

const validateEmail = function (emailInput) {
	const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return valid.test(emailInput);
};

const validateUserRole = function (role) {
	return role === 'admin' || role === 'user' ? true : false;
};

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'User must have a name'],
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: [true, 'Email address is required'],
		validate: [validateEmail, 'Please fill a valid email address'],
	},
	password: {
		type: String,
		required: [true, 'User must have a password'],
	},
	userRole: {
		type: String,
		lowercase: true,
		required: [true, 'User must have a role'],
		validate: [validateUserRole, 'Please add a valid role'],
	},
});

userSchema.path('email').validate(async (email) => {
	const emailCount = await mongoose.models.User.countDocuments({ email });
	return !emailCount;
}, 'Email already exists!');

const User = mongoose.model('User', userSchema);

module.exports = User;
