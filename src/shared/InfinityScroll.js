import React from "react";
import _ from 'lodash';
import { Spinner } from "../elements";

const InfinityScroll = (props) => {

	const {children, callNext, is_next, loading} = props;

	const _handleScroll = _.throttle(() => {
		// 로딩중이면 callNext 실행안행(리소스 줄이기)
		if(loading) {
			return;
		}

		const {innerHeight} = window;
		const {scrollHeight} = document.body;

		// document.documentElement 있으면 scrollTop 가져오기, 아니면 document.body.scrollTop 가져오기(이렇게 해야 모든 브라우저 지원)
		// 크롬만 생각하면 document.body.scrollTop 만 적어주면 된다.
		const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

		//200보다 scrollHeight 높이가 작아지면
		if(scrollHeight - innerHeight - scrollTop < 200) {
			callNext(); //다음 리스트 실행
		}
	}, 300);

	const handleScroll = React.useCallback(_handleScroll, [loading]);

	React.useEffect(() => {
		//loading중이면 실행 안함
		if(loading) {
			return;
		}

		if(is_next) {
			window.addEventListener('scroll', handleScroll);
		}else{
			window.removeEventListener('scroll', handleScroll);
		}

		return () => window.removeEventListener('scroll', handleScroll); //unMount
	}, [is_next, loading]);

	return (
		<React.Fragment>
			{props.children}
			{is_next && (<Spinner/>)}
		</React.Fragment>
	)
}

InfinityScroll.defaultProps = {
	children: null,
	callNext: () => {},
	is_next: false,
	loading: false,
}

export default InfinityScroll;