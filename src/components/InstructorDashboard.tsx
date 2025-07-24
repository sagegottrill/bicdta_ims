import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, BookOpen, LogOut, BarChart3, Download, Megaphone, Globe, Plus } from 'lucide-react';
import TraineeForm from './forms/TraineeForm';

const InstructorDashboard: React.FC = () => {
  const { currentUser, logout, trainees, centres, courses } = useAppContext();
  const { t, language, setLanguage } = useLanguage();
  const [showTraineeForm, setShowTraineeForm] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Filter trainees for instructor's centre (assuming instructor name matches centre coordinator)
  const myCentre = centres.find(c => c.coordinator === currentUser?.name);
  const myTrainees = trainees.filter(t => t.assignedCentre === myCentre?.id);
  const myCourses = courses.filter(c => myTrainees.some(t => t.course === c.id));

  // Analytics
  const genderStats = [
    { label: 'Male', count: myTrainees.filter(t => t.gender === 'male').length },
    { label: 'Female', count: myTrainees.filter(t => t.gender === 'female').length },
  ];
  const courseStats = myCourses.map(course => ({
    title: course.title,
    count: myTrainees.filter(t => t.course === course.id).length,
  }));
  const centreUtilization = myCentre ? Math.round((myTrainees.length / myCentre.capacity) * 100) : 0;

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

  // Downloadable report (CSV)
  const downloadCSV = () => {
    const csv = [
      ['Name', 'Email', 'Age', 'Gender', 'Education', 'Employment', 'Course'],
      ...myTrainees.map(t => [t.name, t.email, t.age, t.gender, t.education, t.employment, courses.find(c => c.id === t.course)?.title || '']),
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trainees_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
                <p className="text-slate-600 mt-1">Welcome, {currentUser?.name} ({myCentre?.name || 'No Centre Assigned'})</p>
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
                  <p className="text-3xl font-bold">{myTrainees.length}</p>
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
                  <p className="text-indigo-100 text-sm font-medium">{t('courses')}</p>
                  <p className="text-3xl font-bold">{myCourses.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Utilization</p>
                  <p className="text-3xl font-bold">{centreUtilization}%</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <Card className="mb-8 border-slate-200 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-slate-800">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                placeholder="Type announcement..."
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button 
                onClick={handleAnnounce} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
              >
                Send
              </Button>
            </div>
            <div className="space-y-3">
              {announcements.map((a, i) => (
                <div key={i} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-lg text-slate-800">
                  {a}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trainee Management */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">My Trainees</h2>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowTraineeForm(true)} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('add')} Trainee
                </Button>
                <Button 
                  onClick={downloadCSV} 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-blue-50 text-slate-800">
                  <th className="py-4 px-6 text-left font-semibold">Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Email</th>
                  <th className="py-4 px-6 text-left font-semibold">Age</th>
                  <th className="py-4 px-6 text-left font-semibold">Gender</th>
                  <th className="py-4 px-6 text-left font-semibold">Course</th>
                  <th className="py-4 px-6 text-left font-semibold">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {myTrainees.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">{t.name}</td>
                    <td className="py-4 px-6 text-slate-600">{t.email}</td>
                    <td className="py-4 px-6 text-slate-600">{t.age}</td>
                    <td className="py-4 px-6 text-slate-600 capitalize">{t.gender}</td>
                    <td className="py-4 px-6 text-slate-600">{courses.find(c => c.id === t.course)?.title || ''}</td>
                    <td className="py-4 px-6">
                      <Button 
                        size="sm" 
                        variant={attendance[t.id] ? 'default' : 'outline'} 
                        className={attendance[t.id] 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        } 
                        onClick={() => markAttendance(t.id)}
                      >
                        {attendance[t.id] ? 'Present' : 'Mark Present'}
                      </Button>
                    </td>
                  </tr>
                ))}
                {myTrainees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No trainees assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trainee Form Modal */}
        {showTraineeForm && <TraineeForm onClose={() => setShowTraineeForm(false)} />}

        {/* Course Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Course Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseStats.map(cs => (
              <Card key={cs.title} className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-slate-800">{cs.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{cs.count} Trainees</div>
                </CardContent>
              </Card>
            ))}
            {courseStats.length === 0 && (
              <div className="text-slate-500 col-span-full text-center py-8">
                No courses assigned yet.
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
                <span className="text-lg font-semibold text-slate-800 mb-2">{t(gs.label.toLowerCase())}</span>
                <span className="text-3xl font-bold text-blue-600">{gs.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;