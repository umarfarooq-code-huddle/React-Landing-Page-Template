import React, { useState } from 'react';
import { statesList, majorCountries, issuesList } from './data'; // Shared data
import { useCountries } from './useCountries';
import { useStates } from './useStates';
import Select from 'react-select';

function EligibilityModal({ onClose, onApplyFilter, loading, selectedApp }) {
    const [selectedState, setSelectedState] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [otherCountry, setOtherCountry] = useState('');
    const countries = useCountries();
    const [selectedCountries, setSelectedCountries] = useState([]);
    const states = useStates(selectedCountries[0]?.value);
    const [issues, setIssues] = useState([]);

    const [filters, setFilters] = useState();
    const handleIssueChange = (event) => {
        const { value, checked } = event.target;
        setIssues(checked ? [...issues, value] : issues.filter((issue) => issue !== value));
    };

    console.log(selectedCountries)
    const handleSubmit = (event) => {
        event.preventDefault();

        const filters = {
            selectedState,
            selectedCountries: selectedCountries,
            issues,
        };
        setFilters(filters)
        onApplyFilter(filters);
    };

    const styles = {
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            overflowY: 'auto',
        },
        modal: {
            backgroundColor: 'white',
            padding: '13.5px',
            borderRadius: '9px',
            maxWidth: '405px',
            width: '100%',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 2100,
            margin: '20px',
        },
        loader: {
            fontSize: '16.2px',
            fontWeight: 'bold',
            marginTop: '15px',
            textAlign: 'center',
        },
        title: {
            textAlign: 'center',
            marginBottom: '40px',
            color: '#333',
            fontSize: '32.4px',
        },
        formGroup: {
            marginBottom: '30px',
        },
        formGroupLabel: {
            display: 'block',
            marginBottom: '8px',
            color: '#555',
            fontSize: '16.2px',
        },
        input: {
            width: '100%',
            padding: '10.8px 13.5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '14.4px',
            transition: 'border-color 0.3s',
        },
        sectionTitle: {
            marginTop: '40px',
            marginBottom: '20px',
            color: '#444',
            fontSize: '21.6px',
            borderBottom: '2px solid #ddd',
            paddingBottom: '10px',
        },
        checkboxGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '20px',
        },
        checkboxLabel: {
            width: '48%',
            marginBottom: '15px',
            color: '#555',
            fontSize: '14.4px',
            display: 'flex',
            alignItems: 'center',
        },
        checkboxInput: {
            marginRight: '10px',
            transform: 'scale(1.08)',
        },
        submitButton: {
            display: 'block',
            width: '100%',
            padding: '16.2px',
            background: 'linear-gradient(to right, #36d1dc, #5b86e5)',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'background 0.3s',
            marginTop: '10px',
        },
        rejectButton: {
            display: 'block',
            width: '100%',
            padding: '16.2px',
            background: 'linear-gradient(to right, #cf0937, #b84747)',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '18px',
            marginTop: '10px',
            cursor: 'pointer',
            transition: 'background 0.3s',
        },
        buttonGroup: {
            display: 'flex',
            justifyContent: 'space-between',
        },
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>
                {loading && <div style={styles.loader}>Loading...</div>}

                {(!loading && !selectedApp )&& (
                    <form onSubmit={handleSubmit}>
                        <h1 style={styles.title}>Eligibility Criteria</h1>

                        <div style={{display:'flex', flexDirection:'column'}}>
                            <label htmlFor="countrySelect" style={styles.formGroupLabel}>Country of Residency</label>
                            <Select
                                isMulti
                                options={countries.map(country => ({ value: country, label: country }))}
                                value={selectedCountries}
                                onChange={(val)=>{
                                    console.log("value",val)
                                    const sAll = val.find((a)=>a.value === 'Select All');
                                    console.log("sAll",sAll)
                                    if(sAll){
                                        setSelectedCountries([sAll])
                                    }else{
                                        console.log("Setting", val)
                                        setSelectedCountries(val)
                                    }
                                }}
                                placeholder="Select country/countries"
                               />
                                
                        </div>
                        {selectedCountries.length===1 && selectedCountries[0].value !="Select All" && states.length>0 && <div style={styles.formGroup}>
                            <label htmlFor="stateSelect" style={styles.formGroupLabel}>State of Residency</label>
                            <select
                                id="stateSelect"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                required
                                style={styles.input}
                            >
                                <option value="" disabled>-- Select a State --</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>}

                        {selectedCountry === 'Other' && (
                            <div style={styles.formGroup}>
                                <label htmlFor="otherCountry" style={styles.formGroupLabel}>Please specify:</label>
                                <input
                                    type="text"
                                    id="otherCountry"
                                    value={otherCountry}
                                    onChange={(e) => setOtherCountry(e.target.value)}
                                    required
                                    style={styles.input}
                                />
                            </div>
                        )}

                        <h2 style={styles.sectionTitle}>Select Issues</h2>
                        <div style={styles.checkboxGroup}>
                            {issuesList.map((issue) => (
                                <label key={issue} style={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        value={issue}
                                        checked={issues.includes(issue)}
                                        onChange={handleIssueChange}
                                        style={styles.checkboxInput}
                                    />
                                    {issue}
                                </label>
                            ))}
                        </div>

                        <button type="submit" style={styles.submitButton}>
                            Apply Filters
                        </button>

                        <button  style={styles.submitButton} onClick={()=>{
                            setFilters({})
                            onApplyFilter({})
                        }}>
                           Select  Without Filters
                        </button>

                        <button  style={styles.rejectButton} onClick={onClose}>
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

                        <div style={styles.buttonGroup}></div>
                            <button style={styles.submitButton} onClick={() => onApplyFilter(filters)}>
                                Select Another
                            </button>
                            <button style={styles.rejectButton} onClick={onClose}>
                                Close
                            </button>
                     </div>
                   
                )}
            </div>
        </div>
    );
}

export default EligibilityModal;
