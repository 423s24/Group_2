import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  where
} from "firebase/firestore";
import { db } from "../Backend/Firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";

// ChatBox component definition receiving a messageId prop
const ChatBox = ({ messageId }) => {
  // State to store fetched messages
  const [messages, setMessages] = useState([]);
  // useRef to maintain the mutable ref object for the scroll behavior
  const scroll = useRef();

  // useEffect hook to fetch messages based on the messageId
  useEffect(() => {
    // If messageId is not provided, exit the function early
    if (!messageId) return;

    // Creating a query to fetch messages that belong to the specified messageId
    const q = query(
      collection(db, "messages"),
      where("messageThreadId", "==", messageId),
      orderBy("createdAt", "desc"), // Ordering messages by creation time
      limit(50) // Limiting the number of messages fetched to 50
    );

    // Subscribing to the messages query to listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = [];
      // Iterating over each document in the snapshot
      querySnapshot.forEach((doc) => {
        // Pushing the message data along with its document ID into fetchedMessages array
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      // Sorting messages by creation time
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      // Updating the messages state with the sorted messages
      setMessages(sortedMessages);
    });

    // Returning an unsubscribe function to stop listening for updates when the component unmounts
    return () => unsubscribe();
  }, [messageId]); // This effect depends on the messageId

  // useEffect hook to handle auto-scrolling behavior when messages change
  useEffect(() => {
    // If the scroll ref is set, scroll into view smoothly
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This effect depends on the messages

  // Render the chat box with messages and a SendMessage component
  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {/* Rendering each message using the Message component */}
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      {/* Ref is attached to a span element for controlling scroll behavior */}
      <span ref={scroll}></span>
      {/* Rendering SendMessage component, passing it the scroll ref and messageThreadId */}
      <SendMessage scroll={scroll} messageThreadId={messageId} />
    </main>
  );
};

// Exporting the ChatBox component for use in other parts of the app
export default ChatBox;
