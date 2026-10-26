import React, { useEffect, useState, useRef } from 'react'
import { formatINR } from '../../utils/currency'

/**
 * Animated number counter with smooth easing and INR formatting
 */
export const AnimatedNumber = ({
  value,
  duration = 600,
  isCurrency = true,
  className = ''
}) => {
  const numericTarget = Number(value) || 0
  const [displayValue, setDisplayValue] = useState(numericTarget)
  const prevValueRef = useRef(numericTarget)

  useEffect(() => {
    const startVal = prevValueRef.current
    const endVal = numericTarget
    if (startVal === endVal) return

    let startTime = null
    let animationFrameId = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Ease out cubic: 1 - pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = startVal + (endVal - startVal) * easeProgress

      setDisplayValue(current)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setDisplayValue(endVal)
        prevValueRef.current = endVal
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [numericTarget, duration])

  return (
    <span className={`inline-block transition-all duration-300 font-mono tracking-tight ${className}`}>
      {isCurrency ? formatINR(Math.round(displayValue)) : Math.round(displayValue).toLocaleString('en-IN')}
    </span>
  )
}
