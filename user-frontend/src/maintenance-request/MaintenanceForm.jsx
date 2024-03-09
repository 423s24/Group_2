import { React, useState } from 'react';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from "../backend/Firebase"
import "./maintenanceForm.css";

export default function MaintenanceForm() {
    const initialFormData = {
        title: '',
        description: '',
        area: '',
        buildingType: '',
        urgency: '',
        address: '',
        submittedBy: '',
        phone: '',
        email: '',
        userId: '',
        enterPerms: '',
        status: 'open',
        serviceType: '',
    }

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

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

            const docRef = await addDoc(ticketRef, formData);

            if (userDocSnap) {
                const userData = userDocSnap.data();
                const existingTickets = userData.tickets || [];
                const updatedTickets = [...existingTickets, docRef.id];

                await updateDoc(userRef, {
                    tickets: updatedTickets,
                });
            }

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

            if (response.ok) {
                console.log("Email sent successfully.");
                setFormData(initialFormData);
            } else {
                console.error("Email did not send.");
            }

        } catch (error) {
            console.error("Error submitting data: ", error);
        }
    };

    return (
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
                        id="buildingType"
                        name="buildingType"
                        autoComplete="off"
                        required
                        onChange={handleChange}
                        value={formData.buildingType}
                    />
                    <label htmlFor='buildingType'>Building Type</label>
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
                    <label htmlFor="area">Area of the House</label>
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
                </div>

                <div className='input-group wide-input'>
                    <input
                        type="number"
                        id="urgency"
                        name="urgency"
                        autoComplete="off"
                        min={1}
                        max={10}
                        required
                        onChange={handleChange}
                        value={formData.urgency}
                    />
                    <label htmlFor="urgency">Urgency (Scale from 1-10)</label>
                </div>

                <button className='login-button'>Submit</button>
            </form>
        </section>
    )

}