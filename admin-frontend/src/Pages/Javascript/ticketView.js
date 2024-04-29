import { Link, useNavigate } from "react-router-dom";
import { db } from "../../Backend/Firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBell, faBolt, faBuilding, faClock, faExclamationTriangle, faFireBurner, faHourglassHalf, faWrench } from '@fortawesome/free-solid-svg-icons';

const TicketInfo = ({ ticketId, ticket, userRelatedTicketDocs, addressRelatedTicketDocs }) => {

    const navigate = useNavigate();
    const [status, setStatus] = useState(ticket.status);
    const [userDocId, setUserDocId] = useState(null);

    const showUserRelatedTickets = userRelatedTicketDocs.length > 0;
    // const showAddressRelatedTickets = addressRelatedTicketDocs.length > 0;

    const editTicket = () => {
        navigate(`/ticket/edit/${ticketId}`);
    }

    const handleInputChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus); // Update local state immediately
        
        try {
            const ticketRef = doc(db, "ticket", ticketId);

            await updateDoc(ticketRef, {
                status: newStatus // Update the status field in Firestore
            });

            console.log("Status Updated Successfully")
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    }

    // Fetch user document ID
    useEffect(() => {
        const fetchUserDocId = async () => {
            try {
                const userDocQuery = await db.collection("users").where("tickets", "array-contains", ticketId).limit(1).get();
                if (!userDocQuery.empty) {
                    setUserDocId(userDocQuery.docs[0].id);
                }
            } catch (error) {
                console.error("Error fetching user document ID: ", error);
            }
        };
        fetchUserDocId();
    }, [ticketId]);

    const handleDeleteTicket = async () => {
        // Ask for confirmation before deleting
        const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
        if (confirmDelete) {
            try {
                // Delete the ticket document from Firestore
                await deleteDoc(doc(db, "ticket", ticketId));
                console.log("Ticket deleted successfully");

                // Remove ticket ID from user's tickets array
                if (userDocId) {
                    const userDocRef = doc(db, "users", userDocId);
                    await updateDoc(userDocRef, {
                        tickets: arrayRemove(ticketId)
                    });
                    console.log("Ticket ID removed from user's tickets array");
                }

                // Redirect to home page or any other page after deletion
                navigate("/");
            } catch (error) {
                console.error("Error deleting ticket: ", error);
            }
        }
    }

    const urgencyClass = ticket.urgency + " urgency-text";
    const urgencyWrapperClass = ticket.urgency + "-urgency-wrapper urgency-wrapper";

    return (
        <div className="ticket-view">
            <div className="ticket-view-header">
                <div className="ticket-header-left">
                    <Link to="/" className="back-button-link">
                        <button className="back-button"><FontAwesomeIcon icon={faArrowLeft} /></button>
                    </Link>

                    <div className="ticket-title-container">
                        {ticket.serviceType == "Plumbing" && (
                            <FontAwesomeIcon icon={faWrench} />
                        )}
                        {ticket.serviceType == "Electrical" && (
                            <FontAwesomeIcon icon={faBolt} />
                        )}
                        {ticket.serviceType == "Appliance" && (
                            <FontAwesomeIcon icon={faFireBurner} />           
                        )}
                        {ticket.serviceType == "Building" && (
                            <FontAwesomeIcon icon={faBuilding} />           
                        )}
                        <h3 className="ticket-title">{ticket.title}</h3>
                    </div>
                </div>
                
                <div className="ticket-header-buttons">
                    <button onClick={editTicket} className="edit-button">Edit</button>
                    <button onClick={handleDeleteTicket} className="delete-button">Delete</button>
                </div>
            </div>

            <div className="ticket-view-subheader-wrapper">
                <div className="ticket-view-subheader">
                    
                    <div className={urgencyWrapperClass}>
                        <div className="icon-wrapper">
                            {ticket.urgency == "Low" && (
                                <FontAwesomeIcon icon={faClock} />
                            )}
                            {ticket.urgency == "Medium" && (
                                <FontAwesomeIcon icon={faHourglassHalf} />
                            )}
                            {ticket.urgency == "High" && (
                                <FontAwesomeIcon icon={faBell} />
                            )}
                            {ticket.urgency == "Critical" && (
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                            )}
                            
                        </div>
                        <p className={urgencyClass}><strong>{ticket.urgency}</strong></p>
                    </div>

                    <div className="select-wrapper">
                        <select name="status" value={status} onChange={handleInputChange}>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="type-wrapper">
                        <div className="icon-wrapper">
                            {ticket.serviceType == "Plumbing" && (
                                <FontAwesomeIcon icon={faWrench} />
                            )}
                            {ticket.serviceType == "Electrical" && (
                                <FontAwesomeIcon icon={faBolt} />
                            )}
                            {ticket.serviceType == "Appliance" && (
                                <FontAwesomeIcon icon={faFireBurner} />           
                            )}
                            {ticket.serviceType == "Building" && (
                                <FontAwesomeIcon icon={faBuilding} />           
                            )}
                        </div>
                        <p>{ticket.serviceType}</p>
                    </div>
                </div>
            </div>

            <div className="ticket-view-info">
                <div className="ticket-view-info-left">
                    <div className="info-section info-section-top">
                        <h3>Building Information</h3>

                        <div className="info-container">
                            <p className="heading">Address</p>
                            <p className="info-data">{ticket.address}</p>
                        </div>
                        <div className="info-container">
                            <p className="heading">Area of Building</p>
                            <p className="info-data">{ticket.area}</p>
                        </div>
                        <div className="info-container">
                            <p className="heading">Enter Without Tenant</p>
                            <p className="info-data">{ticket.enterPerms}</p>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Submitter Information</h3>

                        <div className="info-container">
                            <p className="heading">Name</p>
                            <p className="info-data">{ticket.submittedBy}</p>
                        </div>
                        {ticket.phone && (
                            <div className="info-container">
                                <p className="heading">Phone</p>
                                <p className="info-data"><a href={`tel:${ticket.phone}`}>{ticket.phone}</a></p>
                            </div>
                        )}
                        <div className="info-container">
                            <p className="heading">Email</p>
                            <p className="info-data"><a href={`mailto:${ticket.email}`}>{ticket.email}</a></p>
                        </div>
                        <div className="info-container">
                            <p className="heading">Created On</p>
                            <p className="info-data">{ticket.dateCreated ? new Date(ticket.dateCreated.seconds * 1000).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}</p>
                        </div>
                    </div>
                </div>

                <div className="ticket-view-info-right">
                    <div className="info-container">
                        <p className="heading">Description</p>
                        <p className="info-data">{ticket.description}</p>
                    </div>

                    {ticket.attachmentUrl && (
                        <div className="info-container">
                            <p className="heading">Attachment</p>
                            <img src={ticket.attachmentUrl} alt="Attachment" />
                        </div>
                    )}

                    {userRelatedTicketDocs && (
                        <div className="info-container">
                            <p className="heading" style={{marginBottom: 10, marginTop: 15}}>Related Tickets</p>
                            {userRelatedTicketDocs.map((userRelatedTicketDoc) => {
                                const userRelatedTicket = userRelatedTicketDoc.data()
                                return (
                                    <Link className="ticket-link" key={userRelatedTicketDoc.id} to={`/ticket/${userRelatedTicketDoc.id}`}>
                                        <div className="ticket-container">
                                            <h3>{userRelatedTicket.title}</h3>
                                            <p>Status: {userRelatedTicket.status}</p>
                                            <p>Address: {userRelatedTicket.address}</p>
                                            <p>Urgency: {userRelatedTicket.urgency}</p>
                                            <p>Service Type: {userRelatedTicket.serviceType}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                            {addressRelatedTicketDocs && addressRelatedTicketDocs.map((addressRelatedTicketDoc) => {
                                return (
                                    <Link className="ticket-link" key={addressRelatedTicketDoc.id} to={`/ticket/${addressRelatedTicketDoc.id}`}>
                                        <div className="ticket-container">
                                            <h3>{addressRelatedTicketDoc.title}</h3>
                                            <p>Status: {addressRelatedTicketDoc.status}</p>
                                            <p>Address: {addressRelatedTicketDoc.address}</p>
                                            <p>Urgency: {addressRelatedTicketDoc.urgency}</p>
                                            <p>Service Type: {addressRelatedTicketDoc.serviceType}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TicketInfo;