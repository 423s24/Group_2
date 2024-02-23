import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Backend/Firebase";
import { getDoc, doc } from "firebase/firestore"; 
import { useEffect } from "react";
import { useState } from "react";
import "../Styling/home.css";
import logo from "../../Assets/hrdc-logo-1.png";

function HomePage() {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [userData, setUserData] = useState(null);

    const [filterStatus, setFilterStatus] = useState('all'); // State for ticket status filtering
    const [filterService, setFilterService] = useState('all'); // State for ticket service filtering
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [filterAddress, setFilterAddress] = useState('all'); // State for ticket address filtering
    const [filterAssignee, setFilterAssignee] = useState('all'); // State for ticket assignee filtering
    const [filterCreationDate, setFilterCreationDate] = useState('all'); // State for ticket creation date filtering
    const [filterPriority, setFilterPriority] = useState('all'); // State for ticket priority filtering

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

    const handleStatusFilterChange = (event) => {
        const selectedStatus = event.target.value;
        setFilterStatus(selectedStatus);
    };

    const handleServiceFilterChange = (event) => {
        const selectedService = event.target.value;
        setFilterService(selectedService);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const handleAddressFilterChange = (event) => {
        const selectedAddress = event.target.value;
        setFilterAddress(selectedAddress);
    };

    const handleAssigneeFilterChange = (event) => {
        const selectedAssignee = event.target.value;
        setFilterAssignee(selectedAssignee);
    };

    const handleCreationDateFilterChange = (event) => {
        const selectedCreationDate = event.target.value;
        setFilterCreationDate(selectedCreationDate);
    };

    const handlePriorityFilterChange = (event) => {
        const selectedPriority = event.target.value;
        setFilterPriority(selectedPriority);
    };

    return (
        <div>
            <div className="home-container">
                <div className="header">
                    <img src={logo} alt="HRDC Logo" className="logo" />
                    <div>
                        <h1>Welcome, {userData.name}</h1>
                        <button onClick={signUserOut}>Sign Out</button>
                    </div>
                </div>
                <div className="content">
                    <div className="messaging-section">
                        <h2>Messaging</h2>
                        {/* Placeholder for messaging component */}
                        {/* TODO: Integrate messaging component here */}
                    </div>
                    <div className="ticketing-section">
                        <h2>Ticket Management</h2>
                        <div className="filters">
                        <div className="filter">
                                <h3>Search</h3>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search by ticket ID or description"
                                />
                            </div>
                            <div className="filter">
                                <h3>Status</h3>
                                <select value={filterStatus} onChange={handleStatusFilterChange}>
                                    <option value="all">All</option>
                                    <option value="open">Open</option>
                                    <option value="inProgress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            <div className="filter">
                                <h3>Service</h3>
                                <select value={filterService} onChange={handleServiceFilterChange}>
                                    <option value="all">All</option>
                                    {/* Add options for different services */}
                                    <option value="service1">Service 1</option>
                                    <option value="service2">Service 2</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>
                            <div className="filter">
                                <h3>Address</h3>
                                <select value={filterAddress} onChange={handleAddressFilterChange}>
                                    <option value="all">All</option>
                                    {/* Add options for different addresses */}
                                    <option value="address1">Address 1</option>
                                    <option value="address2">Address 2</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>
                            <div className="filter">
                                <h3>Assignee</h3>
                                <select value={filterAssignee} onChange={handleAssigneeFilterChange}>
                                    <option value="all">All</option>
                                    {/* Add options for different assignees */}
                                    <option value="assignee1">Assignee 1</option>
                                    <option value="assignee2">Assignee 2</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>
                            <div className="filter">
                                <h3>Creation Date</h3>
                                <select value={filterCreationDate} onChange={handleCreationDateFilterChange}>
                                    <option value="all">All</option>
                                    {/* Add options for different creation dates */}
                                    <option value="today">Today</option>
                                    <option value="thisWeek">This Week</option>
                                    <option value="thisMonth">This Month</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>
                            <div className="filter">
                                <h3>Priority</h3>
                                <select value={filterPriority} onChange={handlePriorityFilterChange}>
                                    <option value="all">All</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                        {/* Placeholder for displaying ticket list */}
                        {/* TODO: Display ticket list here */}
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