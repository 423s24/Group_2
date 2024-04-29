import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-upper-section">
                <a target="_blank" href="http://docs.hrdcmaintenance.com"><FontAwesomeIcon icon={faQuestionCircle} /> Need Help?</a>
            </div>
            <p>&copy; 2024 Human Resources Development Council. All Rights Reserved. </p>
        </div>
    )
}

export default Footer;