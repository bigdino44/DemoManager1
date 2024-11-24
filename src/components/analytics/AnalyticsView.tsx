import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDemoStore } from '../../store/demoStore';
import { useCustomerStore } from '../../store/customerStore';
import { demoTypes } from '../../store/demoTypes';
import { Calendar, Users2, TrendingUp, DollarSign } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export function AnalyticsView() {
  const demos = useDemoStore(state => state.demos);
  const customers = useCustomerStore(state => state.customers);

  // Calculate metrics
  const calculateMetrics = () => {
    const totalDemos = demos.length;
    const avgAttendees = Math.round(demos.reduce((acc, demo) => acc + demo.attendees, 0) / totalDemos || 0);
    
    // Calculate conversion rate based on demos that led to sales
    const demosWithSales = new Set(
      customers.flatMap(c => c.revenue.sales.map(s => s.demoId))
    );
    const conversionRate = Math.round((demosWithSales.size / totalDemos) * 100) || 0;

    // Calculate total revenue from all sales
    const totalRevenue = customers.reduce((sum, customer) => 
      sum + customer.revenue.totalAmount, 0
    );

    return {
      totalDemos,
      avgAttendees,
      conversionRate,
      totalRevenue
    };
  };

  const { totalDemos, avgAttendees, conversionRate, totalRevenue } = calculateMetrics();

  // Calculate demo type distribution
  const demoTypeData = Object.entries(demoTypes).map(([key, type]) => ({
    name: type.name,
    value: demos.filter(demo => demo.location.toLowerCase() === key).length || 0
  }));

  // Monthly trends by demo type
  const monthlyTrends = [
    { month: 'Jan', Virtual: 4, Nexus: 2, 'On-site': 3, 'On-location': 1 },
    { month: 'Feb', Virtual: 6, Nexus: 3, 'On-site': 4, 'On-location': 2 },
    { month: 'Mar', Virtual: 5, Nexus: 4, 'On-site': 4, 'On-location': 3 },
    { month: 'Apr', Virtual: 7, Nexus: 2, 'On-site': 3, 'On-location': 2 },
    { month: 'May', Virtual: 8, Nexus: 3, 'On-site': 4, 'On-location': 4 },
    { month: 'Jun', Virtual: 6, Nexus: 5, 'On-site': 3, 'On-location': 3 }
  ];

  const metrics = [
    {
      title: 'Total Demos',
      value: totalDemos,
      change: '+12%',
      icon: <Calendar className="w-6 h-6 text-indigo-600" />
    },
    {
      title: 'Avg. Attendees',
      value: avgAttendees,
      change: '+8%',
      icon: <Users2 className="w-6 h-6 text-emerald-600" />
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '+5%',
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />
    },
    {
      title: 'Revenue',
      value: `$${(totalRevenue / 1000).toFixed(1)}k`,
      change: '+15%',
      icon: <DollarSign className="w-6 h-6 text-rose-600" />
    }
  ];

  // Demo type performance calculations
  const demoPerformance = Object.entries(demoTypes).map(([key, type]) => {
    const typeDemos = demos.filter(demo => demo.location.toLowerCase() === key);
    const demoIds = new Set(typeDemos.map(d => d.id));
    
    // Find sales associated with these demos
    const relatedSales = customers.flatMap(c => 
      c.revenue.sales.filter(s => demoIds.has(s.demoId))
    );
    
    const typeRevenue = relatedSales.reduce((sum, sale) => sum + sale.amount, 0);
    const typeConversion = typeDemos.length > 0
      ? Math.round((relatedSales.length / typeDemos.length) * 100)
      : 0;

    return {
      ...type,
      demoCount: typeDemos.length,
      avgAttendees: Math.round(typeDemos.reduce((acc, demo) => acc + demo.attendees, 0) / typeDemos.length || 0),
      conversion: typeConversion,
      revenue: typeRevenue
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{metric.icon}</div>
              <span className={`text-sm font-medium ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Monthly Demo Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Virtual" stackId="a" fill="#4f46e5" />
                <Bar dataKey="Nexus" stackId="a" fill="#10b981" />
                <Bar dataKey="On-site" stackId="a" fill="#f59e0b" />
                <Bar dataKey="On-location" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Demo Type Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demoTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demoTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {demoTypeData.map((type, index) => (
              <div key={type.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-gray-600">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Demo Type Performance</h3>
          <div className="space-y-6">
            {demoPerformance.map((type, index) => {
              const percentage = (type.demoCount / totalDemos) * 100 || 0;
              
              return (
                <div key={type.name} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{type.name}</h4>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                    <span className="text-sm font-medium" style={{ color: COLORS[index] }}>
                      {type.demoCount} demos
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Duration: {type.duration}</span>
                      <span>Capacity: {type.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Conversion: {type.conversion}%</span>
                      <span>Revenue: ${(type.revenue / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${percentage}%`, backgroundColor: COLORS[index] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-700">Virtual Demos</h4>
              <p className="text-sm text-indigo-600 mt-1">
                Highest engagement rate with 85% attendance and optimal cost efficiency
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-medium text-emerald-700">Nexus Events</h4>
              <p className="text-sm text-emerald-600 mt-1">
                Regional hubs showing 25% increase in attendance, strong networking value
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-700">On-site Fridays</h4>
              <p className="text-sm text-amber-600 mt-1">
                Consistent weekly performance with 90% slot utilization
              </p>
            </div>
            <div className="p-4 bg-rose-50 rounded-lg">
              <h4 className="font-medium text-rose-700">On-location Premium</h4>
              <p className="text-sm text-rose-600 mt-1">
                Highest conversion rate at 75% with excellent customer satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}