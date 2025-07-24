import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppContext } from '@/contexts/AppContext';
import { Edit, Trash2 } from 'lucide-react';

const TraineeAnalysis: React.FC<{ handleEdit?: (type: string, id: string) => void, handleDelete?: (type: string, id: string) => void }> = ({ handleEdit, handleDelete }) => {
  const { trainees, centres, courses } = useAppContext();

  const getCentreName = (centreId: string) => {
    const centre = centres.find(c => c.id === centreId);
    return centre ? centre.name : 'N/A';
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'N/A';
  };

  const educationStats = [
    { level: 'Primary', count: trainees.filter(t => t.education === 'primary').length },
    { level: 'Secondary', count: trainees.filter(t => t.education === 'secondary').length },
    { level: 'Tertiary', count: trainees.filter(t => t.education === 'tertiary').length },
    { level: 'None', count: trainees.filter(t => t.education === 'none').length },
  ];

  const employmentStats = [
    { status: 'Employed', count: trainees.filter(t => t.employment === 'employed').length },
    { status: 'Unemployed', count: trainees.filter(t => t.employment === 'unemployed').length },
    { status: 'Student', count: trainees.filter(t => t.employment === 'student').length },
    { status: 'Self-employed', count: trainees.filter(t => t.employment === 'self-employed').length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Education Background</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {educationStats.map((stat) => (
              <div key={stat.level} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{stat.level}</span>
                <span className="text-2xl font-bold text-green-600">{stat.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Employment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employmentStats.map((stat) => (
              <div key={stat.status} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{stat.status}</span>
                <span className="text-2xl font-bold text-green-600">{stat.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-lg border-0">
        <CardHeader>
          <CardTitle>All Trainees</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainees.map((trainee) => (
                <TableRow key={trainee.id}>
                  <TableCell className="font-medium">{trainee.name}</TableCell>
                  <TableCell>{trainee.age}</TableCell>
                  <TableCell className="capitalize">{trainee.gender}</TableCell>
                  <TableCell className="capitalize">{trainee.education}</TableCell>
                  <TableCell className="capitalize">{trainee.employment}</TableCell>
                  <TableCell>{getCentreName(trainee.assignedCentre)}</TableCell>
                  <TableCell>{getCourseName(trainee.course)}</TableCell>
                  <TableCell>
                    <button onClick={() => (handleEdit ? handleEdit('trainee', trainee.id) : alert('Edit trainee ' + trainee.id))} className="inline-flex items-center p-1 text-green-700 hover:bg-green-100 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => (handleDelete ? handleDelete('trainee', trainee.id) : alert('Delete trainee ' + trainee.id))} className="inline-flex items-center p-1 text-red-700 hover:bg-red-100 rounded ml-2"><Trash2 className="w-4 h-4" /></button>
                  </TableCell>
                </TableRow>
              ))}
              {trainees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">No trainees enrolled yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraineeAnalysis;