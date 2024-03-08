import { Link } from "react-router-dom";

const TicketInfo = ({ ticket }) => {

    return (
        <div className="ticket-view-content">
            <div className="ticket-view-header">
                <Link to="/">
                    <button className="back-button">&lt;</button>
                </Link>
                <h3 className="ticket-title">{ticket.title}</h3>
                <button className="edit-button">Edit</button>
            </div>

            <div className="ticket-view-info">
                <div className="ticket-view-info-inner-section">
                    <h2>Basic Ticket Information</h2>
                    <p><strong>Status:</strong> {ticket.status}</p>
                    <p><strong>Description:</strong> {ticket.description}</p>
                    <p><strong>Urgency:</strong> {ticket.urgency}</p>
                    <p><strong>Service Type:</strong> {ticket.serviceType}</p>
                </div>
                
                <div className="ticket-view-info-inner-section">
                    <h2>Building Information</h2>
                    <p><strong>Address:</strong> {ticket.address}</p>
                    <p><strong>Building Type:</strong> {ticket.buildingType}</p>
                    <p><strong>Area of Building</strong> {ticket.area}</p>
                    <p><strong>Enter without Tenant Present:</strong> {ticket.enterPerms}</p>
                </div>

                <div className="ticket-view-info-inner-section">
                    <h2>Contact Information</h2>
                    <p><strong>Submitted By:</strong> {ticket.submittedBy}</p>
                    <p><strong>Phone:</strong> {ticket.phone}</p>
                    <p><strong>Email:</strong> {ticket.email}</p>
                </div>
            </div>
        </div>
    )
}

export default TicketInfo;