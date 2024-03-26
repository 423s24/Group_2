import { Link, useNavigate } from "react-router-dom";

const TicketInfo = ({ ticketId, ticket, userRelatedTicketDocs, addressRelatedTicketDocs }) => {

    const navigate = useNavigate();
    console.log(ticket.id);

    const editTicket = () => {
        navigate(`/ticket/edit/${ticketId}`);
    }

    return (
        <div className="ticket-view-content">
            <div className="ticket-view-header">
                <Link to="/">
                    <button className="back-button">&lt;</button>
                </Link>
                <h3 className="ticket-title">{ticket.title}</h3>
                <button onClick={editTicket} className="edit-button">Edit</button>
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
                                    <p>Building Type: {userRelatedTicket.buildingType}</p>
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
                                    <p>Building Type: {addressRelatedTicketDoc.buildingType}</p>
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