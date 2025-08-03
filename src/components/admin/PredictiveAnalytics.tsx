import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { TrendingUp, TrendingDown, Users, Target, AlertTriangle, CheckCircle, Brain, BarChart3, Activity, Award, Globe, Clock, PieChart, Zap, Lightbulb, Rocket } from 'lucide-react';

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
  const avgAge = totalTrainees > 0 ? trainees.reduce((sum, t) => sum + (t.age || 0), 0) / totalTrainees : 0;
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
  const employmentRate = totalTrainees > 0 ? (employedCount / totalTrainees) * 100 : 0;
  const genderBalance = totalTrainees > 0 ? Math.abs(maleCount - femaleCount) / totalTrainees * 100 : 0;
  const educationGap = totalTrainees > 0 ? (nilCount / totalTrainees) * 100 : 0;
  const youthEngagement = totalTrainees > 0 ? (youngTrainees / totalTrainees) * 100 : 0;

    return (
    <div className="space-y-8">
      {/* Premium Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Predictive Analytics Console</h2>
            <p className="text-purple-100 text-lg">Advanced insights and future trend analysis</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Premium Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Total Trainees</p>
                <p className="text-4xl font-bold">{totalTrainees.toLocaleString()}</p>
                <p className="text-purple-100 text-xs mt-2">Active in system</p>
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
                <p className="text-emerald-100 text-sm font-medium mb-1">Employment Rate</p>
                <p className="text-4xl font-bold">{employmentRate.toFixed(1)}%</p>
                <p className="text-emerald-100 text-xs mt-2">{employedCount} employed</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Youth Engagement</p>
                <p className="text-4xl font-bold">{youthEngagement.toFixed(1)}%</p>
                <p className="text-blue-100 text-xs mt-2">{youngTrainees} under 25</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
        <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Education Gap</p>
                <p className="text-4xl font-bold">{educationGap.toFixed(1)}%</p>
                <p className="text-orange-100 text-xs mt-2">No formal education</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              Key Predictive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Gender Balance</span>
                  </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{genderBalance.toFixed(1)}%</p>
                  <p className="text-sm text-slate-500">difference</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Employment Success</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">{employmentRate.toFixed(1)}%</p>
                  <p className="text-sm text-slate-500">employed</p>
                </div>
                      </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200/50">
                      <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Youth Engagement</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{youthEngagement.toFixed(1)}%</p>
                  <p className="text-sm text-slate-500">under 25</p>
                      </div>
                    </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Education Gap</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{educationGap.toFixed(1)}%</p>
                  <p className="text-sm text-slate-500">no education</p>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>

        <Card className="border-0 shadow-xl">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Age Distribution Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200/50">
              <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Youth (Under 25)</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{youngTrainees}</p>
                  <p className="text-sm text-slate-500">
                    {totalTrainees > 0 ? ((youngTrainees / totalTrainees) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Adults (25-40)</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">{middleTrainees}</p>
                  <p className="text-sm text-slate-500">
                    {totalTrainees > 0 ? ((middleTrainees / totalTrainees) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Seniors (40+)</span>
                        </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{olderTrainees}</p>
                  <p className="text-sm text-slate-500">
                    {totalTrainees > 0 ? ((olderTrainees / totalTrainees) * 100).toFixed(1) : 0}% of total
                  </p>
                        </div>
                      </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Average Age</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{avgAge.toFixed(1)}</p>
                  <p className="text-sm text-slate-500">years</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Centres & Cohorts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Award className="w-5 h-5 text-emerald-600" />
              Top Performing Centres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCentres.map(([centre, count], index) => (
                <div key={centre} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-slate-800">{centre?.toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">{count}</p>
                    <p className="text-sm text-slate-500">trainees</p>
                  </div>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>

        <Card className="border-0 shadow-xl">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="w-5 h-5 text-blue-600" />
              Top Performing Cohorts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCohorts.map(([cohort, count], index) => (
                <div key={cohort} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200/50">
              <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-slate-800">Cohort {cohort}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                    <p className="text-sm text-slate-500">trainees</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Education & Employment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Globe className="w-5 h-5 text-purple-600" />
              Education Level Analysis
                </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Primary Education</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{primaryCount}</p>
                  <p className="text-sm text-slate-500">
                    {totalTrainees > 0 ? ((primaryCount / totalTrainees) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Secondary Education</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{secondaryCount}</p>
                  <p className="text-sm text-slate-500">
                    {totalTrainees > 0 ? ((secondaryCount / totalTrainees) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
                      </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Tertiary Education</span>
                      </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">{tertiaryCount}</p>
                  <p className="text-sm text-slate-500">
                    {totalTrainees > 0 ? ((tertiaryCount / totalTrainees) * 100).toFixed(1) : 0}% of total
                  </p>
                      </div>
                    </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">No Formal Education</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{nilCount}</p>
                  <p className="text-sm text-slate-500">
                    {totalTrainees > 0 ? ((nilCount / totalTrainees) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>

        <Card className="border-0 shadow-xl">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Zap className="w-5 h-5 text-emerald-600" />
              Employment Status Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200/50">
              <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Employed</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">{employedCount}</p>
                  <p className="text-sm text-slate-500">
                    {totalTrainees > 0 ? ((employedCount / totalTrainees) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Unemployed</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{unemployedCount}</p>
                  <p className="text-sm text-slate-500">
                    {totalTrainees > 0 ? ((unemployedCount / totalTrainees) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
                      </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Employment Rate</span>
                      </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{employmentRate.toFixed(1)}%</p>
                  <p className="text-sm text-slate-500">success rate</p>
                      </div>
                    </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Gender Distribution</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{maleCount + femaleCount}</p>
                  <p className="text-sm text-slate-500">Male: {maleCount} | Female: {femaleCount}</p>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalytics; 