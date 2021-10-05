import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post";
import { Grid } from "../elements";
import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";

const PostList = (props) => {
	const dispatch = useDispatch();
	const post_list = useSelector((state) => state.post.list);
	const user_info = useSelector((state) => state.user.user);
	const is_loading = useSelector((state) => state.post.is_loading);
	const paging = useSelector((state) => state.post.paging);

	const {history} = props;

	React.useEffect(() => {
		// 가지고 있는 데이터가 0개, 1개일 때만 새로 데이터를 호출해요.
		if(post_list.length < 2){
			dispatch(postActions.getPostFB());
		}
		
	}, []);

	return (
		<React.Fragment>
			<Grid bg={'#EFF6FF'} padding="20px 0px">
			
				{/* <Post/> */}
				<InfinityScroll 
					callNext={() => {
						dispatch(postActions.getPostFB(paging.next)); //다음꺼 가져오기 액션
					}} 
					is_next={paging.next ? true : false} 
					loading={is_loading}
				>
					{post_list.map((p, idx) => {
						if(p.user_info.user_id === user_info?.uid) { //게시글 유저아이디랑 내 유저아이디랑 일치하면   p.user_info.user_id === user_info?.uid
							return (
								<Grid bg="#ffffff" margin="8px 0px" key={p.id} _onClick={() => {history.push(`/post/${p.id}`)}}>
									<Post key={p.id} {...p} is_me />
								</Grid>
							);
						}else{
							return (
								<Grid bg="#ffffff" margin="8px 0px" key={p.id} _onClick={() => {history.push(`/post/${p.id}`)}}>
									<Post {...p} />
								</Grid>
							);
						}
					})}
				
				</InfinityScroll>
			</Grid>	
			{/* <button onClick={() => {dispatch(postActions.getPostFB(paging.next))}}>추가로드</button> */}
		</React.Fragment>
	)

}

export default PostList;
