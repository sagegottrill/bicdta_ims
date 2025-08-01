import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { TrendingUp, TrendingDown, Users, Target, AlertTriangle, CheckCircle } from 'lucide-react';

const PredictiveAnalytics: React.FC = () => {
  const { trainees } = useAppContext();

  // Calculate predictive insights
  const totalTrainees = trainees.length;
  const maleCount = trainees.filter(t => {
    const gender = t.gender?.toLowerCase();
    return gender === 'male' || gender === 'm';
  }).length;
  const femaleCount = trainees.filter(t => {
    const gender = t.gender?.toLowerCase();
    return gender === 'female' || gender === 'f';
  }).length;
  
  // Employment analysis
  const employedCount = trainees.filter(t => {
    const status = t.employment_status?.toLowerCase();
    return status === 'employed' || status === 'emp';
  }).length;
  const unemployedCount = trainees.filter(t => {
    const status = t.employment_status?.toLowerCase();
    return status === 'unemployed' || status === 'unemp';
  }).length;
  
  // Education analysis
  const primaryCount = trainees.filter(t => t.educational_background?.toLowerCase().includes('primary')).length;
  const secondaryCount = trainees.filter(t => t.educational_background?.toLowerCase().includes('secondary') || t.educational_background?.toLowerCase().includes('ssce')).length;
  const tertiaryCount = trainees.filter(t => t.educational_background?.toLowerCase().includes('tertiary') || t.educational_background?.toLowerCase().includes('ond') || t.educational_background?.toLowerCase().includes('bsc')).length;
  const nilCount = trainees.filter(t => t.educational_background?.toLowerCase() === 'nil').length;
  
  // Age analysis
  const avgAge = trainees.reduce((sum, t) => sum + (t.age || 0), 0) / totalTrainees;
  const youngTrainees = trainees.filter(t => (t.age || 0) < 25).length;
  const middleTrainees = trainees.filter(t => (t.age || 0) >= 25 && (t.age || 0) < 40).length;
  const olderTrainees = trainees.filter(t => (t.age || 0) >= 40).length;
  
  // Centre analysis
  const centreStats = trainees.reduce((acc, trainee) => {
    acc[trainee.centre_name] = (acc[trainee.centre_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCentres = Object.entries(centreStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  // Cohort analysis
  const cohortStats = trainees.reduce((acc, trainee) => {
    acc[trainee.cohort_number] = (acc[trainee.cohort_number] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const topCohorts = Object.entries(cohortStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Predictive insights
  const employmentRate = (employedCount / totalTrainees) * 100;
  const genderBalance = Math.abs(maleCount - femaleCount) / totalTrainees * 100;
  const educationGap = (nilCount / totalTrainees) * 100;
  const youthEngagement = (youngTrainees / totalTrainees) * 100;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Trainees</p>
                <p className="text-3xl font-bold">{totalTrainees.toLocaleString()}</p>
                <p className="text-blue-100 text-xs">Active in system</p>
              </div>
              <Users className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Employment Rate</p>
                <p className="text-3xl font-bold">{employmentRate.toFixed(1)}%</p>
                <p className="text-green-100 text-xs">{employedCount} employed</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Youth Engagement</p>
                <p className="text-3xl font-bold">{youthEngagement.toFixed(1)}%</p>
                <p className="text-purple-100 text-xs">Under 25 years</p>
              </div>
              <Target className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Education Gap</p>
                <p className="text-3xl font-bold">{educationGap.toFixed(1)}%</p>
                <p className="text-orange-100 text-xs">Need support</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Growth Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-green-800">Employment Success</p>
                <p className="text-sm text-green-600">Based on current trends</p>
              </div>
              <Badge className="bg-green-100 text-green-800">+{employmentRate.toFixed(1)}%</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-blue-800">Youth Development</p>
                <p className="text-sm text-blue-600">Young trainee engagement</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">+{youthEngagement.toFixed(1)}%</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-semibold text-purple-800">Gender Balance</p>
                <p className="text-sm text-purple-600">Diversity improvement</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">{genderBalance.toFixed(1)}% gap</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-semibold text-orange-800">Education Support</p>
                <p className="text-sm text-orange-600">{nilCount} trainees need help</p>
              </div>
              <Badge className="bg-orange-100 text-orange-800">{educationGap.toFixed(1)}%</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-semibold text-red-800">Unemployment</p>
                <p className="text-sm text-red-600">{unemployedCount} need jobs</p>
              </div>
              <Badge className="bg-red-100 text-red-800">{((unemployedCount/totalTrainees)*100).toFixed(1)}%</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-800">Age Distribution</p>
                <p className="text-sm text-yellow-600">Balance needed</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">{avgAge.toFixed(1)} avg</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Centres */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Top Performing Centres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCentres.map(([centre, count], index) => (
              <div key={centre} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">{centre}</h3>
                  <Badge className="bg-green-100 text-green-800">#{index + 1}</Badge>
                </div>
                <p className="text-2xl font-bold text-green-600">{count}</p>
                <p className="text-sm text-slate-600">Trainees</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Employment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Employed</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${(employedCount/totalTrainees)*100}%`}}></div>
                  </div>
                  <span className="font-semibold">{employedCount}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Unemployed</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: `${(unemployedCount/totalTrainees)*100}%`}}></div>
                  </div>
                  <span className="font-semibold">{unemployedCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Education Background</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Primary</span>
                <Badge className="bg-blue-100 text-blue-800">{primaryCount}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Secondary</span>
                <Badge className="bg-green-100 text-green-800">{secondaryCount}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Tertiary</span>
                <Badge className="bg-purple-100 text-purple-800">{tertiaryCount}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">No Education</span>
                <Badge className="bg-orange-100 text-orange-800">{nilCount}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalytics; 