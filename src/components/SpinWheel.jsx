import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const WHEEL_COLORS = [
  { bg: '#1e293b', text: '#f8fafc' },
  { bg: '#334155', text: '#f8fafc' },
  { bg: '#1e293b', text: '#f97316' },
  { bg: '#334155', text: '#f8fafc' },
  { bg: '#1e293b', text: '#f8fafc' },
  { bg: '#334155', text: '#f97316' },
]

function polarToCartesian(cx, cy, radius, angle) {
  const rad = (angle - 90) * Math.PI / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  }
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

export default function SpinWheel({ menus, onSpinComplete, disabled }) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  const segmentAngle = menus.length > 0 ? 360 / menus.length : 360

  const spin = () => {
    if (isSpinning || disabled || menus.length === 0) return

    setIsSpinning(true)
    const spinRotations = 5 + Math.random() * 3
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + spinRotations * 360 + randomAngle

    setRotation(totalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      const normalizedRotation = totalRotation % 360
      const pointerAngle = 0
      const effectiveAngle = (pointerAngle - normalizedRotation + 360) % 360
      const selectedIndex = Math.floor(effectiveAngle / segmentAngle) % Math.max(menus.length, 1)
      const selectedMenu = menus[selectedIndex]
      if (selectedMenu) {
        onSpinComplete(selectedMenu)
      }
    }, 5000)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <div className="w-5 h-8 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
        </div>

        <div
          className={cn(
            "w-72 h-72 md:w-80 md:h-80 rounded-full relative",
            "particle-shadow",
            disabled && "opacity-50"
          )}
        >
          <div className="absolute inset-0 rounded-full bg-slate-900 overflow-hidden">
            <motion.div
              className="absolute inset-2 rounded-full overflow-hidden"
              animate={{ rotate: rotation }}
              transition={{ duration: 5, ease: [0.17, 0.67, 0.12, 0.99] }}
            >
              {menus.length > 0 ? (
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <clipPath id="wheelClip">
                      <circle cx="50" cy="50" r="48" />
                    </clipPath>
                  </defs>

                  <g clipPath="url(#wheelClip)">
                    {menus.map((menu, i) => {
                      const start = segmentAngle * i
                      const end = segmentAngle * (i + 1)
                      const mid = (start + end) / 2
                      const seg = WHEEL_COLORS[i % WHEEL_COLORS.length]
                      const labelPos = polarToCartesian(50, 50, 32, mid)

                      return (
                        <g key={menu.id}>
                          <path
                            d={describeArc(50, 50, 48, start, end)}
                            fill={seg.bg}
                          />
                          <text
                            x={labelPos.x}
                            y={labelPos.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={seg.text}
                            fontSize="3"
                            fontWeight="500"
                            fontFamily="Inter, sans-serif"
                            transform={`rotate(${-rotation}, ${labelPos.x}, ${labelPos.y})`}
                          >
                            {menu.name.length > 12 ? menu.name.slice(0, 12) + '..' : menu.name}
                          </text>
                        </g>
                      )
                    })}
                  </g>

                  <circle cx="50" cy="50" r="6" fill="#f97316" />
                  <circle cx="50" cy="50" r="3" fill="#0a0f1a" />
                </svg>
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Add menus to spin</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={spin}
        disabled={disabled || isSpinning || menus.length === 0}
        className={cn(
          "mt-8 px-10 py-3.5 bg-orange-500 text-white font-semibold rounded-full",
          "particle-shadow-hover",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "transition-all duration-200",
          isSpinning ? "glow-pulse" : ""
        )}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
            Spinning...
          </span>
        ) : (
          'SPIN!'
        )}
      </motion.button>

      {menus.length === 0 && !disabled && (
        <p className="text-slate-500 mt-3 text-sm">Add menus to get started</p>
      )}
    </div>
  )
}