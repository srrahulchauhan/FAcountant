import React from 'react'
import { AnimatedNumber } from '../common/AnimatedNumber'
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

export const SummaryCard = ({
  title,
  amount,
  count = null,
  subtitle,
  icon: Icon,
  variant = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan' | 'blue'
  trend = null, // e.g. '+12%'
  isPositiveTrend = true,
  onClick = null,
  isCurrency = true,
  badge = null,
  showPulse = false
}) => {
  const VARIANT_CONFIG = {
    indigo: {
      gradientBorder: 'from-indigo-500/30 via-indigo-400/10 to-transparent',
      hoverGlow: 'hover:shadow-indigo-500/15 hover:border-indigo-500/40',
      iconBg: 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-indigo-500/25',
      accentText: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/50',
      dotColor: 'bg-indigo-500',
      topBar: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600'
    },
    emerald: {
      gradientBorder: 'from-emerald-500/30 via-emerald-400/10 to-transparent',
      hoverGlow: 'hover:shadow-emerald-500/15 hover:border-emerald-500/40',
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/25',
      accentText: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/50',
      dotColor: 'bg-emerald-500',
      topBar: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600'
    },
    amber: {
      gradientBorder: 'from-amber-500/30 via-amber-400/10 to-transparent',
      hoverGlow: 'hover:shadow-amber-500/15 hover:border-amber-500/40',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-amber-500/25',
      accentText: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/50',
      dotColor: 'bg-amber-500',
      topBar: 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600'
    },
    rose: {
      gradientBorder: 'from-rose-500/30 via-rose-400/10 to-transparent',
      hoverGlow: 'hover:shadow-rose-500/15 hover:border-rose-500/40',
      iconBg: 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-rose-500/25',
      accentText: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/50',
      dotColor: 'bg-rose-500',
      topBar: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600'
    },
    purple: {
      gradientBorder: 'from-purple-500/30 via-purple-400/10 to-transparent',
      hoverGlow: 'hover:shadow-purple-500/15 hover:border-purple-500/40',
      iconBg: 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-purple-500/25',
      accentText: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/50',
      dotColor: 'bg-purple-500',
      topBar: 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600'
    },
    cyan: {
      gradientBorder: 'from-cyan-500/30 via-cyan-400/10 to-transparent',
      hoverGlow: 'hover:shadow-cyan-500/15 hover:border-cyan-500/40',
      iconBg: 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-cyan-500/25',
      accentText: 'text-cyan-600 dark:text-cyan-400',
      badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/50',
      dotColor: 'bg-cyan-500',
      topBar: 'bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-600'
    },
    blue: {
      gradientBorder: 'from-blue-500/30 via-blue-400/10 to-transparent',
      hoverGlow: 'hover:shadow-blue-500/15 hover:border-blue-500/40',
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/25',
      accentText: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/50',
      dotColor: 'bg-blue-500',
      topBar: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600'
    }
  }

  const conf = VARIANT_CONFIG[variant] || VARIANT_CONFIG.indigo

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${conf.hoverGlow} ${
        onClick ? 'cursor-pointer active:scale-[0.98] select-none hover:border-indigo-500/50 dark:hover:border-indigo-500/50' : ''
      }`}
    >
      {/* Top Hairline Gradient Accent */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${conf.topBar} opacity-85 group-hover:h-[4px] transition-all`} />

      {/* Clickable Quick Action Indicator */}
      {onClick && (
        <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 z-20">
          <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 flex items-center shadow-xs">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      )}

      {/* Shimmer Light Bar Sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
        {/* Title & Icon Header */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              {showPulse && (
                <span className="relative flex h-2 w-2">
                  <span className={`animate-radar absolute inline-flex h-full w-full rounded-full ${conf.dotColor} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${conf.dotColor}`} />
                </span>
              )}
              <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                {title}
              </p>
            </div>

            {/* Amount with Live Animated Number */}
            <div className="flex items-baseline flex-wrap gap-2">
              <h3 className={`text-xl sm:text-2xl 2xl:text-[1.65rem] font-black font-heading tracking-tight ${conf.accentText}`}>
                <AnimatedNumber value={amount} isCurrency={isCurrency} />
              </h3>

              {count !== null && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>

          {/* Floating Glowing Icon */}
          {Icon && (
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${conf.iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Footer info: Subtitle or Trend Pill */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
            {subtitle || 'Real-time computed'}
          </p>

          {trend && (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
              isPositiveTrend
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
            }`}>
              {isPositiveTrend ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </span>
          )}

          {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${conf.badgeBg}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
