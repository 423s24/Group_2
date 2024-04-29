// Importing necessary modules and components
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { auth, db } from '../backend/Firebase';
import { getDocs, collection, doc, getDoc, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import ChatBox from '../components/userChatBox';
import SendMessage from '../components/userSendMessage';
import "../styling/userMessagingApp.css"
import back_arrow from "../assets/images/back_arrow.webp";


// The main MessageApp component definition
const UserMessageApp = () => {
    let { threadId } = useParams();
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [user, loading, error] = useAuthState(auth); // Current user state, loading status, and error
    const [userData, setUserData] = useState(null); // State for storing user data
    const [messageThreads, setMessageThreads] = useState([]); // State for storing message threads
    const [selectedThreadId, setSelectedThreadId] = useState(null); // State for tracking the selected thread ID
    const scrollRef = useRef(); // Ref for managing scroll behavior
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

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

   
    return (
        
        <div>
            <Helmet>
                <title>Message App</title> {/* Sets the page title */}
            </Helmet>
                <div className='message-wrapper'>
                    <div style={{width: "100%"}}>
                    <Link to="/" className="home-button">
                        <img src={back_arrow} alt="Back Arrow" className="backarrow" style={{margin: "5px"}}/>
                    </Link>
                        {selectedThreadId && (
                            <>  {/* Conditional rendering of userChatBox and userSendMessage based on selectedThreadId */}
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
export default UserMessageApp;
