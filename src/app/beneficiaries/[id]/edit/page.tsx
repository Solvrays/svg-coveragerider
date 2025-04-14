'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { beneficiariesData, policies, users } from '@/lib/data/mock-data';
import { Address, AuditEntry, FieldChange } from '@/lib/types';

// Define the BeneficiaryFormData interface
interface BeneficiaryFormData {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  phone: string;
  percentage: number;
  address: Address;
}

// Create a mock function to simulate updating the beneficiary data
// In a real app, this would be an API call
const updateBeneficiaryMock = (
  beneficiaryId: string, 
  formData: BeneficiaryFormData, 
  auditEntry: AuditEntry
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find the beneficiary in the mock data
      const index = beneficiariesData.findIndex(b => b.id === beneficiaryId);
      
      if (index !== -1) {
        // Update the beneficiary data
        beneficiariesData[index] = {
          ...beneficiariesData[index],
          firstName: formData.firstName,
          lastName: formData.lastName,
          relationship: formData.relationship,
          dateOfBirth: formData.dateOfBirth,
          ssn: formData.ssn,
          email: formData.email,
          phone: formData.phone,
          percentage: formData.percentage,
          address: formData.address,
        };
        
        // Add the audit entry
        if (!beneficiariesData[index].auditTrail) {
          beneficiariesData[index].auditTrail = [];
        }
        
        beneficiariesData[index].auditTrail!.push(auditEntry);
        
        // Log the updated data to console for debugging
        console.log('Updated beneficiary data:', beneficiariesData[index]);
        
        resolve(true);
      } else {
        console.error('Beneficiary not found:', beneficiaryId);
        resolve(false);
      }
    }, 800); // Simulate network delay
  });
};

// Create a mock function to simulate creating a new beneficiary
const createBeneficiaryMock = (
  formData: BeneficiaryFormData,
  policyId: string,
  auditEntry: AuditEntry
): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a new ID
      const newId = `ben-${Date.now()}`;
      
      // Create the new beneficiary
      const newBeneficiary = {
        id: newId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        relationship: formData.relationship,
        dateOfBirth: formData.dateOfBirth,
        ssn: formData.ssn,
        email: formData.email,
        phone: formData.phone,
        percentage: formData.percentage,
        address: formData.address,
        policyId: policyId,
        auditTrail: [auditEntry]
      };
      
      // Add to the mock data
      beneficiariesData.push(newBeneficiary);
      
      // Log the new data to console for debugging
      console.log('Created new beneficiary:', newBeneficiary);
      
      resolve(newId);
    }, 800); // Simulate network delay
  });
};

export default function EditBeneficiary() {
  const router = useRouter();
  const { id } = useParams();
  const beneficiaryId = Array.isArray(id) ? id[0] : id;
  const isNewBeneficiary = beneficiaryId === 'new';
  
  const [formData, setFormData] = useState<BeneficiaryFormData>({
    firstName: '',
    lastName: '',
    relationship: '',
    dateOfBirth: '',
    ssn: '',
    email: '',
    phone: '',
    percentage: 0,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    }
  });
  
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  const [auditNote, setAuditNote] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<BeneficiaryFormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load existing beneficiary data if editing
  useEffect(() => {
    if (!isNewBeneficiary) {
      setIsLoading(true);
      // Simulate API call with a short timeout
      setTimeout(() => {
        const beneficiary = beneficiariesData.find(b => b.id === beneficiaryId);
        if (beneficiary) {
          console.log("Found beneficiary data:", beneficiary);
          const formattedData: BeneficiaryFormData = {
            firstName: beneficiary.firstName,
            lastName: beneficiary.lastName,
            relationship: beneficiary.relationship,
            dateOfBirth: beneficiary.dateOfBirth,
            ssn: beneficiary.ssn,
            email: beneficiary.email || '',
            phone: beneficiary.phone || '',
            percentage: beneficiary.percentage,
            address: beneficiary.address || {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: 'USA'
            }
          };
          
          console.log("Setting form data:", formattedData);
          setFormData(formattedData);
          setOriginalData(formattedData);
          setSelectedPolicyId(beneficiary.policyId);
        } else {
          console.error("Beneficiary not found with ID:", beneficiaryId);
        }
        setIsLoading(false);
      }, 300);
    } else {
      setIsLoading(false);
    }
  }, [beneficiaryId, isNewBeneficiary]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.relationship) newErrors.relationship = 'Relationship is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.ssn) newErrors.ssn = 'SSN is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (formData.percentage <= 0 || formData.percentage > 100) {
      newErrors.percentage = 'Percentage must be between 1 and 100';
    }
    if (!selectedPolicyId) newErrors.policyId = 'Policy is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name} = ${value}`);
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }));
      }
    } else if (name === 'percentage') {
      setFormData(prev => ({
        ...prev,
        percentage: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name as keyof BeneficiaryFormData]: value
      }));
    }
  };

  const generateAuditTrail = (): AuditEntry => {
    const currentUser = users[0]; // Using admin user for this example
    const changes: FieldChange[] = [];
    
    if (!isNewBeneficiary && originalData) {
      // Compare each field to find changes
      Object.keys(formData).forEach(key => {
        const fieldKey = key as keyof BeneficiaryFormData;
        const oldValue = originalData[fieldKey];
        const newValue = formData[fieldKey];
        
        if (fieldKey === 'address' && typeof oldValue === 'object' && typeof newValue === 'object') {
          // Handle address object
          const oldAddress = oldValue as Address;
          const newAddress = newValue as Address;
          
          Object.keys(oldAddress).forEach(addressKey => {
            const addrKey = addressKey as keyof Address;
            if (oldAddress[addrKey] !== newAddress[addrKey]) {
              changes.push({
                field: `address.${addressKey}`,
                oldValue: String(oldAddress[addrKey]),
                newValue: String(newAddress[addrKey])
              });
            }
          });
        } else if (oldValue !== newValue) {
          changes.push({
            field: key,
            oldValue: String(oldValue),
            newValue: String(newValue)
          });
        }
      });
    }
    
    return {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: isNewBeneficiary ? 'create' : 'update',
      entityType: 'beneficiary',
      entityId: isNewBeneficiary ? `ben-new-${Date.now()}` : (beneficiaryId as string),
      changes: isNewBeneficiary ? undefined : changes,
      notes: auditNote || undefined
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSaveSuccess(false);
    
    try {
      const auditEntry = generateAuditTrail();
      console.log('Saving beneficiary with audit trail:', auditEntry);
      
      if (isNewBeneficiary) {
        // Create new beneficiary
        const newId = await createBeneficiaryMock(formData, selectedPolicyId, auditEntry);
        setSaveSuccess(true);
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push(`/beneficiaries/${newId}`);
        }, 1500);
      } else {
        // Update existing beneficiary
        const success = await updateBeneficiaryMock(beneficiaryId, formData, auditEntry);
        setSaveSuccess(success);
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push(`/beneficiaries/${beneficiaryId}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving beneficiary:', error);
      setSaveSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique relationship types for dropdown
  const relationshipTypes = ['Spouse', 'Child', 'Parent', 'Sibling', 'Friend', 'Trust', 'Estate', 'Other'];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-700">Loading beneficiary data...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  console.log("Rendering form with data:", formData);

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex items-center mb-6">
          <Link 
            href={isNewBeneficiary ? '/beneficiaries' : `/beneficiaries/${beneficiaryId}`}
            className="text-indigo-600 hover:text-indigo-900 flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            {isNewBeneficiary ? 'Back to Beneficiaries' : 'Back to Beneficiary Details'}
          </Link>
        </div>

        {saveSuccess && (
          <div className="mb-6 bg-green-100 border-2 border-green-500 p-4 text-green-700">
            <p className="font-bold">Success!</p>
            <p>The beneficiary has been {isNewBeneficiary ? 'created' : 'updated'} successfully.</p>
            <p className="text-sm mt-1">Redirecting to details page...</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isNewBeneficiary ? 'Add New Beneficiary' : 'Edit Beneficiary'}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {isNewBeneficiary 
                ? 'Enter the details for the new beneficiary' 
                : 'Update the beneficiary information'}
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Personal Information */}
                <div className="sm:col-span-6">
                  <h4 className="text-sm font-medium text-gray-900">Personal Information</h4>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md sm:text-sm ${
                        errors.firstName 
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                    />
                    {errors.firstName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600" id="firstName-error">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md sm:text-sm ${
                        errors.lastName 
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                    />
                    {errors.lastName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600" id="lastName-error">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                    Relationship
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <select
                      id="relationship"
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md sm:text-sm ${
                        errors.relationship 
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                    >
                      <option value="">Select relationship</option>
                      {relationshipTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.relationship && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.relationship && (
                    <p className="mt-2 text-sm text-red-600" id="relationship-error">
                      {errors.relationship}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">
                    Allocation Percentage
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="percentage"
                      id="percentage"
                      min="1"
                      max="100"
                      value={formData.percentage}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md sm:text-sm ${
                        errors.percentage 
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                    />
                    {errors.percentage && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.percentage && (
                    <p className="mt-2 text-sm text-red-600" id="percentage-error">
                      {errors.percentage}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md sm:text-sm ${
                        errors.dateOfBirth 
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600" id="dateOfBirth-error">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="ssn" className="block text-sm font-medium text-gray-700">
                    SSN
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="ssn"
                      id="ssn"
                      value={formData.ssn}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md sm:text-sm ${
                        errors.ssn 
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="XXX-XX-XXXX"
                    />
                    {errors.ssn && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.ssn && (
                    <p className="mt-2 text-sm text-red-600" id="ssn-error">
                      {errors.ssn}
                    </p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="sm:col-span-6 pt-4">
                  <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md sm:text-sm ${
                        errors.email 
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                    />
                    {errors.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="(XXX) XXX-XXXX"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-6 pt-4">
                  <h4 className="text-sm font-medium text-gray-900">Address (Optional)</h4>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                    Street address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address.street"
                      id="address.street"
                      value={formData.address?.street || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address.city"
                      id="address.city"
                      value={formData.address?.city || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address.state"
                      id="address.state"
                      value={formData.address?.state || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP / Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address.zipCode"
                      id="address.zipCode"
                      value={formData.address?.zipCode || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address.country"
                      id="address.country"
                      value={formData.address?.country || 'USA'}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Policy Selection */}
                <div className="sm:col-span-6 pt-4">
                  <h4 className="text-sm font-medium text-gray-900">Policy Information</h4>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="policyId" className="block text-sm font-medium text-gray-700">
                    Associated Policy
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <select
                      id="policyId"
                      name="policyId"
                      value={selectedPolicyId}
                      onChange={(e) => setSelectedPolicyId(e.target.value)}
                      className={`block w-full rounded-md sm:text-sm ${
                        errors.policyId 
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      disabled={!isNewBeneficiary} // Can't change policy for existing beneficiary
                    >
                      <option value="">Select a policy</option>
                      {policies.map(policy => (
                        <option key={policy.id} value={policy.id}>
                          {policy.policyNumber} - {policy.policyType} ({policy.status})
                        </option>
                      ))}
                    </select>
                    {errors.policyId && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.policyId && (
                    <p className="mt-2 text-sm text-red-600" id="policyId-error">
                      {errors.policyId}
                    </p>
                  )}
                </div>

                {/* Audit Trail Notes */}
                <div className="sm:col-span-6 pt-4">
                  <h4 className="text-sm font-medium text-gray-900">Audit Information</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    This information will be recorded in the audit trail for this change.
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="auditNote" className="block text-sm font-medium text-gray-700">
                    Notes for Audit Log
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="auditNote"
                      name="auditNote"
                      rows={3}
                      value={auditNote}
                      onChange={(e) => setAuditNote(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Describe the reason for this change..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  href={isNewBeneficiary ? '/beneficiaries' : `/beneficiaries/${beneficiaryId}`}
                  className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isNewBeneficiary ? 'Create Beneficiary' : 'Update Beneficiary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
