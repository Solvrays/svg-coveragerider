'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ClockIcon,
  UserIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { policyHolders } from '@/lib/data/mock-data';
import { PolicyHolder, AuditEntry, FieldChange } from '@/lib/types';

export default function EditPolicyholderPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
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
    const policyholder = policyHolders.find(ph => ph.id === id);
    
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
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Create audit trail entry for the update
    const auditEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'current-user', // In a real app, this would be the logged-in user's ID
      userName: 'Admin User', // In a real app, this would be the logged-in user's name
      action: 'update',
      entityType: 'policyholder',
      entityId: id,
      changes: fieldChanges,
      notes: 'Updated policyholder information'
    };
    
    // Update audit trail
    const updatedAuditTrail = [
      ...(formData.auditTrail || []),
      auditEntry
    ];
    
    const updatedFormData = {
      ...formData,
      auditTrail: updatedAuditTrail
    };
    
    // In a real application, this would send data to an API
    console.log('Form submitted:', updatedFormData);
    console.log('Audit entry:', auditEntry);
    console.log('Field changes:', fieldChanges);
    
    // Redirect to policyholder detail page
    router.push(`/policyholders/${id}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="text-center py-10">
            <div className="retro-loader mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading policyholder data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (notFound) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-900">Policyholder Not Found</h2>
            <p className="mt-2 text-gray-600">The policyholder you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <div className="mt-6">
              <Link
                href="/policyholders"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Policyholders
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Policyholder</h1>
          <div className="flex space-x-4">
            <Link
              href={`/policyholders/${id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="md:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <form onSubmit={handleSubmit}>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Personal Information Section */}
                    <div className="sm:col-span-6">
                      <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h2>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Date of Birth*
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="dateOfBirth"
                          id="dateOfBirth"
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="ssn" className="block text-sm font-medium text-gray-700">
                        SSN*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="ssn"
                          id="ssn"
                          required
                          placeholder="XXX-XX-XXXX"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.ssn}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <div className="mt-1">
                        <select
                          id="gender"
                          name="gender"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.gender || ''}
                          onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                        Marital Status
                      </label>
                      <div className="mt-1">
                        <select
                          id="maritalStatus"
                          name="maritalStatus"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.maritalStatus || ''}
                          onChange={handleChange}
                        >
                          <option value="">Select Marital Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Separated">Separated</option>
                          <option value="Domestic Partnership">Domestic Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700">
                        Citizenship
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="citizenship"
                          id="citizenship"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.citizenship || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="sm:col-span-6">
                      <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-4">Contact Information</h2>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email*
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone*
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          required
                          placeholder="(XXX) XXX-XXXX"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                        Street Address*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.street"
                          id="address.street"
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.address?.street || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                        City*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.city"
                          id="address.city"
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.address?.city || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                        State*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.state"
                          id="address.state"
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.address?.state || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                        Zip Code*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.zipCode"
                          id="address.zipCode"
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.address?.zipCode || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="sm:col-span-6">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Additional Notes
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.notes || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Audit Trail Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Audit Trail</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">History of changes to this policyholder.</p>
                <p className="text-sm text-gray-500 mt-1">We&apos;ll never share your personal information. It&apos;s only used for policy administration.</p>
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
                                  <ul className="space-y-1">
                                    {entry.changes.map((change) => (
                                      <li key={change.field} className="text-xs">
                                        <span className="font-medium">{change.field}:</span> {change.oldValue ? change.oldValue.toString() : "(empty)"} → {change.newValue ? change.newValue.toString() : "(empty)"}
                                      </li>
                                    ))}
                                  </ul>
                                </dd>
                              </div>
                            )}
                            {entry.notes && (
                              <div className="mt-2">
                                <dt className="sr-only">Notes</dt>
                                <dd className="text-sm text-gray-600">{entry.notes}</dd>
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
      </div>
    </DashboardLayout>
  );
}
