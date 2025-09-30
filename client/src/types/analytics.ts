export interface ProcessedData {
  id: string;
  fileName: string;
  fileSize: number;
  rowCount: number;
  columns: string[];
  data: Record<string, any>[];
  mappings: ColumnMapping[];
  uploadedAt: Date;
}

export interface ColumnMapping {
  sourceColumn: string;
  businessField: string;
  confidence: number;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  mapped: boolean;
}

export interface BusinessField {
  id: string;
  name: string;
  category: string;
  description: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  examples: string[];
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalProfit: number;
  totalTransactions: number;
  avgOrderValue: number;
  profitMargin: number;
  inventoryMetrics: {
    activeProducts: number;
    lowStock: number;
    outOfStock: number;
    totalValue: number;
  };
  customerMetrics: {
    total: number;
    new: number;
    retention: number;
    ltv: number;
  };
  growthRates: {
    daily: number;
    weekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
  };
}

export interface ChartData {
  [key: string]: any;
}

export type DashboardSection = 
  | 'upload'
  | 'mapping' 
  | 'summary' 
  | 'trends' 
  | 'products' 
  | 'customers' 
  | 'financial' 
  | 'operational' 
  | 'marketing';
