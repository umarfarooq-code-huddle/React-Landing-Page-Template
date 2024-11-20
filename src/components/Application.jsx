import React, { useState } from 'react';
import styles from './ApplicationForm.module.css';
import Toast from './Toast';
import { useNavigate } from 'react-router-dom';
import { useCountries } from './useCountries';
import { useStates } from './useStates';

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
  const [selectedCountry, setSelectedCountry] = useState('');
  const [otherCountry, setOtherCountry] = useState('');
  const [issues, setIssues] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [existingApplications, setExistingApplications] = useState([]);

  const countries = useCountries(); // Get countries from the hook
  const states = useStates(selectedCountry); // Get states based on selected country

  const fetchData = async () => {
    const data = JSON.parse(localStorage.getItem('applicationData'));
    if (data) {
      setExistingApplications(data);
    }
  };
  useState(() => {
    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      legalName,
      selectedCountry: selectedCountry === 'Other' && otherCountry ? otherCountry : selectedCountry,
      issues,
      rumbleUserName,
    };

    console.log('Form Data:', formData);

    localStorage.setItem('applicationData', JSON.stringify([formData, ...existingApplications]));

    setTimeout(() => {
      navigate('/');
    }, 1000);

    setShowToast(true);

    setLegalName('');
    setSelectedCountry('');
    setOtherCountry('');
    setIssues([]);
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
              onChange={(e) => setLegalName(e.target.value)}
              required
            />
          </div>


          <div className={styles.formGroup}>
            <label htmlFor="legalName">Rumble Username:</label>
            <input
              type="text"
              id="rumbleUserName"
              value={rumbleUserName}
              onChange={(e) => setRumbleUsername(e.target.value)}
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
                <select id="stateSelect" required>
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
            Check all that apply (Information must be verified for eligibility)
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
          </div>
          <div className={styles.checkboxGroup}>
            {/* Add your issues list checkboxes here */}
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit Application
          </button>
        </form>
      </div>

      {showToast && (
        <Toast message="Application submitted successfully!" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default ApplicationForm;
