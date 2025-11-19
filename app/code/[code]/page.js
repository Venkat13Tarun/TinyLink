'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function StatsPage() {
  const params = useParams();
  const code = params.code;
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (code) {
      fetchLinkStats();
    }
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/links/${code}`);
      const result = await response.json();

      if (result.status === 'success') {
        setLink(result.data);
      } else {
        setError(result.message || 'Link not found');
      }
    } catch (err) {
      setError('Error loading link stats');
      console.error('Error fetching link stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center text-gray-600">Loading stats...</div>
        </div>
      </main>
    );
  }

  if (error || !link) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Link Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested link does not exist.'}</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Link Statistics</h1>
          <p className="text-gray-600">View details for code: <span className="font-mono font-semibold">{code}</span></p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
            <p className="text-lg font-semibold text-gray-800">{link.title}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Target URL</label>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {link.url}
            </a>
          </div>

          {link.description && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
              <p className="text-gray-700">{link.description}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Custom Code</label>
            <p className="font-mono text-lg font-semibold text-gray-800">{link.customCode}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-900 mb-1">Total Clicks</label>
            <p className="text-3xl font-bold text-blue-700">{link.clickCount || 0}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Short Link</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 px-4 py-2 rounded-lg text-sm break-all">
                {typeof window !== 'undefined' 
                  ? `${window.location.origin}/${link.customCode}` 
                  : `/${link.customCode}`}
              </code>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const shortUrl = `${window.location.origin}/${link.customCode}`;
                    navigator.clipboard.writeText(shortUrl).then(() => {
                      alert('Copied to clipboard!');
                    });
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
              <p className="text-gray-700">
                {new Date(link.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-700">
                {new Date(link.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <a
              href="/"
              className="inline-block bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

