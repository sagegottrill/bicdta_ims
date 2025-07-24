# BICTDA Information Management System

A comprehensive digital literacy program management system for the Borno Information and Communication Technology Development Agency (BICTDA).

## Features

- **Admin Dashboard**: Complete oversight of all training centers, instructors, trainees, and courses
- **Instructor Dashboard**: Manage trainees, track attendance, and monitor course progress
- **Trainee Management**: Enroll and track student progress across different centers
- **Analytics & Reporting**: Comprehensive data visualization and export capabilities
- **Centre Operations**: Monitor training center capacity and utilization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Login Credentials

### Admin Access
- **Email**: `admin.user@bictda.bo.gov.ng`
- **Role**: Full system access with analytics and reporting

### Instructor Access
- **Email**: `instructor@bictda.bo.gov.ng`
- **Role**: Trainee management and course monitoring

## System Overview

### Admin Dashboard Features
- **Overview**: Key metrics and performance indicators
- **Trainee Analysis**: Demographics and enrollment statistics
- **Centre Analysis**: Location-based performance tracking
- **Export Capabilities**: CSV export for all data types

### Instructor Dashboard Features
- **Trainee Management**: Add and track student progress
- **Attendance Tracking**: Mark daily attendance
- **Course Analytics**: Monitor course-specific metrics
- **Announcements**: Send notifications to trainees
- **Reports**: Generate trainee reports in CSV format

### Sample Data
The system comes pre-loaded with sample data including:
- 3 Training Centers (Maiduguri, Bama, Gwoza)
- 4 Courses (Basic Computer Skills, Digital Marketing, Web Development, Data Analysis)
- 5 Sample Trainees with diverse demographics
- 3 Instructors assigned to different centers

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Shadcn/ui components
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   ├── forms/          # Form components for data entry
│   ├── ui/             # Reusable UI components
│   ├── AppLayout.tsx   # Main layout component
│   ├── LoginPage.tsx   # Authentication page
│   ├── AdminDashboard.tsx
│   └── InstructorDashboard.tsx
├── contexts/
│   └── AppContext.tsx  # Global state management
├── pages/
│   └── Index.tsx       # Main application entry
└── main.tsx           # Application bootstrap
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Data Types**: Add interfaces to `AppContext.tsx`
2. **New Forms**: Create form components in `components/forms/`
3. **New Analytics**: Add chart components in `components/admin/`
4. **New Pages**: Add routes in `App.tsx` and create page components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is developed for the Borno Information and Communication Technology Development Agency (BICTDA).

---

**BICTDA Digital Literacy Program**  
Empowering Borno State through technology and digital skills development.
