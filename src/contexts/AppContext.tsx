import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  auth, 
  signUpWithEmail, 
  signInWithEmail, 
  signOutUser, 
  onAuthStateChange, 
  getUserData,
  addInstructorToFirestore 
} from '@/lib/firebase';
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/emailService';

interface Trainee {
  id: number;
  serial_number?: number;
  id_number: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  age?: number;
  educational_background: string;
  employment_status: string;
  centre_name: string;
  passed?: boolean;
  failed?: boolean;
  not_sat_for_exams?: boolean;
  dropout?: boolean;
  nin?: string;
  phone_number?: string;
  cohort_number: number;
  learner_category?: string;
  email?: string;
  lga?: string;
  people_with_special_needs?: boolean;
  address?: string | null;
  created_at?: string;
}

interface Instructor {
  id: number;
  name: string;
  lga: string;
  technical_manager_name: string;
  email: string;
  phone_number: string;
  centre_name?: string;
  status: 'pending' | 'approved' | 'revoked' | 'active';
  is_online: boolean;
  last_login?: string;
  created_at?: string;
}

interface Centre {
  id: number;
  centre_name: string;
  lga: string;
  technical_manager_name: string;
  technical_manager_email: string;
  contact_number: string;
  declared_capacity: number;
  usable_capacity: number;
  computers_present: number;
  computers_functional: number;
  power_available: boolean;
  power_condition: string;
  internet_available: boolean;
  fans_present: number;
  air_condition_present: number;
  fans_functional: number;
  air_condition_functional: number;
  lighting_available: boolean;
  windows_condition: string;
  water_functional: boolean;
  created_at?: string;
}

interface WeeklyReport {
  id: number;
  centre_name: string;
  technical_manager_name: string;
  week_number: number;
  year: number;
  comments: string;
  trainees_enrolled: number;
  trainees_completed: number;
  trainees_dropped: number;
  created_at?: string;
}

interface MEReport {
  id: number;
  centre_name: string;
  technical_manager_name: string;
  month: number;
  year: number;
  comments: string;
  total_enrollment: number;
  total_completion: number;
  total_dropout: number;
  employment_rate: number;
  created_at?: string;
}

interface Announcement {
  id: string;
  message: string;
  sender_name: string;
  sender_role: string;
  created_at: string;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentUser: { role: 'instructor' | 'admin' | null; name: string; centre_name?: string } | null;
  login: (role: 'instructor' | 'admin', name: string, email?: string, centre_name?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  trainees: Trainee[];
  instructors: Instructor[];
  centres: Centre[];
  weeklyReports: WeeklyReport[];
  meReports: MEReport[];
  loading: boolean;
  addTrainee: (trainee: Omit<Trainee, 'id'>) => Promise<void>;
  addInstructor: (instructor: Omit<Instructor, 'id'>) => Promise<void>;
  updateInstructor: (id: number, instructor: Partial<Instructor>) => Promise<void>;
  deleteInstructor: (id: number) => Promise<void>;
  approveInstructor: (id: number) => Promise<void>;
               revokeInstructor: (id: number, reason?: string) => Promise<void>;
  addCentre: (centre: Omit<Centre, 'id'>) => Promise<void>;
  updateCentre: (id: number, centre: Partial<Centre>) => Promise<void>;
  addWeeklyReport: (report: Omit<WeeklyReport, 'id'>) => Promise<void>;
  addMEReport: (report: Omit<MEReport, 'id'>) => Promise<void>;
  refreshData: () => Promise<void>;
  getCentresByManager: (managerName: string) => Centre[];
  getCentresByCentreName: (centreName: string) => Centre[];
  announcements: Announcement[];
  addAnnouncement: (message: string) => Promise<void>;
  announcementsLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ role: 'instructor' | 'admin' | null; name: string; email?: string; centre_name?: string } | null>(null);
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [meReports, setMEReports] = useState<MEReport[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const { toast } = useToast();

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Test Supabase connection
  useEffect(() => {
    console.log('🚀 App starting...');
    console.log('🚀 Supabase client:', supabase);
    
    // Test connection
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('🔍 Supabase connection test:', { data, error });
    });
  }, []);

  // Fetch announcements from Supabase
  const fetchAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      console.log('🔍 Fetching announcements from Supabase...');
      
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('⚠️ Announcements table might not exist:', error);
        setAnnouncements([]);
        return;
      }

      console.log('✅ Announcements loaded:', data?.length || 0, 'records');
      setAnnouncements(data || []);
    } catch (error) {
      console.warn('⚠️ Error fetching announcements (table might not exist):', error);
      setAnnouncements([]);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  // Set up real-time subscription for announcements
  useEffect(() => {
    console.log('🔔 Setting up real-time announcements subscription...');
    
    const channel = supabase
      .channel('announcements')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements'
        },
        (payload) => {
          console.log('🔔 Real-time announcement update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newAnnouncement = payload.new as Announcement;
            setAnnouncements(prev => [newAnnouncement, ...prev]);
            
            // Show toast notification for new announcements
            toast({
              title: "New Announcement",
              description: newAnnouncement.message,
              duration: 5000,
            });
          } else if (payload.eventType === 'DELETE') {
            setAnnouncements(prev => prev.filter(a => a.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setAnnouncements(prev => prev.map(a => a.id === payload.new.id ? payload.new as Announcement : a));
          }
        }
      )
      .subscribe();

    // Fetch initial announcements
    fetchAnnouncements();

    return () => {
      console.log('🔔 Cleaning up announcements subscription...');
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Set up real-time subscription for instructors
  useEffect(() => {
    console.log('👥 Setting up real-time instructors subscription...');
    
    const channel = supabase
      .channel('instructors')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'instructors'
        },
        (payload) => {
          console.log('👥 Real-time instructor update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newInstructor = payload.new as Instructor;
            setInstructors(prev => [...prev, newInstructor]);
            
            // Show toast notification for new instructor registrations
            if (currentUser?.role === 'admin') {
              toast({
                title: "New Instructor Registration",
                description: `${newInstructor.name} has registered and is pending approval.`,
                duration: 5000,
              });
            }
          } else if (payload.eventType === 'DELETE') {
            setInstructors(prev => prev.filter(i => i.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setInstructors(prev => prev.map(i => i.id === payload.new.id ? payload.new as Instructor : i));
            
            // Show toast notification for status changes
            if (currentUser?.role === 'admin') {
              const updatedInstructor = payload.new as Instructor;
              const oldInstructor = payload.old as Instructor;
              
              if (updatedInstructor.status !== oldInstructor.status) {
                toast({
                  title: "Instructor Status Updated",
                  description: `${updatedInstructor.name} status changed to ${updatedInstructor.status}.`,
                  duration: 3000,
                });
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('👥 Cleaning up instructors subscription...');
      supabase.removeChannel(channel);
    };
  }, [currentUser?.role, toast]);

  // Fetch trainees from Supabase
  const fetchTrainees = async () => {
    try {
      console.log('🔍 TESTING - fetchTrainees function called');
      console.log('🔍 Fetching trainees from Supabase...');
      console.log('🔍 Supabase URL:', (import.meta as any).env.VITE_SUPABASE_URL);
      console.log('🔍 Supabase Key exists:', !!(import.meta as any).env.VITE_SUPABASE_ANON_KEY);
      
      // First get the total count
      const { count, error: countError } = await supabase
        .from('trainees')
        .select('*', { count: 'exact', head: true });

      console.log('🔍 Total records in table:', count);
      
      // Fetch ALL records using pagination
      let allTrainees: any[] = [];
      let from = 0;
      const pageSize = 1000;
      
      while (from < count) {
        console.log(`🔍 Fetching records ${from} to ${from + pageSize}...`);
        
        const { data: pageData, error: pageError } = await supabase
          .from('trainees')
          .select('*')
          .order('full_name')
          .range(from, from + pageSize - 1);

        if (pageError) {
          console.error('❌ Page error:', pageError);
          throw pageError;
        }

        if (pageData) {
          allTrainees = [...allTrainees, ...pageData];
          console.log(`✅ Fetched ${pageData.length} records, total so far: ${allTrainees.length}`);
        }

        from += pageSize;
      }

      console.log('🔍 Raw Supabase response:', { data: allTrainees, error: null });
      console.log('🔍 Data type:', typeof allTrainees);
      console.log('🔍 Data is array:', Array.isArray(allTrainees));
      console.log('🔍 Data length:', allTrainees?.length);
      console.log('🔍 First few records:', allTrainees?.slice(0, 3));

      console.log('✅ Trainees loaded:', allTrainees?.length || 0, 'records');
      if (allTrainees && allTrainees.length > 0) {
        console.log('📋 First trainee:', allTrainees[0]);
        console.log('📋 First trainee keys:', Object.keys(allTrainees[0]));
        console.log('📋 Sample trainees (first 3):', allTrainees.slice(0, 3));
        
        // Only remove exact duplicates (same ID) - don't remove by name as they might be different people
        console.log('🔍 STARTING DEDUPLICATION...');
        
        // Debug: Show some sample names
        console.log('🔍 Sample names before deduplication:', allTrainees.slice(0, 5).map(t => `"${t.full_name}"`));
        
        const uniqueTrainees = allTrainees.filter((trainee, index, self) => {
          // Only remove if exact same ID exists earlier in the array
          const isFirst = index === self.findIndex(t => t.id === trainee.id);
          if (!isFirst) {
            console.log('🔍 Removing duplicate ID:', trainee.id, trainee.full_name);
          }
          return isFirst;
        });
        
        console.log('🔍 DEDUPLICATION COMPLETE');
        console.log('🔍 Sample names after deduplication:', uniqueTrainees.slice(0, 5).map(t => `"${t.full_name}"`));
        
        console.log('🔍 After deduplication:', uniqueTrainees.length, 'unique trainees');
        console.log('🔍 Original count:', allTrainees.length);
        console.log('🔍 Removed duplicates:', allTrainees.length - uniqueTrainees.length);
        
        // Check for duplicates by name
        const nameCounts = allTrainees.reduce((acc, trainee) => {
          acc[trainee.full_name] = (acc[trainee.full_name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const duplicates = Object.entries(nameCounts).filter(([name, count]) => (count as number) > 1);
        console.log('🔍 Duplicates by name:', duplicates);
        console.log('🔍 Number of duplicate names:', duplicates.length);
        
        // Check for duplicates by ID
        const idCounts = allTrainees.reduce((acc, trainee) => {
          acc[trainee.id] = (acc[trainee.id] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        
        const duplicateIds = Object.entries(idCounts).filter(([id, count]) => (count as number) > 1);
        console.log('🔍 Duplicates by ID:', duplicateIds);
        console.log('🔍 Number of duplicate IDs:', duplicateIds.length);
        console.log('🔍 Setting trainees state with:', uniqueTrainees.length, 'records');
        setTrainees(uniqueTrainees);
        console.log('🔍 State should now have:', uniqueTrainees.length, 'trainees');
      } else {
        console.log('⚠️ No data returned from Supabase');
        setTrainees([]);
      }
    } catch (error) {
      console.error('❌ Error fetching trainees:', error);
    }
  };

  // Fetch centres from Supabase
  const fetchCentres = async () => {
    try {
      console.log('🔍 Fetching centres from Supabase...');
      const { data, error } = await supabase
        .from('centres')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('⚠️ Centres table might not exist:', error);
        setCentres([]);
        return;
      }

      if (data) {
        console.log('✅ Centres loaded:', data.length, 'records');
        setCentres(data);
      } else {
        console.log('⚠️ No centre data returned from Supabase');
        setCentres([]);
      }
    } catch (error) {
      console.warn('⚠️ Error fetching centres (table might not exist):', error);
      setCentres([]);
    }
  };

  // Fetch instructors from Supabase
  const fetchInstructors = async () => {
    try {
      console.log('🔍 Fetching instructors from Supabase...');
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('⚠️ Instructors table might not exist:', error);
        setInstructors([]);
        return;
      }

      if (data) {
        console.log('✅ Instructors loaded:', data.length, 'records');
        setInstructors(data);
      } else {
        console.log('⚠️ No instructor data returned from Supabase');
        setInstructors([]);
      }
    } catch (error) {
      console.warn('⚠️ Error fetching instructors (table might not exist):', error);
      setInstructors([]);
    }
  };

  const refreshData = async () => {
    console.log('🔄 Refreshing data...');
    setLoading(true);
    await fetchTrainees();
    await fetchCentres();
    await fetchInstructors();
    setLoading(false);
    console.log('✅ Data refresh complete');
  };

  // Load data on component mount - don't block UI
  useEffect(() => {
    console.log('📦 AppProvider mounted, loading data...');
    // Set loading to false immediately to show UI
    setLoading(false);
    // Load data in background
    refreshData();
  }, []);

    const login = async (role: 'instructor' | 'admin', name: string, email?: string, centre_name?: string, password?: string) => {
    try {
      console.log('🔐 Attempting login for:', { role, name, email, centre_name });
      
      if (!email) {
        throw new Error('Email is required for login');
      }

      if (!password) {
        throw new Error('Password is required for login');
      }

      // Use Firebase authentication
      let user = null;
      try {
        user = await signInWithEmail(email, password);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase authentication failed:', firebaseError);
        
        // For development: Allow admin login with hardcoded credentials
        if (role === 'admin' && email === 'admin@bictda.com' && password === 'admin123') {
          console.log('🔄 Using development admin login');
          user = { email, uid: 'dev-admin-uid' };
        } else {
          throw firebaseError;
        }
      }
      
      if (user) {
        // Get additional user data from Firestore
        let userData = null;
        try {
          userData = await getUserData(user.uid);
        } catch (firestoreError) {
          console.warn('⚠️ Firestore offline or error:', firestoreError);
          // Continue with login even if Firestore is offline
        }
        
        // For instructors, check approval status in Supabase
        if (role === 'instructor') {
          try {
            const { data: instructorData, error } = await supabase
              .from('instructors')
              .select('status')
              .eq('email', email)
              .single();
            
            if (error) {
              console.warn('⚠️ Instructors table might not exist:', error);
              // If table doesn't exist, allow login (for development)
              console.log('🔄 Allowing login without status check (table missing)');
            } else if (!instructorData) {
              console.warn('⚠️ Instructor not found in database, allowing login');
            } else {
              if (instructorData.status === 'pending') {
                throw new Error('Your account is pending approval. Please wait for admin approval before logging in.');
              }
              
              if (instructorData.status === 'revoked') {
                throw new Error('Your account access has been revoked. Please contact the administrator.');
              }
              
              // Update online status
              try {
                await supabase
                  .from('instructors')
                  .update({ is_online: true, last_login: new Date().toISOString() })
                  .eq('email', email);
              } catch (updateError) {
                console.warn('⚠️ Could not update online status:', updateError);
              }
            }
          } catch (supabaseError) {
            console.warn('⚠️ Supabase error during status check:', supabaseError);
            // Allow login even if Supabase is having issues
          }
        }
        
        setCurrentUser({ 
          role, 
          name: userData?.name || name, 
          email: user.email || email, 
          centre_name: userData?.centre_name || centre_name 
        });
        
        console.log('✅ Login successful');
      return true;
    }
      
    return false;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      // If current user is an instructor, set them as offline
      if (currentUser?.role === 'instructor' && currentUser?.email) {
        await supabase
          .from('instructors')
          .update({ is_online: false })
          .eq('email', currentUser.email);
      }
      
      await signOutUser();
    setCurrentUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  // Add trainee to Supabase
  const addTrainee = async (trainee: Omit<Trainee, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('trainees')
        .insert([trainee])
        .select()
        .single();
      
      if (error) throw error;
      setTrainees(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding trainee:', error);
      throw error;
    }
  };

  // Add instructor to Supabase and Firebase
  const addInstructor = async (instructor: Omit<Instructor, 'id'>) => {
    try {
      console.log('🚀 Starting instructor registration process...');
      console.log('📧 Email:', instructor.email);
      
      // Create Firebase user account first
      console.log('🔥 Creating Firebase user account...');
      const user = await signUpWithEmail(instructor.email, 'defaultPassword123', {
        name: instructor.name,
        lga: instructor.lga,
        technical_manager_name: instructor.technical_manager_name,
        phone_number: instructor.phone_number,
        centre_name: instructor.centre_name,
        role: 'instructor',
        status: 'pending',
        is_online: false
      });
      
      console.log('✅ Firebase user created successfully:', user.uid);

      // Try to add to Supabase, but don't fail if table doesn't exist
      try {
        console.log('🗄️ Attempting to add to Supabase...');
        const { data, error } = await supabase
          .from('instructors')
          .insert([instructor])
          .select()
          .single();
        
        if (error) {
          console.warn('⚠️ Supabase table error (table might not exist):', error);
          // Don't throw error, just log it
        } else {
          console.log('✅ Added to Supabase successfully');
          setInstructors(prev => [...prev, data]);
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase error (table might not exist):', supabaseError);
        // Don't fail the registration if Supabase fails
      }
      
      console.log('✅ Instructor registration completed successfully!');
    } catch (error) {
      console.error('❌ Error in instructor registration:', error);
      throw error;
    }
  };

  // Update instructor in Supabase
  const updateInstructor = async (id: number, instructor: Partial<Instructor>) => {
    try {
      const { data, error } = await supabase
        .from('instructors')
        .update(instructor)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setInstructors(prev => prev.map(i => i.id === id ? data : i));
    } catch (error) {
      console.error('Error updating instructor:', error);
      throw error;
    }
  };

  // Delete instructor from Supabase
  const deleteInstructor = async (id: number) => {
    try {
      const { error } = await supabase
        .from('instructors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setInstructors(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting instructor:', error);
      throw error;
    }
  };

  // Approve instructor
  const approveInstructor = async (id: number) => {
    try {
      console.log('✅ Approving instructor with ID:', id);
      
      // First get the instructor data
      const { data: instructorData, error: fetchError } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('❌ Error fetching instructor data:', fetchError);
        throw fetchError;
      }
      
      if (!instructorData) {
        throw new Error('Instructor not found');
      }
      
      // Update the status to approved
      const { data, error } = await supabase
        .from('instructors')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setInstructors(prev => prev.map(i => i.id === id ? data : i));
      
      // Send approval email
      try {
        console.log('📧 Sending approval email to:', instructorData.email);
        await sendApprovalEmail(
          instructorData.email,
          instructorData.name,
          instructorData.centre_name || 'Assigned Centre'
        );
        console.log('✅ Approval email sent successfully');
      } catch (emailError) {
        console.warn('⚠️ Failed to send approval email:', emailError);
        // Don't fail the approval if email fails
      }
      
      console.log('✅ Instructor approved successfully:', instructorData.name);
    } catch (error) {
      console.error('❌ Error approving instructor:', error);
      throw error;
    }
  };

  // Revoke instructor access
  const revokeInstructor = async (id: number, reason?: string) => {
    try {
      console.log('❌ Revoking instructor with ID:', id);
      
      // First get the instructor data
      const { data: instructorData, error: fetchError } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('❌ Error fetching instructor data:', fetchError);
        throw fetchError;
      }
      
      if (!instructorData) {
        throw new Error('Instructor not found');
      }
      
      // Update the status to revoked
      const { data, error } = await supabase
        .from('instructors')
        .update({ status: 'revoked' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setInstructors(prev => prev.map(i => i.id === id ? data : i));
      
      // Send revocation email
      try {
        console.log('📧 Sending revocation email to:', instructorData.email);
        await sendRejectionEmail(
          instructorData.email,
          instructorData.name,
          reason
        );
        console.log('✅ Revocation email sent successfully');
      } catch (emailError) {
        console.warn('⚠️ Failed to send revocation email:', emailError);
        // Don't fail the revocation if email fails
      }
      
      console.log('✅ Instructor revoked successfully:', instructorData.name);
    } catch (error) {
      console.error('❌ Error revoking instructor:', error);
      throw error;
    }
  };

  // Add centre to Supabase
  const addCentre = async (centre: Omit<Centre, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('centres')
        .insert([centre])
        .select()
        .single();
      
      if (error) throw error;
      setCentres(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding centre:', error);
      throw error;
    }
  };

  // Update centre in Supabase
  const updateCentre = async (id: number, centre: Partial<Centre>) => {
    try {
      const { data, error } = await supabase
        .from('centres')
        .update(centre)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setCentres(prev => prev.map(c => c.id === id ? data : c));
    } catch (error) {
      console.error('Error updating centre:', error);
      throw error;
    }
  };

  // Get centres by technical manager name
  const getCentresByManager = (managerName: string): Centre[] => {
    return centres.filter(centre => 
      centre.technical_manager_name.toLowerCase().includes(managerName.toLowerCase())
    );
  };

  // Get centres by centre name
  const getCentresByCentreName = (centreName: string): Centre[] => {
    return centres.filter(centre => 
      centre.centre_name.toLowerCase().includes(centreName.toLowerCase())
    );
  };

  // Add weekly report to Supabase
  const addWeeklyReport = async (report: Omit<WeeklyReport, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('weekly_reports')
        .insert([report])
        .select()
        .single();
      
      if (error) throw error;
      setWeeklyReports(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding weekly report:', error);
      throw error;
    }
  };

  // Add M&E report to Supabase
  const addMEReport = async (report: Omit<MEReport, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('me_reports')
        .insert([report])
        .select()
        .single();
      
      if (error) throw error;
      setMEReports(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding M&E report:', error);
      throw error;
    }
  };

  // Add announcement to Supabase
  const addAnnouncement = async (message: string) => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          message,
          sender_name: currentUser.name,
          sender_role: currentUser.role
        }])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ Announcement added:', data);
    } catch (error) {
      console.error('Error adding announcement:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentUser,
        login,
        logout,
        trainees,
        instructors,
        centres,
        weeklyReports,
        meReports,
        loading,
        addTrainee,
        addInstructor,
        updateInstructor,
        deleteInstructor,
        approveInstructor,
        revokeInstructor,
        addCentre,
        updateCentre,
        addWeeklyReport,
        addMEReport,
        refreshData,
        getCentresByManager,
        getCentresByCentreName,
        announcements,
        addAnnouncement,
        announcementsLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};