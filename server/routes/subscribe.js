const express = require("express");
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

const { auth } = require("../middleware/auth");
const { route } = require("./video");

//=================================
//             Subscriber
//=================================

router.post("/subscribeNumber", (req, res) => {
	Subscriber.find({ userTo: req.body.userTo }).exec((err, subscriber) => {
		if (err) res.status(400).json({ success: false });
		return res
			.status(200)
			.json({ success: true, SubscribeNumber: subscriber.length });
	});
});

router.post("/isSubscribed", (req, res) => {
	Subscriber.find({
		userTo: req.body.userTo,
		userFrom: req.body.userFrom,
	}).exec((err, response) => {
		if (err) res.status(400).json({ success: false });
		let result = false;
		if (response.length !== 0) {
			result = true;
		}
		res.status(200).json({ success: true, isSubscribed: result });
	});
});

router.post("/addSubscribe", (req, res) => {
	const subscriber = new Subscriber({
		userTo: req.body.userTo,
		userFrom: req.body.userFrom,
	});
	subscriber.save((err, doc) => {
		if (err) res.status(400).json({ success: false });
		return res.status(200).json({ success: true, doc });
	});
});
router.post("/unSubscribe", (req, res) => {
	Subscriber.findOneAndDelete({
		userTo: req.body.userTo,
		userFrom: req.body.userFrom,
	}).exec((err, doc) => {
		if (err) res.status(400).json({ success: false, err });
		return res.status(200).json({ success: true, doc });
	});
});

module.exports = router;
