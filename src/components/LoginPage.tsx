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
import { sendPasswordResetEmail } from '@/lib/firebase';
import { GraduationCap, Shield, Building2, Users, BookOpen, Globe, Sparkles, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowRight, Zap, Target, Award, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InstructorSignup from './InstructorSignup';

const LoginPage: React.FC = () => {
  const { login, checkAdminUser } = useAppContext();
  const { t, language, setLanguage } = useLanguage();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [instructorPassword, setInstructorPassword] = useState('');
  const [activeTab, setActiveTab] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login('admin', 'Admin User', adminEmail, undefined, adminPassword);
      if (success) {
        navigate('/');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstructorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login('instructor', 'Instructor', instructorEmail, undefined, instructorPassword);
      if (success) {
        navigate('/');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstructorPasswordReset = () => {
    setResetEmail('');
    setShowResetDialog(true);
  };

  const confirmPasswordReset = async () => {
    if (!resetEmail.trim()) {
      setError('Please enter an email address.');
      return;
    }
    
    setIsResettingPassword(true);
    setError('');
    
    try {
      // Send password reset email using Firebase
      await sendPasswordResetEmail(resetEmail.trim());
      
      // Show success message
      setError('Password reset link has been sent to your email address. Please check your inbox.');
      // Clear the error after 5 seconds
      setTimeout(() => setError(''), 5000);
      setShowResetDialog(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Show signup form if requested
  if (showSignup) {
    return <InstructorSignup onBackToLogin={() => setShowSignup(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* Floating Elements with Animation */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-slate-200/40 rounded-full blur-lg animate-pulse delay-500" />
      <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-purple-200/30 rounded-full blur-lg animate-pulse delay-1500" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Features */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              {/* Logo and Brand */}
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/bictda-logo.png" 
                      alt="BICTDA Logo" 
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
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
              
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
                Information Management System
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Empowering communities through digital literacy and skills development.
              </p>
            </div>

            {/* Feature Cards with Hover Effects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="group bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1 text-sm">Trainee Management</h3>
                <p className="text-xs text-slate-600">Track and manage student progress</p>
              </div>
              
              <div className="group bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1 text-sm">Digital Skills</h3>
                <p className="text-xs text-slate-600">Comprehensive training programs</p>
              </div>
              
              <div className="group bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1 text-sm">Real-time Analytics</h3>
                <p className="text-xs text-slate-600">Live insights and tracking</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-sm bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">Welcome Back</CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  Access your BICTDA dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Language Selector */}
                <div className="flex justify-center mb-4">
                  <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ha' | 'kr')}>
                    <SelectTrigger className="w-28 bg-slate-50 border-slate-200">
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

                {/* Error Display */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">{error}</span>
                  </div>
                )}

                {/* Login Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="admin" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </TabsTrigger>
                    <TabsTrigger 
                      value="instructor" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Instructor
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="admin" className="space-y-3 mt-4">
                    <form onSubmit={handleAdminLogin} className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email" className="text-slate-700 font-medium text-sm">
                          Admin Email
                        </Label>
                        <div className="relative">
                          <Input
                            id="admin-email"
                            type="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Shield className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="admin-password" className="text-slate-700 font-medium text-sm">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="admin-password"
                            type={showPassword ? "text" : "password"}
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 pr-10 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In as Admin
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>


                  </TabsContent>

                  <TabsContent value="instructor" className="space-y-3 mt-4">
                    <form onSubmit={handleInstructorLogin} className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="instructor-email" className="text-slate-700 font-medium text-sm">
                          Instructor Email
                        </Label>
                        <div className="relative">
                          <Input
                            id="instructor-email"
                            type="email"
                            value={instructorEmail}
                            onChange={(e) => setInstructorEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            required
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <GraduationCap className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="instructor-password" className="text-slate-700 font-medium text-sm">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="instructor-password"
                            type={showPassword ? "text" : "password"}
                            value={instructorPassword}
                            onChange={(e) => setInstructorPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 pr-10 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In as Instructor
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                    
                    {/* Reset Password Button */}
                    <div className="text-center pt-2">
                      <Button 
                        type="button" 
                        onClick={handleInstructorPasswordReset}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                        disabled={isResettingPassword}
                      >
                        {isResettingPassword ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending Reset Link...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Reset Password
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Sign Up Option */}
                    <div className="text-center pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-3">New instructor?</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowSignup(true)}
                        className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Instructor Account
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Enter your instructor email address to receive a password reset link.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full"
                disabled={isResettingPassword}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowResetDialog(false)}
                className="flex-1"
                disabled={isResettingPassword}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPasswordReset}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                disabled={isResettingPassword || !resetEmail.trim()}
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;