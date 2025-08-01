import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Edit, Trash2 } from 'lucide-react';

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
        cohorts: new Set()
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
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages and convert to array
  const centres = Object.values(centreStats).map(centre => ({
    ...centre,
    avgAge: Math.round(centre.ageSum / centre.trainees),
    cohortCount: centre.cohorts.size
  }));

  const getUtilizationColor = (traineeCount: number) => {
    if (traineeCount > 50) return 'bg-red-100 text-red-800';
    if (traineeCount > 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Centre Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centre Name</TableHead>
                <TableHead>Trainees</TableHead>
                <TableHead>Male</TableHead>
                <TableHead>Female</TableHead>
                <TableHead>Avg Age</TableHead>
                <TableHead>Cohorts</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centres.map((centre, index) => {
                const utilization = centre.trainees > 50 ? 'High' : centre.trainees > 30 ? 'Medium' : 'Low';
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{centre.name}</TableCell>
                    <TableCell>{centre.trainees}</TableCell>
                    <TableCell>{centre.maleCount}</TableCell>
                    <TableCell>{centre.femaleCount}</TableCell>
                    <TableCell>{centre.avgAge}</TableCell>
                    <TableCell>{centre.cohortCount}</TableCell>
                    <TableCell>
                      <Badge className={getUtilizationColor(centre.trainees)}>
                        {utilization}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => (handleEdit ? handleEdit('centre', centre.name) : alert('Edit centre ' + centre.name))} className="inline-flex items-center p-1 text-green-700 hover:bg-green-100 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => (handleDelete ? handleDelete('centre', centre.name) : alert('Delete centre ' + centre.name))} className="inline-flex items-center p-1 text-red-700 hover:bg-red-100 rounded ml-2"><Trash2 className="w-4 h-4" /></button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {centres.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No centres found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Total Centres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {centres.length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Total Trainees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {trainees.length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Avg Trainees/Centre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {centres.length > 0 ? Math.round(trainees.length / centres.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CentreAnalysis;