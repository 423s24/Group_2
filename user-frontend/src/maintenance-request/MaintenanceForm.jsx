import { React, useState, useRef } from 'react';
import "./maintenanceFrom.css";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import {app, db} from "../backend/Firebase"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD0SfGl4KETc_rGBuiSCDbx9FZk5PzNsnQ",
//   authDomain: "hrdc-maintanance-ticket-mngr.firebaseapp.com",
//   projectId: "hrdc-maintanance-ticket-mngr",
//   storageBucket: "hrdc-maintanance-ticket-mngr.appspot.com",
//   messagingSenderId: "1044310518528",
//   appId: "1:1044310518528:web:5e1f1c3c7bfirestore8ac7e421e5",
//   measurementId: "G-HK4X8HVEH4"
// };


//const app = initializeApp(firebaseConfig);
//const firestore = getFirestore(app)

export default function MaintenanceForm() {
  const descriptionRef = useRef();  
  const detailsRef = useRef();
  const areaRef = useRef();   
  const relatedRef = useRef();
  const availabilityRef = useRef();
  const relationRef = useRef();  
  const buildingRef = useRef();
  const urgencyRef = useRef();
  const addressRef = useRef(); 
  const phoneRef = useRef();
  const titleRef = useRef();

  const [description, setDescription] = useState('');
  const [validDescription, setValidDescription] = useState(false);
  const [descriptionFocus, setDescriptionFocus] = useState(false);

  const [title, setTitle] = useState('');
  const [validTitle, setValidTitle] = useState(false);
  const [titleFocus, setTitleFocus] = useState(false);

  const [area, setArea] = useState('');
  const [validArea, setValidArea] = useState(false);
  const [areaFocus, setAreaFocus] = useState(false);

  const [related, setRelated] = useState('no');
  const [validRelated, setValidRelated] = useState(false);
  const [relatedFocus, setRelatedFocus] = useState(false);


  const [details, setDetails] = useState('');
  const [validDetails, setValidDetails] = useState(false);
  const [detailsFocus, setDetailsFocus] = useState(false);

  const [buildingType, setBuildingType] = useState('');
  const [validBuildingType, setValidBuildingType] = useState(false);
  const [buildingTypeFocus, setBuildingTypeFocus] = useState(false);

  const [phone, setPhone] = useState('');
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [availability, setAvailability] = useState('');
  const [validAvailability, setValidAvailability] = useState(false);
  const [availabilityFocus, setAvailabilityFocus] = useState(false);

  const [relation, setRelation] = useState('');
  const [validRelation, setValidRelation] = useState(false);
  const [relationFocus, setRelationFocus] = useState(false);

  const [validUrgency, setValidUrgency] = useState(false);
  const [urgencyFocus, setUrgencyFocus] = useState(false);

  const [urgency, setUrgency] = useState(1);

  const [validAddress, setValidAddress] = useState(false);
  const [addressFocus, setAddressFocus] = useState(false);
  const [address, setAddress] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

  const getAddressKey = (address) => {
  return address.replace(/\s+/g, '_').toLowerCase();
 }



  const handleBuildingTypeChange = (e) => {
    setBuildingType(e.target.value);
  };

 
  const handleUrgencyChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setUrgency(value);
  };

  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    const formattedValue = formatPhoneNumber(numericValue)
    setPhone(formattedValue);
  };

  const formatPhoneNumber = (numericValue) => {
  const cleaned = ('' + numericValue).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }

  return numericValue;
};

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  const handleRelationChange = (e) => {
    setRelation(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }



  const handleSubmit = async (e) => {

    //making sure that you cant just enable the button in the browser
     e.preventDefault();

     //this is where we would send this information to the database/api
     //printing to console for now
  try {
     const ticketRef = collection(db, "ticket");
     const addressKey = getAddressKey(address);

     await addDoc(ticketRef,  {
      description, 
      area,
      related, 
      details, 
      buildingType, 
      phone, 
      availability, 
      relation, 
      urgency,
      address,
      phone, 
      title,
     });

     console.log("Data submitted: ", {
      description, 
      area,
      related, 
      details, 
      buildingType, 
      phone, 
      availability, 
      relation, 
      urgency,
      address,
      phone,
      title,
     })

     setDescription('');
     setArea('');
     setRelated('');
     setDetails('');
     setBuildingType('');
     setPhone('');
     setAvailability('');
     setRelated('');
     setUrgency(1);
     setAddress('');
     setPhone('');
     setTitle('');
    } catch(error){
      console.error("Error submitting data: ", error);
    }


   };

  return (

    <section className='form-section'>
    <h1>Request Maintenance</h1>
    <form onSubmit={handleSubmit}>


          <div className='input-group wide-input'>
            <input
              type='text'
              id='address'
              ref={addressRef}
              autoComplete='off'
              onChange={handleAddressChange}
              value={address}
              required
              aria-invalid={validAddress ? "false" : "true"}
              onFocus={() => setAddressFocus(true)}
              onBlur={() => setAddressFocus(false)}
            />
            <label htmlFor='address'>
              Address:
            </label>
          </div>

          <div className='input-group wide-input'>
            <input
              type='tel'
              id='phone'
              ref={phoneRef}
              autoComplete='off'
              onChange={handlePhoneChange}
              value={phone}
              required
              aria-invalid={validPhoneNumber ? "false" : "true"}
              onFocus={() => setPhoneNumberFocus(true)}
              onBlur={() => setPhoneNumberFocus(false)}
            />
            <label htmlFor='phone'>
              Phone Number:
            </label>
          </div>

          <div className='input-group wide-input'>
            <input
                type="text"
                id="title"
                ref={titleRef}
                autoComplete="off"
                onChange={(e) => handleTitleChange(e)}
                value={title}
                required
                aria-invalid={validTitle ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setTitleFocus(true)}
                onBlur={() => setTitleFocus(false)}
              />
              <label htmlFor="title">
                Title:
              </label>
            </div>

          <div className='input-group wide-input'>
            <input
                type="text"
                id="details"
                ref={detailsRef}
                autoComplete="off"
                onChange={(e) => setDetails(e.target.value)}
                value={details}
                required
                aria-invalid={validDetails ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setDetailsFocus(true)}
                onBlur={() => setDetailsFocus(false)}
              />
              <label htmlFor="details">
                Description:
              </label>
            </div>

            <div className='input-group wide-input'>
              <input
                type="text"
                id="area"
                ref={areaRef}
                autoComplete="off"
                onChange={(e) => setArea(e.target.value)}
                value={area}
                required
                aria-invalid={validArea ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setAreaFocus(true)}
                onBlur={() => setAreaFocus(false)}
              />
              <label htmlFor="area">
                Area of the House:
              </label>
            </div>

            <div className='input-group wide-input tall-input'> 
              <textarea 
              name="description" 
              id="" 
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setDescriptionFocus(true)}
              onBlur={() => setDescriptionFocus(false)}
              >
              </textarea>
              <label htmlFor="description">Details:</label>
            </div>


            <div className='input-group-radio'>
              <p>Is this Related to another Request?</p>
              <div className='radio-pair'>
                <input
                    className='radio-input'
                    type="radio"
                    id="Yes"
                    ref={relatedRef}
                    autoComplete="off"
                    checked={related === 'Yes'}
                    onChange={(e) => setRelated(e.target.value)}
                    value={"Yes"}
                    required
                    aria-invalid={validRelated ? "false" : "true"}
                  />
                  <label htmlFor="Yes">
                    Yes
                  </label>
                </div>
                <div className='radio-pair'>  
                  <input
                    className='radio-input'
                    type="radio"
                    id="No"
                    ref={relationRef}
                    autoComplete="off"
                    checked={related === 'No'}
                    onChange={(e) => setRelated(e.target.value)}
                    value={"No"}
                    required
                    aria-invalid={validRelated ? "false" : "true"}
                  />
                  <label htmlFor="No">
                    No
                  </label>
                </div>
              </div>

            <div className='input-group wide-input'>
              <input
                type='text'
                id='buildingType'
                ref={buildingRef}
                autoComplete='off'
                onChange={handleBuildingTypeChange}
                value={buildingType}
                required
                aria-invalid={validBuildingType ? "false" : "true"}
                onFocus={() => setBuildingTypeFocus(true)}
                onBlur={() => setBuildingTypeFocus(false)}
              />
              <label htmlFor='buildingType'>
                Building Type: 
              </label>
            </div>    

            <div className='input-group wide-input'>
              <input
                type='number'
                id='urgency'
                ref={urgencyRef}
                autoComplete='off'
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if(value >= 1 && value <= 10) {
                    handleUrgencyChange(e);
                  } else{
                      urgencyRef.current.value = '';
                  }
                }}
                value={urgency}
                min={1}
                max={10}
                required
                aria-invalid={validUrgency ? "false" : "true"}
                onFocus={() => setUrgencyFocus(true)}
                onBlur={() => setUrgencyFocus(false)}
              />

              <label htmlFor="urgency">
                Urgency (Scale from 1-10):
              </label>
            </div>


            <div className='input-group wide-input tall-input'>    
              <textarea 
              name="availability" 
              id="" 
              ref={availabilityRef}
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              onFocus={() => setAvailabilityFocus(true)}
              onBlur={() => setAvailabilityFocus(false)}
              >
              </textarea>
              <label htmlFor="availability">
                Availability:
              </label>
            </div>

            <div className='input-group-radio'>
              <p>Relation to House</p>
              <div className='radio-pair'>
                <input
                    className='radio-input'
                    type="radio"
                    id="Building"
                    ref={relatedRef}
                    autoComplete="off"
                    checked={related === 'Building'}
                    onChange={(e) => setRelated(e.target.value)}
                    value={"Building"}
                    required
                    aria-invalid={validRelated ? "false" : "true"}
                  />
                  <label htmlFor="Building">
                    Building
                  </label>
                </div>
                <div className='radio-pair'>  
                  <input
                    className='radio-input'
                    type="radio"
                    id="Plumbing"
                    ref={relatedRef}
                    autoComplete="off"
                    checked={related === 'Plumbing'}
                    onChange={(e) => setRelated(e.target.value)}
                    value={"Plumbing"}
                    required
                    aria-invalid={validRelated ? "false" : "true"}
                  />
                  <label htmlFor="Plumbing">
                    Plumbing
                  </label>
                </div>
                <div className='radio-pair'>  
                  <input
                    className='radio-input'
                    type="radio"
                    id="Electrical"
                    ref={relatedRef}
                    autoComplete="off"
                    checked={related === 'Electrical'}
                    onChange={(e) => setRelated(e.target.value)}
                    value={"Electrical"}
                    required
                    aria-invalid={validRelated ? "false" : "true"}
                  />
                  <label htmlFor="Electrical">
                    Electrical
                  </label>
                </div>
                <div className='radio-pair'>  
                  <input
                    className='radio-input'
                    type="radio"
                    id="Appliance"
                    ref={relatedRef}
                    autoComplete="off"
                    checked={related === 'Appliance'}
                    onChange={(e) => setRelated(e.target.value)}
                    value={"Appliance"}
                    required
                    aria-invalid={validRelated ? "false" : "true"}
                  />
                  <label htmlFor="Appliance">
                    Appliance
                  </label>
                </div>
              </div>  

              <button className='login-button'>Submit</button>
    </form>
    </section>
  )
}
