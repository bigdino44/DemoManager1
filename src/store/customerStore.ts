import { create } from 'zustand';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: 'Decision Maker' | 'Technical Evaluator' | 'End User' | 'Financial Approver';
  email: string;
  phone?: string;
  notes?: string;
}

export interface CustomerProfile {
  id: string;
  company: string;
  industry: string;
  size: string;
  budget: string;
  website: string;
  status: 'Active' | 'Prospect' | 'Closed Won' | 'Closed Lost';
  painPoints: string[];
  requirements: string[];
  stakeholders: Stakeholder[];
  currentSolution?: string;
  timeline: string;
  notes: string;
  lastContact: Date;
  revenue: {
    sales: {
      id: string;
      demoId: string;
      productName: string;
      amount: number;
      date: Date;
      quantity: number;
      notes?: string;
    }[];
    totalAmount: number;
    lastUpdated: Date;
  };
}

interface CustomerStore {
  customers: CustomerProfile[];
  selectedCustomer: CustomerProfile | null;
  setSelectedCustomer: (customer: CustomerProfile | null) => void;
  addCustomer: (customer: Omit<CustomerProfile, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<CustomerProfile>) => void;
  addDemoRevenue: (customerId: string, demoId: string, amount: number, demoType: string) => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [
    {
      id: '1',
      company: 'TechCorp Industries',
      industry: 'Manufacturing',
      size: '1000-5000',
      budget: '$100k-500k',
      website: 'techcorp.com',
      status: 'Active',
      painPoints: [
        'Legacy system integration issues',
        'Scalability challenges',
        'Data security concerns'
      ],
      requirements: [
        'Cloud deployment',
        'Real-time analytics',
        'Mobile access',
        'Enterprise-grade security'
      ],
      stakeholders: [
        {
          id: 's1',
          name: 'John Smith',
          role: 'CTO',
          influence: 'Decision Maker',
          email: 'john.smith@techcorp.com',
          phone: '(555) 123-4567',
          notes: 'Primary technical contact'
        },
        {
          id: 's2',
          name: 'Sarah Johnson',
          role: 'IT Director',
          influence: 'Technical Evaluator',
          email: 'sarah.j@techcorp.com',
          notes: 'Focused on security requirements'
        }
      ],
      currentSolution: 'Legacy on-premise system',
      timeline: 'Q2 2024',
      notes: 'High-priority prospect with immediate needs',
      lastContact: new Date('2024-03-15'),
      revenue: {
        sales: [
          {
            id: 's1',
            demoId: 'd1',
            productName: 'Enterprise License',
            amount: 150000,
            quantity: 1,
            date: new Date('2024-02-20'),
            notes: 'Annual enterprise license with support'
          },
          {
            id: 's2',
            demoId: 'd2',
            productName: 'Department Licenses',
            amount: 75000,
            quantity: 5,
            date: new Date('2024-03-05'),
            notes: 'Expansion to marketing and sales departments'
          }
        ],
        totalAmount: 225000,
        lastUpdated: new Date('2024-03-05')
      }
    },
    {
      id: '2',
      company: 'Global Solutions Ltd',
      industry: 'Technology',
      size: '500-1000',
      budget: '$50k-100k',
      website: 'globalsolutions.io',
      status: 'Prospect',
      painPoints: [
        'High operational costs',
        'Manual process inefficiencies',
        'Limited visibility into metrics'
      ],
      requirements: [
        'Cost optimization tools',
        'Process automation',
        'Advanced reporting',
        'Integration capabilities'
      ],
      stakeholders: [
        {
          id: 's3',
          name: 'Michael Chang',
          role: 'COO',
          influence: 'Decision Maker',
          email: 'm.chang@globalsolutions.io',
          phone: '(555) 987-6543',
          notes: 'Interested in operational efficiency gains'
        },
        {
          id: 's4',
          name: 'Emma Wilson',
          role: 'Finance Director',
          influence: 'Financial Approver',
          email: 'e.wilson@globalsolutions.io',
          notes: 'Focused on ROI and cost savings'
        }
      ],
      currentSolution: 'Multiple disconnected tools',
      timeline: 'Q3 2024',
      notes: 'Looking for comprehensive solution to replace current tech stack',
      lastContact: new Date('2024-03-10'),
      revenue: {
        sales: [
          {
            id: 's3',
            demoId: 'd3',
            productName: 'Professional License',
            amount: 45000,
            quantity: 3,
            date: new Date('2024-03-15'),
            notes: 'Initial deployment for core team'
          }
        ],
        totalAmount: 45000,
        lastUpdated: new Date('2024-03-15')
      }
    }
  ],
  selectedCustomer: null,
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, { 
      ...customer, 
      id: Math.random().toString(36).substr(2, 9),
      revenue: {
        sales: [],
        totalAmount: 0,
        lastUpdated: new Date()
      }
    }]
  })),
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map(customer =>
      customer.id === id ? { ...customer, ...updates } : customer
    )
  })),
  addDemoRevenue: (customerId, demoId, amount, demoType) => set((state) => ({
    customers: state.customers.map(customer => {
      if (customer.id !== customerId) return customer;

      const newSale = {
        id: Math.random().toString(36).substr(2, 9),
        demoId,
        productName: `${demoType} Package`,
        amount,
        quantity: 1,
        date: new Date(),
        notes: `Sale from ${demoType} demo`
      };

      const newSales = [...customer.revenue.sales, newSale];
      const totalAmount = newSales.reduce((sum, s) => sum + s.amount, 0);

      return {
        ...customer,
        revenue: {
          sales: newSales,
          totalAmount,
          lastUpdated: new Date()
        }
      };
    })
  }))
}));