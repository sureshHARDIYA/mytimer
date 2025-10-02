import Fuse from "fuse.js";
import { ITimeTrack } from "@/models/time-track";

export interface SearchFilters {
  searchByName: string;
  searchByNotes: string;
  selectedTag: string;
  startDate?: string;
  endDate?: string;
}

export const createFuzzySearch = (timeTracks: ITimeTrack[]) => {
  const fuse = new Fuse(timeTracks, {
    keys: [
      { name: "title", weight: 0.7 },
      { name: "notes", weight: 0.3 },
    ],
    threshold: 0.3, // Lower threshold means more strict matching
    includeScore: true,
    includeMatches: true,
  });

  return fuse;
};

export const filterTimeTracks = (
  timeTracks: ITimeTrack[],
  filters: SearchFilters
): ITimeTrack[] => {
  let filteredTracks = [...timeTracks];

  // Apply date range filter first
  if (filters.startDate || filters.endDate) {
    filteredTracks = filteredTracks.filter((track) => {
      const trackStartDate = new Date(track.start);
      const trackEndDate = new Date(track.end);

      if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        // Check if track overlaps with the date range
        return trackStartDate <= endDate && trackEndDate >= startDate;
      } else if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        return trackEndDate >= startDate;
      } else if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        return trackStartDate <= endDate;
      }
      return true;
    });
  }

  // Apply tag filter
  if (filters.selectedTag) {
    filteredTracks = filteredTracks.filter(
      (track) => track.tag === filters.selectedTag
    );
  }

  // Apply name search filter
  if (filters.searchByName.trim()) {
    const fuse = new Fuse(filteredTracks, {
      keys: [{ name: "title", weight: 1.0 }],
      threshold: 0.4,
      includeScore: true,
    });

    const searchResults = fuse.search(filters.searchByName);
    filteredTracks = searchResults.map((result) => result.item);
  }

  // Apply notes search filter
  if (filters.searchByNotes.trim()) {
    const fuse = new Fuse(filteredTracks, {
      keys: [{ name: "notes", weight: 1.0 }],
      threshold: 0.4,
      includeScore: true,
    });

    const searchResults = fuse.search(filters.searchByNotes);
    filteredTracks = searchResults.map((result) => result.item);
  }

  return filteredTracks;
};

export const getAvailableTags = (timeTracks: ITimeTrack[]): string[] => {
  const tagSet = new Set<string>();

  timeTracks.forEach((track) => {
    if (track.tag) {
      tagSet.add(track.tag);
    }
  });

  return Array.from(tagSet).sort();
};
