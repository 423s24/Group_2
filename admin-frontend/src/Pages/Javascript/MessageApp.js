// Importing necessary modules and components
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { auth, db } from '../../Backend/Firebase';
import { getDocs, collection, doc, getDoc, query, where } from 'firebase/firestore';
import ChatBox from '../../components/ChatBox'; 
import SendMessage from '../../components/SendMessage';
import "../Styling/MessagingApp.css";
import logo from "../../Assets/hrdc-logo-1.png";

// The main MessageApp component definition
const MessageApp = () => {
    let { threadId } = useParams();
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
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.log("No such document");
                    }
                } catch (error) {
                    console.error("Error getting document: ", error);
                }
            };
    
            const fetchMessageThreads = async () => {
                try {
                    const messageThreadsCollectionRef = collection(db, 'messageThreads');
                    // Fetching only the threads where the current user is a participant
                    const q = query(messageThreadsCollectionRef, where('participants', 'array-contains', user.uid));
                    const querySnapshot = await getDocs(q);
    
                    if (!querySnapshot.empty) {
                        const threadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setMessageThreads(threadsData);
                        console.log(threadsData)
                    } else {
                        console.log("No message threads found");
                        setMessageThreads([]); // Set to an empty array if no threads are found
                    }
                } catch (error) {
                    console.error("Error fetching message threads: ", error);
                }
            };
    
            fetchUserData();
            fetchMessageThreads();
        }

        if (threadId) {
            setSelectedThreadId(threadId);
        }

    }, [user, threadId]);
    
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

    console.log("Selected Thread ID: ", selectedThreadId)

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
