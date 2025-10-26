'use client';

import { useState, useEffect } from 'react';

// Pre-computed random values for better performance - using fixed values to avoid hydration issues
const particleData = [
  { id: 0, width: 1.2, height: 1.8, opacity: 0.3, top: 15, left: 25, delay: 0.5, duration: 2.5 },
  { id: 1, width: 1.8, height: 1.3, opacity: 0.4, top: 35, left: 60, delay: 1.2, duration: 3.8 },
  { id: 2, width: 1.5, height: 2.1, opacity: 0.25, top: 55, left: 15, delay: 2.1, duration: 4.2 },
  { id: 3, width: 1.1, height: 1.6, opacity: 0.35, top: 75, left: 80, delay: 0.8, duration: 3.1 },
  { id: 4, width: 2.0, height: 1.9, opacity: 0.28, top: 25, left: 45, delay: 1.8, duration: 2.9 },
  { id: 5, width: 1.4, height: 1.7, opacity: 0.42, top: 65, left: 30, delay: 3.2, duration: 4.5 },
  { id: 6, width: 1.6, height: 2.0, opacity: 0.31, top: 45, left: 70, delay: 0.3, duration: 3.6 },
  { id: 7, width: 1.3, height: 1.4, opacity: 0.38, top: 85, left: 55, delay: 2.5, duration: 2.8 },
  { id: 8, width: 1.9, height: 1.5, opacity: 0.29, top: 5, left: 90, delay: 1.5, duration: 4.1 },
  { id: 9, width: 1.7, height: 1.8, opacity: 0.33, top: 95, left: 10, delay: 0.9, duration: 3.3 }
];

const dustData = [
  { id: 0, top: 25, left: 20, delay: 0.5, duration: 4.2 },
  { id: 1, top: 45, left: 60, delay: 1.8, duration: 5.1 },
  { id: 2, top: 65, left: 35, delay: 2.3, duration: 3.7 },
  { id: 3, top: 35, left: 80, delay: 0.9, duration: 4.8 },
  { id: 4, top: 55, left: 15, delay: 1.6, duration: 3.4 },
  { id: 5, top: 75, left: 70, delay: 2.7, duration: 5.3 },
  { id: 6, top: 15, left: 45, delay: 0.2, duration: 4.6 },
  { id: 7, top: 85, left: 25, delay: 1.4, duration: 3.9 },
  { id: 8, top: 5, left: 85, delay: 2.1, duration: 4.4 },
  { id: 9, top: 95, left: 50, delay: 0.7, duration: 3.8 }
];

const rainData = [
  { id: 0, width: 0.8, height: 8, top: 5, left: 15, delay: 0.3, duration: 0.6, rotation: 15 },
  { id: 1, width: 1.2, height: 12, top: 10, left: 45, delay: 0.8, duration: 0.9, rotation: 25 },
  { id: 2, width: 0.6, height: 6, top: 8, left: 75, delay: 0.1, duration: 0.4, rotation: 18 },
  { id: 3, width: 1.0, height: 10, top: 12, left: 30, delay: 1.2, duration: 0.7, rotation: 22 },
  { id: 4, width: 0.9, height: 9, top: 6, left: 60, delay: 0.5, duration: 0.8, rotation: 20 },
  { id: 5, width: 1.1, height: 11, top: 14, left: 85, delay: 0.9, duration: 1.0, rotation: 28 },
  { id: 6, width: 0.7, height: 7, top: 3, left: 25, delay: 0.2, duration: 0.5, rotation: 16 },
  { id: 7, width: 1.3, height: 13, top: 16, left: 55, delay: 1.5, duration: 1.1, rotation: 30 },
  { id: 8, width: 0.8, height: 8, top: 7, left: 90, delay: 0.4, duration: 0.6, rotation: 19 },
  { id: 9, width: 1.0, height: 10, top: 11, left: 40, delay: 1.0, duration: 0.8, rotation: 24 }
];

const windData = [
  { id: 0, width: 18, height: 0.8, top: 25, left: 10, delay: 1.2, duration: 2.8, rotation: 12 },
  { id: 1, width: 25, height: 1.2, top: 45, left: 30, delay: 2.5, duration: 3.6, rotation: 18 },
  { id: 2, width: 15, height: 0.6, top: 65, left: 50, delay: 0.8, duration: 2.2, rotation: 8 },
  { id: 3, width: 22, height: 1.0, top: 35, left: 70, delay: 1.8, duration: 3.1, rotation: 15 },
  { id: 4, width: 20, height: 0.9, top: 55, left: 20, delay: 0.5, duration: 2.9, rotation: 10 },
  { id: 5, width: 28, height: 1.3, top: 75, left: 60, delay: 3.2, duration: 4.1, rotation: 22 },
  { id: 6, width: 16, height: 0.7, top: 15, left: 80, delay: 1.0, duration: 2.5, rotation: 14 },
  { id: 7, width: 24, height: 1.1, top: 85, left: 40, delay: 2.2, duration: 3.4, rotation: 20 },
  { id: 8, width: 19, height: 0.8, top: 5, left: 90, delay: 0.3, duration: 2.7, rotation: 11 },
  { id: 9, width: 26, height: 1.2, top: 95, left: 15, delay: 1.6, duration: 3.8, rotation: 16 }
];

const debrisData = [
  { id: 0, width: 3, height: 2, top: 35, left: 20, delay: 1.5, duration: 12, rotation: 45 },
  { id: 1, width: 4, height: 3, top: 55, left: 60, delay: 3.2, duration: 15, rotation: 120 },
  { id: 2, width: 2, height: 1, top: 75, left: 35, delay: 0.8, duration: 10, rotation: 270 },
  { id: 3, width: 5, height: 4, top: 45, left: 80, delay: 2.1, duration: 18, rotation: 180 },
  { id: 4, width: 3, height: 2, top: 65, left: 15, delay: 1.2, duration: 14, rotation: 90 },
  { id: 5, width: 4, height: 3, top: 25, left: 70, delay: 4.5, duration: 16, rotation: 315 },
  { id: 6, width: 2, height: 1, top: 85, left: 45, delay: 0.5, duration: 11, rotation: 225 },
  { id: 7, width: 3, height: 2, top: 15, left: 85, delay: 2.8, duration: 13, rotation: 150 },
  { id: 8, width: 4, height: 3, top: 95, left: 25, delay: 1.8, duration: 17, rotation: 60 },
  { id: 9, width: 2, height: 1, top: 5, left: 55, delay: 0.3, duration: 9, rotation: 300 }
];

export default function AviaMastersGame() {
  const [mounted, setMounted] = useState(false);
  const [showTakeoff, setShowTakeoff] = useState(false);

  // Debug logging removed for production

  useEffect(() => {
    // Ensure we're on the client side and fully loaded
    if (typeof window === 'undefined') return;
    
    // Add a delay to ensure proper initialization after hydration
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // Trigger takeoff animation every 15 seconds
    const interval = setInterval(() => {
      setShowTakeoff(true);
      setTimeout(() => setShowTakeoff(false), 5000);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Don't render anything on server side
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Enhanced Sky Background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6] via-[#7B68EE] via-[#4169E1] via-[#4A90E2] to-[#87CEEB]">
        {/* Sun effect */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-yellow-300 rounded-full blur-sm opacity-60 animate-pulse" />
        <div className="absolute top-12 right-22 w-24 h-24 bg-yellow-200 rounded-full blur-md opacity-40" />
        
        {/* Enhanced light rays with gradient */}
        <div className="absolute inset-0 opacity-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 left-1/2 w-1 h-full origin-top"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,215,0,0.3), transparent 80%)',
                transform: `rotate(${i * 18 - 90}deg)`,
                marginLeft: '-0.5px',
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>

        {/* Simplified atmospheric particles */}
        <div className="absolute inset-0">
          {particleData.slice(0, 5).map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                backgroundColor: `rgba(255,255,255,${particle.opacity})`,
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Simplified dust particles */}
        <div className="absolute inset-0">
          {dustData.slice(0, 3).map((dust) => (
            <div
              key={`dust-${dust.id}`}
              className="absolute w-0.5 h-0.5 bg-yellow-200/40 rounded-full"
              style={{
                top: `${dust.top}%`,
                left: `${dust.left}%`,
                animation: `float ${dust.duration}s ease-in-out ${dust.delay}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Simplified Clouds Layer - Background */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <Cloud
            key={`bg-${i}`}
            delay={i * 3}
            top={`${25 + i * 10}%`}
            size={0.6 + (i % 3) * 0.2}
            duration={20 + (i % 4) * 5}
            opacity={0.6 + (i % 2) * 0.2}
            variant={i % 2}
          />
        ))}
      </div>

      {/* Distant mountains silhouette */}
      <div className="absolute bottom-1/4 left-0 right-0 h-1/3 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1200 200" fill="none">
          <path d="M0,200 L50,150 L100,180 L200,120 L300,140 L400,100 L500,130 L600,90 L700,110 L800,80 L900,100 L1000,70 L1100,90 L1200,60 L1200,200 Z" 
                fill="rgba(30,30,60,0.4)" />
          <path d="M0,200 L100,160 L200,190 L400,140 L600,160 L800,130 L1000,150 L1200,120 L1200,200 Z" 
                fill="rgba(20,20,50,0.3)" />
        </svg>
      </div>

      {/* Enhanced Ocean Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-[#1e5a8e] via-[#1a4d7a] to-[#0d3d5c]">
        {/* Animated waves */}
        <div className="absolute inset-0 opacity-50">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves1" x="0" y="0" width="120" height="25" patternUnits="userSpaceOnUse">
                <path d="M0 15 Q 30 8, 60 15 T 120 15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              </pattern>
              <pattern id="waves2" x="0" y="0" width="80" height="15" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q 20 5, 40 10 T 80 10" fill="none" stroke="rgba(135,206,235,0.3)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves1)" />
            <rect width="100%" height="100%" fill="url(#waves2)" />
          </svg>
        </div>
        
        {/* Ocean foam */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/20 to-transparent" />
        
        {/* Underwater light effects */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-300/20 rounded-full animate-pulse"
              style={{
                bottom: `${10 + i * 15}px`,
                left: `${i * 12.5}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Aircraft Carrier */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center">
        <svg width="900" height="350" viewBox="0 0 900 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Enhanced ocean shadow with multiple layers */}
          <ellipse cx="450" cy="320" rx="420" ry="45" fill="rgba(0,0,0,0.2)" />
          <ellipse cx="450" cy="315" rx="380" ry="35" fill="rgba(0,0,0,0.1)" />
          <ellipse cx="450" cy="310" rx="340" ry="25" fill="rgba(0,0,0,0.05)" />

          {/* Hull - main body with gradient */}
          <defs>
            <linearGradient id="hullGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:'#4A5568', stopOpacity:1}} />
              <stop offset="50%" style={{stopColor:'#2D3748', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#1A202C', stopOpacity:1}} />
            </linearGradient>
          </defs>
          <path
            d="M 200 250 L 180 280 L 180 310 L 720 310 L 720 280 L 700 250 Z"
            fill="url(#hullGradient)"
          />

          {/* Hull side details */}
          <path
            d="M 180 280 L 180 310 L 200 310 L 200 280 Z"
            fill="#1A202C"
          />
          <path
            d="M 700 280 L 700 310 L 720 310 L 720 280 Z"
            fill="#4A5568"
          />

          {/* Hull bottom stripe (red) */}
          <rect x="185" y="305" width="530" height="5" fill="#DC2626" />

          {/* Main deck */}
          <path
            d="M 150 250 L 750 250 L 720 280 L 180 280 Z"
            fill="#6B7280"
          />

          {/* Deck details - perspective lines */}
          {[...Array(25)].map((_, i) => (
            <line
              key={`deck-${i}`}
              x1={170 + i * 23}
              y1="255"
              x2={190 + i * 21}
              y2="275"
              stroke="#4B5563"
              strokeWidth="1.5"
            />
          ))}

          {/* Runway markings - yellow lines */}
          <rect x="180" y="260" width="520" height="3" fill="#FCD34D" opacity="0.9" />
          <rect x="180" y="268" width="520" height="3" fill="#FCD34D" opacity="0.9" />

          {/* Flight deck edge lights (left) */}
          {[...Array(15)].map((_, i) => (
            <circle
              key={`light-l-${i}`}
              cx={160 + i * 35}
              cy={252 + i * 1.8}
              r="3"
              fill="#FBBF24"
              opacity="0.9"
            />
          ))}

          {/* Flight deck edge lights (right) */}
          {[...Array(15)].map((_, i) => (
            <circle
              key={`light-r-${i}`}
              cx={190 + i * 35}
              cy={276 - i * 1.8}
              r="3"
              fill="#FBBF24"
              opacity="0.9"
            />
          ))}

          {/* Control tower/Island */}
          <g>
            {/* Base level */}
            <rect x="520" y="200" width="140" height="50" fill="#4B5563" />
            <rect x="530" y="205" width="120" height="40" fill="#6B7280" />

            {/* Second level */}
            <rect x="540" y="165" width="100" height="35" fill="#4B5563" />
            <rect x="548" y="170" width="84" height="28" fill="#6B7280" />

            {/* Top level */}
            <rect x="560" y="140" width="60" height="25" fill="#4B5563" />
            <rect x="566" y="144" width="48" height="18" fill="#6B7280" />

            {/* Windows */}
            <rect x="545" y="215" width="12" height="15" fill="rgba(135,206,235,0.7)" rx="1" />
            <rect x="562" y="215" width="12" height="15" fill="rgba(135,206,235,0.7)" rx="1" />
            <rect x="579" y="215" width="12" height="15" fill="rgba(135,206,235,0.7)" rx="1" />
            <rect x="596" y="215" width="12" height="15" fill="rgba(135,206,235,0.7)" rx="1" />
            <rect x="613" y="215" width="12" height="15" fill="rgba(135,206,235,0.7)" rx="1" />
            <rect x="630" y="215" width="12" height="15" fill="rgba(135,206,235,0.7)" rx="1" />

            {/* Radar dishes */}
            <ellipse cx="555" cy="155" rx="15" ry="5" fill="#9CA3AF" />
            <ellipse cx="625" cy="155" rx="15" ry="5" fill="#9CA3AF" />

            {/* Antennas */}
            <line x1="590" y1="140" x2="590" y2="110" stroke="#374151" strokeWidth="3" />
            <circle cx="590" cy="108" r="5" fill="#EF4444" className="animate-pulse" />
          </g>

          {/* Takeoff airplane animation */}
          {showTakeoff && (
            <g
              style={{
                animation: 'takeoff 5s ease-out forwards',
              }}
            >
              <g transform="translate(0, 0)">
                <image
                  href="/airplane.svg"
                  x="245"
                  y="220"
                  width="100"
                  height="60"
                  className="takeoff-plane"
                />
              </g>
            </g>
          )}

          {/* Text "AVIA MASTERS" on hull */}
          <text x="450" y="270" fill="#FFFFFF" fontSize="20" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            AVIA MASTERS
          </text>

          {/* Enhanced steam/smoke from deck */}
          <g opacity="0.7">
            <ellipse cx="300" cy="245" rx="18" ry="10" fill="rgba(200,200,200,0.8)" />
            <ellipse cx="320" cy="240" rx="15" ry="8" fill="rgba(220,220,220,0.7)" />
            <ellipse cx="340" cy="235" rx="12" ry="6" fill="rgba(240,240,240,0.6)" />
            <ellipse cx="360" cy="230" rx="10" ry="5" fill="rgba(250,250,250,0.5)" />
            <ellipse cx="380" cy="225" rx="8" ry="4" fill="rgba(255,255,255,0.4)" />
            <ellipse cx="400" cy="220" rx="6" ry="3" fill="rgba(255,255,255,0.3)" />
          </g>

          {/* Additional deck equipment */}
          <g>
            {/* Radar arrays */}
            <rect x="250" y="240" width="8" height="15" fill="#4B5563" />
            <circle cx="254" cy="235" r="3" fill="#10B981" className="animate-pulse" />
            
            <rect x="350" y="240" width="8" height="15" fill="#4B5563" />
            <circle cx="354" cy="235" r="3" fill="#10B981" className="animate-pulse" />
            
            <rect x="450" y="240" width="8" height="15" fill="#4B5563" />
            <circle cx="454" cy="235" r="3" fill="#10B981" className="animate-pulse" />
          </g>

          {/* Enhanced deck lights */}
          <g>
            {[...Array(12)].map((_, i) => (
              <circle
                key={`enhanced-light-${i}`}
                cx={200 + i * 50}
                cy="245"
                r="3"
                fill="#FBBF24"
                opacity="0.9"
                className="animate-pulse"
                style={{ 
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: `${1 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </g>

          {/* Deck lights blinking */}
          <g>
            {[...Array(8)].map((_, i) => (
              <circle
                key={`deck-light-${i}`}
                cx={200 + i * 60}
                cy="245"
                r="2"
                fill="#FBBF24"
                opacity="0.8"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </g>

          {/* Water wake effects */}
          <g opacity="0.4">
            <path d="M 200 310 Q 300 320, 400 310 T 600 310" stroke="rgba(59,130,246,0.6)" strokeWidth="3" fill="none" />
            <path d="M 220 315 Q 320 325, 420 315 T 620 315" stroke="rgba(59,130,246,0.4)" strokeWidth="2" fill="none" />
          </g>

          <style>
            {`
              @keyframes takeoff {
                0% {
                  transform: translate(0, 0) rotate(0deg);
                  opacity: 1;
                }
                30% {
                  transform: translate(200px, 0) rotate(0deg);
                  opacity: 1;
                }
                50% {
                  transform: translate(350px, -50px) rotate(-10deg);
                  opacity: 1;
                }
                100% {
                  transform: translate(600px, -200px) rotate(-15deg);
                  opacity: 0;
                }
              }
            `}
          </style>
        </svg>
      </div>

      {/* Enhanced Flying Airplanes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <Airplane
            key={i}
            delay={i * 6}
            top={`${20 + i * 25}%`}
            duration={12 + i * 2}
            color={['#DC143C', '#1E40AF', '#10B981'][i]}
            size={1}
            trail={i % 2 === 0}
          />
        ))}
      </div>

      {/* Formation flying group */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(2)].map((_, i) => (
          <FormationPlane
            key={`formation-${i}`}
            delay={i * 3 + 10}
            top={`${30 + i * 20}%`}
            duration={20}
            offset={i * 40}
            color={['#3B82F6', '#10B981'][i]}
          />
        ))}
      </div>

      {/* Simplified Clouds Layer - Foreground */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <Cloud
            key={`fg-${i}`}
            delay={i * 4 + 1}
            top={`${30 + i * 12}%`}
            size={0.7 + (i % 2) * 0.3}
            duration={15 + (i % 3) * 5}
            opacity={0.8 + (i % 2) * 0.1}
            variant={i % 2}
          />
        ))}
      </div>

      {/* Simplified weather effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Rain drops with varying sizes */}
        {rainData.slice(0, 5).map((rain) => (
          <div
            key={`rain-${rain.id}`}
            className="absolute bg-blue-200/50 animate-pulse"
            style={{
              width: `${rain.width}px`,
              height: `${rain.height}px`,
              top: `${rain.top}%`,
              left: `${rain.left}%`,
              animationDelay: `${rain.delay}s`,
              animationDuration: `${rain.duration}s`,
              transform: `rotate(${rain.rotation}deg)`,
            }}
          />
        ))}
        
        {/* Wind streaks with different opacities */}
        {windData.slice(0, 3).map((wind) => (
          <div
            key={`wind-${wind.id}`}
            className="absolute bg-white/30 animate-pulse"
            style={{
              width: `${wind.width}px`,
              height: `${wind.height}px`,
              top: `${wind.top}%`,
              left: `${wind.left}%`,
              animationDelay: `${wind.delay}s`,
              animationDuration: `${wind.duration}s`,
              transform: `rotate(${wind.rotation}deg)`,
            }}
          />
        ))}

        {/* Floating debris */}
        {debrisData.slice(0, 3).map((debris) => (
          <div
            key={`debris-${debris.id}`}
            className="absolute bg-gray-400/30 rounded-sm"
            style={{
              width: `${debris.width}px`,
              height: `${debris.height}px`,
              top: `${debris.top}%`,
              left: `${debris.left}%`,
              animation: `drift ${debris.duration}s linear ${debris.delay}s infinite`,
              transform: `rotate(${debris.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Floating Multipliers in Air */}
      <div className="absolute top-1/4 left-1/4 z-15">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full animate-bounce flex items-center justify-center shadow-2xl border-2 border-yellow-300" style={{ animationDelay: '1s' }}>
            <div className="text-black text-xl font-bold">x2</div>
          </div>
          <div className="absolute inset-0 w-14 h-14 bg-yellow-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      <div className="absolute top-1/3 right-1/4 z-15">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full animate-bounce flex items-center justify-center shadow-2xl border-2 border-green-300" style={{ animationDelay: '2s' }}>
            <div className="text-white text-xl font-bold">x3</div>
          </div>
          <div className="absolute inset-0 w-14 h-14 bg-green-400/30 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <div className="absolute bottom-1/3 left-1/3 z-15">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-400 via-cyan-500 to-sky-500 rounded-full animate-bounce flex items-center justify-center shadow-2xl border-2 border-blue-300" style={{ animationDelay: '3s' }}>
            <div className="text-white text-xl font-bold">x5</div>
          </div>
          <div className="absolute inset-0 w-14 h-14 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        </div>
      </div>

      <div className="absolute top-1/2 right-1/3 z-15">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 rounded-full animate-bounce flex items-center justify-center shadow-2xl border-2 border-purple-300" style={{ animationDelay: '4s' }}>
            <div className="text-white text-xl font-bold">x4</div>
          </div>
          <div className="absolute inset-0 w-14 h-14 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      <div className="absolute bottom-1/4 right-1/5 z-15">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-r from-red-400 via-rose-500 to-pink-500 rounded-full animate-bounce flex items-center justify-center shadow-2xl border-2 border-red-300" style={{ animationDelay: '5s' }}>
            <div className="text-white text-xl font-bold">x6</div>
          </div>
          <div className="absolute inset-0 w-14 h-14 bg-red-400/30 rounded-full animate-ping" style={{ animationDelay: '5s' }} />
        </div>
      </div>

      {/* Additional floating elements */}
      <div className="absolute top-1/6 left-1/6 z-15">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse flex items-center justify-center shadow-lg border border-indigo-300" style={{ animationDelay: '6s' }}>
          <div className="text-white text-sm font-bold">x1.5</div>
        </div>
      </div>

      <div className="absolute bottom-1/6 right-1/6 z-15">
        <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse flex items-center justify-center shadow-lg border border-amber-300" style={{ animationDelay: '7s' }}>
          <div className="text-black text-sm font-bold">x7</div>
        </div>
      </div>
    </div>
  );
}

interface AirplaneProps {
  delay: number;
  top: string;
  duration: number;
  color?: string;
  size?: number;
  trail?: boolean;
}

function Airplane({ delay, top, duration, color = '#C41E3A', size = 1, trail = false }: AirplaneProps) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left: '-300px',
        animation: `fly ${duration}s linear ${delay}s infinite`,
        transform: `scale(${size})`,
      }}
    >
      <img
        src="/airplane.svg"
        alt="Airplane"
        width="100"
        height="60"
        style={{
          filter: `hue-rotate(${getHueRotation(color)}deg) saturate(1.2)`,
          opacity: 0.9
        }}
      />
    </div>
  );
}

// Helper function to convert color to hue rotation
function getHueRotation(color: string): number {
  const colorMap: { [key: string]: number } = {
    '#C41E3A': 0,      // Red
    '#1E40AF': 240,     // Blue  
    '#10B981': 160,     // Green
    '#F59E0B': 45,      // Orange
    '#8B5CF6': 270,     // Purple
    '#EF4444': 0,       // Red
  };
  return colorMap[color] || 0;
}

interface CloudProps {
  delay: number;
  top: string;
  size: number;
  duration: number;
  opacity?: number;
  variant?: number;
}

function Cloud({ delay, top, size, duration, opacity = 0.7, variant = 0 }: CloudProps) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left: '-200px',
        animation: `drift ${duration}s linear ${delay}s infinite`,
        opacity,
      }}
    >
      <svg
        width={180 * size}
        height={100 * size}
        viewBox="0 0 180 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main cloud body - white */}
        <ellipse cx="45" cy="60" rx="40" ry="32" fill="white" />
        <ellipse cx="80" cy="55" rx="45" ry="38" fill="white" />
        <ellipse cx="115" cy="60" rx="40" ry="32" fill="white" />
        <ellipse cx="60" cy="40" rx="35" ry="30" fill="white" />
        <ellipse cx="95" cy="38" rx="38" ry="32" fill="white" />
        <ellipse cx="130" cy="45" rx="30" ry="25" fill="white" />

        {/* Pink/coral tint on bottom for depth */}
        <ellipse cx="45" cy="70" rx="40" ry="18" fill="rgba(255,160,180,0.4)" />
        <ellipse cx="80" cy="68" rx="45" ry="20" fill="rgba(255,160,180,0.4)" />
        <ellipse cx="115" cy="70" rx="40" ry="18" fill="rgba(255,160,180,0.4)" />
      </svg>
    </div>
  );
}

interface FormationPlaneProps {
  delay: number;
  top: string;
  duration: number;
  offset: number;
  color?: string;
}

function FormationPlane({ delay, top, duration, offset, color = '#1E40AF' }: FormationPlaneProps) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left: `-200px`,
        animation: `fly ${duration}s linear ${delay}s infinite`,
        transform: `translateY(${offset}px)`,
      }}
    >
      <img
        src="/airplane.svg"
        alt="Airplane"
        width="100"
        height="60"
        style={{
          filter: `hue-rotate(${getHueRotation(color)}deg) saturate(1.2)`,
          opacity: 0.9
        }}
      />
    </div>
  );
}