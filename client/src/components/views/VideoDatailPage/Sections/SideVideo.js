import Axios from "axios";
import React, { useEffect, useState } from "react";

function SideVideo(props) {
	const [SideVideo, setSideVideo] = useState([]);
	useEffect(() => {
		Axios.get("/api/video/getVideos").then((response) => {
			if (response.data.success) {
				setSideVideo(...SideVideo, response.data.videos);
			}
		});
	}, []);
	const renderSideVideo = SideVideo.map((video, index) => {
		const minutes = Math.floor(video.duration / 60);
		const seconds = Math.floor(video.duration - minutes * 60);
		return (
			<div style={{ display: "flex", marginBottom: "1rem", padding: "0 2rem" }}>
				<div style={{ width: "40%", marginBottom: "1rem" }}>
					<a href={video._id}>
						<img
							style={{ width: "100%", height: "100%" }}
							src={`http://localhost:5000/${video.thumbnail}`}
							alt
						/>
					</a>
				</div>
				<div style={{ width: "50%" }}>
					<a style={{ color: "grey" }}>
						<span style={{ fontSize: "1rem", color: "black" }}>
							{video.title}
						</span>
						<br />
						<span>{video.writer.name}</span>
						<br />
						<span> {video.views} view</span>
						<br />
						<span>{`${minutes} : ${seconds}`}</span>
						<br />
					</a>
				</div>
			</div>
		);
	});
	return (
		<React.Fragment>
			<div style={{ marginTop: "3rem" }}>{renderSideVideo}</div>
		</React.Fragment>
	);
}

export default SideVideo;
