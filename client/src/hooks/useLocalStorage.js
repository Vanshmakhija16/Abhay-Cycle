import { useState, useEffect } from 'react';

/**
 * useLocalStorage — persist state in localStorage with JSON serialisation
 * @param {string} key   - localStorage key
 * @param {*}      init  - initial / fallback value
 */
const useLocalStorage = (key, init) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // quota exceeded or private mode — silently ignore
    }
  }, [key, value]);

  const remove = () => {
    localStorage.removeItem(key);
    setValue(init);
  };

  return [value, setValue, remove];
};

export default useLocalStorage;
