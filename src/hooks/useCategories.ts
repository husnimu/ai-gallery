import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'galeri-categories';
const DEFAULT_CATEGORIES = ['Alam', 'Arsitektur', 'Hewan', 'Makanan', 'Perjalanan'];

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading categories:', e);
    }
    return DEFAULT_CATEGORIES;
  });

  // Simpan ke localStorage setiap kali berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
  }, [categories]);

  const addCategory = useCallback((newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed) return false;
    
    // Cek apakah sudah ada (case-insensitive)
    const exists = categories.some(
      (cat) => cat.toLowerCase() === trimmed.toLowerCase()
    );
    
    if (exists) return false;
    
    setCategories((prev) => [...prev, trimmed]);
    return true;
  }, [categories]);

  const removeCategory = useCallback((category: string) => {
    setCategories((prev) => prev.filter((cat) => cat !== category));
  }, []);

  // Untuk filter: tambahkan "Semua" di depan
  const filterCategories = ['Semua', ...categories];

  return {
    categories,
    filterCategories,
    addCategory,
    removeCategory,
  };
};
