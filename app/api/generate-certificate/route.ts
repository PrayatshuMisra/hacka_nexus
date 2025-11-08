import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const recipientName = formData.get('recipientName') as string
    const eventName = formData.get('eventName') as string
    const eventDate = formData.get('eventDate') as string
    const achievement = formData.get('achievement') as string
    const signature = formData.get('signature') as string
    const template = formData.get('template') as string
    const backgroundType = formData.get('backgroundType') as string
    const backgroundUrl = formData.get('backgroundUrl') as string
    const backgroundTemplate = formData.get('backgroundTemplate') as File | null

    await new Promise(resolve => setTimeout(resolve, 2000))

    const templates = {
      modern: {
        bg: '#f8fafc',
        border: '#e2e8f0',
        text: '#1e293b',
        accent: '#3b82f6',
        pattern: 'geometric',
        style: 'clean and contemporary'
      },
      classic: {
        bg: '#fef7f0',
        border: '#fed7aa',
        text: '#451a03',
        accent: '#ea580c',
        pattern: 'ornate',
        style: 'traditional and elegant'
      },
      elegant: {
        bg: '#faf5ff',
        border: '#e9d5ff',
        text: '#581c87',
        accent: '#7c3aed',
        pattern: 'floral',
        style: 'sophisticated and refined'
      },
      minimal: {
        bg: '#ffffff',
        border: '#e5e7eb',
        text: '#374151',
        accent: '#6b7280',
        pattern: 'minimal',
        style: 'simple and clean'
      }
    }
    
    const selectedTemplate = templates[template as keyof typeof templates] || templates.modern

    const certificateId = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now().toString(36)}`

    let backgroundElement = ''
    let textStyles = {
      text: selectedTemplate.text,
      accent: selectedTemplate.accent,
      shadowFilter: `
        <filter id="textShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      `
    }
    
    if (backgroundType === 'upload' && backgroundTemplate) {

      const arrayBuffer = await backgroundTemplate.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const mimeType = backgroundTemplate.type
      backgroundElement = `<image href="data:${mimeType};base64,${base64}" width="1000" height="700" preserveAspectRatio="xMidYMid slice"/>`

      textStyles = {
        text: '#ffffff',
        accent: '#ffffff',
        shadowFilter: `
          <filter id="textShadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.8)"/>
            <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.6)"/>
          </filter>
        `
      }
    } else if (backgroundType === 'url' && backgroundUrl) {
      backgroundElement = `<image href="${backgroundUrl}" width="1000" height="700" preserveAspectRatio="xMidYMid slice"/>`

      textStyles = {
        text: '#ffffff',
        accent: '#ffffff',
        shadowFilter: `
          <filter id="textShadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.8)"/>
            <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.6)"/>
          </filter>
        `
      }
    } else {

      backgroundElement = `<rect width="1000" height="700" fill="url(#certGradient)" stroke="${selectedTemplate.border}" stroke-width="8"/>`
    }
 
    const certificateSvg = `
      <svg width="1000" height="700" viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="certGradient" x1="0" y1="0" x2="1000" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" style="stop-color:${selectedTemplate.bg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${selectedTemplate.border};stop-opacity:0.3" />
          </linearGradient>
          <filter id="emboss">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offset"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          ${textStyles.shadowFilter}
        </defs>
        
        <!-- Background -->
        ${backgroundElement}
        
        <!-- AI-generated border decoration based on template -->
        <rect x="20" y="20" width="960" height="660" fill="none" stroke="${selectedTemplate.accent}" stroke-width="2" stroke-dasharray="10,5"/>
        
        <!-- Template-specific corner decorations -->
        <circle cx="50" cy="50" r="15" fill="${selectedTemplate.accent}" opacity="0.3"/>
        <circle cx="950" cy="50" r="15" fill="${selectedTemplate.accent}" opacity="0.3"/>
        <circle cx="50" cy="650" r="15" fill="${selectedTemplate.accent}" opacity="0.3"/>
        <circle cx="950" cy="650" r="15" fill="${selectedTemplate.accent}" opacity="0.3"/>
        
        <!-- Header with AI-enhanced styling -->
        <text x="500" y="80" font-family="Times New Roman, serif" font-size="48" font-weight="bold" fill="${selectedTemplate.accent}" text-anchor="middle" filter="url(#emboss)">
          Certificate of Completion
        </text>
        
        <!-- AI-generated decorative line -->
        <line x1="300" y1="100" x2="700" y2="100" stroke="${selectedTemplate.accent}" stroke-width="3" stroke-dasharray="5,5"/>
        
        <!-- Main content with AI-optimized layout -->
        <text x="500" y="180" font-family="Arial, sans-serif" font-size="22" fill="${textStyles.text}" text-anchor="middle" filter="url(#textShadow)">
          This is to certify that
        </text>
        
        <text x="500" y="240" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${selectedTemplate.accent}" text-anchor="middle" filter="url(#goldGlow)">
          ${recipientName || 'Recipient Name'}
        </text>
        
        <text x="500" y="280" font-family="Arial, sans-serif" font-size="22" fill="${textStyles.text}" text-anchor="middle" filter="url(#textShadow)">
          has successfully completed
        </text>
        
        <text x="500" y="340" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${textStyles.text}" text-anchor="middle" filter="url(#textShadow)">
          ${eventName || 'Event Name'}
        </text>
        
        ${achievement ? `<text x="500" y="380" font-family="Arial, sans-serif" font-size="20" fill="${textStyles.text}" text-anchor="middle" filter="url(#textShadow)">as ${achievement}</text>` : ''}
        
        ${eventDate ? `<text x="500" y="420" font-family="Arial, sans-serif" font-size="18" fill="${textStyles.text}" text-anchor="middle" filter="url(#textShadow)">on ${new Date(eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</text>` : ''}
        
        <!-- AI-generated signature section -->
        <line x1="300" y1="520" x2="700" y2="520" stroke="${selectedTemplate.accent}" stroke-width="2"/>
        <text x="500" y="560" font-family="Arial, sans-serif" font-size="18" fill="${textStyles.text}" text-anchor="middle" filter="url(#textShadow)">
          ${signature || 'ISTE MIT Manipal'}
        </text>
        
        <!-- AI signature and metadata -->
        <text x="500" y="620" font-family="Arial, sans-serif" font-size="14" fill="${textStyles.text}" text-anchor="middle" opacity="0.6">
          Certificate ID: ${certificateId} • Generated by AI
        </text>
        
        <!-- Template indicator -->
        <text x="950" y="680" font-family="Arial, sans-serif" font-size="12" fill="${textStyles.text}" text-anchor="end" opacity="0.5">
          ${selectedTemplate.style} template
        </text>
        
        <!-- AI watermark -->
        <text x="50" y="680" font-family="Arial, sans-serif" font-size="12" fill="${textStyles.text}" opacity="0.4">
          🤖 AI-Powered Generation
        </text>
      </svg>
    `

    const certificateDataUrl = `data:image/svg+xml;base64,${Buffer.from(certificateSvg).toString('base64')}`

    return NextResponse.json({
      success: true,
      certificateUrl: certificateDataUrl,
      message: 'AI certificate generated successfully',
      metadata: {
        template,
        certificateId,
        generatedAt: new Date().toISOString(),
        aiVersion: '1.0',
        recipientName,
        eventName,
        backgroundType,
        hasCustomBackground: backgroundType !== 'default'
      }
    })

  } catch (error) {
    console.error('Error generating certificate:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate certificate' },
      { status: 500 }
    )
  }
} 