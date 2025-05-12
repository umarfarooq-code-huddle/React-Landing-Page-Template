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
import JsonData from '../data/data.json';
import logo from "../assets/landingAssets/image.png";
import bg from "../assets/landingAssets/bg.png";
import FundApplicationModal from './FundApplicationModal'; // Import new modal
import { jsPDF } from 'jspdf'; // Import jsPDF for generating PDF

import { Navigation } from './navigation';

// Map of display names to application keys for the receipt
const receiptFieldsMap = {
    srNo: 'Application Serial #',
    id: 'Funding Transaction ID',
    submittedAt: 'Date',
    legalName: 'Legal Name',
    selectedCountry: 'Country',
    selectedState: 'State',
    rumbleUserName: 'Rumble Username',
    youtubeUserName: 'YouTube Username',
    gmail: 'email',
    phone: 'Phone',
    issues: 'Issues',
    drawType: 'Draw Tag',
    drawAmount: 'Amount of Grant',
    applicationExpiry: 'Application Expiry Date',
};

function ViewApplications() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null)
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
    const [selectedApplications, setSelectedApplications] = useState([]); // New state for funded applications

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
                    const applicationExpiry = expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    return {
                        id: doc.id, // Include document ID
                        srNo: index + 1, // Add serial number
                        applicationExpiry, // Add days remaining
                        drawTypes: data.drawTypes || [], // Initialize drawTypes array
                        ...data,
                    };
                }).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)); // Sort in descending order

                console.log({ applicationsData })
                setApplications(applicationsData);
                setFilteredApps(applicationsData);


                const fundedApplications = applicationsData.filter(app => app.funded);
                setFundedApps(fundedApplications);

                const mySelecteedApplications = applicationsData.filter((app) => app.drawTypes.length > 0).flatMap(app =>
                    app.drawTypes.map(draw => ({
                        ...app,  // Keep all fields
                        drawTypes: [draw]  // Wrap the single drawType object in an array
                    }))
                );
                console.log({ mySelecteedApplications })
                setSelectedApplications(mySelecteedApplications)


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
            try {

                let eligibleApps = applications;

                if (eligibilityFilters.selectedStates) {
                    console.log("filterS", eligibilityFilters.selectedStates[0].value === 'Select All')
                    if (eligibilityFilters.selectedStates.length === 1 && eligibilityFilters.selectedStates[0].value === 'Select All') {
                        console.log(eligibilityFilters.selectedCountries, "here")
                    } else {

                        console.log(eligibilityFilters.selectedStates)
                        eligibleApps = eligibleApps.filter((app) =>
                            eligibilityFilters.selectedStates.some((state) => {
                                const returnValue = app.selectedState?.toLowerCase().includes(state.value.toLowerCase());

                                console.log(returnValue, app.selectedState)

                                return returnValue
                            }
                            )
                        );
                    }

                }

                console.log("After states", eligibleApps)


                if (eligibilityFilters.selectedCountries) {
                    console.log("filterS", eligibilityFilters.selectedCountries[0].value === 'Select All')
                    if (eligibilityFilters.selectedCountries.length === 1 && eligibilityFilters.selectedCountries[0].value === 'Select All') {
                        console.log(eligibilityFilters.selectedCountries, "here")
                    } else {
                        eligibleApps = eligibleApps.filter((app) =>
                            eligibilityFilters.selectedCountries.some((country) => {
                                const returnValue = app.selectedCountry?.toLowerCase().includes(country.value.toLowerCase());

                                console.log(returnValue, app.selectedCountry)

                                return returnValue
                            }
                            )
                        );
                    }

                }

                console.log("After countries", eligibleApps)

                if (eligibilityFilters.issues && eligibilityFilters.issues.length > 0) {
                    eligibleApps = eligibleApps.filter((app) => {
                        const outerRetValue = app.issues.some((issue) => {
                            const innverRetVal = eligibilityFilters.issues.includes(issue)
                            console.log({ innverRetVal, appIssue: issue, app, eligibleIssues: eligibilityFilters.issues })
                            return innverRetVal;
                        })

                        console.log({ retVale: outerRetValue, issues: app.issues, })
                        return outerRetValue;
                    }

                    );
                }

                console.log("after issues", eligibleApps)

                // Filter out applications already selected for the current draw type
                eligibleApps = eligibleApps.filter((app) => !app.drawTypes.find((dType) => dType.drawType === drawType));

                const randomApp = eligibleApps[Math.floor(Math.random() * eligibleApps.length)];
                if (randomApp) {
                    const now = new Date().toISOString();
                    await updateDoc(doc(db, 'applications', randomApp.id), { drawTypes: [...randomApp.drawTypes, { drawType, drawAmount }], dateSelected: now });
                    randomApp.dateSelected = now;
                }
                setSelectedApp(randomApp || null);
                if (!randomApp) {

                    setError('No Application meets the criteria')
                } else {
                    setError(null)
                }
                setLoading(false);
            } catch (e) {
                setSelectedApp(null);
                setError('No Application meets the criteria')
            }

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
            setFilteredApps(applications.filter((app) => app.drawTypes.length > 0))


        } else if (tab === 'funded') {
            setFilteredApps(fundedApps);
        } else {
            setFilteredApps(applications);
        }
    };

    const handleFundApplication = (app) => {

        console.log({addingToFunded: app})
        setSelectedApp(app);
        setShowFundModal(true);
    };




    const handleFundModalSubmit = async (selectedFields, transactionId) => {
        const now = new Date().toISOString();
        const fundedApp = { ...selectedApp, funded: true, transactionId, dateFunded: now };

        // Update Firestore
        await updateDoc(doc(db, "applications", selectedApp.id), { funded: true, transactionId, dateFunded: now });

        console.log({fundedApp})

        // --- Improved PDF Generation ---
        const docum = new jsPDF();
        const pageWidth = docum.internal.pageSize.getWidth();
        const pageHeight = docum.internal.pageSize.getHeight();
        const margin = 20; // Page margin

        // 1. Add Background Image (Optional, keep if desired)
        docum.addImage(bg, "PNG", 0, 0, pageWidth, pageHeight);

        // 2. Add Logo (Centered)
        const logoWidth = 50; // Adjust as needed
        const logoHeight = 50; // Adjust as needed
        const logoX = (pageWidth - logoWidth) / 2;
        const logoY = margin; // Place logo at the top margin
        if (logo) {
            docum.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
        }

        // 3. Title (Centered below logo)
        const titleY = logoY + logoHeight + 15; // Space below logo
        docum.setFont("helvetica", "bold");
        docum.setFontSize(22); // Slightly smaller title
        docum.setTextColor(0, 0, 0);
        docum.text("Funding Receipt", pageWidth / 2, titleY, { align: "center" });

        // 4. Draw Separator Line (Adjusted position)
        const lineY = titleY + 8; // Position relative to title
        docum.setDrawColor(200, 200, 200); // Light gray line
        docum.line(margin, lineY, pageWidth - margin, lineY);

        // 5. Dynamic Fields (Table-like structure) - Renumbered
        let currentY = lineY + 15; // Start position for fields
        const labelX = margin;
        const valueX = margin + 50; // Indent value slightly

        docum.setFontSize(11);

        Object.keys(receiptFieldsMap).forEach((field) => {
            if (selectedFields.includes(field)) {
                const label = receiptFieldsMap[field] || field;
                let value = selectedApp[field];

                if (Array.isArray(value)) {
                    value = value.join(', '); // Join array values
                } else if (value instanceof Date) {
                    value = value.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); // Format dates nicely
                } else if (typeof value === 'boolean') {
                    value = value ? 'Yes' : 'No'; // Display booleans nicely
                }
                
                value = String(value || 'N/A'); // Ensure value is a string

                // Set label style
                docum.setFont("helvetica", "bold");
                docum.setTextColor(30, 30, 30);
                docum.text(`${label}:`, labelX, currentY);

                // Set value style
                docum.setFont("helvetica", "normal");
                docum.setTextColor(50, 50, 50);

                // Handle potential multi-line values
                const splitValue = docum.splitTextToSize(value, pageWidth - valueX - margin);
                docum.text(splitValue, valueX, currentY);

                // Increment Y position, considering multi-line values
                currentY += (splitValue.length * 7) + 3; // Adjust line height (7) and spacing (3)

                // ADDED: Insert Transaction ID after Application Serial # ('srNo')
                if (field === 'srNo') {
                    const txIdLabel = "Funding Transaction ID:";
                    const txIdValue = transactionId; // From function scope

                    // Set label style
                    docum.setFont("helvetica", "bold");
                    docum.setTextColor(30, 30, 30);
                    docum.text(txIdLabel, labelX, currentY);

                    // Set value style
                    docum.setFont("helvetica", "normal");
                    docum.setTextColor(50, 50, 50);

                    const splitTxIdValue = docum.splitTextToSize(String(txIdValue || 'N/A'), pageWidth - valueX - margin);
                    docum.text(splitTxIdValue, valueX, currentY);

                    // Increment Y position for Transaction ID line
                    currentY += (splitTxIdValue.length * 7) + 3;
                }

                // Add page break if content overflows
                if (currentY > pageHeight - margin - 20) { // Check against bottom margin + footer space
                    docum.addPage();
                    currentY = margin; // Reset Y to top margin on new page
                    // Optionally re-add header/logo on new pages if needed
                     if (logo) { // Re-add logo on new page
                        docum.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
                     }
                }
            }
        });


        // 6. Footer (Centered at the bottom) - Renumbered
        const footerY = pageHeight - margin;
        docum.setFontSize(10);
        docum.setTextColor(100, 100, 100);
        docum.text("Thank you for your support!", pageWidth / 2, footerY, { align: "center" });

        // Save PDF
        docum.save(`receipt_${transactionId}.pdf`);

        // --- End of Improved PDF Generation ---


        // Move application to funded
        setFundedApps([...fundedApps, fundedApp]);
        // Update filteredApps based on the active tab state to avoid removing from 'selected' list incorrectly
        if (activeTab === 'selected') {
            // If viewing selected, remove it from the current view
            setFilteredApps(filteredApps.filter((app) => app.id !== selectedApp.id));
        } else {
            // If viewing 'all' or 'funded', just update the state without modifying filteredApps directly here
            // The state updates will trigger re-filtering if necessary elsewhere
        }

        // Update the main applications list as well (important for consistency)
        setApplications(prevApps => prevApps.map(app => app.id === selectedApp.id ? fundedApp : app));


        setShowFundModal(false);
    };




    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    return (
        <>
            <Navigation data={landingPageData.App} />
            <div className={styles.container} style={{ marginTop: "4.5vh" }}>
                <h1 className={styles.title}>Applications List</h1>

                {/* Aligned Count Boxes and Tabs */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    {/* Count Boxes Row */}
                    <div style={{ display: 'flex', width: '540px', gap: '24px', justifyContent: 'center', marginBottom: '20px' }}>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '6px 0',
                            borderRadius: '5px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            textAlign: 'center',
                            width: '180px',
                            border: '1px solid #007bff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff', lineHeight: 1 }}>{applications.length}</div>
                            <div style={{ color: '#6c757d', fontSize: '13px' }}>Total Applications</div>
                        </div>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '6px 0',
                            borderRadius: '5px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            textAlign: 'center',
                            width: '180px',
                            border: '1px solid #007bff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745', lineHeight: 1 }}>{filteredApps.flatMap(app =>
                                app.drawTypes.map(type => ({
                                    ...app,
                                    drawTypes: [type], // Flatten `drawTypes` for each entry,
                                    drawAmount: type.drawType,
                                    drawType: type.drawType
                                }))
                            ).length}</div>
                            <div style={{ color: '#6c757d', fontSize: '13px' }}>Selected Applications</div>
                        </div>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '6px 0',
                            borderRadius: '5px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            textAlign: 'center',
                            width: '180px',
                            border: '1px solid #007bff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545', lineHeight: 1 }}>{applications.filter(app => app.funded).length}</div>
                            <div style={{ color: '#6c757d', fontSize: '13px' }}>Funded Applications</div>
                        </div>
                    </div>
                    {/* Tab Buttons Row */}
                    <div style={{ display: 'flex', width: '540px', gap: '24px', justifyContent: 'center' }}>
                        {['all', 'selected', 'funded'].map((tab) => (
                            <button
                                key={tab}
                                style={{
                                    width: '180px',
                                    padding: '6px 0',
                                    backgroundColor: activeTab === tab ? '#007bff' : '#f8f9fa',
                                    color: activeTab === tab ? '#fff' : '#000',
                                    border: '1px solid #007bff',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    transition: 'background 0.2s, color 0.2s',
                                }}
                                onClick={() => handleTabChange(tab)}
                            >
                                {tab === 'all' && 'All Applications'}
                                {tab === 'selected' && 'Selected Applications'}
                                {tab === 'funded' && 'Funded Applications'}
                            </button>
                        ))}
                    </div>
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
                            <th>Application ID</th>
                            <th>
                                {
                                    activeTab === "all" ? "Expiry Date" : activeTab === "selected" ? "Date Selected" : "Funded Date"
                                }

                            </th>
                            <th>Legal Name</th>
                            <th>Country of Residency</th>
                            <th>State of Residency</th>
                            <th>Rumble Username</th>
                            <th>Youtube<br />Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Issues</th>
                            <th>Selected</th>
                            {activeTab === 'selected' && (
                                <th>
                                    Amount
                                </th>
                            )}

                            {activeTab === 'selected' && (
                                <th>
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.length > 0 ? (
                            (activeTab === 'selected'
                                ? filteredApps.flatMap(app =>
                                    app.drawTypes.map(type => ({
                                        ...app,
                                        drawTypes: [type], // Flatten `drawTypes` for each entry,
                                        drawAmount: type.drawAmount,
                                        drawType: type.drawType
                                    }))
                                )
                                : filteredApps
                            ).map((app) => (
                                <tr key={`${app.id}-${app.drawTypes[0]?.drawType || 'no-draw'}`}>
                                    <td>{app.applicationId || 'N/A'}</td>
                                    <td>
                                        {
                                            activeTab === "all" ? app.applicationExpiry : activeTab === "selected" ? (app.dateSelected) : (app.dateFunded)
                                        }
                                    </td>
                                    <td>{app.legalName}</td>
                                    <td>{app.selectedCountry || 'N/A'}</td>
                                    <td>{app.selectedState || 'N/A'}</td>
                                    <td>{app.rumbleUserName || 'N/A'}</td>
                                    <td>{app.youtubeUserName || 'N/A'}</td>
                                    <td>{app.gmail || 'N/A'}</td>
                                    <td>{app.phone || 'N/A'}</td>
                                    <td>
                                        {app?.issues?.map((issue, idx) => (
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
                                                {activeTab === 'selected' ? type.drawType : `${String(type.drawType)} (${type.drawAmount})`}
                                            </span>
                                        ))}
                                    </td>

                                    {activeTab === 'selected' &&
                                        <td>
                                            {app?.drawTypes?.map((type, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '4px 9px',
                                                        borderRadius: '15px',
                                                        backgroundColor: 'blue',
                                                        color: '#fff',
                                                        fontWeight: 'bold',
                                                        marginRight: '4px',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    {type.drawAmount}
                                                </span>
                                            ))}
                                        </td>}

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
                {activeTab === "all" && <button
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
                        errorMessage={error}
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
