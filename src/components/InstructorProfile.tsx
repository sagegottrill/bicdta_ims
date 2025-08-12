import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, GraduationCap, Building, Edit, Save, X, Shield, Calendar, Award, Users, BarChart3 } from 'lucide-react';

interface InstructorProfileProps {
  onClose: () => void;
}

const InstructorProfile: React.FC<InstructorProfileProps> = ({ onClose }) => {
  const { currentUser, instructors } = useAppContext();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Find current instructor data
  const currentInstructor = instructors.find(instructor => 
    instructor.email === currentUser?.email || instructor.name === currentUser?.name
  );

  const [formData, setFormData] = useState({
    name: currentInstructor?.name || '',
    email: currentInstructor?.email || '',
    phone_number: currentInstructor?.phone_number || '',
    lga: currentInstructor?.lga || '',
    technical_manager_name: currentInstructor?.technical_manager_name || '',
    centre_name: currentInstructor?.centre_name || '',
    qualifications: currentInstructor?.qualifications || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would typically update the instructor data
      // For now, we'll just show a success message
      toast({ title: 'Success', description: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const lgaOptions = [
    'Bayo', 'Dikwa', 'Gajiram', 'Gubio', 'Kaga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri',
    'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani', 'Abadam', 'Askira/Uba', 'Bama', 'Chibok',
    'Damboa', 'Gwoza', 'Hawul', 'Jere', 'Kala/Balge', 'Konduga'
  ];

  const qualificationOptions = [
    'BSc Computer Science',
    'BSc Information Technology',
    'HND Computer Science',
    'HND Information Technology',
    'Diploma in Computer Science',
    'Diploma in Information Technology',
    'Microsoft Certified Professional',
    'Cisco Certified Network Associate',
    'Other IT Certifications',
    'Other Qualifications'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">Instructor Profile</CardTitle>
              <p className="text-slate-600 text-sm">Manage your account information</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">{currentInstructor?.name || 'Instructor Name'}</h2>
                <p className="text-slate-600 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Digital Literacy Instructor
                </p>
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {currentInstructor?.centre_name || 'BICTDA Centre'}
                </p>
              </div>
              <div className="text-right">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </div>
                <p className="text-slate-500 text-xs mt-1">Member since 2024</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      {currentInstructor?.name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {currentInstructor?.email || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => handleChange('phone_number', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {currentInstructor?.phone_number || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="lga">Local Government Area</Label>
                  {isEditing ? (
                    <Select value={formData.lga} onValueChange={(value) => handleChange('lga', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your LGA" />
                      </SelectTrigger>
                      <SelectContent>
                        {lgaOptions.map(lga => (
                          <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {currentInstructor?.lga || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                Professional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="technical_manager_name">Technical Manager</Label>
                  {isEditing ? (
                    <Input
                      id="technical_manager_name"
                      value={formData.technical_manager_name}
                      onChange={(e) => handleChange('technical_manager_name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      {currentInstructor?.technical_manager_name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="centre_name">Centre Name</Label>
                  {isEditing ? (
                    <Input
                      id="centre_name"
                      value={formData.centre_name}
                      onChange={(e) => handleChange('centre_name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      {currentInstructor?.centre_name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  {isEditing ? (
                    <Select value={formData.qualifications} onValueChange={(value) => handleChange('qualifications', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your highest qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualificationOptions.map(qual => (
                          <SelectItem key={qual} value={qual}>{qual}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                      <Award className="w-4 h-4 text-slate-400" />
                      {currentInstructor?.qualifications || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Account Statistics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-blue-700 text-sm">Weeks Active</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">45</p>
                      <p className="text-emerald-700 text-sm">Trainees</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">24</p>
                      <p className="text-purple-700 text-sm">Reports</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-slate-200">
              {isEditing ? (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorProfile;
