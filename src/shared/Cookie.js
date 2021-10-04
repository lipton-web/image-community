// 키값 기준으로 쿠키에 저장된 값을 가져오는 함수
const getCookie = (name) => {
	let value = "; "+document.cookie; //앞에 id값은 ;이 안붙어있어서 붙여 줌

	let parts = value.split(`; ${name}=`); // ; user_id= [aa=xx / aaa; abbb=sssss;]

	if(parts.length === 2) {
		return parts.pop().split(";").shift(); //shift는 첫번째 배열 반환
	}
};

// 쿠키에 저장하는 함수
const setCookie = (name, value, exp = 5) => {

	let date = new Date();
	date.setTime(date.getTime() + exp*24*60*60*1000);

	document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
};

// 만료일을 예전으로 설정해 쿠키를 지웁니다.
const deleteCookie = (name) => {
	let date = new Date("2020-01-01").toUTCString();

	console.log(date);
	document.cookie = name+"=; expires="+date;
}


export {getCookie, setCookie, deleteCookie}




