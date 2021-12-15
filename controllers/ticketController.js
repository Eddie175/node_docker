const Ticket = require('../models/ticketModel');

exports.getAllTickets = async (req, res, next) => {
	try {
		const tickets = await Ticket.find();

		res.status(200).json({
			status: 'success',
			results: tickets.length,
			data: {
				tickets,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
		});
	}
};

exports.getOneTicket = async (req, res, next) => {
	try {
		const ticket = await Ticket.findById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: {
				ticket,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
		});
	}
};

exports.createTicket = async (req, res, next) => {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	const date = new Date().toLocaleString('en-US');
	const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
	const randomNumber = Math.floor(
		Math.random() * (99999 - 10000 + 1) + 10000
	);
	const { title, description, reporter, assignee, status, priority, id } =
		req.body;

	try {
		const ticket = await Ticket.create({
			title,
			description,
			reporter,
			assignee,
			status,
			dateCreated: date,
			priority,
			uniqueId: `${randomLetter.toUpperCase()}${randomNumber}`,
			id,
		});

		res.status(200).json({
			status: 'success',
			data: {
				ticket,
			},
		});
	} catch (e) {
		res.status(400).json({
			error: e.message,
		});
	}
};

exports.updateTicket = async (req, res, next) => {
	try {
		const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			status: 'success',
			data: {
				ticket,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
		});
	}
};

exports.deleteTicket = async (req, res, next) => {
	try {
		const ticket = await Ticket.findByIdAndDelete(req.params.id);

		res.status(200).json({
			status: 'Ticket was deleted',
		});
	} catch (e) {
		res.status(400).json({
			status: 'fail',
		});
	}
};
