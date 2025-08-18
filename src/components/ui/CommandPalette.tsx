import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import { 
  Search, 
  Settings, 
  User, 
  BarChart3, 
  FileText, 
  Users, 
  Building, 
  Brain,
  Moon,
  Sun,
  LogOut,
  Copy,
  ExternalLink,
  Command as CommandIcon
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const { currentUser, logout } = useAppContext();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const commands: CommandItem[] = [
    {
      id: 'overview',
      title: 'Go to Overview',
      subtitle: 'View dashboard overview',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => {
        // Navigate to overview
        onOpenChange(false);
      },
      keywords: ['dashboard', 'overview', 'home', 'main']
    },
    {
      id: 'trainees',
      title: 'Manage Trainees',
      subtitle: 'View and manage trainee data',
      icon: <Users className="w-4 h-4" />,
      action: () => {
        // Navigate to trainees
        onOpenChange(false);
      },
      keywords: ['trainees', 'students', 'users', 'people']
    },
    {
      id: 'instructors',
      title: 'Manage Instructors',
      subtitle: 'View and manage instructor data',
      icon: <User className="w-4 h-4" />,
      action: () => {
        // Navigate to instructors
        onOpenChange(false);
      },
      keywords: ['instructors', 'teachers', 'staff', 'educators']
    },
    {
      id: 'centres',
      title: 'Manage Centres',
      subtitle: 'View and manage training centres',
      icon: <Building className="w-4 h-4" />,
      action: () => {
        // Navigate to centres
        onOpenChange(false);
      },
      keywords: ['centres', 'centers', 'locations', 'facilities']
    },
    {
      id: 'reports',
      title: 'View Reports',
      subtitle: 'Access all reports and analytics',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        // Navigate to reports
        onOpenChange(false);
      },
      keywords: ['reports', 'analytics', 'data', 'statistics']
    },
    {
      id: 'analytics',
      title: 'Predictive Analytics',
      subtitle: 'AI-powered insights and predictions',
      icon: <Brain className="w-4 h-4" />,
      action: () => {
        // Navigate to analytics
        onOpenChange(false);
      },
      keywords: ['analytics', 'ai', 'predictions', 'insights', 'machine learning']
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Configure application settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => {
        // Navigate to settings
        onOpenChange(false);
      },
      keywords: ['settings', 'config', 'preferences', 'options']
    },
    {
      id: 'copy-api-key',
      title: 'Copy API Key',
      subtitle: 'Copy your API key to clipboard',
      icon: <Copy className="w-4 h-4" />,
      action: () => {
        navigator.clipboard.writeText('bictda-api-key-12345');
        onOpenChange(false);
      },
      keywords: ['api', 'key', 'copy', 'clipboard', 'token']
    },
    {
      id: 'logout',
      title: 'Logout',
      subtitle: `Sign out as ${currentUser?.name}`,
      icon: <LogOut className="w-4 h-4" />,
      action: () => {
        logout();
        onOpenChange(false);
      },
      keywords: ['logout', 'sign out', 'exit', 'quit']
    }
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="
              rounded-2xl border border-white/10 
              bg-slate-900/95 backdrop-blur-xl
              shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_20px_60px_rgba(0,0,0,0.5)]
              overflow-hidden
            ">
              <div className="flex items-center border-b border-white/10 px-4 py-3">
                <Search className="w-4 h-4 text-slate-400 mr-3" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search commands..."
                  className="
                    flex-1 bg-transparent text-white placeholder-slate-400
                    outline-none border-none text-sm
                  "
                />
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CommandIcon className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              <Command.List className="max-h-96 overflow-y-auto p-2">
                <Command.Empty className="text-slate-400 text-sm py-8 text-center">
                  No results found.
                </Command.Empty>

                {commands.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.id}
                    onSelect={item.action}
                    className="
                      flex items-center gap-3 px-3 py-2 rounded-lg
                      text-slate-300 hover:text-white
                      hover:bg-white/5 cursor-pointer
                      transition-colors duration-150
                      data-[selected=true]:bg-white/10 data-[selected=true]:text-white
                    "
                  >
                    <div className="
                      w-8 h-8 rounded-lg flex items-center justify-center
                      bg-white/5 text-slate-400
                      data-[selected=true]:bg-white/10 data-[selected=true]:text-white
                    ">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-xs text-slate-500">{item.subtitle}</div>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.List>

              <div className="border-t border-white/10 px-4 py-2">
                <div className="text-xs text-slate-500">
                  BICTDA Command Palette • {commands.length} commands available
                </div>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
