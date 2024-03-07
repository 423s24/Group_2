import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Backend/Firebase";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../Styling/ticket.css";
import TicketInfo from "./ticketView";

function TicketLoader() {
    const { id } = useParams();
    console.log("Ticket ID:", id);

    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
          try {
            const ticketDoc = await getDoc(doc(db, "ticket", id));
            if (ticketDoc.exists()) {
              const ticketData = ticketDoc.data();
              console.log("Ticket Data:", ticketData);
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

    return (
        <div className="ticket-view-container">
          <Helmet>
            <title>{id}</title>
          </Helmet>
          <Header />

          {ticket ? 
            (
              <TicketInfo ticket={ticket}/>
            ) : 
            (
              <p>Loading...</p>
            )
          }
          
          <Footer />
        </div>
    )
}

export default TicketLoader;