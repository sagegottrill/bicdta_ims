import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface TrainerFormProps {
  onClose: () => void;
}

const TrainerForm: React.FC<TrainerFormProps> = ({ onClose }) => {
  const { addTrainer, centres } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nin: '',
    qualifications: '',
    assignedCentre: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.nin) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addTrainer(formData);
    toast({ title: 'Success', description: 'Trainer added successfully!' });
    onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add trainer', variant: 'destructive' });
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
          <CardTitle className="text-2xl">Add Trainer</CardTitle>
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
              <Label htmlFor="nin">NIN *</Label>
              <Input
                id="nin"
                value={formData.nin}
                onChange={(e) => handleChange('nin', e.target.value)}
                placeholder="Enter NIN"
              />
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualifications">Qualifications</Label>
            <Textarea
              id="qualifications"
              value={formData.qualifications}
              onChange={(e) => handleChange('qualifications', e.target.value)}
              placeholder="Enter qualifications and experience"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500">
              Add Trainer
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

export default TrainerForm;