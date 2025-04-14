'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ClockIcon,
  UserIcon,
  PencilSquareIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PolicyHolder, FieldChange } from '@/lib/types';
import { getPolicyHolder, updatePolicyHolder } from '@/lib/services/mockDataService';

export default function PolicyholderEditClient({ id }: { id: string }) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [originalData, setOriginalData] = useState<Partial<PolicyHolder>>({});
  const [formData, setFormData] = useState<Partial<PolicyHolder>>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    ssn: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    occupation: '',
    employer: '',
    gender: undefined,
    maritalStatus: undefined,
    taxId: '',
    citizenship: '',
    incomeRange: '',
    riskClass: undefined,
    smokerStatus: undefined,
    height: '',
    weight: '',
    notes: '',
    auditTrail: []
  });

  // Load policyholder data
  useEffect(() => {
    const loadPolicyholder = async () => {
      try {
        const policyholder = await getPolicyHolder(id);
        
        if (policyholder) {
          // Store original data for comparison when tracking changes
          setOriginalData({...policyholder});
          
          setFormData({
            ...policyholder,
            // Ensure address is properly structured
            address: {
              street: policyholder.address.street || '',
              city: policyholder.address.city || '',
              state: policyholder.address.state || '',
              zipCode: policyholder.address.zipCode || '',
              country: policyholder.address.country || 'USA'
            }
          });
          setLoading(false);
        } else {
          setNotFound(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading policyholder:", error);
        setNotFound(true);
        setLoading(false);
      }
    };

    loadPolicyholder();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle address fields
      const [parent, child] = name.split('.');
      if (parent === 'address' && formData.address) {
        const updatedAddress = { ...formData.address, [child]: value };
        setFormData({ ...formData, address: updatedAddress });
      }
    } else {
      // Handle regular fields
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track field changes for audit trail
    const fieldChanges: FieldChange[] = [];
    
    // Compare original and new values for simple fields
    Object.keys(formData).forEach(key => {
      if (key !== 'address' && key !== 'auditTrail' && formData[key as keyof PolicyHolder] !== originalData[key as keyof PolicyHolder]) {
        fieldChanges.push({
          field: key,
          oldValue: originalData[key as keyof PolicyHolder],
          newValue: formData[key as keyof PolicyHolder]
        });
      }
    });
    
    // Compare address fields
    if (formData.address && originalData.address) {
      Object.keys(formData.address).forEach(key => {
        if (formData.address && originalData.address && 
            formData.address[key as keyof typeof formData.address] !== 
            originalData.address[key as keyof typeof originalData.address]) {
          fieldChanges.push({
            field: `address.${key}`,
            oldValue: originalData.address[key as keyof typeof originalData.address],
            newValue: formData.address[key as keyof typeof formData.address]
          });
        }
      });
    }
    
    // Update the policyholder with the new data
    const updatedPolicyholder = {
      ...formData
    } as PolicyHolder;
    
    try {
      // Save the policyholder with the mock data service
      await updatePolicyHolder(updatedPolicyholder, fieldChanges);
      
      // Redirect back to the policyholder detail page
      router.push(`/policyholders/${id}`);
    } catch {
      // In a real app, you would show an error message to the user
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (notFound) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="flex items-center mb-6">
            <Link href="/policyholders" className="text-indigo-600 hover:text-indigo-900 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Policyholders
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <p className="text-red-500">Policyholder not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex items-center mb-6">
          <Link href={`/policyholders/${id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Policyholder
          </Link>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Policyholder Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and contact information.</p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      {/* Personal Information */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          autoComplete="given-name"
                          value={formData.firstName || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          autoComplete="family-name"
                          value={formData.lastName || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          id="dateOfBirth"
                          value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="ssn" className="block text-sm font-medium text-gray-700">SSN</label>
                        <input
                          type="text"
                          name="ssn"
                          id="ssn"
                          autoComplete="off"
                          value={formData.ssn || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          autoComplete="tel"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      {/* Address */}
                      <div className="col-span-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Address</h4>
                      </div>

                      <div className="col-span-6">
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">Street address</label>
                        <input
                          type="text"
                          name="address.street"
                          id="address.street"
                          autoComplete="street-address"
                          value={formData.address?.street || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          name="address.city"
                          id="address.city"
                          autoComplete="address-level2"
                          value={formData.address?.city || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">State / Province</label>
                        <input
                          type="text"
                          name="address.state"
                          id="address.state"
                          autoComplete="address-level1"
                          value={formData.address?.state || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                        <input
                          type="text"
                          name="address.zipCode"
                          id="address.zipCode"
                          autoComplete="postal-code"
                          value={formData.address?.zipCode || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">Country</label>
                        <select
                          id="address.country"
                          name="address.country"
                          autoComplete="country-name"
                          value={formData.address?.country || 'USA'}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          aria-label="Country"
                          title="Select country"
                        >
                          <option value="USA">United States</option>
                          <option value="CAN">Canada</option>
                          <option value="MEX">Mexico</option>
                          <option value="GBR">United Kingdom</option>
                        </select>
                      </div>

                      {/* Additional Information */}
                      <div className="col-span-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
                        <input
                          type="text"
                          name="occupation"
                          id="occupation"
                          value={formData.occupation || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="employer" className="block text-sm font-medium text-gray-700">Employer</label>
                        <input
                          type="text"
                          name="employer"
                          id="employer"
                          value={formData.employer || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          aria-label="Gender"
                          title="Select gender"
                        >
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">Marital Status</label>
                        <select
                          id="maritalStatus"
                          name="maritalStatus"
                          value={formData.maritalStatus || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          aria-label="Marital status"
                          title="Select marital status"
                        >
                          <option value="">Select...</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Separated">Separated</option>
                          <option value="Domestic Partnership">Domestic Partnership</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="smokerStatus" className="block text-sm font-medium text-gray-700">Smoker Status</label>
                        <select
                          id="smokerStatus"
                          name="smokerStatus"
                          value={formData.smokerStatus || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          aria-label="Smoker status"
                          title="Select smoker status"
                        >
                          <option value="">Select...</option>
                          <option value="Non-smoker">Non-smoker</option>
                          <option value="Smoker">Smoker</option>
                          <option value="Former Smoker">Former Smoker</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="riskClass" className="block text-sm font-medium text-gray-700">Risk Class</label>
                        <select
                          id="riskClass"
                          name="riskClass"
                          value={formData.riskClass || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          aria-label="Risk class"
                          title="Select risk class"
                        >
                          <option value="">Select...</option>
                          <option value="Preferred Plus">Preferred Plus</option>
                          <option value="Preferred">Preferred</option>
                          <option value="Standard Plus">Standard Plus</option>
                          <option value="Standard">Standard</option>
                          <option value="Substandard">Substandard</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height</label>
                        <input
                          type="text"
                          name="height"
                          id="height"
                          placeholder="e.g. 5'10&quot;"
                          value={formData.height || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (lbs)</label>
                        <input
                          type="text"
                          name="weight"
                          id="weight"
                          placeholder="e.g. 160"
                          value={formData.weight || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={formData.notes || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <Link
                      href={`/policyholders/${id}`}
                      className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Audit Trail</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">History of changes to this policyholder.</p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:p-0">
                    <div className="sm:divide-y sm:divide-gray-200">
                      {formData.auditTrail && formData.auditTrail.length > 0 ? (
                        <div className="overflow-y-auto max-h-96">
                          {formData.auditTrail.map((entry) => (
                            <dl key={entry.id} className="px-4 py-4 sm:px-6 border-b border-gray-200">
                              <div className="flex items-center mb-2">
                                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <dt className="sr-only">Timestamp</dt>
                                <dd className="text-sm text-gray-500">{formatDate(entry.timestamp)}</dd>
                              </div>
                              <div className="flex items-center mb-2">
                                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <dt className="sr-only">User</dt>
                                <dd className="text-sm font-medium text-gray-900">{entry.userName}</dd>
                              </div>
                              <div className="flex items-center mb-2">
                                <PencilSquareIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <dt className="sr-only">Action</dt>
                                <dd className="text-sm text-gray-700 capitalize">{entry.action}</dd>
                              </div>
                              {entry.changes && entry.changes.length > 0 && (
                                <div className="mt-2 border-t border-gray-100 pt-2">
                                  <dt className="sr-only">Changes</dt>
                                  <dd>
                                    <h4 className="text-xs font-medium text-gray-500 mb-1">Changes:</h4>
                                    <ul className="space-y-1 text-gray-900">
                                      {entry.changes.map((change, index) => (
                                        <li key={`${change.field}-${index}`} className="text-xs">
                                          <span className="font-medium">{change.field}:</span> {change.oldValue ? String(change.oldValue) : "(empty)"} → {change.newValue ? String(change.newValue) : "(empty)"}
                                        </li>
                                      ))}
                                    </ul>
                                  </dd>
                                </div>
                              )}
                              {entry.notes && (
                                <div className="mt-2">
                                  <dt className="sr-only">Notes</dt>
                                  <dd className="text-sm text-gray-900">{entry.notes}</dd>
                                </div>
                              )}
                            </dl>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-5 sm:px-6">
                          <p className="text-sm text-gray-500">No audit records found for this policyholder.</p>
                          <p className="text-sm text-gray-500 mt-1">Changes made in this session will be recorded when you save.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
