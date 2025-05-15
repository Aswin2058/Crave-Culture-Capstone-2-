import React from 'react';
import './CountryDropdown.css';

const CountryDropdown = ({ country }) => {
  return (
    <div className="dropdown">
      <label>{country}</label>
      <select>
        <option>{country} - Option 1</option>
        <option>{country} - Option 2</option>
      </select>
    </div>
  );
};

export default CountryDropdown;
