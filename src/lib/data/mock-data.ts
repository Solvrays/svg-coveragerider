import { PolicyHolder, Policy, Beneficiary, Benefit, PolicyBreakdown, AuditEntry } from '../types';

export const policyHolders: PolicyHolder[] = [
  {
    id: 'ph-001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1975-05-15',
    ssn: '123-45-6789',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    policies: ['pol-001', 'pol-002'],
    occupation: 'Software Engineer',
    employer: 'Tech Solutions Inc.',
    gender: 'Male',
    maritalStatus: 'Married',
    taxId: '123-45-6789',
    citizenship: 'USA',
    incomeRange: '$100,000 - $150,000',
    riskClass: 'Preferred',
    smokerStatus: 'Non-smoker',
    height: '5\'10"',
    weight: '180 lbs',
    documents: [
      {
        id: 'doc-ph-001',
        name: 'Medical Examination Report',
        type: 'Medical',
        uploadDate: '2023-01-10',
        url: '/documents/medical-report-ph-001.pdf',
        size: 1456789
      },
      {
        id: 'doc-ph-002',
        name: 'Income Verification',
        type: 'Other',
        uploadDate: '2023-01-05',
        url: '/documents/income-verification-ph-001.pdf',
        size: 987654
      }
    ],
    notes: 'Preferred client with excellent payment history',
    auditTrail: [
      {
        id: 'aud-ph-001',
        timestamp: '2023-01-15T10:30:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policyholder',
        entityId: 'ph-001',
        notes: 'Policyholder created'
      }
    ]
  },
  {
    id: 'ph-002',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1980-08-20',
    ssn: '234-56-7890',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678',
    address: {
      street: '456 Oak Ave',
      city: 'Somewhere',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    policies: ['pol-003'],
    occupation: 'Marketing Director',
    employer: 'Global Marketing Inc.',
    gender: 'Female',
    maritalStatus: 'Single',
    taxId: '234-56-7890',
    citizenship: 'USA',
    incomeRange: '$150,000 - $200,000',
    riskClass: 'Preferred Plus',
    smokerStatus: 'Non-smoker',
    height: '5\'6"',
    weight: '135 lbs',
    documents: [
      {
        id: 'doc-ph-003',
        name: 'Medical Examination Report',
        type: 'Medical',
        uploadDate: '2023-03-05',
        url: '/documents/medical-report-ph-002.pdf',
        size: 1876543
      }
    ],
    notes: 'Client interested in additional coverage options',
    auditTrail: [
      {
        id: 'aud-ph-002',
        timestamp: '2023-03-10T14:15:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policyholder',
        entityId: 'ph-002',
        notes: 'Policyholder created'
      }
    ]
  },
  {
    id: 'ph-003',
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1972-11-30',
    ssn: '345-67-8901',
    email: 'robert.johnson@example.com',
    phone: '(555) 345-6789',
    address: {
      street: '789 Pine Blvd',
      city: 'Elsewhere',
      state: 'TX',
      zipCode: '75001',
      country: 'USA'
    },
    policies: ['pol-003'],
    occupation: 'Physician',
    employer: 'City Hospital',
    gender: 'Male',
    maritalStatus: 'Married',
    taxId: '345-67-8901',
    citizenship: 'USA',
    incomeRange: '$200,000+',
    riskClass: 'Standard Plus',
    smokerStatus: 'Former Smoker',
    height: '6\'0"',
    weight: '190 lbs',
    documents: [
      {
        id: 'doc-ph-004',
        name: 'Medical Examination Report',
        type: 'Medical',
        uploadDate: '2023-05-15',
        url: '/documents/medical-report-ph-003.pdf',
        size: 2345678
      },
      {
        id: 'doc-ph-005',
        name: 'Income Verification',
        type: 'Other',
        uploadDate: '2023-05-10',
        url: '/documents/income-verification-ph-003.pdf',
        size: 1234567
      }
    ],
    notes: 'High-value client with multiple policies',
    auditTrail: [
      {
        id: 'aud-ph-003',
        timestamp: '2023-05-20T09:45:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policyholder',
        entityId: 'ph-003',
        notes: 'Policyholder created'
      }
    ]
  },
  {
    id: 'ph-004',
    firstName: 'Emily',
    lastName: 'Williams',
    dateOfBirth: '1990-02-12',
    ssn: '567-89-0123',
    email: 'emily.williams@example.com',
    phone: '(555) 567-8901',
    address: {
      street: '321 Maple St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    policies: ['pol-004'],
    occupation: 'Financial Analyst',
    employer: 'Investment Firm LLC',
    gender: 'Female',
    maritalStatus: 'Married',
    taxId: '567-89-0123',
    citizenship: 'USA',
    incomeRange: '$80,000 - $100,000',
    riskClass: 'Preferred',
    smokerStatus: 'Non-smoker',
    height: '5\'4"',
    weight: '125 lbs',
    documents: [
      {
        id: 'doc-ph-006',
        name: 'Medical Examination Report',
        type: 'Medical',
        uploadDate: '2023-07-01',
        url: '/documents/medical-report-ph-004.pdf',
        size: 1765432
      }
    ],
    notes: 'Interested in retirement planning options',
    auditTrail: [
      {
        id: 'aud-ph-004',
        timestamp: '2023-07-05T11:20:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policyholder',
        entityId: 'ph-004',
        notes: 'Policyholder created'
      }
    ]
  },
  {
    id: 'ph-005',
    firstName: 'Michael',
    lastName: 'Brown',
    dateOfBirth: '1985-04-18',
    ssn: '678-90-1234',
    email: 'michael.brown@example.com',
    phone: '(555) 678-9012',
    address: {
      street: '901 Broadway',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    policies: ['pol-005'],
    occupation: 'Entrepreneur',
    employer: 'Self-employed',
    gender: 'Male',
    maritalStatus: 'Divorced',
    taxId: '678-90-1234',
    citizenship: 'USA',
    incomeRange: '$100,000 - $150,000',
    riskClass: 'Standard',
    smokerStatus: 'Smoker',
    height: '5\'11"',
    weight: '195 lbs',
    documents: [
      {
        id: 'doc-ph-007',
        name: 'Medical Examination Report',
        type: 'Medical',
        uploadDate: '2023-09-10',
        url: '/documents/medical-report-ph-005.pdf',
        size: 1876543
      },
      {
        id: 'doc-ph-008',
        name: 'Business Income Verification',
        type: 'Other',
        uploadDate: '2023-09-05',
        url: '/documents/business-income-ph-005.pdf',
        size: 2345678
      }
    ],
    notes: 'Client has expressed interest in business continuation coverage',
    auditTrail: [
      {
        id: 'aud-ph-005',
        timestamp: '2023-09-15T15:30:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policyholder',
        entityId: 'ph-005',
        notes: 'Policyholder created'
      }
    ]
  }
];

export const policies: Policy[] = [
  {
    id: 'pol-001',
    policyNumber: 'LFP-12345678',
    policyType: 'Whole Life',
    status: 'Active',
    issueDate: '2023-01-15',
    effectiveDate: '2023-02-01',
    expiryDate: undefined,
    premiumAmount: 250.00,
    premiumFrequency: 'Monthly',
    faceAmount: 500000.00,
    cashValue: 15000.00,
    policyholderIds: ['ph-001'],
    beneficiaryIds: ['ben-001', 'ben-002'],
    riders: [
      {
        id: 'rid-001',
        name: 'Accidental Death Benefit',
        description: 'Provides additional benefit in case of accidental death',
        cost: 25.00,
        status: 'Active',
        effectiveDate: '2023-02-01',
        expiryDate: undefined
      },
      {
        id: 'rid-002',
        name: 'Waiver of Premium',
        description: 'Waives premium payments if policyholder becomes disabled',
        cost: 15.00,
        status: 'Active',
        effectiveDate: '2023-02-01',
        expiryDate: undefined
      }
    ],
    documents: [
      {
        id: 'doc-001',
        name: 'Policy Contract',
        type: 'Policy',
        uploadDate: '2023-01-15',
        url: '/documents/policy-contract-001.pdf',
        size: 2456789
      }
    ],
    notes: 'Policy issued after standard underwriting process',
    auditTrail: [
      {
        id: 'aud-pol-001',
        timestamp: '2023-01-15T10:30:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policy',
        entityId: 'pol-001',
        notes: 'Policy created and issued'
      }
    ]
  },
  {
    id: 'pol-002',
    policyNumber: 'LFP-23456789',
    policyType: 'Term Life',
    status: 'Active',
    issueDate: '2023-03-10',
    effectiveDate: '2023-04-01',
    expiryDate: '2043-04-01',
    premiumAmount: 125.00,
    premiumFrequency: 'Monthly',
    faceAmount: 750000.00,
    cashValue: undefined,
    policyholderIds: ['ph-002'],
    beneficiaryIds: ['ben-003', 'ben-004'],
    riders: [
      {
        id: 'rid-003',
        name: 'Critical Illness Rider',
        description: 'Provides benefit if diagnosed with covered critical illness',
        cost: 35.00,
        status: 'Active',
        effectiveDate: '2023-04-01',
        expiryDate: '2043-04-01'
      }
    ],
    documents: [
      {
        id: 'doc-002',
        name: 'Policy Contract',
        type: 'Policy',
        uploadDate: '2023-03-10',
        url: '/documents/policy-contract-002.pdf',
        size: 1987654
      },
      {
        id: 'doc-003',
        name: 'Medical Examination Report',
        type: 'Medical',
        uploadDate: '2023-02-25',
        url: '/documents/medical-report-002.pdf',
        size: 3456789
      }
    ],
    notes: 'Policy issued with preferred rates due to excellent health',
    auditTrail: [
      {
        id: 'aud-pol-002',
        timestamp: '2023-03-10T14:15:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policy',
        entityId: 'pol-002',
        notes: 'Policy created and issued with preferred rates'
      }
    ]
  },
  {
    id: 'pol-003',
    policyNumber: 'LFP-34567890',
    policyType: 'Universal Life',
    status: 'Active',
    issueDate: '2023-05-20',
    effectiveDate: '2023-06-01',
    expiryDate: undefined,
    premiumAmount: 350.00,
    premiumFrequency: 'Monthly',
    faceAmount: 1000000.00,
    cashValue: 25000.00,
    policyholderIds: ['ph-003'],
    beneficiaryIds: ['ben-005', 'ben-006', 'ben-007'],
    riders: [
      {
        id: 'rid-004',
        name: 'Long-term Care Rider',
        description: 'Provides benefits for long-term care expenses',
        cost: 45.00,
        status: 'Active',
        effectiveDate: '2023-06-01',
        expiryDate: undefined
      }
    ],
    documents: [
      {
        id: 'doc-004',
        name: 'Policy Contract',
        type: 'Policy',
        uploadDate: '2023-05-20',
        url: '/documents/policy-contract-003.pdf',
        size: 2345678
      },
      {
        id: 'doc-005',
        name: 'Policy Illustration',
        type: 'Illustration',
        uploadDate: '2023-05-15',
        url: '/documents/illustration-003.pdf',
        size: 1234567
      }
    ],
    notes: 'Policy includes additional riders for comprehensive coverage',
    auditTrail: [
      {
        id: 'aud-pol-003',
        timestamp: '2023-05-20T09:45:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policy',
        entityId: 'pol-003',
        notes: 'Policy created with comprehensive coverage options'
      }
    ]
  },
  {
    id: 'pol-004',
    policyNumber: 'ANT-45678901',
    policyType: 'Annuity',
    status: 'Active',
    issueDate: '2023-07-05',
    effectiveDate: '2023-08-01',
    expiryDate: undefined,
    premiumAmount: 100000.00,
    premiumFrequency: 'Single',
    faceAmount: 100000.00,
    cashValue: 102500.00,
    policyholderIds: ['ph-004'],
    beneficiaryIds: ['ben-008'],
    riders: [],
    documents: [
      {
        id: 'doc-006',
        name: 'Annuity Contract',
        type: 'Policy',
        uploadDate: '2023-07-05',
        url: '/documents/annuity-contract-004.pdf',
        size: 1876543
      }
    ],
    notes: 'Single premium immediate annuity with monthly payments',
    auditTrail: [
      {
        id: 'aud-pol-004',
        timestamp: '2023-07-05T11:20:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policy',
        entityId: 'pol-004',
        notes: 'Annuity contract created and funded'
      }
    ]
  },
  {
    id: 'pol-005',
    policyNumber: 'LFP-56789012',
    policyType: 'Variable Life',
    status: 'Pending',
    issueDate: '2023-09-15',
    effectiveDate: '2023-10-01',
    expiryDate: undefined,
    premiumAmount: 500.00,
    premiumFrequency: 'Monthly',
    faceAmount: 1500000.00,
    cashValue: 0.00,
    policyholderIds: ['ph-005'],
    beneficiaryIds: ['ben-009', 'ben-010'],
    riders: [
      {
        id: 'rid-005',
        name: 'Guaranteed Insurability Rider',
        description: 'Allows purchase of additional insurance without medical examination',
        cost: 30.00,
        status: 'Pending',
        effectiveDate: '2023-10-01',
        expiryDate: undefined
      }
    ],
    documents: [
      {
        id: 'doc-007',
        name: 'Application Form',
        type: 'Application',
        uploadDate: '2023-09-10',
        url: '/documents/application-005.pdf',
        size: 1456789
      }
    ],
    notes: 'Application in underwriting review',
    auditTrail: [
      {
        id: 'aud-pol-005',
        timestamp: '2023-09-15T15:30:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policy',
        entityId: 'pol-005',
        notes: 'Policy application submitted for underwriting'
      }
    ]
  }
];

export const beneficiaries: Beneficiary[] = [
  {
    id: 'ben-001',
    firstName: 'Sarah',
    lastName: 'Doe',
    relationship: 'Spouse',
    dateOfBirth: '1978-09-12',
    ssn: '234-56-7890',
    email: 'sarah.doe@example.com',
    phone: '(555) 234-5678',
    percentage: 75,
    policyId: 'pol-001'
  },
  {
    id: 'ben-002',
    firstName: 'Michael',
    lastName: 'Doe',
    relationship: 'Son',
    dateOfBirth: '2005-06-30',
    ssn: '345-67-8901',
    percentage: 25,
    policyId: 'pol-001'
  },
  {
    id: 'ben-003',
    firstName: 'Thomas',
    lastName: 'Smith',
    relationship: 'Brother',
    dateOfBirth: '1985-04-18',
    ssn: '456-78-9012',
    percentage: 50,
    policyId: 'pol-002'
  },
  {
    id: 'ben-004',
    firstName: 'Emily',
    lastName: 'Smith',
    relationship: 'Sister',
    dateOfBirth: '1987-11-24',
    ssn: '567-89-0123',
    percentage: 50,
    policyId: 'pol-002'
  },
  {
    id: 'ben-005',
    firstName: 'Patricia',
    lastName: 'Johnson',
    relationship: 'Spouse',
    dateOfBirth: '1970-07-14',
    ssn: '678-90-1234',
    email: 'patricia.johnson@example.com',
    phone: '(555) 678-9012',
    percentage: 100,
    policyId: 'pol-003'
  },
  {
    id: 'ben-006',
    firstName: 'James',
    lastName: 'Johnson',
    relationship: 'Son',
    dateOfBirth: '2000-02-28',
    ssn: '789-01-2345',
    percentage: 0,
    policyId: 'pol-003'
  },
  {
    id: 'ben-007',
    firstName: 'Jessica',
    lastName: 'Johnson',
    relationship: 'Daughter',
    dateOfBirth: '2002-05-15',
    ssn: '890-12-3456',
    percentage: 0,
    policyId: 'pol-003'
  },
  {
    id: 'ben-008',
    firstName: 'William',
    lastName: 'Williams',
    relationship: 'Spouse',
    dateOfBirth: '1980-10-20',
    ssn: '901-23-4567',
    email: 'william.williams@example.com',
    phone: '(555) 901-2345',
    percentage: 100,
    policyId: 'pol-004'
  },
  {
    id: 'ben-009',
    firstName: 'Olivia',
    lastName: 'Brown',
    relationship: 'Spouse',
    dateOfBirth: '1985-06-12',
    ssn: '234-56-7890',
    email: 'olivia.brown@example.com',
    phone: '(555) 234-5678',
    percentage: 100,
    policyId: 'pol-005'
  },
  {
    id: 'ben-010',
    firstName: 'Benjamin',
    lastName: 'Brown',
    relationship: 'Son',
    dateOfBirth: '2010-03-25',
    ssn: '345-67-8901',
    percentage: 0,
    policyId: 'pol-005'
  }
];

export const benefits: Benefit[] = [
  {
    id: 'bnf-001',
    name: 'Death Benefit',
    description: 'Standard death benefit',
    type: 'Death Benefit',
    amount: 500000,
    policyId: 'pol-001',
    effectiveDate: '2023-02-01',
    status: 'Active',
    benefitFrequency: 'One-time',
    auditTrail: [
      {
        id: 'aud-bnf-001',
        timestamp: '2023-01-15T10:30:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'benefit',
        entityId: 'bnf-001',
        notes: 'Benefit created with policy'
      }
    ]
  },
  {
    id: 'bnf-002',
    name: 'Cash Value',
    description: 'Accumulated cash value',
    type: 'Cash Value',
    amount: 15000,
    policyId: 'pol-001',
    effectiveDate: '2023-02-01',
    status: 'Active',
    benefitFrequency: 'One-time',
    auditTrail: [
      {
        id: 'aud-bnf-002',
        timestamp: '2023-01-15T10:30:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'benefit',
        entityId: 'bnf-002',
        notes: 'Benefit created with policy'
      }
    ]
  },
  {
    id: 'bnf-003',
    name: 'Accelerated Death Benefit',
    description: 'Access to death benefit if diagnosed with terminal illness',
    type: 'Living Benefit',
    amount: 250000,
    policyId: 'pol-001',
    effectiveDate: '2023-02-01',
    status: 'Active',
    conditions: ['Terminal illness with life expectancy of 12 months or less'],
    waitingPeriod: 90,
    benefitFrequency: 'One-time',
    maxLifetimeBenefit: 250000,
    auditTrail: [
      {
        id: 'aud-bnf-003',
        timestamp: '2023-01-15T10:30:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'benefit',
        entityId: 'bnf-003',
        notes: 'Benefit created with policy'
      }
    ]
  },
  {
    id: 'bnf-004',
    name: 'Death Benefit',
    description: 'Standard death benefit',
    type: 'Death Benefit',
    amount: 750000,
    policyId: 'pol-002',
    effectiveDate: '2023-04-01',
    expiryDate: '2043-04-01',
    status: 'Active',
    benefitFrequency: 'One-time',
    auditTrail: [
      {
        id: 'aud-bnf-004',
        timestamp: '2023-03-10T14:15:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'benefit',
        entityId: 'bnf-004',
        notes: 'Benefit created with policy'
      }
    ]
  },
  {
    id: 'bnf-005',
    name: 'Critical Illness Benefit',
    description: 'Benefit paid upon diagnosis of covered critical illness',
    type: 'Living Benefit',
    amount: 75000,
    policyId: 'pol-002',
    effectiveDate: '2023-04-01',
    expiryDate: '2043-04-01',
    status: 'Active',
    conditions: ['Cancer', 'Heart Attack', 'Stroke', 'Major Organ Failure', 'End-stage Renal Disease'],
    exclusions: ['Pre-existing conditions within 12 months prior to policy issue'],
    waitingPeriod: 90,
    benefitFrequency: 'One-time',
    maxLifetimeBenefit: 75000,
    auditTrail: [
      {
        id: 'aud-bnf-005',
        timestamp: '2023-03-10T14:15:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'benefit',
        entityId: 'bnf-005',
        notes: 'Benefit created with policy'
      }
    ]
  },
  {
    id: 'bnf-006',
    name: 'Death Benefit',
    description: 'Standard death benefit',
    type: 'Death Benefit',
    amount: 1000000,
    policyId: 'pol-003',
    effectiveDate: '2023-06-01',
    status: 'Active',
    benefitFrequency: 'One-time',
    auditTrail: [
      {
        id: 'aud-bnf-006',
        timestamp: '2023-05-20T09:45:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'benefit',
        entityId: 'bnf-006',
        notes: 'Benefit created with policy'
      }
    ]
  },
  {
    id: 'bnf-007',
    name: 'Disability Income Benefit',
    description: 'Monthly income if disabled',
    type: 'Living Benefit',
    amount: 3000,
    policyId: 'pol-003',
    effectiveDate: '2023-06-01',
    status: 'Active',
    conditions: ['Total disability preventing insured from performing their occupation'],
    waitingPeriod: 90,
    eliminationPeriod: 90,
    maxBenefitPeriod: '2 years',
    benefitFrequency: 'Monthly',
    auditTrail: [
      {
        id: 'aud-bnf-007',
        timestamp: '2023-05-20T09:45:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'benefit',
        entityId: 'bnf-007',
        notes: 'Benefit created with policy'
      }
    ]
  },
  {
    id: 'bnf-008',
    name: 'Long-term Care Benefit',
    description: 'Provides benefits for long-term care expenses',
    type: 'Living Benefit',
    amount: 45000,
    policyId: 'pol-003',
    effectiveDate: '2023-06-01',
    status: 'Active',
    conditions: ['Inability to perform 2 of 6 Activities of Daily Living', 'Cognitive impairment'],
    waitingPeriod: 90,
    eliminationPeriod: 90,
    maxBenefitPeriod: '3 years',
    benefitFrequency: 'Monthly',
    maxLifetimeBenefit: 150000,
    auditTrail: [
      {
        id: 'aud-bnf-008',
        timestamp: '2023-05-20T09:45:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'benefit',
        entityId: 'bnf-008',
        notes: 'Benefit created with policy'
      }
    ]
  },
  {
    id: 'bnf-009',
    name: 'Guaranteed Insurability Rider',
    description: 'Allows purchase of additional insurance without medical examination',
    type: 'Rider',
    amount: 0,
    policyId: 'pol-005',
    effectiveDate: '2023-10-01',
    status: 'Pending',
    conditions: ['Can be exercised at specific option dates or life events'],
    auditTrail: [
      {
        id: 'aud-bnf-009',
        timestamp: '2023-09-15T15:30:00Z',
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'benefit',
        entityId: 'bnf-009',
        notes: 'Benefit created with policy'
      }
    ]
  }
];

export const policyBreakdowns: PolicyBreakdown[] = [
  {
    policyId: 'pol-001',
    premiumAllocation: {
      basePremium: 100.50,
      riderPremiums: [
        { riderName: 'Accidental Death Rider', amount: 15.00 },
        { riderName: 'Waiver of Premium', amount: 10.00 }
      ],
      fees: [
        { feeName: 'Administrative Fee', amount: 5.00 }
      ]
    },
    deathBenefitBreakdown: {
      totalDeathBenefit: 750000,
      baseBenefit: 500000,
      additionalBenefits: [
        { benefitName: 'Accidental Death Rider', amount: 250000 }
      ]
    }
  },
  {
    policyId: 'pol-002',
    premiumAllocation: {
      basePremium: 1450.00,
      riderPremiums: [],
      fees: [
        { feeName: 'Administrative Fee', amount: 50.00 }
      ]
    },
    cashValueBreakdown: {
      totalCashValue: 15000,
      guaranteedValue: 12000,
      nonGuaranteedValue: 3000,
      surrenderValue: 13500
    }
  },
  {
    policyId: 'pol-003',
    premiumAllocation: {
      basePremium: 200.75,
      riderPremiums: [
        { riderName: 'Critical Illness Rider', amount: 25.00 }
      ],
      fees: [
        { feeName: 'Administrative Fee', amount: 5.00 }
      ]
    },
    deathBenefitBreakdown: {
      totalDeathBenefit: 750000,
      baseBenefit: 750000,
      additionalBenefits: []
    },
    cashValueBreakdown: {
      totalCashValue: 15000,
      guaranteedValue: 12000,
      nonGuaranteedValue: 3000,
      surrenderValue: 13500
    }
  },
  {
    policyId: 'pol-004',
    premiumAllocation: {
      basePremium: 300.25,
      riderPremiums: [
        { riderName: 'Disability Income Rider', amount: 50.00 }
      ],
      fees: [
        { feeName: 'Administrative Fee', amount: 5.00 }
      ]
    },
    deathBenefitBreakdown: {
      totalDeathBenefit: 1000000,
      baseBenefit: 1000000,
      additionalBenefits: []
    }
  },
  {
    policyId: 'pol-005',
    premiumAllocation: {
      basePremium: 400.00,
      riderPremiums: [
        { riderName: 'Guaranteed Insurability Rider', amount: 30.00 }
      ],
      fees: [
        { feeName: 'Administrative Fee', amount: 5.00 }
      ]
    },
    deathBenefitBreakdown: {
      totalDeathBenefit: 1500000,
      baseBenefit: 1500000,
      additionalBenefits: []
    }
  }
];

export const users = [
  {
    id: 'user-001',
    name: 'Admin User',
    email: 'admin@lifepro.com',
    role: 'admin'
  },
  {
    id: 'user-002',
    name: 'Agent Smith',
    email: 'agent@lifepro.com',
    role: 'agent'
  },
  {
    id: 'user-003',
    name: 'Viewer User',
    email: 'viewer@lifepro.com',
    role: 'viewer'
  }
];

export const auditEntries: AuditEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2025-01-15T10:30:00Z',
    userId: 'user-001',
    userName: 'Admin User',
    action: 'create',
    entityType: 'beneficiary',
    entityId: 'ben-001',
    notes: 'Initial beneficiary creation'
  },
  {
    id: 'audit-002',
    timestamp: '2025-02-10T14:45:00Z',
    userId: 'user-002',
    userName: 'Agent Smith',
    action: 'update',
    entityType: 'beneficiary',
    entityId: 'ben-001',
    changes: [
      {
        field: 'percentage',
        oldValue: 50,
        newValue: 75
      }
    ],
    notes: 'Updated allocation percentage as requested by policyholder'
  },
  {
    id: 'audit-003',
    timestamp: '2025-02-20T09:15:00Z',
    userId: 'user-001',
    userName: 'Admin User',
    action: 'update',
    entityType: 'beneficiary',
    entityId: 'ben-002',
    changes: [
      {
        field: 'percentage',
        oldValue: 50,
        newValue: 25
      }
    ],
    notes: 'Adjusted percentage to match primary beneficiary change'
  },
  {
    id: 'audit-004',
    timestamp: '2025-03-05T11:20:00Z',
    userId: 'user-002',
    userName: 'Agent Smith',
    action: 'update',
    entityType: 'beneficiary',
    entityId: 'ben-004',
    changes: [
      {
        field: 'email',
        oldValue: null,
        newValue: 'thomas.smith@example.com'
      },
      {
        field: 'phone',
        oldValue: null,
        newValue: '(555) 987-1234'
      }
    ],
    notes: 'Added contact information'
  },
  {
    id: 'audit-005',
    timestamp: '2025-03-18T16:30:00Z',
    userId: 'user-001',
    userName: 'Admin User',
    action: 'create',
    entityType: 'beneficiary',
    entityId: 'ben-007',
    notes: 'Added contingent beneficiary'
  },
  {
    id: 'audit-006',
    timestamp: '2025-04-02T13:45:00Z',
    userId: 'user-002',
    userName: 'Agent Smith',
    action: 'delete',
    entityType: 'beneficiary',
    entityId: 'ben-007',
    notes: 'Removed at policyholder request'
  }
];

const beneficiariesWithAudit = beneficiaries.map(beneficiary => {
  const beneficiaryAudits = auditEntries.filter(audit => 
    audit.entityType === 'beneficiary' && audit.entityId === beneficiary.id
  );
  
  return beneficiaryAudits.length > 0
    ? { ...beneficiary, auditTrail: beneficiaryAudits }
    : beneficiary;
});

export const beneficiariesData = beneficiariesWithAudit;
