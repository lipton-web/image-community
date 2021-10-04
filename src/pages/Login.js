import React from 'react';
import { Button, Grid, Input, Text } from '../elements';
import { deleteCookie, getCookie, setCookie } from '../shared/Cookie';

import {useDispatch} from 'react-redux';
import {actionCreators as userActions} from '../redux/modules/user';
import { emailCheck } from '../shared/common';

const Login = (props) => {
  const dispatch = useDispatch();

  //유저 아이디, 비밀번호 받아오기 
  const [id, setId] = React.useState('');
  const [pwd, setPwd] = React.useState('');

  // 로그인 하기
  const login = () => {

    // console.log(id);
    // let _reg = /^[0-9a-zA-Z]([-_.0-9a-zA-Z])*@[0-9a-zA-z]([-_.0-9a-zA-Z])*.([a-zA-Z])*/;

    // console.log( _reg.test(id));
  

    if(id === '' || pwd === '') {
      window.alert('아이디 혹은 비밀번호가 공란입니다! 입력해주세요!');
      return;
    }

    if(!emailCheck(id)) {
      window.alert("이메일 형식이 맞지 않습니다.");
      return;
    }
    
    dispatch(userActions.loginFB(id, pwd));
  };

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text size="32px" bold>
          로그인
        </Text>

        <Grid padding="16px 0px">
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요"
            _onChange={(e) => {
              setId(e.target.value)
            }}
          />
        </Grid>

        <Grid padding="16px 0px">
          <Input
            label="패스워드"
            placeholder="패스워드를 입력해주세요"
            type="password"
            _onChange={(e) => {
              setPwd(e.target.value);
            }}
          />
        </Grid>

        <Button
          text="로그인 하기"
          // onclick={login()}
          _onClick={() => {
            login();
            // deleteCookie("user_id");
          }}
        ></Button>
      </Grid>
    </React.Fragment>
  );
};

export default Login;

