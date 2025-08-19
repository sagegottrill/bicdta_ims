// Helper function to standardize centre names
export function standardizeCentreName(centreName: string): string {
  const normalized = centreName.trim().toUpperCase();
  const standardNames = {
    'MAFADLC': 'MAFA DIGITAL LITERACY CENTRE',
    'MAFA': 'MAFA DIGITAL LITERACY CENTRE',
    'MAGUMERIDLC': 'MAGUMERI DIGITAL LITERACY CENTRE',
    'MAGUMERI': 'MAGUMERI DIGITAL LITERACY CENTRE',
    'KAGADLC': 'KAGA DIGITAL LITERACY CENTRE',
    'KAGA': 'KAGA DIGITAL LITERACY CENTRE',
    'GUBIODLC': 'GUBIO DIGITAL LITERACY CENTRE',
    'GUBIO': 'GUBIO DIGITAL LITERACY CENTRE',
    'GAJIRAMDLC': 'GAJIRAM DIGITAL LITERACY CENTRE',
    'GAJIRAM': 'GAJIRAM DIGITAL LITERACY CENTRE',
    'DIKWADLC': 'DIKWA DIGITAL LITERACY CENTRE',
    'DIKWA': 'DIKWA DIGITAL LITERACY CENTRE',
    'BAYODLC': 'BAYO DIGITAL LITERACY CENTRE',
    'BAYO': 'BAYO DIGITAL LITERACY CENTRE'
  };

  for (const [key, value] of Object.entries(standardNames)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  return centreName; // Return original if no match found
}

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
  addInstructorToFirestore,
  checkUserExists,
  sendPasswordResetEmail
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
  addInstructor: (instructor: Omit<Instructor, 'id'>, password?: string) => Promise<void>;
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
  getAllCentres: () => string[];
  getTraineesByCentre: (centreName: string) => Trainee[];
  getInstructorsByCentre: (centreName: string) => Instructor[];
  announcements: Announcement[];
  addAnnouncement: (message: string) => Promise<void>;
  announcementsLoading: boolean;
  checkAdminUser: (email: string) => Promise<void>;
}const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // ...existing code...

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
      
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (announcementsError) {
        console.warn('⚠️ Announcements table might not exist:', announcementsError);
        setAnnouncements([]);
        return;
      }

      console.log('✅ Announcements loaded:', announcementsData?.length || 0, 'records');
      setAnnouncements(announcementsData || []);
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
              title: 'New Announcement',
              description: newAnnouncement.message,
              duration: 5000,
            });
          } else if (payload.eventType === 'DELETE') {
            setAnnouncements(prev => prev.filter(a => a.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setAnnouncements(prev => prev.map(a => a.id === payload.new.id ? (payload.new as Announcement) : a));
          }
        }
      )
      .subscribe();

    // Ensure we have initial announcements
    fetchAnnouncements();

    return () => {
      console.log('🔔 Cleaning up announcements subscription...');
      supabase.removeChannel(channel);
    };
  }, []);

  // Set up real-time subscription for trainees
  useEffect(() => {
    console.log('🔔 Setting up real-time trainees subscription...');

    let retryCount = 0;
    const maxRetries = 3;
    
    const setupSubscription = async () => {
      try {
        // First ensure the table exists
        await ensureTraineesTable();
        
        const channel = supabase
          .channel('trainees')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'trainees'
            },
            (payload) => {
              console.log('🔔 Real-time trainee update:', payload);

              try {
                if (payload.eventType === 'INSERT') {
                  const newTrainee = payload.new as Trainee;
                  if (newTrainee && newTrainee.id) {
                    setTrainees(prev => {
                      // Prevent duplicates
                      const exists = prev.some(t => t.id === newTrainee.id);
                      if (exists) {
                        return prev;
                      }
                      return [newTrainee, ...prev];
                    });
                  }
                } else if (payload.eventType === 'DELETE') {
                  setTrainees(prev => prev.filter(t => t.id !== payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                  const updatedTrainee = payload.new as Trainee;
                  if (updatedTrainee && updatedTrainee.id) {
                    setTrainees(prev => prev.map(t => 
                      t.id === updatedTrainee.id ? updatedTrainee : t
                    ));
                  }
                }
              } catch (err) {
                console.warn('⚠️ Error handling trainees realtime payload:', err);
                // Refresh all data if there's an error
                fetchTrainees().catch(console.error);
              }
            }
          )
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              console.log('✅ Trainees subscription active');
              // Fetch initial data after successful subscription
              await fetchTrainees();
            } else if (status === 'CHANNEL_ERROR') {
              console.error('❌ Trainees subscription error');
              if (retryCount < maxRetries) {
                retryCount++;
                console.log(`🔄 Retrying subscription (attempt ${retryCount})...`);
                setupSubscription();
              }
            }
          });

        return channel;
      } catch (error) {
        console.error('❌ Error setting up trainees subscription:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`🔄 Retrying setup (attempt ${retryCount})...`);
          return setupSubscription();
        }
        return null;
      }
    };

    let activeChannel: any = null;
    
    setupSubscription().then(channel => {
      activeChannel = channel;
    }).catch(console.error);

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up trainees subscription...');
      if (activeChannel) {
        supabase.removeChannel(activeChannel);
      }
    };
  }, []);

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
      console.log('🔍 Starting optimized batch fetch for instructors...');
      setInstructors([]); // Clear existing data

      // First check if table exists, create if it doesn't
      const { error: testError } = await supabase
        .from('instructors')
        .select('id')
        .limit(1);

      if (testError && testError.code === '42P01') {
        console.log('🔄 Instructors table doesn\'t exist, creating it...');
        await createInstructorsTable();
      }

      // Get total count
      const { count, error: countError } = await supabase
        .from('instructors')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw new Error('Failed to get instructor count');
      }

      const pageSize = 1000;
      const batches = Math.ceil(count / pageSize);
      let from = 0;
      let loadedCount = 0;
      let allInstructors: Instructor[] = [];

      for (let i = 0; i < batches; i++) {
        try {
          console.log(`📄 Fetching instructor batch ${i + 1}...`);
          const { data, error } = await supabase
            .from('instructors')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, from + pageSize - 1);

          if (error) {
            console.error('❌ Batch fetch failed:', error);
            break;
          }

          if (data && data.length > 0) {
            // Filter and add valid instructors immediately
            const validData = data.filter(t => t && t.id && t.name);
            setInstructors(prev => [...prev, ...validData]);
            loadedCount += validData.length;
            console.log(`✅ Loaded ${loadedCount}/${count} total instructor records`);
          }

          from += pageSize;
        } catch (error) {
          console.error('❌ Error in fetchInstructors:', error);
          setInstructors([]);
        }
      }

      // Process and set batch
      const validData = allInstructors.filter(t => t && t.id && t.name);
      loadedCount += validData.length;

      setInstructors(prev => [...prev, ...validData]);
      console.log(`✅ Loaded ${loadedCount}/${count} total instructor records`);
      console.log('🎉 Instructor fetch complete');
    } catch (error) {
      console.error('❌ Error in fetchInstructors:', error);
      setInstructors([]);
    }
  };

  // Fetch trainees from Supabase with optimized pagination
  const fetchTrainees = async () => {
    try {
      console.log('🔍 Starting optimized batch fetch...');
      setTrainees([]); // Clear existing data
      
      // First ensure table exists
      const { error: testError } = await supabase
        .from('trainees')
        .select('id')
        .limit(1);

      if (testError && testError.code === '42P01') {
        console.log('🔄 Trainees table doesn\'t exist, creating it...');
        await ensureTraineesTable();
      }

      // Get total count
      const { count, error: countError } = await supabase
        .from('trainees')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw new Error('Failed to get count');
      }

      const pageSize = 1000;
      const batches = Math.ceil(count / pageSize);
      let from = 0;
      let loadedCount = 0;
      let allTrainees: Trainee[] = [];

      for (let i = 0; i < batches; i++) {
        try {
          console.log(`📄 Fetching batch ${i + 1}...`);
          const { data, error } = await supabase
            .from('trainees')
            .select('*')
            .order('full_name')
            .range(from, from + pageSize - 1);

          if (error) {
            console.error('❌ Batch fetch failed:', error);
            break;
          }

          if (data && data.length > 0) {
            // Filter and add valid trainees immediately
            const validData = data.filter(t => t && t.id && t.full_name);
            setTrainees(prev => [...prev, ...validData]);
            loadedCount += validData.length;
            console.log(`✅ Loaded ${loadedCount}/${count} total records`);
          }

          from += pageSize;
        } catch (error) {
          console.error('❌ Error in fetchTrainees:', error);
          setTrainees([]);
        }
      }

      // Process and set batch
      const validData = allTrainees.filter(t => t && t.id && t.full_name);
      loadedCount += validData.length;

      setTrainees(prev => [...prev, ...validData]);
      console.log(`✅ Loaded ${loadedCount}/${count} total records`);
      
      console.log('🎉 Fetch complete');
    } catch (error) {
      console.error('❌ Error in fetchTrainees:', error);
      setTrainees([]);
    }
  };

  // Helper to efficiently process and dedupe large trainee datasets
  const processAndSetTrainees = (allTrainees: any[]) => {
    try {
      console.log(`🔄 Processing ${allTrainees.length} trainees...`);
      
      // Use Set for efficient deduplication
      const seen = new Set();
      const uniqueTrainees = allTrainees.filter(trainee => {
        if (!trainee?.id || seen.has(trainee.id)) return false;
        seen.add(trainee.id);
        return true;
      });
      
      console.log(`📊 Found ${uniqueTrainees.length} unique trainees`);
      
      // Process in chunks to avoid memory issues
      const chunkSize = 1000;
      const validTrainees: any[] = [];
      
      for (let i = 0; i < uniqueTrainees.length; i += chunkSize) {
        const chunk = uniqueTrainees.slice(i, i + chunkSize);
        
        // Validate required fields
        const validChunk = chunk.filter(trainee => {
          const isValid = trainee?.id_number && 
                         trainee?.full_name && 
                         trainee?.gender && 
                         trainee?.educational_background && 
                         trainee?.employment_status && 
                         trainee?.cohort_number;
          
          if (!isValid) {
            console.warn('⚠️ Invalid trainee record:', trainee?.id_number || 'unknown ID');
          }
          return isValid;
        });

        // Standardize centre names for the chunk
        const standardizedChunk = validChunk.map(trainee => ({
          ...trainee,
          centre_name: standardizeCentreName(trainee.centre_name || '')
        }));

        validTrainees.push(...standardizedChunk);
        console.log(`✅ Processed chunk ${i/chunkSize + 1}, total valid: ${validTrainees.length}`);
      }

      console.log(`🎉 Successfully processed ${validTrainees.length} valid trainees`);
      
      // Update state with batching to avoid UI freezing
      const updateBatchSize = 1000;
      for (let i = 0; i < validTrainees.length; i += updateBatchSize) {
        const batch = validTrainees.slice(i, i + updateBatchSize);
        setTrainees(prev => [...prev, ...batch]);
      }

      console.log('✅ All trainees set in state');
    } catch (err) {
      console.error('❌ Error processing trainees:', err);
      // Try to salvage what we can
      try {
        const safeTrainees = allTrainees
          .filter(t => t && typeof t === 'object' && t.id)
          .map(t => ({
            ...t,
            centre_name: standardizeCentreName(t.centre_name || '')
          }));
        setTrainees(safeTrainees || []);
      } catch (setError) {
        console.error('❌ Failed to set trainees:', setError);
        setTrainees([]);
      }
    }
  };

  // ...rest of context code...


  // Standardize centre names
  const standardizeCentreNames = async () => {
    try {
      console.log('🔄 Standardizing centre names...');
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          UPDATE trainees 
          SET centre_name = CASE 
              WHEN centre_name ILIKE '%MAFADLC%' OR centre_name ILIKE '%MAFA%' 
                THEN 'MAFA DIGITAL LITERACY CENTRE'
              WHEN centre_name ILIKE '%MAGUMERIDLC%' OR centre_name ILIKE '%MAGUMERI%' 
                THEN 'MAGUMERI DIGITAL LITERACY CENTRE'
              WHEN centre_name ILIKE '%KAGADLC%' OR centre_name ILIKE '%KAGA%' 
                THEN 'KAGA DIGITAL LITERACY CENTRE'
              WHEN centre_name ILIKE '%GUBIODLC%' OR centre_name ILIKE '%GUBIO%' 
                THEN 'GUBIO DIGITAL LITERACY CENTRE'
              WHEN centre_name ILIKE '%GAJIRAMDLC%' OR centre_name ILIKE '%GAJIRAM%' 
                THEN 'GAJIRAM DIGITAL LITERACY CENTRE'
              WHEN centre_name ILIKE '%DIKWADLC%' OR centre_name ILIKE '%DIKWA%' 
                THEN 'DIKWA DIGITAL LITERACY CENTRE'
              WHEN centre_name ILIKE '%BAYODLC%' OR centre_name ILIKE '%BAYO%' 
                THEN 'BAYO DIGITAL LITERACY CENTRE'
              ELSE centre_name
          END
          WHERE centre_name IS NOT NULL;
        `
      });

      if (error) {
        console.error('❌ Error standardizing centre names:', error);
      } else {
        console.log('✅ Centre names standardized successfully');
        // Refresh the trainees data
        await fetchTrainees();
      }
    } catch (error) {
      console.error('❌ Error in standardizeCentreNames:', error);
    }
  };

  // Ensure trainees table exists with correct structure
  const ensureTraineesTable = async () => {
    try {
      console.log('🔨 Creating trainees table if it doesn\'t exist...');
      
      // Try to create the table using RPC
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS trainees (
            id SERIAL PRIMARY KEY,
            id_number VARCHAR(255) UNIQUE NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            gender VARCHAR(10) NOT NULL,
            date_of_birth VARCHAR(255),
            age INTEGER,
            educational_background VARCHAR(255) NOT NULL,
            employment_status VARCHAR(255) NOT NULL,
            centre_name VARCHAR(255) NOT NULL,
            passed BOOLEAN DEFAULT false,
            failed BOOLEAN DEFAULT false,
            not_sat_for_exams BOOLEAN DEFAULT true,
            dropout BOOLEAN DEFAULT false,
            nin VARCHAR(255),
            phone_number VARCHAR(50),
            cohort_number INTEGER NOT NULL,
            learner_category VARCHAR(255),
            email VARCHAR(255),
            lga VARCHAR(255),
            people_with_special_needs BOOLEAN DEFAULT false,
            address TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `
      });

      if (createError) {
        console.warn('⚠️ Could not create table via RPC:', createError);
        
        // Try to create a simple record as fallback
        try {
          const { error: insertError } = await supabase
            .from('trainees')
            .insert([{
              id_number: 'TEMP001',
              full_name: 'Temporary Record',
              gender: 'M',
              educational_background: 'Test',
              employment_status: 'Test',
              centre_name: 'MAFA DIGITAL LITERACY CENTRE',
              cohort_number: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (insertError && insertError.code === '42P01') {
            console.error('❌ Could not create trainees table:', insertError);
            console.log('💡 Please run this SQL in Supabase SQL editor:');
            console.log(`
              CREATE TABLE trainees (
                id SERIAL PRIMARY KEY,
                id_number VARCHAR(255) UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                gender VARCHAR(10) NOT NULL,
                date_of_birth VARCHAR(255),
                age INTEGER,
                educational_background VARCHAR(255) NOT NULL,
                employment_status VARCHAR(255) NOT NULL,
                centre_name VARCHAR(255) NOT NULL,
                passed BOOLEAN DEFAULT false,
                failed BOOLEAN DEFAULT false,
                not_sat_for_exams BOOLEAN DEFAULT true,
                dropout BOOLEAN DEFAULT false,
                nin VARCHAR(255),
                phone_number VARCHAR(50),
                cohort_number INTEGER NOT NULL,
                learner_category VARCHAR(255),
                email VARCHAR(255),
                lga VARCHAR(255),
                people_with_special_needs BOOLEAN DEFAULT false,
                address TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
              );
            `);
          }
        } catch (fallbackError) {
          console.error('❌ Fallback attempt also failed:', fallbackError);
        }
      }

      // Now try to add any missing columns
      try {
        const columns = ['centre_name', 'serial_number', 'age', 'passed', 'failed', 
                        'not_sat_for_exams', 'dropout', 'cohort_number', 'learner_category',
                        'email', 'lga', 'people_with_special_needs', 'address'];
        
        for (const column of columns) {
          try {
            await supabase.rpc('exec_sql', {
              sql: `ALTER TABLE trainees ADD COLUMN IF NOT EXISTS ${column} VARCHAR(255);`
            });
          } catch (columnError) {
            console.warn(`⚠️ Error adding column ${column}:`, columnError);
          }
        }
        
        console.log('✅ Trainees table structure is up to date');
      } catch (alterError) {
        console.warn('⚠️ Error updating table columns:', alterError);
      }
    } catch (error) {
      console.error('❌ Error in ensureTraineesTable:', error);
    }
  };

  // Set up real-time subscription for centres
  useEffect(() => {
    console.log('🔍 Setting up real-time centres subscription...');

    const channel = supabase
      .channel('centres')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'centres'
        },
        (payload) => {
          console.log('🔍 Real-time centre update:', payload);

          try {
            if (payload.eventType === 'INSERT') {
              const newCentre = payload.new as any;
              setCentres(prev => [newCentre, ...prev]);
            } else if (payload.eventType === 'DELETE') {
              setCentres(prev => prev.filter(c => c.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
              setCentres(prev => prev.map(c => c.id === payload.new.id ? {...c, ...payload.new} : c));
            }
          } catch (err) {
            console.warn('Error handling centres realtime payload', err);
          }
        }
      )
      .subscribe();

    // Ensure we have initial data
    fetchCentres();

    return () => {
      console.log('🔍 Cleaning up centres subscription...');
      supabase.removeChannel(channel);
    };
  }, []);

  // Set up real-time subscription for instructors
  useEffect(() => {
    console.log('👨‍🏫 Setting up real-time instructors subscription...');

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
          console.log('👨‍🏫 Real-time instructor update:', payload);

          try {
            if (payload.eventType === 'INSERT') {
              const newInstructor = payload.new as Instructor;
              setInstructors(prev => [newInstructor, ...prev]);
            } else if (payload.eventType === 'DELETE') {
              setInstructors(prev => prev.filter(i => i.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
              setInstructors(prev => prev.map(i => i.id === payload.new.id ? payload.new as Instructor : i));
            }
          } catch (err) {
            console.warn('Error handling instructors realtime payload', err);
          }
        }
      )
      .subscribe();

    // Ensure we have initial data
    fetchInstructors();

    return () => {
      console.log('👨‍🏫 Cleaning up instructors subscription...');
      supabase.removeChannel(channel);
    };
  }, []);

  // Refresh instructor data periodically for real-time status
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const interval = setInterval(() => {
        fetchInstructors();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [currentUser?.role]);

  const refreshData = async () => {
    console.log('🔄 Fast-loading data...');
    setLoading(true);
    
    try {
      // Fetch all data in parallel for speed
      await Promise.all([
        fetchTrainees(),
        fetchCentres(),
        fetchInstructors()
      ]);
      
      // Do background tasks after initial load
      setTimeout(() => {
        ensureTraineesTable();
        ensureInstructorsTable();
        standardizeCentreNames();
        migrateDanielToSupabase();
      }, 1000);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      console.log('✅ Initial data load complete');
    }
  };

  // Load data on component mount - don't block UI
  useEffect(() => {
    console.log('📦 AppProvider mounted, loading data...');
    
    // Check for persisted user session
    const persistedUser = localStorage.getItem('bictda_user');
    if (persistedUser) {
      try {
        const userData = JSON.parse(persistedUser);
        console.log('🔍 Found persisted user:', userData);
        setCurrentUser(userData);
      } catch (error) {
        console.warn('⚠️ Error parsing persisted user:', error);
        localStorage.removeItem('bictda_user');
      }
    }
    
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
      let fbUser = null;
      try {
        fbUser = await signInWithEmail(email, password);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase authentication failed:', firebaseError);
        
        // For development: Allow admin login with hardcoded credentials
        if (role === 'admin' && (email === 'admin@bictda.com' || email === 'Admin.wanori@ims.com') && password === 'Wanoriims@1#') {
          console.log('🔄 Using development admin login');
          fbUser = { email, uid: 'dev-admin-uid' };
        } else {
          throw firebaseError;
        }
      }
      
      if (fbUser) {
        // Get additional user data from Firestore
        let userData = null;
        try {
          userData = await getUserData(fbUser.uid);
        } catch (firestoreError) {
          console.warn('⚠️ Firestore offline or error:', firestoreError);
          // Continue with login even if Firestore is offline
        }
        
        // For instructors, check approval status in Supabase
        if (role === 'instructor') {
          try {
            const { data: instructorData, error } = await supabase
              .from('instructors')
              .select('*')
              .eq('email', email)
              .single();
            
            if (error && error.code === 'PGRST116') {
              // Instructor not found, create them in Supabase
              console.log('🔄 Instructor not found in Supabase, creating record...');
              
              const newInstructor = {
                name: userData?.name || name,
                email: email,
                lga: userData?.lga || '',
                technical_manager_name: userData?.technical_manager_name || userData?.name || name,
                phone_number: userData?.phone_number || '',
                centre_name: userData?.centre_name || centre_name || '',
                status: 'approved', // Auto-approve for now
                is_online: true,
                last_login: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              
              const { data: createdInstructor, error: createError } = await supabase
                .from('instructors')
                .insert([newInstructor])
                .select()
                .single();
              
              if (createError) {
                console.error('❌ Error creating instructor record:', createError);
                throw new Error('Unable to create instructor record. Please try again.');
              } else {
                console.log('✅ Instructor record created in Supabase:', createdInstructor);
                setInstructors(prev => [...prev, createdInstructor]);
              }
            } else if (error) {
              console.warn('⚠️ Error checking instructor status:', error);
              // Allow login even if there's an error
            } else if (instructorData) {
              // Instructor exists, check status
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
        
        const userSession = { 
          role, 
          name: userData?.name || name, 
          email: fbUser.email || email, 
          centre_name: userData?.centre_name || centre_name 
        };
        
        setCurrentUser(userSession);
        
        // Persist user session to localStorage
        localStorage.setItem('bictda_user', JSON.stringify(userSession));
        console.log('💾 User session persisted to localStorage');
        
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
      
      // Clear persisted session
      localStorage.removeItem('bictda_user');
      console.log('🗑️ User session cleared from localStorage');
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  // Add trainee to Supabase
  const addTrainee = async (trainee: Omit<Trainee, 'id'>) => {
    try {
      console.log('🚀 Adding trainee to Supabase:', trainee);
      
      // Validate required fields
      if (!trainee.full_name || !trainee.id_number || !trainee.gender) {
        throw new Error('Missing required fields: full name, ID number, and gender are required');
      }

      // Check if trainee with same ID already exists
      const { data: existingTrainee, error: checkError } = await supabase
        .from('trainees')
        .select('id, full_name')
        .eq('id_number', trainee.id_number)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking for existing trainee:', checkError);
        throw new Error('Failed to check for existing trainee');
      }

      if (existingTrainee) {
        throw new Error(`A trainee with ID number "${trainee.id_number}" already exists`);
      }

      const { data, error } = await supabase
        .from('trainees')
        .insert([trainee])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase error adding trainee:', error);
        if (error.code === '23505') {
          throw new Error('A trainee with this ID number already exists');
        } else if (error.code === '42P01') {
          throw new Error('Trainees table does not exist. Please contact administrator.');
        } else {
          throw new Error(`Failed to add trainee: ${error.message}`);
        }
      }

      console.log('✅ Trainee added successfully:', data);
      setTrainees(prev => [...prev, data]);
    } catch (error: any) {
      console.error('❌ Error adding trainee:', error);
      throw error;
    }
  };

  // Add instructor to Supabase and Firebase
  const addInstructor = async (instructor: Omit<Instructor, 'id'>, password?: string) => {
    try {
      console.log('🚀 Starting instructor registration process...');
      console.log('📧 Email:', instructor.email);
      
      // Create Firebase user account first if password is provided
      if (password) {
        console.log('🔥 Creating Firebase user account...');
        const user = await signUpWithEmail(instructor.email, password, {
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
      }

      // Add to Supabase - this is critical for admin approval
      console.log('🗄️ Adding to Supabase for admin approval...');
      const { data, error } = await supabase
        .from('instructors')
        .insert([{
          ...instructor,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase error:', error);
        // If table doesn't exist, create it
        if (error.code === '42P01') { // Table doesn't exist
          console.log('🔄 Creating instructors table...');
          await createInstructorsTable();
          // Try again
          const { data: retryData, error: retryError } = await supabase
            .from('instructors')
            .insert([{
              ...instructor,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
            .single();
          
          if (retryError) {
            console.error('❌ Failed to create instructor after table creation:', retryError);
            throw retryError;
          }
          
          console.log('✅ Added to Supabase successfully after table creation');
          setInstructors(prev => [...prev, retryData]);
        } else {
          throw error;
        }
      } else {
        console.log('✅ Added to Supabase successfully');
        setInstructors(prev => [...prev, data]);
      }
      
      console.log('✅ Instructor registration completed successfully!');
    } catch (error) {
      console.error('❌ Error in instructor registration:', error);
      throw error;
    }
  };

  // Create instructors table if it doesn't exist
  const createInstructorsTable = async () => {
    try {
      console.log('🔨 Creating instructors table...');
      
      // First check if table exists
      const { error: checkError } = await supabase
        .from('instructors')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        console.log('🔄 Table doesn\'t exist, creating it...');
        
        try {
          // First try: Create table using RPC
          const { error } = await supabase.rpc('exec_sql', {
            sql: `
              CREATE TABLE IF NOT EXISTS instructors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                lga VARCHAR(255),
                technical_manager_name VARCHAR(255),
                phone_number VARCHAR(50),
                centre_name VARCHAR(255),
                status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revoked', 'active')),
                is_online BOOLEAN DEFAULT false,
                last_login TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
              );
            `
          });

          if (error) {
            // Second try: Add columns individually
            console.log('🔄 Trying alternative method to ensure columns exist...');
            await supabase.rpc('exec_sql', {
              sql: `
                BEGIN;
                ALTER TABLE IF EXISTS instructors ADD COLUMN IF NOT EXISTS centre_name VARCHAR(255);
                ALTER TABLE IF EXISTS instructors ADD COLUMN IF NOT EXISTS technical_manager_name VARCHAR(255);
                ALTER TABLE IF EXISTS instructors ADD COLUMN IF NOT EXISTS lga VARCHAR(255);
                ALTER TABLE IF EXISTS instructors ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
                ALTER TABLE IF EXISTS instructors ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
                ALTER TABLE IF EXISTS instructors ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;
                ALTER TABLE IF EXISTS instructors ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
                ALTER TABLE IF EXISTS instructors ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
                ALTER TABLE IF EXISTS instructors ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
                COMMIT;
              `
            });
          }
        } catch (rpcError) {
          // Third try: Create table by inserting test record
          console.warn('⚠️ Could not create table via RPC, trying direct SQL...', rpcError);
          
          try {
            const { error: testError } = await supabase
              .from('instructors')
              .insert([{
                name: 'Test Instructor',
                email: 'test@example.com',
                lga: 'Test LGA',
                technical_manager_name: 'Test Manager',
                phone_number: '08000000000',
                centre_name: 'Test Centre',
                status: 'pending',
                is_online: false
              }]);

            if (testError) {
              console.error('❌ Cannot create instructors table from client side:', testError);
              console.log('💡 You need to create the table manually in Supabase dashboard');
              console.log('📋 SQL to run in Supabase SQL editor:');
              console.log(`
                CREATE TABLE instructors (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  email VARCHAR(255) UNIQUE NOT NULL,
                  lga VARCHAR(255),
                  technical_manager_name VARCHAR(255),
                  phone_number VARCHAR(50),
                  centre_name VARCHAR(255),
                  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revoked', 'active')),
                  is_online BOOLEAN DEFAULT false,
                  last_login TIMESTAMP,
                  created_at TIMESTAMP DEFAULT NOW(),
                  updated_at TIMESTAMP DEFAULT NOW()
                );
              `);
            } else {
              console.log('✅ Table created successfully!');
              // Delete the test record
              await supabase
                .from('instructors')
                .delete()
                .eq('email', 'test@example.com');
            }
          } catch (insertError) {
            console.error('❌ All table creation attempts failed:', insertError);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in createInstructorsTable:', error);
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
      console.log('🚀 Adding centre to Supabase:', centre);
      
      // Validate required fields
      if (!centre.centre_name || !centre.lga || !centre.technical_manager_name) {
        throw new Error('Missing required fields: centre name, LGA, and technical manager name are required');
      }

      // Check if centre with same name already exists
      const { data: existingCentre, error: checkError } = await supabase
        .from('centres')
        .select('id, centre_name')
        .eq('centre_name', centre.centre_name)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking for existing centre:', checkError);
        throw new Error('Failed to check for existing centre');
      }

      if (existingCentre) {
        throw new Error(`A centre with name "${centre.centre_name}" already exists`);
      }

      const { data, error } = await supabase
        .from('centres')
        .insert([centre])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase error adding centre:', error);
        if (error.code === '23505') {
          throw new Error('A centre with this name already exists');
        } else if (error.code === '42P01') {
          throw new Error('Centres table does not exist. Please contact administrator.');
        } else {
          throw new Error(`Failed to add centre: ${error.message}`);
        }
      }

      console.log('✅ Centre added successfully:', data);
      setCentres(prev => [...prev, data]);
    } catch (error: any) {
      console.error('❌ Error adding centre:', error);
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
      centre.centre_name.toLowerCase() === centreName.toLowerCase()
    );
  };

  // Get all available centres
  const getAllCentres = (): string[] => {
    const standardCentres = [
      'MAFA DIGITAL LITERACY CENTRE',
      'MAGUMERI DIGITAL LITERACY CENTRE',
      'KAGA DIGITAL LITERACY CENTRE',
      'GUBIO DIGITAL LITERACY CENTRE',
      'GAJIRAM DIGITAL LITERACY CENTRE',
      'DIKWA DIGITAL LITERACY CENTRE',
      'BAYO DIGITAL LITERACY CENTRE'
    ];
    return standardCentres;
  };

  // Get trainees by centre
  const getTraineesByCentre = (centreName: string): Trainee[] => {
    const normalizedCentreName = centreName.toLowerCase();
    return trainees.filter(trainee => {
      const traineeCentre = trainee.centre_name?.toLowerCase() || '';
      return traineeCentre === normalizedCentreName;
    });
  };

  // Get instructors by centre
  const getInstructorsByCentre = (centreName: string): Instructor[] => {
    const normalizedCentreName = centreName.toLowerCase();
    return instructors.filter(instructor => {
      const instructorCentre = instructor.centre_name?.toLowerCase() || '';
      return instructorCentre === normalizedCentreName;
    });
  };

  // Add weekly report to Supabase
  const addWeeklyReport = async (report: Omit<WeeklyReport, 'id'>) => {
    try {
      console.log('🚀 Adding weekly report to Supabase:', report);
      
      // Validate required fields
      if (!report.centre_name || !report.technical_manager_name || !report.week_number) {
        throw new Error('Missing required fields: centre name, technical manager name, and week number are required');
      }

      // Check if report for this centre and week already exists
      const { data: existingReport, error: checkError } = await supabase
        .from('weekly_reports')
        .select('id, centre_name, week_number, year')
        .eq('centre_name', report.centre_name)
        .eq('week_number', report.week_number)
        .eq('year', report.year)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking for existing report:', checkError);
        throw new Error('Failed to check for existing report');
      }

      if (existingReport) {
        throw new Error(`A weekly report for ${report.centre_name} (Week ${report.week_number}, ${report.year}) already exists`);
      }

      const { data, error } = await supabase
        .from('weekly_reports')
        .insert([report])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase error adding weekly report:', error);
        if (error.code === '23505') {
          throw new Error('A weekly report for this centre and week already exists');
        } else if (error.code === '42P01') {
          throw new Error('Weekly reports table does not exist. Please contact administrator.');
        } else {
          throw new Error(`Failed to add weekly report: ${error.message}`);
        }
      }

      console.log('✅ Weekly report added successfully:', data);
      setWeeklyReports(prev => [...prev, data]);
    } catch (error: any) {
      console.error('❌ Error adding weekly report:', error);
      throw error;
    }
  };

  // Add M&E report to Supabase
  const addMEReport = async (report: Omit<MEReport, 'id'>) => {
    try {
      console.log('🚀 Adding M&E report to Supabase:', report);
      
      // Validate required fields
      if (!report.centre_name || !report.technical_manager_name || !report.month) {
        throw new Error('Missing required fields: centre name, technical manager name, and month are required');
      }

      // Check if report for this centre and month already exists
      const { data: existingReport, error: checkError } = await supabase
        .from('me_reports')
        .select('id, centre_name, month, year')
        .eq('centre_name', report.centre_name)
        .eq('month', report.month)
        .eq('year', report.year)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking for existing M&E report:', checkError);
        throw new Error('Failed to check for existing M&E report');
      }

      if (existingReport) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[report.month - 1] || `Month ${report.month}`;
        throw new Error(`An M&E report for ${report.centre_name} (${monthName} ${report.year}) already exists`);
      }

      const { data, error } = await supabase
        .from('me_reports')
        .insert([report])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase error adding M&E report:', error);
        if (error.code === '23505') {
          throw new Error('An M&E report for this centre and month already exists');
        } else if (error.code === '42P01') {
          throw new Error('M&E reports table does not exist. Please contact administrator.');
        } else {
          throw new Error(`Failed to add M&E report: ${error.message}`);
        }
      }

      console.log('✅ M&E report added successfully:', data);
      setMEReports(prev => [...prev, data]);
    } catch (error: any) {
      console.error('❌ Error adding M&E report:', error);
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

  // Simple function to ensure instructors table exists and migrate existing users
  const ensureInstructorsTable = async () => {
    try {
      console.log('🔍 Checking if instructors table exists...');
      
      // Try to query the table
      const { data, error } = await supabase
        .from('instructors')
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') {
        console.log('⚠️ Instructors table doesn\'t exist yet');
        return false;
      }
      
      console.log('✅ Instructors table exists');
      
      // Check if we have any instructors in Supabase
      const { data: existingInstructors } = await supabase
        .from('instructors')
        .select('*');
      
      if (!existingInstructors || existingInstructors.length === 0) {
        console.log('🔄 No instructors in Supabase, checking Firebase...');
        
        // Try to get current user if they're logged in
        const currentUser = auth.currentUser;
        if (currentUser) {
          console.log('👤 Found logged in user:', currentUser.email);
          
          try {
            const userData = await getUserData(currentUser.uid);
            if (userData && userData.role === 'instructor') {
              console.log('✅ Found instructor in Firebase, migrating to Supabase...');
              
              const { data: newInstructor, error: insertError } = await supabase
                .from('instructors')
                .insert([{
                  name: userData.name || currentUser.displayName || 'Unknown',
                  email: currentUser.email || '',
                  lga: userData.lga || '',
                  technical_manager_name: userData.technical_manager_name || userData.name || 'Unknown',
                  phone_number: userData.phone_number || '',
                  centre_name: userData.centre_name || '',
                  status: userData.status || 'pending',
                  is_online: false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }])
                .select()
                .single();
              
              if (insertError) {
                console.error('❌ Error migrating instructor:', insertError);
              } else {
                console.log('✅ Migrated instructor to Supabase:', newInstructor);
                setInstructors(prev => [...prev, newInstructor]);
              }
            }
          } catch (error) {
            console.error('❌ Error getting user data:', error);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.warn('⚠️ Error checking instructors table:', error);
      return false;
    }
  };

  // Function to check if admin user exists and reset password
  const checkAdminUser = async (email: string) => {
    try {
      console.log('🔍 Checking if admin user exists:', email);
      const exists = await checkUserExists(email);
      
      if (exists) {
        console.log('✅ Admin user exists in Firebase');
        
        // Send password reset email
        try {
          await sendPasswordResetEmail(email);
          console.log('📧 Password reset email sent to:', email);
          toast({
            title: "Password Reset Sent",
            description: `A password reset email has been sent to ${email}. Please check your inbox.`,
            duration: 5000,
          });
        } catch (resetError: any) {
          console.error('❌ Error sending password reset:', resetError);
          toast({
            title: "Password Reset Failed",
            description: resetError.message,
            duration: 5000,
          });
        }
      } else {
        console.log('❌ Admin user does not exist in Firebase');
        toast({
          title: "User Not Found",
          description: `No account found with email ${email}. Please create the account first.`,
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('❌ Error checking admin user:', error);
      toast({
        title: "Error",
        description: error.message,
        duration: 5000,
      });
    }
  };

  // Manual migration function to add Daniel's data
  const migrateDanielToSupabase = async () => {
    try {
      console.log('🔄 Manually migrating Daniel to Supabase...');
      
      // Check if Daniel already exists in Supabase
      const { data: existingDaniel } = await supabase
        .from('instructors')
        .select('*')
        .eq('email', 'danielnicholasdibal@gmail.com')
        .single();
      
      if (existingDaniel) {
        console.log('ℹ️ Daniel already exists in Supabase');
        return;
      }
      
      // Add Daniel's data to Supabase
      const { data: newInstructor, error: insertError } = await supabase
        .from('instructors')
        .insert([{
          name: 'Daniel Dibal',
          email: 'danielnicholasdibal@gmail.com',
          lga: 'Hawul',
          technical_manager_name: 'Daniel Dibal',
          phone_number: '08143084473',
          centre_name: 'BAYO DIGITAL LITERACY CENTER',
          status: 'pending',
          is_online: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Error migrating Daniel:', insertError);
      } else {
        console.log('✅ Daniel migrated to Supabase:', newInstructor);
        setInstructors(prev => [...prev, newInstructor]);
      }
    } catch (error) {
      console.error('❌ Error during Daniel migration:', error);
    }
  };

  const contextValue: AppContextType = {
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
    getAllCentres,
    getTraineesByCentre,
    getInstructorsByCentre,
    announcements,
    addAnnouncement,
    announcementsLoading,
    checkAdminUser
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};