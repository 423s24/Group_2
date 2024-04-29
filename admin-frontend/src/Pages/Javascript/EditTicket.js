import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../../Backend/Firebase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../Styling/ticket.css";

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
        <div className="edit-ticket-wrapper">
            <Header />
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
                                    <select name="status" value={editedTicket.status} onChange={handleInputChange}>
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </label>
                                <label>
                                    <p>Description:</p>
                                    <input type="text" name="description" value={editedTicket.description} onChange={handleInputChange} />
                                </label>
                                <label>
                                    <p>Urgency:</p>
                                    <select name="urgency" value={editedTicket.urgency} onChange={handleInputChange}>
                                        <option value='Low'>Low</option>
                                        <option value='Medium'>Medium</option>
                                        <option value='High'>High</option>
                                        <option value='Critical'>Critical</option>
                                    </select>
                                </label>
                                <label>
                                    <p>Service Type:</p>
                                    <select name="serviceType" value={editedTicket.serviceType} onChange={handleInputChange}>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Building">Building</option>
                                        <option value="Appliance">Appliance</option>
                                    </select>
                                </label>
                                <label>
                                    <p>Address:</p>
                                    <input type="text" name="address" value={editedTicket.address} onChange={handleInputChange} />
                                </label>
                                <label>
                                    <p>Area of Building:</p>
                                    <input type="text" name="area" value={editedTicket.area} onChange={handleInputChange} />
                                </label>
                            </div>
                        )}

                        <div className="edit-ticket-buttons">
                            <button type="submit">Save</button>
                            <button type="button"><Link to={`/ticket/${id}`} className="cancel">Cancel</Link></button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditTicket;