'use client';

import { useState, useRef } from 'react';

interface ImportResult {
  success: boolean;
  message: string;
  imported?: Record<string, number>;
}

interface PolicyApiState {
  result: unknown;
  loading: boolean;
  error: string | null;
}

const PAS_API_BASE = 'http://localhost:3000/api';

const POLICY_STATUS_OPTIONS = ['', 'Active', 'Pending', 'Expired', 'Cancelled', 'Non-Renewed'];

export default function DataManagementPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── PAS Policies API Explorer state ────────────────────────────────────────
  const [listFilters, setListFilters] = useState({ search: '', status: '', natcat: '' });
  const [listState, setListState] = useState<PolicyApiState>({ result: null, loading: false, error: null });

  const [getNumber, setGetNumber] = useState('');
  const [getState, setGetState] = useState<PolicyApiState>({ result: null, loading: false, error: null });

  const [updateNumber, setUpdateNumber] = useState('');
  const [updatePayload, setUpdatePayload] = useState(JSON.stringify({ status: 'Active', notes: '' }, null, 2));
  const [updateState, setUpdateState] = useState<PolicyApiState>({ result: null, loading: false, error: null });

  const [createPayload, setCreatePayload] = useState(
    JSON.stringify({ policyHolder: 'New Holder', email: 'holder@example.com', type: 'Home Insurance', lineOfBusiness: 'Homeowners', effectiveDate: '2025-08-01', premium: 3200, deductible: 2000, address: { street1: '100 Main St', street2: '', city: 'Raleigh', state: 'NC', zip: '27601' } }, null, 2)
  );
  const [createState, setCreateState] = useState<PolicyApiState>({ result: null, loading: false, error: null });

  const handleListPolicies = async () => {
    setListState({ result: null, loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (listFilters.search) params.set('search', listFilters.search);
      if (listFilters.status) params.set('status', listFilters.status);
      if (listFilters.natcat) params.set('natcat', listFilters.natcat);
      const res = await fetch(`${PAS_API_BASE}/policies?${params.toString()}`);
      const data = await res.json();
      setListState({ result: data, loading: false, error: res.ok ? null : (data.error ?? 'Error') });
    } catch (e) {
      setListState({ result: null, loading: false, error: e instanceof Error ? e.message : 'Request failed' });
    }
  };

  const handleGetPolicy = async () => {
    if (!getNumber.trim()) return;
    setGetState({ result: null, loading: true, error: null });
    try {
      const res = await fetch(`${PAS_API_BASE}/policies/${encodeURIComponent(getNumber.trim())}`);
      const data = await res.json();
      setGetState({ result: data, loading: false, error: res.ok ? null : (data.error ?? 'Not found') });
    } catch (e) {
      setGetState({ result: null, loading: false, error: e instanceof Error ? e.message : 'Request failed' });
    }
  };

  const handleUpdatePolicy = async () => {
    if (!updateNumber.trim()) return;
    setUpdateState({ result: null, loading: true, error: null });
    try {
      const body = JSON.parse(updatePayload);
      const res = await fetch(`${PAS_API_BASE}/policies/${encodeURIComponent(updateNumber.trim())}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setUpdateState({ result: data, loading: false, error: res.ok ? null : (data.error ?? 'Update failed') });
    } catch (e) {
      setUpdateState({ result: null, loading: false, error: e instanceof Error ? e.message : 'Invalid JSON or request failed' });
    }
  };

  const handleCreatePolicy = async () => {
    setCreateState({ result: null, loading: true, error: null });
    try {
      const body = JSON.parse(createPayload);
      const res = await fetch(`${PAS_API_BASE}/policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setCreateState({ result: data, loading: false, error: res.ok ? null : (data.error ?? 'Create failed') });
    } catch (e) {
      setCreateState({ result: null, loading: false, error: e instanceof Error ? e.message : 'Invalid JSON or request failed' });
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleExport = async () => {
    setLoading('export');
    try {
      const response = await fetch('/api/data/export');
      if (!response.ok) throw new Error('Export failed');
      
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `policy-admin-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showMessage('success', 'Data exported successfully!');
    } catch {
      showMessage('error', 'Failed to export data');
    } finally {
      setLoading(null);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading('import');
    setImportResult(null);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const response = await fetch('/api/data/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setImportResult(result);
        showMessage('success', 'Data imported successfully! Refresh the page to load new data.');
      } else {
        throw new Error(result.message || 'Import failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import data';
      showMessage('error', errorMessage);
    } finally {
      setLoading(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all data? This will reset everything to fresh mock data on page refresh.')) {
      return;
    }
    
    setLoading('clear');
    try {
      const response = await fetch('/api/data/clear', {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Clear failed');
      
      showMessage('success', 'All data cleared! Refresh the page to regenerate fresh mock data.');
    } catch {
      showMessage('error', 'Failed to clear data');
    } finally {
      setLoading(null);
    }
  };

  const handleResetAll = async () => {
    if (!confirm('Are you sure you want to reset all records to their original state?')) {
      return;
    }
    
    setLoading('reset');
    try {
      const response = await fetch('/api/data/reset', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Reset failed');
      
      showMessage('success', 'All records reset to original state! Refresh the page to see changes.');
    } catch {
      showMessage('error', 'Failed to reset records');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          Data Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Export, import, and manage your policy administration data
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && importResult.imported && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Import Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(importResult.imported).map(([key, count]) => (
              <div key={key} className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{key}</p>
                <p className="text-lg font-semibold text-blue-600">{count} records</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
              <p className="text-sm text-gray-500">Download all data as JSON</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Export all policies, policyholders, beneficiaries, and audit data to a JSON file. 
            Use this to backup your data or transfer to another environment.
          </p>
          <button
            onClick={handleExport}
            disabled={loading === 'export'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading === 'export' ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            {loading === 'export' ? 'Exporting...' : 'Export All Data'}
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Import Data</h2>
              <p className="text-sm text-gray-500">Restore data from JSON file</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Import data from a previously exported JSON file. This will overwrite 
            existing data. Refresh the page after import to load the new data.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            disabled={loading === 'import'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading === 'import' ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            {loading === 'import' ? 'Importing...' : 'Import Data File'}
          </button>
        </div>

        {/* Reset Records Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Reset Records</h2>
              <p className="text-sm text-gray-500">Restore all records to original</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Reset all policies, policyholders, beneficiaries, benefits, and audit entries 
            to their original state. This undoes any changes made while keeping the data persisted.
          </p>
          <button
            onClick={handleResetAll}
            disabled={loading === 'reset'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading === 'reset' ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {loading === 'reset' ? 'Resetting...' : 'Reset All Records'}
          </button>
        </div>

        {/* Clear Data Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Clear All Data</h2>
              <p className="text-sm text-gray-500">Delete all persisted data</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Clear all persisted data files. After refreshing the page, fresh 
            mock data will be regenerated. Use with caution!
          </p>
          <button
            onClick={handleClear}
            disabled={loading === 'clear'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading === 'clear' ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {loading === 'clear' ? 'Clearing...' : 'Clear All Data'}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          How Data Persistence Works
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Persistence:</strong> All changes to records are automatically saved to JSON files 
            in the <code className="bg-gray-200 px-1 rounded">data/</code> directory on the server.
          </p>
          <p>
            <strong>Original State:</strong> When records are first loaded, their original state is captured. 
            You can reset any record back to this original state.
          </p>
          <p>
            <strong>Fresh Deployment:</strong> When deploying to a new environment, export your data first, 
            then import it after deployment to preserve your changes.
          </p>
          <p>
            <strong>API Endpoints:</strong> You can also use the API directly:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code className="bg-gray-200 px-1 rounded">GET /api/data/export</code> - Export all data</li>
            <li><code className="bg-gray-200 px-1 rounded">POST /api/data/import</code> - Import data</li>
            <li><code className="bg-gray-200 px-1 rounded">POST /api/data/reset</code> - Reset all records (policies, policyholders, beneficiaries, benefits, audit entries)</li>
            <li><code className="bg-gray-200 px-1 rounded">DELETE /api/data/clear</code> - Clear all data</li>
          </ul>
          <p className="mt-3">
            <strong>Record APIs:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code className="bg-gray-200 px-1 rounded">GET/POST /api/policies</code> - List &amp; create policies</li>
            <li><code className="bg-gray-200 px-1 rounded">GET/PUT/PATCH /api/policies/[id]</code> - Read &amp; update a policy</li>
            <li><code className="bg-gray-200 px-1 rounded">GET/POST /api/policyholders</code> - List &amp; create policyholders</li>
            <li><code className="bg-gray-200 px-1 rounded">GET/PUT/PATCH /api/policyholders/[id]</code> - Read &amp; update a policyholder</li>
            <li><code className="bg-gray-200 px-1 rounded">GET/POST /api/beneficiaries</code> - List &amp; create beneficiaries</li>
            <li><code className="bg-gray-200 px-1 rounded">GET/PUT/PATCH /api/beneficiaries/[id]</code> - Read &amp; update a beneficiary</li>
            <li><code className="bg-gray-200 px-1 rounded">GET/POST /api/benefits</code> - List &amp; create benefits</li>
            <li><code className="bg-gray-200 px-1 rounded">GET/PUT/PATCH/DELETE /api/benefits/[id]</code> - Read, update &amp; delete a benefit</li>
          </ul>
        </div>
      </div>

      {/* ── PAS Simulation — Policies API Explorer ─────────────────────────── */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">PAS Simulation — Policies API</h2>
            <p className="text-sm text-gray-500">
              Live explorer for <code className="bg-gray-100 px-1 rounded font-mono text-xs">{PAS_API_BASE}/policies</code> &nbsp;·&nbsp; Guidewire PolicyCenter Simulation
            </p>
          </div>
        </div>

        {/* Endpoint reference pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { method: 'GET', path: '/api/policies', desc: 'List all policies (filterable)' },
            { method: 'GET', path: '/api/policies/:id', desc: 'Get policy by number' },
            { method: 'POST', path: '/api/policies', desc: 'Create new policy' },
            { method: 'PUT', path: '/api/policies/:id', desc: 'Update policy fields' },
            { method: 'DELETE', path: '/api/policies/:id', desc: 'Soft-delete (→ Cancelled)' },
            { method: 'POST', path: '/api/policies/cancel', desc: 'Cancel with reason' },
            { method: 'POST', path: '/api/policies/renew', desc: 'Renew policy' },
            { method: 'POST', path: '/api/policies/non-renew', desc: 'Mark non-renewed' },
          ].map((ep) => (
            <div key={ep.path + ep.method} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              <span className={`font-bold ${ep.method === 'GET' ? 'text-green-600' : ep.method === 'POST' ? 'text-blue-600' : ep.method === 'PUT' ? 'text-yellow-600' : 'text-red-600'}`}>
                {ep.method}
              </span>
              <code className="text-gray-600">{ep.path}</code>
              <span className="text-gray-400 hidden sm:inline">— {ep.desc}</span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* ── 1. List Policies ── */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-green-50 border-b border-green-100">
              <span className="text-xs font-bold text-green-700 bg-green-100 rounded px-2 py-0.5">GET</span>
              <code className="text-sm text-gray-700">/api/policies</code>
              <span className="text-xs text-gray-500 ml-1">— List all policies with optional filters</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="name, policy #, city…"
                    value={listFilters.search}
                    onChange={(e) => setListFilters((f) => ({ ...f, search: e.target.value }))}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={listFilters.status}
                    onChange={(e) => setListFilters((f) => ({ ...f, status: e.target.value }))}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {POLICY_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s || 'All Status'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">NatCat Peril</label>
                  <input
                    type="text"
                    placeholder="e.g. Wildfire"
                    value={listFilters.natcat}
                    onChange={(e) => setListFilters((f) => ({ ...f, natcat: e.target.value }))}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleListPolicies}
                disabled={listState.loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {listState.loading && (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {listState.loading ? 'Fetching…' : 'Fetch Policies'}
              </button>

              {listState.error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{listState.error}</p>
              )}
              {listState.result && (
                <div>
                  {typeof listState.result === 'object' && listState.result !== null && 'total' in listState.result && (
                    <p className="text-xs text-gray-500 mb-2">
                      <strong className="text-gray-800">{(listState.result as { total: number }).total}</strong> policies returned
                    </p>
                  )}
                  <pre className="text-xs bg-gray-900 text-green-300 rounded-lg p-4 overflow-auto max-h-72">
                    {JSON.stringify(listState.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* ── 2. Get Policy by Number ── */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-green-50 border-b border-green-100">
              <span className="text-xs font-bold text-green-700 bg-green-100 rounded px-2 py-0.5">GET</span>
              <code className="text-sm text-gray-700">/api/policies/:policyNumber</code>
              <span className="text-xs text-gray-500 ml-1">— Full policy detail</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Policy Number</label>
                  <input
                    type="text"
                    placeholder="e.g. POL-2025-011"
                    value={getNumber}
                    onChange={(e) => setGetNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGetPolicy()}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleGetPolicy}
                    disabled={getState.loading || !getNumber.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {getState.loading ? 'Fetching…' : 'Fetch'}
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-400 flex flex-wrap gap-2">
                {['POL-2025-001', 'POL-2025-011', 'POL-2025-013', 'POL-2025-020'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setGetNumber(p)}
                    className="font-mono bg-gray-100 hover:bg-blue-50 hover:text-blue-700 px-2 py-0.5 rounded transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {getState.error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{getState.error}</p>
              )}
              {getState.result && (
                <pre className="text-xs bg-gray-900 text-green-300 rounded-lg p-4 overflow-auto max-h-72">
                  {JSON.stringify(getState.result, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {/* ── 3. Update Policy ── */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-yellow-50 border-b border-yellow-100">
              <span className="text-xs font-bold text-yellow-700 bg-yellow-100 rounded px-2 py-0.5">PUT</span>
              <code className="text-sm text-gray-700">/api/policies/:policyNumber</code>
              <span className="text-xs text-gray-500 ml-1">— Partial update (push changes)</span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Policy Number to Update</label>
                <input
                  type="text"
                  placeholder="e.g. POL-2025-011"
                  value={updateNumber}
                  onChange={(e) => setUpdateNumber(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Request Body (JSON)</label>
                <textarea
                  value={updatePayload}
                  onChange={(e) => setUpdatePayload(e.target.value)}
                  rows={6}
                  className="w-full text-xs font-mono border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-50"
                />
              </div>
              <button
                onClick={handleUpdatePolicy}
                disabled={updateState.loading || !updateNumber.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors"
              >
                {updateState.loading && (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {updateState.loading ? 'Updating…' : 'Send Update'}
              </button>

              {updateState.error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{updateState.error}</p>
              )}
              {updateState.result && (
                <pre className="text-xs bg-gray-900 text-yellow-200 rounded-lg p-4 overflow-auto max-h-64">
                  {JSON.stringify(updateState.result, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {/* ── 4. Create Policy ── */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 border-b border-blue-100">
              <span className="text-xs font-bold text-blue-700 bg-blue-100 rounded px-2 py-0.5">POST</span>
              <code className="text-sm text-gray-700">/api/policies</code>
              <span className="text-xs text-gray-500 ml-1">— Create a new policy</span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Request Body (JSON)</label>
                <textarea
                  value={createPayload}
                  onChange={(e) => setCreatePayload(e.target.value)}
                  rows={10}
                  className="w-full text-xs font-mono border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
              <button
                onClick={handleCreatePolicy}
                disabled={createState.loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {createState.loading && (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {createState.loading ? 'Creating…' : 'Create Policy'}
              </button>

              {createState.error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{createState.error}</p>
              )}
              {createState.result && (
                <pre className="text-xs bg-gray-900 text-blue-200 rounded-lg p-4 overflow-auto max-h-64">
                  {JSON.stringify(createState.result, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
