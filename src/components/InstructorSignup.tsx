import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Building, User, Mail, Phone, MapPin, GraduationCap, ArrowLeft } from 'lucide-react';

interface InstructorSignupProps {
  onBackToLogin: () => void;
}

const InstructorSignup: React.FC<InstructorSignupProps> = ({ onBackToLogin }) => {
  const { addInstructor } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    lga: '',
    technical_manager_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    centre_name: '',
    qualifications: '',
    status: 'pending' as 'pending' | 'approved' | 'revoked' | 'active',
    is_online: false,
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.lga || !formData.technical_manager_name || !formData.email || !formData.phone_number || !formData.password) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters long', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Create Firebase user account with the provided password
      const { signUpWithEmail } = await import('@/lib/firebase');
      await signUpWithEmail(formData.email, formData.password, {
        name: formData.technical_manager_name,
        lga: formData.lga,
        technical_manager_name: formData.technical_manager_name,
        phone_number: formData.phone_number,
        centre_name: formData.centre_name,
        role: 'instructor',
        status: 'pending',
        is_online: false
      });

      // Also add to Supabase for data consistency
      await addInstructor({
        name: formData.technical_manager_name,
        lga: formData.lga,
        technical_manager_name: formData.technical_manager_name,
        email: formData.email,
        phone_number: formData.phone_number,
        centre_name: formData.centre_name,
        status: formData.status,
        is_online: formData.is_online,
      });
      
      setShowSuccess(true);
      // Don't redirect immediately, show success message first
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create instructor account', variant: 'destructive' });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <img 
                src="/bictda-logo.png" 
                alt="BICTDA Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Instructor Registration
          </CardTitle>
          <p className="text-slate-600 mt-2">Join BICTDA as a Digital Literacy Instructor</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone_number">Phone Number *</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="lga">Local Government Area *</Label>
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
                  <Label htmlFor="centre_name">Centre Name</Label>
                  <Select value={formData.centre_name} onValueChange={(value) => handleChange('centre_name', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your centre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DIKWA DIGITAL LITERACY CENTRE">DIKWA DIGITAL LITERACY CENTRE</SelectItem>
                      <SelectItem value="GAJIRAM ICT CENTER">GAJIRAM ICT CENTER</SelectItem>
                      <SelectItem value="GUBIO DIGITAL LITERACY CENTRE">GUBIO DIGITAL LITERACY CENTRE</SelectItem>
                      <SelectItem value="KAGA DIGITAL LITERACY CENTRE">KAGA DIGITAL LITERACY CENTRE</SelectItem>
                      <SelectItem value="MONGUNO DIGITAL LITERACY CENTRE">MONGUNO DIGITAL LITERACY CENTRE</SelectItem>
                      <SelectItem value="MAFA DIGITAL LITERACY CENTRE">MAFA DIGITAL LITERACY CENTRE</SelectItem>
                      <SelectItem value="DAMASAK DIGITAL LITERACY CENTER">DAMASAK DIGITAL LITERACY CENTER</SelectItem>
                      <SelectItem value="BAYO DIGITAL LITERACY CENTER">BAYO DIGITAL LITERACY CENTER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
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
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                Account Security
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Create a password"
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                By registering as an instructor, you agree to:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Maintain professional conduct and ethical standards</li>
                <li>• Submit weekly and monthly reports as required</li>
                <li>• Ensure accurate data entry and reporting</li>
                <li>• Follow BICTDA guidelines and procedures</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBackToLogin}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {loading ? 'Creating Account...' : 'Create Instructor Account'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Message */}
      {showSuccess && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Account Created Successfully!</h3>
            <p className="text-green-700 mb-4">
              Your instructor account has been created and is now pending admin approval.
            </p>
            <div className="bg-white rounded-lg p-4 mb-6 border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-yellow-700">Status: Pending Approval</span>
              </div>
              <p className="text-sm text-slate-600">
                An administrator will review your application and approve your access within 24-48 hours.
              </p>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p><strong>What happens next?</strong></p>
              <ul className="space-y-1">
                <li>• Admin will review your application</li>
                <li>• You'll receive an email notification when approved</li>
                <li>• You can then login with your email and password</li>
                <li>• You'll have access to your assigned center dashboard</li>
              </ul>
            </div>
            <Button 
              onClick={onBackToLogin}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstructorSignup;
