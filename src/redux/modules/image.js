import produce from "immer";
import { createAction, handleActions } from "redux-actions";

import { storage } from "../../shared/firebase";

// 액션타입
const UPLOADING = "UPLOADING"; // 업로드 중인지 아닌지
const UPLOAD_IMAGE = "UPLOAD_IMAGE"; // 실제로 파일을 업로드
const SET_PREVIEW = "SET_PREVIEW"; //업로드 파일 미리보기

// 액션 생성자
const uploading = createAction(UPLOADING, (uploading) => ({uploading}));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({image_url}));
const setPreview = createAction(SET_PREVIEW, (preview) => ({preview}));

const initialState = {
	image_url: '',
	uploading: false,
	preview: null,
}

// 파이어베이스 업로드
const uploadImageFB = (image) => {
	return function(dispatch, getState, {history}){
		// 업로드 시작시 uploading true, 끝나면 false.  and 다운로드 url 넣어주기
		dispatch(uploading(true));
		const _upload = storage.ref(`images/${image.name}`).put(image); //파베 스토리지에 이미지 올리기

		_upload.then((snapshot) => {
			console.log(snapshot);

			snapshot.ref.getDownloadURL().then((url) => {
				dispatch(uploadImage(url));
				console.log(url);
			})
		})
	}
}

// 리듀서
export default handleActions({
	[UPLOAD_IMAGE]: (state, action) => produce(state, (draft) => {
		draft.image_url = action.payload.image_url;
		draft.uploading = false;
	}),

	[UPLOADING]: (state, action) => produce(state, (draft) => {
		draft.uploading = action.payload.uploading
	}),

	[SET_PREVIEW]: (state, action) => produce(state, (draft) => {
		draft.preview = action.payload.preview;
	})

}, initialState);


const actionCreators = {
	uploadImage, uploadImageFB, setPreview,
}

export {actionCreators};