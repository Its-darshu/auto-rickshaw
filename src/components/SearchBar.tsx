import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="figma-search-wrapper">
      <div className="figma-search-box">
        <div className="figma-search-icon">
          <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.375 23.375L29.5625 29.5625M14.4375 26.125C7.70638 26.125 2.25 20.6686 2.25 13.9375C2.25 7.20638 7.70638 1.75 14.4375 1.75C21.1686 1.75 26.625 7.20638 26.625 13.9375C26.625 20.6686 21.1686 26.125 14.4375 26.125Z" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <input
          type="text"
          className="figma-search-input"
          placeholder={placeholder || t('searchDrivers')}
          value={query}
          onChange={handleInputChange}
        />
        {query && (
          <button 
            className="figma-clear-btn"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;