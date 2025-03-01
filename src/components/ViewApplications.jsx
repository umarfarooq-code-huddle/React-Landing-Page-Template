import { doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import styles from './ViewApplications.module.css';
import globalStyles from '../global.module.css';
import EligibilityModal from './EligibilityModal';
import { useCountries } from './useCountries';
import { useStates } from './useStates';
import { db } from '../utils/firebase'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods
import DrawTypeModal from './DrawTypeModal';
import  JsonData  from '../data/data.json';
import { Navigation } from './navigation';


function ViewApplications() {
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDrawTypeModal, setShowDrawTypeModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedCountryFilter, setSelectedCountryFilter] = useState('');
    const [selectedStateFilter, setSelectedStateFilter] = useState('');
    const [drawType, setDrawType] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // New state for active tab

    // Get all countries and states using hooks
    const countries = useCountries();
    const states = useStates(selectedCountryFilter); // States will depend on selected country

    // Fetch applications from Firestore
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const applicationsCollection = collection(db, 'applications');
                const applicationsSnapshot = await getDocs(applicationsCollection);
                const applicationsData = applicationsSnapshot.docs.map((doc, index) => {
                    const data = doc.data();
                    const submissionDate = data.submittedAt ? new Date(data.submittedAt) : new Date();
                    const expiryDate = new Date(submissionDate);
                    expiryDate.setDate(expiryDate.getDate() + 365);
                    const daysRemaining = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
                    return {
                        id: doc.id, // Include document ID
                        srNo: index + 1, // Add serial number
                        daysRemaining, // Add days remaining
                        drawTypes: data.drawTypes || [], // Initialize drawTypes array
                        ...data,
                    };
                });
                setApplications(applicationsData);
                setFilteredApps(applicationsData);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        if (name === 'selectedCountry') {
            setSelectedCountryFilter(value);
        } else if (name === 'selectedState') {
            setSelectedStateFilter(value);
        }

        setFilteredApps(
            applications.filter((app) =>
                app[name]?.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleRandomSelect = async (eligibilityFilters) => {
        setLoading(true);
        setSelectedApp(null);

        setTimeout(async () => {
            let eligibleApps = applications;

            if (eligibilityFilters.selectedState) {
                eligibleApps = eligibleApps.filter((app) =>
                    app.selectedState?.toLowerCase().includes(eligibilityFilters.selectedState.toLowerCase())
                );
            }

            if (eligibilityFilters.selectedCountry) {
                eligibleApps = eligibleApps.filter((app) =>
                    app.selectedCountry?.toLowerCase().includes(eligibilityFilters.selectedCountry.toLowerCase())
                );
            }

            if (eligibilityFilters.issues && eligibilityFilters.issues.length > 0) {
                eligibleApps = eligibleApps.filter((app) =>
                    app.issues.some((issue) => eligibilityFilters.issues.includes(issue))
                );
            }

            // Filter out applications already selected for the current draw type
            eligibleApps = eligibleApps.filter((app) => !app.drawTypes.includes(drawType));

            const randomApp = eligibleApps[Math.floor(Math.random() * eligibleApps.length)];
            if (randomApp) {
                await updateDoc(doc(db, 'applications', randomApp.id), { drawTypes: [...randomApp.drawTypes, drawType] });
            }
            setSelectedApp(randomApp || null);
            setLoading(false);
        }, 1500);
    };

    const handleDrawTypeSelect = (type) => {
        setDrawType(type);
        setShowDrawTypeModal(false);
        setShowModal(true);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'selected') {
            setFilteredApps(applications.filter(app => app.selected));
        } else {
            setFilteredApps(applications);
        }
    };

    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
      setLandingPageData(JsonData);
    }, []);

    return (
        <>
              <Navigation data = {landingPageData.App}/>
        <div className={styles.container} style={{marginTop: "5vh"}}>
            <h1 className={styles.title}>Applications List</h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <button
                    style={{
                        padding: '10px 20px',
                        margin: '0 10px',
                        backgroundColor: activeTab === 'all' ? '#007bff' : '#f8f9fa',
                        color: activeTab === 'all' ? '#fff' : '#000',
                        border: '1px solid #007bff',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleTabChange('all')}
                >
                    All Applications
                </button>
                <button
                    style={{
                        padding: '10px 20px',
                        margin: '0 10px',
                        backgroundColor: activeTab === 'selected' ? '#007bff' : '#f8f9fa',
                        color: activeTab === 'selected' ? '#fff' : '#000',
                        border: '1px solid #007bff',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleTabChange('selected')}
                >
                    Selected Applications
                </button>
            </div>

            <div className={styles.filters}>
                <input
                    type="text"
                    name="legalName"
                    placeholder="Filter by Legal Name"
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />

                {/* Country Filter */}
                <select
                    name="selectedCountry"
                    value={selectedCountryFilter}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                >
                    <option value="">-- Filter by Country --</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>

                {/* State Filter */}
                <select
                    name="selectedState"
                    value={selectedStateFilter}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                    disabled={!selectedCountryFilter}
                >
                    <option value="">-- Filter by State --</option>
                    {states.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="issues"
                    placeholder="Filter by Issues"
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />
            </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Sr No</th>
                                    <th>Legal Name</th>
                                    <th>State of Residency</th>
                                    <th>Country of Residency</th>
                                    <th>Rumble Username</th>
                                    <th>Youtube Username</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Issues</th>
                                    <th>Selected</th>
                                    <th>Expires In</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.length > 0 ? (
                                    filteredApps.map((app) => (
                                        <tr key={app.id}>
                                            <td>{app.srNo}</td>
                                            <td>{app.legalName}</td>
                                            <td>{app.selectedState || 'N/A'}</td>
                                            <td>{app.rumbleUserName || 'N/A'}</td>
                                            <td>{app.youtubeUserName || 'N/A'}</td>
                                            <td>{app.gmail || 'N/A'}</td>
                                            <td>{app.phone || 'N/A'}</td>
                                            <td>{app.selectedCountry || 'N/A'}</td>
                                            <td>
                                                {app.issues.map((issue, idx) => (
                                                    <div key={idx}>{issue}</div>
                                                ))}
                                            </td>
                                            <td>
                                                {app?.drawTypes?.map((type, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '5px 10px',
                                                            borderRadius: '15px',
                                                            backgroundColor: '#28a745',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            marginRight: '5px'
                                                        }}
                                                    >
                                                        {String(type)}
                                                    </span>
                                                ))}
                                            </td>
                                            <td>{app.daysRemaining} days</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className={styles.noData}>
                                            No applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Random Select Button */}
            <button
                className={globalStyles.selectButton}
                onClick={() => {
                    setShowDrawTypeModal(true);
                    setSelectedApp(null);
                }}
            >
                Select Random
            </button>

            {/* Draw Type Modal */}
            {showDrawTypeModal && (
                <DrawTypeModal
                    onClose={() => setShowDrawTypeModal(false)}
                    onSelect={handleDrawTypeSelect}
                />
            )}

            {/* Eligibility Modal */}
            {showModal && (
                <EligibilityModal
                    onClose={() => setShowModal(false)}
                    onApplyFilter={handleRandomSelect}
                    loading={loading}
                    selectedApp={selectedApp}
                />
            )}
        </div>
        </>
    );
}

export default ViewApplications;
