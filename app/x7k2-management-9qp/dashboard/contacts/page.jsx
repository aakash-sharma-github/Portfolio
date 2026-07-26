"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiMail, FiTrash, FiClock } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';
import { contactApi } from '@/lib/api';

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'read', label: 'Read' },
];

const ContactsManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchContacts = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await contactApi.getContacts({ status: filter !== 'all' ? filter : '' });
            setContacts(data.contacts || []);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast.error('Failed to fetch contacts');
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => { fetchContacts(); }, [fetchContacts]);

    const handleMarkAsRead = async (id) => {
        try {
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

            {/* Filter pills — horizontally scrollable on very narrow screens,
                never wraps awkwardly */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1
                            [scrollbar-width:none] [-ms-overflow-style:none]
                            [&::-webkit-scrollbar]:hidden">
                {FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                                    flex-shrink-0 transition-colors
                                    ${filter === key
                                ? 'bg-accent text-white'
                                : 'bg-[#2a2a35] text-white/60 active:bg-[#3a3a45]'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-7 h-7 border-2 border-accent border-t-transparent
                                    rounded-full animate-spin" />
                </div>
            ) : contacts.length === 0 ? (
                <div className="text-center py-16 bg-[#1e1e24] rounded-xl">
                    <p className="text-white/50">No messages found.</p>
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {contacts.map((contact) => (
                        <div
                            key={contact._id}
                            className={`${contact.status === 'unread' ? 'bg-[#1e1e34] border-accent/20' : 'bg-[#1e1e24] border-white/6'}
                                       rounded-xl p-4 sm:p-6 border`}
                        >
                            {/* Header row — name/email left, actions right */}
                            <div className="flex justify-between items-start gap-3 mb-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                                            {contact.name}
                                        </h3>
                                        {contact.status === 'unread' && (
                                            <span className="flex-shrink-0 px-2 py-0.5 bg-accent/20
                                                             text-accent rounded-full text-[10px]
                                                             font-semibold uppercase tracking-wide">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white/50 text-xs sm:text-sm truncate mt-0.5">
                                        {contact.email}
                                    </p>
                                </div>

                                <div className="flex gap-1.5 flex-shrink-0">
                                    {contact.status === 'unread' && (
                                        <button
                                            onClick={() => handleMarkAsRead(contact._id)}
                                            className="p-2.5 sm:p-2 rounded-lg bg-blue-500/20
                                                       text-blue-400 active:bg-blue-500/30
                                                       transition-colors"
                                            aria-label="Mark as read"
                                        >
                                            <FiMail size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(contact._id)}
                                        className="p-2.5 sm:p-2 rounded-lg bg-red-500/20 text-red-400
                                                   active:bg-red-500/30 transition-colors"
                                        aria-label="Delete message"
                                    >
                                        <FiTrash size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Message body */}
                            <div className="mb-3">
                                <h4 className="text-white font-medium text-sm mb-1.5 break-words">
                                    {contact.subject}
                                </h4>
                                <p className="text-white/65 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {contact.message}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-1.5 text-white/35 text-xs
                                            pt-3 border-t border-white/6">
                                <FiClock size={12} />
                                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit',
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Toaster richColors position="bottom-right" />
        </AdminLayout>
    );
};

export default ContactsManagement;