import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, LogOut, BarChart3, Download, Megaphone, Globe, Plus } from 'lucide-react';
import TraineeForm from './forms/TraineeForm';
import ExportModal from './ExportModal';

const InstructorDashboard: React.FC = () => {
  const { currentUser, logout, trainees, loading } = useAppContext();
  const { t, language, setLanguage } = useLanguage();
  const [showTraineeForm, setShowTraineeForm] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState<string[]>([
    "Welcome to BICTDA Information Management System! All instructors are required to attend the training session on Friday.",
    "New trainees enrollment is now open for Cohort 4. Please ensure all documentation is complete.",
    "Monthly progress reports are due by the end of this week. Please submit your center's data."
  ]);
  const [selectedCentre, setSelectedCentre] = useState<string>('all');
  const [selectedCohort, setSelectedCohort] = useState<string>('all');

  // Debug logging
  console.log('🎯 InstructorDashboard - trainees count:', trainees.length);
  console.log('🎯 InstructorDashboard - loading:', loading);
  console.log('🎯 InstructorDashboard - first trainee:', trainees[0]);
  console.log('🎯 InstructorDashboard - all trainees:', trainees);
  console.log('🎯 InstructorDashboard - trainees type:', typeof trainees);
  console.log('🎯 InstructorDashboard - trainees is array:', Array.isArray(trainees));
  
  // Debug gender values
  const genderValues = [...new Set(trainees.map(t => t.gender))];
  console.log('🎯 Unique gender values in data:', genderValues);
  console.log('🎯 Sample trainees with gender:', trainees.slice(0, 5).map(t => ({ name: t.full_name, gender: t.gender })));
  console.log('🎯 Gender distribution:', {
    male: trainees.filter(t => {
      const gender = t.gender?.toLowerCase();
      return gender === 'male' || gender === 'm';
    }).length,
    female: trainees.filter(t => {
      const gender = t.gender?.toLowerCase();
      return gender === 'female' || gender === 'f';
    }).length,
    other: trainees.filter(t => {
      const gender = t.gender?.toLowerCase();
      return !(gender === 'male' || gender === 'm' || gender === 'female' || gender === 'f');
    }).length
  });
  
  // Debug employment values
  const employmentValues = [...new Set(trainees.map(t => t.employment_status))];
  console.log('🎯 Unique employment values:', employmentValues);
  
  // Debug education values
  const educationValues = [...new Set(trainees.map(t => t.educational_background))];
  console.log('🎯 Unique education values:', educationValues);

  // Analytics
  const genderStats = [
    { label: 'Male', count: trainees.filter(t => {
      const gender = t.gender?.toLowerCase();
      return gender === 'male' || gender === 'm';
    }).length },
    { label: 'Female', count: trainees.filter(t => {
      const gender = t.gender?.toLowerCase();
      return gender === 'female' || gender === 'f';
    }).length },
  ];
  
  console.log('🎯 Gender Stats Array:', genderStats);
  console.log('🎯 Gender Stats Counts:', genderStats.map(gs => `${gs.label}: ${gs.count}`));
  
  const centreStats = trainees.reduce((acc, trainee) => {
    const centreName = trainee.centre_name?.toUpperCase() || 'UNKNOWN CENTRE';
    acc[centreName] = (acc[centreName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cohortStats = trainees.reduce((acc, trainee) => {
    const cohortNum = trainee.cohort_number || 0;
    if (cohortNum > 0) { // Only count valid cohorts (1, 2, 3)
      acc[cohortNum.toString()] = (acc[cohortNum.toString()] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Filtered trainees based on selected filters
  const filteredTrainees = trainees.filter(trainee => {
    const centreMatch = selectedCentre === 'all' || trainee.centre_name?.toUpperCase() === selectedCentre;
    const cohortMatch = selectedCohort === 'all' || trainee.cohort_number.toString() === selectedCohort;
    return centreMatch && cohortMatch;
  });

  // Get unique centres and cohorts for filter dropdowns
  const uniqueCentres = [
    "IKWA DIGITAL LITERACY CENTRE",
    "GAJIRAM ICT CENTER", 
    "GUBIO DIGITAL LITERACY CENTRE",
    "KAGA DIGITAL LITERACY CENTRE",
    "MONGUNO DIGITAL LITERACY CENTRE",
    "MAFA DIGITAL LITERACY CENTRE",
    "DAMASAK DIGITAL LITERACY CENTER",
    "BAYO DIGITAL LITERACY CENTER"
  ];
  const uniqueCohorts = [...new Set(trainees.map(t => t.cohort_number?.toString() || ''))].filter(cohort => cohort && cohort !== '0').sort();

  // Attendance (simple toggle for demo)
  const [attendance, setAttendance] = useState<{ [traineeId: string]: boolean }>({});
  const markAttendance = (id: string) => setAttendance(a => ({ ...a, [id]: !a[id] }));

  // Announcements
  const handleAnnounce = () => {
    if (announcement.trim()) {
      setAnnouncements(a => [announcement, ...a]);
      setAnnouncement('');
    }
  };

  // Export filtered data (CSV)
  const exportData = () => {
    const csv = [
      ['Full Name', 'Gender', 'Age', 'Educational Background', 'Employment Status', 'Centre Name', 'Cohort Number', 'ID Number', 'Address', 'Learner Category'],
      ...filteredTrainees.map(t => [
        t.full_name, 
        t.gender, 
        t.age, 
        t.educational_background, 
        t.employment_status, 
        t.centre_name?.toUpperCase(), 
        t.cohort_number, 
        t.id_number, 
        t.address, 
        t.learner_category
      ]),
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Create filename with filter info
    let filename = 'trainees_export';
    if (selectedCentre !== 'all') filename += `_${selectedCentre.replace(/\s+/g, '_')}`;
    if (selectedCohort !== 'all') filename += `_cohort_${selectedCohort}`;
    filename += '.csv';
    
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/bictda-logo.png" 
                  alt="BICTDA Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  {t('dashboard')}
                </h1>
                <p className="text-slate-600 mt-1">Welcome, {currentUser?.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ha' | 'kr')}>
              <SelectTrigger className="w-20">
                <Globe className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="ha">HA</SelectItem>
                <SelectItem value="kr">KR</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={logout} 
              variant="outline" 
              className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">{t('trainees')}</p>
                  <p className="text-3xl font-bold">{trainees.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Centres</p>
                  <p className="text-3xl font-bold">{Object.keys(centreStats).length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Cohorts</p>
                  <p className="text-3xl font-bold">{Object.keys(cohortStats).length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements - Read Only */}
        <Card className="mb-8 border-slate-200 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-slate-800">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.length > 0 ? (
                announcements.map((a, i) => (
                  <div key={i} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-lg text-slate-800">
                    {a}
                  </div>
                ))
              ) : (
                                 <div className="text-center py-8 text-slate-500">
                   <Megaphone className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                   <p>No new announcements from admin</p>
                 </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trainee Management */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Trainees ({filteredTrainees.length})</h2>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowTraineeForm(true)} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('add')} Trainee
                </Button>
                                 <ExportModal 
                   trainees={filteredTrainees}
                   trigger={
                     <Button 
                       variant="outline" 
                       className="border-slate-300 text-slate-700 hover:bg-slate-50"
                     >
                       <Download className="w-4 h-4 mr-2" />
                       Export Data
                     </Button>
                   }
                 />
              </div>
            </div>
            
            {/* Filter Controls */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Centre:</label>
                <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Centres</SelectItem>
                    {uniqueCentres.map(centre => (
                      <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Cohort:</label>
                <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                  <SelectTrigger className="w-32">
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
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                                 <tr className="bg-gradient-to-r from-slate-50 to-blue-50 text-slate-800">
                   <th className="py-4 px-6 text-left font-semibold">Full Name</th>
                   <th className="py-4 px-6 text-left font-semibold">Gender</th>
                   <th className="py-4 px-6 text-left font-semibold">Age</th>
                   <th className="py-4 px-6 text-left font-semibold">Centre</th>
                   <th className="py-4 px-6 text-left font-semibold">Cohort</th>
                   <th className="py-4 px-6 text-left font-semibold">Employment</th>
                 </tr>
              </thead>
              <tbody>
                {filteredTrainees.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">{t.full_name}</td>
                                         <td className="py-4 px-6 text-slate-600 capitalize">
                       {t.gender?.toLowerCase() === 'm' ? 'Male' : 
                        t.gender?.toLowerCase() === 'f' ? 'Female' : 
                        t.gender}
                     </td>
                    <td className="py-4 px-6 text-slate-600">{t.age}</td>
                                         <td className="py-4 px-6 text-slate-600">{t.centre_name?.toUpperCase()}</td>
                     <td className="py-4 px-6 text-slate-600">{t.cohort_number}</td>
                                          <td className="py-4 px-6 text-slate-600 capitalize">{t.employment_status}</td>
                  </tr>
                ))}
                                 {filteredTrainees.length === 0 && (
                   <tr>
                     <td colSpan={6} className="text-center py-12 text-slate-500">
                       No trainees found for selected filters.
                     </td>
                   </tr>
                 )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trainee Form Modal */}
        {showTraineeForm && <TraineeForm onClose={() => setShowTraineeForm(false)} availableCentres={uniqueCentres} />}

        {/* Centre Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Centre Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(centreStats).map(([centre, count]) => (
              <Card key={centre} className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-slate-800">{centre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{count} Trainees</div>
                </CardContent>
              </Card>
            ))}
            {Object.keys(centreStats).length === 0 && (
              <div className="text-slate-500 col-span-full text-center py-8">
                No centres found.
              </div>
            )}
          </div>
        </div>

        {/* Gender Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Gender Distribution</h2>
          <div className="flex gap-6">
            {genderStats.map(gs => (
              <div key={gs.label} className="flex flex-col items-center bg-white border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 w-40">
                <span className="text-lg font-semibold text-slate-800 mb-2">{gs.label}</span>
                <span className="text-3xl font-bold text-blue-600">{gs.count}</span>
              </div>
            ))}
            {genderStats.length === 0 && (
              <div className="text-slate-500 col-span-full text-center py-8">
                No gender data available. Debug: {JSON.stringify(genderStats)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;