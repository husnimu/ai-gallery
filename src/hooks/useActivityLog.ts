import { useState, useEffect, useCallback } from 'react';

export interface ActivityLog {
  id: string;
  type: 'upload' | 'download' | 'delete';
  photoTitle: string;
  category?: string;
  timestamp: number;
  count?: number; // Untuk batch operations
}

const STORAGE_KEY = 'galeri-activity-log';
const MAX_LOGS = 100; // Batasi jumlah log

export const useActivityLog = () => {
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading activity logs:', e);
    }
    return [];
  });

  // Simpan ke localStorage setiap kali berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving activity logs:', e);
    }
  }, [logs]);

  const addLog = useCallback((type: ActivityLog['type'], photoTitle: string, category?: string, count?: number) => {
    const newLog: ActivityLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      photoTitle,
      category,
      timestamp: Date.now(),
      count,
    };

    setLogs((prev) => {
      const updated = [newLog, ...prev];
      // Batasi jumlah log
      if (updated.length > MAX_LOGS) {
        return updated.slice(0, MAX_LOGS);
      }
      return updated;
    });
  }, []);

  const logUpload = useCallback((photoTitle: string, category: string, count: number = 1) => {
    addLog('upload', photoTitle, category, count);
  }, [addLog]);

  const logDownload = useCallback((photoTitle: string, category?: string, count?: number) => {
    addLog('download', photoTitle, category, count);
  }, [addLog]);

  const logDelete = useCallback((photoTitle: string) => {
    addLog('delete', photoTitle);
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const getLogsByType = useCallback((type: ActivityLog['type']) => {
    return logs.filter((log) => log.type === type);
  }, [logs]);

  return {
    logs,
    logUpload,
    logDownload,
    logDelete,
    clearLogs,
    getLogsByType,
  };
};
