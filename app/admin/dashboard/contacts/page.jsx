"use client";

import { useState, useEffect } from 'react';
import { FiMail, FiArchive } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';

const ContactsManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchContacts();
    }, [filter]);

    const fetchContacts = async () => {
        try {
            const response = await fetch(`/api/contacts?status=${filter}`);
            const data = await response.json();
            setContacts(data.contacts || []);


            setIsLoading(false);
        } catch (error) {
            toast.error('Failed to fetch contacts');
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await fetch(`/api/contacts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            fetchContacts();
            toast.success('Contact status updated');
        } catch (error) {
            toast.error('Failed to update contact status');
        }
    };

    return (
        <AdminLayout title="Contacts">
            {/* Messages List */}
            <div className="space-y-4">
                {contacts.map((contact) => (
                    <div key={contact._id} className="bg-[#1e1e24] rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-white font-semibold">{contact.name}</h3>
                                <p className="text-white/70 text-sm">{contact.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStatusChange(contact._id, contact.status === 'unread' ? 'read' : 'unread')}
                                    className={`p-2 rounded ${contact.status === 'unread' ? 'bg-blue-500/20 text-blue-500' : 'bg-[#2a2a35] text-white/70'}`}
                                >
                                    <FiMail size={18} />
                                </button>
                                <button
                                    onClick={() => handleStatusChange(contact._id, 'archived')}
                                    className="p-2 rounded bg-[#2a2a35] text-white/70 hover:text-white"
                                >
                                    <FiArchive size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-white font-medium mb-2">{contact.subject}</h4>
                            <p className="text-white/70">{contact.message}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm text-white/50">
                            <div className="flex gap-4">
                                <span>Status: {contact.status}</span>
                            </div>
                            <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
            <Toaster richColors />
        </AdminLayout>
    );
};

export default ContactsManagement;
