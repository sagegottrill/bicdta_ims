import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Edit, Trash2 } from 'lucide-react';

const CentreAnalysis: React.FC<{ handleEdit?: (type: string, id: string) => void, handleDelete?: (type: string, id: string) => void }> = ({ handleEdit, handleDelete }) => {
  const { centres, trainees } = useAppContext();

  const getEnrollmentCount = (centreId: string) => {
    return trainees.filter(t => t.assignedCentre === centreId).length;
  };

  const getUtilizationRate = (centreId: string, capacity: number) => {
    const enrolled = getEnrollmentCount(centreId);
    return capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Computers</TableHead>
                <TableHead>Internet</TableHead>
                <TableHead>Power</TableHead>
                <TableHead>Coordinator</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centres.map((centre) => {
                const enrolled = getEnrollmentCount(centre.id);
                const utilization = getUtilizationRate(centre.id, centre.capacity);
                return (
                  <TableRow key={centre.id}>
                    <TableCell className="font-medium">{centre.name}</TableCell>
                    <TableCell>{centre.location}</TableCell>
                    <TableCell>{centre.capacity}</TableCell>
                    <TableCell>{enrolled}</TableCell>
                    <TableCell>
                      <Badge className={utilization > 80 ? 'bg-red-100 text-red-800' : utilization > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {utilization}%
                      </Badge>
                    </TableCell>
                    <TableCell>{centre.computers}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(centre.internetStatus)}>
                        {centre.internetStatus || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{centre.powerSource || 'N/A'}</TableCell>
                    <TableCell>{centre.coordinator || 'N/A'}</TableCell>
                    <TableCell>
                      <button onClick={() => (handleEdit ? handleEdit('centre', centre.id) : alert('Edit centre ' + centre.id))} className="inline-flex items-center p-1 text-green-700 hover:bg-green-100 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => (handleDelete ? handleDelete('centre', centre.id) : alert('Delete centre ' + centre.id))} className="inline-flex items-center p-1 text-red-700 hover:bg-red-100 rounded ml-2"><Trash2 className="w-4 h-4" /></button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {centres.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-gray-500">No centres registered yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {centres.reduce((sum, centre) => sum + centre.capacity, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Total Computers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {centres.reduce((sum, centre) => sum + centre.computers, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Average Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {centres.length > 0 ? Math.round(centres.reduce((sum, centre) => sum + getUtilizationRate(centre.id, centre.capacity), 0) / centres.length) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CentreAnalysis;