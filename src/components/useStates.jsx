import { useState, useEffect } from 'react';
import { Country, State } from 'country-state-city';

export function useStates(selectedCountry) {
  const [states, setStates] = useState([]);

  useEffect(() => {
    if (selectedCountry) {
      const countryCode = Country.getAllCountries().find(
        (country) => country.name === selectedCountry
      )?.isoCode;

      if (countryCode) {
        const statesList = State.getStatesOfCountry(countryCode);
        setStates(statesList.map((state) => state.name));
      }
    }
  }, [selectedCountry]);

  return states;
}
