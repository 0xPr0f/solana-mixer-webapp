'use client'

import type React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'

interface AmountSliderProps {
  value: number
  onChange: (value: number) => void
  steps: { value: number; label: string }[]
}

export function AmountSlider({ value, onChange, steps }: AmountSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const denom = steps.length > 1 ? steps.length - 1 : 1
  const fraction = steps.length > 1 ? activeIndex / denom : 0.5

  useEffect(() => {
    const idx = steps.findIndex((s) => s.value === value)
    if (idx >= 0) setActiveIndex(idx)
  }, [value, steps])

  const handleMarkClick = (idx: number) => {
    setActiveIndex(idx)
    onChange(steps[idx].value)
  }

  const updateValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current || steps.length === 1) return
      const { left, width } = trackRef.current.getBoundingClientRect()
      const pos = (clientX - left) / width

      let closest = 0
      let best = 1
      steps.forEach((_, i) => {
        const stepPos = i / (steps.length - 1)
        const dist = Math.abs(pos - stepPos)
        if (dist < best) {
          best = dist
          closest = i
        }
      })

      setActiveIndex(closest)
      onChange(steps[closest].value)
    },
    [onChange, steps]
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    if (steps.length === 1 || !trackRef.current) return
    setIsDragging(true)
    updateValueFromPosition(e.clientX)

    const onMove = (e: MouseEvent) => {
      if (isDragging) updateValueFromPosition(e.clientX)
    }
    const onUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div className="pt-4 pb-6 px-6">
      <div
        className="amount-slider"
        ref={trackRef}
        onMouseDown={handleMouseDown}
      >
        <div className="amount-slider-track" />
        <div
          className="amount-slider-progress"
          style={{ width: `${fraction * 100}%` }}
        />

        {steps.map((step, i) => {
          const markFrac = steps.length > 1 ? i / (steps.length - 1) : 0.5
          return (
            <div
              key={i}
              className={`amount-slider-mark ${
                i <= activeIndex
                  ? 'amount-slider-mark-active'
                  : 'amount-slider-mark-inactive'
              }`}
              style={{ left: `${markFrac * 100}%` }}
              onClick={() => handleMarkClick(i)}
            >
              <span
                className="amount-slider-label flex flex-wrap whitespace-nowrap"
                style={{ left: '50%' }}
              >
                {step.label}
              </span>
            </div>
          )
        })}

        <div
          className="amount-slider-thumb"
          style={{ left: `${fraction * 100}%` }}
        />
      </div>
    </div>
  )
}
