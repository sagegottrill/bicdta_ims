import { useMemo } from 'react';

interface Trainee {
  id: number;
  full_name: string;
  gender: string;
  employment_status: string;
  centre_name: string;
  lga: string;
  educational_background: string;
  passed?: boolean;
  failed?: boolean;
  not_sat_for_exams?: boolean;
  dropout?: boolean;
  created_at?: string;
}

interface Instructor {
  id: number;
  name: string;
  email: string;
  centre_name?: string;
  status: 'pending' | 'approved' | 'revoked' | 'active';
  is_online: boolean;
}

interface Centre {
  id: number;
  centre_name: string;
  lga: string;
  power_available: boolean;
  internet_available: boolean;
  declared_capacity: number;
  computers_functional: number;
}

export const useStatsData = (
  trainees: Trainee[],
  instructors: Instructor[],
  centres: Centre[],
  filters: {
    selectedCentre: string;
    selectedRegion: string;
    searchTerm: string;
  }
) => {
  const processedData = useMemo(() => {
    console.log('🔍 useStatsData received:', {
      traineesCount: trainees?.length || 0,
      instructorsCount: instructors?.length || 0,
      centresCount: centres?.length || 0,
      filters
    });
    
    // Filter trainees based on selected filters
    let filteredTrainees = trainees || [];
    
    if (filters.selectedCentre !== 'all') {
      filteredTrainees = filteredTrainees.filter(t => 
        t.centre_name?.toLowerCase() === filters.selectedCentre.toLowerCase()
      );
    }
    
    if (filters.selectedRegion !== 'all') {
      filteredTrainees = filteredTrainees.filter(t => 
        t.lga?.toLowerCase() === filters.selectedRegion.toLowerCase()
      );
    }
    
    if (filters.searchTerm) {
      filteredTrainees = filteredTrainees.filter(t => 
        t.full_name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        t.centre_name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        t.lga?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    const totalTrainees = filteredTrainees.length;
    const totalInstructors = instructors?.length || 0;
    const totalCentres = centres?.length || 0;

    // Gender distribution
    const genderDistribution = {
      male: filteredTrainees.filter(t => 
        ['male', 'm'].includes(t.gender?.toLowerCase() || '')
      ).length,
      female: filteredTrainees.filter(t => 
        ['female', 'f'].includes(t.gender?.toLowerCase() || '')
      ).length
    };

    // Employment status
    const employmentStats = {
      employed: filteredTrainees.filter(t => 
        ['employed', 'emp'].includes(t.employment_status?.toLowerCase() || '')
      ).length,
      unemployed: filteredTrainees.filter(t => 
        ['unemployed', 'unemp'].includes(t.employment_status?.toLowerCase() || '')
      ).length
    };

    // Exam results
    const examResults = {
      passed: filteredTrainees.filter(t => t.passed).length,
      failed: filteredTrainees.filter(t => t.failed).length,
      notSat: filteredTrainees.filter(t => t.not_sat_for_exams).length,
      dropout: filteredTrainees.filter(t => t.dropout).length,
      enrolled: filteredTrainees.filter(t => 
        !t.passed && !t.failed && !t.not_sat_for_exams && !t.dropout
      ).length
    };

    // Instructor status
    const instructorStats = {
      pending: instructors?.filter(i => i.status === 'pending').length || 0,
      approved: instructors?.filter(i => i.status === 'approved').length || 0,
      active: instructors?.filter(i => i.status === 'active').length || 0,
      revoked: instructors?.filter(i => i.status === 'revoked').length || 0,
      online: instructors?.filter(i => i.is_online).length || 0
    };

    // Centre performance with real data
    const centrePerformance = centres?.map(centre => {
      const centreTrainees = filteredTrainees.filter(t => 
        t.centre_name?.toLowerCase() === centre.centre_name?.toLowerCase()
      );
      const centreInstructors = instructors?.filter(i => 
        i.centre_name?.toLowerCase() === centre.centre_name?.toLowerCase()
      );
      
      return {
        name: centre.centre_name || 'Unknown Centre',
        trainees: centreTrainees.length,
        instructors: centreInstructors.length,
        operational: centre.power_available && centre.internet_available ? 'Operational' : 'Limited',
        capacity: centre.declared_capacity || 0,
        computers: centre.computers_functional || 0
      };
    }).filter(c => c.trainees > 0 || c.instructors > 0) || [];

    // Monthly enrollment trends from real data
    const monthlyTrends = (() => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();
      
      return months.map((month, index) => {
        const monthTrainees = filteredTrainees.filter(t => {
          if (!t.created_at) return false;
          const traineeDate = new Date(t.created_at);
          return traineeDate.getMonth() === index && traineeDate.getFullYear() === currentYear;
        });
        
        const completed = monthTrainees.filter(t => t.passed).length;
        const dropped = monthTrainees.filter(t => t.dropout).length;
        const enrolled = monthTrainees.length;
        
        return {
          month,
          enrolled,
          completed,
          dropped
        };
      });
    })();



    const result = {
      totalTrainees,
      totalInstructors,
      totalCentres,
      genderDistribution,
      employmentStats,
      examResults,
      instructorStats,
      centrePerformance,
      monthlyTrends
    };
    
    console.log('🔍 useStatsData returning:', result);
    return result;
  }, [trainees, instructors, centres, filters.selectedCentre, filters.selectedRegion, filters.searchTerm]);

  return processedData;
};
