import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Backend/Firebase";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../Styling/ticket.css";
import TicketInfo from "./ticketView";
import LoadingScreen from "../../components/LoadingScreen";

function TicketLoader() {
    const { id } = useParams();

    const [ticket, setTicket] = useState(null);
    const [userRelatedTickets, setUserRelatedTickets] = useState(null);
    const [ticketsAtSameAddress, setTicketsAtSameAddress] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
          try {
            const ticketDoc = await getDoc(doc(db, "ticket", id));
            if (ticketDoc.exists()) {
              const ticketData = ticketDoc.data();
              console.log("Ticket Data:", ticketData);
              setTicket(ticketData);

              const userId = ticketData.userId;
              const userDoc = await getDoc(doc(db, 'users', userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                const ticketIds = userData.tickets;

                const userRelatedTickets = [];
                for (const ticketId of ticketIds) {
                  if (ticketId === id) {
                    continue;
                  }

                  const userRelatedTicketDoc = await getDoc(doc(db, 'ticket', ticketId));
                  if (userRelatedTicketDoc.exists()) {
                    userRelatedTickets.push(userRelatedTicketDoc);
                  }
                }
                setUserRelatedTickets(userRelatedTickets);

                const address = ticketData.address;
                const ticketsQuery = query(collection(db, 'ticket'), where('address', '==', address));
                const snapshot = await getDocs(ticketsQuery);
                const tickets = [];
                snapshot.forEach(doc => {
                    if (doc.id !== id) {
                        tickets.push({ id: doc.id, ...doc.data() });
                    }
                });
                console.log("Tickets at the same address: ", tickets);
                setTicketsAtSameAddress(tickets);

              } else {
                console.log("User document does not exist.");
              }

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
            <title>Ticket View</title>
          </Helmet>
          <Header />

          {ticket && userRelatedTickets && ticketsAtSameAddress ? 
            (
              <TicketInfo ticketId={id} ticket={ticket} userRelatedTicketDocs={userRelatedTickets} addressRelatedTicketDocs={ticketsAtSameAddress}/>
            ) : 
            (
              <LoadingScreen />
            )
          }
          <Footer />
        </div>
    )
}

export default TicketLoader;