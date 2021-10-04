import React from "react";
import _ from "lodash";

const Search = () => {

	const [text, setText] = React.useState('');

	// const onChange = (e) => {
	// 	setText(e.target.value);
	// 	// console.log(e.target.value);
	// 	keyPress(e);
	// }

	const debounce = _.debounce((e) => {
		console.log('debounce ::: ', e.target.value)
	}, 1000);

	const throttle = _.throttle((e) => {
		console.log('throttle ::: ', e.target.value);
	}, 1000);

	//useCallback은 함수를 저장한다. 재랜더링이 되더라도 함수를 초기화하지 않는다.
	const keyPress = React.useCallback(debounce, []); 

	return (
		<div>
			<input type="text" onChange={keyPress} value={text} />
		</div>
	)
}

export default Search;