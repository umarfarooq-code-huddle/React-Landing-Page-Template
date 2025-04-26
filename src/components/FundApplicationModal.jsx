import React, { useState } from 'react';
import styles from './ApplicationForm.module.css';
import globalStyles from '../global.module.css';
import logo from "../assets/landingAssets/image.png";

function FundApplicationModal({ onClose, onSubmit, application }) {
    const [selectedFields, setSelectedFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [checklist, setChecklist] = useState({
        proofOfIdentification: false,
        proofOfFinancialNeed: false,
        proofOfUpholdAccount: false,
        testimonialVideo: false,
        subscribedToChannels: false,
        digitalWalletAddress: false,
        zoomVerification: false,
        senderWalletAddress: false,
        recipientWalletAddress: false,
    });
    const [step, setStep] = useState(1); // Step state to manage the flow

    const handleFieldChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedFields([...selectedFields, value]);
        } else {
            setSelectedFields(selectedFields.filter((field) => field !== value));
        }
    };

    const handleChecklistChange = (event) => {
        const { name, checked } = event.target;
        setChecklist({ ...checklist, [name]: checked });
    };

    const isChecklistComplete = Object.values(checklist).every((item) => item);

    const handleNextStep = (event) => {
        event.preventDefault();
        if (isChecklistComplete) {
            setStep(2); // Proceed to the fields selection step
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedFields.length === 0 || !transactionId) return;
        setIsLoading(true);
        onSubmit(selectedFields, transactionId);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                {step === 1 && (
                    <form onSubmit={handleNextStep}>
                        <h2 className={styles.title}>Verify Checklist</h2>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="proofOfIdentification"
                                    checked={checklist.proofOfIdentification}
                                    onChange={handleChecklistChange}
                                />
                                Submitted proof of Identification
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="proofOfFinancialNeed"
                                    checked={checklist.proofOfFinancialNeed}
                                    onChange={handleChecklistChange}
                                />
                                Submitted proof of the financial need as stated on the application
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="proofOfUpholdAccount"
                                    checked={checklist.proofOfUpholdAccount}
                                    onChange={handleChecklistChange}
                                />
                                Submitted proof of an Uphold Brokerage account in their name
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="testimonialVideo"
                                    checked={checklist.testimonialVideo}
                                    onChange={handleChecklistChange}
                                />
                                Submitted a testimonial video
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="subscribedToChannels"
                                    checked={checklist.subscribedToChannels}
                                    onChange={handleChecklistChange}
                                />
                                Submitted proof they are subscribed to YouTube & Rumble channels
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="digitalWalletAddress"
                                    checked={checklist.digitalWalletAddress}
                                    onChange={handleChecklistChange}
                                />
                                Submitted Digital wallet address on Uphold for RLUSD stablecoin
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="zoomVerification"
                                    checked={checklist.zoomVerification}
                                    onChange={handleChecklistChange}
                                />
                                Completed the required Zoom Video Call verification meeting
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="senderWalletAddress"
                                    checked={checklist.senderWalletAddress}
                                    onChange={handleChecklistChange}
                                />
                                Sender's digital wallet address to submit funds to applicant
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="recipientWalletAddress"
                                    checked={checklist.recipientWalletAddress}
                                    onChange={handleChecklistChange}
                                />
                                Recipient's digital wallet address to receive grant funds
                            </label>
                        </div>
                        <button
                            type="submit"
                            className={`${globalStyles.submitButton} ${!isChecklistComplete ? styles.disabledButton : ''}`}
                            disabled={!isChecklistComplete}
                            title={!isChecklistComplete ? 'Complete the checklist to proceed' : ''}
                        >
                            Proceed
                        </button>
                        <button type="button" className={globalStyles.rejectButton} onClick={onClose}>
                            Close
                        </button>
                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleSubmit}>
                        <h1 className={styles.title}>Select Fields for Receipt</h1>
                        <div className={styles.checkboxGroup}>
                            {Object.keys(application).map((field) => (
                                <label key={field} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        value={field}
                                        checked={selectedFields.includes(field)}
                                        onChange={handleFieldChange}
                                    />
                                    {field}
                                </label>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Enter Funding Transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <button
                            type="submit"
                            className={`${globalStyles.submitButton} ${selectedFields.length === 0 || !transactionId || isLoading ? styles.disabledButton : ''}`}
                            disabled={selectedFields.length === 0 || !transactionId || isLoading}
                            title={selectedFields.length === 0 || !transactionId ? 'Complete all fields to submit' : ''}
                        >
                            {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                        <button type="button" className={globalStyles.rejectButton} onClick={onClose}>
                            Close
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default FundApplicationModal;
