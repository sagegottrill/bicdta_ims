import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface TraineeFormProps {
  onClose: () => void;
  availableCentres?: string[];
}

const TraineeForm: React.FC<TraineeFormProps> = ({ onClose, availableCentres = [] }) => {
  const { addTrainee } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    serial_number: '',
    id_number: '',
    full_name: '',
    gender: '',
    date_of_birth: '',
    age: '',
    educational_background: '',
    employment_status: '',
    centre_name: '',

    nin: '',
    phone_number: '',
    cohort_number: '',
    learner_category: '',
    email: '',
    lga: '',
    people_with_special_needs: false,
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.gender || !formData.id_number) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addTrainee({
        ...formData,
        centre_name: formData.centre_name?.toUpperCase(),
        age: parseInt(formData.age) || 0,
        cohort_number: parseInt(formData.cohort_number) || 1,
        serial_number: parseInt(formData.serial_number) || 0,
      });
      toast({ title: 'Success', description: 'Trainee enrolled successfully!' });
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to enroll trainee', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-2xl mx-auto shadow-lg border-0 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">Enroll New Trainee</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => handleChange('serial_number', e.target.value)}
                  placeholder="Enter serial number"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="id_number">ID Number *</Label>
                <Input
                  id="id_number"
                  value={formData.id_number}
                  onChange={(e) => handleChange('id_number', e.target.value)}
                  placeholder="Enter ID number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="nin">NIN</Label>
                <Input
                  id="nin"
                  value={formData.nin}
                  onChange={(e) => handleChange('nin', e.target.value)}
                  placeholder="Enter NIN"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="Enter age"
                    className="mt-1"
                  />
              </div>

              <div>
                <Label htmlFor="employment_status">Employment Status</Label>
                <Select value={formData.employment_status} onValueChange={(value) => handleChange('employment_status', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="centre_name">Centre Name</Label>
                <Select value={formData.centre_name} onValueChange={(value) => handleChange('centre_name', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select centre" />
                  </SelectTrigger>
                  <SelectContent>
                      {["DIKWA DIGITAL LITERACY CENTRE", "GAJIRAM ICT CENTER", "GUBIO DIGITAL LITERACY CENTRE", "KAGA DIGITAL LITERACY CENTRE", "MONGUNO DIGITAL LITERACY CENTRE", "MAFA DIGITAL LITERACY CENTRE", "DAMASAK DIGITAL LITERACY CENTER", "BAYO DIGITAL LITERACY CENTER", "DAMBOA DIGITAL LITERACY CENTER", ...(availableCentres || [])].map(centre => (
                        <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cohort_number">Cohort Number</Label>
                <Input
                  id="cohort_number"
                  type="number"
                  value={formData.cohort_number}
                  onChange={(e) => handleChange('cohort_number', e.target.value)}
                  placeholder="Enter cohort number"
                  className="mt-1"
                />
              </div>


              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lga">LGA</Label>
                <Input
                  id="lga"
                  value={formData.lga}
                  onChange={(e) => handleChange('lga', e.target.value)}
                  placeholder="Enter LGA"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="learner_category">Learner Category</Label>
                <Select value={formData.learner_category} onValueChange={(value) => handleChange('learner_category', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADULT">ADULT</SelectItem>
                    <SelectItem value="LGA STAFF">LGA STAFF</SelectItem>
                    <SelectItem value="OUT OF SCHOOL">OUT OF SCHOOL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>



            {/* Special Needs Section */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="people_with_special_needs"
                checked={formData.people_with_special_needs}
                onCheckedChange={(checked) => handleChange('people_with_special_needs', checked)}
              />
              <Label htmlFor="people_with_special_needs">People with Special Needs</Label>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter full address"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enrolling...' : 'Enroll Trainee'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraineeForm;