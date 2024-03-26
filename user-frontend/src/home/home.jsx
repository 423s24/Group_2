import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs} from 'firebase/firestore';
import { db } from '../backend/Firebase';

export default function Home({user}) {

    const [tickets, setTickets] = useState(null) 

    useEffect(()=>{
        const fetchTickets = async() => {
        try {
            const docRef = collection(db, "ticket");
            const docSnap = await getDocs(docRef);

            const ticketsData = docSnap.docs.filter(doc => doc.data().userId === user.uid)
            //const ticketsData = null
            console.log(ticketsData)
            if (ticketsData) {
                setTickets(ticketsData);
            } else {
                console.log("No such document");
            }
        } catch (error) {
            console.error("Error getting document: ", error);
        }
    }
    fetchTickets();
    }, [])
    //console.log(tickets)
  return (
    <div>Home</div>
  )
}
