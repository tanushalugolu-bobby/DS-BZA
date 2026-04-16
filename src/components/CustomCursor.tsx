import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useVelocity, useTransform } from 'motion/react';

interface JellyDotProps {
  mousePos: { x: number; y: number };
  delay: number;
  size: number;
  opacity: number;
  offset?: { x: number; y: number };
  color: string;
  glowColor: string;
  isClicking: boolean;
  key?: string | number;
}

function JellyDot({ mousePos, delay, size, opacity, offset = { x: 0, y: 0 }, color, glowColor, isClicking }: JellyDotProps) {
  const x = useMotionValue(mousePos.x + offset.x);
  const y = useMotionValue(mousePos.y + offset.y);

  // Dynamic spring config based on delay and clicking state
  const springConfig = { 
    stiffness: isClicking ? 300 : 150 - delay * 8, 
    damping: isClicking ? 30 : 20 + delay 
  };
  
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    x.set(mousePos.x + offset.x);
    y.set(mousePos.y + offset.y);
  }, [mousePos, offset.x, offset.y, x, y]);

  return (
    <motion.div
      className="fixed rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: springX,
        top: springY,
        x: "-50%",
        y: "-50%",
        opacity: opacity,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 3}px ${glowColor}`,
      }}
      animate={{
        scale: isClicking ? 1.5 : 1,
      }}
    />
  );
}

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [time, setTime] = useState(0);
  const requestRef = useRef<number>();
  
  // Velocity tracking for trailing effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);
  
  // Transform velocity into a "tilt" or "stretch" factor
  const tiltX = useTransform(velocityX, [-2000, 2000], [-15, 15]);
  const tiltY = useTransform(velocityY, [-2000, 2000], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.style.cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const animate = (t: number) => {
      setTime(t);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mouseX, mouseY]);

  // Bioluminescent color palette
  const colors = [
    '#3b82f6', // blue-500
    '#06b6d4', // cyan-500
    '#8b5cf6', // violet-500
    '#2dd4bf', // teal-500
  ];
  
  // Cycle colors based on time
  const colorIndex = Math.floor((time / 1000) % colors.length);
  const currentColor = colors[colorIndex];
  const nextColor = colors[(colorIndex + 1) % colors.length];
  
  // Interpolate color (simplified for CSS)
  const activeColor = currentColor;
  const glowColor = `${activeColor}80`; // 50% opacity for glow

  // Rings of dots (forming the jellyfish body and tentacles)
  const rings = [
    { count: 12, radius: 22, size: 5, opacity: 0.9, delay: 0 },
    { count: 10, radius: 38, size: 4, opacity: 0.7, delay: 12 },
    { count: 8, radius: 55, size: 3, opacity: 0.5, delay: 24 },
    { count: 6, radius: 75, size: 2, opacity: 0.3, delay: 36 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block overflow-hidden">
      {/* Soft Glow Aura */}
      <motion.div
        className="fixed rounded-full blur-3xl opacity-20"
        style={{
          width: 200,
          height: 200,
          left: mousePos.x,
          top: mousePos.y,
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle, ${activeColor} 0%, transparent 70%)`,
        }}
      />

      {/* Jellyfish Head (Center) */}
      <JellyDot 
        mousePos={mousePos}
        delay={0}
        size={isHovering ? 14 : 10}
        opacity={1}
        offset={{ x: 0, y: 0 }}
        color={activeColor}
        glowColor={glowColor}
        isClicking={isClicking}
      />

      {/* Jellyfish Rings - Synchronized Wave & Velocity Lag */}
      {rings.map((ring, rIdx) => {
        return Array.from({ length: ring.count }).map((_, dIdx) => {
          const angle = (dIdx / ring.count) * Math.PI * 2;
          const baseDistance = ring.radius + (isHovering ? 20 : 0) + (isClicking ? 30 : 0);
          
          // Synchronized breathing wave motion
          const wave = Math.sin(time / 300 - rIdx * 0.6) * (isHovering ? 12 : 8);
          const distance = baseDistance + wave;
          
          // Velocity-based lag/stretch
          const lagX = (velocityX.get() / 100) * (rIdx + 1);
          const lagY = (velocityY.get() / 100) * (rIdx + 1);
          
          return (
            <JellyDot 
              key={`ring-${rIdx}-${dIdx}`}
              mousePos={mousePos}
              delay={ring.delay}
              size={isHovering ? ring.size * 1.5 : ring.size}
              opacity={ring.opacity}
              color={activeColor}
              glowColor={glowColor}
              isClicking={isClicking}
              offset={{ 
                x: Math.cos(angle) * distance - lagX, 
                y: Math.sin(angle) * distance - lagY
              }}
            />
          );
        });
      })}

      {/* Pulse Propulsion Effect */}
      <motion.div
        className="fixed border-2 rounded-full"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          x: "-50%",
          y: "-50%",
          borderColor: activeColor,
        }}
        animate={{
          width: isHovering ? [40, 100, 40] : [30, 80, 30],
          height: isHovering ? [40, 100, 40] : [30, 80, 30],
          opacity: [0.3, 0, 0.3],
          scale: isClicking ? 1.5 : 1,
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      
      {/* Click Ripple */}
      {isClicking && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          className="fixed rounded-full border-4"
          style={{
            width: 50,
            height: 50,
            left: mousePos.x,
            top: mousePos.y,
            x: "-50%",
            y: "-50%",
            borderColor: activeColor,
          }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
}


