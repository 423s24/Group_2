import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { db } from "../../Backend/Firebase";

const EditTicketLoader = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        const fetchTicket = async() => {
            try {
                const ticketDoc = await getDoc(doc(db, "ticket", id));
                if (ticketDoc.exists()) {
                    const ticketData = ticketDoc.data();
                    setTicket(ticketData);
                } else {
                    console.log("Ticket not found");
                }
            } catch (error) {
                console.error("Error fetching ticket:", error);
            }
        };

        fetchTicket();
    }, [id]);

    const [editedTicket, setEditedTicket] = useState({ ...ticket });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTicket(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Update ticket information in the database
        console.log("Updated Ticket:", editedTicket);
        // Redirect back to the ticket view page
    };

    return (
        <div className="edit-ticket-container">
            <h2>Edit Ticket</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" name="title" value={editedTicket.title} onChange={handleInputChange} />
                </label>
                {/* Other input fields */}
                <button type="submit">Save</button>
                <Link to={`/ticket/${id}`}>Cancel</Link>
            </form>
        </div>
    );
}

export default EditTicketLoader;