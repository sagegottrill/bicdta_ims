import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

const StatsOverview: React.FC = () => {
  const { trainees, courses, trainers, centres } = useAppContext();

  // Gender Distribution
  const genderData = [
    { name: 'Male', value: trainees.filter(t => t.gender === 'male').length, color: '#16a34a' },
    { name: 'Female', value: trainees.filter(t => t.gender === 'female').length, color: '#4ade80' },
  ];

  // Course Popularity
  const courseData = courses.map(course => ({
    name: course.title,
    students: trainees.filter(t => t.course === course.id).length,
  }));

  // Age Groups
  const ageGroups = [
    { name: '18-25', count: trainees.filter(t => t.age >= 18 && t.age <= 25).length },
    { name: '26-35', count: trainees.filter(t => t.age >= 26 && t.age <= 35).length },
    { name: '36-45', count: trainees.filter(t => t.age >= 36 && t.age <= 45).length },
    { name: '46+', count: trainees.filter(t => t.age >= 46).length },
  ];

  // Trainee Growth Over Time (by enrollmentDate)
  const growthMap: { [date: string]: number } = {};
  trainees.forEach(t => {
    if (t.enrollmentDate) {
      growthMap[t.enrollmentDate] = (growthMap[t.enrollmentDate] || 0) + 1;
    }
  });
  const growthData = Object.entries(growthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count], i, arr) => ({
      date,
      total: arr.slice(0, i + 1).reduce((sum, [_, c]) => sum + Number(c), 0),
    }));

  // Trainer Activity (trainees per trainer)
  const trainerActivity = trainers.map(tr => ({
    name: tr.name,
    trainees: trainees.filter(t => t.assignedCentre === tr.assignedCentre).length,
  }));

  // Centre Utilization Trend (average utilization per centre)
  const centreUtilTrend = centres.map(centre => ({
    name: centre.name,
    utilization: centre.capacity > 0 ? Math.round((trainees.filter(t => t.assignedCentre === centre.id).length / centre.capacity) * 100) : 0,
  }));

  // Course Completion Rates (simulate with random for demo)
  const completionData = courses.map(course => ({
    name: course.title,
    completed: Math.floor(Math.random() * 100),
  }));

  // Recent Activity Feed (last 5 trainees)
  const recentTrainees = [...trainees].sort((a, b) => b.enrollmentDate.localeCompare(a.enrollmentDate)).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trainee Growth Over Time */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Trainee Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trainer Activity */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Trainer Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trainerActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trainees" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Centre Utilization Trend */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Centre Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={centreUtilTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="utilization" stroke="#4ade80" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Course Completion Rates */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Course Completion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="completed"
                nameKey="name"
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#16a34a' : '#4ade80'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
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

      {/* Course Popularity */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Course Popularity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Age Distribution */}
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
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Age:</span>
              <span className="font-semibold">
                {trainees.length > 0 ? Math.round(trainees.reduce((sum, t) => sum + t.age, 0) / trainees.length) : 0} years
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Most Popular Course:</span>
              <span className="font-semibold">
                {courseData.length > 0 ? courseData.reduce((a, b) => a.students > b.students ? a : b).name : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Employment Rate:</span>
              <span className="font-semibold">
                {trainees.length > 0 ? Math.round((trainees.filter(t => t.employment === 'employed').length / trainees.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card className="shadow-lg border-0 lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-green-100">
            {recentTrainees.map(t => (
              <li key={t.id} className="py-2 flex justify-between items-center">
                <span className="text-green-800 font-medium">{t.name}</span>
                <span className="text-green-600 text-sm">Enrolled: {t.enrollmentDate}</span>
              </li>
            ))}
            {recentTrainees.length === 0 && <li className="py-4 text-gray-500">No recent activity.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;