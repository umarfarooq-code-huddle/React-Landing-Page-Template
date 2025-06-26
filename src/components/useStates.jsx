import { useState, useEffect } from 'react';
import { states } from '../data/states';

export function useStates(selectedCountry) {
  const [statesList, setStatesList] = useState([]);

  useEffect(() => {
    if (selectedCountry && selectedCountry !== 'Select All') {
      const countryStates = states[selectedCountry] || [];
      setStatesList(countryStates);
    } else {
      setStatesList([]);
    }
  }, [selectedCountry]);

  return statesList;
}
