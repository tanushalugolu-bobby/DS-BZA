import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Member } from '@/src/data';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowLeft, Edit2, Save, X, Plus, Trash2, MessageCircle } from 'lucide-react';
import { useDirectory } from '@/src/DirectoryContext';

export default function MemberDetailsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { staff, dogs, updateMember, deleteMember } = useDirectory();
  const [member, setMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<Member | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const shareToWhatsApp = () => {
    if (!member) return;
    
    const detailsText = member.details.map(d => `*${d.label}:* ${d.value}`).join('\n');
    const text = `*KinnHub Profile: ${member.name}*\n\n*Role:* ${member.role}\n\n*Bio:* ${member.bio}\n\n${detailsText}\n\nShared from KinnHub Directory`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  // 3D Tilt Effect for Avatar
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  useEffect(() => {
    const list = type === 'staff' ? staff : dogs;
    const found = list.find(m => m.id === id);
    if (found) {
      setMember(found);
      setEditedMember(found);
    } else {
      navigate(`/${type || 'staff'}`);
    }
  }, [type, id, staff, dogs, navigate]);

  if (!member || !editedMember) return null;

  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleSave = () => {
    if (type && editedMember) {
      updateMember(type as 'staff' | 'dogs', editedMember);
      setIsEditing(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (type && id) {
      deleteMember(type as 'staff' | 'dogs', id);
      navigate(`/${type}`);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleInputChange = (field: keyof Member, value: string) => {
    setEditedMember({ ...editedMember, [field]: value });
  };

  const handleDetailChange = (index: number, field: 'label' | 'value', value: string) => {
    const newDetails = [...editedMember.details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setEditedMember({ ...editedMember, details: newDetails });
  };

  const addDetailRow = () => {
    setEditedMember({
      ...editedMember,
      details: [...editedMember.details, { label: 'New Field', value: 'New Value' }]
    });
  };

  const removeDetailRow = (index: number) => {
    const newDetails = editedMember.details.filter((_, i) => i !== index);
    setEditedMember({ ...editedMember, details: newDetails });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="min-h-screen bg-white/60 backdrop-blur-lg border-l border-border flex flex-col p-8 md:p-12 overflow-y-auto relative z-10">
      <div className="flex justify-between items-center mb-12">
        <Link 
          to={`/${type}`} 
          className="inline-flex items-center gap-2 text-text-sub hover:text-primary transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Directory</span>
        </Link>

        <div className="flex gap-2">
          {isEditing ? (
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-app text-text-main hover:bg-accent hover:text-primary transition-all font-medium text-sm"
            >
              <X size={16} /> Cancel
            </button>
          ) : showDeleteConfirm ? (
            <div className="flex gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                onClick={confirmDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all font-bold text-sm shadow-lg shadow-red-200"
              >
                <Trash2 size={16} /> Confirm Delete
              </button>
              <button 
                onClick={cancelDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-app text-text-main hover:bg-accent transition-all font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={handleDeleteClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium text-sm"
              >
                <Trash2 size={16} /> Delete
              </button>
              <button 
                onClick={shareToWhatsApp}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all font-medium text-sm"
              >
                <MessageCircle size={16} /> Share
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-app text-text-main hover:bg-accent hover:text-primary transition-all font-medium text-sm"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* 3D Avatar Section */}
          <div className="md:col-span-4 flex flex-col items-center">
            <motion.div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-48 h-48 rounded-3xl bg-accent flex items-center justify-center text-5xl font-bold text-primary mb-6 overflow-hidden shadow-2xl relative group"
            >
              <img 
                src={member.image} 
                alt={member.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ transform: "translateZ(20px)" }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="absolute" style={{ transform: "translateZ(10px)" }}>{initials}</span>
            </motion.div>
            
            {isEditing && (
              <div className="w-full space-y-2">
                <label className="text-[10px] uppercase font-bold text-text-sub">Image URL</label>
                <input 
                  type="text" 
                  value={editedMember.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full p-2 text-xs border border-border rounded-md focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="md:col-span-8 space-y-8">
            <div>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-sub">Full Name</label>
                    <input 
                      type="text" 
                      value={editedMember.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full text-2xl font-bold p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-sub">Role / Title</label>
                    <input 
                      type="text" 
                      value={editedMember.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full text-lg text-text-sub p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h1 className="text-4xl font-bold text-text-main mb-1">{member.name}</h1>
                  <p className="text-lg text-text-sub">{member.role}</p>
                </motion.div>
              )}
            </div>

            {/* Bio Table Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-bg-app rounded-2xl overflow-hidden border border-border shadow-sm"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-border">
                    <th className="p-4 text-[11px] uppercase tracking-widest text-text-sub font-bold w-1/3">Field</th>
                    <th className="p-4 text-[11px] uppercase tracking-widest text-text-sub font-bold">Information</th>
                    {isEditing && <th className="p-4 text-[11px] uppercase tracking-widest text-text-sub font-bold w-16">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-white/50 transition-colors">
                    <td className="p-4 text-xs font-bold text-text-sub uppercase">Biography</td>
                    <td className="p-4">
                      {isEditing ? (
                        <textarea 
                          value={editedMember.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className="w-full p-3 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[120px]"
                        />
                      ) : (
                        <p className="text-sm text-text-main leading-relaxed">{member.bio}</p>
                      )}
                    </td>
                    {isEditing && <td className="p-4"></td>}
                  </tr>
                  {editedMember.details.map((detail, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-white/50 transition-colors">
                      <td className="p-4">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={detail.label}
                            onChange={(e) => handleDetailChange(idx, 'label', e.target.value)}
                            className="w-full p-2 text-xs font-bold text-text-sub uppercase border border-border rounded-md focus:ring-1 focus:ring-primary outline-none"
                          />
                        ) : (
                          <span className="text-xs font-bold text-text-sub uppercase">{detail.label}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={detail.value}
                            onChange={(e) => handleDetailChange(idx, 'value', e.target.value)}
                            className="w-full p-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none font-semibold"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-text-main">{detail.value}</span>
                        )}
                      </td>
                      {isEditing && (
                        <td className="p-4">
                          <button 
                            onClick={() => removeDetailRow(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {isEditing && (
                    <tr>
                      <td colSpan={3} className="p-4">
                        <button 
                          onClick={addDetailRow}
                          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-text-sub hover:border-primary hover:text-primary transition-all text-sm font-medium"
                        >
                          <Plus size={16} /> Add New Row
                        </button>
                      </td>
                    </tr>
                  )}
                  <tr className="hover:bg-white/50 transition-colors">
                    <td className="p-4 text-xs font-bold text-text-sub uppercase">System ID</td>
                    <td className="p-4">
                      <code className="text-[10px] bg-border-gray px-2 py-1 rounded text-text-sub font-mono">
                        {member.id.toUpperCase()}
                      </code>
                    </td>
                    {isEditing && <td className="p-4"></td>}
                  </tr>
                </tbody>
              </table>
            </motion.div>

            {isEditing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end gap-4 pt-4"
              >
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  <Save size={18} /> Save Changes
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



