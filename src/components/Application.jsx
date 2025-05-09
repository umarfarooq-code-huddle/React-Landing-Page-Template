import React, { useState } from 'react';
import styles from './ApplicationForm.module.css';
import Toast from './Toast';
import { useNavigate } from 'react-router-dom';
import { useCountries } from './useCountries';
import { useStates } from './useStates';
import { db } from '../utils/firebase'; // Make sure to import your Firebase config
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Navigation } from './navigation';
import JsonData from '../data/data.json';

const issuesList = [
  'Mortgage / Rent: payments late.',
  'Utilities: delinquent on payments',
  'Vehicle loan: delinquent on payments',
  'Student loan: delinquent on payments',
  'Medical bills: delinquent on payments',
  'School tuition: delinquent on payments',
  'Credit card debt',
  'Special needs child',
  'Shelter needs',
  'Clothing needs',
  'Vehicle repairs',
  'Home Repairs',
];

function ApplicationForm() {
  const navigate = useNavigate();
  const [legalName, setLegalName] = useState('');
  const [rumbleUserName, setRumbleUsername] = useState('');
  const [youtubeUserName, setYoutubeUsername] = useState('');
  const [otherIssue, setOtherIssue] = useState(''); // To store the input for "Other" issue

  const [gmail, setGmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [otherCountry, setOtherCountry] = useState('');
  const [issues, setIssues] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');

  const countries = useCountries();
  const states = useStates(selectedCountry);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const finalIssues = [...issues];
    if (issues.includes('Other') && otherIssue) {
      finalIssues.push(otherIssue); // Add the custom issue to the issues array
      finalIssues.splice(finalIssues.indexOf('Other'), 1); // Remove "Other" placeholder
    }

    if(finalIssues?.length<1){
      setError("Please select atleast one issue")
      return;
    }
  
    try {
      // Get total count of applications
      const applicationsRef = collection(db, 'applications');
      const applicationsSnapshot = await getDocs(applicationsRef);
      const applicationCount = applicationsSnapshot.size + 1; // Add 1 for the new application
      const applicationId = applicationCount.toString();
  
      const formData = {
        legalName,
        selectedCountry: selectedCountry === 'Other' && otherCountry ? otherCountry : selectedCountry,
        issues: finalIssues,
        rumbleUserName,
        selectedState: selectedState,
        youtubeUserName,
        gmail,
        phone,
        submittedAt: new Date().toISOString(),
        applicationId, // Add the application ID
      };
  
      // Query Firestore to check if an application with the same phone or email exists within the last year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
      const phoneQuery = query(applicationsRef, where('phone', '==', phone));
      const emailQuery = query(applicationsRef, where('gmail', '==', gmail));
  
      const phoneSnapshot = await getDocs(phoneQuery);
      const emailSnapshot = await getDocs(emailQuery);
  
      // Check if any of the records are within the last year
      const recentPhoneApplication = phoneSnapshot.docs.find(doc => {
        const submittedAt = new Date(doc.data().submittedAt);
        return submittedAt >= oneYearAgo;
      });
  
      const recentEmailApplication = emailSnapshot.docs.find(doc => {
        const submittedAt = new Date(doc.data().submittedAt);
        return submittedAt >= oneYearAgo;
      });
  
      if (recentPhoneApplication || recentEmailApplication) {
        setError('An application with this phone number or email was submitted within the last year.');
        return;
      }
  
      // Add a new document to the Firestore database
      const docRef = await addDoc(applicationsRef, formData);
      console.log('Document written with ID: ', docRef.id);
  
      setShowToast(true);
      setError(''); // Clear any previous errors
  
      // Clear the form after successful submission
      setLegalName('');
      setRumbleUsername('');
      setSelectedCountry('');
      setOtherCountry('');
      setIssues([]);
      setGmail('');
      setPhone('');
      setOtherIssue('');
      setSelectedState('');
      setYoutubeUsername('');
  
      // Navigate after a short delay to allow the user to see the success message
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  
  
  const handleIssueChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setIssues([...issues, value]);
    } else {
      setIssues(issues.filter((issue) => issue !== value));
    }
  };

  return (
    <div>
      <Navigation data={JsonData.App} />
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <h1 className={styles.title}>Application Questionnaire</h1>


            <div className={styles.formGroup}>
              <label htmlFor="legalName">Legal Name:</label>
              <input
                type="text"
                id="legalName"
                value={legalName}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(input)) {
                    setLegalName(input);
                  }
                }}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rumbleUserName">Rumble Username:</label>
              <input
                type="text"
                id="rumbleUserName"
                value={rumbleUserName}
                onChange={(e) => setRumbleUsername(e.target.value)}
                required
              />
              <p style={{fontStyle:'italic', color:'#666', fontSize: '0.9em'}}>
                If you don't have a Rumble account, please enter "not subscribed"
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="youtubeUserName">Youtube Username:</label>
              <input
                type="text"
                id="youtubeUserName"
                value={youtubeUserName}
                onChange={(e) => setYoutubeUsername(e.target.value)}
                required
              />
              <p style={{fontStyle:'italic', color:'#666', fontSize: '0.9em'}}>
                If you don't have a YouTube account, please enter "not subscribed"
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gmail">Email:</label>
              <input
                type="email"
                id="gmail"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                required
              />
            </div>
            <p style={{fontStyle:'italic', color:'red'}}>

            To ensure smooth verification, please enter the email address associated with the YouTube account you used to subscribe. This will help match your subscription details accurately.
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number:</label>
              <br />
              <PhoneInput
                country={'us'}
                value={phone}

                onChange={(phone) => setPhone(phone)}
                required
              />
            </div>

            <h2 className={styles.sectionTitle}>Country of Residency</h2>
            <div className={styles.formGroup}>
              <label htmlFor="countrySelect">Select Country:</label>
              <select
                id="countrySelect"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                required
              >
                <option value="" disabled>
                  -- Select a Country --
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {selectedCountry === 'Other' && (
              <div className={styles.formGroup}>
                <label htmlFor="otherCountry">Please specify:</label>
                <input
                  type="text"
                  id="otherCountry"
                  value={otherCountry}
                  maxLength={40}
                  onChange={(e) => setOtherCountry(e.target.value)}
                  required
                />
              </div>
            )}

            {states.length > 0 && (
              <>
                <h2 className={styles.sectionTitle}>State of Residency</h2>
                <div className={styles.formGroup}>
                  <label htmlFor="stateSelect">Select State:</label>
                  <select
                    id="stateSelect"
                    required
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    <option value="" disabled>
                      -- Select a State --
                    </option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <h2 className={styles.sectionTitle}>
              Check all that apply <br /> (Information must be verified for eligibility)
            </h2>

            <div className={styles.checkboxGroup}>
              {issuesList.map((issue) => (
                <label key={issue} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={issue}
                    checked={issues.includes(issue)}
                    onChange={handleIssueChange}
                  />
                  {issue}
                </label>
              ))}
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value="Other"
                  checked={issues.includes('Other')}
                  onChange={(event) => {
                    handleIssueChange(event);
                    if (!event.target.checked) {
                      setOtherIssue(''); // Clear the "Other" input if unchecked
                    }
                  }}
                />
                Other
              </label>
              {issues.includes('Other') && (
                <div className={styles.formGroup}>
                  <label htmlFor="otherIssue">Please specify:</label>
                  <input
                    type="text"
                    id="otherIssue"
                    value={otherIssue}
                    onChange={(e) => setOtherIssue(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {error && <p style={{color:'red'}}>{error}</p>}


            <button type="submit" className={styles.submitButton}>
              Submit Application
            </button>
          </form>
        </div>

        {showToast && (
          <Toast 
            message="Application submitted successfully! Redirecting to home page..." 
            onClose={() => {
              setShowToast(false);
              navigate('/');
            }} 
          />
        )}
      </div>
    </div>
  );
}

export default ApplicationForm;
