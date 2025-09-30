import { useAnalyticsStore } from '@/store/analytics-store';
import { DashboardSection } from '@/types/analytics';
import { cn } from '@/lib/utils';
import {
  Upload,
  GitBranch,
  BarChart3,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Settings,
  Megaphone,
  X
} from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { id: 'upload' as DashboardSection, label: 'Data Upload', icon: Upload },
  { id: 'mapping' as DashboardSection, label: 'Column Mapping', icon: GitBranch },
  { id: 'summary' as DashboardSection, label: 'Summary Metrics', icon: BarChart3 },
  { id: 'trends' as DashboardSection, label: 'Trends & Time Analysis', icon: TrendingUp },
  { id: 'products' as DashboardSection, label: 'Product Analysis', icon: Package },
  { id: 'customers' as DashboardSection, label: 'Customer Analysis', icon: Users },
  { id: 'financial' as DashboardSection, label: 'Financial Analysis', icon: DollarSign },
  { id: 'operational' as DashboardSection, label: 'Operational Analysis', icon: Settings },
  { id: 'marketing' as DashboardSection, label: 'Marketing & Promotion', icon: Megaphone },
];

export default function DashboardNavigation({ isOpen, onClose }: NavigationProps) {
  const { currentSection, setCurrentSection, processedData } = useAnalyticsStore();

  const handleSectionChange = (section: DashboardSection) => {
    // Don't allow navigation to analysis sections without data
    if (!processedData && section !== 'upload' && section !== 'mapping') {
      return;
    }
    
    // Don't allow navigation to mapping without processed data
    if (!processedData && section === 'mapping') {
      return;
    }

    setCurrentSection(section);
    onClose();
  };

  const isAccessible = (section: DashboardSection) => {
    if (section === 'upload') return true;
    if (section === 'mapping') return !!processedData;
    return !!processedData && processedData.mappings.filter(m => m.mapped).length >= 5;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <nav className={cn(
        "fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out",
        "lg:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-border lg:hidden">
          <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            data-testid="button-close-nav"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto h-full">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const accessible = isAccessible(item.id);
            const active = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                disabled={!accessible}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                  active 
                    ? "bg-primary text-primary-foreground" 
                    : accessible
                      ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                      : "text-muted-foreground/50 cursor-not-allowed",
                  "group"
                )}
                data-testid={`nav-${item.id}`}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  active ? "text-primary-foreground" : accessible ? "" : "opacity-50"
                )} />
                <span className={cn(
                  "font-medium truncate",
                  !accessible && "opacity-50"
                )}>
                  {item.label}
                </span>
                {!accessible && item.id !== 'upload' && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 ml-auto" />
                )}
              </button>
            );
          })}
        </div>

        {/* Progress indicator */}
        {processedData && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">
              Data Status
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>File:</span>
                <span className="text-foreground">{processedData.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span>Rows:</span>
                <span className="text-foreground">{processedData.rowCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Mapped:</span>
                <span className="text-foreground">
                  {processedData.mappings.filter(m => m.mapped).length}/{processedData.mappings.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
