import { useMemo } from 'react';
import Fuse from 'fuse.js';

export interface UseFuseSearchOptions<T> {
  data: T[];
  keys: string[];
  threshold?: number;
  ignoreLocation?: boolean;
  minMatchCharLength?: number;
  includeScore?: boolean;
}

export function useFuseSearch<T>({
  data,
  keys,
  threshold = 0.3,
  ignoreLocation = true,
  minMatchCharLength = 2,
  includeScore = true,
}: UseFuseSearchOptions<T>) {
  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys,
      threshold,
      ignoreLocation,
      includeScore,
      minMatchCharLength,
    });
  }, [data, keys, threshold, ignoreLocation, minMatchCharLength, includeScore]);

  const search = useMemo(() => {
    return (query: string): T[] => {
      if (!query || query.trim() === '') {
        return data;
      }
      
      const searchResults = fuse.search(query);
      return searchResults.map(result => result.item);
    };
  }, [fuse, data]);

  return search;
}