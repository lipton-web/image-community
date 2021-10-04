import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../elements";
import { storage } from "./firebase";

import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
	const dispatch = useDispatch();
	const is_uploading = useSelector(state => state.image.uploading);
	const fileInput = React.useRef();

	const selectFile = (e) => {
		console.log(e)
		console.log(e.target); //input 자체
		console.log(e.target.files[0]); //file 선택

		console.log(fileInput.current.files[0]);

		const reader = new FileReader(); //FileReader 함수 사용
		const file = fileInput.current.files[0];

		//파일 내용 읽음
		reader.readAsDataURL(file); 

		//읽기가 끝나면 받아 옴
		reader.onloadend = () => {
			console.log(reader.result);
			dispatch(imageActions.setPreview(reader.result));
		} 
	}

	const uploadFB = () => {
		let image = fileInput.current.files[0];
		dispatch(imageActions.uploadImageFB(image));
	}
		

	return (
		<React.Fragment>
			<input type="file" onChange={selectFile} ref={fileInput} disabled={is_uploading} />
			<Button _onClick={uploadFB}>업로드하기</Button>
		</React.Fragment>
	)

}

export default Upload;