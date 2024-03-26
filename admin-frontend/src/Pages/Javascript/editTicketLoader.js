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
                    <div>
                        <label>
                            Status:
                            <input type="text" name="status" value={editedTicket.status} onChange={handleInputChange} />
                        </label>
                        <label>
                            Description:
                            <input type="text" name="description" value={editedTicket.description} onChange={handleInputChange} />
                        </label>
                        <label>
                            Urgency:
                            <input type="text" name="urgency" value={editedTicket.urgency} onChange={handleInputChange} />
                        </label>
                        <label>
                            Service Type:
                            <input type="text" name="serviceType" value={editedTicket.serviceType} onChange={handleInputChange} />
                        </label>
                        <label>
                            Address:
                            <input type="text" name="address" value={editedTicket.address} onChange={handleInputChange} />
                        </label>
                        <label>
                            Building Type:
                            <input type="text" name="buildingType" value={editedTicket.buildingType} onChange={handleInputChange} />
                        </label>
                        <label>
                            Area of Building:
                            <input type="text" name="area" value={editedTicket.area} onChange={handleInputChange} />
                        </label>
                    </div>
                )}
                <button type="submit">Save</button>
                <Link to={`/ticket/${id}`}>Cancel</Link>
            </form>
        </div>
    );
}

export default EditTicketLoader;