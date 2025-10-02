import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  filterTimeTracks,
  getAvailableTags,
  SearchFilters,
} from "@/lib/utils/fuzzySearch";
import Pagination from "./Pagination";
import styles from "../Project.module.scss";
import FilterControls from "../FilterControls";
import { ITimeTrack } from "@/models/time-track";
import ProjectTrackOperations from "../ProjectTrackOperations";
import { calculateTotalDuration, getTrackDuration } from "@/lib/utils/date";

interface DetailedViewProps {
  project: any;
  mutateProject: () => void;
}

const DetailedView = ({ project, mutateProject }: DetailedViewProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchByName: "",
    searchByNotes: "",
    selectedTag: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // Configurable number of records per page

  const availableTags = useMemo(() => {
    return getAvailableTags(project.timeTracks || []);
  }, [project.timeTracks]);

  const filteredTracks = useMemo(() => {
    const filtered = filterTimeTracks(project.timeTracks || [], filters);
    // Sort by start date descending (latest first)
    return filtered.sort((a, b) => {
      return new Date(b.start).getTime() - new Date(a.start).getTime();
    });
  }, [project.timeTracks, filters]);

  const totalDuration = useMemo(() => {
    return calculateTotalDuration(filteredTracks);
  }, [filteredTracks]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTracks.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedTracks = filteredTracks.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = React.useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className={styles.detailed}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.resultsHeader}
      >
        <p className={styles.total}>
          {filters.searchByName ||
          filters.searchByNotes ||
          filters.selectedTag ? (
            <>
              <span className={styles.filteredTotal}>
                Filtered time: <span>{totalDuration}</span>
              </span>
            </>
          ) : (
            <>
              <span className={styles.filteredTotal}>
                Total time: <span>{totalDuration}</span>
              </span>
            </>
          )}
        </p>
      </motion.div>
      <FilterControls
        onFiltersChange={handleFiltersChange}
        availableTags={availableTags}
      />

      <ul className={styles.list}>
        {paginatedTracks.map((track: ITimeTrack, index: number) => (
          <li key={track._id.toString()}>
            <div className={styles.trackContent}>
              <div className={styles.trackInfo}>
                <div className={styles.trackHeader}>
                  <div className={styles.titleWithTag}>
                    <p className={styles.description}>{track.title}</p>
                    <div className={styles.tagsContainer}>
                      {track.tag && (
                        <span className={styles.tag}>{track.tag}</span>
                      )}
                      {track.trackingType === "manual" && (
                        <span className={styles.manualTag}>M</span>
                      )}
                    </div>
                  </div>
                </div>
                {track.notes && <p className={styles.notes}>{track.notes}</p>}
                <div className={styles.dateInfo}>
                  <span className={styles.dateItem}>
                    {new Date(track.start).toLocaleDateString()}{" "}
                    {new Date(track.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    - {new Date(track.end).toLocaleDateString()}{" "}
                    {new Date(track.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className={styles.trackDuration}>
                <span>
                  Duration:
                  <span className={styles.duration}>
                    {getTrackDuration(
                      new Date(track.start),
                      new Date(track.end)
                    )}
                  </span>
                </span>
                <ProjectTrackOperations
                  timeTrack={track}
                  mutateProject={mutateProject}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {filteredTracks.length > recordsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {filteredTracks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.noResults}
        >
          <p>No time tracks found matching your filters.</p>
          <p className={styles.noResultsHint}>
            Try adjusting your search terms or clearing the filters.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DetailedView;
