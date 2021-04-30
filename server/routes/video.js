const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const bodyParser = require("body-parser");
const { Subscriber } = require("../models/Subscriber");

const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		if (ext !== ".mp4") {
			return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
		}
		cb(null, true);
	},
});
var upload = multer({ storage: storage }).single("file");
router.post("/uploadfiles", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			return res.json({ success: false, err });
		}
		return res.json({
			success: true,
			url: res.req.file.path,
			fileName: res.req.file.filename,
		});
	});
});

router.post("/thumbnail", (req, res) => {
	let filePath = "";
	let fileDuration = "";

	ffmpeg.ffprobe(req.body.url, function (err, metadata) {
		console.dir(metadata);
		console.log(metadata.format.duration);

		fileDuration = metadata.format.duration;
	});

	ffmpeg(req.body.url)
		.on("filenames", function (filenames) {
			console.log("Will generate " + filenames.join(", "));
			filePath = "uploads/thumbnails/" + filenames[0];
		})
		.on("end", function () {
			console.log("Screenshots taken");
			return res.json({
				success: true,
				url: filePath,
				fileDuration: fileDuration,
			});
		})
		.screenshots({
			// Will take screens at 20%, 40%, 60% and 80% of the video
			count: 3,
			folder: "uploads/thumbnails",
			size: "320x240",
			// %b input basename ( filename w/o extension )
			filename: "thumbnail-%b.png",
		});
});

router.post("/getSubscriptionVideos", (req, res) => {
	Subscriber.find({ userFrom: req.body.userFrom }).exec((err, doc) => {
		if (err) res.status(400).json({ success: false, err });
		else {
			let subscribedUserTo = doc.map((subsription) => {
				return subsription.userTo;
			});
			Video.find({ writer: { $in: subscribedUserTo } })
				.populate("writer")
				.exec((err, videos) => {
					if (err) res.status(400).json({ success: false, err });
					return res.status(200).json({ success: true, videos });
				});
		}
	});
});

router.post("/uploadVideo", (req, res) => {
	const video = new Video(req.body);
	video.save((err, doc) => {
		if (err) res.status(400).json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

router.post("/getVideoDetail", (req, res) => {
	console.log("finding Video", req.body);
	Video.findOne({ _id: req.body.videoId })
		.populate("writer")
		.exec((err, videoDetail) => {
			if (err) res.status(400).json({ success: false, err });
			return res.status(200).json({ success: true, videoDetail });
		});
});

router.get("/getVideos", (req, res) => {
	Video.find({ privacy: 1 })
		.populate("writer")
		.exec((err, videos) => {
			if (err) res.status(400).json({ success: false, err });
			return res.status(200).json({ success: true, videos });
		});
});

module.exports = router;
