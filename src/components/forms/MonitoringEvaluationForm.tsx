import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { X, Upload, FileImage, Video, FileText, Trash2, BarChart3, Target, TrendingUp } from 'lucide-react';
import { uploadMEReportFiles } from '@/lib/googleDrive';

interface MonitoringEvaluationFormProps {
  onClose: () => void;
}

const MonitoringEvaluationForm: React.FC<MonitoringEvaluationFormProps> = ({ onClose }) => {
  const { addMEReport, centres, currentUser } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    centre_name: currentUser?.centre_name || '',
    technical_manager_name: currentUser?.name || '',
    month: '',
    year: new Date().getFullYear().toString(),
    evaluation_period: '',
    total_enrollment: '',
    total_completion: '',
    total_dropout: '',
    employment_rate: '',
    satisfaction_score: '',
    infrastructure_score: '',
    training_quality_score: '',
    challenges_faced: '',
    recommendations: '',
    next_quarter_goals: '',
    budget_utilization: '',
    community_impact: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.centre_name || !formData.technical_manager_name || !formData.month) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      // Upload files to Google Drive first
      const uploadedFileData = await uploadFilesToGoogleDrive();
      
      await addMEReport({
        centre_name: formData.centre_name,
        technical_manager_name: formData.technical_manager_name,
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        evaluation_period: formData.evaluation_period,
        total_enrollment: parseInt(formData.total_enrollment) || 0,
        total_completion: parseInt(formData.total_completion) || 0,
        total_dropout: parseInt(formData.total_dropout) || 0,
        employment_rate: parseFloat(formData.employment_rate) || 0,
        satisfaction_score: parseFloat(formData.satisfaction_score) || 0,
        infrastructure_score: parseFloat(formData.infrastructure_score) || 0,
        training_quality_score: parseFloat(formData.training_quality_score) || 0,
        challenges_faced: formData.challenges_faced,
        recommendations: formData.recommendations,
        next_quarter_goals: formData.next_quarter_goals,
        budget_utilization: parseFloat(formData.budget_utilization) || 0,
        community_impact: formData.community_impact,
        attached_files: uploadedFileData,
      });
      toast({ title: 'Success', description: 'Monitoring & Evaluation report submitted successfully!' });
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit M&E report', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFilesToGoogleDrive = async () => {
    if (uploadedFiles.length === 0) return [];
    
    setUploadingFiles(true);
    try {
      const results = await uploadMEReportFiles(uploadedFiles, formData.centre_name);
      setUploadingFiles(false);
      return results.filter(result => result.success).map(result => result.file);
    } catch (error) {
      setUploadingFiles(false);
      toast({ title: 'Error', description: 'Failed to upload files', variant: 'destructive' });
      return [];
    }
  };

  const availableCentres = centres.map(centre => centre.centre_name);

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Monitoring & Evaluation Report</CardTitle>
              <p className="text-sm text-slate-500">Comprehensive evaluation and monitoring data</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Section */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-800">Monitoring & Evaluation Report</h3>
                  <p className="text-purple-600 text-sm">Track performance metrics, challenges, and impact assessment</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="centre">Centre Name *</Label>
                <Select 
                  value={formData.centre_name} 
                  onValueChange={(value) => handleChange('centre_name', value)}
                  disabled={currentUser?.role === 'instructor'}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCentres.map(centre => (
                      <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="manager">Technical Manager *</Label>
                <Input
                  id="manager"
                  value={formData.technical_manager_name}
                  onChange={(e) => handleChange('technical_manager_name', e.target.value)}
                  placeholder="Enter technical manager name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="evaluation_period">Evaluation Period</Label>
                <Input
                  id="evaluation_period"
                  value={formData.evaluation_period}
                  onChange={(e) => handleChange('evaluation_period', e.target.value)}
                  placeholder="e.g., Q1 2024, Monthly"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Month and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="month">Month *</Label>
                <Select value={formData.month} onValueChange={(value) => handleChange('month', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  placeholder="Enter year"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Enrollment Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Enrollment & Completion Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="total_enrollment">Total Enrollment</Label>
                  <Input
                    id="total_enrollment"
                    type="number"
                    value={formData.total_enrollment}
                    onChange={(e) => handleChange('total_enrollment', e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="total_completion">Total Completion</Label>
                  <Input
                    id="total_completion"
                    type="number"
                    value={formData.total_completion}
                    onChange={(e) => handleChange('total_completion', e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="total_dropout">Total Dropout</Label>
                  <Input
                    id="total_dropout"
                    type="number"
                    value={formData.total_dropout}
                    onChange={(e) => handleChange('total_dropout', e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="employment_rate">Employment Rate (%)</Label>
                  <Input
                    id="employment_rate"
                    type="number"
                    step="0.1"
                    value={formData.employment_rate}
                    onChange={(e) => handleChange('employment_rate', e.target.value)}
                    placeholder="0.0"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Performance Scores */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Performance Assessment Scores (1-10)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="satisfaction_score">Trainee Satisfaction</Label>
                  <Input
                    id="satisfaction_score"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={formData.satisfaction_score}
                    onChange={(e) => handleChange('satisfaction_score', e.target.value)}
                    placeholder="1-10"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="infrastructure_score">Infrastructure Quality</Label>
                  <Input
                    id="infrastructure_score"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={formData.infrastructure_score}
                    onChange={(e) => handleChange('infrastructure_score', e.target.value)}
                    placeholder="1-10"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="training_quality_score">Training Quality</Label>
                  <Input
                    id="training_quality_score"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={formData.training_quality_score}
                    onChange={(e) => handleChange('training_quality_score', e.target.value)}
                    placeholder="1-10"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Budget and Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="budget_utilization">Budget Utilization (%)</Label>
                <Input
                  id="budget_utilization"
                  type="number"
                  step="0.1"
                  value={formData.budget_utilization}
                  onChange={(e) => handleChange('budget_utilization', e.target.value)}
                  placeholder="0.0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="community_impact">Community Impact</Label>
                <Input
                  id="community_impact"
                  value={formData.community_impact}
                  onChange={(e) => handleChange('community_impact', e.target.value)}
                  placeholder="e.g., High, Medium, Low"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Text Areas */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="challenges_faced">Challenges Faced</Label>
                <Textarea
                  id="challenges_faced"
                  value={formData.challenges_faced}
                  onChange={(e) => handleChange('challenges_faced', e.target.value)}
                  placeholder="Describe the main challenges encountered during this period..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea
                  id="recommendations"
                  value={formData.recommendations}
                  onChange={(e) => handleChange('recommendations', e.target.value)}
                  placeholder="Provide recommendations for improvement..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="next_quarter_goals">Next Quarter Goals</Label>
                <Textarea
                  id="next_quarter_goals"
                  value={formData.next_quarter_goals}
                  onChange={(e) => handleChange('next_quarter_goals', e.target.value)}
                  placeholder="Outline goals and objectives for the next quarter..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <div>
                <Label>Attach Supporting Documents (Pictures & Videos)</Label>
                <p className="text-sm text-slate-500 mb-2">
                  Upload photos, videos, and documents supporting this evaluation (Max 30MB per file)
                </p>
                
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600 font-medium">Click to upload files</p>
                    <p className="text-sm text-slate-500">or drag and drop</p>
                  </label>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files ({uploadedFiles.length})</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {file.type.startsWith('image/') ? (
                            <FileImage className="w-5 h-5 text-blue-500" />
                          ) : file.type.startsWith('video/') ? (
                            <Video className="w-5 h-5 text-red-500" />
                          ) : (
                            <FileText className="w-5 h-5 text-slate-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-700">{file.name}</p>
                            <p className="text-xs text-slate-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadingFiles && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-sm text-slate-600 mt-2">Uploading files to Google Drive...</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadingFiles}>
                {loading ? 'Submitting...' : 'Submit M&E Report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringEvaluationForm;
