import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../../Backend/Firebase";

const EditTicket = () => {
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
        <div className="ticket-view-content">
            <div className="edit-ticket-view-content">
                <h1>Edit Ticket</h1>
                <form onSubmit={handleSubmit}>
                    {ticket && (
                        <div>
                            <label>
                                <p>Title:</p>
                                <input type="text" name="title" value={editedTicket.title} onChange={handleInputChange} />
                            </label>
                            <label>
                                <p>Status:</p>
                                <input type="text" name="status" value={editedTicket.status} onChange={handleInputChange} />
                            </label>
                            <label>
                                <p>Description:</p>
                                <input type="text" name="description" value={editedTicket.description} onChange={handleInputChange} />
                            </label>
                            <label>
                                <p>Urgency:</p>
                                <input type="text" name="urgency" value={editedTicket.urgency} onChange={handleInputChange} />
                            </label>
                            <label>
                                <p>Service Type:</p>
                                <input type="text" name="serviceType" value={editedTicket.serviceType} onChange={handleInputChange} />
                            </label>
                            <label>
                                <p>Address:</p>
                                <input type="text" name="address" value={editedTicket.address} onChange={handleInputChange} />
                            </label>
                            <label>
                                <p>Building Type:</p>
                                <input type="text" name="buildingType" value={editedTicket.buildingType} onChange={handleInputChange} />
                            </label>
                            <label>
                                <p>Area of Building:</p>
                                <input type="text" name="area" value={editedTicket.area} onChange={handleInputChange} />
                            </label>
                        </div>
                    )}
                    <div className="edit-buttons">
                        <button type="submit">Save</button>
                        <Link to={`/ticket/${id}`}><button type="button" className="cancel">Cancel</button></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditTicket;