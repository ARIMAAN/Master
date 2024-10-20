import React, { useContext } from "react";

// INTERNAL IMPORT
import { ChatAppContect } from "../../Context/ChatAppContext";
import Card from "./Card/Card";
import Chat from "./Chat/Chat";
import Style from "./GlobalChat.module.css";

const GlobalChat = () => {
  const {
    sendGlobalMessage, // Ensure this is the global message sending function
    account,
    friendLists,
    readMessage,
    userName,
    loading,
    friendMsg,
    currentUserName,
    currentUserAddress,
    readUser,
    userLists,
    addFriends,
  } = useContext(ChatAppContect);

  return (
    <div className={Style.Friend}>
      <div className={Style.Friend_box}>
        <div className={Style.Friend_box_left}>
          {userLists.map((el, i) => (
            <Card key={i} el={el} i={i} addFriends={addFriends} />
          ))}
          {friendLists.map((el, i) => (
            <Card
              key={i}
              el={el}
              i={i}
              readMessage={readMessage}
              readUser={readUser}
            />
          ))}
        </div>
        <div className={Style.Friend_box_right}>
          <Chat
            functionName={sendGlobalMessage} // Ensure this is the correct function
            friendMsg={friendMsg}
            account={account}
            userName={userName}
            loading={loading}
            currentUserName={currentUserName}
            currentUserAddress={currentUserAddress}
            readUser={readUser}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;
