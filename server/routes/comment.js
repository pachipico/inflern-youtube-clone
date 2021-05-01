const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");

const { auth } = require("../middleware/auth");

//=================================
//             Comment
//=================================

router.post("/getComments", (req, res) => {
	Comment.find({ postId: req.body.videoId })
		.populate("writer")
		.exec((err, comments) => {
			if (err) res.status(400).json({ success: false });
			return res.status(200).json({ success: true, comments });
		});
});

router.post("/saveComment", (req, res) => {
	const { writer, postId, content } = req.body;
	const comment = new Comment({
		writer,
		postId,
		content,
	});

	comment.save((err, comment) => {
		if (err) res.status(400).json({ success: false, err });
		Comment.find({ _id: comment._id })
			.populate("writer")
			.exec((err, result) => {
				if (err) res.status(400).json({ success: false, err });
				return res.status(200).json({ success: true, result });
			});
	});
});

module.exports = router;
