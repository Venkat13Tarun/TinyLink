'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function trimUrl(url) {
  if (!url) return '';
  return url.length > 40 ? url.slice(0, 30) + '…' + url.slice(-8) : url;
}

export default function Home() {
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    customCode: '',
    url: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      const result = await response.json();

      if (result.status === 'success') {
        setLinks(result.data || []);
      } else {
        setError('Failed to fetch links');
      }
    } catch (err) {
      setError('Error loading links');
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('🎉 Link added successfully!');
        setFormData({ title: '', url: '', description: '', customCode: '' });
        fetchLinks();
      } else {
        setError(result.message || 'Failed to add link');
      }
    } catch (err) {
      setError('Error adding link');
      console.error('Error adding link:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('🗑️ Link deleted successfully!');
        fetchLinks();
      } else {
        setError(result.message || 'Failed to delete link');
      }
    } catch (err) {
      setError('Error deleting link');
      console.error('Error deleting link:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-blue-200 py-8 px-2 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-5xl font-black tracking-tight select-none">
              <svg className="inline-block w-10 h-10 mr-2" fill="none" viewBox="0 0 44 44"><rect width="44" height="44" rx="10" fill="#6366F1"/><path d="M17 24l-5-5 3-3 7 7 7-7 3 3-5 5-5 5-5-5z" fill="#fff"/></svg>
              TinyLink
            </span>
          </div>
          <p className="text-gray-600 text-base mt-2">Effortless personal url shortener & manager</p>
        </div>

        {/* Add Link Form */}
        <div className="bg-white/90 rounded-xl shadow-lg px-7 py-6 mb-10 border border-indigo-100">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>➕</span>Add New Link
          </h2>
          {error && (
            <div className="mb-4 flex items-center bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 animate-pulse">
              <svg className="mr-2 w-5 h-5 text-red-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M4.93 4.93l14.14 14.14"/></svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center bg-green-100 border border-green-300 text-green-700 rounded-lg px-4 py-2 animate-bounce">
              <svg className="mr-2 w-5 h-5 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
              <span>{success}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                Title<span className="text-red-500 pl-1">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="eg. Google"
              />
            </div>
            <div>
              <label htmlFor="customCode" className="block text-sm font-semibold text-gray-700 mb-1">
                Custom code
                <span className="text-xs font-normal text-gray-400 pl-1">(optional)</span>
              </label>
              <input
                type="text"
                id="customCode"
                value={formData.customCode}
                onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
                autoCapitalize="off"
                autoCorrect="off"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="eg. ggl2024"
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-1">
                Target URL<span className="text-red-500 pl-1">*</span>
              </label>
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                Description <span className="text-xs font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="A note about this link"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center gap-2 font-semibold px-6 py-2 rounded-lg transition-colors
                  ${submitting ? 'bg-indigo-300 text-gray-50 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
                  focus:ring-2 focus:outline-none focus:ring-indigo-400 focus:ring-offset-1 shadow-md`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                    Add Link
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Links List */}
        <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-blue-600">🔗</span>
            <span>Your Links</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">{links.length}</span>
          </h2>
          {loading ? (
            <div className="flex flex-col items-center py-14">
              <svg className="animate-spin h-8 w-8 text-indigo-400 mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <div className="text-gray-500">Loading links...</div>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-lg font-medium">
              <svg className="mx-auto mb-2 h-8 w-8 text-blue-200" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.8" d="M12 20h8a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h8z"/><path stroke="currentColor" strokeWidth="1.8" d="M2 8h20"/></svg>
              No links yet.<br/>Get started by adding a link above!
            </div>
          ) : (
            <ul className="space-y-6">
              {links.map((link) => (
                <li
                  key={link.id}
                  className="bg-gradient-to-br from-white to-blue-50 border border-indigo-50 rounded-xl px-6 py-5 hover:shadow-lg transition-shadow relative"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base text-gray-800 flex items-center gap-3 mb-1 overflow-x-auto">
                        <span className="block">{link.title}</span>
                        <span className="text-blue-400 text-xs font-mono tracking-widest rounded px-2 bg-blue-50 border border-blue-100">{link.customCode || <span className="italic text-gray-400">auto</span>}</span>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 underline text-sm font-mono break-words"
                        title={link.url}
                      >
                        {trimUrl(link.url)}
                      </a>
                      {link.description && (
                        <p className="text-gray-500 text-xs mt-1">{link.description}</p>
                      )}
                      <div className="flex gap-4 flex-wrap mt-2 text-xs text-gray-400">
                        <span>Added: {new Date(link.createdAt).toLocaleString()}</span>
                        {typeof link.clickCount === 'number' && (
                          <span>
                            Clicks: <span className="font-bold text-indigo-600">{link.clickCount}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="md:ml-6 mt-4 md:mt-0 flex gap-2">
                      <button
                        onClick={() => router.push(`/code/${link.customCode || link.id}`)}
                        title="View stats"
                        aria-label="View stats"
                        className="transition bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1 hover:shadow active:scale-95"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                        Stats
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/${link.customCode || link.id}`);
                        }}
                        title="Copy shortlink URL"
                        aria-label="Copy shortlink"
                        className="transition bg-gray-100 hover:bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1 hover:shadow active:scale-95"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="1.5"/><rect x="2" y="2" width="13" height="13" rx="2" strokeWidth="1.5"/></svg>
                        Copy
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        title="Delete link"
                        aria-label="Delete"
                        className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition"
                      >
                        <svg className="h-4 w-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2"/></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
