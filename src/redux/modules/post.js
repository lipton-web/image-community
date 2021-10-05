import { createAction, handleActions } from 'redux-actions';
import produce, { Produce } from 'immer';
import { firestore, storage } from '../../shared/firebase';
import moment from 'moment';

import { actionCreators as imageActions } from './image';

const SET_POST = 'SET_POST';
const ADD_POST = 'ADD_POST';
const EDIT_POST = 'EDIT_POST'; //포스트 수정
const LOADING = 'LOADING';

const setPost = createAction(SET_POST, (post_list, paging) => ({ post_list, paging }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const loading = createAction(LOADING, (is_loading) => ({is_loading}))

// 리듀서가 사용할 기본값
const initialState = {
  list: [],
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};

// 포스트 하나의 기본 값
const initialPost = {
  // id: 0,
  // user_info: {
  // 	user_name: 'jinsik',
  // 	user_profile: 'https://filminvalle.com/wp-content/uploads/2019/10/User-Icon.png'
  // },
  image_url:
    'https://hddesktopwallpapers.in/wp-content/uploads/2015/09/wheat-field-picture.jpg',
  contents: '',
  comment_cnt: 0,
  insert_dt: moment().format('YYYY-MM-DD hh:mm:ss'),
  // insert_dt: '2021-09-30 10:00:00',
};

const addPostFB = (contents = '') => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection('post');
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format('YYYY-MM-DD hh:mm:ss'),
    };

    const _image = getState().image.preview; //문자열로 사진을 가져온다. 문자열로만 표시

    console.log(_image);
    console.log(typeof _image);

    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, 'data_url');

    // url 확인
    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);

          return url;
          // FB store에 넣기
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace('/');
              //미리보기 사진 없애기
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert('앗! 포스트 작성에 문제가 있어요!');
              console.log('post 작성에 실패했어요.', err);
            });
        })
        .catch((err) => {
          window.alert('앗 이미지 업로드에 문제가 있어요!');
          console.log('앗! 이미지 업로드에 문제가 있어요!', err);
        });
    });
  };
};

const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {

		let _paging = getState().post.paging;

		if(_paging.start && !_paging.next) {
			return;
		}

		dispatch(loading(true));
    const postDB = firestore.collection('post');

    let query = postDB.orderBy('insert_dt', 'desc');

		if(start){
			query = query.startAt(start); 
		}

		//.limit(size + 1) 4개씩 가져오고 리덕스에는 3개만 넣어 줌
    query.limit(size + 1).get().then((docs) => {
      let post_list = [];

			let paging = {
				start: docs.docs[0],
				next: docs.docs.length === size+1 ? docs.docs[docs.docs.length -1] : null, //4개면 다음페이지 준비
				size: size,
			}

      docs.forEach((doc) => {
        // console.log(doc.id, doc.data());
        // 생긴거 맞춰주기
        let _post = doc.data();

        // ['comment_cnt', 'contents', ...]
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf('user_') !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        post_list.push(post);
      });

			post_list.pop(); //마지막 하나는 없애기

      console.log(post_list);

      dispatch(setPost(post_list, paging));
    });
  };
};

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log('게시물 정보가 없어요!');
      return;
    }

    const _image = getState().image.preview;
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection('post');

    if (_image === _post.image_url) {
      //미리보기 이미지와 포스트 이미지가 같으면 (이미지가 바뀌지 않았으면)
      //텍스트 수정
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace('/');
        });

      return;
    } else {
      //텍스트와 이미지 수정
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, 'data_url');

      // url 확인
      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);

            return url;
            // FB store에 넣기
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace('/');
              });
          })
          .catch((err) => {
            window.alert('앗 이미지 업로드에 문제가 있어요!');
            console.log('앗! 이미지 업로드에 문제가 있어요!', err);
          });
      });
    }
  };
};

const getOnePostFB = (id) => {
  return function(dispatch, getState, {history}) {
    const postDB = firestore.collection("post");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
        let _post = doc.data();

        if (!_post) {
          return;
        }

        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        dispatch(setPost([post], { start: null, next: null, size: 3 }));
      });
  }
}

// 리듀서
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);

        // post_id가 같은 중복 항목을 제거합시다! :)
        draft.list = draft.list.reduce((acc, cur) => {
          // findIndex로 누산값(cur)에 현재값이 이미 들어있나 확인해요!
          // 있으면? 덮어쓰고, 없으면? 넣어주기!
          if(acc.findIndex(a => a.id === cur.id) === -1) {
            return [...acc, cur];
          }else{
            //최근값으로 덮어 씌우기
            acc[acc.findIndex(a => a.id === cur.id)] = cur 
            return acc;
          }
        }, []);

        // paging이 있을 때만 넣기
        if(action.payload.paging){
          draft.paging = action.payload.paging;
        }
			
				draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post); //unshoft 배열의 맨 앞에 추가
      }, []),

    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
        //스프레드 문법 쓴 이유는 이미지나 문자수정 둘 중 하나만 할 수 있어서
      }),

			[LOADING]: (state, action) => produce(state, (draft) => {
				draft.is_loading = action.payload.is_loading;
			})
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
  editPost,
  editPostFB,
  getOnePostFB
};

export { actionCreators };
