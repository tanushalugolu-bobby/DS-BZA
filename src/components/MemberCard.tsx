import React from 'react';
import { Member } from '@/src/data';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  const location = useLocation();
  const type = location.pathname.includes('staff') ? 'staff' : 'dogs';

  // Get initials for avatar fallback
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Link to={`/${type}/${member.id}`} className="block">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center border border-white/20 shadow-sm hover:border-primary hover:bg-accent/80 transition-all duration-200">
          <div className="w-14 h-14 rounded-full bg-border-gray flex items-center justify-center font-bold text-text-sub text-lg mb-3 overflow-hidden">
            <img 
              src={member.image} 
              alt={member.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="absolute">{initials}</span>
          </div>
          <CardContent className="p-0">
            <h3 className="text-sm font-semibold text-text-main mb-1">{member.name}</h3>
            <p className="text-[12px] text-text-sub">{member.role}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}


