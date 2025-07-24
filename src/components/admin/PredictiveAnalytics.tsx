import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { predictiveAnalyticsService, PredictiveMetrics } from '@/services/PredictiveAnalytics';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Users,
  Monitor,
  Target,
  Download,
  RefreshCw,
  Globe,
  Brain,
  Sparkles
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PredictiveAnalytics: React.FC = () => {
  const { trainees, centres, courses } = useAppContext();
  const { t, language, setLanguage } = useLanguage();
  const [metrics, setMetrics] = useState<PredictiveMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('6');

  useEffect(() => {
    calculateMetrics();
  }, [trainees, centres, courses, timeframe]);

  const calculateMetrics = () => {
    setLoading(true);
    
    const enrollmentForecast = predictiveAnalyticsService.calculateEnrollmentForecast(
      trainees, 
      centres, 
      courses, 
      parseInt(timeframe)
    );
    
    const dropoutRisks = predictiveAnalyticsService.calculateDropoutRisk(trainees);
    
    const resourceDemand = predictiveAnalyticsService.calculateResourceDemand(
      trainees, 
      centres, 
      parseInt(timeframe)
    );
    
    const performanceOptimization = predictiveAnalyticsService.calculatePerformanceOptimization(
      trainees, 
      centres, 
      courses
    );

    setMetrics({
      enrollmentForecast,
      dropoutRisks,
      resourceDemand,
      performanceOptimization
    });
    
    setLoading(false);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very_high': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'no_risk': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-slate-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-slate-600 font-medium">Loading predictive analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            {t('predictive_analytics')}
          </h1>
          <p className="text-slate-600 mt-2">AI-powered insights for better decision making</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ha' | 'kr')}>
            <SelectTrigger className="w-20 border-slate-300">
              <Globe className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="ha">HA</SelectItem>
              <SelectItem value="kr">KR</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={calculateMetrics} 
            variant="outline" 
            size="sm"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('refresh')}
          </Button>
        </div>
      </div>

      {metrics && (
        <>
          {/* Enrollment Forecast */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">
                    {t('enrollment_forecast')}
                  </CardTitle>
                </div>
                <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
                  <Download className="w-4 h-4 mr-2" />
                  {t('export')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics.enrollmentForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="period" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predictedEnrollment" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Predicted Enrollment"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 text-lg">Forecast Summary</h3>
                  {metrics.enrollmentForecast.map((forecast, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-medium text-slate-800">{forecast.period}</p>
                        <p className="text-sm text-slate-600">
                          {forecast.predictedEnrollment} students
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getTrendIcon(forecast.trend)}
                        <Badge variant="outline" className="border-slate-300 text-slate-700">
                          {(forecast.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dropout Risk Assessment */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  {t('dropout_risk')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics.dropoutRisks.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="traineeName" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="riskScore" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 text-lg">High Risk Trainees</h3>
                  {metrics.dropoutRisks
                    .filter(risk => risk.riskLevel === 'very_high' || risk.riskLevel === 'high')
                    .slice(0, 5)
                    .map((risk) => (
                      <div key={risk.traineeId} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium text-slate-800">{risk.traineeName}</p>
                          <Badge className={getRiskColor(risk.riskLevel)}>
                            {t(risk.riskLevel + '_risk')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          Risk Score: {risk.riskScore}/100
                        </p>
                        <div className="text-xs text-slate-500">
                          <p className="font-medium mb-2">Risk Factors:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {risk.riskFactors.slice(0, 2).map((factor, index) => (
                              <li key={index}>{factor}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Demand Prediction */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  {t('resource_demand')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics.resourceDemand}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="resourceType" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="currentDemand" fill="#3b82f6" name="Current Demand" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="predictedDemand" fill="#10b981" name="Predicted Demand" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 text-lg">Resource Recommendations</h3>
                  {metrics.resourceDemand.map((resource, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-slate-800">{t(resource.resourceType)}</p>
                        <Badge variant="outline" className="border-slate-300 text-slate-700">
                          {(resource.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        <p>Current: {resource.currentDemand} units</p>
                        <p>Predicted: {resource.predictedDemand} units</p>
                      </div>
                      <div className="text-xs text-slate-500">
                        <p className="font-medium mb-2">Recommendations:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {resource.recommendations.slice(0, 2).map((rec, recIndex) => (
                            <li key={recIndex}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Optimization */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  {t('performance_optimization')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics.performanceOptimization}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="metric" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="currentValue" fill="#f59e0b" name="Current" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="targetValue" fill="#10b981" name="Target" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 text-lg">Optimization Priorities</h3>
                  {metrics.performanceOptimization.map((optimization, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-slate-800">{optimization.metric.replace('_', ' ')}</p>
                        <Badge className={getPriorityColor(optimization.priority)}>
                          {t(optimization.priority)} priority
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        <p>Current: {optimization.currentValue}%</p>
                        <p>Target: {optimization.targetValue}%</p>
                        <p>Improvement needed: {optimization.improvement}%</p>
                      </div>
                      <div className="text-xs text-slate-500">
                        <p className="font-medium mb-2">Recommendations:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {optimization.recommendations.slice(0, 2).map((rec, recIndex) => (
                            <li key={recIndex}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PredictiveAnalytics; 