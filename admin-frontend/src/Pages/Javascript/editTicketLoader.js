import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../../Backend/Firebase";

const EditTicketLoader = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [editedTicket, setEditedTicket] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTicket = async() => {
            try {
                const ticketDoc = await getDoc(doc(db, "ticket", id));
                if (ticketDoc.exists()) {
                    const ticketData = ticketDoc.data();
                    setTicket(ticketData);
                    setEditedTicket(ticketData);
                } else {
                    console.log("Ticket not found");
                }
            } catch (error) {
                console.error("Error fetching ticket:", error);
            }
        };

        fetchTicket();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTicket(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const ticketRef = doc(db, "ticket", id);
            await updateDoc(ticketRef, editedTicket);
            console.log("Updated Ticket");
            navigate(`/ticket/${id}`);
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    return (
        <div className="edit-ticket-container">
            <h2>Edit Ticket</h2>
            <form onSubmit={handleSubmit}>
                {ticket && (
                    <label>
                        Title:
                        <input type="text" name="title" value={editedTicket.title} onChange={handleInputChange} />
                    </label>
                )}
                {/* Other input fields */}
                <button type="submit">Save</button>
                <Link to={`/ticket/${id}`}>Cancel</Link>
            </form>
        </div>
    );
}

export default EditTicketLoader;