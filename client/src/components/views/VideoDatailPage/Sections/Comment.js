import Axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";

function Comment(props) {
	const user = useSelector((state) => state.user);
	const [Comment, setComment] = useState("");
	const [Comments, setComments] = useState([]);
	function onSubmit(e) {
		const variables = {
			writer: user.userData._id,
			postId: props.postId,
			content: Comment,
		};
		Axios.post("/api/comment/saveComment", variables).then((response) => {
			if (response.data.success) {
				console.log(response.data.result);
				props.refreshFunction(response.data.result);
				setComment("");
			} else {
				alert("Failed to save comment.");
			}
		});
		e.preventDefault();
	}
	function handleChange(e) {
		setComment(e.currentTarget.value);
	}

	return (
		<div>
			<br />
			<p>Replies</p>
			<hr />
			{/* comment Lists */}
			{props.commentList &&
				props.commentList.map(
					(comment, index) =>
						!comment.responseTo && (
							<SingleComment
								refreshFunction={props.refreshFunction}
								comment={comment}
								key={index}
								postId={props.postId}
							/>
						)
				)}
			{/* Root comment form */}

			<form style={{ display: "flex" }} onSubmit={onSubmit}>
				<textarea
					style={{ width: "100%", borderRadius: "5px" }}
					onChange={handleChange}
					value={Comment}
					placeholder='Write Your Comments.'
				/>

				<br />
				<button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
					Submit
				</button>
			</form>
		</div>
	);
}

export default Comment;
