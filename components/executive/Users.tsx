
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Check, X, User } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { useData } from '../../contexts/DataContext';

const Users: React.FC = () => {
   const { users, addUser, deleteUser } = useData();
   const [showAddModal, setShowAddModal] = useState(false);
   const [newUser, setNewUser] = useState({ name: '', institute: '', role: 'Student', email: '' });

   const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
         deleteUser(id);
      }
   };

   const handleAdd = () => {
      addUser({
         email: newUser.email || `user${users.length + 1}@youthopia.com`,
         name: newUser.name,
         institute: newUser.institute,
         role: newUser.role.toLowerCase() as any,
         class: 'N/A',
         stream: 'N/A',
         phone: 'N/A',
         age: 'N/A',
         gender: 'N/A',
         bonus: 0
      });
      setShowAddModal(false);
      setNewUser({ name: '', institute: '', role: 'Student', email: '' });
   };

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <Button variant="amber" onClick={() => setShowAddModal(true)} className="gap-2">
               <Plus size={18} /> Add User
            </Button>
         </div>

         <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden min-h-[300px]">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-300 min-w-[700px]">
                  <thead className="bg-white/5 text-xs uppercase font-bold text-yellow-500">
                     <tr>
                        <th className="p-4">Email / ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Institution</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     <AnimatePresence>
                        {users.length > 0 ? users.map((user, i) => (
                           <motion.tr
                              key={user.email || i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, height: 0 }}
                              className="hover:bg-white/5"
                           >
                              <td className="p-4 font-mono text-slate-500 truncate max-w-[150px]">{user.email}</td>
                              <td className="p-4 font-bold text-white">{user.name}</td>
                              <td className="p-4">{user.institute}</td>
                              <td className="p-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : user.role === 'executive' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {user.role || 'Student'}
                                 </span>
                              </td>
                              <td className="p-4 text-right flex justify-end gap-2">
                                 <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">
                                    <Edit2 size={16} />
                                 </button>
                                 <button
                                    onClick={() => handleDelete(user.email)}
                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </td>
                           </motion.tr>
                        )) : (
                           <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-500">No users found.</td>
                           </tr>
                        )}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Add User Modal */}
         {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-md">
                  <h3 className="text-xl font-bold text-white mb-6">Add New User</h3>
                  <div className="space-y-4">
                     <Input
                        variant="dark"
                        placeholder="Full Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                     />
                     <Input
                        variant="dark"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                     />
                     <Input
                        variant="dark"
                        placeholder="Institution"
                        value={newUser.institute}
                        onChange={(e) => setNewUser({ ...newUser, institute: e.target.value })}
                     />
                     <Input
                        as="select"
                        variant="dark"
                        options={['Student', 'Admin', 'Executive']}
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                     />
                     <div className="flex gap-4 pt-4">
                        <Button variant="outline" fullWidth onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button variant="amber" fullWidth onClick={handleAdd}>Create</Button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Users;
