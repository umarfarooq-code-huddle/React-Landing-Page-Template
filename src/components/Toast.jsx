import React, { useEffect } from 'react';
import styles from './Toast.module.css';

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.toast} onClick={onClose}>
      {message}
    </div>
  );
}

export default Toast;
