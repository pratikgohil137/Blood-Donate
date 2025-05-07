import React, { useState } from 'react';
import { FaTint, FaExchangeAlt, FaInfoCircle, FaCheck, FaTimes } from 'react-icons/fa';

const BloodCompatibility = () => {
    const [selectedBloodType, setSelectedBloodType] = useState('A+');
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    const compatibilityData = {
        'A+': {
            canDonateTo: ['A+', 'AB+'],
            canReceiveFrom: ['A+', 'A-', 'O+', 'O-']
        },
        'A-': {
            canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
            canReceiveFrom: ['A-', 'O-']
        },
        'B+': {
            canDonateTo: ['B+', 'AB+'],
            canReceiveFrom: ['B+', 'B-', 'O+', 'O-']
        },
        'B-': {
            canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
            canReceiveFrom: ['B-', 'O-']
        },
        'AB+': {
            canDonateTo: ['AB+'],
            canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        },
        'AB-': {
            canDonateTo: ['AB+', 'AB-'],
            canReceiveFrom: ['A-', 'B-', 'AB-', 'O-']
        },
        'O+': {
            canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
            canReceiveFrom: ['O+', 'O-']
        },
        'O-': {
            canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            canReceiveFrom: ['O-']
        }
    };

    const bloodTypeInfo = [
        {
            type: 'A+',
            percentage: '35.7%',
            description: 'Second most common blood type. Can donate to A+ and AB+ blood types.',
            specialty: 'Fairly common, good for regular donation.'
        },
        {
            type: 'A-',
            percentage: '6.3%',
            description: 'Can donate to A+, A-, AB+, and AB- blood types.',
            specialty: 'Valuable for blood banks due to wide compatibility.'
        },
        {
            type: 'B+',
            percentage: '8.5%',
            description: 'Less common blood type. Can donate to B+ and AB+ blood types.',
            specialty: 'Important for patients with B+ blood type.'
        },
        {
            type: 'B-',
            percentage: '1.5%',
            description: 'Rare blood type. Can donate to B+, B-, AB+, and AB- blood types.',
            specialty: 'Rare and valuable for specific patients.'
        },
        {
            type: 'AB+',
            percentage: '3.4%',
            description: 'Rarest major blood type. Universal recipient - can receive from all blood types.',
            specialty: 'Can receive blood from any type, but can only donate to AB+ patients.'
        },
        {
            type: 'AB-',
            percentage: '0.6%',
            description: 'The rarest blood type. Can donate to AB+ and AB- blood types.',
            specialty: 'Extremely rare and valuable for AB- patients.'
        },
        {
            type: 'O+',
            percentage: '37.4%',
            description: 'Most common blood type. Can donate to O+, A+, B+, and AB+ blood types.',
            specialty: 'High demand due to compatibility with all positive blood types.'
        },
        {
            type: 'O-',
            percentage: '6.6%',
            description: 'Universal donor blood type. Can donate to all blood types.',
            specialty: 'Most valuable blood type for emergency situations.'
        }
    ];

    const isCompatible = (donorType, recipientType) => {
        return compatibilityData[donorType].canDonateTo.includes(recipientType);
    };
    
    const canDonate = (bloodType, targetType) => {
        return compatibilityData[bloodType].canDonateTo.includes(targetType);
    };
    
    const canReceive = (bloodType, fromType) => {
        return compatibilityData[bloodType].canReceiveFrom.includes(fromType);
    };

    const getTypeInfo = (type) => {
        return bloodTypeInfo.find(info => info.type === type);
    };

    return (
        <div className="blood-compatibility-page">
            <div className="blood-compatibility-header">
                <div className="container">
                    <h1><FaTint className="icon-primary" /> Blood Types & Compatibility</h1>
                    <p>Understanding blood types is crucial for safe transfusions. Learn about different blood groups, their compatibility, and what makes each type unique.</p>
                </div>
            </div>
            
            <div className="container">
                <div className="blood-compatibility-content">
                    <div className="blood-selection-section">
                        <h2>Select Your Blood Type</h2>
                        <div className="blood-type-selector">
                            {bloodTypes.map(type => (
                                <div 
                                    key={type}
                                    className={`blood-type-tab ${selectedBloodType === type ? 'active' : ''}`}
                                    onClick={() => setSelectedBloodType(type)}
                                >
                                    <FaTint className="drop-icon" />
                                    <span>{type}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="blood-type-info">
                            <div className="blood-type-circle">
                                <span>{selectedBloodType}</span>
                            </div>
                            <div className="blood-type-details">
                                <h3>{selectedBloodType} Blood Type</h3>
                                <p>Population: {getTypeInfo(selectedBloodType).percentage} of people</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="compatibility-results">
                        <h2 className="compatibility-title">
                            <FaExchangeAlt className="icon-primary" /> 
                            Compatibility Chart for {selectedBloodType}
                        </h2>
                        
                        <div className="compatibility-chart">
                            <div className="donate-section">
                                <h3>Can donate to:</h3>
                                <div className="compatibility-badges">
                                    {bloodTypes.map(type => (
                                        <div key={type} className={`badge ${canDonate(selectedBloodType, type) ? 'compatible' : 'incompatible'}`}>
                                            {canDonate(selectedBloodType, type) ? 
                                                <FaCheck className="icon-compatible" /> : 
                                                <FaTimes className="icon-incompatible" />
                                            }
                                            <span>{type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="receive-section">
                                <h3>Can receive from:</h3>
                                <div className="compatibility-badges">
                                    {bloodTypes.map(type => (
                                        <div key={type} className={`badge ${canReceive(selectedBloodType, type) ? 'compatible' : 'incompatible'}`}>
                                            {canReceive(selectedBloodType, type) ? 
                                                <FaCheck className="icon-compatible" /> : 
                                                <FaTimes className="icon-incompatible" />
                                            }
                                            <span>{type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="compatibility-matrix-section">
                    <h2 className="section-title">Blood Type Compatibility Chart</h2>
                    <p className="blood-compatibility-description">This chart shows which blood types are compatible for transfusions. Always consult with healthcare professionals for medical advice.</p>
                    
                    <div className="compatibility-table-container">
                        <table className="compatibility-table">
                            <thead>
                                <tr>
                                    <th className="donor-header">Blood Type</th>
                                    {bloodTypes.map(type => (
                                        <th key={type} className="header-cell">
                                            {type}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {bloodTypes.map(donorType => (
                                    <tr key={donorType}>
                                        <td className="donor-cell">
                                            {donorType}
                                        </td>
                                        {bloodTypes.map(recipientType => (
                                            <td 
                                                key={`${donorType}-${recipientType}`} 
                                                className={`compatibility-cell ${isCompatible(donorType, recipientType) ? 'compatible' : 'incompatible'}`}
                                            >
                                                {isCompatible(donorType, recipientType) ? 
                                                    <FaCheck className="icon-compatible" /> : 
                                                    <FaTimes className="icon-incompatible" />
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="compatibility-read-direction">Read across each row to see which blood types a donor can give to.</p>
                </div>
                
                <div className="blood-types-info-section">
                    <h2><FaInfoCircle className="icon-primary" /> Blood Type Information</h2>
                    <p className="section-description">Learn about each blood type, its distribution in the population, and unique characteristics.</p>
                    
                    <div className="blood-types-grid">
                        {bloodTypeInfo.map(info => (
                            <div key={info.type} className="blood-type-card">
                                <div className="blood-type-header">
                                    <div className="blood-type-badge">{info.type}</div>
                                    <div className="blood-type-percentage">{info.percentage} of population</div>
                                </div>
                                <div className="blood-type-body">
                                    <p>{info.description}</p>
                                    <div className="blood-type-specialty">
                                        <strong>Specialty:</strong> {info.specialty}
                                    </div>
                                </div>
                                <div className="blood-type-footer">
                                    <div className="compatibility-summary">
                                        <div className="can-donate">
                                            <strong>Can donate to:</strong> {compatibilityData[info.type].canDonateTo.join(', ')}
                                        </div>
                                        <div className="can-receive">
                                            <strong>Can receive from:</strong> {compatibilityData[info.type].canReceiveFrom.join(', ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BloodCompatibility;