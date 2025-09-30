import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAnalyticsStore } from '@/store/analytics-store';
import { DataProcessor } from '@/lib/data-processor';
import { BUSINESS_FIELDS } from '@/lib/column-mapper';
import { ArrowLeft, Search, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ColumnMapping() {
  const { processedData, setCurrentSection, setMetrics } = useAnalyticsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Date & Time', 'Financial', 'Product']));
  const [mappings, setMappings] = useState(processedData?.mappings || []);

  useEffect(() => {
    if (processedData) {
      setMappings(processedData.mappings);
    }
  }, [processedData]);

  if (!processedData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available. Please upload a file first.</p>
        <Button 
          onClick={() => setCurrentSection('upload')} 
          className="mt-4"
          data-testid="button-back-upload"
        >
          Back to Upload
        </Button>
      </div>
    );
  }

  const mappedCount = mappings.filter(m => m.mapped).length;
  const totalColumns = mappings.length;
  const canProceed = mappedCount >= 5;
  const progressPercentage = (mappedCount / Math.max(totalColumns, 5)) * 100;

  const groupedFields = BUSINESS_FIELDS.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof BUSINESS_FIELDS>);

  const filteredCategories = Object.entries(groupedFields).filter(([category, fields]) => {
    if (!searchTerm) return true;
    return fields.some(field => 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleMapping = (sourceColumn: string, businessField: string) => {
    setMappings(prev => prev.map(mapping => {
      if (mapping.sourceColumn === sourceColumn) {
        const isCurrentlyMapped = mapping.businessField === businessField && mapping.mapped;
        return {
          ...mapping,
          businessField: isCurrentlyMapped ? '' : businessField,
          mapped: !isCurrentlyMapped,
          confidence: isCurrentlyMapped ? 0 : Math.max(mapping.confidence, 85)
        };
      }
      return mapping;
    }));
  };

  const startAnalysis = () => {
    if (!canProceed) return;
    
    // Update processed data with new mappings
    const updatedData = {
      ...processedData,
      mappings
    };
    
    // Calculate metrics
    const metrics = DataProcessor.calculateMetrics(updatedData);
    setMetrics(metrics);
    
    setCurrentSection('summary');
  };

  const getMappedBusinessField = (businessFieldName: string) => {
    return mappings.find(m => m.businessField === businessFieldName && m.mapped);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSection('upload')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Column Mapping</h2>
            <p className="text-muted-foreground">Map your data columns to our business analytics fields</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Progress:</span>
            <span className="ml-2 font-medium">{mappedCount}/5 minimum</span>
          </div>
        </div>
      </div>

      {/* Progress Alert */}
      <Card className={cn(
        "border-l-4",
        canProceed ? "border-l-green-500 bg-green-50 dark:bg-green-950/10" : "border-l-amber-500 bg-amber-50 dark:bg-amber-950/10"
      )}>
        <CardContent className="pt-4">
          <div className="flex items-center">
            {canProceed ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-3" />
            )}
            <div className="flex-1">
              <p className={cn(
                "font-medium",
                canProceed ? "text-green-800 dark:text-green-200" : "text-amber-800 dark:text-amber-200"
              )}>
                {canProceed ? "Ready for analysis!" : "Minimum 5 columns required for analysis"}
              </p>
              <p className={cn(
                "text-sm",
                canProceed ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"
              )}>
                Currently mapped: {mappedCount} columns. 
                {!canProceed && ` Map at least ${5 - mappedCount} more to continue.`}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <Progress value={progressPercentage} className="h-2" data-testid="progress-mapping" />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Your Data Columns */}
        <Card>
          <CardHeader>
            <CardTitle>Your Data Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mappings.map((mapping) => (
                <div 
                  key={mapping.sourceColumn}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  data-testid={`column-${mapping.sourceColumn}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs font-medium">{mapping.dataType[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{mapping.sourceColumn}</p>
                      <p className="text-xs text-muted-foreground capitalize">{mapping.dataType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mapping.mapped ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Mapped
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Unmapped
                      </Badge>
                    )}
                    {mapping.confidence > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {mapping.confidence}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Data Fields */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Business Data Fields</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search 183 fields..."
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-fields"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredCategories.map(([category, fields]) => {
                const isExpanded = expandedCategories.has(category);
                const matchedFields = fields.filter(field => getMappedBusinessField(field.name));
                
                return (
                  <div key={category} className="border border-border rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 bg-accent/30 hover:bg-accent/50 transition-colors"
                      onClick={() => toggleCategory(category)}
                      data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-foreground">{category}</span>
                        {matchedFields.length > 0 && (
                          <Badge variant="default" className="bg-primary/20 text-primary">
                            {matchedFields.length} mapped
                          </Badge>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="p-4 space-y-2 bg-card">
                        {fields
                          .filter(field => 
                            !searchTerm || 
                            field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            field.description.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((field) => {
                            const mappedColumn = getMappedBusinessField(field.name);
                            const isMapped = !!mappedColumn;
                            
                            return (
                              <div
                                key={field.id}
                                className={cn(
                                  "flex items-center justify-between p-2 border rounded cursor-pointer transition-colors",
                                  isMapped 
                                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20" 
                                    : "border-border hover:bg-accent/30"
                                )}
                                onClick={() => {
                                  if (isMapped && mappedColumn) {
                                    toggleMapping(mappedColumn.sourceColumn, field.name);
                                  } else {
                                    // Find best unmapped column for this field
                                    const unmappedColumns = mappings.filter(m => !m.mapped);
                                    const bestMatch = unmappedColumns.find(m => 
                                      m.sourceColumn.toLowerCase().includes(field.name.toLowerCase().split(' ')[0].toLowerCase())
                                    ) || unmappedColumns[0];
                                    
                                    if (bestMatch) {
                                      toggleMapping(bestMatch.sourceColumn, field.name);
                                    }
                                  }
                                }}
                                data-testid={`field-${field.id}`}
                              >
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-foreground">{field.name}</span>
                                  <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                                  {isMapped && mappedColumn && (
                                    <p className="text-xs text-green-600 mt-1">
                                      MAPPED: {mappedColumn.sourceColumn}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant={isMapped ? "destructive" : "default"}
                                  size="sm"
                                  className="ml-2"
                                >
                                  {isMapped ? "Unmap" : "Map"}
                                </Button>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={startAnalysis}
                disabled={!canProceed}
                className="px-8"
                data-testid="button-start-analysis"
              >
                Start Analysis
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
