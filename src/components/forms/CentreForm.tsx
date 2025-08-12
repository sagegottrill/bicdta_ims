import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface CentreFormProps {
  onClose: () => void;
}

const CentreForm: React.FC<CentreFormProps> = ({ onClose }) => {
  const { addCentre } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    centre_name: '',
    lga: '',
    technical_manager_name: '',
    technical_manager_email: '',
    contact_number: '',
    declared_capacity: '',
    usable_capacity: '',
    computers_present: '',
    computers_functional: '',
    power_available: '',
    power_condition: '',
    internet_available: '',
    fans_present: '',
    air_condition_present: '',
    fans_functional: '',
    air_condition_functional: '',
    lighting_available: '',
    windows_condition: '',
    water_functional: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.centre_name || !formData.lga || !formData.technical_manager_name) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addCentre({
        centre_name: formData.centre_name,
        lga: formData.lga,
        technical_manager_name: formData.technical_manager_name,
        technical_manager_email: formData.technical_manager_email,
        contact_number: formData.contact_number,
        declared_capacity: parseInt(formData.declared_capacity) || 0,
        usable_capacity: parseInt(formData.usable_capacity) || 0,
        computers_present: parseInt(formData.computers_present) || 0,
        computers_functional: parseInt(formData.computers_functional) || 0,
        power_available: formData.power_available === 'yes',
        power_condition: formData.power_condition,
        internet_available: formData.internet_available === 'yes',
        fans_present: parseInt(formData.fans_present) || 0,
        air_condition_present: parseInt(formData.air_condition_present) || 0,
        fans_functional: parseInt(formData.fans_functional) || 0,
        air_condition_functional: parseInt(formData.air_condition_functional) || 0,
        lighting_available: formData.lighting_available === 'yes',
        windows_condition: formData.windows_condition,
        water_functional: formData.water_functional === 'yes',
      });
      toast({ title: 'Success', description: 'Centre added successfully!' });
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add centre', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-4xl mx-auto shadow-lg border-0 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">Add New Centre</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="centre_name">Centre Name *</Label>
                <Input
                  id="centre_name"
                  value={formData.centre_name}
                  onChange={(e) => handleChange('centre_name', e.target.value)}
                  placeholder="Enter centre name"
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
                <Label htmlFor="technical_manager_email">Technical Manager Email</Label>
                <Input
                  id="technical_manager_email"
                  type="email"
                  value={formData.technical_manager_email}
                  onChange={(e) => handleChange('technical_manager_email', e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  value={formData.contact_number}
                  onChange={(e) => handleChange('contact_number', e.target.value)}
                  placeholder="Enter contact number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="declared_capacity">Declared Capacity (Seats)</Label>
                <Input
                  id="declared_capacity"
                  type="number"
                  value={formData.declared_capacity}
                  onChange={(e) => handleChange('declared_capacity', e.target.value)}
                  placeholder="Enter declared capacity"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="usable_capacity">Usable Capacity (Seats)</Label>
                <Input
                  id="usable_capacity"
                  type="number"
                  value={formData.usable_capacity}
                  onChange={(e) => handleChange('usable_capacity', e.target.value)}
                  placeholder="Enter usable capacity"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="computers_present">Computers Present</Label>
                <Input
                  id="computers_present"
                  type="number"
                  value={formData.computers_present}
                  onChange={(e) => handleChange('computers_present', e.target.value)}
                  placeholder="Enter number of computers"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="computers_functional">Computers Functional</Label>
                <Input
                  id="computers_functional"
                  type="number"
                  value={formData.computers_functional}
                  onChange={(e) => handleChange('computers_functional', e.target.value)}
                  placeholder="Enter number of functional computers"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="power_available">Power Available</Label>
                <Select value={formData.power_available} onValueChange={(value) => handleChange('power_available', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select power availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="power_condition">Power Condition</Label>
                <Input
                  id="power_condition"
                  value={formData.power_condition}
                  onChange={(e) => handleChange('power_condition', e.target.value)}
                  placeholder="e.g., Stable, Unstable"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="internet_available">Internet Available</Label>
                <Select value={formData.internet_available} onValueChange={(value) => handleChange('internet_available', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select internet availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fans_present">Fans Present</Label>
                <Input
                  id="fans_present"
                  type="number"
                  value={formData.fans_present}
                  onChange={(e) => handleChange('fans_present', e.target.value)}
                  placeholder="Enter number of fans"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fans_functional">Fans Functional</Label>
                <Input
                  id="fans_functional"
                  type="number"
                  value={formData.fans_functional}
                  onChange={(e) => handleChange('fans_functional', e.target.value)}
                  placeholder="Enter number of functional fans"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lighting_available">Lighting Available</Label>
                <Select value={formData.lighting_available} onValueChange={(value) => handleChange('lighting_available', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select lighting availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="windows_condition">Windows Condition</Label>
                <Select value={formData.windows_condition} onValueChange={(value) => handleChange('windows_condition', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select windows condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="bad">Bad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="water_functional">Water Functional</Label>
                <Select value={formData.water_functional} onValueChange={(value) => handleChange('water_functional', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select water functionality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Centre'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CentreForm;