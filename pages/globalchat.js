import React from "react";

//INTERNAL IMPORT
// import { ChatAppContect } from "../Context/ChatAppContext";
import { Filter, GlobalChat } from "../Components/index";

const ChatApp = () => {
  // const {} = useContext(ChatAppContect);
  return (
    <div>
      <Filter />
      <GlobalChat />
    </div>
  );
};

export default ChatApp;