import React from "react";
import { Grid, Image, Text } from "../elements";
import Card from "../components/Card";

const Notification = (props) => {
	let noti = [
		{user_name: 'aaaaa', post_id: 'post1', Image_url: '' },
		{user_name: 'aaaaa', post_id: 'post2', Image_url: '' },
		{user_name: 'aaaaa', post_id: 'post4', Image_url: '' },
		{user_name: 'aaaaa', post_id: 'post3', Image_url: '' },
		{user_name: 'aaaaa', post_id: 'post5', Image_url: '' },
		{user_name: 'aaaaa', post_id: 'post6', Image_url: '' },
		{user_name: 'aaaaa', post_id: 'post7', Image_url: '' },
		{user_name: 'aaaaa', post_id: 'post8', Image_url: '' },
	];
	return (
		<React.Fragment>
			
			<Grid padding='16px' bg='#EFF6FF'>
				{noti.map((n) => {
					return (
						<Card key={n.post_id} {...n} />
					)
				})}
			</Grid>

		</React.Fragment>
	)
}

export default Notification;