"use client";

import { useState, useEffect } from 'react';
import { FiMail, FiTrash } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';
import { contactApi } from '@/lib/api';

const ContactsManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchContacts();
    }, [filter]);

    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            // Use the API function with proper auth token handling
            const data = await contactApi.getContacts({ status: filter !== 'all' ? filter : '' });
            setContacts(data.contacts || []);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast.error('Failed to fetch contacts');
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            // Manually get contact to mark it as read
            await contactApi.getContactById(id);
            fetchContacts();
            toast.success('Message marked as read');
        } catch (error) {
            console.error('Error updating contact:', error);
            toast.error('Failed to mark message as read');
        }
    };

    const handleDelete = async (id) => {
        try {
            // Use the API function with proper auth token handling
            await contactApi.deleteContact(id);
            fetchContacts();
            toast.success('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting contact:', error);
            toast.error('Failed to delete message');
        }
    };

    return (
        <AdminLayout title="Messages">
            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => setFilter('all')} 
                    className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-[#2a2a35] text-white/70'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('unread')} 
                    className={`px-4 py-2 rounded ${filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-[#2a2a35] text-white/70'}`}
                >
                    Unread
                </button>
                <button 
                    onClick={() => setFilter('read')} 
                    className={`px-4 py-2 rounded ${filter === 'read' ? 'bg-blue-500 text-white' : 'bg-[#2a2a35] text-white/70'}`}
                >
                    Read
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-10">
                    <p className="text-white/70">Loading messages...</p>
                </div>
            ) : contacts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-white/70">No messages found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {contacts.map((contact) => (
                        <div key={contact._id} className={`${contact.status === 'unread' ? 'bg-[#1e1e34]' : 'bg-[#1e1e24]'} rounded-lg p-6`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-white font-semibold">{contact.name}</h3>
                                    <p className="text-white/70 text-sm">{contact.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    {contact.status === 'unread' && (
                                        <button
                                            onClick={() => handleMarkAsRead(contact._id)}
                                            className="p-2 rounded bg-blue-500/20 text-blue-500"
                                            title="Mark as read"
                                        >
                                            <FiMail size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(contact._id)}
                                        className="p-2 rounded bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                        title="Delete message"
                                    >
                                        <FiTrash size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h4 className="text-white font-medium mb-2">{contact.subject}</h4>
                                <p className="text-white/70">{contact.message}</p>
                            </div>
                            <div className="flex justify-between items-center text-sm text-white/50">
                                {contact.status === 'unread' && (
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">New</span>
                                )}
                                <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Toaster richColors />
        </AdminLayout>
    );
};

export default ContactsManagement;
