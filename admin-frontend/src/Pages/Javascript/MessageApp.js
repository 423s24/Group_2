import React from 'react';
import { ChatEngine} from 'react-chat-engine';
import "../Styling/MessagingApp.css"
import "../Styling/home.css"
import logo from "../../Assets/hrdc-logo-1.png";
import { Helmet } from "react-helmet";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Backend/Firebase";
import { getDoc, doc } from "firebase/firestore"; 
import { useEffect } from "react";
import { useState } from "react";

import ChatFeed from '../../components/ChatFeed';

const MessageApp = () => {

    const navigate = useNavigate();
    const user = auth.currentUser;
    const [userData, setUserData] = useState(null);

        useEffect(() => {
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

        fetchUserData();
    }, []);

    const signUserOut = () => {
        signOut(auth)
            .then(() => {
                navigate("../login");
            })
            .catch((error) => {
                // An error happened
                // TODO: Add error handling
            })
    }



    return (
        <div>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <div className="home-container">
                <div className="header">
                    <img src={logo} alt="HRDC Logo" className="logo" />
                    <div>
                        { userData && <h1>Welcome, {userData.name}</h1>}
                        <button onClick={signUserOut}>Sign Out</button>
                    </div>
                </div>
        <ChatEngine 
            height = "100vh"
            projectID = "ae105cf2-656d-46a9-8213-5907695293af" 
            userName = "admin"
            userSecret = "admin123"
            renderChatFeed = {(chatAppProps) => <ChatFeed {... chatAppProps} />}
        />
        </div>
    </div>
    )
}

export default MessageApp;