import { Link, useNavigate } from "react-router-dom";
import { db } from "../../Backend/Firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const TicketInfo = ({ ticketId, ticket, userRelatedTicketDocs, addressRelatedTicketDocs }) => {

    const navigate = useNavigate();
    const [status, setStatus] = useState(ticket.status);

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

    const urgencyClass = ticket.urgency + " urgency-text";
    const urgencyWrapperClass = ticket.urgency + "-urgency-wrapper urgency-wrapper";

    return (
        <div className="ticket-view-content">
            <div className="ticket-view-header">
                <Link to="/" className="back-button-link">
                    <button className="back-button">&lt;</button>
                </Link>
                <div className="ticket-title-container">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <h5>{ticket.dateCreated ? new Date(ticket.dateCreated.seconds * 1000).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}</h5>
                </div>
                <button onClick={editTicket} className="edit-button">Edit</button>
            </div>

            <div className="ticket-view-subheader">
                <div className={urgencyWrapperClass}>
                    <p className={urgencyClass}><strong>{ticket.urgency}</strong></p>
                </div>

                <div className="select-wrapper">
                    <select name="status" value={status} onChange={handleInputChange}>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="ticket-view-info">
                <div className="ticket-view-info-inner-section">
                    <h2>Basic Ticket Information</h2>
                    <p><strong>Description:</strong> {ticket.description}</p>
                    <p><strong>Service Type:</strong> {ticket.serviceType}</p>
                    {ticket.attachmentUrl && (
                        <div>
                            <h3>Attachment</h3>
                            <img style={{maxWidth: "500px"}} src={ticket.attachmentUrl} alt="Attachment" />
                        </div>
                    )}
                </div>
                
                <div className="ticket-view-info-inner-section">
                    <h2>Building Information</h2>
                    <p><strong>Address:</strong> {ticket.address}</p>
                    <p><strong>Area of Building</strong> {ticket.area}</p>
                    <p><strong>Enter without Tennant Present:</strong> {ticket.enterPerms}</p>
                </div>

                <div className="ticket-view-info-inner-section">
                    <h2>Contact Information</h2>
                    <p><strong>Submitted By:</strong> {ticket.submittedBy}</p>
                    <p><strong>Phone:</strong> {ticket.phone}</p>
                    <p><strong>Email:</strong> {ticket.email}</p>
                </div>

                <div className="ticket-view-info-inner-section">
                    <h2>Other Tickets Opened by This Person</h2>
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
                </div>

                <div className="ticket-view-info-inner-section">
                    <h2>Other Tickets Opened at this Address</h2>
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
            </div>
        </div>
    )
}

export default TicketInfo;