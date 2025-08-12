import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Edit, 
  Save, 
  X, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye, 
  Clock, 
  Wifi, 
  WifiOff,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Building,
  FileText
} from 'lucide-react';

interface InstructorManagementProps {
  currentUser: { role: 'instructor' | 'admin' | null; name: string; centre_name?: string } | null;
}

const InstructorManagement: React.FC<InstructorManagementProps> = ({ currentUser }) => {
  const { instructors, updateInstructor, deleteInstructor, approveInstructor, revokeInstructor } = useAppContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'revoked' | 'active'>('all');
  const [editingInstructor, setEditingInstructor] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [instructorToReject, setInstructorToReject] = useState<any>(null);

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = searchTerm === '' || 
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.centre_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.lga.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || instructor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (instructor: any) => {
    setEditingInstructor(instructor.id);
    setEditData({
      name: instructor.name,
      email: instructor.email,
      phone_number: instructor.phone_number,
      lga: instructor.lga,
      centre_name: instructor.centre_name,
      technical_manager_name: instructor.technical_manager_name,
    });
  };

  const handleSave = async (id: number) => {
    try {
      await updateInstructor(id, {
        name: editData.name,
        email: editData.email,
        phone_number: editData.phone_number,
        lga: editData.lga,
        centre_name: editData.centre_name,
        technical_manager_name: editData.technical_manager_name,
      });
      setEditingInstructor(null);
      setEditData({});
      toast({ title: 'Success', description: 'Instructor information updated successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update instructor information', variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setEditingInstructor(null);
    setEditData({});
  };

  const handleChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleApprove = async (id: number) => {
    try {
      await approveInstructor(id);
      toast({ title: 'Success', description: 'Instructor approved successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve instructor', variant: 'destructive' });
    }
  };

  const handleRevoke = async (id: number, reason?: string) => {
    try {
      await revokeInstructor(id, reason);
      toast({ title: 'Success', description: 'Instructor access revoked successfully!' });
      setShowRejectionModal(false);
      setRejectionReason('');
      setInstructorToReject(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to revoke instructor access', variant: 'destructive' });
    }
  };

  const openRejectionModal = (instructor: any) => {
    setInstructorToReject(instructor);
    setShowRejectionModal(true);
  };

  const handleRejectionSubmit = () => {
    if (instructorToReject) {
      handleRevoke(instructorToReject.id, rejectionReason);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this instructor? This action cannot be undone.')) {
      try {
        await deleteInstructor(id);
        toast({ title: 'Success', description: 'Instructor deleted successfully!' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete instructor', variant: 'destructive' });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">Pending Approval</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Approved</Badge>;
      case 'active':
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">Active</Badge>;
      case 'revoked':
        return <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">Revoked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getOnlineStatus = (isOnline: boolean) => {
    return isOnline ? (
      <div className="flex items-center gap-1 text-green-600">
        <Wifi className="w-3 h-3" />
        <span className="text-xs">Online</span>
      </div>
    ) : (
      <div className="flex items-center gap-1 text-gray-500">
        <WifiOff className="w-3 h-3" />
        <span className="text-xs">Offline</span>
      </div>
    );
  };

  const centreOptions = [
    "DIKWA DIGITAL LITERACY CENTRE",
    "GAJIRAM ICT CENTER", 
    "GUBIO DIGITAL LITERACY CENTRE",
    "KAGA DIGITAL LITERACY CENTRE",
    "MONGUNO DIGITAL LITERACY CENTRE",
    "MAFA DIGITAL LITERACY CENTRE",
    "DAMASAK DIGITAL LITERACY CENTER",
    "BAYO DIGITAL LITERACY CENTER"
  ];

  const stats = {
    total: instructors.length,
    pending: instructors.filter(i => i.status === 'pending').length,
    approved: instructors.filter(i => i.status === 'approved').length,
    active: instructors.filter(i => i.status === 'active').length,
    revoked: instructors.filter(i => i.status === 'revoked').length,
    online: instructors.filter(i => i.is_online).length,
    // Real-time statistics for selected instructor
    weeksActive: selectedInstructor ? 12 : 0, // This would be calculated based on registration date
    traineesCount: selectedInstructor ? 45 : 0, // This would be calculated from trainees table
    reportsCount: selectedInstructor ? 24 : 0, // This would be calculated from reports tables
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Instructor Management
          </h2>
          <p className="text-slate-600 mt-1">Manage all registered instructors and their access</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredInstructors.length} of {stats.total} Instructors
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Approved</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Revoked</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.revoked}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Online</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.online}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search instructors by name, email, center, or LGA..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
             </Card>

       {/* Selected Instructor Statistics */}
       {selectedInstructor && (
         <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
           <CardHeader className="flex flex-row items-center justify-between">
             <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
               <UserCheck className="w-5 h-5 text-blue-600" />
               {selectedInstructor.name} - Performance Statistics
             </CardTitle>
             <Button
               size="sm"
               variant="outline"
               onClick={() => setSelectedInstructor(null)}
               className="text-slate-600"
             >
               <X className="w-4 h-4 mr-1" />
               Clear
             </Button>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                 <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                 <div className="text-sm font-medium text-slate-700">Weeks Active</div>
                 <div className="text-xs text-slate-500 mt-1">Since registration</div>
               </div>
               <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                 <div className="text-3xl font-bold text-emerald-600 mb-2">45</div>
                 <div className="text-sm font-medium text-slate-700">Trainees</div>
                 <div className="text-xs text-slate-500 mt-1">Currently assigned</div>
               </div>
               <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                 <div className="text-3xl font-bold text-purple-600 mb-2">24</div>
                 <div className="text-sm font-medium text-slate-700">Reports</div>
                 <div className="text-xs text-slate-500 mt-1">Submitted this month</div>
               </div>
             </div>
           </CardContent>
         </Card>
       )}

       {/* Pending Approvals Section */}
      {stats.pending > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Clock className="w-5 h-5 text-yellow-600" />
              Pending Approvals ({stats.pending})
            </CardTitle>
            <p className="text-yellow-700 text-sm">
              These instructors are waiting for your approval to access the system.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInstructors
                .filter(instructor => instructor.status === 'pending')
                .map((instructor) => (
                  <div key={instructor.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {instructor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{instructor.name}</h4>
                          <p className="text-sm text-slate-600">{instructor.email}</p>
                          <p className="text-xs text-slate-500">{instructor.centre_name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(instructor.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRejectionModal(instructor)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Instructors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInstructors.map((instructor) => (
          <Card key={instructor.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {instructor.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      {instructor.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(instructor.status)}
                      {getOnlineStatus(instructor.is_online)}
                    </div>
                  </div>
                </div>
                                 <div className="flex gap-2">
                   <Button
                     size="sm"
                     variant="outline"
                     onClick={() => {
                       setSelectedInstructor(instructor);
                     }}
                   >
                     <Eye className="w-4 h-4" />
                   </Button>
                  {editingInstructor === instructor.id ? (
                    <>
                      <Button size="sm" onClick={() => handleSave(instructor.id)} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(instructor)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {editingInstructor === instructor.id ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={editData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input
                      value={editData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input
                      value={editData.phone_number}
                      onChange={(e) => handleChange('phone_number', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Center</Label>
                    <Select value={editData.centre_name} onValueChange={(value) => handleChange('centre_name', value)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select center" />
                      </SelectTrigger>
                      <SelectContent>
                        {centreOptions.map(centre => (
                          <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{instructor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{instructor.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{instructor.lga}</span>
                  </div>
                                     {instructor.centre_name && (
                     <div className="flex items-center gap-2">
                       <Building className="w-4 h-4 text-slate-400" />
                       <span>{instructor.centre_name}</span>
                     </div>
                   )}
                   
                   {/* Quick Stats Preview */}
                   <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
                     <div className="flex items-center gap-1">
                       <Clock className="w-3 h-3" />
                       <span>12w</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <Users className="w-3 h-3" />
                       <span>45 trainees</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <FileText className="w-3 h-3" />
                       <span>24 reports</span>
                     </div>
                   </div>
                 </div>
               )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {instructor.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleApprove(instructor.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                )}
                {instructor.status === 'approved' && (
                  <Button
                    size="sm"
                    onClick={() => openRejectionModal(instructor)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Revoke
                  </Button>
                )}
                {instructor.status === 'revoked' && (
                  <Button
                    size="sm"
                    onClick={() => handleApprove(instructor.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Re-approve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(instructor.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Instructors Found</h3>
            <p className="text-slate-500">
              {searchTerm || statusFilter !== 'all'
                ? `No instructors match your search criteria`
                : 'No instructors have been registered yet.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rejection Reason Modal */}
      <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Revoke Instructor Access
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke access for {instructorToReject?.name}? 
              You can provide a reason for the rejection (optional).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Reason for Rejection (Optional)
              </label>
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionModal(false);
                setRejectionReason('');
                setInstructorToReject(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectionSubmit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Revoke Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorManagement;
