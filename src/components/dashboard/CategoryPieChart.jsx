import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { formatINR } from '../../utils/currency'

export const CategoryPieChart = ({ data = [] }) => {
  const chartData = data.slice(0, 6) // Top 6 categories
  const otherTotal = data.slice(6).reduce((acc, curr) => acc + curr.amount, 0)
  if (otherTotal > 0) {
    chartData.push({
      name: 'Other Categories',
      amount: otherTotal,
      color: '#94a3b8',
      percentage: ((otherTotal / data.reduce((a, b) => a + b.amount, 0)) * 100).toFixed(1)
    })
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null
    const item = payload[0].payload

    return (
      <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg text-xs space-y-1">
        <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}
        </p>
        <p className="font-semibold text-slate-900 dark:text-white font-mono">
          {formatINR(item.amount)} ({item.percentage}%)
        </p>
      </div>
    )
  }

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
          Category Spending
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Distribution across spending categories
        </p>
      </div>

      <div className="h-56 w-full my-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No category expenses recorded yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        {chartData.slice(0, 4).map((cat) => (
          <div key={cat.name} className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-slate-600 dark:text-slate-400 truncate">{cat.name}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white shrink-0 font-mono">
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
