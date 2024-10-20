import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";

// INTERNAL IMPORT
import images from "../../../assets";
import { ChatAppContect } from "../../../Context/ChatAppContext";
import { converTime } from "../../../Utils/apiFeature";
import { Loader } from "../../index";
import Style from "./Chat.module.css";

const Chat = ({
  functionName, // This will be sendGlobalMessage
  friendMsg = [], // Global messages, passed from context
  account,
  userName,
  loading,
  currentUserName,
  currentUserAddress,
}) => {
  // STATE
  const [message, setMessage] = useState("");
  const { readGlobalMessages } = useContext(ChatAppContect);

  // Fetch global messages on component mount
  useEffect(() => {
    readGlobalMessages(); // Load messages when the component mounts
  }, [readGlobalMessages]);

  // Handle sending a new message (global)
  const sendMessage = async () => {
    if (!message.trim()) {
      alert("Please type your message"); // Alert user if message is empty
      return;
    }
    
    try {
      await functionName({ msg: message }); // Use await if functionName returns a promise
      setMessage(""); // Clear the input after sending
    } catch (error) {
      console.error("Error sending message:", error); // Log error in the console
      alert("Error sending message. Please try again."); // Inform the user
    }
  };

  // Handle key press to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={Style.Chat}>
      {/* Show current user info */}
      {currentUserName && currentUserAddress && (
        <div className={Style.Chat_user_info}>
          <Image src={images.accountName} alt="User Avatar" width={70} height={70} />
          <div className={Style.Chat_user_info_box}>
            <h4>{currentUserName}</h4>
            <p className={Style.show}>{currentUserAddress}</p>
          </div>
        </div>
      )}

      {/* Chat Box for Global Messages */}
      <div className={Style.Chat_box_box}>
        <div className={Style.Chat_box}>
          <div className={Style.Chat_box_left}>
            {friendMsg.length > 0 ? (
              friendMsg.map((el, i) => (
                <div key={i} className={Style.Chat_message}>
                  <div className={Style.Chat_box_left_title}>
                    <Image
                      src={images.accountName}
                      alt="Sender Avatar"
                      width={50}
                      height={50}
                    />
                    <span>
                      {el.sender} <small>Time: {converTime(el.timestamp)}</small>
                    </span>
                  </div>
                  <p>{el.msg}</p>
                </div>
              ))
            ) : (
              <p>No messages yet. Start the conversation!</p>
            )}
          </div>
        </div>

        {/* Message Input and Send Section */}
        <div className={Style.Chat_box_send}>
          <div className={Style.Chat_box_send_img}>
            <Image src={images.smile} alt="Emoji" width={50} height={50} />
            <input
              type="text"
              value={message}
              placeholder="Type your message"
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress} // Handle key press
            />
            <Image src={images.file} alt="Attach File" width={50} height={50} />
            {loading ? (
              <Loader />
            ) : (
              <Image
                src={images.send}
                alt="Send Message"
                width={50}
                height={50}
                onClick={sendMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
