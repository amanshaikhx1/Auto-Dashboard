import { useState } from "react";
import { useAnalyticsStore } from "@/store/analytics-store";
import FileUpload from "@/components/file-upload";
import ColumnMapping from "@/components/column-mapping";
import DashboardNavigation from "@/components/dashboard/navigation";
import SummaryMetrics from "@/components/dashboard/summary-metrics";
import TrendsAnalysis from "@/components/dashboard/trends-analysis";
import ProductAnalysis from "@/components/dashboard/product-analysis";
import CustomerAnalysis from "@/components/dashboard/customer-analysis";
import FinancialAnalysis from "@/components/dashboard/financial-analysis";
import OperationalAnalysis from "@/components/dashboard/operational-analysis";
import MarketingAnalysis from "@/components/dashboard/marketing-analysis";
import { Button } from "@/components/ui/button";
import { ChartBar, Upload } from "lucide-react";

export default function Dashboard() {
  const { currentSection, processedData, error } = useAnalyticsStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getSectionTitle = () => {
    const titles = {
      upload: 'Data Upload',
      mapping: 'Column Mapping',
      summary: 'Summary Metrics',
      trends: 'Trends & Time Analysis',
      products: 'Product Analysis',
      customers: 'Customer Analysis',
      financial: 'Financial Analysis',
      operational: 'Operational Analysis',
      marketing: 'Marketing & Promotion'
    };
    return titles[currentSection] || 'Analytics Platform';
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'upload':
        return <FileUpload />;
      case 'mapping':
        return <ColumnMapping />;
      case 'summary':
        return <SummaryMetrics />;
      case 'trends':
        return <TrendsAnalysis />;
      case 'products':
        return <ProductAnalysis />;
      case 'customers':
        return <CustomerAnalysis />;
      case 'financial':
        return <FinancialAnalysis />;
      case 'operational':
        return <OperationalAnalysis />;
      case 'marketing':
        return <MarketingAnalysis />;
      default:
        return <FileUpload />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <ChartBar className="h-6 w-6 text-muted-foreground" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ChartBar className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Analytics Platform</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {processedData ? `${processedData.fileName} • ${processedData.rowCount.toLocaleString()} records` : 'Data-Driven Business Insights'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {processedData && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{processedData.mappings.filter(m => m.mapped).length} columns mapped</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              data-testid="button-upload-new"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Data
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <DashboardNavigation 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">{getSectionTitle()}</h2>
              {currentSection !== 'upload' && currentSection !== 'mapping' && (
                <p className="text-muted-foreground mt-1">
                  Interactive analytics and insights from your uploaded data
                </p>
              )}
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-destructive rounded-full mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="text-destructive font-medium">Error</p>
                    <p className="text-destructive/80 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {renderCurrentSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
