import React, { useState } from "react";
import { auth, db } from "../backend/Firebase";
import { addDoc, collection, serverTimestamp, doc } from "firebase/firestore";

// SendMessage component definition receiving scroll and messageThreadId props
const SendMessage = ({ scroll, messageThreadId }) => {
  // State for the message text
  const [message, setMessage] = useState("");
  // State to indicate if a message is being sent
  const [isSending, setIsSending] = useState(false);

  // Function to handle sending a message
  const sendMessage = async (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    // Check if the messageThreadId is available
    if (!messageThreadId) {
      console.error("No messageThreadId provided");
      return;
    }

    // Check if the message is not just empty spaces
    if (message.trim() === "") {
      alert("Enter a valid message");
      return;
    }

    setIsSending(true); // Indicate that sending has started
    const { uid, displayName, photoURL } = auth.currentUser; // Get user details from auth

    try {
      // Create a new message object
      const messageData = {
        text: message,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(), // Use server timestamp for consistency
        uid,
      };

      // Get a reference to the 'messages' sub-collection inside the specific 'messageThread'
      const messageThreadRef = doc(db, "messageThreads", messageThreadId);
      const messagesRef = collection(messageThreadRef, "messages");

      // Add the new message to Firestore
      await addDoc(messagesRef, messageData);
      console.log("Message sent successfully");
      setMessage(""); // Clear the message input after sending
      scroll.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the bottom of the chat
    } catch (error) {
      console.error("Error sending message: ", error);
      alert("An error occurred while sending the message."); // Show error alert
    } finally {
      setIsSending(false); // Reset the isSending state
    }
  };

  // Render the form for sending a message
  return (
    <form onSubmit={sendMessage} className="send-message" style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <input
        style={{ flex: 1, marginRight: "10px" }}  // Input takes most space, with margin to button
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isSending}
      />
      <button type="submit" disabled={isSending} style={{ flexShrink: 0 }}>Send</button>
    </form>
  );
};

export default SendMessage; // Export the SendMessage component
