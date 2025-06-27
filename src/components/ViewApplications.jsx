import { doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect, useCallback } from 'react';
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
// import { jsPDF } from 'jspdf'; // Import jsPDF for generating PDF

import { Navigation } from './navigation';
import { issuesList } from './Application'; // Import the issuesList

// Map of display names to application keys for the receipt
const receiptFieldsMap = {
    srNo: 'Application Number',
    applicationId: 'Transaction ID',
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
    const [selectedIssueFilter, setSelectedIssueFilter] = useState(''); // New state for issue filter
    const [legalNameFilter, setLegalNameFilter] = useState(''); // New state for legal name filter

    const [drawAmount, setDrawAmount] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // New state for active tab
    const [showFundModal, setShowFundModal] = useState(false); // New state for fund modal
    const [fundedApps, setFundedApps] = useState([]); // New state for funded applications
    const [selectedApplications, setSelectedApplications] = useState([]); // New state for funded applications

    // Get all countries and states using hooks
    const countries = useCountries();
    const states = useStates(selectedCountryFilter); // States will depend on selected country

    // Fetch applications from Firestore
    const fetchApplications = useCallback(async () => {
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
                    _originalDrawTypes: data.drawTypes || [], // Store original for 'all' tab
                    ...data,
                };
            }).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)); // Sort in descending order


            setApplications(applicationsData);

            const mySelecteedApplications = applicationsData.filter((app) => app.drawTypes.length > 0).flatMap(app =>
                app.drawTypes.map(draw => ({
                    ...app,  // Keep all fields
                    drawTypes: [draw]  // Wrap the single drawType object in an array
                }))
            );

            setSelectedApplications(mySelecteedApplications)



            // Create flattened funded applications
            const flatFundedApps = applicationsData
                .filter(app => app.drawTypes && app.drawTypes.length > 0)
                .flatMap(app =>
                    app.drawTypes
                        .filter(draw => draw.funded) // Only include draw types that are funded
                        .map(draw => ({
                            ...app,
                            drawTypes: [draw], // This application instance for the row is about this single draw
                            currentSingleDraw: draw,
                        }))
                )
                .sort((a, b) => new Date(b.currentSingleDraw.dateFunded) - new Date(a.currentSingleDraw.dateFunded)); // Sort by dateFunded descending
            setFundedApps(flatFundedApps);

        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    }, []);


    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // useEffect to filter applications when filters change
    useEffect(() => {
        let sourceData;
        if (activeTab === 'all') {
            sourceData = applications;
        } else if (activeTab === 'selected') {
            sourceData = selectedApplications;
        } else if (activeTab === 'funded') {
            sourceData = fundedApps;
        } else {
            sourceData = applications; // Default fallback
        }

        let tempFilteredApps = sourceData;

        // Filter by Legal Name
        if (legalNameFilter) {
            tempFilteredApps = tempFilteredApps.filter((app) =>
                app.legalName?.toLowerCase().includes(legalNameFilter.toLowerCase())
            );
        }

        // Filter by Country
        if (selectedCountryFilter) {
            tempFilteredApps = tempFilteredApps.filter(
                (app) => app.selectedCountry === selectedCountryFilter
            );
        }

        // Filter by State
        if (selectedStateFilter) {
            tempFilteredApps = tempFilteredApps.filter(
                (app) => app.selectedState === selectedStateFilter
            );
        }

        // Filter by Issue
        if (selectedIssueFilter) {
            if (selectedIssueFilter === 'Other') {
                tempFilteredApps = tempFilteredApps.filter((app) =>
                    app.issues.some(issue => !issuesList.includes(issue))
                );
            } else {
                tempFilteredApps = tempFilteredApps.filter((app) =>
                    app.issues.includes(selectedIssueFilter)
                );
            }
        }

        if(activeTab === 'all'){
            tempFilteredApps = tempFilteredApps.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        }
        else if(activeTab === 'selected'){
            console.log({tempFilteredApps})
            tempFilteredApps = tempFilteredApps.sort((a, b) => b.drawTypes[0].timesSelected - a.drawTypes[0].timesSelected)
            console.log("Here", tempFilteredApps)
        }
        else if(activeTab === 'funded'){
            tempFilteredApps = tempFilteredApps.sort((a, b) => new Date(b.currentSingleDraw.dateFunded) - new Date(a.currentSingleDraw.dateFunded))
        }

        setFilteredApps(tempFilteredApps);
    }, [applications, selectedApplications, fundedApps, activeTab, legalNameFilter, selectedCountryFilter, selectedStateFilter, selectedIssueFilter]); // Dependencies

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        if (name === 'legalName') {
            setLegalNameFilter(value);
        } else if (name === 'selectedCountry') {
            setSelectedCountryFilter(value);
            setSelectedStateFilter(''); // Reset state filter when country changes
        } else if (name === 'selectedState') {
            setSelectedStateFilter(value);
        } else if (name === 'selectedIssue') {
            setSelectedIssueFilter(value);
        }
        // The filtering logic is now handled by the useEffect hook
    };

    const handleRandomSelect = async (eligibilityFilters) => {
        setLoading(true);
        setSelectedApp(null);

        setTimeout(async () => {
            try {
                let eligibleApps = applications;

                // Only filter by states if states are selected and not "Select All"
                if (eligibilityFilters.selectedStates?.length > 0 && 
                    !(eligibilityFilters.selectedStates.length === 1 && 
                      eligibilityFilters.selectedStates[0].value === 'Select All')) {
                    eligibleApps = eligibleApps.filter((app) =>
                        eligibilityFilters.selectedStates.some((state) => 
                            app.selectedState?.toLowerCase().includes(state.value.toLowerCase())
                        )
                    );
                }

                // Only filter by countries if countries are selected and not "Select All"  
                if (eligibilityFilters.selectedCountries?.length > 0 &&
                    !(eligibilityFilters.selectedCountries.length === 1 && 
                      eligibilityFilters.selectedCountries[0].value === 'Select All')) {
                    eligibleApps = eligibleApps.filter((app) =>
                        eligibilityFilters.selectedCountries.some((country) =>
                            app.selectedCountry?.toLowerCase().includes(country.value.toLowerCase())
                        )
                    );
                }

                // Only filter by issues if issues are selected
                if (eligibilityFilters.issues?.length > 0) {
                    eligibleApps = eligibleApps.filter((app) =>
                        app.issues.some((issue) => eligibilityFilters.issues.includes(issue))
                    );
                }

                // Filter out applications already selected for the current draw type
                eligibleApps = eligibleApps.filter((app) => 
                    !app.drawTypes.find((dType) => dType.drawType === drawType)
                );

                const randomApp = eligibleApps[Math.floor(Math.random() * eligibleApps.length)];
                
                if (randomApp) {
                    const now = new Date().toISOString();
                    await updateDoc(doc(db, 'applications', randomApp.id), {
                        drawTypes: [...randomApp.drawTypes, { drawType, drawAmount, timesSelected: new Date().getTime()}],
                        dateSelected: now,

                    });
                    randomApp.dateSelected = now;
                    fetchApplications();
                    setSelectedApp(randomApp);
                    setError(null);
                } else {
                    setSelectedApp(null);
                    setError('No Application meets the criteria');
                }
                
                setLoading(false);
            } catch (e) {
                setSelectedApp(null);
                setError('No Application meets the criteria');
                setLoading(false);
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
        // No need to call setFilteredApps here, the useEffect will handle it
    };

    const handleFundApplication = (app) => {

        setSelectedApp(app);
        setShowFundModal(true);
    };




    const handleFundModalSubmit = async (selectedFields, transactionId) => {
        const now = new Date().toISOString();
        
        // Find the original application from the applications array
        const originalApp = applications.find(app => app.id === selectedApp.id);
        if (!originalApp) {
            console.error('Original application not found');
            return;
        }
        
        // Find the specific drawType that is being funded (from the selected tab view)
        const drawTypeToFund = selectedApp.drawTypes[0]; // For selected tab, we have single drawType
        
        // Find and update the specific drawType in the original application's drawTypes array
        const updatedDrawTypes = originalApp.drawTypes.map(dt => 
            dt.drawType === drawTypeToFund.drawType && 
            dt.drawAmount === drawTypeToFund.drawAmount && 
            dt.timesSelected === drawTypeToFund.timesSelected
                ? { ...dt, funded: true, transactionId, dateFunded: now }
                : dt
        );
        
        // Update Firestore - update the specific drawType entry instead of setting funded at application level
        await updateDoc(doc(db, "applications", selectedApp.id), { 
            drawTypes: updatedDrawTypes 
        });

        fetchApplications(); // Refetch applications

        // Create funded app object for local state update (for the funded tab)
        const fundedApp = { 
            ...originalApp, 
            drawTypes: updatedDrawTypes,
            currentSingleDraw: { ...drawTypeToFund, funded: true, transactionId, dateFunded: now }
        };

        // --- Improved PDF Generation ---
        const { jsPDF } = await import('jspdf'); // Dynamically import jspdf
        const docum = new jsPDF();
        const pageWidth = docum.internal.pageSize.getWidth();
        const pageHeight = docum.internal.pageSize.getHeight();
        const margin = 5; // Page margin

        // 1. Add Background Image (Optional, keep if desired)
        docum.addImage(bg, "PNG", 0, 0, pageWidth, pageHeight);

        // 2. Add Logo (Centered)
        const logoWidth = 80; // Adjust as needed
        const logoHeight = 80; // Adjust as needed
        const logoX = (pageWidth - logoWidth) / 2;
        const logoY = margin; // Place logo at the top margin
        if (logo) {
            docum.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
        }

        // 3. Title (Centered below logo)
        const titleY = logoY + logoHeight + 10; // Space below logo
        docum.setFont("helvetica", "bold");
        docum.setFontSize(20); // Slightly smaller title
        docum.setTextColor(0, 0, 0);
        docum.text("Funding Receipt", pageWidth / 2, titleY, { align: "center" });

        docum.setFontSize(12);
        // docum.setFont("helvetica", "bold");
        // docum.setTextColor(30, 30, 30);
        // docum.text(`Transaction ID:`, margin, titleY + 15);

        // // Set value style
        // docum.setFont("helvetica", "normal");
        // docum.setTextColor(50, 50, 50);

        const valueX = margin + 50; // Indent value slightly

        // // Handle potential multi-line values
        // const splitValue = docum.splitTextToSize(selectedApp.id, pageWidth - valueX - margin);
        // docum.text(splitValue, valueX, titleY + 15);


        // // 4. Draw Separator Line (Adjusted position)
        const lineY = titleY + 15; // Position relative to title
        docum.setDrawColor(200, 200, 200); // Light gray line
        docum.line(margin, lineY, pageWidth - margin, lineY);

        // 5. Dynamic Fields (Table-like structure) - Renumbered
        let currentY = lineY + 10; // Start position for fields
        const labelX = margin;

        docum.setFontSize(11);

        console.log({fields : selectedFields})

        if(!selectedFields.includes('srNo')){

            if(selectedFields.includes('transactionId')){

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


        


        }
        
        Object.keys(receiptFieldsMap).forEach((field) => {
            if (selectedFields.includes(field)) {
                const label = receiptFieldsMap[field] || field;
                let value = selectedApp[field];
                if(field === 'drawType'){
                    value = drawTypeToFund.drawType;
                }
                else if(field === 'drawAmount'){
                    value = drawTypeToFund.drawAmount;
                }

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


                    const txIdRealLable = "Application Serial #:";
                    const txIdRealValue = selectedApp.id; // From function scope

                    // Set label style
                    docum.setFont("helvetica", "bold");
                    docum.setTextColor(30, 30, 30);
                    docum.text(txIdRealLable, labelX, currentY);

                    // Set value style
                    docum.setFont("helvetica", "normal");
                    docum.setTextColor(50, 50, 50);

                    const splitTxIdValue2 = docum.splitTextToSize(String(txIdRealValue || 'N/A'), pageWidth - valueX - margin);
                    docum.text(splitTxIdValue2, valueX, currentY);

                    // Increment Y position for Transaction ID line
                    currentY += (splitTxIdValue2.length * 7) + 3;
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


        // Update the main applications list with the updated drawTypes
        setApplications(prevApps => prevApps.map(app => 
            app.id === selectedApp.id 
                ? { ...app, drawTypes: updatedDrawTypes }
                : app
        ));

        // Add to funded apps list
        setFundedApps(prevFundedApps => [...prevFundedApps, fundedApp]);

        // Update filteredApps based on the active tab state
        if (activeTab === 'selected') {
            // If viewing selected, remove the funded draw type from the current view
            setFilteredApps(filteredApps.filter((app) => 
                !(app.id === selectedApp.id && 
                  app.drawTypes[0].drawType === drawTypeToFund.drawType && 
                  app.drawTypes[0].drawAmount === drawTypeToFund.drawAmount && 
                  app.drawTypes[0].timesSelected === drawTypeToFund.timesSelected)
            ));
        }

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
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745', lineHeight: 1 }}>{selectedApplications.length}</div>
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
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545', lineHeight: 1 }}>{fundedApps.length}</div>
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
                        value={legalNameFilter} // Bind value to state
                        onChange={handleFilterChange} // Keep this for name filter
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

                    {/* Issues Filter Dropdown */}
                    <select
                        name="selectedIssue" // Changed name
                        value={selectedIssueFilter}
                        onChange={handleFilterChange}
                        className={styles.filterInput}
                    >
                        <option value="">-- Filter by Issue --</option>
                        {issuesList.map((issue) => (
                            <option key={issue} value={issue}>
                                {issue}
                            </option>
                        ))}
                        <option value="Other">Other (Custom)</option> {/* Add Other option */}
                    </select>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Application ID</th>
                            <th>
                                {
                                    activeTab === "all" ? "Expiry Date" : activeTab === "selected" ? "Date Selected" : "Date Funded"
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

                            {activeTab === 'funded' && (
                                <th>
                                    Transaction ID
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
                            filteredApps.map((app, idx) => (
                                <tr key={app.currentSingleDraw ? `${app.id}-${app.currentSingleDraw.drawType}-${app.currentSingleDraw.drawAmount}-${idx}` : `${app.id}-${idx}`}>
                                    <td>{app.applicationId || 'N/A'}</td>
                                    <td>
                                        {
                                            activeTab === "all" ? app.applicationExpiry :
                                            activeTab === "selected" ? (app.dateSelected ? new Date(app.dateSelected).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A') :
                                            (app.currentSingleDraw?.dateFunded ? new Date(app.currentSingleDraw.dateFunded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A')
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
                                        {app?.issues?.map((issue, issueIdx) => (
                                            <div key={issueIdx}>{issue}</div>
                                        ))}
                                    </td>
                                    <td>
                                        {(activeTab === 'all' ? (app._originalDrawTypes || app.drawTypes) : app.drawTypes)?.map((type, innerIdx) => (
                                            <span
                                                key={innerIdx}
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '4px 9px',
                                                    borderRadius: '15px',
                                                    backgroundColor: type.funded ? '#dc3545' : '#28a745', // Red for funded, green for selected
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    marginRight: '4px',
                                                    marginBottom: '4px'
                                                }}
                                            >
                                                {activeTab === 'selected' ? type.drawType : 
                                                 activeTab === 'funded' ? `${String(type.drawType)}` :
                                                 `${String(type.drawType)} (${type.drawAmount})`}
                                            </span>
                                        ))}
                                    </td>

                                    {activeTab === 'selected' &&
                                        <td>
                                            {/* For selected tab, app.drawTypes is [singleDraw], so app.drawTypes[0] is currentSingleDraw */}
                                            {app.drawTypes[0]?.drawAmount}
                                        </td>}

                                    {activeTab === 'funded' &&
                                        <td>
                                            {/* For funded tab, show transaction ID */}
                                            {app.currentSingleDraw?.transactionId || 'N/A'}
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
                                <td colSpan={activeTab === 'funded' ? "13" : "12"} className={styles.noData}>
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
