import { create } from 'zustand';
import { ProcessedData, DashboardSection, DashboardMetrics } from '@/types/analytics';

interface AnalyticsStore {
  // Current state
  currentSection: DashboardSection;
  processedData: ProcessedData | null;
  isProcessing: boolean;
  metrics: DashboardMetrics | null;
  error: string | null;

  // Actions
  setCurrentSection: (section: DashboardSection) => void;
  setProcessedData: (data: ProcessedData) => void;
  setIsProcessing: (processing: boolean) => void;
  setMetrics: (metrics: DashboardMetrics) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  currentSection: 'upload',
  processedData: null,
  isProcessing: false,
  metrics: null,
  error: null,

  setCurrentSection: (section) => set({ currentSection: section }),
  setProcessedData: (data) => set({ processedData: data }),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  setMetrics: (metrics) => set({ metrics }),
  setError: (error) => set({ error }),
  reset: () => set({
    currentSection: 'upload',
    processedData: null,
    isProcessing: false,
    metrics: null,
    error: null,
  }),
}));
