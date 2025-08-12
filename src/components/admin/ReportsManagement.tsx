import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { FileText, Calendar, Target, Search, Download, Eye, Filter } from 'lucide-react';

interface ReportsManagementProps {
  currentUser: { role: 'instructor' | 'admin' | null; name: string; centre_name?: string } | null;
}

const ReportsManagement: React.FC<ReportsManagementProps> = ({ currentUser }) => {
  const { weeklyReports, meReports, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCentre, setSelectedCentre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Get unique centres, years, and months for filters
  const uniqueCentres = [...new Set([
    ...weeklyReports.map(r => r.centre_name),
    ...meReports.map(r => r.centre_name)
  ])].filter(Boolean).sort();

  const uniqueYears = [...new Set([
    ...weeklyReports.map(r => r.year.toString()),
    ...meReports.map(r => r.year.toString())
  ])].sort((a, b) => parseInt(b) - parseInt(a));

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

  // Filter reports based on search and filters
  const filteredWeeklyReports = weeklyReports.filter(report => {
    const centreMatch = selectedCentre === 'all' || report.centre_name === selectedCentre;
    const yearMatch = selectedYear === 'all' || report.year.toString() === selectedYear;
    const searchMatch = !searchTerm || 
      report.centre_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.technical_manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.comments.toLowerCase().includes(searchTerm.toLowerCase());
    
    return centreMatch && yearMatch && searchMatch;
  });

  const filteredMEReports = meReports.filter(report => {
    const centreMatch = selectedCentre === 'all' || report.centre_name === selectedCentre;
    const yearMatch = selectedYear === 'all' || report.year.toString() === selectedYear;
    const monthMatch = selectedMonth === 'all' || report.month.toString() === selectedMonth;
    const searchMatch = !searchTerm || 
      report.centre_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.technical_manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.comments.toLowerCase().includes(searchTerm.toLowerCase());
    
    return centreMatch && yearMatch && monthMatch && searchMatch;
  });

  const handleExport = (type: 'weekly' | 'monthly') => {
    const reports = type === 'weekly' ? filteredWeeklyReports : filteredMEReports;
    const csvContent = generateCSV(reports, type);
    downloadCSV(csvContent, `${type}-reports-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateCSV = (reports: any[], type: 'weekly' | 'monthly') => {
    const headers = type === 'weekly' 
      ? ['Centre Name', 'Technical Manager', 'Week', 'Year', 'Report Date', 'Enrolled', 'Completed', 'Dropped', 'Comments']
      : ['Centre Name', 'Technical Manager', 'Month', 'Year', 'Report Date', 'Comments'];
    
    const rows = reports.map(report => {
      if (type === 'weekly') {
        return [
          report.centre_name,
          report.technical_manager_name,
          report.week_number,
          report.year,
          report.report_date,
          report.trainees_enrolled,
          report.trainees_completed,
          report.trainees_dropped,
          report.comments
        ];
      } else {
        return [
          report.centre_name,
          report.technical_manager_name,
          report.month,
          report.year,
          report.report_date,
          report.comments
        ];
      }
    });

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-slate-600">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Reports Management
          </h2>
          <p className="text-slate-600 mt-1">
            View and manage all weekly and monthly reports from instructors
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleExport('weekly')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Weekly
          </Button>
          <Button 
            onClick={() => handleExport('monthly')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Monthly
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Filter className="w-5 h-5 text-blue-600" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Centre</label>
              <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                <SelectTrigger>
                  <SelectValue placeholder="All Centres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Centres</SelectItem>
                  {uniqueCentres.map(centre => (
                    <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {monthOptions.map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Weekly Reports ({filteredWeeklyReports.length})
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Monthly Reports ({filteredMEReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Calendar className="w-5 h-5 text-blue-600" />
                Weekly Progress Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredWeeklyReports.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No weekly reports found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredWeeklyReports.map((report, index) => (
                    <Card key={index} className="border border-slate-200 hover:border-blue-300 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-800">{report.centre_name}</h3>
                              <Badge variant="secondary">Week {report.week_number}, {report.year}</Badge>
                              <Badge variant="outline">{report.report_date}</Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">
                              <strong>Manager:</strong> {report.technical_manager_name}
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div className="text-center p-2 bg-blue-50 rounded">
                                <div className="text-lg font-bold text-blue-600">{report.trainees_enrolled}</div>
                                <div className="text-xs text-slate-600">Enrolled</div>
                              </div>
                              <div className="text-center p-2 bg-green-50 rounded">
                                <div className="text-lg font-bold text-green-600">{report.trainees_completed}</div>
                                <div className="text-xs text-slate-600">Completed</div>
                              </div>
                              <div className="text-center p-2 bg-red-50 rounded">
                                <div className="text-lg font-bold text-red-600">{report.trainees_dropped}</div>
                                <div className="text-xs text-slate-600">Dropped</div>
                              </div>
                            </div>
                            {report.comments && (
                              <div className="bg-slate-50 p-3 rounded">
                                <p className="text-sm text-slate-700">{report.comments}</p>
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Target className="w-5 h-5 text-emerald-600" />
                Monthly M&E Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredMEReports.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No monthly reports found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMEReports.map((report, index) => (
                    <Card key={index} className="border border-slate-200 hover:border-emerald-300 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-800">{report.centre_name}</h3>
                              <Badge variant="secondary">
                                {monthOptions.find(m => m.value === report.month.toString())?.label} {report.year}
                              </Badge>
                              <Badge variant="outline">{report.report_date}</Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">
                              <strong>Manager:</strong> {report.technical_manager_name}
                            </p>
                            {report.comments && (
                              <div className="bg-slate-50 p-3 rounded">
                                <p className="text-sm text-slate-700">{report.comments}</p>
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;
