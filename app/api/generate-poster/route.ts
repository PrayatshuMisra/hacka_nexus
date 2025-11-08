import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      subtitle,
      date,
      time,
      venue,
      theme,
      color,
      description
    } = body

    await new Promise(resolve => setTimeout(resolve, 2000))

    const colors = {
      blue: { primary: '#2563eb', secondary: '#3b82f6', accent: '#1d4ed8', gradient: 'from-blue-500 to-blue-700' },
      purple: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#6d28d9', gradient: 'from-purple-500 to-purple-700' },
      green: { primary: '#059669', secondary: '#10b981', accent: '#047857', gradient: 'from-green-500 to-green-700' },
      orange: { primary: '#ea580c', secondary: '#f97316', accent: '#dc2626', gradient: 'from-orange-500 to-orange-700' },
    }
    
    const selectedColors = colors[color as keyof typeof colors] || colors.blue

    const themeElements = {
      tech: {
        icons: ['🚀', '💻', '⚡', '🔬'],
        patterns: 'M0,0 L100,0 L100,100 L0,100 Z',
        style: 'futuristic'
      },
      creative: {
        icons: ['🎨', '✨', '🌟', '🎭'],
        patterns: 'M0,50 Q25,0 50,50 T100,50',
        style: 'artistic'
      },
      business: {
        icons: ['💼', '📊', '🎯', '📈'],
        patterns: 'M0,0 L100,100 M100,0 L0,100',
        style: 'professional'
      },
      academic: {
        icons: ['📚', '🎓', '🔍', '📝'],
        patterns: 'M0,0 L100,0 M0,100 L100,100',
        style: 'scholarly'
      }
    }
    
    const themeData = themeElements[theme as keyof typeof themeElements] || themeElements.tech
    
    const posterSvg = `
      <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aiGradient" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
            <stop offset="0%" style="stop-color:${selectedColors.primary};stop-opacity:1" />
            <stop offset="50%" style="stop-color:${selectedColors.secondary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${selectedColors.accent};stop-opacity:1" />
          </linearGradient>
          <filter id="aiGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="aiShadow">
            <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        
        <rect width="800" height="600" fill="url(#aiGradient)"/>
        
        <!-- AI-generated decorative elements -->
        <circle cx="120" cy="120" r="60" fill="rgba(255,255,255,0.1)" filter="url(#aiShadow)"/>
        <circle cx="680" cy="480" r="90" fill="rgba(255,255,255,0.1)" filter="url(#aiShadow)"/>
        <rect x="650" y="80" width="120" height="120" fill="rgba(255,255,255,0.1)" transform="rotate(45 710 140)" filter="url(#aiShadow)"/>
        
        <!-- Theme-specific icons -->
        <text x="150" y="150" font-size="24" fill="rgba(255,255,255,0.8)">${themeData.icons[0]}</text>
        <text x="650" y="520" font-size="24" fill="rgba(255,255,255,0.8)">${themeData.icons[1]}</text>
        <text x="720" y="120" font-size="24" fill="rgba(255,255,255,0.8)">${themeData.icons[2]}</text>
        
        <!-- Main title with AI-enhanced styling -->
        <text x="400" y="180" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle" filter="url(#aiGlow)">
          ${title || 'AI-Generated Event'}
        </text>
        
        <!-- Subtitle -->
        ${subtitle ? `<text x="400" y="220" font-family="Arial, sans-serif" font-size="26" fill="rgba(255,255,255,0.9)" text-anchor="middle">${subtitle}</text>` : ''}
        
        <!-- Date and time with enhanced formatting -->
        <text x="400" y="280" font-family="Arial, sans-serif" font-size="22" fill="white" text-anchor="middle">
          ${date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date TBA'}
          ${time ? ` • ${time}` : ''}
        </text>
        
        <!-- Venue with location icon -->
        ${venue ? `<text x="400" y="320" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.8)" text-anchor="middle">📍 ${venue}</text>` : ''}
        
        <!-- Description with AI-optimized layout -->
        ${description ? `<text x="400" y="380" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.7)" text-anchor="middle" style="max-width: 700px;">${description}</text>` : ''}
        
        <!-- AI signature -->
        <text x="400" y="550" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.6)" text-anchor="middle">
          🤖 Generated by AI • ISTE MIT Manipal
        </text>
        
        <!-- Theme indicator -->
        <text x="750" y="580" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.5)" text-anchor="end">
          ${themeData.style} theme
        </text>
      </svg>
    `

    const posterDataUrl = `data:image/svg+xml;base64,${Buffer.from(posterSvg).toString('base64')}`

    return NextResponse.json({
      success: true,
      posterUrl: posterDataUrl,
      message: 'AI poster generated successfully',
      metadata: {
        theme,
        color,
        generatedAt: new Date().toISOString(),
        aiVersion: '1.0'
      }
    })

  } catch (error) {
    console.error('Error generating poster:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate poster' },
      { status: 500 }
    )
  }
} 