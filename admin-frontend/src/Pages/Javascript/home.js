import { signOut } from "firebase/auth"; // Importing signOut function from Firebase authentication
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for navigation
import { auth, db } from "../../Backend/Firebase"; // Importing Firebase authentication and Firestore database
import { getDoc, doc, collection, addDoc, getDocs } from "firebase/firestore"; // Importing Firestore functions
import { useEffect } from "react"; // Importing useEffect hook for side effects
import { useState } from "react"; // Importing useState hook for managing state
import "../Styling/home.css"; // Importing the CSS file for styling
import logo from "../../Assets/hrdc-logo-1.png"; // Importing the logo image
import { Helmet } from "react-helmet"; // Importing the Helmet component for setting the title of the page
import { Link } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate(); // Hook for navigation
    const user = auth.currentUser; // Get the current user from Firebase authentication
    const [userData, setUserData] = useState(null); // State for storing user data

    // State variables for managing tickets and filters
    const [tickets, setTickets] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRelated, setFilterRelated] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('dateCreated');
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

        // Call the fetch functions
        fetchTickets();
        fetchUserData();
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

    // Function to handle redirection to the messaging app
    const handleRedirctToMessage = () => {
        navigate('/MessageApp'); // Navigate to the MessageApp page
    };

    // Event handlers for filter changes
    const handleStatusFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const handleRelatedFilterChange = (event) => { 
        setFilterRelated(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };
    
    const handleAssignedToFilterChange = (event) => {
        setFilterAssignedTo(event.target.value);
    };

    // Function to toggle the new ticket form
    const handleToggleNewTicketForm = () => {
        setShowNewTicketForm(!showNewTicketForm);
    };

    // Filtering tickets based on user input
    const filteredTickets = tickets.filter(ticket => {
        let passesFilters = true;
        // Filter by status
        if (filterStatus !== 'all' && ticket.urgency.toString() !== filterStatus) {
            passesFilters = false;
        }
        // Filter by related service
        if (filterRelated !== 'all' && ticket.related !== filterRelated) {
            passesFilters = false;
        }
        // Filter by assigned to
        if (filterAssignedTo !== 'all' && ticket.assignedTo !== filterAssignedTo) {
            passesFilters = false;
        }
        // Filter by search query
        if (searchQuery) {
            passesFilters = Object.values(ticket).some(value => 
                typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    
        return passesFilters;
    });
        //const sortedTickets.sort((a, b) => {
    //    if (sortBy === 'newest') {
    //        return b.dateCreated - a.dateCreated; 
    //    } else if (sortBy === 'oldest') {
    //        return a.dateCreated - b.dateCreated; 
    //    } else if (sortBy === 'dateCreated') {
     //       
     //   }
    //    return 0;
    //});
    
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
                        <h2>Messaging</h2>
                        {/* Messaging section */}
                        <button onClick={handleRedirctToMessage}>Go to Messaging</button>
                    </div>
                    <div className="ticketing-section">
                        <h2>Ticket Management</h2>
                        <div className="filters">
                            {/* Filters section */}
                            {/* Search filter */}
                            <div className="filter">
                                <h3>Search</h3>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search by ticket description"
                                />
                            </div>
                            {/* Status filter */}
                            <div className="filter">
                                <h3>Status</h3>
                                <select value={filterStatus} onChange={handleStatusFilterChange}>
                                    <option value="all">All</option>
                                    <option value="open">Open</option>
                                    <option value="inProgress">In Progress</option>
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
                                <select value={filterStatus} onChange={handleStatusFilterChange}>
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
                                <h3>Assigned To</h3>
                                <select value={filterAssignedTo} onChange={handleAssignedToFilterChange}>
                                    <option value="all">All</option>
                                    <option value="user1">User 1</option>
                                    <option value="user2">User 2</option>
                                    <option value="user3">User 3</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>
                            <div className="filter">
                                <h3>Sort By Date</h3>
                                <select value={sortBy} onChange={handleSortChange}>
                                    <option value="dateCreated">Date Created</option>
                                    <option value="newest">Newest to Oldest Ticket</option> 
                                    <option value="oldest">Oldest to Newest Ticket</option> 
                                    </select>
                            </div>
                        </div>
                        <div className="toggle-new-ticket-form">
                    <button onClick={handleToggleNewTicketForm}>Add new Ticket</button>
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
                                    <input type="text" name="related" value={newTicketData.related} onChange={handleInputChange} />
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
                        {/* Display filtered tickets */}
                        <div className="ticket-list">
                            {filteredTickets.map(ticket => (
                                <Link className="ticket-link" to={`ticket/${ticket.id}`} >
                                    <div key={ticket.id} className="ticket-container">
                                        <div className="ticket">
                                            <h3>{ticket.title}</h3>
                                            <p>Address: {ticket.address}</p>
                                            <p>Phone: {ticket.phone}</p>
                                            <p>Urgency: {ticket.urgency}</p>
                                            <p>Availability: {ticket.availability}</p>
                                            <p>Area: {ticket.area}</p>
                                            <p>Related: {ticket.related}</p>
                                            <p>Description: {ticket.description}</p>
                                            <p>Service Type: {ticket.serviceType}</p>
                                            <p>Building Type: {ticket.buildingType}</p>
                                            <p>Details: {ticket.details}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <p>&copy; Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
                </div>
            </div>
        </div>
    );
}

export default HomePage; 