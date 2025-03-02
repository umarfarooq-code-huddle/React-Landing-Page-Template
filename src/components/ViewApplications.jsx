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
import logo from "../assets/landingAssets/image.png";
import bg from "../assets/landingAssets/bg.png";
import FundApplicationModal from './FundApplicationModal'; // Import new modal
import { jsPDF } from 'jspdf'; // Import jsPDF for generating PDF

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
    const [drawAmount, setDrawAmount] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // New state for active tab
    const [showFundModal, setShowFundModal] = useState(false); // New state for fund modal
    const [fundedApps, setFundedApps] = useState([]); // New state for funded applications

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
                const fundedApplications = applicationsData.filter(app => app.funded);
                setFundedApps(fundedApplications);
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
            applications.filter((app) => {
            if (name === 'issues') {
                return app.issues.some((issue) =>
                issue.toLowerCase().includes(value.toLowerCase())
                );
            }
            return app[name]?.toLowerCase().includes(value.toLowerCase());
            })
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
            eligibleApps = eligibleApps.filter((app) => !app.drawTypes.find((dType)=>dType.drawType === drawType));

            const randomApp = eligibleApps[Math.floor(Math.random() * eligibleApps.length)];
            if (randomApp) {
                await updateDoc(doc(db, 'applications', randomApp.id), { drawTypes: [...randomApp.drawTypes, {drawType,drawAmount}] });
            }
            setSelectedApp(randomApp || null);
            setLoading(false);
        }, 1500);
    };

    const handleDrawTypeSelect = (type) => {
        setDrawType(type.drawType);
        setDrawAmount(type.drawAmount);
        setShowDrawTypeModal(false);
        setShowModal(true);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'selected') {
            setFilteredApps(applications.filter(app => app.drawTypes.length > 0));
        } else if (tab === 'funded') {
            setFilteredApps(fundedApps);
        } else {
            setFilteredApps(applications);
        }
    };

    const handleFundApplication = (app) => {
        setSelectedApp(app);
        setShowFundModal(true);
    };




    const handleFundModalSubmit = async (selectedFields, transactionId) => {
        const fundedApp = { ...selectedApp, funded: true, transactionId };
    
        // Update Firestore
        await updateDoc(doc(db, "applications", selectedApp.id), { funded: true, transactionId });
    
        // Generate PDF receipt
        const docum = new jsPDF();
    
        // Add Background Image
        const pageWidth = docum.internal.pageSize.getWidth();
        const pageHeight = docum.internal.pageSize.getHeight();
        docum.addImage(bg, "PNG", 0, 0, pageWidth, pageHeight); // Full-page background
    
        // Add Logo
        if (logo) {
            docum.addImage(logo, "PNG", 10, 10, 40, 40); // Adjusted for better aesthetics
        }
    
        // Title Styling (Increase Visibility)
        docum.setFont("helvetica", "bold");
        docum.setFontSize(26);
        docum.setTextColor(0, 0, 0); // Black text for better visibility
        docum.text("Funding Receipt", pageWidth / 2, 50, { align: "center" });
    
        // Transaction Details (Darker Colors for Visibility)
        docum.setFont("helvetica", "normal");
        docum.setFontSize(14);
        docum.setTextColor(50, 50, 50); // Darker gray for improved contrast
        docum.text(`Transaction ID: ${transactionId}`, 20, 80);
    
        // Dynamic Fields with Better Visibility
        let yPosition = 100;
        selectedFields.forEach((field) => {
            docum.setTextColor(30, 30, 30); // Ensures text is readable
            docum.text(`${field}: ${selectedApp[field]}`, 20, yPosition);
            yPosition += 10;
        });
    
        // Footer
        docum.setFontSize(12);
        docum.setTextColor(80, 80, 80); // Slightly darker gray for clarity
        docum.text("Thank you for your support!", pageWidth / 2, pageHeight - 20, { align: "center" });
    
        // Save PDF
        docum.save(`receipt_${transactionId}.pdf`);
    
        // Move application to funded
        setFundedApps([...fundedApps, fundedApp]);
        setFilteredApps(filteredApps.filter((app) => app.id !== selectedApp.id));
        setShowFundModal(false);
    };
    
    
    

    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
      setLandingPageData(JsonData);
    }, []);

    return (
        <>
              <Navigation data = {landingPageData.App}/>
        <div className={styles.container} style={{marginTop: "4.5vh"}}>
            <h1 className={styles.title}>Applications List</h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <button
                    style={{
                        padding: '9px 18px',
                        margin: '0 9px',
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
                        padding: '9px 18px',
                        margin: '0 9px',
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
                <button
                    style={{
                        padding: '9px 18px',
                        margin: '0 9px',
                        backgroundColor: activeTab === 'funded' ? '#007bff' : '#f8f9fa',
                        color: activeTab === 'funded' ? '#fff' : '#000',
                        border: '1px solid #007bff',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleTabChange('funded')}
                >
                    Funded Applications
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
                                    {activeTab === 'selected' && (
                                                <th>
                                                  Actions
                                                </th>
                                            )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.length > 0 ? (
                                    filteredApps.map((app) => (
                                        <tr key={app.id}>
                                            <td>{app.srNo}</td>
                                            <td>{app.legalName}</td>
                                            <td>{app.selectedState || 'N/A'}</td>
                                            <td>{app.selectedCountry || 'N/A'}</td>
                                            <td>{app.rumbleUserName || 'N/A'}</td>
                                            <td>{app.youtubeUserName || 'N/A'}</td>
                                            <td>{app.gmail || 'N/A'}</td>
                                            <td>{app.phone || 'N/A'}</td>
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
                                                            padding: '4px 9px',
                                                            borderRadius: '15px',
                                                            backgroundColor: '#28a745',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            marginRight: '4px',
                                                            marginBottom: '4px'
                                                        }}
                                                    >
                                                        {String(type.drawType)} ({type.drawAmount})
                                                    </span>
                                                ))}
                                            </td>
                                            <td>{app.daysRemaining} days</td>
                                            {activeTab === 'selected' && (
                                                <td>
                                                    <button
                                                        className={globalStyles.selectButton}
                                                        onClick={() => handleFundApplication(app)}
                                                    >
                                                        Fund
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12" className={styles.noData}>
                                            No applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Random Select Button */}
            {activeTab==="all" && <button
                className={globalStyles.selectButton}
                onClick={() => {
                    setShowDrawTypeModal(true);
                    setSelectedApp(null);
                }}
            >
                Select Random
            </button>}

            {/* Draw Type Modal */}
            {showDrawTypeModal && (
                <DrawTypeModal
                    onClose={() => setShowDrawTypeModal(false)}
                    onSelect={handleDrawTypeSelect}
                />
            )}

            {/* logo Modal */}
            {showModal && (
                <EligibilityModal
                    onClose={() => setShowModal(false)}
                    onApplyFilter={handleRandomSelect}
                    loading={loading}
                    selectedApp={selectedApp}
                />
            )}

            {/* Fund Application Modal */}
            {showFundModal && (
                <FundApplicationModal
                    onClose={() => setShowFundModal(false)}
                    onSubmit={handleFundModalSubmit}
                    application={selectedApp}
                />
            )}
        </div>
        </>
    );
}

export default ViewApplications;
