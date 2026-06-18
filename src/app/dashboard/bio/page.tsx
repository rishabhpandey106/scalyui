'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Eye, EyeOff, Trash2, Save, ExternalLink, Settings, Link as LinkIcon } from 'lucide-react';
import { 
  getBioSettings, 
  updateBioSettings, 
  addBioLink, 
  toggleBioLink, 
  deleteBioLink 
} from '@/lib/api';
import toast from 'react-hot-toast';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface BioLink {
  id: number;
  title: string;
  short_code: string;
  is_hidden?: boolean;
}

interface BioSettings {
  username: string;
  title: string;
  bio_text: string;
  theme_color: string;
}

export default function BioDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'settings' | 'links'>('settings');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [settings, setSettings] = useState<BioSettings>({
    username: '',
    title: '',
    bio_text: '',
    theme_color: '#22c55e'
  });

  const [links, setLinks] = useState<BioLink[]>([]);
  
  // Add Link State
  const [newLinkCode, setNewLinkCode] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');

  const fetchBio = useCallback(async () => {
    try {
      const data = await getBioSettings();
      if (data.page) {
        setSettings({
          username: data.page.username || '',
          title: data.page.title || '',
          bio_text: data.page.bio_text || '',
          theme_color: data.page.theme_color || '#22c55e'
        });
      }
      if (data.links) {
        setLinks(data.links);
      }
    } catch (err: any) {
      if (err.message === 'Unauthorized') return;
      toast.error('Failed to load Bio data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBio();
  }, [fetchBio]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.username) {
      toast.error('Username is required');
      return;
    }
    
    setIsSaving(true);
    try {
      await updateBioSettings(settings);
      toast.success('Bio settings updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkCode || !newLinkTitle) {
      toast.error('Both Short Code and Title are required');
      return;
    }

    setIsAdding(true);
    try {
      await addBioLink(newLinkCode, newLinkTitle);
      toast.success('Link added to Bio');
      setNewLinkCode('');
      setNewLinkTitle('');
      await fetchBio(); // Refresh list
    } catch (err: any) {
      toast.error(err.message || 'Failed to add link');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      // Optimistic update
      setLinks(prev => prev.map(l => l.id === id ? { ...l, is_hidden: !l.is_hidden } : l));
      await toggleBioLink(id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle visibility');
      // Revert on failure
      fetchBio();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this link from your bio?')) return;
    try {
      setLinks(prev => prev.filter(l => l.id !== id));
      await deleteBioLink(id);
      toast.success('Link removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete link');
      fetchBio();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-auto text-white sm:pb-8 flex justify-center pt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-500 border-t-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-auto text-white sm:pb-8 bg-transparent">
      <div className="max-w-4xl mx-auto pl-4 pr-4 sm:pl-0 sm:pr-0">
        <header className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl font-extrabold mb-2">Link-in-Bio Manager</h1>
              <p className="text-zinc-500">Customize your public profile page and manage your links.</p>
            </div>
            {settings.username && (
              <a 
                href={`/bio/${settings.username}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
              >
                View Public Page <ExternalLink size={14} />
              </a>
            )}
          </div>
        </header>

        <section className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg mb-8 z-10">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />
          
          <div className="relative flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex p-1 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}
              >
                <Settings size={16} /> <span className="hidden sm:inline">Profile Settings</span>
              </button>
              <button
                onClick={() => setActiveTab('links')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'links' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}
              >
                <LinkIcon size={16} /> <span className="hidden sm:inline">Manage Links</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'settings' && (
                <div className="animate-in fade-in">
                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username (URL Path)</label>
                        <Input
                          label=""
                          placeholder="your-name"
                          value={settings.username}
                          onChange={(e) => setSettings({...settings, username: e.target.value.toLowerCase()})}
                          className="mb-0! bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm focus:border-accent placeholder-zinc-500 text-white/80"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Page Title</label>
                        <Input
                          label=""
                          placeholder="My Awesome Links"
                          value={settings.title}
                          onChange={(e) => setSettings({...settings, title: e.target.value})}
                          className="mb-0! bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm focus:border-accent placeholder-zinc-500 text-white/80"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Bio Text</label>
                      <textarea
                        placeholder="Welcome to my page..."
                        value={settings.bio_text}
                        onChange={(e) => setSettings({...settings, bio_text: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm text-white/80 placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Theme Color</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={settings.theme_color}
                          onChange={(e) => setSettings({...settings, theme_color: e.target.value})}
                          className="w-10 h-10 rounded cursor-pointer bg-zinc-950 border border-zinc-800 p-0.5"
                        />
                        <span className="text-zinc-400 text-sm uppercase font-mono">{settings.theme_color}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button type="submit" isLoading={isSaving} className="w-full sm:w-auto flex items-center justify-center gap-2">
                        <Save size={16} /> Save Settings
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'links' && (
                <div className="animate-in fade-in space-y-8">
                  {/* Add Link Section */}
                  <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                      <Plus size={16} className="text-accent" /> Add New Link
                    </h3>
                    <form onSubmit={handleAddLink} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Display Title</label>
                        <Input
                          label=""
                          placeholder="e.g. My Instagram"
                          value={newLinkTitle}
                          onChange={(e) => setNewLinkTitle(e.target.value)}
                          className="mb-0! bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm focus:border-accent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Short Code</label>
                        <Input
                          label=""
                          placeholder="e.g. abc12"
                          value={newLinkCode}
                          onChange={(e) => setNewLinkCode(e.target.value)}
                          className="mb-0! bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm focus:border-accent"
                          required
                        />
                      </div>
                      <Button type="submit" isLoading={isAdding} className="w-full sm:w-auto h-[38px] flex items-center justify-center gap-2">
                        <Plus size={16} /> Add
                      </Button>
                    </form>
                  </div>

                  {/* Links List Section */}
                  <div>
                    <h3 className="text-sm font-bold text-zinc-300 mb-4">Your Active Links</h3>
                    {links.length === 0 ? (
                      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-8 text-center text-zinc-500 text-sm">
                        You haven't added any links to your bio yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {links.map((link) => (
                          <div 
                            key={link.id}
                            className={`bg-zinc-900 border ${link.is_hidden ? 'border-zinc-800 opacity-60' : 'border-zinc-700'} rounded-xl p-4 flex items-center justify-between transition-all group`}
                          >
                            <div className="min-w-0 pr-4">
                              <p className="font-semibold text-white truncate">{link.title}</p>
                              <p className="text-xs text-zinc-400 font-mono mt-1">/{link.short_code}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleToggle(link.id)}
                                className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                                title={link.is_hidden ? "Show on bio" : "Hide from bio"}
                              >
                                {link.is_hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button
                                onClick={() => handleDelete(link.id)}
                                className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-red-500"
                                title="Remove from bio"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
