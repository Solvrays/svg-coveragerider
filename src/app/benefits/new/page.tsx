'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BenefitFormData, AuditEntry } from '@/lib/types';
import { policies } from '@/lib/data/mock-data';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

export default function NewBenefitPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<BenefitFormData>({
    name: '',
    description: '',
    type: '',
    amount: 0,
    policyId: '',
    effectiveDate: '',
    expiryDate: '',
    status: '',
    conditions: [],
    exclusions: [],
    waitingPeriod: 0,
    eliminationPeriod: 0,
    maxBenefitPeriod: '',
    benefitFrequency: '',
    coinsurance: 0,
    deductible: 0,
    maxLifetimeBenefit: 0,
  });
  const [newCondition, setNewCondition] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (['amount', 'waitingPeriod', 'eliminationPeriod', 'coinsurance', 'deductible', 'maxLifetimeBenefit'].includes(name)) {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData({
        ...formData,
        conditions: [...(formData.conditions || []), newCondition.trim()],
      });
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    const updatedConditions = [...(formData.conditions || [])];
    updatedConditions.splice(index, 1);
    setFormData({
      ...formData,
      conditions: updatedConditions,
    });
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData({
        ...formData,
        exclusions: [...(formData.exclusions || []), newExclusion.trim()],
      });
      setNewExclusion('');
    }
  };

  const removeExclusion = (index: number) => {
    const updatedExclusions = [...(formData.exclusions || [])];
    updatedExclusions.splice(index, 1);
    setFormData({
      ...formData,
      exclusions: updatedExclusions,
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.type) errors.type = 'Type is required';
    if (formData.amount <= 0) errors.amount = 'Amount must be greater than 0';
    if (!formData.policyId) errors.policyId = 'Policy is required';
    if (!formData.status) errors.status = 'Status is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    // Simulate API call to create benefit
    setTimeout(() => {
      // Generate a new ID (would be done by the backend in a real app)
      const newId = `bnf-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      // Create audit entry
      const auditEntry: AuditEntry = {
        id: `aud-${newId}`,
        timestamp: new Date().toISOString(),
        userId: 'user-001', // Mock user ID
        userName: 'Admin User', // Mock user name
        action: 'create',
        entityType: 'benefit',
        entityId: newId,
        notes: 'Benefit created via admin interface',
      };
      
      // Create new benefit
      const newBenefit = {
        id: newId,
        name: formData.name,
        description: formData.description,
        type: formData.type as 'Death Benefit' | 'Cash Value' | 'Living Benefit' | 'Rider' | 'Other',
        amount: formData.amount,
        policyId: formData.policyId,
        effectiveDate: formData.effectiveDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        status: formData.status as 'Active' | 'Pending' | 'Expired' | 'Cancelled' | undefined,
        conditions: formData.conditions?.length ? formData.conditions : undefined,
        exclusions: formData.exclusions?.length ? formData.exclusions : undefined,
        waitingPeriod: formData.waitingPeriod || undefined,
        eliminationPeriod: formData.eliminationPeriod || undefined,
        maxBenefitPeriod: formData.maxBenefitPeriod || undefined,
        benefitFrequency: formData.benefitFrequency as 'One-time' | 'Monthly' | 'Annual' | 'As incurred' | undefined,
        coinsurance: formData.coinsurance || undefined,
        deductible: formData.deductible || undefined,
        maxLifetimeBenefit: formData.maxLifetimeBenefit || undefined,
        auditTrail: [auditEntry],
      };
      
      // In a real app, we would call an API here
      console.log('Created benefit:', newBenefit);
      
      setIsSaving(false);
      
      // Show success message and redirect
      alert('Benefit created successfully!');
      router.push('/benefits');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create New Benefit</h1>
          <Link
            href="/benefits"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded shadow-retro-sm hover:bg-gray-300 transition-all"
          >
            Cancel
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-retro-sm border-2 border-retro-dark">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 border-b-2 border-retro-primary pb-2">Basic Information</h2>
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Benefit Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border-2 ${formErrors.name ? 'border-red-500' : 'border-retro-dark'} rounded focus:ring-retro-primary focus:border-retro-primary`}
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Benefit Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full p-2 border-2 ${formErrors.type ? 'border-red-500' : 'border-retro-dark'} rounded focus:ring-retro-primary focus:border-retro-primary`}
                >
                  <option value="">Select Type</option>
                  <option value="Death Benefit">Death Benefit</option>
                  <option value="Cash Value">Cash Value</option>
                  <option value="Living Benefit">Living Benefit</option>
                  <option value="Rider">Rider</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.type && <p className="mt-1 text-sm text-red-500">{formErrors.type}</p>}
              </div>

              <div className="md:col-span-2 mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full p-2 border-2 ${formErrors.description ? 'border-red-500' : 'border-retro-dark'} rounded focus:ring-retro-primary focus:border-retro-primary`}
                />
                {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full p-2 border-2 ${formErrors.amount ? 'border-red-500' : 'border-retro-dark'} rounded focus:ring-retro-primary focus:border-retro-primary`}
                />
                {formErrors.amount && <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="policyId" className="block text-sm font-medium text-gray-700 mb-1">
                  Policy <span className="text-red-500">*</span>
                </label>
                <select
                  id="policyId"
                  name="policyId"
                  value={formData.policyId}
                  onChange={handleInputChange}
                  className={`w-full p-2 border-2 ${formErrors.policyId ? 'border-red-500' : 'border-retro-dark'} rounded focus:ring-retro-primary focus:border-retro-primary`}
                >
                  <option value="">Select Policy</option>
                  {policies.map(policy => (
                    <option key={policy.id} value={policy.id}>
                      {policy.policyNumber} - {policy.policyType}
                    </option>
                  ))}
                </select>
                {formErrors.policyId && <p className="mt-1 text-sm text-red-500">{formErrors.policyId}</p>}
              </div>

              {/* Status and Dates */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 border-b-2 border-retro-primary pb-2 mt-4">Status and Dates</h2>
              </div>

              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full p-2 border-2 ${formErrors.status ? 'border-red-500' : 'border-retro-dark'} rounded focus:ring-retro-primary focus:border-retro-primary`}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {formErrors.status && <p className="mt-1 text-sm text-red-500">{formErrors.status}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="benefitFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Benefit Frequency
                </label>
                <select
                  id="benefitFrequency"
                  name="benefitFrequency"
                  value={formData.benefitFrequency}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                >
                  <option value="">Select Frequency</option>
                  <option value="One-time">One-time</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                  <option value="As incurred">As incurred</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Date
                </label>
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                />
              </div>

              {/* Additional Details */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 border-b-2 border-retro-primary pb-2 mt-4">Additional Details</h2>
              </div>

              <div className="mb-4">
                <label htmlFor="waitingPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                  Waiting Period (days)
                </label>
                <input
                  type="number"
                  id="waitingPeriod"
                  name="waitingPeriod"
                  value={formData.waitingPeriod}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="eliminationPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                  Elimination Period (days)
                </label>
                <input
                  type="number"
                  id="eliminationPeriod"
                  name="eliminationPeriod"
                  value={formData.eliminationPeriod}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="maxBenefitPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Benefit Period
                </label>
                <input
                  type="text"
                  id="maxBenefitPeriod"
                  name="maxBenefitPeriod"
                  value={formData.maxBenefitPeriod}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="maxLifetimeBenefit" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Lifetime Benefit
                </label>
                <input
                  type="number"
                  id="maxLifetimeBenefit"
                  name="maxLifetimeBenefit"
                  value={formData.maxLifetimeBenefit}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="coinsurance" className="block text-sm font-medium text-gray-700 mb-1">
                  Coinsurance (%)
                </label>
                <input
                  type="number"
                  id="coinsurance"
                  name="coinsurance"
                  value={formData.coinsurance}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="deductible" className="block text-sm font-medium text-gray-700 mb-1">
                  Deductible
                </label>
                <input
                  type="number"
                  id="deductible"
                  name="deductible"
                  value={formData.deductible}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-retro-dark rounded focus:ring-retro-primary focus:border-retro-primary"
                />
              </div>

              {/* Conditions and Exclusions */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 border-b-2 border-retro-primary pb-2 mt-4">Conditions and Exclusions</h2>
              </div>

              <div className="md:col-span-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Conditions</label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="flex-grow p-2 border-2 border-retro-dark rounded-l focus:ring-retro-primary focus:border-retro-primary"
                    placeholder="Add a condition..."
                  />
                  <button
                    type="button"
                    onClick={addCondition}
                    className="px-4 py-2 bg-retro-primary text-white rounded-r hover:brightness-110"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.conditions?.map((condition, index) => (
                    <div key={index} className="flex items-center bg-gray-100 p-2 rounded">
                      <span className="flex-grow">{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {(!formData.conditions || formData.conditions.length === 0) && (
                    <p className="text-gray-500 italic">No conditions added</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions</label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    className="flex-grow p-2 border-2 border-retro-dark rounded-l focus:ring-retro-primary focus:border-retro-primary"
                    placeholder="Add an exclusion..."
                  />
                  <button
                    type="button"
                    onClick={addExclusion}
                    className="px-4 py-2 bg-retro-primary text-white rounded-r hover:brightness-110"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.exclusions?.map((exclusion, index) => (
                    <div key={index} className="flex items-center bg-gray-100 p-2 rounded">
                      <span className="flex-grow">{exclusion}</span>
                      <button
                        type="button"
                        onClick={() => removeExclusion(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {(!formData.exclusions || formData.exclusions.length === 0) && (
                    <p className="text-gray-500 italic">No exclusions added</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 mt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full px-4 py-2 bg-retro-primary text-white rounded shadow-retro-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Creating...' : 'Create Benefit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
