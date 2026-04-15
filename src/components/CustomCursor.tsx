import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

interface JellyDotProps {
  mousePos: { x: number; y: number };
  delay: number;
  size: number;
  opacity: number;
  offset?: { x: number; y: number };
  key?: string | number;
}

function JellyDot({ mousePos, delay, size, opacity, offset = { x: 0, y: 0 } }: JellyDotProps) {
  const x = useMotionValue(mousePos.x + offset.x);
  const y = useMotionValue(mousePos.y + offset.y);

  const springConfig = { stiffness: 150 - delay * 10, damping: 20 + delay };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    x.set(mousePos.x + offset.x);
    y.set(mousePos.y + offset.y);
  }, [mousePos, offset.x, offset.y, x, y]);

  return (
    <motion.div
      className="fixed bg-primary rounded-full"
      style={{
        width: size,
        height: size,
        left: springX,
        top: springY,
        x: "-50%",
        y: "-50%",
        opacity: opacity,
        boxShadow: `0 0 ${size * 2}px rgba(59, 130, 246, 0.5)`,
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
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
  }, []);

  // Rings of dots (forming the jellyfish body and tentacles)
  const rings = [
    { count: 12, radius: 20, size: 4, opacity: 0.8, delay: 0 },
    { count: 8, radius: 35, size: 3, opacity: 0.6, delay: 10 },
    { count: 6, radius: 50, size: 2, opacity: 0.4, delay: 20 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Jellyfish Head (Center) */}
      <JellyDot 
        mousePos={mousePos}
        delay={0}
        size={isHovering ? 12 : 8}
        opacity={1}
        offset={{ x: 0, y: 0 }}
      />

      {/* Jellyfish Rings - Synchronized Wave */}
      {rings.map((ring, rIdx) => {
        return Array.from({ length: ring.count }).map((_, dIdx) => {
          const angle = (dIdx / ring.count) * Math.PI * 2;
          const baseDistance = ring.radius + (isHovering ? 15 : 0);
          
          // Synchronized breathing wave motion for the whole ring
          const wave = Math.sin(time / 250 - rIdx * 0.5) * 8;
          const distance = baseDistance + wave;
          
          return (
            <JellyDot 
              key={`ring-${rIdx}-${dIdx}`}
              mousePos={mousePos}
              delay={ring.delay}
              size={isHovering ? ring.size * 1.5 : ring.size}
              opacity={ring.opacity}
              offset={{ 
                x: Math.cos(angle) * distance, 
                y: Math.sin(angle) * distance
              }}
            />
          );
        });
      })}

      {/* Pulse Propulsion Effect */}
      <motion.div
        className="fixed border-2 border-primary/20 rounded-full"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: isHovering ? [40, 80, 40] : [30, 60, 30],
          height: isHovering ? [40, 80, 40] : [30, 60, 30],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </div>
  );
}


