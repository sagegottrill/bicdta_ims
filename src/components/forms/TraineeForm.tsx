import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface TraineeFormProps {
  onClose: () => void;
}

const TraineeForm: React.FC<TraineeFormProps> = ({ onClose }) => {
  const { addTrainee, centres, courses } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    lga: '',
    education: '',
    employment: '',
    assignedCentre: '',
    course: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.age || !formData.gender) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addTrainee({
        ...formData,
        age: parseInt(formData.age),
        enrollmentDate: new Date().toISOString().split('T')[0],
      });
      toast({ title: 'Success', description: 'Trainee enrolled successfully!' });
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to enroll trainee', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl">Enroll Trainee</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Enter age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lga">LGA</Label>
              <Input
                id="lga"
                value={formData.lga}
                onChange={(e) => handleChange('lga', e.target.value)}
                placeholder="Enter LGA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education Level</Label>
              <Select value={formData.education} onValueChange={(value) => handleChange('education', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="tertiary">Tertiary</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment">Employment Status</Label>
              <Select value={formData.employment} onValueChange={(value) => handleChange('employment', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="centre">Assigned Centre</Label>
              <Select value={formData.assignedCentre} onValueChange={(value) => handleChange('assignedCentre', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select centre" />
                </SelectTrigger>
                <SelectContent>
                  {centres.map((centre) => (
                    <SelectItem key={centre.id} value={centre.id}>
                      {centre.name} - {centre.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select value={formData.course} onValueChange={(value) => handleChange('course', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Enroll Trainee
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TraineeForm;