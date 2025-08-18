import React from 'react';

interface Background3DProps {
  showParticles?: boolean;
  showGradient?: boolean;
}

const Background3D: React.FC<Background3DProps> = ({
  showParticles = true,
  showGradient = true
}) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      )}
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
      
      {/* Floating Particles (CSS-based) */}
      {showParticles && (
        <>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }} />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400/40 rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '8s' }} />
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }} />
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-cyan-400/25 rounded-full animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }} />
          <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-float" style={{ animationDelay: '4s', animationDuration: '6.5s' }} />
          <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '5s', animationDuration: '8.5s' }} />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-cyan-400/20 rounded-full animate-float" style={{ animationDelay: '6s', animationDuration: '7.5s' }} />
          <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-400/35 rounded-full animate-float" style={{ animationDelay: '7s', animationDuration: '9.5s' }} />
        </>
      )}
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/50" />
    </div>
  );
};

export default Background3D;
