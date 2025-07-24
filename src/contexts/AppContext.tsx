import React, { createContext, useContext, useState } from 'react';

interface Centre {
  id: string;
  name: string;
  location: string;
  capacity: number;
  computers: number;
  internetStatus: string;
  powerSource: string;
  coordinator: string;
}

interface Trainer {
  id: string;
  name: string;
  email: string;
  nin: string;
  qualifications: string;
  assignedCentre: string;
}

interface Trainee {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  lga: string;
  education: string;
  employment: string;
  assignedCentre: string;
  course: string;
  enrollmentDate: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  targetAudience: string;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentUser: { role: 'instructor' | 'admin' | null; name: string } | null;
  login: (role: 'instructor' | 'admin', name: string, email?: string) => Promise<boolean>;
  logout: () => void;
  centres: Centre[];
  trainers: Trainer[];
  trainees: Trainee[];
  courses: Course[];
  addCentre: (centre: Omit<Centre, 'id'>) => Promise<void>;
  addTrainer: (trainer: Omit<Trainer, 'id'>) => Promise<void>;
  addTrainee: (trainee: Omit<Trainee, 'id'>) => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Sample data for demonstration
const sampleCentres: Centre[] = [
  {
    id: 'centre1',
    name: 'BICTDA Main Centre',
    location: 'Maiduguri',
    capacity: 50,
    computers: 25,
    internetStatus: 'available',
    powerSource: 'grid',
    coordinator: 'John Instructor'
  },
  {
    id: 'centre2',
    name: 'Digital Hub Bama',
    location: 'Bama',
    capacity: 30,
    computers: 15,
    internetStatus: 'limited',
    powerSource: 'generator',
    coordinator: 'Sarah Trainer'
  },
  {
    id: 'centre3',
    name: 'Tech Centre Gwoza',
    location: 'Gwoza',
    capacity: 40,
    computers: 20,
    internetStatus: 'available',
    powerSource: 'grid',
    coordinator: 'Mike Coordinator'
  }
];

const sampleCourses: Course[] = [
  {
    id: 'course1',
    title: 'Basic Computer Skills',
    description: 'Introduction to computer operations and basic software',
    duration: '8 weeks',
    targetAudience: 'Beginners'
  },
  {
    id: 'course2',
    title: 'Digital Marketing',
    description: 'Online marketing strategies and social media management',
    duration: '12 weeks',
    targetAudience: 'Intermediate'
  },
  {
    id: 'course3',
    title: 'Web Development',
    description: 'HTML, CSS, and JavaScript fundamentals',
    duration: '16 weeks',
    targetAudience: 'Advanced'
  },
  {
    id: 'course4',
    title: 'Data Analysis',
    description: 'Excel, SQL, and basic data visualization',
    duration: '10 weeks',
    targetAudience: 'Intermediate'
  }
];

const sampleTrainees: Trainee[] = [
  {
    id: 'trainee1',
    name: 'Aisha Mohammed',
    email: 'aisha.m@email.com',
    age: 25,
    gender: 'female',
    lga: 'Maiduguri',
    education: 'tertiary',
    employment: 'unemployed',
    assignedCentre: 'centre1',
    course: 'course1',
    enrollmentDate: '2024-01-15'
  },
  {
    id: 'trainee2',
    name: 'Ahmed Bello',
    email: 'ahmed.b@email.com',
    age: 32,
    gender: 'male',
    lga: 'Maiduguri',
    education: 'secondary',
    employment: 'employed',
    assignedCentre: 'centre1',
    course: 'course2',
    enrollmentDate: '2024-01-20'
  }
  // ... more sample trainees ...
];

const sampleTrainers: Trainer[] = [
  {
    id: 'trainer1',
    name: 'John Instructor',
    email: 'john.instructor@bictda.bo.gov.ng',
    nin: '12345678901',
    qualifications: 'BSc Computer Science, MSc IT',
    assignedCentre: 'centre1'
  },
  {
    id: 'trainer2',
    name: 'Sarah Trainer',
    email: 'sarah.trainer@bictda.bo.gov.ng',
    nin: '12345678902',
    qualifications: 'BSc Education, Digital Skills Certified',
    assignedCentre: 'centre2'
  }
  // ... more sample trainers ...
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ role: 'instructor' | 'admin' | null; name: string } | null>(null);
  const [centres, setCentres] = useState<Centre[]>(sampleCentres);
  const [trainers, setTrainers] = useState<Trainer[]>(sampleTrainers);
  const [trainees, setTrainees] = useState<Trainee[]>(sampleTrainees);
  const [courses, setCourses] = useState<Course[]>(sampleCourses);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

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

  // CRUD methods
  const addCentre = async (centre: Omit<Centre, 'id'>) => {
    setCentres(prev => [...prev, { ...centre, id: Date.now().toString() }]);
  };
  const addTrainer = async (trainer: Omit<Trainer, 'id'>) => {
    setTrainers(prev => [...prev, { ...trainer, id: Date.now().toString() }]);
  };
  const addTrainee = async (trainee: Omit<Trainee, 'id'>) => {
    setTrainees(prev => [...prev, { ...trainee, id: Date.now().toString() }]);
  };
  const addCourse = async (course: Omit<Course, 'id'>) => {
    setCourses(prev => [...prev, { ...course, id: Date.now().toString() }]);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentUser,
        login,
        logout,
        centres,
        trainers,
        trainees,
        courses,
        addCentre,
        addTrainer,
        addTrainee,
        addCourse
      }}
    >
      {children}
    </AppContext.Provider>
  );
};