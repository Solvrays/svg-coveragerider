'use client';

import { useState, useEffect } from 'react';
import { Benefit, BenefitFormData, AuditEntry, FieldChange } from '@/lib/types';
import { benefits, policies } from '@/lib/data/mock-data';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

// This component receives the ID as a prop instead of accessing params directly
export default function BenefitEditClient({ id }: { id: string }) {
  const [benefit, setBenefit] = useState<Benefit | null>(null);
  const [originalBenefit, setOriginalBenefit] = useState<Benefit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  useEffect(() => {
    // Simulate API call to fetch benefit data
    const timer = setTimeout(() => {
      const foundBenefit = benefits.find(b => b.id === id);
      
      if (foundBenefit) {
        setBenefit(foundBenefit);
        setOriginalBenefit(JSON.parse(JSON.stringify(foundBenefit)));
        
        // Initialize form data
        setFormData({
          name: foundBenefit.name,
          description: foundBenefit.description,
          type: foundBenefit.type,
          amount: foundBenefit.amount,
          policyId: foundBenefit.policyId,
          effectiveDate: foundBenefit.effectiveDate || '',
          expiryDate: foundBenefit.expiryDate || '',
          status: foundBenefit.status || '',
          conditions: foundBenefit.conditions || [],
          exclusions: foundBenefit.exclusions || [],
          waitingPeriod: foundBenefit.waitingPeriod || 0,
          eliminationPeriod: foundBenefit.eliminationPeriod || 0,
          maxBenefitPeriod: foundBenefit.maxBenefitPeriod || '',
          benefitFrequency: foundBenefit.benefitFrequency || '',
          coinsurance: foundBenefit.coinsurance || 0,
          deductible: foundBenefit.deductible || 0,
          maxLifetimeBenefit: foundBenefit.maxLifetimeBenefit || 0,
        });
      }
      
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

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

  const detectChanges = (): FieldChange[] => {
    if (!originalBenefit) return [];
    
    const changes: FieldChange[] = [];
    
    // Check simple fields
    const fieldsToCheck = [
      'name', 'description', 'type', 'amount', 'policyId', 'effectiveDate', 
      'expiryDate', 'status', 'waitingPeriod', 'eliminationPeriod', 
      'maxBenefitPeriod', 'benefitFrequency', 'coinsurance', 'deductible', 'maxLifetimeBenefit'
    ];
    
    fieldsToCheck.forEach(field => {
      const key = field as keyof Benefit;
      if (originalBenefit[key] !== formData[field as keyof BenefitFormData]) {
        changes.push({
          field,
          oldValue: originalBenefit[key],
          newValue: formData[field as keyof BenefitFormData],
        });
      }
    });
    
    // Check array fields
    ['conditions', 'exclusions'].forEach(field => {
      const key = field as keyof Benefit;
      const originalArray = originalBenefit[key] as string[] || [];
      const newArray = formData[field as keyof BenefitFormData] as string[] || [];
      
      if (JSON.stringify(originalArray) !== JSON.stringify(newArray)) {
        changes.push({
          field,
          oldValue: originalArray,
          newValue: newArray,
        });
      }
    });
    
    return changes;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    // Detect what has changed
    const changes = detectChanges();
    
    // Simulate API call to update benefit
    setTimeout(() => {
      if (benefit) {
        // Create audit entry
        const auditEntry: AuditEntry = {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          userId: 'user-001', // Mock user ID
          userName: 'Admin User', // Mock user name
          action: 'update',
          entityType: 'benefit',
          entityId: benefit.id,
          changes: changes.length > 0 ? changes : undefined,
          notes: 'Benefit updated via admin interface',
        };
        
        // Update benefit with new data and audit trail
        const updatedBenefit: Benefit = {
          ...benefit,
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
          auditTrail: [...(benefit.auditTrail || []), auditEntry],
        };
        
        // In a real app, we would call an API here
        console.log('Updated benefit:', updatedBenefit);
        
        // Update the local state to show the changes
        setBenefit(updatedBenefit);
        setOriginalBenefit(JSON.parse(JSON.stringify(updatedBenefit)));
      }
      
      setIsSaving(false);
      
      // Show success message with styled modal instead of alert
      setShowSuccessModal(true);
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-retro-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-retro-primary">Loading benefit data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!benefit) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-red-600">Benefit Not Found</h1>
          <p className="mt-2 text-gray-600">The benefit you are looking for does not exist.</p>
          <Link href="/benefits" className="mt-4 px-4 py-2 bg-retro-primary text-white rounded shadow-retro-sm hover:brightness-110 transition-all">
            Return to Benefits
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Edit Benefit</h1>
            <p className="text-gray-600">ID: {benefit.id}</p>
          </div>
          <div className="flex space-x-2">
            <Link
              href="/benefits"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded shadow-retro-sm hover:bg-gray-300 transition-all"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded shadow-retro-sm border-2 border-retro-dark">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 border-b-2 border-retro-primary pb-2">Basic Information</h2>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                      Benefit Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                      required
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-900">
                      Benefit Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Death Benefit">Death Benefit</option>
                      <option value="Cash Value">Cash Value</option>
                      <option value="Living Benefit">Living Benefit</option>
                      <option value="Rider">Rider</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.type && <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>}
                  </div>

                  <div className="md:col-span-2 mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                      required
                    />
                    {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-900">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    />
                    {formErrors.amount && <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="policyId" className="block text-sm font-medium text-gray-900">
                      Policy <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="policyId"
                      name="policyId"
                      value={formData.policyId}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    >
                      <option value="">Select Policy</option>
                      {policies.map(policy => (
                        <option key={policy.id} value={policy.id}>
                          {policy.policyNumber} - {policy.policyType}
                        </option>
                      ))}
                    </select>
                    {formErrors.policyId && <p className="mt-1 text-sm text-red-600">{formErrors.policyId}</p>}
                  </div>

                  {/* Status and Dates */}
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 border-b-2 border-retro-primary pb-2 mt-4">Status and Dates</h2>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-900">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Expired">Expired</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {formErrors.status && <p className="mt-1 text-sm text-red-600">{formErrors.status}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="benefitFrequency" className="block text-sm font-medium text-gray-900">
                      Benefit Frequency
                    </label>
                    <select
                      id="benefitFrequency"
                      name="benefitFrequency"
                      value={formData.benefitFrequency}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    >
                      <option value="">Select Frequency</option>
                      <option value="One-time">One-time</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Annual">Annual</option>
                      <option value="As incurred">As incurred</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-900">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      id="effectiveDate"
                      name="effectiveDate"
                      value={formData.effectiveDate}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-900">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    />
                  </div>

                  {/* Additional Details */}
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 border-b-2 border-retro-primary pb-2 mt-4">Additional Details</h2>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="waitingPeriod" className="block text-sm font-medium text-gray-900">
                      Waiting Period (days)
                    </label>
                    <input
                      type="number"
                      id="waitingPeriod"
                      name="waitingPeriod"
                      value={formData.waitingPeriod}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="eliminationPeriod" className="block text-sm font-medium text-gray-900">
                      Elimination Period (days)
                    </label>
                    <input
                      type="number"
                      id="eliminationPeriod"
                      name="eliminationPeriod"
                      value={formData.eliminationPeriod}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="maxBenefitPeriod" className="block text-sm font-medium text-gray-900">
                      Max Benefit Period
                    </label>
                    <input
                      type="text"
                      id="maxBenefitPeriod"
                      name="maxBenefitPeriod"
                      value={formData.maxBenefitPeriod}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="maxLifetimeBenefit" className="block text-sm font-medium text-gray-900">
                      Max Lifetime Benefit
                    </label>
                    <input
                      type="number"
                      id="maxLifetimeBenefit"
                      name="maxLifetimeBenefit"
                      value={formData.maxLifetimeBenefit}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="coinsurance" className="block text-sm font-medium text-gray-900">
                      Coinsurance (%)
                    </label>
                    <input
                      type="number"
                      id="coinsurance"
                      name="coinsurance"
                      value={formData.coinsurance}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="deductible" className="block text-sm font-medium text-gray-900">
                      Deductible
                    </label>
                    <input
                      type="number"
                      id="deductible"
                      name="deductible"
                      value={formData.deductible}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-retro-primary focus:border-retro-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900 bg-green-50"
                    />
                  </div>

                  {/* Conditions and Exclusions */}
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 border-b-2 border-retro-primary pb-2 mt-4">Conditions and Exclusions</h2>
                  </div>

                  <div className="md:col-span-2 mb-4">
                    <label className="block text-sm font-medium text-gray-900">Conditions</label>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        className="flex-grow p-2 border-2 border-retro-dark rounded-l focus:ring-retro-primary focus:border-retro-primary text-gray-900 bg-green-50"
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
                        <div key={index} className="flex items-center bg-gray-400 p-2 rounded">
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
                      {formData.conditions?.length === 0 && (
                        <p className="text-gray-500 italic">No conditions added</p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 mb-4">
                    <label className="block text-sm font-medium text-gray-900">Exclusions</label>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={newExclusion}
                        onChange={(e) => setNewExclusion(e.target.value)}
                        className="flex-grow p-2 border-2 border-retro-dark rounded-l focus:ring-retro-primary focus:border-retro-primary text-gray-900 bg-green-50"
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
                      {formData.exclusions?.length === 0 && (
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
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Audit Trail Section - 1/3 width on large screens */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 shadow-lg overflow-hidden rounded-lg border-2 border-retro-primary">
              <div className="px-4 py-3 border-b border-retro-primary bg-gray-900">
                <h2 className="text-lg font-semibold text-retro-light">Audit Trail</h2>
              </div>
              
              {benefit.auditTrail && benefit.auditTrail.length > 0 ? (
                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 p-4">
                  {benefit.auditTrail.map((entry) => (
                    <div key={entry.id} className="border-l-4 border-retro-info pl-4 py-2 mb-4">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold">
                          {entry.action === 'create' && <span className="text-green-400">Created</span>}
                          {entry.action === 'update' && <span className="text-blue-400">Updated</span>}
                          {entry.action === 'delete' && <span className="text-red-400">Deleted</span>}
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(entry.timestamp)}</div>
                      </div>
                      <div className="text-sm text-gray-300 mt-1">By: {entry.userName}</div>
                      
                      {entry.notes && (
                        <div className="text-sm mt-2 italic text-gray-400">{entry.notes}</div>
                      )}
                      
                      {entry.changes && entry.changes.length > 0 && (
                        <div className="mt-3 text-sm">
                          <div className="font-medium mb-1 text-gray-300">Changes:</div>
                          <div className="space-y-2">
                            {entry.changes.map((change, idx) => (
                              <div key={idx} className="bg-gray-700 p-3 rounded-md">
                                <div className="font-medium text-retro-light mb-2">{change.field.charAt(0).toUpperCase() + change.field.slice(1)}</div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-xs text-gray-400 block mb-1">From:</span>
                                    <div className="text-red-400 bg-gray-800 p-2 rounded">
                                      {Array.isArray(change.oldValue) 
                                        ? change.oldValue.length > 0 
                                          ? change.oldValue.join(', ') 
                                          : '(empty array)'
                                        : change.oldValue !== undefined && change.oldValue !== null
                                          ? String(change.oldValue)
                                          : '(empty)'}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-400 block mb-1">To:</span>
                                    <div className="text-green-400 bg-gray-800 p-2 rounded">
                                      {Array.isArray(change.newValue) 
                                        ? change.newValue.length > 0 
                                          ? change.newValue.join(', ') 
                                          : '(empty array)'
                                        : change.newValue !== undefined && change.newValue !== null
                                          ? String(change.newValue)
                                          : '(empty)'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No audit records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-gray-900 border-2 border-retro-primary rounded-lg shadow-lg p-6 max-w-md w-full mx-4 transform transition-all animate-slideIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-retro-light">Success!</h3>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:text-white focus:outline-none"
                aria-label="Close"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-full p-2 mr-4 animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-retro-light">Benefit updated successfully!</p>
                  <p className="text-gray-400 text-sm mt-1">Your changes have been saved.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-2 bg-retro-primary text-white font-bold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-retro-primary focus:ring-opacity-50 transition-colors transform hover:scale-105 transition-transform"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
