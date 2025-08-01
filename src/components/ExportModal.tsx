import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, Filter, FileText, Users, Building, GraduationCap } from 'lucide-react';

interface ExportModalProps {
  trainees: any[];
  trigger: React.ReactNode;
}

const ExportModal: React.FC<ExportModalProps> = ({ trainees, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'full_name', 'gender', 'age', 'centre_name', 'cohort_number', 'employment_status'
  ]);
  const [selectedCentres, setSelectedCentres] = useState<string[]>(['all']);
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>(['all']);
  const [selectedGenders, setSelectedGenders] = useState<string[]>(['all']);
  const [selectedEmployment, setSelectedEmployment] = useState<string[]>(['all']);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');

  // Get unique values for filters
  const uniqueCentres = [...new Set(trainees.map(t => t.centre_name?.toUpperCase()))].filter(Boolean).sort();
  const uniqueCohorts = [...new Set(trainees.map(t => t.cohort_number?.toString() || ''))].filter(cohort => cohort && cohort !== '0').sort();
  const uniqueGenders = [...new Set(trainees.map(t => t.gender?.toLowerCase()))].filter(Boolean).sort();
  const uniqueEmployment = [...new Set(trainees.map(t => t.employment_status?.toLowerCase()))].filter(Boolean).sort();

  // Available fields for export
  const availableFields = [
    { id: 'full_name', label: 'Full Name', icon: Users },
    { id: 'gender', label: 'Gender', icon: Users },
    { id: 'age', label: 'Age', icon: Users },
    { id: 'date_of_birth', label: 'Date of Birth', icon: Users },
    { id: 'educational_background', label: 'Educational Background', icon: GraduationCap },
    { id: 'employment_status', label: 'Employment Status', icon: Users },
    { id: 'centre_name', label: 'Centre Name', icon: Building },
    { id: 'cohort_number', label: 'Cohort Number', icon: GraduationCap },
    { id: 'id_number', label: 'ID Number', icon: Users },
    { id: 'address', label: 'Address', icon: Users },
    { id: 'learner_category', label: 'Learner Category', icon: GraduationCap },
  ];

  // Filter trainees based on selected criteria
  const filteredTrainees = trainees.filter(trainee => {
    const centreMatch = selectedCentres.includes('all') || selectedCentres.includes(trainee.centre_name?.toUpperCase());
    const cohortMatch = selectedCohorts.includes('all') || selectedCohorts.includes(trainee.cohort_number?.toString());
    const genderMatch = selectedGenders.includes('all') || selectedGenders.includes(trainee.gender?.toLowerCase());
    const employmentMatch = selectedEmployment.includes('all') || selectedEmployment.includes(trainee.employment_status?.toLowerCase());
    
    return centreMatch && cohortMatch && genderMatch && employmentMatch;
  });

  // Handle field selection
  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(f => f !== fieldId)
        : [...prev, fieldId]
    );
  };

  // Handle multi-select filters
  const toggleFilter = (filterType: string, value: string) => {
    const setterMap = {
      centres: setSelectedCentres,
      cohorts: setSelectedCohorts,
      genders: setSelectedGenders,
      employment: setSelectedEmployment
    };
    
    const currentValues = {
      centres: selectedCentres,
      cohorts: selectedCohorts,
      genders: selectedGenders,
      employment: selectedEmployment
    };

    const setter = setterMap[filterType as keyof typeof setterMap];
    const current = currentValues[filterType as keyof typeof currentValues];

    if (value === 'all') {
      setter(['all']);
    } else {
      const newValues = current.includes('all') 
        ? [value]
        : current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
      
      setter(newValues.length === 0 ? ['all'] : newValues);
    }
  };

  // Export function
  const handleExport = () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export');
      return;
    }

    const headers = selectedFields.map(field => 
      availableFields.find(f => f.id === field)?.label || field
    );

    const csvData = [
      headers,
      ...filteredTrainees.map(trainee => 
        selectedFields.map(field => {
          const value = trainee[field];
          if (field === 'centre_name') return value?.toUpperCase() || '';
          if (field === 'gender') {
            return value?.toLowerCase() === 'm' ? 'Male' : 
                   value?.toLowerCase() === 'f' ? 'Female' : value || '';
          }
          return value || '';
        })
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Create filename with filter info
    let filename = `trainees_export_${new Date().toISOString().split('T')[0]}`;
    if (!selectedCentres.includes('all')) filename += `_centres_${selectedCentres.length}`;
    if (!selectedCohorts.includes('all')) filename += `_cohorts_${selectedCohorts.join('_')}`;
    if (!selectedGenders.includes('all')) filename += `_genders_${selectedGenders.join('_')}`;
    filename += `.csv`;
    
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Trainee Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Export Summary</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Total Records:</span>
                <span className="ml-2 font-semibold">{filteredTrainees.length}</span>
              </div>
              <div>
                <span className="text-blue-600">Selected Fields:</span>
                <span className="ml-2 font-semibold">{selectedFields.length}</span>
              </div>
              <div>
                <span className="text-blue-600">Format:</span>
                <span className="ml-2 font-semibold uppercase">{exportFormat}</span>
              </div>
              <div>
                <span className="text-blue-600">Filters Applied:</span>
                <span className="ml-2 font-semibold">
                  {[selectedCentres, selectedCohorts, selectedGenders, selectedEmployment]
                    .filter(arr => !arr.includes('all')).length}
                </span>
              </div>
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Select Fields to Export
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableFields.map(field => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <Label htmlFor={field.id} className="text-sm cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Apply Filters
            </h3>

            {/* Centre Filter */}
            <div>
              <Label className="text-sm font-medium">Centres</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={selectedCentres.includes('all') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleFilter('centres', 'all')}
                >
                  All Centres
                </Button>
                {uniqueCentres.map(centre => (
                  <Button
                    key={centre}
                    variant={selectedCentres.includes(centre) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleFilter('centres', centre)}
                  >
                    {centre}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cohort Filter */}
            <div>
              <Label className="text-sm font-medium">Cohorts</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={selectedCohorts.includes('all') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleFilter('cohorts', 'all')}
                >
                  All Cohorts
                </Button>
                {uniqueCohorts.map(cohort => (
                  <Button
                    key={cohort}
                    variant={selectedCohorts.includes(cohort) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleFilter('cohorts', cohort)}
                  >
                    Cohort {cohort}
                  </Button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <Label className="text-sm font-medium">Gender</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={selectedGenders.includes('all') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleFilter('genders', 'all')}
                >
                  All Genders
                </Button>
                {uniqueGenders.map(gender => (
                  <Button
                    key={gender}
                    variant={selectedGenders.includes(gender) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleFilter('genders', gender)}
                  >
                    {gender === 'm' ? 'Male' : gender === 'f' ? 'Female' : gender}
                  </Button>
                ))}
              </div>
            </div>

            {/* Employment Filter */}
            <div>
              <Label className="text-sm font-medium">Employment Status</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={selectedEmployment.includes('all') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleFilter('employment', 'all')}
                >
                  All Statuses
                </Button>
                {uniqueEmployment.map(status => (
                  <Button
                    key={status}
                    variant={selectedEmployment.includes(status) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleFilter('employment', status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <Label className="text-sm font-medium">Export Format</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={exportFormat === 'csv' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportFormat('csv')}
              >
                CSV
              </Button>
              <Button
                variant={exportFormat === 'excel' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportFormat('excel')}
                disabled
              >
                Excel (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={selectedFields.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export {filteredTrainees.length} Records
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal; 