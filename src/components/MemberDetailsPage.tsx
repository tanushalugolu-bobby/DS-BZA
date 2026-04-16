import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Member } from '@/src/data';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { ArrowLeft, Edit2, Save, X, Plus, Trash2, MessageCircle, Upload, Download, FileJson, Table, FileSpreadsheet } from 'lucide-react';
import { useDirectory } from '@/src/DirectoryContext';
import { exportToCSV, exportToXLSX } from '../lib/exportUtils';

export default function MemberDetailsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { staff, dogs, isLoaded, updateMember, deleteMember } = useDirectory();
  const [member, setMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<Member | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = (format: 'csv' | 'xlsx') => {
    if (!member) return;
    const fileName = `${member.pfNumber}_${member.name.replace(/\s+/g, '_')}`;
    const dataForExport = [{
      'PF Number': member.pfNumber,
      Name: member.name,
      Role: member.role,
      Bio: member.bio,
      ...Object.fromEntries(member.details.map(d => [d.label, d.value]))
    }];

    if (format === 'csv') exportToCSV(dataForExport, fileName);
    else if (format === 'xlsx') exportToXLSX(dataForExport, fileName);
    
    setShowExportOptions(false);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editedMember) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc = {
          name: file.name,
          url: reader.result as string,
          date: new Date().toISOString()
        };
        setEditedMember({
          ...editedMember,
          documents: [...editedMember.documents, newDoc]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (index: number) => {
    if (editedMember) {
      const newDocs = editedMember.documents.filter((_, i) => i !== index);
      setEditedMember({ ...editedMember, documents: newDocs });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editedMember) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    if (!isLoaded) return;

    const list = type === 'staff' ? staff : dogs;
    const found = list.find(m => m.id === id);
    if (found) {
      setMember(found);
      setEditedMember(found);
    } else {
      const timeout = setTimeout(() => {
        navigate(`/${type || 'staff'}`);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [type, id, staff, dogs, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-app">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 ml-1 text-primary animate-pulse flex items-center gap-2">
             <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          </div>
          <p className="text-xs font-bold text-text-sub uppercase tracking-widest">Loading Records...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-white/60 backdrop-blur-lg border-l border-border flex flex-col p-4 md:p-12 overflow-y-auto relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <Link 
          to={`/${type}`} 
          className="inline-flex items-center gap-2 text-text-sub hover:text-primary transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Directory</span>
        </Link>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {isEditing ? (
            <button 
              onClick={() => setIsEditing(false)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-bg-app text-text-main hover:bg-accent hover:text-primary transition-all font-medium text-sm border border-border/50"
            >
              <X size={16} /> Cancel
            </button>
          ) : showDeleteConfirm ? (
            <div className="flex gap-2 w-full sm:w-auto animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                onClick={confirmDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all font-bold text-sm shadow-lg shadow-red-200"
              >
                <Trash2 size={16} /> Confirm
              </button>
              <button 
                onClick={cancelDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-bg-app text-text-main hover:bg-accent transition-all font-medium text-sm border border-border/50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="relative flex-1 sm:flex-none">
                <button 
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-border text-text-sub hover:bg-bg-app transition-all font-medium text-sm"
                >
                  <Download size={16} /> Export
                </button>
                
                <AnimatePresence>
                  {showExportOptions && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowExportOptions(false)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <button 
                          onClick={() => handleExport('xlsx')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-bg-app transition-colors text-left font-medium"
                        >
                          <FileSpreadsheet size={16} className="text-green-600" /> Excel (.xlsx)
                        </button>
                        <button 
                          onClick={() => handleExport('csv')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-bg-app transition-colors text-left font-medium border-t border-border/30"
                        >
                          <FileJson size={16} className="text-gray-600" /> CSV Format
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={handleDeleteClick}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium text-sm"
              >
                <Trash2 size={16} /> Delete
              </button>
              <button 
                onClick={shareToWhatsApp}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all font-medium text-sm"
              >
                <MessageCircle size={16} /> Share
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-bg-app text-text-main hover:bg-accent hover:text-primary transition-all font-medium text-sm border border-border/50"
              >
                <Edit2 size={16} /> Edit
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
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-text-sub">Profile Image</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
                    >
                      <Upload size={14} /> Upload Local
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-text-sub text-center block">Or Image URL</label>
                  <input 
                    type="text" 
                    value={editedMember.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full p-2 text-xs border border-border rounded-md focus:ring-1 focus:ring-primary outline-none"
                    placeholder="https://..."
                  />
                </div>
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
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg text-text-sub font-medium">{member.role}</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 uppercase tracking-wider">
                      PF: {member.pfNumber}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* PF Number Editing */}
            {isEditing && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-sub">PF Number</label>
                <input 
                  type="text" 
                  value={editedMember.pfNumber}
                  onChange={(e) => handleInputChange('pfNumber', e.target.value)}
                  placeholder="24409813***"
                  className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none font-mono text-sm"
                />
              </div>
            )}

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

            {/* Related Documents Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <Table size={20} className="text-primary" />
                  Related Documents
                </h3>
                {isEditing && (
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-bg-app border border-border rounded-lg text-xs font-bold hover:bg-accent transition-all">
                    <Plus size={14} /> Add Document
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleDocumentUpload}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {editedMember.documents.length > 0 ? (
                  editedMember.documents.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="group p-4 bg-white border border-border rounded-xl flex items-center justify-between hover:border-primary/50 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-accent rounded-lg text-primary">
                          <Table size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-text-main truncate">{doc.name}</p>
                          <p className="text-[9px] text-text-sub">{new Date(doc.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <a 
                          href={doc.url} 
                          download={doc.name}
                          className="p-2 text-text-sub hover:text-primary transition-colors"
                          title="Download"
                        >
                          <Download size={14} />
                        </a>
                        {isEditing && (
                          <button 
                            onClick={() => removeDocument(idx)}
                            className="p-2 text-red-400 hover:text-red-500 transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="sm:col-span-2 p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-text-sub">
                    <label className="text-xs font-medium">No documents uploaded yet.</label>
                  </div>
                )}
              </div>
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



