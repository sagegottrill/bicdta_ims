import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  auth, 
  signInWithEmail, 
  signOutUser,
  getUserData,
} from '@/lib/firebase';

// Fast loading context with optimized data fetching
export const AppContext = createContext<any>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [trainees, setTrainees] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Optimized data fetching
  const fetchData = async () => {
    try {
      // Load initial data quickly
      const fetchInitialData = async () => {
        const [traineesResponse, instructorsResponse, centresResponse] = await Promise.all([
          supabase.from('trainees').select('*').order('id').limit(100),
          supabase.from('instructors').select('*').order('id'),
          supabase.from('centres').select('*').order('id')
        ]);

        if (traineesResponse.data) setTrainees(traineesResponse.data);
        if (instructorsResponse.data) setInstructors(instructorsResponse.data);
        if (centresResponse.data) setCentres(centresResponse.data);

        setLoading(false);
      };

      // Load remaining data in background
      const fetchRemainingData = async () => {
        const { data: allTrainees } = await supabase
          .from('trainees')
          .select('*')
          .order('id');

        if (allTrainees) {
          setTrainees(allTrainees);
        }
      };

      // Execute fetches
      await fetchInitialData();
      fetchRemainingData();

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load some data. Please refresh.",
        duration: 5000,
      });
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchData();
    
    // Set up real-time subscriptions
    const traineesSubscription = supabase
      .channel('trainees')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trainees' }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            setTrainees(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setTrainees(prev => prev.filter(t => t.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setTrainees(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(traineesSubscription);
    };
  }, []);

  // Fast login function
  const login = async (email: string, password: string) => {
    try {
      const { data: { user } } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (user) {
        // Quick role check
        const { data: instructor } = await supabase
          .from('instructors')
          .select('*')
          .eq('email', email)
          .single();

        const role = email.includes('admin') ? 'admin' : 'instructor';
        const userData = {
          role,
          email,
          name: instructor?.name || email,
          centre_name: instructor?.centre_name
        };

        setCurrentUser(userData);
        localStorage.setItem('bictda_user', JSON.stringify(userData));
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
    return false;
  };

  // Quick logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bictda_user');
  };

  // Context value with optimized functions
  const value = {
    currentUser,
    login,
    logout,
    trainees,
    instructors,
    centres,
    loading,
    addTrainee: async (trainee: any) => {
      const { data, error } = await supabase
        .from('trainees')
        .insert([trainee])
        .select()
        .single();
      
      if (error) throw error;
      setTrainees(prev => [data, ...prev]);
    },
    getTraineesByCentre: (centreName: string) => {
      return trainees.filter(t => t.centre_name === centreName);
    },
    getCentresByManager: (managerName: string) => {
      return centres.filter(c => c.technical_manager_name.includes(managerName));
    },
    refreshData: fetchData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
