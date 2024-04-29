
import { signOut } from "firebase/auth"; // Importing signOut function from Firebase authentication
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for navigation
import { auth, db } from "../../Backend/Firebase"; // Importing Firebase authentication and Firestore database
import { getDoc, doc, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"; // Importing Firestore functions
import { query, where } from "firebase/firestore"; // Importing Firestore query functions
import { useEffect } from "react"; // Importing useEffect hook for side effects
import { useState } from "react"; // Importing useState hook for managing state
import "../Styling/home.css"; // Importing the CSS file for styling
import logo from "../../Assets/hrdc-logo-1.png"; // Importing the logo image
import { Helmet } from "react-helmet"; // Importing the Helmet component for setting the title of the page
import { Link } from "react-router-dom";
import { orderBy, limit } from "firebase/firestore";
import SendMessage from "../../components/SendMessage";

function HomePage() {
    const navigate = useNavigate(); // Hook for navigation
    const user = auth.currentUser; // Get the current user from Firebase authentication
    const [userData, setUserData] = useState(null); // State for storing user data

    // State variable for managin messaging
    const [messageThreads, setMessageThreads] = useState([]);
    const [recipientList, setRecipientList]  = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // State variables for search mechanics
    const [userSearchQuery, setUserSearchQuery] = useState(''); // For user search in messaging section
    const [ticketSearchQuery, setTicketSearchQuery] = useState(''); // For ticket search in ticketing section

    // State variables for managing tickets and filters
    const [tickets, setTickets] = useState([]);
    const [filterUrgency, setFilterUrgency] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRelated, setFilterRelated] = useState('all');
    //const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('dateCreated');
    const [sortByUrgency, setSortByUrgency] = useState('all');
    const [filterAssignedTo, setFilterAssignedTo] = useState('all');
    const [showNewTicketForm, setShowNewTicketForm] = useState(false);
    const [newTicketData, setNewTicketData] = useState({
        title:"",
        address: "",
        area: "",
        availability: "",
        buildingType: "",
        description: "",
        details: "",
        phone: "",
        related: "",
        relation: "",
        urgency: "",
        attachmentUrl: "",
    });

    useEffect(() => {
        // Fetch user data from Firestore
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

        // Fetch tickets from Firestore
        const fetchTickets = async () => {
            try {
                const ticketsCollectionRef = collection(db, "ticket");
                const querySnapshot = await getDocs(ticketsCollectionRef);
                const ticketsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTickets(ticketsData);
                
            } catch (error) {
                console.error("Error fetching tickets: ", error);
            }
        };



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
    
        
        

        // Call the fetch functions
        fetchUsers();
        fetchTickets();
        console.log(tickets)
        fetchUserData();
        fetchMessageThreads();
    }, []);

    // Function to sign out the user
    const signUserOut = () => {
        signOut(auth)
            .then(() => {
                navigate("../login"); // Navigate to the login page after sign out
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            })
    }



    // Event handlers for filter changes
    const handleStatusFilterChange = (event) => {
        setFilterStatus(event.target.value);
        console.log(event.target.value);
    };
    const handleUrgencyFilterChange = (event) => {
        setFilterUrgency(event.target.value);
        console.log(event.target.value);
    };

    const handleRelatedFilterChange = (event) => { 
        setFilterRelated(event.target.value);
        console.log(event.target.value);
    };

    //const handleSearchChange = (event) => {
    //   setSearchQuery(event.target.value);
    //};

    const handleTicketSearchChange = (event) => {
        setTicketSearchQuery(event.target.value)
    }
    
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        console.log(event.target.value);
    };
    const handleSortChangeByUrgency = (event) => {
        setSortByUrgency(event.target.value);
        console.log(event.target.value);
    };

    // Function to toggle the new ticket form
    const handleToggleNewTicketForm = () => {
        setShowNewTicketForm(!showNewTicketForm);
    };

    const newTicketButtonText = showNewTicketForm ? 'Cancel' : 'Add New Ticket';
    // Filtering tickets based on user input
    const filteredTickets = tickets.filter(ticket => {
        let passesFilters = true;
        // Filter by status
        if (filterStatus !== 'all' && ticket.status.toString() !== filterStatus) {
            passesFilters = false;
        }
        if (filterUrgency !== 'all' && ticket.urgency.toString() !== filterUrgency) {
            passesFilters = false;
        }
    
        // Filter by related service
        if (filterRelated !== 'all' && ticket.serviceType !== filterRelated) {
            passesFilters = false;
        }
        
        // Filter by search query
        if (ticketSearchQuery) {
            passesFilters = Object.values(ticket).some(value => 
                typeof value === 'string' && value.toLowerCase().includes(ticketSearchQuery.toLowerCase())
            );
        }
    
        return passesFilters;
    });
// Sorting tickets based on creation date
const sortedTickets = filteredTickets.slice().sort((a, b) => {
    const dateA = a.dateCreated ? a.dateCreated.toDate() : null;
    const dateB = b.dateCreated ? b.dateCreated.toDate() : null;

    if (sortBy === 'newest') {
        return dateB ? dateB - dateA : -1;
    } else if (sortBy === 'oldest') {
        return dateA ? dateA - dateB : 1;
    }
    // Default case, no sorting
    return 0;
});
// Sorting tickets based on urgency
const sortedByUrgency = filteredTickets.slice().sort((a, b) => {
    if (sortByUrgency === '1') {
        return a.urgency - b.urgency; // Sort by urgency from lowest to highest
    } else {
        return b.urgency - a.urgency; // Sort by urgency from highest to lowest
    }
});
    
    // Function to handle input changes in the new ticket form
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTicketData({ ...newTicketData, [name]: value });
    };

    // Function to handle ticket submission
    const handleTicketSubmission = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "ticket"), newTicketData);
            console.log("Ticket added with ID: ", docRef.id);

            setNewTicketData({
                title: "",
                address: "",
                area: "",
                availability: "",
                buildingType: "",
                description: "",
                details: "",
                phone: "",
                related: "",
                relation: "",
                urgency: "",
            });
        } catch (error) {
            console.log("Error adding ticket: ", error);
        }
    };


// Function to get participants' names in a chat room
    const getParticipantsNames = async (thread) => {
        const user = auth.currentUser;
        const participantIds = thread.participants.filter(id => id !== user.uid);
        const participantNames = await Promise.all(participantIds.map(async (id) => {
            return await getUserDisplayName(id);
        }));
        return participantNames;
    };


    const getUserDisplayName = async (userId) => {
        try {
          const docRef = collection(db, 'users');
          const userDoc = await getDocs(docRef);
          const user = userDoc.docs.find(doc => doc.id === userId)?.data();
          return user?.name || 'Unknown';
        } catch (error) {
          console.error('Error getting user display name:', error);
          return 'Unknown';
        }
      };
      
        // // Function to get the last message in a chat room
        // const getLastMessage = async (thread) => {
        //     try {
        //         const messagesRef = collection(db, 'messages');
        //         const q = query(
        //             messagesRef,
        //             where('messageThreads', '==', thread.id),
        //             orderBy('createdAt', 'desc'),
        //             limit(1)
        //         );
        //         const querySnapshot = await getDocs(q);
        //         const lastMessage = querySnapshot.docs[0]?.data();
        //         return lastMessage?.text || 'No messages';
        //     } catch (error) {
        //         console.error('Error getting last message:', error);
        //         return 'Error fetching message';
        //     }
        // };


        // Function to filter users based on the search query
        const filteredUsers = recipientList.filter(user =>
            user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
        );

        // Function to handle search query change
        const handleUserSearchQueryChange = (event) => {
            setUserSearchQuery(event.target.value);
        };

        const handleTciketSearchQueryChange = (event) => {
            setTicketSearchQuery(event.target.value);
        };

        // Function to handle user selection/deselection
        const handleUserSelection = (event) => {
            setSelectedUsers([event.target.value]);
        };

        const getLastMessage = async (threadId) => {
            const messagesRef = collection(db, 'messages');
            const q = query(messagesRef, where('threadId', '==', threadId), orderBy('createdAt', 'desc'), limit(1));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs[0]?.data().createdAt; // Assuming createdAt is stored correctly and available
        };
        
        

        const handleCreateMessageThread = async () => {
            const activeUser = auth.currentUser;
            const selectedParticipants = [activeUser.uid, ...selectedUsers].sort();
        
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
        

        // Event handler for navigating to message room
        // This function will now use threadId to navigate to the specific message thread
        const handleNavigateToMessageRoom = (threadId) => {
            navigate(`/MessageApp/${threadId}`); // Navigate to the specific thread
        };



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
                <div className="content">
                <div className="messaging-section">
                    <h2>Start New Message Thread</h2>
                    {/* Render search bar and list of users */}
                    <div className="messaging-new-thread">
                        <input
                            type="text"
                            value={userSearchQuery}
                            onChange={(handleUserSearchQueryChange)}
                            placeholder="Search users..."
                        />
                        <select onChange={handleUserSelection} value={selectedUsers} className="user-select-dropdown">
                            {filteredUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleCreateMessageThread}>Start Message Thread</button>
                    </div>
                    <div className="messaging-thread">
                        <h2>Message Threads</h2>
                            <ul>
                            {messageThreads && messageThreads.map(thread => (
                                <li key={thread.id}>
                                    {/* Render message thread information with participants' names */}
                                    <button onClick={() => handleNavigateToMessageRoom(thread.id)}>
                                    {Array.isArray(thread.participantsNames) ? thread.participantsNames.join(', ') : ''}
                                    <br />
                                    <strong>Last Message:</strong> {thread.lastMessage}
                                    </button>
                                </li>
                            ))}
                            </ul> 
                    </div>     
                </div>

                    <div className="ticketing-section">
                        <div className="ticketing-section-top-bar">
                            <h2>Ticket Management</h2>
                            <button onClick={handleToggleNewTicketForm}>{newTicketButtonText}</button>
                        </div>
                
                        <div className="search-filter">
                            <h3>Search</h3>
                            <input
                                type="text"
                                value={ticketSearchQuery}
                                onChange={handleTicketSearchChange}
                                placeholder="Search by ticket description"
                            />
                        </div>
                        <div className="filters">
                            {/* Filters section */}
                            {/* Search filter */}
                            
                            {/* Status filter */}
                            <div className="filter">
                                <h3>Status</h3>
                                <select value={filterStatus} onChange={handleStatusFilterChange}>
                                    <option value="all">All</option>
                                    <option value="open">Open</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            {/* Service filter */}
                            <div className="filter">
                                <h3>Related Service</h3>
                                <select value={filterRelated} onChange={handleRelatedFilterChange}>
                                    <option value="all">All</option>
                                    <option value="plumbing">Plumbing</option>
                                    <option value="electrical">Electrical</option>
                                    <option value="appliance">Appliance</option>
                                    <option value="building">Building</option>
                                </select>
                            </div>
                            {/* Service filter */}
                            <div className="filter">
                                <h3>Urgency</h3>
                                <select value={filterUrgency} onChange={handleUrgencyFilterChange}>
                                    <option value="all">All</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
    
                            <div className="filter">
                                <h4>Sort By Date </h4>
                                <select value={sortBy} onChange={handleSortChange}>
                                    <option value="dateCreated">Date Created</option>
                                    <option value="newest">Newest to Oldest Ticket</option> 
                                    <option value="oldest">Oldest to Newest Ticket</option> 
                                    </select>
                            </div>
                            <div className="filter">
                                <h4> Sort By Urgency</h4>
                                <select value={sortByUrgency} onChange={handleSortChangeByUrgency}>
                                    <option value="all">All</option>
                                    <option value="10">Most Urgent to Least Urgent</option>
                                    <option value="1">Least Urgent to Most Urgent</option>
                                    </select>
                            </div>

                        </div>
                        <div className="toggle-new-ticket-form">
                    
                    {showNewTicketForm && (
                        <div className="ticket-form">
                            <h3>Add New Ticket</h3>
                            <form onSubmit={handleTicketSubmission}>
                                <div>
                                    <label>Title:</label>
                                    <input type="text" name="title" value={newTicketData.title} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Address:</label>
                                    <input type="text" name="address" value={newTicketData.address} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Phone:</label>
                                    <input type="text" name="phone" value={newTicketData.phone} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Urgency:</label>
                                    <input type="text" name="urgency" value={newTicketData.urgency} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Availability:</label>
                                    <input type="text" name="availability" value={newTicketData.availability} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Area:</label>
                                    <input type="text" name="area" value={newTicketData.area} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Related:</label>
                                    <input type="text" name="related" value={newTicketData.serviceType} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Description:</label>
                                    <textarea name="description" value={newTicketData.description} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Building Type:</label>
                                    <input type="text" name="buildingType" value={newTicketData.buildingType} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Service Type:</label>
                                    <input type="text" name="servicetype" value={newTicketData.serviceType} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Details:</label>
                                    <input type="text" name="details" value={newTicketData.details} onChange={handleInputChange} />
                                </div>
                                <button type="submit">Create Ticket</button>
                            </form>
                        </div>
                        )}
                    </div>
                        <div className="ticket-list">
                            {sortByUrgency === 'all' ? (
                                // Display sorted tickets
                                sortedTickets.map(ticket => (
                                    <Link className="ticket-link" to={`ticket/${ticket.id}`} key={ticket.id}>
                                        <div className="ticket-container">
                                            <div className="ticket">
                                                <h3>{ticket.title}</h3>
                                                <p>Address: {ticket.address}</p>
                                                <p>Urgency: {ticket.urgency}</p>
                                                <p>Service Type: {ticket.serviceType}</p>
                                                <p>Building Type: {ticket.buildingType}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                // Display sorted tickets by urgency
                                sortedByUrgency.map(ticket => (
                                    <Link className="ticket-link" to={`ticket/${ticket.id}`} key={ticket.id}>
                                        <div className="ticket-container">
                                            <div className="ticket">
                                                <h3>{ticket.title}</h3>
                                                <p>Address: {ticket.address}</p>
                                                <p>Urgency: {ticket.urgency}</p>
                                                <p>Service Type: {ticket.serviceType}</p>
                                                <p>Building Type: {ticket.buildingType}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <p>&copy; 2024 Human Resources Development Council. All Rights Reserved. </p>
                </div>
            </div>
        </div>
    );
}

export default HomePage; 

                                   
