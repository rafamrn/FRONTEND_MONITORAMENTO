import { useEffect } from 'react';

export function useGlobalFontSize() {
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const size = savedFontSize ? Number(savedFontSize) : 16;
    document.documentElement.style.fontSize = `${size}px`;
  }, []);
}