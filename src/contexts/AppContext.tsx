import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Trainee {
  id: number;
  cohort_id: number | null;
  full_name: string;
  gender: string;
  date_of_birth: string;
  age: number;
  educational_background: string;
  employment_status: string;
  address: string | null;
  id_number: string;
  centre_name: string;
  learner_category: string | null;
  cohort_number: number;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentUser: { role: 'instructor' | 'admin' | null; name: string } | null;
  login: (role: 'instructor' | 'admin', name: string, email?: string) => Promise<boolean>;
  logout: () => void;
  trainees: Trainee[];
  loading: boolean;
  addTrainee: (trainee: Omit<Trainee, 'id'>) => Promise<void>;
  refreshData: () => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<{ role: 'instructor' | 'admin' | null; name: string } | null>(null);
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [loading, setLoading] = useState(true);

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

  const refreshData = async () => {
    console.log('🔄 Refreshing data...');
    setLoading(true);
    await fetchTrainees();
    setLoading(false);
    console.log('✅ Data refresh complete');
  };

  // Load data on component mount
  useEffect(() => {
    console.log('📦 AppProvider mounted, loading data...');
    refreshData();
  }, []);

  const login = async (role: 'instructor' | 'admin', name: string, email?: string) => {
    // Accept any email for demo, but only allow core emails for admin/instructor
    if (
      (role === 'admin' && email === 'admin.user@bictda.bo.gov.ng') ||
      (role === 'instructor' && email === 'instructor@bictda.bo.gov.ng')
    ) {
      setCurrentUser({ role, name });
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
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

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentUser,
        login,
        logout,
        trainees,
        loading,
        addTrainee,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};