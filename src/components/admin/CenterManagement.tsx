import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Building, Search, Edit, Save, X } from 'lucide-react';

interface CenterManagementProps {
  currentUser: { role: 'instructor' | 'admin' | null; name: string; centre_name?: string } | null;
}

const CenterManagement: React.FC<CenterManagementProps> = ({ currentUser }) => {
  const { centres, updateCentre } = useAppContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCentre, setEditingCentre] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const filteredCentres = centres.filter(centre => {
    if (currentUser?.role === 'instructor' && currentUser.centre_name) {
      if (!centre.centre_name.toLowerCase().includes(currentUser.centre_name.toLowerCase())) {
        return false;
      }
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        centre.centre_name.toLowerCase().includes(searchLower) ||
        centre.technical_manager_name.toLowerCase().includes(searchLower) ||
        centre.lga.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const handleEdit = (centre: any) => {
    setEditingCentre(centre.id);
    setEditData({
      centre_name: centre.centre_name,
      lga: centre.lga,
      technical_manager_name: centre.technical_manager_name,
      technical_manager_email: centre.technical_manager_email,
      contact_number: centre.contact_number,
      declared_capacity: centre.declared_capacity.toString(),
      usable_capacity: centre.usable_capacity.toString(),
      computers_present: centre.computers_present.toString(),
      computers_functional: centre.computers_functional.toString(),
      power_available: centre.power_available ? 'Yes' : 'No',
      power_condition: centre.power_condition,
      internet_available: centre.internet_available ? 'Yes' : 'No',
      fans_present: centre.fans_present.toString(),
      air_condition_present: centre.air_condition_present.toString(),
      fans_functional: centre.fans_functional.toString(),
      air_condition_functional: centre.air_condition_functional.toString(),
      lighting_available: centre.lighting_available ? 'Yes' : 'No',
      windows_condition: centre.windows_condition,
      water_functional: centre.water_functional ? 'Yes' : 'No',
    });
  };

  const handleSave = async (id: number) => {
    try {
      await updateCentre(id, {
        centre_name: editData.centre_name,
        lga: editData.lga,
        technical_manager_name: editData.technical_manager_name,
        technical_manager_email: editData.technical_manager_email,
        contact_number: editData.contact_number,
        declared_capacity: parseInt(editData.declared_capacity) || 0,
        usable_capacity: parseInt(editData.usable_capacity) || 0,
        computers_present: parseInt(editData.computers_present) || 0,
        computers_functional: parseInt(editData.computers_functional) || 0,
        power_available: editData.power_available === 'Yes',
        power_condition: editData.power_condition,
        internet_available: editData.internet_available === 'Yes',
        fans_present: parseInt(editData.fans_present) || 0,
        air_condition_present: parseInt(editData.air_condition_present) || 0,
        fans_functional: parseInt(editData.fans_functional) || 0,
        air_condition_functional: parseInt(editData.air_condition_functional) || 0,
        lighting_available: editData.lighting_available === 'Yes',
        windows_condition: editData.windows_condition,
        water_functional: editData.water_functional === 'Yes',
      });
      setEditingCentre(null);
      setEditData({});
      toast({ title: 'Success', description: 'Center information updated successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update center information', variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setEditingCentre(null);
    setEditData({});
  };

  const handleChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            Center Management
          </h2>
          <p className="text-slate-600 mt-1">
            {currentUser?.role === 'instructor' 
              ? `Managing ${currentUser.centre_name}` 
              : 'Manage all digital literacy centers'
            }
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredCentres.length} Centers
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search centers by name, manager, or LGA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCentres.map((centre) => (
          <Card key={centre.id} className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    {centre.centre_name}
                  </CardTitle>
                  <p className="text-slate-600 text-sm mt-1">{centre.lga}</p>
                </div>
                {editingCentre === centre.id ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(centre.id)} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleEdit(centre)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">Manager Information</h4>
                {editingCentre === centre.id ? (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Manager Name</Label>
                      <Input
                        value={editData.technical_manager_name}
                        onChange={(e) => handleChange('technical_manager_name', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Email</Label>
                      <Input
                        value={editData.technical_manager_email}
                        onChange={(e) => handleChange('technical_manager_email', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Contact</Label>
                      <Input
                        value={editData.contact_number}
                        onChange={(e) => handleChange('contact_number', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Manager:</span> {centre.technical_manager_name}</p>
                    <p><span className="font-medium">Email:</span> {centre.technical_manager_email || 'N/A'}</p>
                    <p><span className="font-medium">Contact:</span> {centre.contact_number || 'N/A'}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">Capacity & Equipment</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Capacity:</span> {centre.usable_capacity}/{centre.declared_capacity} seats</p>
                  <p><span className="font-medium">Computers:</span> {centre.computers_functional}/{centre.computers_present}</p>
                  <p><span className="font-medium">Power:</span> 
                    <Badge variant={centre.power_available ? 'default' : 'secondary'} className="ml-2">
                      {centre.power_available ? 'Available' : 'Not Available'}
                    </Badge>
                  </p>
                  <p><span className="font-medium">Internet:</span> 
                    <Badge variant={centre.internet_available ? 'default' : 'secondary'} className="ml-2">
                      {centre.internet_available ? 'Available' : 'Not Available'}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCentres.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Centers Found</h3>
            <p className="text-slate-500">
              {searchTerm 
                ? `No centers match your search for "${searchTerm}"`
                : 'No centers have been registered yet.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CenterManagement;
