import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp, doc, getDocs, query, where, orderBy, limit, getDoc } from "firebase/firestore";
import { db, auth } from '../backend/Firebase';
import "./home.css";
import { useNavigate } from 'react-router-dom';

export default function Home({ user }) {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState(null);
    const statusColors = { "open": "#23b848", "closed": "#bababa", "in progress": "#1165f5" };
    const [messageThreads, setMessageThreads] = useState([]);
    const [recipientList, setRecipientList] = useState([]); // Added state for recipient list
    const [userSearchQuery, setUserSearchQuery] = useState(''); // Added state for user search query
    const [selectedUsers, setSelectedUsers] = useState([]); // Added state for selected users
    const [filteredUsers, setFilteredUsers] = useState([]); // Added if there is a need to filter users
    const [showMessageApp, setShowMessageApp] = useState(false)



    useEffect(() => {
        if (userSearchQuery) {
            const filtered = recipientList.filter(user =>
                user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(recipientList);
        }
    }, [userSearchQuery, recipientList]);

    useEffect(()=>{
        const fetchTickets = async() => {
        try {
            const docRef = collection(db, "ticket");
            const docSnap = await getDocs(docRef);

            const ticketsData = docSnap.docs.filter(doc => doc.data().userId === user.uid)
            console.log(ticketsData)
            ticketsData.forEach(d => {
                console.log(d.data().dateCreated.toDate().toString())
            })

            if (ticketsData) {
                setTickets(ticketsData);
            } else {
                console.log("No such document");
            }
        } catch (error) {
            console.error("Error getting document: ", error);
        }
    }

    const fetchMessageThreads = async () => {
        try {
            const user = auth.currentUser;
            const q = query(
                collection(db, 'messageThreads'),
                where('participants', 'array-contains', user.uid)
            );
            const querySnapshot = await getDocs(q);
            let threads = await Promise.all(querySnapshot.docs.map(async (doc) => {
                const threadData = doc.data();
                const lastMessageData = await getLastMessage(doc.id);
                const participantsNames = await getParticipantsNames(threadData);
                return {
                    id: doc.id,
                    participantsNames,
                    lastMessage: lastMessageData.text,
                    lastMessageCreatedAt: lastMessageData.createdAt ? new Date(lastMessageData.createdAt.seconds * 1000) : new Date('1970-01-01'),  // Convert Firestore timestamp to JavaScript Date or use an old date if null
                    ...threadData
                };
            }));
    
            // Sort threads by lastMessageCreatedAt in descending order
            threads.sort((a, b) => b.lastMessageCreatedAt - a.lastMessageCreatedAt);
    
            setMessageThreads(threads);
        } catch (error) {
            console.error('Error fetching message threads:', error);
        }
    };
    
    
    // Function to fetch the last message of a thread
    const getLastMessage = async (threadId) => {
        const messagesRef = collection(db, `messageThreads/${threadId}/messages`);
        const lastMessageQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
        const messageSnapshot = await getDocs(lastMessageQuery);
        if (!messageSnapshot.empty) {
            const lastMessage = messageSnapshot.docs[0].data();
            return {
                text: lastMessage.text,  // Assuming 'text' is the field name for the message content
                createdAt: lastMessage.createdAt  // Get the timestamp
            };
        }
        return { text: "No messages", createdAt: null };  // Default values if no messages are found
    };
    

    const fetchUsers = async () => {
        try {
            const usersCollectionRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersCollectionRef);
            const users = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecipientList(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    fetchUsers();
    fetchMessageThreads();
    fetchTickets();
    }, [])

    // Event handler for navigating to message room
    // This function will now use threadId to navigate to the specific message thread
    const handleNavigateToMessageRoom = (threadId) => {
        navigate(`/messages/${threadId}`); // Navigate to the specific thread
    };


    // const handleCreateMessageThread = async () => {
    //     const activeUser = auth.currentUser;
    //     const selectedParticipants = [activeUser.uid, ...selectedUsers].sort();

    //     try {
    //         const threadsQuery = query(
    //             collection(db, "messageThreads"),
    //             where("participants", "array-contains", activeUser.uid)
    //         );
    //         const querySnapshot = await getDocs(threadsQuery);
    //         let existingThread = null;

    //         querySnapshot.forEach(doc => {
    //             const data = doc.data();
    //             const participants = data.participants.sort();
    //             if (participants.length === selectedParticipants.length && participants.every((val, index) => val === selectedParticipants[index])) {
    //                 existingThread = { id: doc.id, ...data };
    //             }
    //         });

    //         if (existingThread) {
    //             console.error("Error: Message thread with these participants already exists.");
    //             alert("Error: Message thread with these participants already exists.");
    //         } else {
    //             const docRef = await addDoc(collection(db, "messageThreads"), {
    //                 participants: selectedParticipants,
    //                 createdAt: serverTimestamp(),
    //             });
    //             navigate(`/messages/${docRef.id}`);
    //         }
    //     } catch (error) {
    //         console.error("Error creating/checking message thread: ", error);
    //         alert("An error occurred while checking or creating a message thread.");
    //     }
    // };

    const handleUserSearchQueryChange = (event) => {
        setUserSearchQuery(event.target.value);
    };

    const handleUserSelection = (event) => {
        const value = event.target.value;
        if (!selectedUsers.includes(value)) {
            setSelectedUsers(prevUsers => [...prevUsers, value]); // Correctly using setSelectedUsers
        }
    };

    const handleCreateMessageThread = async () => {
        const activeUser = auth.currentUser;
        const selectedParticipants = [activeUser.uid, ...selectedUsers].sort();
    
        // Check if selectedUsers is empty (excluding the active user)
        if (selectedUsers.length === 0) {
            alert("Please select at least one other user to start a message thread.");
            return; // Stop execution if no users are selected
        }
    
        try {
            // Query to find if a thread with these exact participants exists
            const threadsQuery = query(
                collection(db, "messageThreads"),
                where("participants", "array-contains", activeUser.uid)
            );
    
            const querySnapshot = await getDocs(threadsQuery);
            let existingThread = null;
    
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const participants = data.participants.sort();
                if (participants.length === selectedParticipants.length && participants.every((val, index) => val === selectedParticipants[index])) {
                    existingThread = { id: doc.id, ...data };
                }
            });
    
            if (existingThread) {
                // Instead of navigating to the existing thread, throw an error
                console.error("Error: Message thread with these participants already exists.");
                alert("Error: Message thread with these participants already exists.");
            } else {
                // Create a new thread if it doesn't exist
                const docRef = await addDoc(collection(db, "messageThreads"), {
                    participants: selectedParticipants,
                    createdAt: serverTimestamp(),
                });
                console.log("Message thread created with ID: ", docRef.id);
                navigate(`/MessageApp/${docRef.id}`);
            }
        } catch (error) {
            console.error("Error creating/checking message thread: ", error);
            alert("An error occurred while checking or creating a message thread.");
        }
    };
    

    const getParticipantsNames = async (thread) => {
        const currentUser = auth.currentUser.uid;
        const otherParticipants = thread.participants.filter(pid => pid !== currentUser);
        const names = otherParticipants.map(async (participantId) => {
            const participantRef = doc(db, 'users', participantId);
            const participantSnap = await getDoc(participantRef);
            return participantSnap.data().name;
        });
        return Promise.all(names);
    };

    

    const Ticket = ({ticketData}) => {
        const [show, setShow] = useState(false)

        return (
            <div style={{width: "100%", background:"#F9F9F9", padding:"10px", paddingLeft:"20px", marginBottom: "10px", borderRadius: "10px"}}>
                <div style={{display:"grid", gridAutoFlow:"column"}}>
                <div style={{ display:"flex", flexDirection:"column"}}>

                <p>
                {ticketData.dateCreated.toDate().toString().split(" ").slice(0, 4).join(" ")}
                </p>
            
                <div style={{marginTop: "20px"}}>
                    <div className='ticketHeader' style={{display:"flex"}}> <h2 className="ticketTitle" style={{marginRight: "10px"}}>{ticketData.title}</h2>
                    <p className="statusIcon"style={{padding:"3px 10px 3px 10px",width:"fit-content",border: `1px solid ${statusColors[ticketData.status.toLowerCase()]}`, borderRadius: "100px", color: statusColors[ticketData.status.toLowerCase()] }}>{ticketData.status}</p></div>
                </div>
                </div>
                
                <button style={{alignSelf:"center", justifySelf:"end", border: "1px solid #bababa", padding:"10px 15px 10px 15px",  borderRadius: "10px"}} onClick={() => {setShow(!show)}}>
                    {show ? "Hide" : "View"}
                </button>
                </div>
                {show ? 
                    <div style={{margin: "40px 0 20px 0"}}>
                        <p>{ticketData.description}</p>
                    </div>
                :""}
            </div>
        )

    }


    const MessageApp = () => {
        return(
            <div className="messaging-section">
                <h1 className="sectionHeader" style={{color:"#97c33c", marginBottom: "40px"}}>Message Threads</h1>
                    <h2 className="sectionHeader" style={{ marginBottom: "10px"}}>Start New Message Thread</h2>
                        <div className="messaging-new-thread">
                            <input type="text" value={userSearchQuery} onChange={handleUserSearchQueryChange} placeholder="Search users..."/>
                            <select onChange={handleUserSelection} value={selectedUsers} className="user-select-dropdown" style={{marginLeft: "10px"}} >
                                {filteredUsers.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                            <button onClick={handleCreateMessageThread} style={{marginBottom: "15px", marginLeft: "10px"}}>Start Message Thread</button>
                        </div>
                    {messageThreads.map((thread) => (
                        <button key={thread.id} onClick={() => handleNavigateToMessageRoom(thread.id)} style={{
                            padding: "10px 20px", 
                            fontSize: "16px", 
                            cursor: "pointer", 
                            marginTop: "10px",
                            width: "100%",  // Set width to 100% to fill the container
                            textAlign: "center",
                             // Center the text inside the button
                        }}>
                            {Array.isArray(thread.participantsNames) ? thread.participantsNames.join(', ') : ''}
                        </button>
                    ))}
            </div>
        )
    }

    return (
        <div style={{ width: "100%", minHeight: "100vh"}}>
            <div className='newRequestButton' style={{ padding: "40px", paddingLeft: "20px", borderBottom: "1px solid #bababa", display: "flex", justifyContent: "center" }} onClick={() => navigate("/maintenance")}>
                <div style={{ display: "grid", gridAutoFlow: "column", alignItems: "center" }}>
                    <h1 className="sectionHeader" style={{ paddingRight: "10px" }}>Submit New Maintenance Request</h1>
                    <div className="plusButton" style={{ width: "30px", height: "30px", borderRadius: "100px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "Bold", fontSize: "24px" }}>+</div>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="messageContainer" style={{ width: "33%", border: "1px solid #bababa", borderRadius: "15px", background: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="messaging-section">
                        <h1 className="sectionHeader" style={{color:"#97c33c", marginBottom: "40px"}}>Message Threads</h1>
                            {/* <h2 className="sectionHeader" style={{ marginBottom: "10px"}}>Start New Message Thread</h2>
                                <div className="messaging-new-thread">
                                    <input type="text" value={userSearchQuery} onChange={handleUserSearchQueryChange} placeholder="Search users..." />
                                    <select onChange={handleUserSelection} value={selectedUsers} className="user-select-dropdown">
                                        {filteredUsers.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                    <button onClick={handleCreateMessageThread} style={{marginBottom: "15px"}}>Start Message Thread</button>
                                </div> */}
                            {messageThreads.map((thread) => (
                                <button key={thread.id} onClick={() => handleNavigateToMessageRoom(thread.id)} style={{
                                    padding: "10px 20px", 
                                    fontSize: "16px", 
                                    cursor: "pointer", 
                                    marginTop: "10px",
                                    width: "100%",  // Set width to 100% to fill the container
                                    textAlign: "center"  // Center the text inside the button
                                }}>
                                    {Array.isArray(thread.participantsNames) ? thread.participantsNames.join(', ') : ''}
                                    <br />
                                    <strong>Last Message:</strong> {thread.lastMessage}
                                </button>
                            ))}
                    </div>
                </div>
                <div className="previousContainer" style={{width: "66%", border: "1px solid #bababa", borderRadius: "15px", background: "white", display:"flex", flexDirection: "column", alignItems:"center"}}>
                    <h1 className="sectionHeader" style={{color:"#97c33c", marginBottom: "40px"}}>Previous Requests</h1>
                    <div style={{width: "90%"}}>
                        <div style={{marginTop: "10px"}}>
                            {tickets?.map((ticket) => <Ticket key={ticket.id} ticketData={ticket.data()} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );  
}
