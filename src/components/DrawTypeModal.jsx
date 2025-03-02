import React, { useState } from 'react';
import styles from './ApplicationForm.module.css';
import globalStyles from '../global.module.css';


function DrawTypeModal({ onClose, onSelect }) {
    const [selectedType, setSelectedType] = useState('');
    const [drawAmount, setDrawAmount] = useState('');

    const handleSelect = () => {
        onSelect({drawType : selectedType, drawAmount : drawAmount});
    };

    const options = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Special",
    ]



    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>


                <form >
                    <h1 className={styles.title}>Select Draw Type</h1>

                    <div className={styles.formGroup}>
                        <label htmlFor="countrySelect">Draw Type</label>
                        <select
                            id="countrySelect"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            required
                        >
                            <option value="">-- Select Type --</option>
                            {options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="countrySelect">Draw Type</label>
                        <input
                            type="number"
                            id="countrySelect"
                            value={drawAmount}
                            onChange={(e) => setDrawAmount(e.target.value)}
                            required
                        >
                            
                        </input>
                    </div>

                    <button type="submit" className={globalStyles.submitButton} onClick={handleSelect}>
                        Draw
                    </button>

                    <button type="button" className={globalStyles.rejectButton} onClick={onClose}>
                        Close
                    </button>
                </form>



            </div>
        </div>
    );
}

export default DrawTypeModal;
