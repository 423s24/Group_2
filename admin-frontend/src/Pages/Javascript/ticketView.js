import { Link, Navigate } from "react-router-dom";

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

            <h2>Ticket Information</h2>
            <p>Address: {ticket.address}</p>
            <p></p>
        </div>
    )
}

export default TicketInfo;