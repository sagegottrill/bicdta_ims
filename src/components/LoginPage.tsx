import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, Shield, Building2, Users, BookOpen, Globe, Sparkles } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAppContext();
  const { t, language, setLanguage } = useLanguage();
  const [adminEmail, setAdminEmail] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [activeTab, setActiveTab] = useState('admin');
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login('admin', 'Admin User', adminEmail);
    if (!success) {
      alert('Invalid admin credentials. Use: admin.user@bictda.bo.gov.ng');
    } else {
      navigate('/');
    }
  };

  const handleInstructorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login('instructor', 'John Instructor', instructorEmail);
    if (!success) {
      alert('Invalid instructor credentials. Use: instructor@bictda.bo.gov.ng');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-slate-200/40 rounded-full blur-lg animate-pulse delay-500" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left">
            <div className="mb-12">
              {/* Logo and Brand */}
              <div className="flex items-center justify-center lg:justify-start mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <img 
                      src="/bictda-logo.png" 
                      alt="BICTDA Logo" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    BICTDA
                  </h1>
                  <p className="text-blue-600 font-semibold text-lg">Digital Literacy Program</p>
                </div>
              </div>
              
              <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
                Information Management System
              </h2>
              <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                Empowering communities through digital literacy and skills development. 
                Transform lives through technology education.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Trainee Management</h3>
                <p className="text-sm text-slate-600">Track and manage student progress with advanced analytics</p>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Course Analytics</h3>
                <p className="text-sm text-slate-600">Monitor learning outcomes and performance metrics</p>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Centre Operations</h3>
                <p className="text-sm text-slate-600">Manage training centers and resource allocation</p>
              </div>
            </div>

            <div className="text-sm text-slate-500 space-y-1">
              <p>© 2024 Borno Information and Communication Technology Development Agency</p>
              <p>Empowering Borno State through technology and innovation</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                  Sign in to access your dashboard
                </CardDescription>
                
                {/* Language Selector */}
                <div className="flex justify-center mt-6">
                  <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ha' | 'kr')}>
                    <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white backdrop-blur-sm">
                      <Globe className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ha">Hausa</SelectItem>
                      <SelectItem value="kr">Kanuri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-xl">
                    <TabsTrigger 
                      value="admin" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </TabsTrigger>
                    <TabsTrigger 
                      value="instructor" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Instructor
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="admin">
                    <form onSubmit={handleAdminLogin} className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="adminEmail" className="text-slate-700 font-medium">Admin Email</Label>
                        <Input
                          id="adminEmail"
                          type="email"
                          value={adminEmail}
                          onChange={e => setAdminEmail(e.target.value)}
                          placeholder="admin.user@bictda.bo.gov.ng"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg rounded-xl h-12 transition-all duration-200 hover:shadow-xl"
                      >
                        Login as Admin
                      </Button>
                      <div className="text-xs text-slate-500 text-center bg-slate-50 rounded-lg p-3">
                        Demo: admin.user@bictda.bo.gov.ng
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="instructor">
                    <form onSubmit={handleInstructorLogin} className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="instructorEmail" className="text-slate-700 font-medium">Instructor Email</Label>
                        <Input
                          id="instructorEmail"
                          type="email"
                          value={instructorEmail}
                          onChange={e => setInstructorEmail(e.target.value)}
                          placeholder="instructor@bictda.bo.gov.ng"
                          className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl h-12"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg rounded-xl h-12 transition-all duration-200 hover:shadow-xl"
                      >
                        Login as Instructor
                      </Button>
                      <div className="text-xs text-slate-500 text-center bg-slate-50 rounded-lg p-3">
                        Demo: instructor@bictda.bo.gov.ng
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;