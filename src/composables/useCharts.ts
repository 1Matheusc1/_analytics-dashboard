import { ref, nextTick, type Ref } from 'vue'
import type { ChartType } from '@/types'

export const useCharts = () => {
  const drawLineChart = (
    canvas: HTMLCanvasElement,
    data: number[],
    labels: string[],
    options: {
      color?: string
      backgroundColor?: string
      gridColor?: string
      pointRadius?: number
      lineWidth?: number
    } = {},
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const {
      color = '#3b82f6',
      backgroundColor = 'rgba(59, 130, 246, 0.1)',
      gridColor = '#e2e8f0',
      pointRadius = 4,
      lineWidth = 3,
    } = options

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = 300 * 2
    ctx.scale(2, 2)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, 300)

    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue || 1
    const padding = 40
    const chartWidth = canvas.offsetWidth - padding * 2
    const chartHeight = 300 - padding * 2

    // Draw grid lines
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
    gradient.addColorStop(0, backgroundColor)
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')

    // Draw filled area
    ctx.beginPath()
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, padding + chartHeight)
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.lineTo(padding + chartWidth, padding + chartHeight)
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()

    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw data points
    ctx.fillStyle = color
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, pointRadius, 0, 2 * Math.PI)
      ctx.fill()

      // White center
      ctx.beginPath()
      ctx.arc(x, y, pointRadius - 1, 0, 2 * Math.PI)
      ctx.fillStyle = 'white'
      ctx.fill()
      ctx.fillStyle = color
    })

    // Draw labels
    ctx.fillStyle = '#64748b'
    ctx.font = '12px Inter'
    ctx.textAlign = 'center'
    labels.forEach((label, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      ctx.fillText(label, x, 300 - 10)
    })
  }

  const drawBarChart = (
    canvas: HTMLCanvasElement,
    data: number[],
    labels: string[],
    options: {
      color?: string
      gradient?: boolean
      barSpacing?: number
    } = {},
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { color = '#3b82f6', gradient = true, barSpacing = 0.6 } = options

    canvas.width = canvas.offsetWidth * 2
    canvas.height = 300 * 2
    ctx.scale(2, 2)

    ctx.clearRect(0, 0, canvas.offsetWidth, 300)

    const maxValue = Math.max(...data)
    const padding = 40
    const chartWidth = canvas.offsetWidth - padding * 2
    const chartHeight = 300 - padding * 2
    const barWidth = (chartWidth / data.length) * barSpacing

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight
      const x =
        padding + (chartWidth / data.length) * index + (chartWidth / data.length - barWidth) / 2
      const y = padding + chartHeight - barHeight

      if (gradient) {
        const barGradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
        barGradient.addColorStop(0, color)
        barGradient.addColorStop(1, color + '80')
        ctx.fillStyle = barGradient
      } else {
        ctx.fillStyle = color
      }

      // Rounded top corners
      const radius = 4
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + barWidth - radius, y)
      ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius)
      ctx.lineTo(x + barWidth, y + barHeight)
      ctx.lineTo(x, y + barHeight)
      ctx.lineTo(x, y + radius)
      ctx.arcTo(x, y, x + radius, y, radius)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = '#64748b'
    ctx.font = '11px Inter'
    ctx.textAlign = 'center'
    labels.forEach((label, index) => {
      const x = padding + (chartWidth / data.length) * index + chartWidth / data.length / 2
      ctx.fillText(label, x, 300 - 10)
    })
  }

  const drawPieChart = (
    canvas: HTMLCanvasElement,
    data: number[],
    labels: string[],
    colors: string[],
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = 300 * 2
    ctx.scale(2, 2)

    ctx.clearRect(0, 0, canvas.offsetWidth, 300)

    const centerX = canvas.offsetWidth / 2
    const centerY = 300 / 2
    const radius = 80
    const total = data.reduce((sum, value) => sum + value, 0)

    let currentAngle = -Math.PI / 2

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = colors[index] || '#3b82f6'
      ctx.fill()

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius + 30)
      const labelY = centerY + Math.sin(labelAngle) * (radius + 30)

      ctx.fillStyle = '#374151'
      ctx.font = '12px Inter'
      ctx.textAlign = 'center'
      ctx.fillText(`${labels[index]} (${value}%)`, labelX, labelY)

      currentAngle += sliceAngle
    })
  }

  const createChart = (
    canvasRef: Ref<HTMLCanvasElement | null>,
    type: ChartType,
    data: number[],
    labels: string[],
    options: any = {},
  ) => {
    nextTick(() => {
      if (!canvasRef.value) return

      switch (type) {
        case 'line':
          drawLineChart(canvasRef.value, data, labels, options)
          break
        case 'bar':
          drawBarChart(canvasRef.value, data, labels, options)
          break
        case 'pie':
        case 'doughnut':
          drawPieChart(canvasRef.value, data, labels, options.colors || [])
          break
      }
    })
  }

  return {
    drawLineChart,
    drawBarChart,
    drawPieChart,
    createChart,
  }
}
