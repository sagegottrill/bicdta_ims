import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { X, Upload, FileImage, Video, FileText, Trash2 } from 'lucide-react';
import { uploadWeeklyReportFiles } from '@/lib/googleDrive';

interface WeeklyReportFormProps {
  onClose: () => void;
}

const WeeklyReportForm: React.FC<WeeklyReportFormProps> = ({ onClose }) => {
  const { addWeeklyReport, centres } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    centre_name: '',
    technical_manager_name: '',
    week_number: '',
    year: new Date().getFullYear().toString(),
    comments: '',
    trainees_enrolled: '',
    trainees_completed: '',
    trainees_dropped: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.centre_name || !formData.technical_manager_name || !formData.week_number) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      // Upload files to Google Drive first
      const uploadedFileData = await uploadFilesToGoogleDrive();
      
      await addWeeklyReport({
        centre_name: formData.centre_name,
        technical_manager_name: formData.technical_manager_name,
        week_number: parseInt(formData.week_number),
        year: parseInt(formData.year),
        comments: formData.comments,
        trainees_enrolled: parseInt(formData.trainees_enrolled) || 0,
        trainees_completed: parseInt(formData.trainees_completed) || 0,
        trainees_dropped: parseInt(formData.trainees_dropped) || 0,
        attached_files: uploadedFileData, // Add uploaded files data
      });
      toast({ title: 'Success', description: 'Weekly report submitted successfully!' });
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit weekly report', variant: 'destructive' });
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
      const results = await uploadWeeklyReportFiles(uploadedFiles, formData.centre_name);
      setUploadingFiles(false);
      return results.filter(result => result.success).map(result => result.file);
    } catch (error) {
      setUploadingFiles(false);
      toast({ title: 'Error', description: 'Failed to upload files', variant: 'destructive' });
      return [];
    }
  };

  const availableCentres = centres.map(centre => centre.centre_name);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-2xl mx-auto shadow-lg border-0 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">Submit Weekly Report</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="centre_name">Centre Name *</Label>
                <Select value={formData.centre_name} onValueChange={(value) => handleChange('centre_name', value)}>
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
                <Label htmlFor="technical_manager_name">Technical Manager Name *</Label>
                <Input
                  id="technical_manager_name"
                  value={formData.technical_manager_name}
                  onChange={(e) => handleChange('technical_manager_name', e.target.value)}
                  placeholder="Enter technical manager name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="week_number">Week Number *</Label>
                <Input
                  id="week_number"
                  type="number"
                  min="1"
                  max="52"
                  value={formData.week_number}
                  onChange={(e) => handleChange('week_number', e.target.value)}
                  placeholder="Enter week number (1-52)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  placeholder="Enter year"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="trainees_enrolled">Trainees Enrolled</Label>
                <Input
                  id="trainees_enrolled"
                  type="number"
                  value={formData.trainees_enrolled}
                  onChange={(e) => handleChange('trainees_enrolled', e.target.value)}
                  placeholder="Enter number of trainees enrolled"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="trainees_completed">Trainees Completed</Label>
                <Input
                  id="trainees_completed"
                  type="number"
                  value={formData.trainees_completed}
                  onChange={(e) => handleChange('trainees_completed', e.target.value)}
                  placeholder="Enter number of trainees completed"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="trainees_dropped">Trainees Dropped</Label>
                <Input
                  id="trainees_dropped"
                  type="number"
                  value={formData.trainees_dropped}
                  onChange={(e) => handleChange('trainees_dropped', e.target.value)}
                  placeholder="Enter number of trainees dropped"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleChange('comments', e.target.value)}
                placeholder="Enter any additional comments or observations..."
                className="mt-1"
                rows={4}
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <div>
                <Label>Attach Files (Pictures & Videos)</Label>
                <p className="text-sm text-slate-500 mb-2">
                  Upload photos and videos related to this week's activities (Max 30MB per file)
                </p>
                
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-slate-600 mt-2">Uploading files to Google Drive...</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyReportForm;
