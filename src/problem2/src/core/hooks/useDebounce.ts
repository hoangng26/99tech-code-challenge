import { useEffect, useState } from 'react';

function useDebounce<T>(
  value: T,
  delay: number
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storeValue, setStoreValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(storeValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(storeValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [storeValue, delay]);

  return [debouncedValue, setStoreValue];
}

export default useDebounce;
