import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  color?: 'blue' | 'emerald' | 'purple' | 'orange' | 'red' | 'cyan';
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  currency?: string;
  precision?: number;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'blue',
  format = 'number',
  currency = '$',
  precision = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (format === 'currency') {
      return `${currency}${latest.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
    } else if (format === 'percentage') {
      return `${latest.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })}%`;
    } else if (format === 'duration') {
      const hours = Math.floor(latest / 3600);
      const minutes = Math.floor((latest % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } else {
      return latest.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision });
    }
  });

  const spring = useSpring(count, {
    stiffness: 100,
    damping: 30,
    duration: 1.5
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          spring.set(value);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`[data-kpi="${title}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [value, title, spring]);

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          icon: 'text-blue-500',
          glow: 'shadow-blue-500/20',
          progress: 'bg-gradient-to-r from-blue-500 to-blue-400'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          icon: 'text-emerald-500',
          glow: 'shadow-emerald-500/20',
          progress: 'bg-gradient-to-r from-emerald-500 to-emerald-400'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          icon: 'text-purple-500',
          glow: 'shadow-purple-500/20',
          progress: 'bg-gradient-to-r from-purple-500 to-purple-400'
        };
      case 'orange':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/20',
          icon: 'text-orange-500',
          glow: 'shadow-orange-500/20',
          progress: 'bg-gradient-to-r from-orange-500 to-orange-400'
        };
      case 'red':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          icon: 'text-red-500',
          glow: 'shadow-red-500/20',
          progress: 'bg-gradient-to-r from-red-500 to-red-400'
        };
      case 'cyan':
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/20',
          icon: 'text-cyan-500',
          glow: 'shadow-cyan-500/20',
          progress: 'bg-gradient-to-r from-cyan-500 to-cyan-400'
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          icon: 'text-blue-500',
          glow: 'shadow-blue-500/20',
          progress: 'bg-gradient-to-r from-blue-500 to-blue-400'
        };
    }
  };

  const colorClasses = getColorClasses();

  const getChangeIcon = () => {
    if (changeType === 'increase') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (changeType === 'decrease') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-500" />;
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-emerald-500';
    if (changeType === 'decrease') return 'text-red-500';
    return 'text-slate-500';
  };

  return (
    <motion.div
      data-kpi={title}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card className={`
        relative overflow-hidden
        rounded-2xl border border-white/10 
        bg-white/[0.02] backdrop-blur-md 
        shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_10px_40px_rgba(0,0,0,0.35)]
        hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_20px_60px_rgba(0,0,0,0.45)]
        transition-all duration-300
        ${colorClasses.border}
        ${colorClasses.glow}
      `}>
        {/* Animated background gradient */}
        <div className={`
          absolute inset-0 opacity-20
          bg-gradient-to-br from-transparent via-cyan-500/10 to-transparent
          animate-pulse
        `} />
        
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isVisible ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${colorClasses.bg} ${colorClasses.icon}
                    backdrop-blur-sm
                  `}
                >
                  {icon}
                </motion.div>
              )}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">
                  {title}
                </h3>
                {change !== undefined && (
                  <div className="flex items-center gap-1">
                    {getChangeIcon()}
                    <span className={`text-xs font-medium ${getChangeColor()}`}>
                      {change > 0 ? '+' : ''}{change}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-white"
          >
            <motion.span>
              {rounded}
            </motion.span>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            initial={{ width: 0 }}
            animate={isVisible ? { width: '100%' } : { width: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible ? { width: `${Math.min(100, (value / 1000) * 100)}%` } : { width: 0 }}
              transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
              className={`h-full ${colorClasses.progress} rounded-full`}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KpiCard;
