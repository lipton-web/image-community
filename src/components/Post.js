import React from 'react';
import { Grid, Image, Text, Button } from '../elements/index';

import { history } from '../redux/configureStore';

const Post = (props) => {
  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
        

        <Grid is_flex width="auto">
          <Text>{props.insert_dt}</Text>
          {props.is_me && (
            <Button width="auto" margin="4px" padding="4px" _onClick={() => {history.push(`/write/${props.id}`)}}>
              수정
            </Button>
          )}
        </Grid>
      </Grid>

        <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid>

        <Grid>
          <Image shape="rectangle" src={props.image_url} />
        </Grid>

        <Grid padding="16px">
          <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

// 부모에서 프롭스 못받을때 오류나 화면 깨짐 방지
Post.defaultProps = {
  user_info: {
    user_name: 'jinsik',
    user_profile:
      'https://filminvalle.com/wp-content/uploads/2019/10/User-Icon.png',
  },
  image_url:
    'https://hddesktopwallpapers.in/wp-content/uploads/2015/09/wheat-field-picture.jpg',
  contents: '배경 내용이 들어가요',
  comment_cnt: 10,
  insert_dt: '2021-09-30 10:00:00',
  is_me: false,
};

export default Post;