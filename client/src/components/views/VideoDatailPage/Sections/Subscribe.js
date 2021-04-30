import Axios from "axios";
import React, { useEffect, useState } from "react";

function Subscribe({ userTo, userFrom }) {
	const [IsSubscribed, setIsSubscribed] = useState(null);
	const [SubscribeNumber, setSubscribeNumber] = useState(0);

	useEffect(() => {
		const SubscribeNumbervariable = {
			userTo,
		};
		Axios.post("/api/subscribe/subscribeNumber", SubscribeNumbervariable).then(
			(response) => {
				if (response.data.success) {
					setSubscribeNumber(response.data.SubscribeNumber);
				} else {
					alert("Failed to get subscribers.");
				}
			}
		);
		const isSubscribedVariable = {
			userTo,
			userFrom,
		};
		Axios.post("/api/subscribe/isSubscribed", isSubscribedVariable).then(
			(response) => {
				if (response.data.success) {
					setIsSubscribed(response.data.isSubscribed);
				} else {
					console.log("Failed to get data");
				}
			}
		);
	}, []);

	function handleClick() {
		const subscribeVariable = {
			userTo,
			userFrom,
		};
		if (!IsSubscribed) {
			Axios.post("/api/subscribe/addSubscribe", subscribeVariable).then(
				(response) => {
					if (response.data.success) {
						setSubscribeNumber(SubscribeNumber + 1);
						setIsSubscribed(!IsSubscribed);
					} else {
						alert("Failed to subscribe.");
					}
				}
			);
		} else {
			Axios.post("/api/subscribe/unSubscribe", subscribeVariable).then(
				(response) => {
					if (response.data.success) {
						setSubscribeNumber(SubscribeNumber - 1);
						setIsSubscribed(!IsSubscribed);
					} else {
						alert("Failed to unSubscribe.");
					}
				}
			);
		}
	}

	return (
		<div>
			<button
				style={{
					backgroundColor: `${IsSubscribed ? "#AAAAAA" : "#CC0000"}`,
					borderRadius: "4px",
					color: "white",
					padding: "10px 16px",
					fontWeight: "500",
					fontSize: "1rem",
					textTransform: "uppercase",
				}}
				onClick={handleClick}
			>
				{SubscribeNumber} {IsSubscribed ? "Subscribed" : "Subscribe"}
			</button>
		</div>
	);
}

export default Subscribe;
