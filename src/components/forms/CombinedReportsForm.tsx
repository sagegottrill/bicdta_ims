import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { X, BarChart3, Target, Calendar, Users, TrendingUp, FileText, Save, Building, Wifi, Zap, Droplets, Wind, Monitor, Upload, FileImage, Video, Trash2 } from 'lucide-react';


interface CombinedReportsFormProps {
  onClose: () => void;
}

const CombinedReportsForm: React.FC<CombinedReportsFormProps> = ({ onClose }) => {
  const { addWeeklyReport, addMEReport, currentUser } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('weekly');
  const [loading, setLoading] = useState(false);
  const [weeklyFiles, setWeeklyFiles] = useState<File[]>([]);
  const [monthlyFiles, setMonthlyFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Weekly Report Form Data
  const [weeklyData, setWeeklyData] = useState({
    centre_name: currentUser?.centre_name || '',
    technical_manager_name: '',
    week_number: '',
    year: new Date().getFullYear().toString(),
    report_date: new Date().toISOString().split('T')[0], // Today's date as default
    comments: '',
    trainees_enrolled: '',
    trainees_completed: '',
    trainees_dropped: '',
  });

  // Monthly Report Form Data
  const [monthlyData, setMonthlyData] = useState({
    centre_name: currentUser?.centre_name || '',
    technical_manager_name: '',
    month: '',
    year: new Date().getFullYear().toString(),
    report_date: new Date().toISOString().split('T')[0], // Today's date as default
    comments: '',
  });

  // Center Information Form Data
  const [centerData, setCenterData] = useState({
    centre_name: currentUser?.centre_name || '',
    lga: '',
    technical_manager_name: '',
    technical_manager_email: '',
    contact_number: '',
    declared_capacity: '',
    usable_capacity: '',
    computers_present: '',
    computers_functional: '',
    power_available: '',
    power_condition: '',
    internet_available: '',
    fans_present: '',
    air_condition_present: '',
    fans_functional: '',
    air_condition_functional: '',
    lighting_available: '',
    windows_condition: '',
    water_functional: '',
  });

  const handleWeeklyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setWeeklyFiles(prev => [...prev, ...files]);
  };

  const removeWeeklyFile = (index: number) => {
    setWeeklyFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMonthlyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMonthlyFiles(prev => [...prev, ...files]);
  };

  const removeMonthlyFile = (index: number) => {
    setMonthlyFiles(prev => prev.filter((_, i) => i !== index));
  };



  const handleWeeklySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weeklyData.centre_name || !weeklyData.technical_manager_name || !weeklyData.week_number || !weeklyData.report_date) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await addWeeklyReport({
        centre_name: weeklyData.centre_name,
        technical_manager_name: weeklyData.technical_manager_name,
        week_number: parseInt(weeklyData.week_number),
        year: parseInt(weeklyData.year),
        report_date: weeklyData.report_date,
        comments: weeklyData.comments,
        trainees_enrolled: parseInt(weeklyData.trainees_enrolled) || 0,
        trainees_completed: parseInt(weeklyData.trainees_completed) || 0,
        trainees_dropped: parseInt(weeklyData.trainees_dropped) || 0,
      });
      toast({ title: 'Success', description: 'Weekly report submitted successfully!' });
      setWeeklyData({
        centre_name: '',
        technical_manager_name: '',
        week_number: '',
        year: new Date().getFullYear().toString(),
        report_date: new Date().toISOString().split('T')[0],
        comments: '',
        trainees_enrolled: '',
        trainees_completed: '',
        trainees_dropped: '',
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit weekly report', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleMonthlySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!monthlyData.centre_name || !monthlyData.technical_manager_name || !monthlyData.month || !monthlyData.report_date) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await addMEReport({
        centre_name: monthlyData.centre_name,
        technical_manager_name: monthlyData.technical_manager_name,
        month: parseInt(monthlyData.month),
        year: parseInt(monthlyData.year),
        report_date: monthlyData.report_date,
        comments: monthlyData.comments,
      });
      toast({ title: 'Success', description: 'Monthly report submitted successfully!' });
      setMonthlyData({
        centre_name: '',
        technical_manager_name: '',
        month: '',
        year: new Date().getFullYear().toString(),
        report_date: new Date().toISOString().split('T')[0],
        comments: '',
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit monthly report', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleWeeklyChange = (field: string, value: string) => {
    setWeeklyData(prev => ({ ...prev, [field]: value }));
  };

  const handleMonthlyChange = (field: string, value: string) => {
    setMonthlyData(prev => ({ ...prev, [field]: value }));
  };

  const handleCenterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!centerData.centre_name || !centerData.lga || !centerData.technical_manager_name) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await addCentre({
        centre_name: centerData.centre_name,
        lga: centerData.lga,
        technical_manager_name: centerData.technical_manager_name,
        technical_manager_email: centerData.technical_manager_email,
        contact_number: centerData.contact_number,
        declared_capacity: parseInt(centerData.declared_capacity) || 0,
        usable_capacity: parseInt(centerData.usable_capacity) || 0,
        computers_present: parseInt(centerData.computers_present) || 0,
        computers_functional: parseInt(centerData.computers_functional) || 0,
        power_available: centerData.power_available === 'Yes',
        power_condition: centerData.power_condition,
        internet_available: centerData.internet_available === 'Yes',
        fans_present: parseInt(centerData.fans_present) || 0,
        air_condition_present: parseInt(centerData.air_condition_present) || 0,
        fans_functional: parseInt(centerData.fans_functional) || 0,
        air_condition_functional: parseInt(centerData.air_condition_functional) || 0,
        lighting_available: centerData.lighting_available === 'Yes',
        windows_condition: centerData.windows_condition,
        water_functional: centerData.water_functional === 'Yes',
      });
      toast({ title: 'Success', description: 'Center information submitted successfully!' });
      setCenterData({
        centre_name: '',
        lga: '',
        technical_manager_name: '',
        technical_manager_email: '',
        contact_number: '',
        declared_capacity: '',
        usable_capacity: '',
        computers_present: '',
        computers_functional: '',
        power_available: '',
        power_condition: '',
        internet_available: '',
        fans_present: '',
        air_condition_present: '',
        fans_functional: '',
        air_condition_functional: '',
        lighting_available: '',
        windows_condition: '',
        water_functional: '',
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit center information', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCenterChange = (field: string, value: string) => {
    setCenterData(prev => ({ ...prev, [field]: value }));
  };

  const centreOptions = [
  "DIKWA DIGITAL LITERACY CENTRE",
  "GAJIRAM ICT CENTER", 
  "GUBIO DIGITAL LITERACY CENTRE",
  "KAGA DIGITAL LITERACY CENTRE",
  "MONGUNO DIGITAL LITERACY CENTRE",
  "MAFA DIGITAL LITERACY CENTRE",
  "DAMASAK DIGITAL LITERACY CENTER",
  "BAYO DIGITAL LITERACY CENTER",
  "DAMBOA DIGITAL LITERACY CENTER"
  ];

  const weekOptions = Array.from({ length: 52 }, (_, i) => (i + 1).toString());
  const monthOptions = [
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
    { value: '12', label: 'December' }
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());

  const lgaOptions = [
    'Bayo', 'Dikwa', 'Gajiram', 'Gubio', 'Kaga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri',
    'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani', 'Abadam', 'Askira/Uba', 'Bama', 'Chibok',
    'Damboa', 'Gwoza', 'Hawul', 'Jere', 'Kala/Balge', 'Konduga'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">Submit Reports</CardTitle>
              <p className="text-slate-600 text-sm">Weekly and Monthly Progress Reports</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
                     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
             <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-lg mb-6">
               <TabsTrigger 
                 value="weekly" 
                 className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
               >
                 <Calendar className="w-4 h-4 mr-2" />
                 Weekly Report
               </TabsTrigger>
               <TabsTrigger 
                 value="monthly" 
                 className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
               >
                 <Target className="w-4 h-4 mr-2" />
                 Monthly M&E Report
               </TabsTrigger>
               <TabsTrigger 
                 value="center" 
                 className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
               >
                 <Building className="w-4 h-4 mr-2" />
                 Center Info
               </TabsTrigger>
             </TabsList>

            <TabsContent value="weekly" className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-800">Weekly Progress Report</h3>
                    <p className="text-blue-600 text-sm">Track weekly training progress and outcomes</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleWeeklySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div>
                     <Label htmlFor="weekly-centre">Centre Name *</Label>
                     <Select 
                       value={weeklyData.centre_name} 
                       onValueChange={(value) => handleWeeklyChange('centre_name', value)}
                       disabled={currentUser?.role === 'instructor'}
                     >
                       <SelectTrigger className="mt-1">
                         <SelectValue placeholder="Select centre" />
                       </SelectTrigger>
                       <SelectContent>
                         {centreOptions.map(centre => (
                           <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     {currentUser?.role === 'instructor' && (
                       <p className="text-xs text-slate-500 mt-1">Your assigned center (cannot be changed)</p>
                     )}
                   </div>

                  <div>
                    <Label htmlFor="weekly-manager">Technical Manager Name *</Label>
                    <Input
                      id="weekly-manager"
                      value={weeklyData.technical_manager_name}
                      onChange={(e) => handleWeeklyChange('technical_manager_name', e.target.value)}
                      placeholder="Enter technical manager name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weekly-week">Week Number *</Label>
                    <Select value={weeklyData.week_number} onValueChange={(value) => handleWeeklyChange('week_number', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select week" />
                      </SelectTrigger>
                      <SelectContent>
                        {weekOptions.map(week => (
                          <SelectItem key={week} value={week}>Week {week}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                                     <div>
                     <Label htmlFor="weekly-year">Year</Label>
                     <Select value={weeklyData.year} onValueChange={(value) => handleWeeklyChange('year', value)}>
                       <SelectTrigger className="mt-1">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {yearOptions.map(year => (
                           <SelectItem key={year} value={year}>{year}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>

                   <div>
                     <Label htmlFor="weekly-date">Report Date *</Label>
                     <Input
                       id="weekly-date"
                       type="date"
                       value={weeklyData.report_date}
                       onChange={(e) => handleWeeklyChange('report_date', e.target.value)}
                       className="mt-1"
                     />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="weekly-enrolled">Trainees Enrolled</Label>
                    <Input
                      id="weekly-enrolled"
                      type="number"
                      value={weeklyData.trainees_enrolled}
                      onChange={(e) => handleWeeklyChange('trainees_enrolled', e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weekly-completed">Trainees Completed</Label>
                    <Input
                      id="weekly-completed"
                      type="number"
                      value={weeklyData.trainees_completed}
                      onChange={(e) => handleWeeklyChange('trainees_completed', e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weekly-dropped">Trainees Dropped</Label>
                    <Input
                      id="weekly-dropped"
                      type="number"
                      value={weeklyData.trainees_dropped}
                      onChange={(e) => handleWeeklyChange('trainees_dropped', e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="weekly-comments">Comments & Observations</Label>
                  <Textarea
                    id="weekly-comments"
                    value={weeklyData.comments}
                    onChange={(e) => handleWeeklyChange('comments', e.target.value)}
                    placeholder="Describe weekly progress, challenges, achievements, and any notable observations..."
                    className="mt-1 min-h-[100px]"
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
                        onChange={handleWeeklyFileUpload}
                        className="hidden"
                        id="weekly-file-upload"
                      />
                      <label htmlFor="weekly-file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-600 font-medium">Click to upload files</p>
                        <p className="text-sm text-slate-500">or drag and drop</p>
                      </label>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {weeklyFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files ({weeklyFiles.length})</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {weeklyFiles.map((file, index) => (
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
                              onClick={() => removeWeeklyFile(index)}
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

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    {loading ? 'Submitting...' : 'Submit Weekly Report'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-emerald-800">Monthly M&E Report</h3>
                    <p className="text-emerald-600 text-sm">Comprehensive monthly evaluation and monitoring report</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleMonthlySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div>
                     <Label htmlFor="monthly-centre">Centre Name *</Label>
                     <Select 
                       value={monthlyData.centre_name} 
                       onValueChange={(value) => handleMonthlyChange('centre_name', value)}
                       disabled={currentUser?.role === 'instructor'}
                     >
                       <SelectTrigger className="mt-1">
                         <SelectValue placeholder="Select centre" />
                       </SelectTrigger>
                       <SelectContent>
                         {centreOptions.map(centre => (
                           <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     {currentUser?.role === 'instructor' && (
                       <p className="text-xs text-slate-500 mt-1">Your assigned center (cannot be changed)</p>
                     )}
                   </div>

                  <div>
                    <Label htmlFor="monthly-manager">Technical Manager Name *</Label>
                    <Input
                      id="monthly-manager"
                      value={monthlyData.technical_manager_name}
                      onChange={(e) => handleMonthlyChange('technical_manager_name', e.target.value)}
                      placeholder="Enter technical manager name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthly-month">Month *</Label>
                    <Select value={monthlyData.month} onValueChange={(value) => handleMonthlyChange('month', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map(month => (
                          <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                                     <div>
                     <Label htmlFor="monthly-year">Year</Label>
                     <Select value={monthlyData.year} onValueChange={(value) => handleMonthlyChange('year', value)}>
                       <SelectTrigger className="mt-1">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {yearOptions.map(year => (
                           <SelectItem key={year} value={year}>{year}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>

                   <div>
                     <Label htmlFor="monthly-date">Report Date *</Label>
                     <Input
                       id="monthly-date"
                       type="date"
                       value={monthlyData.report_date}
                       onChange={(e) => handleMonthlyChange('report_date', e.target.value)}
                       className="mt-1"
                     />
                   </div>
                </div>



                <div>
                  <Label htmlFor="monthly-comments">M&E Comments & Analysis</Label>
                  <Textarea
                    id="monthly-comments"
                    value={monthlyData.comments}
                    onChange={(e) => handleMonthlyChange('comments', e.target.value)}
                    placeholder="Provide detailed analysis of monthly performance, challenges, achievements, recommendations, and impact assessment..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                  <div>
                    <Label>Attach Supporting Documents (Pictures & Videos)</Label>
                    <p className="text-sm text-slate-500 mb-2">
                      Upload photos, videos, and documents supporting this month's evaluation (Max 30MB per file)
                    </p>
                    
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleMonthlyFileUpload}
                        className="hidden"
                        id="monthly-file-upload"
                      />
                      <label htmlFor="monthly-file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-600 font-medium">Click to upload files</p>
                        <p className="text-sm text-slate-500">or drag and drop</p>
                      </label>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {monthlyFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files ({monthlyFiles.length})</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {monthlyFiles.map((file, index) => (
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
                              onClick={() => removeMonthlyFile(index)}
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                      <p className="text-sm text-slate-600 mt-2">Uploading files to Google Drive...</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    {loading ? 'Submitting...' : 'Submit Monthly Report'}
                  </Button>
                                 </div>
               </form>
             </TabsContent>

             <TabsContent value="center" className="space-y-6">
               <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                 <div className="flex items-center gap-3">
                   <Building className="w-5 h-5 text-orange-600" />
                   <div>
                     <h3 className="font-semibold text-orange-800">Center Information & Infrastructure</h3>
                     <p className="text-orange-600 text-sm">Report center details and equipment status</p>
                   </div>
                 </div>
               </div>

               <form onSubmit={handleCenterSubmit} className="space-y-6">
                 {/* Center Information */}
                 <div className="space-y-4">
                   <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                     <Building className="w-5 h-5 text-blue-600" />
                     Center Information
                   </h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <Label htmlFor="center-name">Centre Name *</Label>
                       <Select 
                         value={centerData.centre_name} 
                         onValueChange={(value) => handleCenterChange('centre_name', value)}
                         disabled={currentUser?.role === 'instructor'}
                       >
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select centre" />
                         </SelectTrigger>
                         <SelectContent>
                           {centreOptions.map(centre => (
                             <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                       {currentUser?.role === 'instructor' && (
                         <p className="text-xs text-slate-500 mt-1">Your assigned center (cannot be changed)</p>
                       )}
                     </div>

                     <div>
                       <Label htmlFor="center-lga">Local Government Area *</Label>
                       <Select value={centerData.lga} onValueChange={(value) => handleCenterChange('lga', value)}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select LGA" />
                         </SelectTrigger>
                         <SelectContent>
                           {lgaOptions.map(lga => (
                             <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                     <div>
                       <Label htmlFor="center-manager">Technical Manager Name *</Label>
                       <Input
                         id="center-manager"
                         value={centerData.technical_manager_name}
                         onChange={(e) => handleCenterChange('technical_manager_name', e.target.value)}
                         placeholder="Enter technical manager name"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-email">Technical Manager Email</Label>
                       <Input
                         id="center-email"
                         type="email"
                         value={centerData.technical_manager_email}
                         onChange={(e) => handleCenterChange('technical_manager_email', e.target.value)}
                         placeholder="Enter email address"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-contact">Contact Number</Label>
                       <Input
                         id="center-contact"
                         value={centerData.contact_number}
                         onChange={(e) => handleCenterChange('contact_number', e.target.value)}
                         placeholder="Enter contact number"
                         className="mt-1"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Infrastructure and Equipment */}
                 <div className="space-y-4">
                   <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                     <Monitor className="w-5 h-5 text-emerald-600" />
                     Infrastructure and Equipment
                   </h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <Label htmlFor="center-declared-capacity">Declared Capacity (Seats)</Label>
                       <Input
                         id="center-declared-capacity"
                         type="number"
                         value={centerData.declared_capacity}
                         onChange={(e) => handleCenterChange('declared_capacity', e.target.value)}
                         placeholder="0"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-usable-capacity">Usable Capacity (Seats)</Label>
                       <Input
                         id="center-usable-capacity"
                         type="number"
                         value={centerData.usable_capacity}
                         onChange={(e) => handleCenterChange('usable_capacity', e.target.value)}
                         placeholder="0"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-computers-present">Computers Present (number)</Label>
                       <Input
                         id="center-computers-present"
                         type="number"
                         value={centerData.computers_present}
                         onChange={(e) => handleCenterChange('computers_present', e.target.value)}
                         placeholder="0"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-computers-functional">Computers Functional (number)</Label>
                       <Input
                         id="center-computers-functional"
                         type="number"
                         value={centerData.computers_functional}
                         onChange={(e) => handleCenterChange('computers_functional', e.target.value)}
                         placeholder="0"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-power-available">Power Available</Label>
                       <Select value={centerData.power_available} onValueChange={(value) => handleCenterChange('power_available', value)}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select status" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Yes">Yes</SelectItem>
                           <SelectItem value="No">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     <div>
                       <Label htmlFor="center-power-condition">Power Condition - Comment</Label>
                       <Input
                         id="center-power-condition"
                         value={centerData.power_condition}
                         onChange={(e) => handleCenterChange('power_condition', e.target.value)}
                         placeholder="e.g., Stable, Unstable, etc."
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-internet-available">Internet Available</Label>
                       <Select value={centerData.internet_available} onValueChange={(value) => handleCenterChange('internet_available', value)}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select status" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Yes">Yes</SelectItem>
                           <SelectItem value="No">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     <div>
                       <Label htmlFor="center-fans-present">Fans Present (number)</Label>
                       <Input
                         id="center-fans-present"
                         type="number"
                         value={centerData.fans_present}
                         onChange={(e) => handleCenterChange('fans_present', e.target.value)}
                         placeholder="0"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-air-condition-present">Air Condition Present (number)</Label>
                       <Input
                         id="center-air-condition-present"
                         type="number"
                         value={centerData.air_condition_present}
                         onChange={(e) => handleCenterChange('air_condition_present', e.target.value)}
                         placeholder="0"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-fans-functional">Fans Functional (number)</Label>
                       <Input
                         id="center-fans-functional"
                         type="number"
                         value={centerData.fans_functional}
                         onChange={(e) => handleCenterChange('fans_functional', e.target.value)}
                         placeholder="0"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-air-condition-functional">Air Condition Functional (number)</Label>
                       <Input
                         id="center-air-condition-functional"
                         type="number"
                         value={centerData.air_condition_functional}
                         onChange={(e) => handleCenterChange('air_condition_functional', e.target.value)}
                         placeholder="0"
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="center-lighting-available">Lighting Available</Label>
                       <Select value={centerData.lighting_available} onValueChange={(value) => handleCenterChange('lighting_available', value)}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select status" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Yes">Yes</SelectItem>
                           <SelectItem value="No">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     <div>
                       <Label htmlFor="center-windows-condition">Windows Condition</Label>
                       <Select value={centerData.windows_condition} onValueChange={(value) => handleCenterChange('windows_condition', value)}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select condition" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Good">Good</SelectItem>
                           <SelectItem value="Bad">Bad</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     <div>
                       <Label htmlFor="center-water-functional">Water Functional</Label>
                       <Select value={centerData.water_functional} onValueChange={(value) => handleCenterChange('water_functional', value)}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select status" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Yes">Yes</SelectItem>
                           <SelectItem value="No">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
                 </div>

                 <div className="flex gap-3 pt-4">
                   <Button 
                     type="button" 
                     variant="outline" 
                     onClick={onClose}
                     className="flex-1"
                   >
                     Cancel
                   </Button>
                   <Button 
                     type="submit" 
                     disabled={loading}
                     className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                   >
                     {loading ? 'Submitting...' : 'Submit Center Information'}
                   </Button>
                 </div>
               </form>
             </TabsContent>
           </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CombinedReportsForm;
