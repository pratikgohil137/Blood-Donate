import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaCalendarAlt, FaQuestion, FaInfoCircle, FaUserPlus, FaSignInAlt, FaHospital, FaHandHoldingHeart, FaInfoCircle as FaInfo } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-logo">
                    <Link to="/">
                        <img src="../../blood-drop-svgrepo-com.svg" alt="Blood Donation Logo" className="footer-logo-img" style={{ filter: 'none' }} />
                        <span>Blood Donation</span>
                    </Link>
                    <p className="footer-slogan">Donate blood, save lives. Every drop counts.</p>
                </div>
            </div>
            
            <div className="footer-container">
                <div className="footer-section">
                    <h4>About Blood Donation</h4>
                    <p>
                        We are a dedicated platform connecting blood donors with patients in need. 
                        Our mission is to ensure that no life is lost due to blood shortage by creating 
                        a vast network of willing donors across the country.
                    </p>
                    <div className="footer-donate-btn">
                        <Link to="/eligible" className="btn btn-footer">Donate Now <FaHeart style={{ color: '#e83e6a' }} /></Link>
                    </div>
                </div>
                
                <div className="footer-section">
                    <h4>Important Links</h4>
                    <ul>
                        <li><Link to="/"><FaHeart style={{ color: '#e83e6a' }} /> Home</Link></li>
                        <li><Link to="/eligible"><FaCalendarAlt /> Check Eligibility</Link></li>
                        <li><Link to="/blood-types"><FaInfoCircle /> Blood Types</Link></li>
                        <li><Link to="/blood-camps"><FaCalendarAlt /> Blood Camps</Link></li>
                        <li><Link to="/awareness"><FaInfoCircle /> Awareness</Link></li>
                        <li><Link to="/show-hospital"><FaMapMarkerAlt /> Find Hospitals</Link></li>
                        <li><Link to="/faq"><FaQuestion /> FAQs</Link></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h4>For Donors & Recipients</h4>
                    <ul>
                        <li><Link to="/register"><FaUserPlus /> Register as Donor</Link></li>
                        <li><Link to="/login"><FaSignInAlt /> Donor Login</Link></li>
                        <li><Link to="/organization-login"><FaHospital /> Hospital Login</Link></li>
                        <li><Link to="/mission"><FaHandHoldingHeart /> Our Mission</Link></li>
                        <li><Link to="/aboutus"><FaInfo /> About Us</Link></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h4>Contact Information</h4>
                    <address>
                        <p><FaMapMarkerAlt /> GEC Bhavnagar , Gujarat , India</p>
                        <p><FaPhone /> Helpline: +91 9876543210</p>
                        <p><FaPhone /> Emergency: +91 1800-200-300</p>
                        <p><FaEnvelope /> Email: blooddonation@gmail.com</p>
                    </address>
                    
                    <h4 className="social-heading">Connect With Us</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p>&copy; {new Date().getFullYear()} Blood Donation. All rights reserved.</p>
                    <div className="footer-links">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/sitemap">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;