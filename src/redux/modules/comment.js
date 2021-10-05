import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';
import { firestore, realtime } from '../../shared/firebase';
import 'moment';
import moment from 'moment';

import firebase from 'firebase';

import { actionCreators as postActions } from './post';

const SET_COMMENT = 'SET_COMMENT';
const ADD_COMMENT = 'ADD_COMMENT';

const LOADING = 'LOADING';

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
  post_id,
  comment_list,
}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
  post_id,
  comment,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: {},
  is_loading: false,
};

const addCommentFB = (post_id, contents) => {
  return function (dispatch, getState, { history }) {
    const commentDB = firestore.collection('comment');
    const user_info = getState().user.user;

    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format('YYYY-MM-DD hh:mm:ss'),
    };

    // firestore에 코멘트 정보를 넣어요!
    commentDB.add(comment).then((doc) => {
      const postDB = firestore.collection('post');

      const post = getState().post.list.find((l) => l.id === post_id);

      //   firestore에 저장된 값을 +1해줍니다!
      const increment = firebase.firestore.FieldValue.increment(1);

			// comment = {...comment, id: doc.id};
			// post에도 comment_cnt를 하나 플러스 해줍니다.
      postDB
        .doc(post_id)
        .update({ comment_cnt: increment })
        .then((_post) => {
					// comment를 추가해주고,
          dispatch(addComment(post_id, comment));

					// 리덕스에 post가 있을 때만 post의 comment_cnt를 +1해줍니다.
          if (post) {
            dispatch(
              postActions.editPost(post_id, {
                comment_cnt: parseInt(post.comment_cnt) + 1,
              })
            );
						// 알람이 가게 해준다. // 알림 리스트에 하나를 추가해줍니다!
						const _noti_item = realtime.ref(`noti/${post.user_info.user_id}/list`).push();

						_noti_item.set({
							post_id: post.id,
							user_name: comment.user_name,
							image_url: post.image_url,
							insert_dt: comment.insert_dt
						}, (err) => {
							if(err){
								console.log('알림 저장에 실패했어요! 8ㅛ8');
							}else{
								// 알림이 가게 해줍니다!
								const notiDB = realtime.ref(`noti/${post.user_info.user_id}`);
								// 읽음 상태를 false로 바꿔주면 되겠죠!
								notiDB.update({read: false});
							}
						});
          }
        });
    });
  };
};

const getCommentFB = (post_id = null) => {
  return function (dispatch, getState, { history }) {
    const commentDB = firestore.collection('comment');

    if (!post_id) {
      //포스트 id없으면 안되게
      return;
    }

    // where로 게시글 id가 같은 걸 찾고, (where 쿼리날리기)
    // orderBy로 정렬해줍니다.
    commentDB
      .where('post_id', '==', post_id)
      .orderBy('insert_dt', 'desc')
      .get()
      .then((docs) => {
        let list = [];

        docs.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });

        dispatch(setComment(post_id, list));
      })
      .catch((err) => {
        console.log('댓글 정보를 가져올 수가 없네요!', err);
      });
  };
};

export default handleActions(
  {
    [SET_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        // comment는 딕셔너리 구조로 만들어서,
        // post_id로 나눠 보관합시다! (각각 게시글 방을 만들어준다고 생각하면 구조 이해가 쉬워요.)
        draft.list[action.payload.post_id] = action.payload.comment_list;
      }),

    [ADD_COMMENT]: (state, action) => produce(state, (draft) => {
			draft.list[action.payload.post_id].unshift(action.payload.comment);
		}),

    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getCommentFB,
	addCommentFB,
  setComment,
  addComment,
};

export { actionCreators };
