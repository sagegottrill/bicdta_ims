import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { Edit, Trash2, Download } from 'lucide-react';
import ExportModal from '../ExportModal';

const TraineeAnalysis: React.FC<{ handleEdit?: (type: string, id: string) => void, handleDelete?: (type: string, id: string) => void }> = ({ handleEdit, handleDelete }) => {
  const { trainees } = useAppContext();
  const [selectedCentre, setSelectedCentre] = useState<string>('all');
  const [selectedCohort, setSelectedCohort] = useState<string>('all');

  // Debug values
  const educationValues = [...new Set(trainees.map(t => t.educational_background))];
  const employmentValues = [...new Set(trainees.map(t => t.employment_status))];
  console.log('🎯 TraineeAnalysis - Education values:', educationValues);
  console.log('🎯 TraineeAnalysis - Employment values:', employmentValues);
  
  // Debug employment counts
  const employmentCounts = employmentValues.map(value => ({
    value,
    count: trainees.filter(t => t.employment_status === value).length
  }));
  console.log('🎯 TraineeAnalysis - Employment counts:', employmentCounts);

  const educationStats = [
    { level: 'Primary', count: trainees.filter(t => t.educational_background?.toLowerCase().includes('primary')).length },
    { level: 'Secondary', count: trainees.filter(t => t.educational_background?.toLowerCase().includes('secondary') || t.educational_background?.toLowerCase().includes('ssce')).length },
    { level: 'Tertiary', count: trainees.filter(t => t.educational_background?.toLowerCase().includes('tertiary') || t.educational_background?.toLowerCase().includes('ond') || t.educational_background?.toLowerCase().includes('bsc')).length },
    { level: 'None', count: trainees.filter(t => t.educational_background?.toLowerCase() === 'nil' || t.educational_background?.toLowerCase() === 'none').length },
  ];

  const employmentStats = [
    { status: 'Employed', count: trainees.filter(t => {
      const status = t.employment_status?.toLowerCase();
      return status === 'employed' || status === 'emp';
    }).length },
    { status: 'Unemployed', count: trainees.filter(t => {
      const status = t.employment_status?.toLowerCase();
      return status === 'unemployed' || status === 'unemp';
    }).length },
  ];

  // Get unique centres and cohorts for filter dropdowns
  const uniqueCentres = [
    "IKWA DIGITAL LITERACY CENTRE",
    "GAJIRAM ICT CENTER", 
    "GUBIO DIGITAL LITERACY CENTRE",
    "KAGA DIGITAL LITERACY CENTRE",
    "MONGUNO DIGITAL LITERACY CENTRE",
    "MAFA DIGITAL LITERACY CENTRE",
    "DAMASAK DIGITAL LITERACY CENTER",
    "BAYO DIGITAL LITERACY CENTER"
  ];
  const uniqueCohorts = [...new Set(trainees.map(t => t.cohort_number?.toString() || ''))].filter(cohort => cohort && cohort !== '0').sort();

  // Filtered trainees based on selected filters
  const filteredTrainees = trainees.filter(trainee => {
    const centreMatch = selectedCentre === 'all' || trainee.centre_name?.toUpperCase() === selectedCentre;
    const cohortMatch = selectedCohort === 'all' || trainee.cohort_number.toString() === selectedCohort;
    return centreMatch && cohortMatch;
  });

  // Export filtered data (CSV)
  const exportData = () => {
    const csv = [
      ['Full Name', 'Gender', 'Age', 'Educational Background', 'Employment Status', 'Centre Name', 'Cohort Number', 'ID Number', 'Address', 'Learner Category'],
      ...filteredTrainees.map(t => [
        t.full_name, 
        t.gender, 
        t.age, 
        t.educational_background, 
        t.employment_status, 
        t.centre_name?.toUpperCase(), 
        t.cohort_number, 
        t.id_number, 
        t.address, 
        t.learner_category
      ]),
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Create filename with filter info
    let filename = 'trainees_export';
    if (selectedCentre !== 'all') filename += `_${selectedCentre.replace(/\s+/g, '_')}`;
    if (selectedCohort !== 'all') filename += `_cohort_${selectedCohort}`;
    filename += '.csv';
    
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <div className="flex justify-between items-center">
            <CardTitle>All Trainees ({filteredTrainees.length})</CardTitle>
            <div className="flex gap-4 items-center">
              <ExportModal 
                trainees={filteredTrainees}
                trigger={
                  <Button 
                    variant="outline" 
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                }
              />
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Centre:</label>
                <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Centres</SelectItem>
                    {uniqueCentres.map(centre => (
                      <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Cohort:</label>
                <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select Cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cohorts</SelectItem>
                    {uniqueCohorts.map(cohort => (
                      <SelectItem key={cohort} value={cohort}>Cohort {cohort}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainees.map((trainee) => (
                <TableRow key={trainee.id}>
                  <TableCell className="font-medium">{trainee.full_name}</TableCell>
                  <TableCell>{trainee.age}</TableCell>
                  <TableCell className="capitalize">{trainee.gender}</TableCell>
                  <TableCell className="capitalize">{trainee.educational_background}</TableCell>
                  <TableCell className="capitalize">{trainee.employment_status}</TableCell>
                  <TableCell>{trainee.centre_name?.toUpperCase()}</TableCell>
                  <TableCell>{trainee.cohort_number}</TableCell>
                  <TableCell>
                    <button onClick={() => (handleEdit ? handleEdit('trainee', trainee.id.toString()) : alert('Edit trainee ' + trainee.id))} className="inline-flex items-center p-1 text-green-700 hover:bg-green-100 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => (handleDelete ? handleDelete('trainee', trainee.id.toString()) : alert('Delete trainee ' + trainee.id))} className="inline-flex items-center p-1 text-red-700 hover:bg-red-100 rounded ml-2"><Trash2 className="w-4 h-4" /></button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTrainees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No trainees found for selected filters
                  </TableCell>
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