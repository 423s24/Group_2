import { React, useState } from 'react';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, storage } from "../backend/Firebase"
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import "./maintenanceForm.css";
import { useNavigate } from 'react-router-dom';
import LoaderScreen from '../components/loadingScreen';



export default function MaintenanceForm() {
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [userResponse, setUserResponse] = useState("")


    const navigate = useNavigate();
    const initialFormData = {
        title: '',
        description: '',
        area: '',
        dateCreated: serverTimestamp(),
        urgency: '',
        address: '',
        submittedBy: '',
        phone: '',
        email: '',
        userId: '',
        enterPerms: '',
        status: 'open',
        serviceType: '',
        attachmentUrl: '',
    }

    const [formData, setFormData] = useState(initialFormData);
    const [attachment, setAttachment] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAttachment(file);
    };


    const SubmissionWindow = () => {
        return(
            <div style={{position:"absolute", zIndex: 10, width: "100vw", height: "100vh", background:"#F9F9F9", display:"grid", alignItems: "center", justifyItems:"center"}}>
                <div style={{display: "grid", alignItems: "center", justifyContent: "center", background:"#fff", borderRadius: "10px", width: "75%", height: "400px"}}>
                    <LoaderScreen/>
                </div>
            </div>
        )
    }
    
    const CompletedWindow = ({message}) => {
        return(
            <div style={{position:"absolute", zIndex: 10, width: "100vw", height: "100vh", background:"#F9F9F9", display:"grid", alignItems: "center", justifyItems:"center"}}>
                <div style={{display: "grid", alignItems: "center", justifyContent: "center", background:"#fff", borderRadius: "10px", width: "75%", height: "400px"}}>
                    <div style={{display:"grid", justifyItems: "center"}}>
                    <h1 style={{color: "#107178", fontSize: "40px"}}>{message}</h1>
                    <button style={{color: "#107178", padding:"5px 10px 5px 10px", marginTop: "40px", fontSize: "18px", width:"fit-content"}} onClick={() => {navigate("/")}}>Go Home</button>
                    </div>
                </div>
            </div>
        )
    }

    const formatPhoneNumber = (numericValue) => {
        const cleaned = ('' + numericValue).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }

        return numericValue;
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const ticketRef = collection(db, "ticket");

            const user = auth.currentUser;
            console.log(user.uid);

            let userRef;
            let userDocSnap;
            let attachmentUrl = '';

            if (user) {
                formData.userId = user.uid;
                formData.email = user.email;

                userRef = doc(db, 'users', user.uid);
                userDocSnap = await getDoc(userRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    formData.submittedBy = userData.name;
                    formData.phone = userData.phone;
                }
            }
            

            if (attachment) {
                const storageRef = ref(storage, `attachments/${attachment.name}`);
                const uploadTask = uploadBytesResumable(storageRef, attachment);
                const snapshot = await uploadTask;
                console.log('Uploaded file successfully');
                attachmentUrl = await getDownloadURL(snapshot.ref);
                console.log('File available at', attachmentUrl);
            }

            formData.attachmentUrl = attachmentUrl;
            const docRef = await addDoc(ticketRef, formData);

            if (userDocSnap) {
                const userData = userDocSnap.data();
                const existingTickets = userData.tickets || [];
                const updatedTickets = [...existingTickets, docRef.id];

                await updateDoc(userRef, {
                    tickets: updatedTickets,
                });
            }

            setLoading(true)            

            const response = await fetch('https://hrdc-email.onrender.com/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData: formData,
                    documentId: docRef.id,
                }),
            });

            setLoading(false)
            setCompleted(true)
            
            if (response.ok) {
                console.log("Email sent successfully.");
                setFormData(initialFormData);
                setUserResponse("Request Sent!")
            } else {
                console.error("Email did not send.");
                setUserResponse("Sorry, we've encountered an error")
            }

        } catch (error) {
            console.error("Error submitting data: ", error);
        }
    };

    return (
        <>
        {loading ? <SubmissionWindow/> :  completed ? <CompletedWindow message={userResponse}/> :
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        <button style={{color: "#107178", padding:"5px 10px 5px 10px", marginTop: "40px", fontSize: "18px", width:"fit-content"}} onClick={() => {navigate("/")}}>Back</button>
        <section className="form-section">
            <h1>Request Maintenance</h1>
            <form onSubmit={handleSubmit}>
                <div className='input-group wide-input'>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        autoComplete="off"
                        required
                        onChange={handleChange}
                        value={formData.title}
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="title">Title</label>
                </div>

                <div className='input-group wide-input tall-input'> 
                    <textarea 
                        name="description" 
                        id="description"
                        onChange={handleChange}
                        value={formData.description}
                    >
                    </textarea>
                    <label htmlFor="description">Details</label>
                </div>

                <div className='input-group wide-input'>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        autoComplete="off"
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <label htmlFor='address'>Address</label>
                </div>  

                <div className='input-group wide-input'>
                    <input
                        type="text"
                        id="area"
                        name="area"
                        autoComplete="off"
                        required
                        aria-describedby="uidnote"
                        onChange={handleChange}
                        value={formData.area}
                    />
                    <label htmlFor="area">Area of the Building</label>
                </div>

                <div className='input-group-select'>
                    <p>What is the service type?</p>
                    <select 
                        name="serviceType" 
                        id="serviceType" 
                        onChange={handleChange}
                        value={formData.serviceType}
                    >
                        <option value="">Select One</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="building">Building</option>
                        <option value="appliance">Appliance</option>
                    </select>
                </div>

                <div className='input-group-radio'>
                    <p>Do we have permission to enter the property without your presence?</p>
                    <div className='radio-pair'>
                        <input
                            className="radio-input"
                            type="radio"
                            id="Yes"
                            name="enterPerms"
                            autoComplete="off"
                            value={"Yes"}
                            required
                            onChange={handleChange}
                        />
                        <label htmlFor="Yes">Yes</label>
                    </div>
                    <div className='radio-pair'>  
                        <input
                            className="radio-input"
                            type="radio"
                            id="No"
                            name="enterPerms"
                            autoComplete="off"
                            value={"No"}
                            required
                            onChange={handleChange}
                        />
                        <label htmlFor="No">No</label>
                    </div>
                    <div className='radio-pair'>  
                        <input
                            className="radio-input"
                            type="radio"
                            id="NotApplicable"
                            name="enterPerms"
                            autoComplete="off"
                            value={"Not Applicable"}
                            required
                            onChange={handleChange}
                        />
                        <label htmlFor="NotApplicable">Not Applicable</label>
                    </div>
                </div>

                <div className="input-group-select">
                    <p>What is the urgency level?</p>
                    <select
                        id="urgency"
                        name="urgency"
                        autoComplete="off"
                        required
                        onChange={handleChange}
                        value={formData.urgency}
                    >
                        <option>Select One</option>
                        <option value='low'>Low</option>
                        <option value='medium'>Medium</option>
                        <option value='high'>High</option>
                        <option value='critical'>Critical</option>
                    </select>
                </div>


                <div className='input-group wide-input'>
                    <input
                        type="file"
                        id="attachment"
                        name="attachment"
                        onChange={handleFileChange}
                        accept="image/*, application/pdf" 
                    />
                    <label htmlFor="attachment">Attach Document or Image</label>
                </div>

                <button className='login-button'>Submit</button>
            </form>
        </section>
        </div>}
        </>
    )

}