import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { Edit, Trash2, Building, Users, TrendingUp, Target, Activity, MapPin, BarChart3, Award, CheckCircle, AlertTriangle, Globe, Clock, PieChart, Zap, Lightbulb, Rocket, Star, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';

const CentreAnalysis: React.FC<{ handleEdit?: (type: string, id: string) => void, handleDelete?: (type: string, id: string) => void }> = ({ handleEdit, handleDelete }) => {
  const { trainees } = useAppContext();

  // Calculate centre statistics from trainees data
  const centreStats = trainees.reduce((acc, trainee) => {
    if (!acc[trainee.centre_name]) {
      acc[trainee.centre_name] = {
        name: trainee.centre_name,
        trainees: 0,
        maleCount: 0,
        femaleCount: 0,
        avgAge: 0,
        ageSum: 0,
        cohorts: new Set(),
        employedCount: 0,
        unemployedCount: 0,
        primaryCount: 0,
        secondaryCount: 0,
        tertiaryCount: 0,
        nilCount: 0
      };
    }
    
    acc[trainee.centre_name].trainees++;
    acc[trainee.centre_name].ageSum += trainee.age;
    acc[trainee.centre_name].cohorts.add(trainee.cohort_number);
    
    if (trainee.gender?.toLowerCase() === 'male' || trainee.gender?.toLowerCase() === 'm') {
      acc[trainee.centre_name].maleCount++;
    } else if (trainee.gender?.toLowerCase() === 'female' || trainee.gender?.toLowerCase() === 'f') {
      acc[trainee.centre_name].femaleCount++;
    }

    // Employment stats
    if (trainee.employment_status?.toLowerCase() === 'employed' || trainee.employment_status?.toLowerCase() === 'emp') {
      acc[trainee.centre_name].employedCount++;
    } else if (trainee.employment_status?.toLowerCase() === 'unemployed' || trainee.employment_status?.toLowerCase() === 'unemp') {
      acc[trainee.centre_name].unemployedCount++;
    }

    // Education stats
    if (trainee.educational_background?.toLowerCase().includes('primary')) {
      acc[trainee.centre_name].primaryCount++;
    } else if (trainee.educational_background?.toLowerCase().includes('secondary') || trainee.educational_background?.toLowerCase().includes('ssce')) {
      acc[trainee.centre_name].secondaryCount++;
    } else if (trainee.educational_background?.toLowerCase().includes('tertiary') || trainee.educational_background?.toLowerCase().includes('ond') || trainee.educational_background?.toLowerCase().includes('bsc')) {
      acc[trainee.centre_name].tertiaryCount++;
    } else if (trainee.educational_background?.toLowerCase() === 'nil' || trainee.educational_background?.toLowerCase() === 'none') {
      acc[trainee.centre_name].nilCount++;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages and convert to array
  const centres = Object.values(centreStats).map(centre => ({
    ...centre,
    avgAge: Math.round(centre.ageSum / centre.trainees),
    cohortCount: centre.cohorts.size,
    employmentRate: centre.trainees > 0 ? (centre.employedCount / centre.trainees) * 100 : 0,
    educationRate: centre.trainees > 0 ? ((centre.primaryCount + centre.secondaryCount + centre.tertiaryCount) / centre.trainees) * 100 : 0
  }));

  // Analytics calculations
  const totalCentres = centres.length;
  const totalTrainees = centres.reduce((sum, centre) => sum + centre.trainees, 0);
  const avgTraineesPerCentre = totalCentres > 0 ? Math.round(totalTrainees / totalCentres) : 0;
  const highUtilizationCentres = centres.filter(centre => centre.trainees > 50).length;
  const avgEmploymentRate = totalTrainees > 0 ? centres.reduce((sum, centre) => sum + centre.employedCount, 0) / totalTrainees * 100 : 0;
  const avgEducationRate = totalTrainees > 0 ? centres.reduce((sum, centre) => sum + centre.primaryCount + centre.secondaryCount + centre.tertiaryCount, 0) / totalTrainees * 100 : 0;

  const getUtilizationColor = (traineeCount: number) => {
    if (traineeCount > 50) return 'bg-red-100 text-red-800 border-red-200';
    if (traineeCount > 30) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getUtilizationIcon = (traineeCount: number) => {
    if (traineeCount > 50) return <AlertTriangle className="w-4 h-4" />;
    if (traineeCount > 30) return <Activity className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getPerformanceTrend = (centre: any) => {
    const rate = centre.employmentRate;
    if (rate > 70) return { icon: <ArrowUp className="w-4 h-4" />, color: 'text-green-600', text: 'Excellent' };
    if (rate > 50) return { icon: <TrendingUp className="w-4 h-4" />, color: 'text-blue-600', text: 'Good' };
    return { icon: <TrendingDown className="w-4 h-4" />, color: 'text-orange-600', text: 'Needs Improvement' };
  };

  return (
    <div className="space-y-8">
      {/* Premium Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Centre Performance Console</h2>
            <p className="text-emerald-100 text-lg">Comprehensive training centre analysis and management</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Building className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Premium Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Total Centres</p>
                <p className="text-4xl font-bold">{totalCentres}</p>
                <p className="text-emerald-100 text-xs mt-2">Operational locations</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Trainees</p>
                <p className="text-4xl font-bold">{totalTrainees.toLocaleString()}</p>
                <p className="text-blue-100 text-xs mt-2">Across all centres</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Avg Employment Rate</p>
                <p className="text-4xl font-bold">{avgEmploymentRate.toFixed(1)}%</p>
                <p className="text-purple-100 text-xs mt-2">Across all centres</p>
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
                <p className="text-orange-100 text-sm font-medium mb-1">High Utilization</p>
                <p className="text-4xl font-bold">{highUtilizationCentres}</p>
                <p className="text-orange-100 text-xs mt-2">Centres with 50+ trainees</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Centre Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Globe className="w-5 h-5 text-emerald-600" />
              Centre Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Average Trainees/Centre</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">{avgTraineesPerCentre}</p>
                  <p className="text-sm text-slate-500">trainees</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Average Employment Rate</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{avgEmploymentRate.toFixed(1)}%</p>
                  <p className="text-sm text-slate-500">employed</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Average Education Rate</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{avgEducationRate.toFixed(1)}%</p>
                  <p className="text-sm text-slate-500">educated</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="w-5 h-5 text-blue-600" />
              Utilization Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-green-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Low Utilization</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {centres.filter(c => c.trainees <= 30).length}
                  </p>
                  <p className="text-sm text-slate-500">centres</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-yellow-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Medium Utilization</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">
                    {centres.filter(c => c.trainees > 30 && c.trainees <= 50).length}
                  </p>
                  <p className="text-sm text-slate-500">centres</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-red-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">High Utilization</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">
                    {centres.filter(c => c.trainees > 50).length}
                  </p>
                  <p className="text-sm text-slate-500">centres</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Award className="w-5 h-5 text-purple-600" />
              Top Performing Centres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {centres
                .sort((a, b) => b.trainees - a.trainees)
                .slice(0, 3)
                .map((centre, index) => (
                  <div key={centre.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-slate-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-800">{centre.name?.toUpperCase()}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{centre.trainees}</p>
                      <p className="text-sm text-slate-500">trainees</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Centre Performance Overview */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-emerald-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Centre Performance Overview
              </CardTitle>
              <p className="text-slate-600 text-sm mt-1">Detailed analysis of all training centres with performance metrics</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-emerald-50 text-slate-800">
                  <TableHead className="py-4 px-6 text-left font-semibold">Centre Name</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Total Trainees</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Gender Distribution</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Avg Age</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Active Cohorts</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Employment Rate</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Utilization</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Performance</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centres.map((centre, index) => {
                  const utilization = centre.trainees > 50 ? 'High' : centre.trainees > 30 ? 'Medium' : 'Low';
                  const performance = getPerformanceTrend(centre);
                  return (
                    <TableRow key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4 px-6 font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          {centre.name?.toUpperCase()}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-slate-600">
                        <div className="text-2xl font-bold text-emerald-600">{centre.trainees}</div>
                        <div className="text-sm text-slate-500">trainees</div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {centre.maleCount} Male
                          </Badge>
                          <Badge variant="outline" className="text-pink-600 border-pink-200">
                            {centre.femaleCount} Female
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-slate-600">
                        <div className="text-xl font-semibold text-slate-800">{centre.avgAge}</div>
                        <div className="text-sm text-slate-500">years</div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-slate-600">
                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                          {centre.cohortCount} Cohorts
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-slate-600">
                        <div className="text-xl font-semibold text-emerald-600">{centre.employmentRate.toFixed(1)}%</div>
                        <div className="text-sm text-slate-500">employed</div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-slate-600">
                        <Badge className={getUtilizationColor(centre.trainees)}>
                          <div className="flex items-center gap-1">
                            {getUtilizationIcon(centre.trainees)}
                            {utilization}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-slate-600">
                        <div className="flex items-center gap-2">
                          <div className={performance.color}>
                            {performance.icon}
                          </div>
                          <span className="text-sm font-medium">{performance.text}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => (handleEdit ? handleEdit('centre', centre.name) : alert('Edit centre ' + centre.name))}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => (handleDelete ? handleDelete('centre', centre.name) : alert('Delete centre ' + centre.name))}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {centres.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Building className="w-8 h-8 text-slate-400" />
                        <p>No centres found</p>
                        <p className="text-sm text-slate-400">No training centre data available</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Centre Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Lightbulb className="w-5 h-5 text-emerald-600" />
              Centre Education Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {centres.slice(0, 5).map((centre) => (
                <div key={centre.name} className="p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-800">{centre.name?.toUpperCase()}</span>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                      {centre.educationRate.toFixed(1)}% Educated
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{centre.primaryCount}</div>
                      <div className="text-slate-500">Primary</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">{centre.secondaryCount}</div>
                      <div className="text-slate-500">Secondary</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-emerald-600">{centre.tertiaryCount}</div>
                      <div className="text-slate-500">Tertiary</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Zap className="w-5 h-5 text-blue-600" />
              Centre Employment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {centres.slice(0, 5).map((centre) => (
                <div key={centre.name} className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-800">{centre.name?.toUpperCase()}</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {centre.employmentRate.toFixed(1)}% Employed
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-emerald-600">{centre.employedCount}</div>
                      <div className="text-slate-500">Employed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">{centre.unemployedCount}</div>
                      <div className="text-slate-500">Unemployed</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CentreAnalysis;