import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../Backend/Firebase';
import { getDocs, collection } from 'firebase/firestore';
import ChatBox from '../../components/ChatBox'; 
import SendMessage from '../../components/SendMessage';
import Message from '../../components/Message';
import "../Styling/MessagingApp.css";
import logo from "../../Assets/hrdc-logo-1.png";

const MessageApp = () => {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [messageThreads, setMessageThreads] = useState([]);
    const [selectedThreadId, setSelectedThreadId] = useState(null); 
    const scrollRef = useRef(); // Renamed 'scroll' to 'scrollRef'

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = collection(db, 'users');
                const querySnapshot = await getDocs(docRef);
                const users = querySnapshot.docs.map(doc => doc.data());
                const currentUserData = users.find(u => u.uid === user.uid);
                setUserData(currentUserData);
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };

        const fetchMessageThreads = async () => {
            try {
                const messageThreadsCollectionRef = collection(db, 'messageThreads');
                const querySnapshot = await getDocs(messageThreadsCollectionRef);
                const threadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessageThreads(threadsData);
            } catch (error) {
                console.error('Error fetching message threads: ', error);
            }
        };

        if (user) {
            fetchUserData();
            fetchMessageThreads();
        }
    }, [user]);

    const signUserOut = () => {
        signOut(auth)
            .then(() => {
                navigate('../login');
            })
            .catch((error) => {
                console.error('Error signing out: ', error);
            });
    };

    return (
        <div>
            <Helmet>
                <title>Message App</title>
            </Helmet>
            <div className="home-container">
                <div className="header">
                    <Link to="/" className="home-button">
                        <img src={logo} alt="HRDC Logo" className="logo" />
                    </Link>
                    {userData && <h1>Welcome, {userData.name}</h1>}
                    <button onClick={signUserOut}>Sign Out</button>
                </div>
                <div className="message-threads">
                    <ul>
                        {messageThreads.map(thread => (
                            <li key={thread.id}>
                                <Link to={`/messageApp/${thread.id}`}>{thread.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <ChatBox messageId={selectedThreadId} />
                    <SendMessage scroll={scrollRef} messageThreadId={selectedThreadId} /> {/* Pass the ref */}
                </div>
            </div>
        </div>
    );
};

export default MessageApp;
