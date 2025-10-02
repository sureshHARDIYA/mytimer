import Select from "react-select";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Search, X, RotateCcw, Calendar } from "lucide-react";

import styles from "./FilterControls.module.scss";

interface FilterControlsProps {
  onFiltersChange: (filters: {
    searchByName: string;
    searchByNotes: string;
    selectedTag: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  availableTags: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({
  onFiltersChange,
  availableTags,
}) => {
  const [searchByName, setSearchByName] = useState("");
  const [searchByNotes, setSearchByNotes] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    onFiltersChange({
      searchByName,
      searchByNotes,
      selectedTag,
      startDate,
      endDate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchByName, searchByNotes, selectedTag, startDate, endDate]);

  const clearFilters = () => {
    setSearchByName("");
    setSearchByNotes("");
    setSelectedTag("");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters =
    searchByName || searchByNotes || selectedTag || startDate || endDate;

  const tagOptions = [
    { value: "", label: "All Tags" },
    ...availableTags.map((tag) => ({ value: tag, label: tag })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.filterContainer}
    >
      <div className={styles.filterRow}>
        {/* Tag Filter */}
        <div className={styles.filterGroup}>
          <Select
            options={tagOptions}
            value={tagOptions.find((option) => option.value === selectedTag)}
            onChange={(option) => setSelectedTag(option?.value || "")}
            className={styles.reactSelect}
            classNamePrefix="react-select"
            placeholder="Select tag..."
            isClearable
            isSearchable
          />
        </div>

        {/* Search by Name */}
        <div className={styles.filterGroup}>
          <div className={styles.searchContainer}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search title"
              value={searchByName}
              onChange={(e) => setSearchByName(e.target.value)}
              className={styles.searchInput}
            />
            {searchByName && (
              <button
                onClick={() => setSearchByName("")}
                className={styles.clearButton}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Search by Notes */}
        <div className={styles.filterGroup}>
          <div className={styles.searchContainer}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Notes..."
              value={searchByNotes}
              onChange={(e) => setSearchByNotes(e.target.value)}
              className={styles.searchInput}
            />
            {searchByNotes && (
              <button
                onClick={() => setSearchByNotes("")}
                className={styles.clearButton}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.dateContainer}>
            <Calendar size={16} className={styles.dateIcon} />
            <input
              type="date"
              placeholder="Start date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
            <span className={styles.dateSeparator}>to</span>
            <input
              type="date"
              placeholder="End date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className={styles.filterGroup}>
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={styles.resetButton}
          >
            <RotateCcw size={16} />
            Reset Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterControls;
