import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface InstructorFormProps {
  onClose: () => void;
}

const InstructorForm: React.FC<InstructorFormProps> = ({ onClose }) => {
  const { addInstructor } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    lga: '',
    technical_manager_name: '',
    email: '',
    phone_number: '',
    centre_name: '',
    status: 'pending' as 'pending' | 'approved' | 'revoked' | 'active',
    is_online: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.lga || !formData.technical_manager_name || !formData.email || !formData.phone_number) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addInstructor(formData);
      toast({ title: 'Success', description: 'Instructor registered successfully!' });
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to register instructor', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-2xl mx-auto shadow-lg border-0 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">Register New Instructor</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lga">LGA *</Label>
                <Input
                  id="lga"
                  value={formData.lga}
                  onChange={(e) => handleChange('lga', e.target.value)}
                  placeholder="Enter LGA"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="technical_manager_name">Technical Manager Name *</Label>
                <Input
                  id="technical_manager_name"
                  value={formData.technical_manager_name}
                  onChange={(e) => handleChange('technical_manager_name', e.target.value)}
                  placeholder="Enter technical manager name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="centre_name">Assigned Centre</Label>
                  <Select value={formData.centre_name} onValueChange={(value) => handleChange('centre_name', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select centre" />
                    </SelectTrigger>
                    <SelectContent>
                      {["DIKWA DIGITAL LITERACY CENTRE", "GAJIRAM ICT CENTER", "GUBIO DIGITAL LITERACY CENTRE", "KAGA DIGITAL LITERACY CENTRE", "MONGUNO DIGITAL LITERACY CENTRE", "MAFA DIGITAL LITERACY CENTRE", "DAMASAK DIGITAL LITERACY CENTER", "BAYO DIGITAL LITERACY CENTER", "DAMBOA DIGITAL LITERACY CENTER"].map(centre => (
                        <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register Instructor'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorForm;
