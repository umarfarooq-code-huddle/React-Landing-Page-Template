import React, { useState } from 'react';
import styles from './ApplicationForm.module.css';
import globalStyles from '../global.module.css';
import { statesList, majorCountries, issuesList } from './data'; // Shared data
import { useCountries } from './useCountries';
import { useStates } from './useStates';

function EligibilityModal({ onClose, onApplyFilter, loading, selectedApp }) {
    const [selectedState, setSelectedState] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [otherCountry, setOtherCountry] = useState('');
    const countries = useCountries()
    const states = useStates(selectedCountry)
    const [issues, setIssues] = useState([]);

    const handleIssueChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setIssues([...issues, value]);
        } else {
            setIssues(issues.filter((issue) => issue !== value));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const filters = {
            selectedState,
            selectedCountry: selectedCountry === 'Other' && otherCountry ? otherCountry : selectedCountry,
            issues,
        };

        onApplyFilter(filters);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                {loading && <div className={styles.loader}>Loading...</div>}

                {!loading && !selectedApp && (
                    <form onSubmit={handleSubmit}>
                        <h1 className={styles.title}>Eligibility Criteria</h1>

                        <div className={styles.formGroup}>
                            <label htmlFor="countrySelect">Country of Residency</label>
                            <select
                                id="countrySelect"
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Select a Country --</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="stateSelect">State of Residency</label>
                            <select
                                id="stateSelect"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Select a State --</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
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

                        <h2 className={styles.sectionTitle}>Select Issues</h2>
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

                        <button type="submit" className={globalStyles.submitButton}>
                            Apply Filters
                        </button>

                        <button type="button" className={globalStyles.rejectButton} onClick={onClose}>
                            Close
                        </button>
                    </form>
                )}

                {!loading && selectedApp && (
                    <div>
                        <h2>Selected Application</h2>
                        <p><strong>Legal Name:</strong> {selectedApp.legalName}</p>
                        <p><strong>State:</strong> {selectedApp.selectedState}</p>
                        <p><strong>Country:</strong> {selectedApp.selectedCountry}</p>
                        <p><strong>Issues:</strong> {selectedApp.issues.join(', ')}</p>

                        <div className={styles.buttonGroup}>
                            <button className={globalStyles.submitButton} onClick={() => onApplyFilter(null, true)}>
                                Select Another
                            </button>
                            <button className={globalStyles.rejectButton} onClick={onClose}>
                                Reject
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EligibilityModal;
