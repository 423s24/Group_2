import {React, useState, useRef} from 'react'
import "./maintenanceFrom.css"
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MaintenanceForm() {
  const descriptionRef = useRef();  
  const detailsRef = useRef();
  const areaRef = useRef();   
  const relatedRef = useRef();  

  const [description, setDescription] = useState('');
  const [validDescription, setValidDescription] = useState(false);
  const [descriptionFocus, setDescriptionFocus] = useState(false);

  const [area, setArea] = useState('');
  const [validArea, setValidArea] = useState(false);
  const [areaFocus, setAreaFocus] = useState(false);

  const [related, setRelated] = useState('no');
  const [validRelated, setValidRelated] = useState(false);
  const [relatedFocus, setRelatedFocus] = useState(false);


  const [details, setDetails] = useState('');
  const [validDetails, setValidDetails] = useState(false);
  const [detailsFocus, setDetailsFocus] = useState(false);


  const handleSubmit = async (e) => {

    //making sure that you cant just enable the button in the browser
     e.preventDefault();

     //this is where we would send this information to the database/api
     //printing to console for now
     console.log(details, description, area, related)
   }

  return (

    <section className='form-section'>
    <h1>Request Maintenance</h1>
    <form onSubmit={handleSubmit}>
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
                  ref={relatedRef}
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

              <button className='login-button'>Submit</button>
    </form>
    </section>
  )
}
