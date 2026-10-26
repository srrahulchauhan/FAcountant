import React, { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts'
import { formatINR } from '../../utils/currency'
import { BarChart3, TrendingUp } from 'lucide-react'

export const IncomeExpenseChart = ({ data = [] }) => {
  const [chartType, setChartType] = useState('bar') // 'bar' | 'area'

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl text-xs space-y-1.5">
        <p className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1">
          {label}
        </p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-400 capitalize">{item.name}:</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              {formatINR(item.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
            Income vs Expenses Trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            6-Month Consolidated Cashflow & Net Savings
          </p>
        </div>

        {/* Toggle between Bar & Area */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'bar'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Comparison
          </button>
          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'area'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Trend Area
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No transaction data available for chart
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1', opacity: 0.3 }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} animationDuration={800} />
                <Bar dataKey="expenses" name="Expenses" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} animationDuration={800} />
              </BarChart>
            ) : (
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1', opacity: 0.3 }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" animationDuration={800} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#expenseGrad)" animationDuration={800} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
