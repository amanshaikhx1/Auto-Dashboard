import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAnalyticsStore } from '@/store/analytics-store';
import { DataProcessor } from '@/lib/data-processor';
import { CloudUpload, FileText, Database, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FileUpload() {
  const { setProcessedData, setCurrentSection, setIsProcessing, setError, isProcessing } = useAnalyticsStore();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<Record<string, any>[] | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setUploadProgress(0);
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type
    });

    try {
      // Simulate progress for user feedback
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const processedData = await DataProcessor.processFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Set preview data (first 5 rows)
      setPreviewData(processedData.data.slice(0, 5));
      setProcessedData(processedData);
      
      // Auto-advance to mapping if we have good confidence
      const highConfidenceMappings = processedData.mappings.filter(m => m.confidence >= 70).length;
      if (highConfidenceMappings >= 3) {
        setTimeout(() => {
          setCurrentSection('mapping');
        }, 1500);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process file');
      setUploadProgress(0);
    } finally {
      setIsProcessing(false);
    }
  }, [setProcessedData, setCurrentSection, setIsProcessing, setError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">Transform Your Data Into Insights</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your business data and get instant analytics across 7 comprehensive dashboards with intelligent column mapping and real-time visualizations.
        </p>
      </div>

      {/* Upload Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Upload Your Data File</CardTitle>
          <p className="text-center text-muted-foreground">
            Supports CSV, XLSX, and JSON files up to 10MB
          </p>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200",
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/30",
              isProcessing && "cursor-not-allowed opacity-50"
            )}
            data-testid="dropzone-upload"
          >
            <input {...getInputProps()} data-testid="input-file" />
            <div className="space-y-4">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-colors",
                isDragActive ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/20"
              )}>
                <CloudUpload className={cn(
                  "h-8 w-8",
                  isDragActive ? "text-primary" : "text-primary"
                )} />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {isDragActive ? "Drop your file here" : "Drag and drop your file here"}
                </p>
                <p className="text-muted-foreground mt-1">or click to browse</p>
              </div>
              <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  CSV
                </span>
                <span className="flex items-center">
                  <Database className="h-4 w-4 mr-1" />
                  XLSX
                </span>
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  JSON
                </span>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isProcessing && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Processing file...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" data-testid="progress-upload" />
            </div>
          )}

          {/* File Info */}
          {fileInfo && !isProcessing && (
            <div className="mt-6 p-4 bg-accent rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-foreground" data-testid="text-filename">
                      {fileInfo.name}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-filesize">
                      {formatFileSize(fileInfo.size)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Preview */}
          {previewData && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-foreground">Data Preview (First 5 rows)</h4>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm" data-testid="table-preview">
                  <thead className="bg-muted">
                    <tr>
                      {Object.keys(previewData[0]).map((column) => (
                        <th key={column} className="px-4 py-2 text-left font-medium text-muted-foreground">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-t border-border">
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex} className="px-4 py-2 text-foreground">
                            {String(value).length > 50 
                              ? String(value).substring(0, 50) + '...' 
                              : String(value)
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => setCurrentSection('mapping')}
                  className="mt-4"
                  data-testid="button-continue-mapping"
                >
                  Continue to Column Mapping
                  <TrendingUp className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-6 w-6 text-chart-1" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Intelligent Mapping</h3>
            <p className="text-sm text-muted-foreground">
              Automatically matches your columns to 183 predefined business data mappings
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-chart-2" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">7 Dashboard Views</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive analytics across metrics, trends, products, customers, and more
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-chart-3" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Real-time Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Instant insights with interactive visualizations powered by your data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
