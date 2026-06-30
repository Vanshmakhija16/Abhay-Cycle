import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-[#0A0A0F] flex">
    <AdminSidebar />
    <main className="flex-1 lg:ml-52 min-h-screen overflow-x-hidden">
      {children}
    </main>
  </div>
);

export default AdminLayout;
