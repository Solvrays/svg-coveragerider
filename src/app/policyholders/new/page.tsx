'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function NewPolicyholderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
    gender: '',
    maritalStatus: '',
    taxId: '',
    citizenship: 'USA',
    incomeRange: '',
    riskClass: '',
    smokerStatus: '',
    height: '',
    weight: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        // Create a new object with the updated nested property
        const updatedParent = { ...prev[parent as keyof typeof prev] as Record<string, string> };
        updatedParent[child] = value;
        
        return {
          ...prev,
          [parent]: updatedParent
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send data to an API
    console.log('Form submitted:', formData);
    
    // Redirect to policyholders list
    router.push('/policyholders');
  };

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">New Policyholder</h1>
          <Link
            href="/policyholders"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </Link>
        </div>

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
                      value={formData.gender}
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
                      value={formData.maritalStatus}
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
                      value={formData.citizenship}
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
                      value={formData.address.street}
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
                      value={formData.address.city}
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
                      value={formData.address.state}
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
                      value={formData.address.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="sm:col-span-6">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-4">Professional Information</h2>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                    Occupation
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="occupation"
                      id="occupation"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.occupation}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="employer" className="block text-sm font-medium text-gray-700">
                    Employer
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="employer"
                      id="employer"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.employer}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="incomeRange" className="block text-sm font-medium text-gray-700">
                    Annual Income Range
                  </label>
                  <div className="mt-1">
                    <select
                      id="incomeRange"
                      name="incomeRange"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.incomeRange}
                      onChange={handleChange}
                    >
                      <option value="">Select Income Range</option>
                      <option value="Under $25,000">Under $25,000</option>
                      <option value="$25,000 - $49,999">$25,000 - $49,999</option>
                      <option value="$50,000 - $74,999">$50,000 - $74,999</option>
                      <option value="$75,000 - $99,999">$75,000 - $99,999</option>
                      <option value="$100,000 - $149,999">$100,000 - $149,999</option>
                      <option value="$150,000 - $199,999">$150,000 - $199,999</option>
                      <option value="$200,000 or more">$200,000 or more</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
                    Tax ID (if different from SSN)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="taxId"
                      id="taxId"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.taxId}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Risk Assessment Section */}
                <div className="sm:col-span-6">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-4">Risk Assessment</h2>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="riskClass" className="block text-sm font-medium text-gray-700">
                    Risk Classification
                  </label>
                  <div className="mt-1">
                    <select
                      id="riskClass"
                      name="riskClass"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.riskClass}
                      onChange={handleChange}
                    >
                      <option value="">Select Risk Class</option>
                      <option value="Preferred Plus">Preferred Plus</option>
                      <option value="Preferred">Preferred</option>
                      <option value="Standard Plus">Standard Plus</option>
                      <option value="Standard">Standard</option>
                      <option value="Substandard">Substandard</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="smokerStatus" className="block text-sm font-medium text-gray-700">
                    Smoker Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="smokerStatus"
                      name="smokerStatus"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.smokerStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select Smoker Status</option>
                      <option value="Non-smoker">Non-smoker</option>
                      <option value="Smoker">Smoker</option>
                      <option value="Former Smoker">Former Smoker</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                    Height
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="height"
                      id="height"
                      placeholder="5'10&quot;"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.height}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="weight"
                      id="weight"
                      placeholder="180 lbs"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.weight}
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
                      value={formData.notes}
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
                Create Policyholder
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
