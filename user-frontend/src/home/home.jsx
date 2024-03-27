import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs} from 'firebase/firestore';
import { db } from '../backend/Firebase';
import "./home.css"
import { useNavigate } from 'react-router-dom';


export default function Home({user}) {

    const navigate = useNavigate()
    const [tickets, setTickets] = useState(null)
    const statusColors = {open: "#23b848", closed: "#bababa"} 

    useEffect(()=>{
        const fetchTickets = async() => {
        try {
            const docRef = collection(db, "ticket");
            const docSnap = await getDocs(docRef);

            const ticketsData = docSnap.docs.filter(doc => doc.data().userId === user.uid)
            console.log(ticketsData)
            ticketsData.forEach(d => {
                console.log(d.data().dateCreated.toDate().toString())
            })

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

    const Ticket = ({ticketData}) => {
        const [show, setShow] = useState(false)

        return (
            <div style={{width: "100%", background:"#F9F9F9", padding:"10px", paddingLeft:"20px", marginBottom: "10px", borderRadius: "10px"}}>
                <div style={{display:"grid", gridAutoFlow:"column"}}>
                <div style={{ display:"flex", flexDirection:"column"}}>

                <p>
                {ticketData.dateCreated.toDate().toString().split(" ").slice(0, 4).join(" ")}
                </p>
            
                <div style={{marginTop: "20px"}}>
                    <div className='ticketHeader' style={{display:"flex"}}> <h2 className="ticketTitle" style={{marginRight: "10px"}}>{ticketData.title}</h2>
                    <p className="statusIcon"style={{padding:"3px 10px 3px 10px",width:"fit-content",border: `1px solid ${statusColors[ticketData.status]}`, borderRadius: "100px", color: statusColors[ticketData.status] }}>{ticketData.status}</p></div>
                </div>
                </div>
                
                <button style={{alignSelf:"center", justifySelf:"end", border: "1px solid #bababa", padding:"10px 15px 10px 15px",  borderRadius: "10px"}} onClick={() => {setShow(!show)}}>
                    View
                </button>
                </div>
                {show ? 
                    <div style={{margin: "40px 0 20px 0"}}>
                        <p>{ticketData.description}</p>
                    </div>
                :""}
            </div>
        )

    }

  return (
    <div style={{width: "100%"}}>
    <div className='newRequestButton' style={{ padding:"40px" , paddingLeft: "20px",borderBottom: "1px solid #bababa", display:"flex", justifyContent:"center"}} onClick={() => {navigate("/maintenance")}}>
        <div style={{display: "grid", gridAutoFlow:"column", alignItems: "center"}}>
            <h1 className="sectionHeader" style={{paddingRight: "10px"}}>Submit New Maintenance Request</h1>
            <div className="plusButton"style={{width:"30px", height:"30px", borderRadius: "100px", display: "flex", alignItems: "center", justifyContent:"center", fontWeight: "Bold", fontSize: "24px"}}>+</div>
        </div>
    </div>
        <div className="previousContainer" style={{border: "1px solid #bababa", borderRadius: "15px", background: "white",  display:"flex", flexDirection: "column", alignItems:"center"}}>
            <h1 className="sectionHeader"style={{color:"#97c33c", marginBottom: "40px"}}>Previous Request</h1>
            <div style={{width: "90%"}}>
                <div style={{marginTop: "10px"}}>
                {tickets?.map((t) => <Ticket ticketData={t.data()}/>)}
                </div>
            </div>
        </div>
    </div>
  )
}
