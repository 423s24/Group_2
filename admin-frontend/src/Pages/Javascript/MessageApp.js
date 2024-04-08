// Importing necessary modules and components
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../Backend/Firebase';
import { getDocs, collection } from 'firebase/firestore';
import ChatBox from '../../components/ChatBox'; 
import SendMessage from '../../components/SendMessage';
import "../Styling/MessagingApp.css";
import logo from "../../Assets/hrdc-logo-1.png";

// The main MessageApp component definition
const MessageApp = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [user, loading, error] = useAuthState(auth); // Current user state, loading status, and error
    const [userData, setUserData] = useState(null); // State for storing user data
    const [messageThreads, setMessageThreads] = useState([]); // State for storing message threads
    const [selectedThreadId, setSelectedThreadId] = useState(null); // State for tracking the selected thread ID
    const scrollRef = useRef(); // Ref for managing scroll behavior

    // Effect hook to fetch user data and message threads once the user is authenticated
    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const docRef = collection(db, 'users');
                const querySnapshot = await getDocs(docRef);
                const users = querySnapshot.docs.map(doc => doc.data());
                const currentUserData = users.find(u => u.uid === user.uid);
                setUserData(currentUserData);
            };

            const fetchMessageThreads = async () => {
                const messageThreadsCollectionRef = collection(db, 'messageThreads');
                const querySnapshot = await getDocs(messageThreadsCollectionRef);
                const threadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessageThreads(threadsData);
            };

            fetchUserData();
            fetchMessageThreads();
        }
    }, [user]); // This effect depends on the `user` state

    // Function to handle user sign-out
    const signUserOut = () => {
        signOut(auth).then(() => {
            navigate('../login'); // Redirect to login after sign out
        }).catch((error) => {
            console.error('Error signing out: ', error);
        });
    };

    // Function to handle clicking on a message thread
    const handleThreadClick = (threadId) => {
        console.log("Thread clicked:", threadId);
        setSelectedThreadId(threadId); // Update the selectedThreadId state
        console.log("Updated selectedThreadId:", threadId);
    };

    // The component's rendered JSX
    return (
        <div>
            <Helmet>
                <title>Message App</title> {/* Sets the page title */}
            </Helmet>
            <div className="home-container">
                <div className="header">
                    <Link to="/" className="home-button">
                        <img src={logo} alt="HRDC Logo" className="logo" /> {/* Logo and link to home */}
                    </Link>
                    {userData && <h1>Welcome, {userData.name}</h1>} {/* Greeting the user */}
                    <button onClick={signUserOut}>Sign Out</button> {/* Sign-out button */}
                </div>
                <div className="message-threads">
                    <ul>
                        {messageThreads.map(thread => (
                            <li key={thread.id} onClick={() => handleThreadClick(thread.id)}>
                                {thread.name} {/* Listing message threads */}
                            </li>
                        ))}
                    </ul>
                    {selectedThreadId && (
                        <>  {/* Conditional rendering of ChatBox and SendMessage based on selectedThreadId */}
                            <ChatBox messageId={selectedThreadId} />
                            <SendMessage scroll={scrollRef} messageThreadId={selectedThreadId} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Exporting the component for use in other parts of the app
export default MessageApp;
