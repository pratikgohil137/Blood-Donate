import React, { useState } from 'react';
import { FaTint, FaInfoCircle, FaQuestionCircle, FaCheckCircle, FaTimesCircle, FaExchangeAlt, FaHeartbeat } from 'react-icons/fa';

const BloodTypes = () => {
  const [activeBloodType, setActiveBloodType] = useState('A+');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const bloodCompatibility = {
    'A+': {
      canDonateTo: ['A+', 'AB+'],
      canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
      percentage: '35.7%',
      facts: [
        'Second most common blood type',
        'Has A antigens on red cells and A antibodies in the plasma',
        'Can donate to A+ and AB+ blood types',
        'Can receive from A+, A-, O+, and O- blood types'
      ]
    },
    'A-': {
      canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
      canReceiveFrom: ['A-', 'O-'],
      percentage: '6.3%',
      facts: [
        'Relatively rare blood type',
        'Has A antigens on red cells but no Rh factor',
        'Can donate to A+, A-, AB+, and AB- blood types',
        'Can receive from A- and O- blood types only'
      ]
    },
    'B+': {
      canDonateTo: ['B+', 'AB+'],
      canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
      percentage: '8.5%',
      facts: [
        'Less common blood type',
        'Has B antigens on red cells and B antibodies in the plasma',
        'Can donate to B+ and AB+ blood types',
        'Can receive from B+, B-, O+, and O- blood types'
      ]
    },
    'B-': {
      canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
      canReceiveFrom: ['B-', 'O-'],
      percentage: '1.5%',
      facts: [
        'Rare blood type',
        'Has B antigens on red cells but no Rh factor',
        'Can donate to B+, B-, AB+, and AB- blood types',
        'Can receive from B- and O- blood types only'
      ]
    },
    'AB+': {
      canDonateTo: ['AB+'],
      canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      percentage: '3.4%',
      facts: [
        'Rarest major blood type',
        'Has both A and B antigens on red cells but no A or B antibodies in the plasma',
        'Universal recipient - can receive from all blood types',
        'Can donate only to AB+ blood type'
      ]
    },
    'AB-': {
      canDonateTo: ['AB+', 'AB-'],
      canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
      percentage: '0.6%',
      facts: [
        'The rarest blood type',
        'Has both A and B antigens on red cells but no Rh factor',
        'Can donate to AB+ and AB- blood types',
        'Can receive from A-, B-, AB-, and O- blood types'
      ]
    },
    'O+': {
      canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
      canReceiveFrom: ['O+', 'O-'],
      percentage: '37.4%',
      facts: [
        'Most common blood type',
        'Has neither A nor B antigens on red cells but has both A and B antibodies in the plasma',
        'Can donate to O+, A+, B+, and AB+ blood types',
        'Can receive from O+ and O- blood types only'
      ]
    },
    'O-': {
      canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canReceiveFrom: ['O-'],
      percentage: '6.6%',
      facts: [
        'Universal donor blood type',
        'Has neither A nor B antigens on red cells and no Rh factor',
        'Can donate to all blood types',
        'Can receive only from O- blood type'
      ]
    }
  };

  const bloodTypeDetails = bloodCompatibility[activeBloodType];

  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '80px' }}>
      <div className="glass-panel" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <FaTint style={{ marginRight: '10px', color: 'var(--primary-color)' }} />
          Blood Types & Compatibility
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Understanding blood types is crucial for safe transfusions. Learn about different blood groups,
          their compatibility, and what makes each type unique.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Left side - Blood types selection */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ 
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px' }}>
              Select Your Blood Type
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
              gap: '15px'
            }}>
              {bloodTypes.map(type => (
                <div 
                  key={type}
                  style={{
                    padding: '15px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: activeBloodType === type ? 'var(--primary-color)' : 'white',
                    color: activeBloodType === type ? 'white' : 'var(--text-dark)',
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => setActiveBloodType(type)}
                >
                  {activeBloodType === type && (
                    <div style={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      background: 'rgba(255, 255, 255, 0.5)'
                    }}></div>
                  )}
                  <FaTint style={{ marginBottom: '5px', opacity: activeBloodType === type ? 1 : 0.6 }} />
                  {type}
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass" style={{ 
            padding: '25px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ 
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginRight: '15px'
              }}>
                {activeBloodType}
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                  {activeBloodType} Blood Type
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Population: {bloodTypeDetails.percentage} of people
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaInfoCircle style={{ color: 'var(--primary-color)' }} />
                Key Facts
              </h4>
              <ul style={{ 
                listStyleType: 'none',
                padding: 0,
                margin: 0
              }}>
                {bloodTypeDetails.facts.map((fact, index) => (
                  <li key={index} style={{ 
                    padding: '8px 0',
                    borderBottom: index < bloodTypeDetails.facts.length - 1 ? '1px solid var(--border-color)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{ 
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(229, 57, 53, 0.1)',
                      color: 'var(--primary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem'
                    }}>
                      {index + 1}
                    </div>
                    <span style={{ fontSize: '0.95rem' }}>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(229, 57, 53, 0.05)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            border: '1px dashed rgba(229, 57, 53, 0.3)'
          }}>
            <h4 style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--primary-color)'
            }}>
              <FaQuestionCircle />
              Did You Know?
            </h4>
            <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}>
              Blood type is determined by the presence or absence of certain antigens on the surface of red blood cells. 
              These antigens can trigger an immune response if they are foreign to the body.
            </p>
            <p style={{ fontSize: '0.95rem' }}>
              The Rh factor (positive or negative) in your blood type refers to the Rhesus protein. If you have this protein, you're Rh-positive; if not, you're Rh-negative.
            </p>
          </div>
        </div>

        {/* Right side - Compatibility information */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div className="glass-panel" style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: '600', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FaExchangeAlt style={{ color: 'var(--primary-color)' }} />
              Compatibility Chart for {activeBloodType}
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: 'var(--success-color)' }}>
                Can donate to:
              </h4>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {bloodTypes.map(type => {
                  const canDonate = bloodTypeDetails.canDonateTo.includes(type);
                  return (
                    <div key={type} style={{ 
                      padding: '10px 15px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: canDonate ? 'rgba(67, 160, 71, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                      color: canDonate ? 'var(--success-color)' : 'var(--error-color)',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {canDonate ? <FaCheckCircle /> : <FaTimesCircle />}
                      {type}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: '#ff9800' }}>
                Can receive from:
              </h4>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {bloodTypes.map(type => {
                  const canReceive = bloodTypeDetails.canReceiveFrom.includes(type);
                  return (
                    <div key={type} style={{ 
                      padding: '10px 15px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: canReceive ? 'rgba(67, 160, 71, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                      color: canReceive ? 'var(--success-color)' : 'var(--error-color)',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {canReceive ? <FaCheckCircle /> : <FaTimesCircle />}
                      {type}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white',
              borderRadius: 'var(--radius-md)',
              padding: '15px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaHeartbeat style={{ color: 'var(--primary-color)' }} />
                Blood Transfusion Compatibility
              </h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Blood transfusions are safest when the donor's blood type matches the recipient's. However, in emergencies:
              </p>
              <ul style={{ 
                marginTop: '10px',
                paddingLeft: '20px',
                fontSize: '0.95rem'
              }}>
                <li style={{ marginBottom: '5px' }}>
                  <strong>O-</strong> is the universal donor (can donate to all blood types)
                </li>
                <li style={{ marginBottom: '5px' }}>
                  <strong>AB+</strong> is the universal recipient (can receive from all blood types)
                </li>
                <li>
                  <strong>Rh-negative</strong> blood can typically be given to both Rh-negative and Rh-positive patients
                </li>
              </ul>
            </div>
          </div>

          <div style={{ 
            backgroundImage: 'linear-gradient(135deg, rgba(229, 57, 53, 0.05) 0%, rgba(229, 57, 53, 0.15) 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'rgba(229, 57, 53, 0.1)'
            }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px', color: 'var(--primary-color)' }}>
                Donate Blood Today
              </h3>
              <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
                Your blood type is needed! Regardless of your blood type, your donation can help save lives.
              </p>
              <button style={{ 
                padding: '12px 25px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(229, 57, 53, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}>
                Find Donation Center <FaTint />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-panel" style={{ 
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px' }}>
          Blood Type Compatibility Chart
        </h3>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '25px', maxWidth: '700px' }}>
          This chart shows which blood types are compatible for transfusions. Always consult with healthcare professionals for medical advice.
        </p>
        
        <div style={{ 
          maxWidth: '100%',
          overflow: 'auto',
          padding: '10px'
        }}>
          <table style={{ 
            borderCollapse: 'collapse',
            width: '100%', 
            minWidth: '600px'
          }}>
            <thead>
              <tr>
                <th style={{ 
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '12px 15px',
                  textAlign: 'center',
                  border: '1px solid rgba(229, 57, 53, 0.3)',
                  position: 'sticky',
                  top: 0
                }}>Blood Type</th>
                {bloodTypes.map(type => (
                  <th key={type} style={{ 
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    padding: '12px 15px',
                    textAlign: 'center',
                    border: '1px solid rgba(229, 57, 53, 0.3)',
                    position: 'sticky',
                    top: 0
                  }}>{type}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloodTypes.map(donor => (
                <tr key={donor}>
                  <td style={{ 
                    backgroundColor: 'rgba(229, 57, 53, 0.1)',
                    fontWeight: '600',
                    padding: '10px 15px',
                    textAlign: 'center',
                    border: '1px solid rgba(229, 57, 53, 0.1)'
                  }}>{donor}</td>
                  {bloodTypes.map(recipient => {
                    const isCompatible = bloodCompatibility[donor].canDonateTo.includes(recipient);
                    return (
                      <td key={recipient} style={{ 
                        backgroundColor: 'white',
                        padding: '10px 15px',
                        textAlign: 'center',
                        border: '1px solid rgba(229, 57, 53, 0.1)',
                        color: isCompatible ? 'var(--success-color)' : 'var(--error-color)'
                      }}>
                        {isCompatible ? (
                          <FaCheckCircle style={{ fontSize: '1.2rem' }} />
                        ) : (
                          <FaTimesCircle style={{ fontSize: '1.2rem' }} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '20px' }}>
          Read across each row to see which blood types a donor can give to.
        </p>
      </div>
    </div>
  );
};

export default BloodTypes; 