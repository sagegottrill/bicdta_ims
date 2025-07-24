import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ha' | 'kr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'trainees': 'Trainees',
    'courses': 'Courses',
    'centres': 'Centres',
    'analytics': 'Analytics',
    'settings': 'Settings',
    'logout': 'Logout',
    
    // Analytics
    'enrollment_forecast': 'Enrollment Forecast',
    'dropout_risk': 'Dropout Risk Assessment',
    'resource_demand': 'Resource Demand Prediction',
    'performance_optimization': 'Performance Optimization',
    'predictive_analytics': 'Predictive Analytics',
    
    // Common
    'total': 'Total',
    'active': 'Active',
    'completed': 'Completed',
    'pending': 'Pending',
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
    'view_details': 'View Details',
    'export': 'Export',
    'refresh': 'Refresh',
    
    // Risk Levels
    'very_high_risk': 'Very High Risk',
    'high_risk': 'High Risk',
    'medium_risk': 'Medium Risk',
    'low_risk': 'Low Risk',
    'no_risk': 'No Risk',
    
    // Performance
    'excellent': 'Excellent',
    'good': 'Good',
    'average': 'Average',
    'below_average': 'Below Average',
    'poor': 'Poor',
    
    // Time periods
    'next_month': 'Next Month',
    'next_quarter': 'Next Quarter',
    'next_semester': 'Next Semester',
    'next_year': 'Next Year',
    
    // Resource types
    'computers': 'Computers',
    'internet_bandwidth': 'Internet Bandwidth',
    'power_consumption': 'Power Consumption',
    'classroom_space': 'Classroom Space',
    
    // Actions
    'add': 'Add',
    'edit': 'Edit',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    
    // Status
    'enrolled': 'Enrolled',
    'graduated': 'Graduated',
    'dropped_out': 'Dropped Out',
    'on_hold': 'On Hold',
    
    // Demographics
    'male': 'Male',
    'female': 'Female',
    'age_group': 'Age Group',
    'education_level': 'Education Level',
    'employment_status': 'Employment Status',
  },
  ha: {
    // Navigation
    'dashboard': 'Dashboard',
    'trainees': 'Dalibai',
    'courses': 'Kwasai',
    'centres': 'Cibiyoyi',
    'analytics': 'Bincike',
    'settings': 'Saiti',
    'logout': 'Fita',
    
    // Analytics
    'enrollment_forecast': 'Hasashen Rajista',
    'dropout_risk': 'Binciken Hatsarin Barin Makaranta',
    'resource_demand': 'Hasashen Bukatar Albarkatun',
    'performance_optimization': 'Inganta Ayyuka',
    'predictive_analytics': 'Binciken Hasashe',
    
    // Common
    'total': 'Jimla',
    'active': 'Mai Aiki',
    'completed': 'An Kammala',
    'pending': 'Ana Jira',
    'high': 'Babba',
    'medium': 'Matsakaici',
    'low': 'Kadan',
    'view_details': 'Duba Bayanai',
    'export': 'Fitar',
    'refresh': 'Sabunta',
    
    // Risk Levels
    'very_high_risk': 'Hatsari Mai Yawa',
    'high_risk': 'Hatsari Babba',
    'medium_risk': 'Hatsari Matsakaici',
    'low_risk': 'Hatsari Kadan',
    'no_risk': 'Babu Hatsari',
    
    // Performance
    'excellent': 'Mai Kyau Sosa',
    'good': 'Mai Kyau',
    'average': 'Matsakaici',
    'below_average': 'Kasa da Matsakaici',
    'poor': 'Mara Kyau',
    
    // Time periods
    'next_month': 'Wata Mai Zuwa',
    'next_quarter': 'Kwata Mai Zuwa',
    'next_semester': 'Semester Mai Zuwa',
    'next_year': 'Shekara Mai Zuwa',
    
    // Resource types
    'computers': 'Kwamfutoci',
    'internet_bandwidth': 'Yawan Intanet',
    'power_consumption': 'Amfani da Wutar Lantarki',
    'classroom_space': 'Saron Darasi',
    
    // Actions
    'add': 'Kara',
    'edit': 'Gyara',
    'delete': 'Soke',
    'save': 'Ajiye',
    'cancel': 'Soke',
    'confirm': 'Tabbatar',
    
    // Status
    'enrolled': 'An Rajista',
    'graduated': 'An Kammala',
    'dropped_out': 'Ya Bar',
    'on_hold': 'Ana Jira',
    
    // Demographics
    'male': 'Namiji',
    'female': 'Mace',
    'age_group': 'Rukunin Shekaru',
    'education_level': 'Matakin Ilimi',
    'employment_status': 'Matsayin Aiki',
  },
  kr: {
    // Navigation
    'dashboard': 'Dashboard',
    'trainees': 'Koyan',
    'courses': 'Kursi',
    'centres': 'Cibiyoyi',
    'analytics': 'Bincike',
    'settings': 'Saiti',
    'logout': 'Fita',
    
    // Analytics
    'enrollment_forecast': 'Hasashen Rajista',
    'dropout_risk': 'Binciken Hatsarin Barin Makaranta',
    'resource_demand': 'Hasashen Bukatar Albarkatun',
    'performance_optimization': 'Inganta Ayyuka',
    'predictive_analytics': 'Binciken Hasashe',
    
    // Common
    'total': 'Jimla',
    'active': 'Mai Aiki',
    'completed': 'An Kammala',
    'pending': 'Ana Jira',
    'high': 'Babba',
    'medium': 'Matsakaici',
    'low': 'Kadan',
    'view_details': 'Duba Bayanai',
    'export': 'Fitar',
    'refresh': 'Sabunta',
    
    // Risk Levels
    'very_high_risk': 'Hatsari Mai Yawa',
    'high_risk': 'Hatsari Babba',
    'medium_risk': 'Hatsari Matsakaici',
    'low_risk': 'Hatsari Kadan',
    'no_risk': 'Babu Hatsari',
    
    // Performance
    'excellent': 'Mai Kyau Sosa',
    'good': 'Mai Kyau',
    'average': 'Matsakaici',
    'below_average': 'Kasa da Matsakaici',
    'poor': 'Mara Kyau',
    
    // Time periods
    'next_month': 'Wata Mai Zuwa',
    'next_quarter': 'Kwata Mai Zuwa',
    'next_semester': 'Semester Mai Zuwa',
    'next_year': 'Shekara Mai Zuwa',
    
    // Resource types
    'computers': 'Kwamfutoci',
    'internet_bandwidth': 'Yawan Intanet',
    'power_consumption': 'Amfani da Wutar Lantarki',
    'classroom_space': 'Saron Darasi',
    
    // Actions
    'add': 'Kara',
    'edit': 'Gyara',
    'delete': 'Soke',
    'save': 'Ajiye',
    'cancel': 'Soke',
    'confirm': 'Tabbatar',
    
    // Status
    'enrolled': 'An Rajista',
    'graduated': 'An Kammala',
    'dropped_out': 'Ya Bar',
    'on_hold': 'Ana Jira',
    
    // Demographics
    'male': 'Namiji',
    'female': 'Mace',
    'age_group': 'Rukunin Shekaru',
    'education_level': 'Matakin Ilimi',
    'employment_status': 'Matsayin Aiki',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}; 