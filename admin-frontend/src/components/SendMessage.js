import React, { useState } from "react";
import { auth, db } from "../Backend/Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const SendMessage = ({ scroll, messageThreadId }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    try {
      // Construct the message object
      const messageData = {
        text: message,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
        messageThreadId: messageThreadId, // Associate the message with the specific message thread
      };

      // Store the message in Firestore
      await addDoc(collection(db, "messageThreads"), messageData); // Update collection name to 'messages'
      console.log("Message sent successfully");

      // Clear the message input field
      setMessage("");

      // Scroll to the bottom of the chat window
      scroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <form onSubmit={sendMessage} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;
