import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCountries() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countryNames = response.data.map((country) => country.name.common);

        setCountries(['Select All',...countryNames.sort()]);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  return countries;
}
