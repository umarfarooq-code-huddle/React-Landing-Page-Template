import React, { useState } from 'react';
import styles from './ApplicationForm.module.css';
import globalStyles from '../global.module.css';
import logo from "../assets/landingAssets/image.png";

function FundApplicationModal({ onClose, onSubmit, application }) {
    const [selectedFields, setSelectedFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [transactionId, setTransactionId] = useState(''); // New state for transaction ID

    const handleFieldChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedFields([...selectedFields, value]);
        } else {
            setSelectedFields(selectedFields.filter((field) => field !== value));
        }
    };

    const handleSubmit = (event) => {
        setIsLoading(true);
        event.preventDefault();
        onSubmit(selectedFields, transactionId); // Pass transaction ID to onSubmit
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
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
                        placeholder="Enter Transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={globalStyles.submitButton} disabled={selectedFields.length === 0 || isLoading}>
                        {isLoading ? 'Loading...' : 'Proceed'}
                    </button>
                    <button type="button" className={globalStyles.rejectButton} onClick={onClose}>
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FundApplicationModal;
