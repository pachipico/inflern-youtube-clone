import React, { useEffect, useState } from "react";
import { Col, Row, Avatar, List } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import { useSelector } from "react-redux";

function VideoDetailPage(props) {
	const videoId = props.match.params.videoId;
	const variable = { videoId: videoId };
	const [VideoDetail, setVideoDetail] = useState([]);
	const currentUser = localStorage.getItem("userId");

	useEffect(() => {
		Axios.post("/api/video/getVideoDetail", variable).then((response) => {
			if (response.data.success) {
				console.log("This video detail:", response.data.videoDetail);
				setVideoDetail(response.data.videoDetail);
			} else {
				alert("Failed to get Video");
			}
		});
	}, []);

	if (VideoDetail.writer) {
		const subscribeButton = VideoDetail.writer._id !== currentUser && (
			<Subscribe
				userTo={VideoDetail.writer._id}
				userFrom={localStorage.getItem("userId")}
			/>
		);
		return (
			<Row gutter={[16, 16]}>
				<Col lg={18} xs={24}>
					<div style={{ width: "100%", padding: "3rem 4rem" }}>
						<video
							style={{ width: "100%" }}
							src={`http://localhost:5000/${VideoDetail.filePath}`}
							controls
						/>
						<List.Item actions={[subscribeButton]}>
							<List.Item.Meta
								avatar={<Avatar src={VideoDetail.writer.image} />}
								title={VideoDetail.writer.name}
								description={VideoDetail.description}
							/>
						</List.Item>
						{/* comments */}
					</div>
				</Col>
				<Col lg={6} xs={24}>
					<SideVideo videoId={videoId} />
				</Col>
			</Row>
		);
	} else {
		return <div>...Loading</div>;
	}
}

export default VideoDetailPage;
