import React from "react";
import { Badge } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const NotiBadge = (props) => {
  const [is_read, setIsRead] = React.useState(true);
  const user_id =  useSelector(state => state.user.user.uid);

  const notiCheck = () => {
    const notiDB = realtime.ref(`noti/${user_id}`);
    //노티 아이콘 누르면 읽음 처리하기
    notiDB.update({read: true});
    props._onClick();
  };

  React.useEffect(() => {
    const notiDB = realtime.ref(`noti/${user_id}`);

    notiDB.on('value', (snapshot) => {
      console.log(snapshot.val());

      // 알림 표시
      setIsRead(snapshot.val().read);
    });

    // 리스너를 해제합시다!
    return () => notiDB.off();
  }, []);

  return (
    <React.Fragment>
      <Badge
        invisible={is_read}
        color="secondary"
        onClick={notiCheck}
        variant="dot"
      >
        <NotificationsIcon />
      </Badge>
    </React.Fragment>
  );
};

NotiBadge.defaultProps = {
  _onClick: () => {},
};

export default NotiBadge;