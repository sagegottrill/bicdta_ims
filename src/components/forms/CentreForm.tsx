import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CentreFormProps {
  onClose: () => void;
}

const CentreForm: React.FC<CentreFormProps> = ({ onClose }) => {
  const { addCentre } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    computers: '',
    internetStatus: '',
    powerSource: '',
    coordinator: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.capacity) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addCentre({
        name: formData.name,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        computers: parseInt(formData.computers) || 0,
        internetStatus: formData.internetStatus,
        powerSource: formData.powerSource,
        coordinator: formData.coordinator,
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
    <Card className="max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl">Add Digital Literacy Centre</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Centre Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter centre name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (LGA) *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Enter LGA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                placeholder="Maximum students"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="computers">Number of Computers</Label>
              <Input
                id="computers"
                type="number"
                value={formData.computers}
                onChange={(e) => handleChange('computers', e.target.value)}
                placeholder="Available computers"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internet">Internet Status</Label>
              <Select value={formData.internetStatus} onValueChange={(value) => handleChange('internetStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="power">Power Source</Label>
              <Select value={formData.powerSource} onValueChange={(value) => handleChange('powerSource', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select power source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Power</SelectItem>
                  <SelectItem value="generator">Generator</SelectItem>
                  <SelectItem value="solar">Solar</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coordinator">Coordinator Name</Label>
            <Input
              id="coordinator"
              value={formData.coordinator}
              onChange={(e) => handleChange('coordinator', e.target.value)}
              placeholder="Enter coordinator name"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Add Centre
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

export default CentreForm;