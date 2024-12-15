import React, { useState, useEffect } from 'react';
import styles from './ViewApplications.module.css';
import globalStyles from '../global.module.css';
import EligibilityModal from './EligibilityModal';
import { useCountries } from './useCountries';
import { useStates } from './useStates';
import { db } from '../utils/firebase'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods

function ViewApplications() {
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedCountryFilter, setSelectedCountryFilter] = useState('');
    const [selectedStateFilter, setSelectedStateFilter] = useState('');

    // Get all countries and states using hooks
    const countries = useCountries();
    const states = useStates(selectedCountryFilter); // States will depend on selected country

    // Fetch applications from Firestore
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const applicationsCollection = collection(db, 'applications');
                const applicationsSnapshot = await getDocs(applicationsCollection);
                const applicationsData = applicationsSnapshot.docs.map((doc) => ({
                    id: doc.id, // Include document ID
                    ...doc.data(),
                }));
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

    const handleRandomSelect = (eligibilityFilters) => {
        setLoading(true);
        setSelectedApp(null);

        setTimeout(() => {
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

            const randomApp = eligibleApps[Math.floor(Math.random() * eligibleApps.length)];
            setSelectedApp(randomApp || null);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Applications List</h1>

            {/* Filters */}
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

            {/* Applications List */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Legal Name</th>
                        <th>State of Residency</th>
                        <th>Country of Residency</th>
                        <th>Issues</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApps.length > 0 ? (
                        filteredApps.map((app) => (
                            <tr key={app.id}>
                                <td>{app.legalName}</td>
                                <td>{app.selectedState || 'N/A'}</td>
                                <td>{app.selectedCountry || 'N/A'}</td>
                                <td>
                                    {app.issues.map((issue, idx) => (
                                        <div key={idx}>{issue}</div>
                                    ))}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className={styles.noData}>
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
                    setShowModal(true);
                    setSelectedApp(null);
                }}
            >
                Select Random
            </button>

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
    );
}

export default ViewApplications;
