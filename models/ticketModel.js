const mongoose = require('mongoose');

const validateStatus = function (status) {
	return status === 'to-do' || status === 'in progress' || status === 'closed' ? true : false;
};

const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	description: {
		type: String,
	},
	reporter: {
		type: String,
	},
	assignee: {
		type: String,
	},
	status: {
		type: String,
		validate: [validateStatus, 'Please add a valid status'],
	},
	dateCreated: {
		type: String,
		required: [true, 'Ticket must have date!'],
	},
	priority: {
		type: String,
	},
	uniqueId: {
		type: String,
		unique: true,
		required: [true, 'Ticket must have a unique identifier!'],
	},
	id: {
		type: String,
	},
});

ticketSchema.path('uniqueId').validate(async (uniqueId) => {
	const uniqueIdCount = await mongoose.models.Ticket.countDocuments({
		uniqueId,
	});
	return !uniqueIdCount;
}, 'ID already exists!');

// ticketSchema.path('title').validate(async (title) => {
// 	const uniqueTitleCount = await mongoose.models.Ticket.countDocuments({
// 		title,
// 	});
// 	return !uniqueTitleCount;
// }, 'Title already in use!');

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
