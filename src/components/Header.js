import React from "react";
import styled from "styled-components";
import { Button, Grid, Text } from "../elements";
import { deleteCookie, getCookie } from "../shared/Cookie";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import {history} from "../redux/configureStore";
import { apiKey } from "../shared/firebase";
import Permit from "../shared/Permit";

const Header = (props) => {
	const dispatch = useDispatch();
	// 로그인 상태 확인 state
	const is_login = useSelector((state) => state.user.is_login)

	// 세션 상태 확인, 리덕스에서도 상태 확인 해야 함
	const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

	const is_session = sessionStorage.getItem(_session_key)? true : false;
	console.log(is_session);
	// console.log(sessionStorage.getItem(_session_key));

	// is_login이 true일 때 헤더 바뀜
	if (is_login && is_session) {
		return (
			// <Permit>

				<React.Fragment>
					<Grid is_flex padding='4px 16px'>
			
						<Grid>
							<Text margin='0' size='24px' bold>헬로</Text>
						</Grid>
			
						<Grid is_flex>
							<Button text='내정보'></Button>
							<Button _onClick={() => {history.push('/noti')}} text='알림'></Button>
							<Button text='로그아웃' _onClick={() => {dispatch(userActions.logoutFB())}}></Button>
						</Grid>
			
					</Grid>
				</React.Fragment>

			// </Permit>
		)
	}


	

	return (
		<React.Fragment>
			<Grid is_flex padding='4px 16px'>

				<Grid>
					<Text margin='0' size='24px' bold>헬로</Text>
				</Grid>

				<Grid is_flex>
					<Button text='로그인' _onClick={() => {history.push('/login')}}></Button>
					<Button text='회원가입' _onClick={() => {history.push('/signup')}}></Button>
				</Grid>

			</Grid>
		</React.Fragment>
	)
}

Header.defaultProps = {

}

export default Header;