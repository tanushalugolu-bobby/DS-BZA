import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';

export default function LiveWallpaper() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax effect based on scroll
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 45]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none perspective-1000">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-bg-app opacity-50" />
      
      {/* Floating 3D Shapes */}
      <motion.div 
        style={{ 
          x: mousePos.x * 0.5, 
          y: y1,
          rotateZ: rotate,
          translateZ: 100
        }}
        className="absolute top-[10%] left-[15%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"
      />
      
      <motion.div 
        style={{ 
          x: mousePos.x * -0.8, 
          y: y2,
          rotateZ: -rotate,
          translateZ: -50
        }}
        className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-400/5 rounded-full blur-[100px]"
      />

      {/* Glassmorphic Floating Cards */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotateX: [10, 20, 10],
          rotateY: [-10, -20, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          x: mousePos.x * 0.2,
          y: mousePos.y * 0.2,
          translateZ: 200,
          transformStyle: "preserve-3d"
        }}
        className="absolute top-1/4 right-1/4 w-32 h-40 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl hidden lg:block opacity-40"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotateX: [-10, -20, -10],
          rotateY: [10, 20, 10],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          x: mousePos.x * -0.3,
          y: mousePos.y * -0.3,
          translateZ: 150,
          transformStyle: "preserve-3d"
        }}
        className="absolute bottom-1/4 left-1/4 w-48 h-32 bg-primary/5 border border-primary/10 backdrop-blur-sm rounded-3xl hidden lg:block opacity-30"
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}
