# Coverage Rider Policy Admin System

A comprehensive policy administration system for life insurance and annuity products with robust beneficiary management, focusing on implementing detailed audit trails, comprehensive data tracking, and a user-friendly interface for managing policy-related information.

## Features

- **Dashboard**: Overview of policies, policyholders, and premium payments
- **Policy Management**: Detailed policy information, including coverage details and premium schedules
- **Policyholder Management**: Comprehensive policyholder profiles and associated policies
- **Beneficiary Management**: Complete beneficiary tracking with detailed audit trails
- **Audit Trail**: Comprehensive tracking of all changes with user, timestamp, and specific field changes
- **Benefits Management**: Manage policy benefits and coverage details
- **Policy Breakdowns**: View detailed premium allocations, cash value, and death benefit breakdowns

## Technology Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Hooks

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app`: Main application pages
  - `/dashboard`: Dashboard page
  - `/policies`: Policy listing and detail pages
  - `/policyholders`: Policyholder listing and detail pages
  - `/beneficiaries`: Beneficiary management
  - `/benefits`: Benefits management
- `/src/components`: Reusable UI components
  - `/layout`: Layout components like Sidebar and Header
  - `/ui`: UI components like buttons, cards, etc.
- `/src/lib`: Utility functions and data
  - `/types`: TypeScript type definitions
  - `/data`: Mock data for development

## Future Enhancements

- User authentication and role-based access control
- Policy creation and editing functionality
- Premium payment processing
- Document generation and management
- Reporting and analytics
- Integration with external systems
