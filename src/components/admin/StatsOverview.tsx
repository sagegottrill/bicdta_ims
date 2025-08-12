import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

const StatsOverview: React.FC = () => {
  const { trainees } = useAppContext();

  // Gender Distribution
  const genderData = [
      { name: 'MALE', value: trainees.filter(t => t.gender === 'male').length, color: '#16a34a' },
  { name: 'FEMALE', value: trainees.filter(t => t.gender === 'female').length, color: '#4ade80' },
  ];

  // Centre Distribution
  const centreStats = trainees.reduce((acc, trainee) => {
    acc[trainee.centre_name] = (acc[trainee.centre_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const centreData = Object.entries(centreStats).map(([centre, count]) => ({
    name: centre,
    students: count,
  }));

  // Cohort Distribution
  const cohortStats = trainees.reduce((acc, trainee) => {
    acc[trainee.cohort_number] = (acc[trainee.cohort_number] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const cohortData = Object.entries(cohortStats).map(([cohort, count]) => ({
    name: `Cohort ${cohort}`,
    students: count,
  }));

  // Age Groups
  const ageGroups = [
    { name: '18-25', count: trainees.filter(t => t.age >= 18 && t.age <= 25).length },
    { name: '26-35', count: trainees.filter(t => t.age >= 26 && t.age <= 35).length },
    { name: '36-45', count: trainees.filter(t => t.age >= 36 && t.age <= 45).length },
    { name: '46+', count: trainees.filter(t => t.age >= 46).length },
  ];

  // Employment Status Distribution
  const employmentData = trainees.reduce((acc, trainee) => {
    acc[trainee.employment_status] = (acc[trainee.employment_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const employmentStats = Object.entries(employmentData).map(([status, count]) => ({
    name: status,
    count: count,
  }));

  // Educational Background Distribution
  const educationData = trainees.reduce((acc, trainee) => {
    acc[trainee.educational_background] = (acc[trainee.educational_background] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const educationStats = Object.entries(educationData).map(([background, count]) => ({
    name: background,
    count: count,
  }));

  // Recent Activity Feed (last 5 trainees)
  const recentTrainees = [...trainees].slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Distribution */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Centre Distribution */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Centre Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={centreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cohort Distribution */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Cohort Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cohortData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Age Groups */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGroups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Employment Status */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Employment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employmentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Educational Background */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Educational Background</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={educationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Trainees */}
      <Card className="shadow-lg border-0 lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Trainees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTrainees.map((trainee, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-800">{trainee.full_name}</p>
                  <p className="text-sm text-slate-600">{trainee.centre_name} - Cohort {trainee.cohort_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">{trainee.age} years old</p>
                  <p className="text-sm text-slate-600 capitalize">{trainee.gender}</p>
                </div>
              </div>
            ))}
            {recentTrainees.length === 0 && (
              <p className="text-center text-slate-500 py-8">No trainees found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;