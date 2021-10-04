import React from "react";
import _ from 'lodash';

const InfinityScroll = (props) => {

	const {children, callNext, is_next, loading} = props;

	const _handleScroll = _.throttle(() => {
		// 로딩중이면 callNext 실행안행(리소스 줄이기)
		if(loading) {
			return;
		}

		const {innerHeight} = window;
		const {scrollHeight} = document.body;

		// const scrollTop = 

		callNext(); //다음 리스트 실행
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