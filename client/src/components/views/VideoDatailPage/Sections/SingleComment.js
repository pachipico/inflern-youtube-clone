import React, { useEffect, useState } from "react";
import { Comment, Avater, Button, Input, Avatar } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

function SingleComment(props) {
	const [OpenReply, setOpenReply] = useState(false);
	const [CommentValue, setCommentValue] = useState("");
	const user = useSelector((state) => state.user);

	function onSubmit(e) {
		const variables = {
			writer: user.userData._id,
			postId: props.postId,
			content: CommentValue,
			responseTo: props.comment._id,
		};
		Axios.post("/api/comment/saveComment", variables).then((response) => {
			if (response.data.success) {
				props.refreshFunction(response.data.result);
			} else {
				alert("Failed to save comment.");
			}
		});
		e.preventDefault();
	}

	const toggleReplyTo = () => {
		setOpenReply(!OpenReply);
	};
	const actions = [
		<span onClick={toggleReplyTo} key='comment-basic-reply-to'>
			Reply to
		</span>,
	];
	const handleChange = (e) => {
		setCommentValue(e.currentTarget.value);
	};

	return (
		<div>
			<Comment
				actions={actions}
				author={props.comment.writer.name}
				avatar={<Avatar src={props.comment.writer.image} alt />}
				content={<p>{props.comment.content}</p>}
			/>
			{OpenReply && (
				<form style={{ display: "flex" }} onSubmit={onSubmit}>
					<textarea
						style={{ width: "100%", borderRadius: "5px" }}
						onChange={handleChange}
						value={CommentValue}
						placeholder='Write Your Comments.'
					/>

					<br />
					<button style={{ width: "20%", height: "52px" }} onClick>
						Submit
					</button>
				</form>
			)}
		</div>
	);
}

export default SingleComment;
