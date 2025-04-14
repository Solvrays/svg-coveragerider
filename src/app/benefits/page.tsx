'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Benefit } from '@/lib/types';
import { benefits } from '@/lib/data/mock-data';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function BenefitsPage() {
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  // Stats for summary cards
  const [stats, setStats] = useState({
    totalBenefits: 0,
    activeBenefits: 0,
    pendingBenefits: 0,
    totalValue: 0,
  });

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Calculate stats
    const activeBenefits = benefits.filter(b => b.status === 'Active').length;
    const pendingBenefits = benefits.filter(b => b.status === 'Pending').length;
    const totalValue = benefits.reduce((sum, benefit) => sum + benefit.amount, 0);

    setStats({
      totalBenefits: benefits.length,
      activeBenefits,
      pendingBenefits,
      totalValue,
    });

    // Apply filters and sorting
    let result = [...benefits];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        benefit =>
          benefit.name.toLowerCase().includes(term) ||
          benefit.description.toLowerCase().includes(term) ||
          benefit.policyId.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter(benefit => benefit.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(benefit => benefit.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any = a[sortField as keyof Benefit];
      let bValue: any = b[sortField as keyof Benefit];

      // Handle special cases
      if (sortField === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredBenefits(result);
  }, [searchTerm, typeFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get unique benefit types for filter dropdown
  const benefitTypes = Array.from(new Set(benefits.map(benefit => benefit.type)));
  const benefitStatuses = Array.from(new Set(benefits.map(benefit => benefit.status).filter(Boolean)));

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Benefits Management</h1>
          <Link 
            href="/benefits/new" 
            className="px-4 py-2 bg-retro-primary text-white rounded shadow-retro-sm hover:brightness-110 transition-all"
          >
            + New Benefit
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow-retro-sm border-2 border-retro-dark">
            <h3 className="text-sm font-semibold text-gray-500">Total Benefits</h3>
            <p className="text-2xl font-bold">{stats.totalBenefits}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-retro-sm border-2 border-retro-dark">
            <h3 className="text-sm font-semibold text-gray-500">Active Benefits</h3>
            <p className="text-2xl font-bold text-retro-success">{stats.activeBenefits}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-retro-sm border-2 border-retro-dark">
            <h3 className="text-sm font-semibold text-gray-500">Pending Benefits</h3>
            <p className="text-2xl font-bold text-retro-warning">{stats.pendingBenefits}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-retro-sm border-2 border-retro-dark">
            <h3 className="text-sm font-semibold text-gray-500">Total Value</h3>
            <p className="text-2xl font-bold text-retro-primary">{formatCurrency(stats.totalValue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow-retro-sm border-2 border-retro-dark mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                placeholder="Search benefits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Benefit Type
              </label>
              <select
                id="typeFilter"
                className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {benefitTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {benefitStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                value={sortField}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="amount">Amount</option>
                <option value="status">Status</option>
                <option value="effectiveDate">Effective Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Benefits Table */}
        <div className="bg-white rounded shadow-retro-sm border-2 border-retro-dark overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-retro-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-retro-primary">Loading benefits...</p>
              </div>
            </div>
          ) : filteredBenefits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-xl text-gray-500">No benefits found</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === 'name' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center">
                        Type
                        {sortField === 'type' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center">
                        Amount
                        {sortField === 'amount' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('policyId')}
                    >
                      <div className="flex items-center">
                        Policy ID
                        {sortField === 'policyId' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('effectiveDate')}
                    >
                      <div className="flex items-center">
                        Effective Date
                        {sortField === 'effectiveDate' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBenefits.map((benefit) => (
                    <tr key={benefit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{benefit.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{benefit.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${benefit.type === 'Death Benefit' ? 'bg-blue-100 text-blue-800' : 
                            benefit.type === 'Cash Value' ? 'bg-green-100 text-green-800' : 
                            benefit.type === 'Living Benefit' ? 'bg-purple-100 text-purple-800' : 
                            benefit.type === 'Rider' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {benefit.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(benefit.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${benefit.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            benefit.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            benefit.status === 'Expired' ? 'bg-gray-100 text-gray-800' : 
                            benefit.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {benefit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {benefit.policyId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {benefit.effectiveDate || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/benefits/${benefit.id}/edit`}
                          className="text-retro-primary hover:text-retro-secondary mr-4"
                        >
                          Edit
                        </Link>
                        <Link 
                          href={`/benefits/${benefit.id}`}
                          className="text-retro-info hover:text-retro-secondary"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
