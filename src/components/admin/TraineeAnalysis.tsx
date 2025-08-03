import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Edit, Trash2, Download, Users, GraduationCap, Building, Target, TrendingUp, Filter, Search, BarChart3, Activity } from 'lucide-react';
import ExportModal from '../ExportModal';

const TraineeAnalysis: React.FC<{ handleEdit?: (type: string, id: string) => void, handleDelete?: (type: string, id: string) => void }> = ({ handleEdit, handleDelete }) => {
  const { trainees } = useAppContext();
  const [selectedCentre, setSelectedCentre] = useState<string>('all');
  const [selectedCohort, setSelectedCohort] = useState<string>('all');

  // Analytics calculations
  const totalTrainees = trainees.length;
  const maleCount = trainees.filter(t => ['male', 'm'].includes(t.gender?.toLowerCase() || '')).length;
  const femaleCount = trainees.filter(t => ['female', 'f'].includes(t.gender?.toLowerCase() || '')).length;
  const employedCount = trainees.filter(t => ['employed', 'emp'].includes(t.employment_status?.toLowerCase() || '')).length;
  const unemployedCount = trainees.filter(t => ['unemployed', 'unemp'].includes(t.employment_status?.toLowerCase() || '')).length;

  const educationStats = [
    { level: 'Primary', count: trainees.filter(t => t.educational_background?.toLowerCase().includes('primary')).length },
    { level: 'Secondary', count: trainees.filter(t => t.educational_background?.toLowerCase().includes('secondary') || t.educational_background?.toLowerCase().includes('ssce')).length },
    { level: 'Tertiary', count: trainees.filter(t => t.educational_background?.toLowerCase().includes('tertiary') || t.educational_background?.toLowerCase().includes('ond') || t.educational_background?.toLowerCase().includes('bsc')).length },
    { level: 'None', count: trainees.filter(t => t.educational_background?.toLowerCase() === 'nil' || t.educational_background?.toLowerCase() === 'none').length },
  ];

  const employmentStats = [
    { status: 'Employed', count: employedCount },
    { status: 'Unemployed', count: unemployedCount },
  ];

  // Get unique centres and cohorts for filter dropdowns
  const uniqueCentres = [
          "DIKWA DIGITAL LITERACY CENTRE",
    "GAJIRAM ICT CENTER", 
    "GUBIO DIGITAL LITERACY CENTRE",
    "KAGA DIGITAL LITERACY CENTRE",
    "MONGUNO DIGITAL LITERACY CENTRE",
    "MAFA DIGITAL LITERACY CENTRE",
    "DAMASAK DIGITAL LITERACY CENTER",
    "BAYO DIGITAL LITERACY CENTER"
  ];
  const uniqueCohorts = [...new Set(trainees.map(t => t.cohort_number?.toString() || ''))].filter(cohort => cohort && cohort !== '0').sort();

  // Filtered trainees based on selected filters
  const filteredTrainees = trainees.filter(trainee => {
    const centreMatch = selectedCentre === 'all' || trainee.centre_name?.toUpperCase() === selectedCentre;
    const cohortMatch = selectedCohort === 'all' || trainee.cohort_number.toString() === selectedCohort;
    return centreMatch && cohortMatch;
  });

  return (
    <div className="space-y-8">
      {/* Premium Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trainee Management Console</h2>
            <p className="text-blue-100 text-lg">Comprehensive trainee data analysis and management</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Premium Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Trainees</p>
                <p className="text-4xl font-bold">{totalTrainees.toLocaleString()}</p>
                <p className="text-blue-100 text-xs mt-2">Active in system</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Gender Balance</p>
                <p className="text-4xl font-bold">{maleCount + femaleCount}</p>
                <p className="text-emerald-100 text-xs mt-2">Male: {maleCount} | Female: {femaleCount}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Employment Rate</p>
                <p className="text-4xl font-bold">{totalTrainees > 0 ? ((employedCount / totalTrainees) * 100).toFixed(1) : 0}%</p>
                <p className="text-purple-100 text-xs mt-2">{employedCount} employed</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Filtered Results</p>
                <p className="text-4xl font-bold">{filteredTrainees.length}</p>
                <p className="text-orange-100 text-xs mt-2">Based on filters</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filter Controls */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-50 to-blue-50">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-slate-800">Advanced Filter Controls</CardTitle>
            <p className="text-slate-600 text-sm">Refine your trainee data view</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Training Centre</label>
              <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                <SelectTrigger className="bg-white/50 border-slate-200">
                  <SelectValue placeholder="Select Centre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Training Centres</SelectItem>
                  {uniqueCentres.map(centre => (
                    <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Cohort</label>
              <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                <SelectTrigger className="bg-white/50 border-slate-200">
                  <SelectValue placeholder="Select Cohort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cohorts</SelectItem>
                  {uniqueCohorts.map(cohort => (
                    <SelectItem key={cohort} value={cohort}>Cohort {cohort}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Results Summary</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-blue-800 font-semibold">{filteredTrainees.length} Trainees Found</p>
                <p className="text-blue-600 text-sm">Based on selected filters</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education & Employment Analytics */}


      {/* Premium Trainee Table */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Trainee Data Table
              </CardTitle>
              <p className="text-slate-600 text-sm mt-1">Comprehensive trainee information with advanced filtering</p>
            </div>
            <ExportModal 
              trainees={filteredTrainees}
              trigger={
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 text-slate-800">
                  <TableHead className="py-4 px-6 text-left font-semibold">Full Name</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Age</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Gender</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Education</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Employment</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Training Centre</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Cohort</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainees.map((trainee) => (
                  <TableRow key={trainee.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-4 px-6 font-medium text-slate-800">{trainee.full_name}</TableCell>
                    <TableCell className="py-4 px-6 text-slate-600">{trainee.age}</TableCell>
                    <TableCell className="py-4 px-6 text-slate-600">
                      <Badge variant={trainee.gender?.toLowerCase() === 'male' || trainee.gender?.toLowerCase() === 'm' ? 'default' : 'secondary'}>
                        {trainee.gender?.toLowerCase() === 'm' ? 'Male' : 
                         trainee.gender?.toLowerCase() === 'f' ? 'Female' : 
                         trainee.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-slate-600 capitalize">{trainee.educational_background}</TableCell>
                    <TableCell className="py-4 px-6 text-slate-600">
                      <Badge variant={trainee.employment_status?.toLowerCase() === 'employed' || trainee.employment_status?.toLowerCase() === 'emp' ? 'default' : 'secondary'}>
                        {trainee.employment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-slate-600 font-medium">{trainee.centre_name?.toUpperCase()}</TableCell>
                    <TableCell className="py-4 px-6 text-slate-600">
                      <Badge variant="outline">Cohort {trainee.cohort_number}</Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => (handleEdit ? handleEdit('trainee', trainee.id.toString()) : alert('Edit trainee ' + trainee.id))}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => (handleDelete ? handleDelete('trainee', trainee.id.toString()) : alert('Delete trainee ' + trainee.id))}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTrainees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-slate-400" />
                        <p>No trainees found for selected filters</p>
                        <p className="text-sm text-slate-400">Try adjusting your filter criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraineeAnalysis;