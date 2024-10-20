import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

//INTERNAL IMPORT
import {
  ChechIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

export const ChatAppContect = React.createContext();

export const ChatAppProvider = ({ children }) => {
  //USESTATE
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [globalMessages, setGlobalMessages] = useState([]); // Global messages state
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");

  //CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  //FETCH DATA TIME OF PAGE LOAD
  const fetchData = async () => {
    try {
      const address = await ChechIfWalletConnected();
      if (address) {
        //GET CONTRACT
        const contract = await connectingWithContract();
        //GET ACCOUNT
        const connectAccount = await connectWallet();
        setAccount(connectAccount);
        //GET USER NAME
        const userName = await contract.getUsername(connectAccount);
        setUserName(userName);
        //GET MY FRIEND LIST
        const friendLists = await contract.getMyFriendList();
        setFriendLists(friendLists);

        //GET ALL APP USER LIST
        const userList = await contract.getAllAppUser();
        const newArray = userList.filter(
          (user) => user.accountAddress.toLowerCase() !== address
        );

        const filterArray = filterUsersExcludingFriends(newArray, friendLists);
        setUserLists(filterArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function filterUsersExcludingFriends(newArray, friendLists) {
    const friendAddresses = new Set(friendLists.map((friend) => friend.pubkey));
    return newArray.filter((user) => !friendAddresses.has(user.accountAddress));
  }

  useEffect(() => {
    fetchData();
  }, []);

  //READ MESSAGE (Private)
  const readMessage = async (friendAddress) => {
    try {
      const address = await ChechIfWalletConnected();
      if (address) {
        const contract = await connectingWithContract();
        const read = await contract.readMessage(friendAddress);
        setFriendMsg(read);
      }
    } catch (error) {
      console.log("Currently You Have no Message");
    }
  };

  //READ GLOBAL MESSAGES (Global)
  const readGlobalMessages = async () => {
    try {
      const address = await ChechIfWalletConnected();
      if (address) {
        const contract = await connectingWithContract();
        const globalMsgs = await contract.readGlobalMessages();
        setGlobalMessages(globalMsgs); // Store the global messages in state
      }
    } catch (error) {
      console.log("Error fetching global messages", error);
    }
  };

  //CREATE ACCOUNT
  const createAccount = async ({ name }) => {
    try {
      if (!name || !account)
        return setError("Name and Account Address cannot be empty");

      const contract = await connectingWithContract();
      const getCreatedUser = await contract.createAccount(name);
      setLoading(true);
      await getCreatedUser.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while creating your account, please reload browser");
    }
  };

  //ADD FRIENDS
  const addFriends = async ({ name, userAddress }) => {
    try {
      if (!name || !userAddress) return setError("Please provide data");
      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(userAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError("Something went wrong while adding friends, try again");
    }
  };

  //SEND PRIVATE MESSAGE TO FRIEND
  const sendMessage = async ({ msg, address }) => {
    try {
      if (!msg || !address) return setError("Please type your message");
      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Please reload and try again");
    }
  };

  //SEND GLOBAL MESSAGE (Global)
const sendGlobalMessage = async ({ msg }) => {
  try {
      if (!msg) return setError("Please type your message");
      const contract = await connectingWithContract();
      const addGlobalMessage = await contract.sendGlobalMessage(msg);
      setLoading(true);
      await addGlobalMessage.wait();
      setLoading(false);
      window.location.reload();
  } catch (error) {
      console.error("Error sending global message:", error); // Log the error
      setError("Error sending global message");
  }
};


  //READ USER INFO
  const readUser = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUsername(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };

  return (
    <ChatAppContect.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        sendGlobalMessage, // Added global message sending function
        readGlobalMessages, // Added global message reading function
        readUser,
        connectWallet,
        ChechIfWalletConnected,
        account,
        userName,
        friendLists,
        friendMsg,
        globalMessages, // Added global messages state
        userLists,
        loading,
        error,
        currentUserName,
        currentUserAddress,
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
