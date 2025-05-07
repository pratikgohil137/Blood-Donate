import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheckCircle, FaTint } from 'react-icons/fa';

const HeroSection = () => {
    return (
        <div className="hero-section" style={{
            background: 'linear-gradient(to right, #f9f9f9, #ffffff, #fff5f7)',
            padding: '40px 0 60px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e12454' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='27' cy='27' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                zIndex: 1
            }}></div>
            <div className="hero-container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="hero-left">
                    <h1 className="hero-title">
                        <span className="hero-title-red">Donate Blood,</span>
                        <br />
                        <span className="hero-title-dark">Save Lives</span>
                    </h1>
                    
                    <p className="hero-description">
                        Be a hero by donating blood and helping those in need.
                        Every drop counts in our mission to ensure that no one
                        suffers due to blood shortage.
                    </p>
                    
                    <div className="hero-buttons">
                        <Link to="/show-hospital" className="hero-btn primary">
                            <FaMapMarkerAlt /> Find Donation Center
                        </Link>
                        <Link to="/eligible" className="hero-btn secondary">
                            <FaCheckCircle /> Check Eligibility
                        </Link>
                    </div>

                    <div className="hero-slogan" style={{
                        marginTop: '30px',
                        padding: '20px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        boxShadow: '0 4px 15px rgba(225, 36, 84, 0.08)',
                        borderLeft: '4px solid var(--primary-color)',
                        fontSize: '18px',
                        fontStyle: 'italic',
                        color: '#333',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '-10px',
                            fontSize: '60px',
                            color: 'var(--primary-color)',
                            opacity: '0.1',
                            fontFamily: 'serif'
                        }}>"</div>
                        <p style={{ position: 'relative', zIndex: '2', margin: '0' }}>
                            <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                Your blood is replaceable. A life is not.
                            </span> 
                            <br />
                            <span style={{ fontSize: '16px' }}>
                                Donate blood today — it costs nothing but means everything.
                            </span>
                        </p>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="hero-image-container">
                        <div className="hero-image">
                            {/* Replace with a new inline SVG image */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
                                {/* Background Circle */}
                                <circle cx="400" cy="300" r="250" fill="#FFF5F7" />
                                
                                {/* Medical Professional */}
                                <g id="doctor">
                                    {/* Doctor Body */}
                                    <rect x="250" y="180" width="140" height="220" rx="20" fill="#E8F4FF" />
                                    
                                    {/* Doctor Head */}
                                    <circle cx="320" cy="150" r="50" fill="#FFD8B5" />
                                    
                                    {/* Doctor Face */}
                                    <circle cx="305" cy="140" r="5" fill="#333" /> {/* Left Eye */}
                                    <circle cx="335" cy="140" r="5" fill="#333" /> {/* Right Eye */}
                                    <path d="M310 160 Q320 170 330 160" stroke="#333" stroke-width="2" fill="none" /> {/* Smile */}
                                    
                                    {/* Doctor Hair */}
                                    <path d="M280 120 Q320 90 360 120" fill="#333" />
                                    
                                    {/* Doctor Stethoscope */}
                                    <path d="M320 200 Q350 220 380 200" stroke="#333" stroke-width="3" fill="none" />
                                    <circle cx="380" cy="200" r="8" fill="#E12454" />
                                    
                                    {/* Name Tag */}
                                    <rect x="290" y="220" width="60" height="20" rx="5" fill="#FFF" />
                                    <line x1="300" y1="230" x2="340" y2="230" stroke="#333" stroke-width="2" />
                                </g>
                                
                                {/* Blood Donor */}
                                <g id="donor">
                                    {/* Donor Body */}
                                    <rect x="420" y="200" width="120" height="200" rx="20" fill="#FFF" />
                                    
                                    {/* Donor Head */}
                                    <circle cx="480" cy="170" r="45" fill="#FFD8B5" />
                                    
                                    {/* Donor Face */}
                                    <circle cx="465" cy="160" r="5" fill="#333" /> {/* Left Eye */}
                                    <circle cx="495" cy="160" r="5" fill="#333" /> {/* Right Eye */}
                                    <path d="M470 185 Q480 190 490 185" stroke="#333" stroke-width="2" fill="none" /> {/* Smile */}
                                    
                                    {/* Donor Hair */}
                                    <path d="M450 140 Q480 120 510 140" fill="#333" />
                                    
                                    {/* Donor Arm */}
                                    <path d="M420 250 Q370 270 350 230" fill="#FFD8B5" />
                                </g>
                                
                                {/* Blood Bag */}
                                <g id="blood-bag">
                                    <path d="M350 230 L390 230 L390 320 Q370 340 350 320 Z" fill="#FFEFEF" stroke="#E12454" stroke-width="2" />
                                    <rect x="365" y="210" width="10" height="20" fill="#E8E8E8" />
                                    <path d="M365 240 L385 240" stroke="#E12454" stroke-width="1" />
                                    <path d="M365 250 L385 250" stroke="#E12454" stroke-width="1" />
                                    <path d="M365 260 L385 260" stroke="#E12454" stroke-width="1" />
                                    <ellipse cx="370" cy="300" rx="10" ry="15" fill="#E12454" opacity="0.5" />
                                </g>
                                
                                {/* Blood Drops */}
                                <g id="blood-drops">
                                    <path d="M450 100 Q470 70 490 100 Q470 130 450 100 Z" fill="#E12454" opacity="0.8" />
                                    <path d="M500 150 Q510 130 520 150 Q510 170 500 150 Z" fill="#E12454" opacity="0.6" />
                                    <path d="M250 200 Q260 180 270 200 Q260 220 250 200 Z" fill="#E12454" opacity="0.7" />
                                </g>
                                
                                {/* Large Blood Drop */}
                                <g id="large-blood-drop">
                                    <path d="M550 250 Q580 200 610 250 Q580 300 550 250 Z" fill="#E12454" opacity="0.8" />
                                    <path d="M570 260 Q580 240 590 260 Q580 280 570 260 Z" fill="#FFF" opacity="0.4" />
                                </g>
                                
                                {/* Replace Heart Symbol with Blood Donation Symbol */}
                                <g id="blood-donation-symbol" transform="translate(150, 250)">
                                    {/* Blood Bag */}
                                    <rect x="0" y="0" width="80" height="110" rx="8" fill="#FFFFFF" stroke="#E12454" stroke-width="2" />
                                    <rect x="30" y="-15" width="20" height="25" rx="3" fill="#FFFFFF" stroke="#E12454" stroke-width="2" />
                                    
                                    {/* Blood Level */}
                                    <rect x="5" y="40" width="70" height="65" rx="3" fill="#FFE5E5" />
                                    <path d="M5 65 H75" stroke="#E12454" stroke-width="1" stroke-dasharray="2 2" />
                                    <path d="M5 80 H75" stroke="#E12454" stroke-width="1" stroke-dasharray="2 2" />
                                    
                                    {/* Blood Type */}
                                    <text x="25" y="20" font-family="Arial" font-size="14" font-weight="bold" fill="#E12454">A+</text>
                                    
                                    {/* Blood Drops inside the bag */}
                                    <path d="M20 50 Q25 35 30 50 Q25 65 20 50 Z" fill="#E12454" opacity="0.5" />
                                    <path d="M40 55 Q45 45 50 55 Q45 65 40 55 Z" fill="#E12454" opacity="0.5" />
                                    <path d="M60 45 Q65 35 70 45 Q65 55 60 45 Z" fill="#E12454" opacity="0.5" />
                                </g>
                                
                                {/* Heart Beat Line */}
                                <path d="M200 400 L250 400 L270 370 L290 430 L310 400 L330 400 L350 350 L370 450 L390 400 L410 400 L430 370 L450 430 L470 400 L490 400 L510 350 L530 450 L550 400 L600 400" stroke="#E12454" stroke-width="3" fill="none" />
                                
                                {/* Success Badge */}
                                <g id="success-badge" transform="translate(600, 200)">
                                    <circle cx="0" cy="0" r="50" fill="#FFFFFF" stroke="#E12454" stroke-width="2" />
                                    <text x="-20" y="10" font-family="Arial" font-size="30" font-weight="bold" fill="#E12454">A+</text>
                                </g>
                            </svg>
                        </div>

                        {/* Heartbeat line at bottom */}
                        <div className="heartbeat-line" style={{
                            position: 'absolute',
                            bottom: '60px',
                            left: '0',
                            right: '0',
                            height: '50px',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,25 L20,25 L30,10 L40,40 L50,25 L60,25 L70,10 L80,40 L90,25 L100,25 L110,10 L120,40 L130,25 L140,25 L150,10 L160,40 L170,25 L180,25 L200,25' stroke='%23e12454' stroke-width='2' fill='none' /%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                        }}></div>

                        {/* Success card showing just an A+ with heartbeat */}
                        <div className="success-card" style={{
                            backgroundColor: 'white',
                            padding: '15px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            position: 'absolute',
                            top: '120px',
                            right: '-30px',
                            width: '160px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <span style={{ 
                                fontSize: '14px', 
                                color: '#666', 
                                marginBottom: '10px',
                                fontWeight: '500'
                            }}>Success Stories</span>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ 
                                    fontSize: '24px', 
                                    fontWeight: '700', 
                                    color: 'var(--primary-color)',
                                    display: 'block',
                                    marginBottom: '5px'
                                }}>A+</span>
                                <div style={{
                                    height: '30px',
                                    width: '130px',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,15 L10,15 L15,5 L20,25 L25,15 L30,15 L35,5 L40,25 L45,15 L50,15 L55,5 L60,25 L65,15 L70,15 L75,5 L80,25 L85,15 L90,15 L100,15' stroke='%23e12454' stroke-width='1.5' fill='none' /%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection; 