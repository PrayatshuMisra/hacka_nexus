"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  ImageIcon,
  Video,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  Download,
  Palette,
  FileText,
  Award,
  Sparkles,
  Loader2,
  FileDown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const generateAIPoster = async (posterData: any) => {
  try {

    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log('Development mode detected, using fallback generation')
      return generateFallbackPoster(posterData)
    }

    const response = await fetch('/api/generate-poster', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: posterData.title,
        subtitle: posterData.subtitle,
        date: posterData.date,
        time: posterData.time,
        venue: posterData.venue,
        theme: posterData.theme,
        color: posterData.color,
        description: posterData.aiDescription || posterData.description, // Use AI description if available
      }),
    })

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.posterUrl
  } catch (error) {
    console.error('Error generating poster:', error)
 
    return generateFallbackPoster(posterData)
  }
}

const generateAICertificate = async (certificateData: any) => {
  try {

    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log('Development mode detected, using fallback generation')
      return await generateFallbackCertificate(certificateData)
    }

    const formData = new FormData()
    formData.append('recipientName', certificateData.recipientName)
    formData.append('eventName', certificateData.eventName)
    formData.append('eventDate', certificateData.eventDate || '')
    formData.append('achievement', certificateData.achievement || '')
    formData.append('signature', certificateData.signature)
    formData.append('template', certificateData.template)
    formData.append('backgroundType', certificateData.backgroundType)

    if (certificateData.backgroundTemplate) {
      formData.append('backgroundTemplate', certificateData.backgroundTemplate)
    }

    const response = await fetch('/api/generate-certificate', {
      method: 'POST',
      body: formData, 
    })

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.certificateUrl
  } catch (error) {
    console.error('Error generating certificate:', error)

    return await generateFallbackCertificate(certificateData)
  }
}

const generateFallbackPoster = (data: any) => {
  const colors = {
    blue: { 
      primary: '#3b82f6', 
      secondary: '#60a5fa', 
      accent: '#93c5fd',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)',
      text: '#1e40af',
      subtitle: '#1e3a8a'
    },
    green: { 
      primary: '#10b981', 
      secondary: '#34d399', 
      accent: '#6ee7b7',
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
      text: '#065f46',
      subtitle: '#064e3b'
    },
    teal: { 
      primary: '#14b8a6', 
      secondary: '#2dd4bf', 
      accent: '#5eead4',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 50%, #5eead4 100%)',
      text: '#0f766e',
      subtitle: '#134e4a'
    },
    sky: { 
      primary: '#0ea5e9', 
      secondary: '#38bdf8', 
      accent: '#7dd3fc',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)',
      text: '#0369a1',
      subtitle: '#0c4a6e'
    },
  }
  
  const selectedColors = colors[data.color as keyof typeof colors] || colors.blue

  const geometricPatterns = `
    <!-- Geometric Background Elements -->
    <defs>
      <pattern id="geometricPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="3" fill="${selectedColors.accent}" opacity="0.3"/>
        <rect x="60" y="60" width="8" height="8" fill="${selectedColors.accent}" opacity="0.2" transform="rotate(45 64 64)"/>
        <polygon points="80,20 85,30 75,30" fill="${selectedColors.accent}" opacity="0.4"/>
      </pattern>
      
      <!-- Enhanced Glow Effects -->
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <!-- Enhanced Text Shadow -->
      <filter id="textShadow">
        <feDropShadow dx="3" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.6)"/>
        <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
      </filter>
      
      <!-- Poster Text Effect -->
      <filter id="posterText">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.7)"/>
        <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.5)"/>
        <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <!-- Gradient Background -->
      <linearGradient id="posterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${selectedColors.primary};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${selectedColors.secondary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${selectedColors.accent};stop-opacity:1" />
      </linearGradient>
    </defs>
  `

  const themeElements = {
    tech: `
      <!-- Tech-themed decorative elements -->
      <circle cx="150" cy="150" r="60" fill="none" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.3"/>
      <circle cx="150" cy="150" r="40" fill="none" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.5"/>
      <circle cx="150" cy="150" r="20" fill="${selectedColors.accent}" opacity="0.4"/>
      
      <rect x="650" y="450" width="80" height="80" fill="none" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.3" transform="rotate(45 690 490)"/>
      <rect x="670" y="470" width="40" height="40" fill="none" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.5" transform="rotate(45 690 490)"/>
      
      <!-- Circuit-like lines -->
      <path d="M 100 300 L 200 300 L 200 350 L 300 350" stroke="${selectedColors.accent}" stroke-width="2" fill="none" opacity="0.4"/>
      <path d="M 600 200 L 500 200 L 500 250 L 400 250" stroke="${selectedColors.accent}" stroke-width="2" fill="none" opacity="0.4"/>
    `,
    creative: `
      <!-- Creative-themed decorative elements -->
      <path d="M 100 100 Q 150 50 200 100 T 300 100" stroke="${selectedColors.accent}" stroke-width="3" fill="none" opacity="0.4"/>
      <path d="M 600 500 Q 650 450 700 500 T 800 500" stroke="${selectedColors.accent}" stroke-width="3" fill="none" opacity="0.4"/>
      
      <circle cx="200" cy="400" r="30" fill="${selectedColors.accent}" opacity="0.3"/>
      <circle cx="600" cy="200" r="25" fill="${selectedColors.accent}" opacity="0.3"/>
      <circle cx="700" cy="350" r="20" fill="${selectedColors.accent}" opacity="0.3"/>
      
      <!-- Paint splashes -->
      <ellipse cx="150" cy="300" rx="40" ry="25" fill="${selectedColors.accent}" opacity="0.2" transform="rotate(30 150 300)"/>
      <ellipse cx="650" cy="150" rx="35" ry="20" fill="${selectedColors.accent}" opacity="0.2" transform="rotate(-20 650 150)"/>
    `,
    business: `
      <!-- Business-themed decorative elements -->
      <rect x="120" y="120" width="60" height="40" fill="none" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.4"/>
      <rect x="620" y="440" width="60" height="40" fill="none" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.4"/>
      
      <!-- Growth charts -->
      <path d="M 100 400 L 150 350 L 200 380 L 250 320 L 300 340" stroke="${selectedColors.accent}" stroke-width="3" fill="none" opacity="0.4"/>
      <path d="M 500 200 L 550 150 L 600 180 L 650 120 L 700 140" stroke="${selectedColors.accent}" stroke-width="3" fill="none" opacity="0.4"/>
      
      <!-- Professional dots -->
      <circle cx="180" cy="180" r="4" fill="${selectedColors.accent}" opacity="0.6"/>
      <circle cx="620" cy="180" r="4" fill="${selectedColors.accent}" opacity="0.6"/>
      <circle cx="180" cy="420" r="4" fill="${selectedColors.accent}" opacity="0.6"/>
      <circle cx="620" cy="420" r="4" fill="${selectedColors.accent}" opacity="0.6"/>
    `,
    academic: `
      <!-- Academic-themed decorative elements -->
      <rect x="100" y="100" width="80" height="100" fill="none" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.3"/>
      <rect x="620" y="400" width="80" height="100" fill="none" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.3"/>
      
      <!-- Graduation cap -->
      <path d="M 200 200 L 240 200 L 240 220 L 200 220 Z" fill="${selectedColors.accent}" opacity="0.4"/>
      <path d="M 200 200 L 220 180 L 240 200" fill="${selectedColors.accent}" opacity="0.4"/>
      
      <!-- Academic lines -->
      <line x1="150" y1="350" x2="250" y2="350" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.4"/>
      <line x1="150" y1="370" x2="230" y2="370" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.4"/>
      <line x1="150" y1="390" x2="210" y2="390" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.4"/>
      
      <line x1="550" y1="150" x2="650" y2="150" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.4"/>
      <line x1="570" y1="170" x2="650" y2="170" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.4"/>
      <line x1="590" y1="190" x2="650" y2="190" stroke="${selectedColors.accent}" stroke-width="2" opacity="0.4"/>
    `
  }
  
  const selectedThemeElements = themeElements[data.theme as keyof typeof themeElements] || themeElements.tech
  
  const svgString = `
    <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${geometricPatterns}
      
      <!-- Main Background -->
      <rect width="800" height="600" fill="url(#posterGradient)"/>
      
      <!-- Pattern Overlay -->
      <rect width="800" height="600" fill="url(#geometricPattern)" opacity="0.15"/>
      
      <!-- Additional Background Elements for Full Coverage -->
      <circle cx="50" cy="50" r="30" fill="${selectedColors.accent}" opacity="0.1"/>
      <circle cx="750" cy="50" r="25" fill="${selectedColors.accent}" opacity="0.1"/>
      <circle cx="50" cy="550" r="35" fill="${selectedColors.accent}" opacity="0.1"/>
      <circle cx="750" cy="550" r="40" fill="${selectedColors.accent}" opacity="0.1"/>
      
      <!-- Floating Elements -->
      <circle cx="200" cy="80" r="8" fill="${selectedColors.accent}" opacity="0.3"/>
      <circle cx="600" cy="120" r="6" fill="${selectedColors.accent}" opacity="0.3"/>
      <circle cx="180" cy="520" r="10" fill="${selectedColors.accent}" opacity="0.3"/>
      <circle cx="620" cy="480" r="7" fill="${selectedColors.accent}" opacity="0.3"/>
      
      <!-- Decorative Elements -->
      ${selectedThemeElements}
      
      <!-- Additional Theme-Specific Background Elements -->
      ${data.theme === 'tech' ? `
        <!-- Tech Background Elements -->
        <path d="M 50 200 L 100 200 L 100 220 L 150 220" stroke="${selectedColors.accent}" stroke-width="1" fill="none" opacity="0.2"/>
        <path d="M 650 180 L 700 180 L 700 200 L 750 200" stroke="${selectedColors.accent}" stroke-width="1" fill="none" opacity="0.2"/>
        <rect x="100" y="400" width="60" height="2" fill="${selectedColors.accent}" opacity="0.2"/>
        <rect x="640" y="400" width="60" height="2" fill="${selectedColors.accent}" opacity="0.2"/>
      ` : ''}
      
      ${data.theme === 'creative' ? `
        <!-- Creative Background Elements -->
        <ellipse cx="120" cy="180" rx="25" ry="15" fill="${selectedColors.accent}" opacity="0.1" transform="rotate(15 120 180)"/>
        <ellipse cx="680" cy="420" rx="30" ry="18" fill="${selectedColors.accent}" opacity="0.1" transform="rotate(-20 680 420)"/>
        <path d="M 80 300 Q 120 280 160 300" stroke="${selectedColors.accent}" stroke-width="2" fill="none" opacity="0.2"/>
        <path d="M 640 300 Q 680 320 720 300" stroke="${selectedColors.accent}" stroke-width="2" fill="none" opacity="0.2"/>
      ` : ''}
      
      ${data.theme === 'business' ? `
        <!-- Business Background Elements -->
        <rect x="80" y="180" width="40" height="25" fill="none" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
        <rect x="680" y="395" width="40" height="25" fill="none" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
        <line x1="100" y1="450" x2="140" y2="450" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
        <line x1="660" y1="150" x2="700" y2="150" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
      ` : ''}
      
      ${data.theme === 'academic' ? `
        <!-- Academic Background Elements -->
        <rect x="90" y="180" width="50" height="60" fill="none" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
        <rect x="660" y="360" width="50" height="60" fill="none" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
        <line x1="100" y1="450" x2="130" y2="450" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
        <line x1="100" y1="470" x2="120" y2="470" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
        <line x1="670" y1="150" x2="700" y2="150" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
        <line x1="680" y1="170" x2="700" y2="170" stroke="${selectedColors.accent}" stroke-width="1" opacity="0.2"/>
      ` : ''}
      
      <!-- Main Title with Enhanced Poster Typography -->
      <!-- White outline for better visibility -->
      <text x="400" y="130" font-family="Arial Black, Helvetica Bold, sans-serif" font-size="56" font-weight="900" fill="white" text-anchor="middle" letter-spacing="3" opacity="0.8">
        ${(data.title || 'EVENT TITLE').toUpperCase()}
      </text>
      
      <!-- Main title text -->
      <text x="400" y="130" font-family="Arial Black, Helvetica Bold, sans-serif" font-size="56" font-weight="900" fill="${selectedColors.text}" text-anchor="middle" filter="url(#posterText)" letter-spacing="3">
        ${(data.title || 'EVENT TITLE').toUpperCase()}
      </text>
      
      <!-- Title Glow Effect -->
      <text x="400" y="130" font-family="Arial Black, Helvetica Bold, sans-serif" font-size="56" font-weight="900" fill="${selectedColors.accent}" text-anchor="middle" filter="url(#glow)" letter-spacing="3" opacity="0.3">
        ${(data.title || 'EVENT TITLE').toUpperCase()}
      </text>
      
      <!-- Subtitle with Poster Style -->
      ${data.subtitle ? `
        <text x="400" y="170" font-family="Georgia, Times New Roman, serif" font-size="24" fill="${selectedColors.subtitle}" text-anchor="middle" font-weight="600" letter-spacing="2" font-style="italic" filter="url(#textShadow)">
          ${data.subtitle.toUpperCase()}
        </text>
      ` : ''}
      
      <!-- Date and Time with Enhanced Layout -->
      <g transform="translate(400, 220)">
        <rect x="-160" y="-20" width="320" height="40" fill="rgba(255,255,255,0.2)" rx="20" stroke="${selectedColors.accent}" stroke-width="2"/>
        <text x="0" y="5" font-family="Arial, sans-serif" font-size="18" fill="${selectedColors.text}" text-anchor="middle" font-weight="700" letter-spacing="1">
          ${data.date ? new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'DATE TBA'}
          ${data.time ? ` • ${data.time.toUpperCase()}` : ''}
        </text>
      </g>
      
      <!-- Venue with Icon -->
      ${data.venue ? `
        <g transform="translate(400, 280)">
          <circle cx="-20" cy="0" r="10" fill="${selectedColors.accent}" opacity="0.9"/>
          <text x="0" y="5" font-family="Arial, sans-serif" font-size="20" fill="${selectedColors.text}" text-anchor="middle" font-weight="700" letter-spacing="1">📍 ${data.venue.toUpperCase()}</text>
        </g>
      ` : ''}
      
      <!-- Description with Multi-line Support -->
      ${(data.description || data.aiDescription) ? `
        <g transform="translate(400, 350)">
          <rect x="-320" y="-50" width="640" height="100" fill="rgba(255,255,255,0.15)" rx="12" stroke="${selectedColors.accent}" stroke-width="1"/>
          <foreignObject x="-300" y="-40" width="600" height="80">
            <div xmlns="http://www.w3.org/1999/xhtml" style="
              font-family: 'Trebuchet MS', Arial, sans-serif; 
              font-size: 13px; 
              color: ${selectedColors.subtitle}; 
              text-align: center; 
              line-height: 1.6; 
              font-weight: 600;
              word-wrap: break-word;
              overflow-wrap: break-word;
              white-space: normal;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              padding: 8px;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            ">
              ${data.description || data.aiDescription}
            </div>
          </foreignObject>
        </g>
      ` : ''}
      
      <!-- Call to Action with Poster Style -->
      <g transform="translate(400, 510)">
        <rect x="-100" y="-25" width="200" height="50" fill="${selectedColors.accent}" rx="25" opacity="0.95" stroke="${selectedColors.text}" stroke-width="2"/>
        <!-- White outline for better visibility -->
        <text x="0" y="5" font-family="Arial Black, Helvetica Bold, sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="900" letter-spacing="2" opacity="0.9">
          REGISTER NOW
        </text>
        <!-- Main button text -->
        <text x="0" y="5" font-family="Arial Black, Helvetica Bold, sans-serif" font-size="18" fill="${selectedColors.text}" text-anchor="middle" font-weight="900" letter-spacing="2" filter="url(#textShadow)">
          REGISTER NOW
        </text>
      </g>
      
      <!-- Footer with Branding -->
      <g transform="translate(400, 570)">
        <line x1="-140" y1="0" x2="140" y2="0" stroke="${selectedColors.accent}" stroke-width="3" opacity="0.7"/>
        <text x="0" y="15" font-family="Arial, sans-serif" font-size="12" fill="${selectedColors.subtitle}" text-anchor="middle" opacity="0.9" font-weight="600" letter-spacing="1">
          POWERED BY AI • ISTE MIT MANIPAL
        </text>
      </g>
      
      <!-- Additional Decorative Corners -->
      <path d="M 0 0 L 60 0 L 60 60 L 0 60 Z" fill="none" stroke="${selectedColors.accent}" stroke-width="3" opacity="0.3"/>
      <path d="M 740 0 L 800 0 L 800 60 L 740 60 Z" fill="none" stroke="${selectedColors.accent}" stroke-width="3" opacity="0.3"/>
      <path d="M 0 540 L 60 540 L 60 600 L 0 600 Z" fill="none" stroke="${selectedColors.accent}" stroke-width="3" opacity="0.3"/>
      <path d="M 740 540 L 800 540 L 800 600 L 740 600 Z" fill="none" stroke="${selectedColors.accent}" stroke-width="3" opacity="0.3"/>
    </svg>
  `

  const encodedSvg = encodeURIComponent(svgString)
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`
}

const generateFallbackCertificate = async (data: any): Promise<string> => {
  const templates = {
    modern: { bg: '#f8fafc', border: '#e2e8f0', text: '#1e293b', accent: '#3b82f6' },
    classic: { bg: '#fef7f0', border: '#fed7aa', text: '#451a03', accent: '#ea580c' },
    elegant: { bg: '#faf5ff', border: '#e9d5ff', text: '#581c87', accent: '#7c3aed' },
    minimal: { bg: '#ffffff', border: '#e5e7eb', text: '#374151', accent: '#6b7280' },
  }
  
  const selectedTemplate = templates[data.template as keyof typeof templates] || templates.modern

  if (data.backgroundType === 'upload' && data.backgroundTemplate) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        const backgroundElement = `<image href="${base64}" width="1000" height="700" preserveAspectRatio="xMidYMid slice"/>`

        const textStyles = getAdaptiveTextStyles('upload', data, selectedTemplate)
        
        const svgString = `
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
              ${textStyles.shadowFilter}
            </defs>
            
            <!-- Background -->
            ${backgroundElement}
            
            <!-- Border decoration -->
            <rect x="20" y="20" width="960" height="660" fill="none" stroke="${textStyles.accent}" stroke-width="2" stroke-dasharray="10,5"/>
            
            <!-- Header -->
            <text x="500" y="80" font-family="Times New Roman, serif" font-size="48" font-weight="bold" fill="${textStyles.accent}" text-anchor="middle" filter="url(#emboss)">
              Certificate of Completion
            </text>
            
            <!-- Main content -->
            <text x="500" y="180" font-family="Arial, sans-serif" font-size="20" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>
              This is to certify that
            </text>
            
            <text x="500" y="240" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${textStyles.accent}" text-anchor="middle" ${textStyles.shadow}>
              ${data.recipientName || 'Recipient Name'}
            </text>
            
            <text x="500" y="280" font-family="Arial, sans-serif" font-size="20" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>
              has successfully completed
            </text>
            
            <text x="500" y="340" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>
              ${data.eventName || 'Event Name'}
            </text>
            
            ${data.achievement ? `<text x="500" y="380" font-family="Arial, sans-serif" font-size="18" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>as ${data.achievement}</text>` : ''}
            
            ${data.eventDate ? `<text x="500" y="420" font-family="Arial, sans-serif" font-size="16" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>on ${new Date(data.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</text>` : ''}
            
            <!-- Signature section -->
            <line x1="300" y1="520" x2="700" y2="520" stroke="${textStyles.accent}" stroke-width="2"/>
            <text x="500" y="560" font-family="Arial, sans-serif" font-size="16" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>
              ${data.signature || 'ISTE MIT Manipal'}
            </text>
            
            <!-- Footer -->
            <text x="500" y="650" font-family="Arial, sans-serif" font-size="12" fill="${textStyles.text}" text-anchor="middle" opacity="0.6">
              Certificate ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()} • Generated by AI
            </text>
          </svg>
        `
        
        const encodedSvg = encodeURIComponent(svgString)
        resolve(`data:image/svg+xml;charset=utf-8,${encodedSvg}`)
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(data.backgroundTemplate)
    })
  }

  const backgroundElement = `<rect width="1000" height="700" fill="url(#certGradient)" stroke="${selectedTemplate.border}" stroke-width="8"/>`
  const textStyles = getAdaptiveTextStyles('default', data, selectedTemplate)
  
  const svgString = `
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
        ${textStyles.shadowFilter}
      </defs>
      
      <!-- Background -->
      ${backgroundElement}
      
      <!-- Border decoration -->
      <rect x="20" y="20" width="960" height="660" fill="none" stroke="${textStyles.accent}" stroke-width="2" stroke-dasharray="10,5"/>
      
      <!-- Header -->
      <text x="500" y="80" font-family="Times New Roman, serif" font-size="48" font-weight="bold" fill="${textStyles.accent}" text-anchor="middle" filter="url(#emboss)">
        Certificate of Completion
      </text>
      
      <!-- Main content -->
      <text x="500" y="180" font-family="Arial, sans-serif" font-size="20" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>
        This is to certify that
      </text>
      
      <text x="500" y="240" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${textStyles.accent}" text-anchor="middle" ${textStyles.shadow}>
        ${data.recipientName || 'Recipient Name'}
      </text>
      
      <text x="500" y="280" font-family="Arial, sans-serif" font-size="20" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>
        has successfully completed
      </text>
      
      <text x="500" y="340" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>
        ${data.eventName || 'Event Name'}
      </text>
      
      ${data.achievement ? `<text x="500" y="380" font-family="Arial, sans-serif" font-size="18" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>as ${data.achievement}</text>` : ''}
      
      ${data.eventDate ? `<text x="500" y="420" font-family="Arial, sans-serif" font-size="16" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>on ${new Date(data.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</text>` : ''}
      
      <!-- Signature section -->
      <line x1="300" y1="520" x2="700" y2="520" stroke="${textStyles.accent}" stroke-width="2"/>
      <text x="500" y="560" font-family="Arial, sans-serif" font-size="16" fill="${textStyles.text}" text-anchor="middle" ${textStyles.shadow}>
        ${data.signature || 'ISTE MIT Manipal'}
      </text>
      
      <!-- Footer -->
      <text x="500" y="650" font-family="Arial, sans-serif" font-size="12" fill="${textStyles.text}" text-anchor="middle" opacity="0.6">
        Certificate ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()} • Generated by AI
      </text>
    </svg>
  `
  
  const encodedSvg = encodeURIComponent(svgString)
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`
}

const getTextColorForBackground = (backgroundColor: string): { text: string, accent: string } => {

  const lightColors = {
    text: '#1e293b', 
    accent: '#3b82f6' 
  }
  
  const darkColors = {
    text: '#ffffff', 
    accent: '#60a5fa'
  }
 
  if (backgroundColor.includes('data:')) {
 
    return {
      text: '#ffffff',
      accent: '#ffffff'
    }
  }
  

  if (backgroundColor.includes('gradient')) {
 
    const colorMatch = backgroundColor.match(/#[0-9a-fA-F]{6}/)
    if (colorMatch) {
      const hexColor = colorMatch[0]
      const brightness = getColorBrightness(hexColor)
      return brightness > 128 ? lightColors : darkColors
    }
  }

  if (backgroundColor.startsWith('#')) {
    const brightness = getColorBrightness(backgroundColor)
    return brightness > 128 ? lightColors : darkColors
  }

  return lightColors
}

const getColorBrightness = (hexColor: string): number => {

  const hex = hexColor.replace('#', '')

  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  return (r * 299 + g * 587 + b * 114) / 1000
}

const getAdaptiveTextStyles = (backgroundType: string, backgroundData: any, template: any) => {
  if (backgroundType === 'upload') {

    return {
      text: '#ffffff',
      accent: '#ffffff',
      shadow: 'filter="url(#textShadow)"',
      shadowFilter: `
        <filter id="textShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.8)"/>
          <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.6)"/>
        </filter>
      `
    }
  } else {

    return {
      text: template.text,
      accent: template.accent,
      shadow: 'filter="url(#textShadow)"',
      shadowFilter: `
        <filter id="textShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      `
    }
  }
}

export function ContentManagement() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content:
        "🚀 Just wrapped up our AI/ML workshop! Amazing turnout with 70+ students learning about neural networks and deep learning.",
      type: "text",
      images: ["/post1.mp4"],
      likes: 56,
      comments: 23,
      shares: 12,
      views: 124,
      createdAt: "2025-06-26T15:30:00Z",
      status: "published",
    },
    {
      id: 2,
      content:
        "Calling all innovators! Our Startup Pitch Competition is just around the corner. Registration closes on Oct 22nd.",
      type: "announcement",
      images: [],
      likes: 58,
      comments: 18,
      shares: 22,
      views: 89,
      createdAt: "2025-06-27T09:30:00Z",
      status: "published",
    },
  ])

  const [newPost, setNewPost] = useState({
    content: "",
    type: "text",
    images: [],
  })

  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const [posterForm, setPosterForm] = useState({
    title: "",
    subtitle: "",
    date: "",
    time: "",
    venue: "",
    theme: "tech",
    color: "blue",
    description: "",
    aiDescription: "",
  })

  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null)
  const [showPosterDialog, setShowPosterDialog] = useState(false)
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)

  const [certificateForm, setCertificateForm] = useState({
    recipientName: "",
    eventName: "",
    eventDate: "",
    achievement: "",
    signature: "ISTE MIT Manipal",
    template: "modern",
    backgroundTemplate: null as File | null,
    backgroundType: "default", 
    backgroundPreview: "", 
  })

  const [generatedCertificate, setGeneratedCertificate] = useState<string | null>(null)
  const [showCertificateDialog, setShowCertificateDialog] = useState(false)
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false)

  const { toast } = useToast()

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post",
        variant: "destructive",
      })
      return
    }

    const post = {
      id: posts.length + 1,
      ...newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      status: "published",
    }

    setPosts([post, ...posts])
    setNewPost({
      content: "",
      type: "text",
      images: [],
    })

    toast({
      title: "Post Published",
      description: "Your post has been published successfully",
    })
  }

  const generatePoster = async () => {
    if (!posterForm.title || !posterForm.date) {
      toast({
        title: "Error",
        description: "Please fill in the event title and date",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingPoster(true)
    toast({
      title: "AI Poster Generation",
      description: "Our AI is creating a stunning poster for your event...",
    })

    try {
      const posterUrl = await generateAIPoster(posterForm)
      setGeneratedPoster(posterUrl)
      setShowPosterDialog(true)
      toast({
        title: "Poster Generated! 🎨",
        description: "Your AI-generated poster is ready to download",
        variant: "success",
        duration: 2000, 
      })
    } catch (error) {
      console.error('Poster generation error:', error)

      toast({
        title: "Generation Issue",
        description: "Using fallback generation. Your poster is ready!",
        variant: "default",
      })
  
      const fallbackUrl = generateFallbackPoster(posterForm)
      setGeneratedPoster(fallbackUrl)
      setShowPosterDialog(true)
    } finally {
      setIsGeneratingPoster(false)
    }
  }

  const downloadPoster = () => {
    if (generatedPoster) {
      const link = document.createElement('a')
      link.href = generatedPoster
      link.download = `ai-poster-${posterForm.title.replace(/\s+/g, '-').toLowerCase()}.png`
      link.click()
      toast({
        title: "Download Started",
        description: "Your AI-generated poster is being downloaded",
      })
    }
  }

  const downloadPosterAsPDF = async () => {
    if (!generatedPoster) {
      toast({
        title: "No Poster",
        description: "Please generate a poster first",
        variant: "destructive",
      })
      return
    }

    try {
 
      const { default: jsPDF } = await import('jspdf')
      
      toast({
        title: "Converting to PDF",
        description: "Converting your poster to PDF format...",
      })

 
      const pdf = new jsPDF('landscape', 'mm', 'a4')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
 
      const convertSVGToPNG = (svgDataUrl: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            
            if (!ctx) {
              reject(new Error('Could not get canvas context'))
              return
            }
   
            canvas.width = img.width
            canvas.height = img.height
 
            ctx.drawImage(img, 0, 0)
  
            const pngDataUrl = canvas.toDataURL('image/png')
            resolve(pngDataUrl)
          }
          
          img.onerror = () => reject(new Error('Failed to load SVG image'))
          img.src = svgDataUrl
        })
      }

      const pngDataUrl = await convertSVGToPNG(generatedPoster)

      const img = new Image()
      img.onload = () => {
 
        const imgAspectRatio = img.width / img.height
        const pdfAspectRatio = pdfWidth / pdfHeight
        
        let finalWidth, finalHeight
        
        if (imgAspectRatio > pdfAspectRatio) {
  
          finalWidth = pdfWidth - 20 
          finalHeight = finalWidth / imgAspectRatio
        } else {
     
          finalHeight = pdfHeight - 20 
          finalWidth = finalHeight * imgAspectRatio
        }
 
        const x = (pdfWidth - finalWidth) / 2
        const y = (pdfHeight - finalHeight) / 2
        
        pdf.addImage(pngDataUrl, 'PNG', x, y, finalWidth, finalHeight)

        pdf.setProperties({
          title: `Poster - ${posterForm.title}`,
          subject: `Event Poster for ${posterForm.title}`,
          author: 'ISTE MIT Manipal',
          creator: 'AI Poster Generator',
          keywords: 'poster, event, announcement',
        })

        const fileName = `poster-${posterForm.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
        pdf.save(fileName)
        
        toast({
          title: "PDF Downloaded! 📄",
          description: "Your poster has been saved as PDF",
          variant: "success",
        })
      }
      
      img.src = pngDataUrl
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "PDF Generation Failed",
        description: "Failed to convert poster to PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateCertificate = async () => {
    if (!certificateForm.recipientName || !certificateForm.eventName) {
      toast({
        title: "Error",
        description: "Please fill in recipient name and event name",
        variant: "destructive",
      })
      return
    }

    console.log('Certificate form data:', {
      recipientName: certificateForm.recipientName,
      eventName: certificateForm.eventName,
      backgroundType: certificateForm.backgroundType,
      hasFile: !!certificateForm.backgroundTemplate,
      fileName: certificateForm.backgroundTemplate?.name,
      fileSize: certificateForm.backgroundTemplate?.size,
    })

    setIsGeneratingCertificate(true)
    toast({
      title: "AI Certificate Generation",
      description: "Our AI is crafting a professional certificate...",
    })

    try {
      const certificateUrl = await generateAICertificate(certificateForm)
      setGeneratedCertificate(certificateUrl)
      setShowCertificateDialog(true)
      toast({
        title: "Certificate Generated! 🏆",
        description: "Your AI-generated certificate is ready to download",
        variant: "success",
        duration: 2000,
      })
    } catch (error) {
      console.error('Certificate generation error:', error)

      toast({
        title: "Generation Issue",
        description: "Using fallback generation. Your certificate is ready!",
        variant: "default",
      })

      try {
        const fallbackUrl = await generateFallbackCertificate(certificateForm)
        setGeneratedCertificate(fallbackUrl)
        setShowCertificateDialog(true)
      } catch (fallbackError) {
        console.error('Fallback generation error:', fallbackError)
        toast({
          title: "Generation Failed",
          description: "Failed to generate certificate. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsGeneratingCertificate(false)
    }
  }

  const downloadCertificate = () => {
    if (generatedCertificate) {
      const link = document.createElement('a')
      link.href = generatedCertificate
      link.download = `ai-certificate-${certificateForm.recipientName.replace(/\s+/g, '-').toLowerCase()}.png`
      link.click()
      toast({
        title: "Download Started",
        description: "Your AI-generated certificate is being downloaded",
      })
    }
  }

  const downloadCertificateAsPDF = async () => {
    if (!generatedCertificate) {
      toast({
        title: "No Certificate",
        description: "Please generate a certificate first",
        variant: "destructive",
      })
      return
    }

    try {
  
      const { default: jsPDF } = await import('jspdf')
      
      toast({
        title: "Converting to PDF",
        description: "Converting your certificate to PDF format...",
      })

      const pdf = new jsPDF('landscape', 'mm', 'a4')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const convertSVGToPNG = (svgDataUrl: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            
            if (!ctx) {
              reject(new Error('Could not get canvas context'))
              return
            }
   
            canvas.width = img.width
            canvas.height = img.height
   
            ctx.drawImage(img, 0, 0)

            const pngDataUrl = canvas.toDataURL('image/png')
            resolve(pngDataUrl)
          }
          
          img.onerror = () => reject(new Error('Failed to load SVG image'))
          img.src = svgDataUrl
        })
      }

      const pngDataUrl = await convertSVGToPNG(generatedCertificate)
 
      const img = new Image()
      img.onload = () => {

        const imgAspectRatio = img.width / img.height
        const pdfAspectRatio = pdfWidth / pdfHeight
        
        let finalWidth, finalHeight
        
        if (imgAspectRatio > pdfAspectRatio) {
  
          finalWidth = pdfWidth - 20
          finalHeight = finalWidth / imgAspectRatio
        } else {
   
          finalHeight = pdfHeight - 20 
          finalWidth = finalHeight * imgAspectRatio
        }
        

        const x = (pdfWidth - finalWidth) / 2
        const y = (pdfHeight - finalHeight) / 2
        

        pdf.addImage(pngDataUrl, 'PNG', x, y, finalWidth, finalHeight)

        pdf.setProperties({
          title: `Certificate - ${certificateForm.recipientName}`,
          subject: `Certificate of Completion for ${certificateForm.eventName}`,
          author: 'ISTE MIT Manipal',
          creator: 'AI Certificate Generator',
          keywords: 'certificate, completion, achievement',
        })
  
        const fileName = `certificate-${certificateForm.recipientName.replace(/\s+/g, '-').toLowerCase()}.pdf`
        pdf.save(fileName)
        
        toast({
          title: "PDF Downloaded! 📄",
          description: "Your certificate has been saved as PDF",
          variant: "success",
        })
      }
      
      img.src = pngDataUrl
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "PDF Generation Failed",
        description: "Failed to convert certificate to PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "event":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "achievement":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getAnimationDelay = (idx: number) => `${idx * 80}ms`

  const generateAIDescription = async () => {
    if (!posterForm.title || !posterForm.theme) {
      toast({
        title: "Error",
        description: "Please fill in the event title and theme first",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingDescription(true)
    toast({
      title: "AI Description Generation",
      description: "Our AI is crafting a compelling description...",
    })

    try {

      const descriptions = {
        tech: [
          `Join us for an exciting ${posterForm.title} where innovation meets technology! Experience cutting-edge demonstrations, interactive workshops, and networking opportunities with industry experts. Whether you're a tech enthusiast, student, or professional, this event promises to inspire and educate.`,
          `Discover the future of technology at ${posterForm.title}! From AI and machine learning to blockchain and cybersecurity, explore the latest trends and breakthroughs. Connect with like-minded individuals and gain insights from leading professionals in the field.`,
          `Embark on a technological journey at ${posterForm.title}! This comprehensive event brings together the brightest minds in tech for a day of learning, collaboration, and innovation. Perfect for anyone passionate about the digital revolution.`
        ],
        creative: [
          `Unleash your creativity at ${posterForm.title}! Immerse yourself in a world of artistic expression, design thinking, and innovative storytelling. Connect with fellow creatives and discover new ways to bring your ideas to life.`,
          `Experience the magic of creativity at ${posterForm.title}! From digital art to multimedia design, explore various creative disciplines and techniques. A perfect opportunity to expand your artistic horizons and network with creative professionals.`,
          `Join the creative revolution at ${posterForm.title}! The inspiring event celebrates artistic innovation and creative problem-solving. Whether you're a designer, artist, or creative enthusiast, prepare to be inspired and motivated.`
        ],
        business: [
          `Accelerate your business success at ${posterForm.title}! Learn from industry leaders, discover new strategies, and network with entrepreneurs and professionals. Gain valuable insights to take your business to the next level.`,
          `Transform your business mindset at ${posterForm.title}! This comprehensive event covers everything from startup strategies to corporate innovation. Connect with business leaders and discover opportunities for growth and collaboration.`,
          `Navigate the future of business at ${posterForm.title}! Explore emerging trends, innovative business models, and strategic insights that will shape the corporate landscape. Perfect for entrepreneurs, executives, and business students.`
        ],
        academic: [
          `Expand your knowledge at ${posterForm.title}! Dive deep into academic research, scholarly discussions, and intellectual discourse. Connect with researchers, professors, and students passionate about advancing knowledge in their fields.`,
          `Embark on an academic journey at ${posterForm.title}! This scholarly event brings together experts and students for meaningful discussions, research presentations, and collaborative learning opportunities.`,
          `Celebrate academic excellence at ${posterForm.title}! From research presentations to panel discussions, experience the best of academic discourse and intellectual exchange. A must-attend for students, researchers, and academics.`
        ]
      }

      const themeDescriptions = descriptions[posterForm.theme as keyof typeof descriptions] || descriptions.tech
      const randomDescription = themeDescriptions[Math.floor(Math.random() * themeDescriptions.length)]
 
      let finalDescription = randomDescription
      if (posterForm.venue) {
        finalDescription = finalDescription.replace(/\.$/, ` at ${posterForm.venue}.`)
      }
      if (posterForm.date) {
        const eventDate = new Date(posterForm.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
        finalDescription = finalDescription.replace(/\.$/, ` on ${eventDate}.`)
      }

      setPosterForm({ ...posterForm, aiDescription: finalDescription })
      
      toast({
        title: "Description Generated! ✨",
        description: "AI has crafted a compelling description for your event",
        variant: "success",
        duration: 2000,
      })
    } catch (error) {
      console.error('Description generation error:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="admin-card admin-glass-strong p-0 animate-fade-in-up relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-200/40 via-blue-100/30 to-purple-100/20 dark:from-gray-900/60 dark:via-gray-800/50 dark:to-blue-900/30 pointer-events-none z-0" />
        <div className="relative z-10 flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-up">
            Content Management
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="admin-button-primary bg-gradient-to-r from-green-500 to-blue-600 shadow-lg hover:from-green-600 hover:to-blue-700 animate-fade-in-up">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl animate-fade-in-up">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Create New Post
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="post-content">Content *</Label>
                  <Textarea
                    id="post-content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="What's happening with your club?"
                    rows={4}
                    className="resize-none"
                  />
                  <div className="text-sm text-gray-500 mt-1">{newPost.content.length}/500 characters</div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button onClick={handleCreatePost}>Publish Now</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="published" className="space-y-4 animate-fade-in-up delay-100">
        <TabsList className="admin-tabs-list grid w-full grid-cols-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-md rounded-2xl overflow-hidden">
          <TabsTrigger value="published" className="transition-colors duration-200 hover:bg-green-100/40 dark:hover:bg-green-900/20 club-card-glow">Published</TabsTrigger>
          <TabsTrigger value="drafts" className="transition-colors duration-200 hover:bg-blue-100/40 dark:hover:bg-blue-900/20 club-card-glow">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled" className="transition-colors duration-200 hover:bg-purple-100/40 dark:hover:bg-purple-900/20 club-card-glow">Scheduled</TabsTrigger>
          <TabsTrigger value="poster" className="transition-colors duration-200 hover:bg-pink-100/40 dark:hover:bg-pink-900/20 club-card-glow">Poster Generator</TabsTrigger>
          <TabsTrigger value="certificate" className="transition-colors duration-200 hover:bg-yellow-100/40 dark:hover:bg-yellow-900/20 club-card-glow">Certificate Generator</TabsTrigger>
          <TabsTrigger value="analytics" className="transition-colors duration-200 hover:bg-orange-100/40 dark:hover:bg-orange-900/20 club-card-glow">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="space-y-6">
          {posts.map((post, idx) => (
            <Card key={post.id} className="admin-card admin-glass p-0 shadow-xl animate-fade-in-up" style={{ animationDelay: getAnimationDelay(idx) }}>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 shadow-md ring-2 ring-green-400">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>GD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">ISTE MIT Manipal</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{formatTimeAgo(post.createdAt)}</span>
                        <Badge className={getPostTypeColor(post.type) + " px-3 py-1 rounded-full text-xs font-semibold shadow bg-gradient-to-r from-green-400 to-blue-400 dark:from-green-700 dark:to-blue-700"}>{post.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="hover:bg-green-100 dark:hover:bg-green-900 rounded-full">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-red-100 dark:hover:bg-red-900 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">{post.content}</p>
                {post.images.length > 0 && (
                  <div className="mb-4 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                    {post.images[0].toLowerCase().match(/\.(mp4|webm|ogg|mov|avi)$/) || post.images[0].includes('post1') ? (
                      <div className="relative group cursor-pointer">
                        <video
                          src={post.images[0]}
                          className="w-full h-64 object-cover"
                          muted
                          onLoadedData={(e) => {
                            // Set the video to show the first frame as thumbnail
                            const video = e.target as HTMLVideoElement;
                            video.currentTime = 0.1;
                          }}
                          onPlay={() => setPlayingVideo(post.images[0])}
                          onPause={() => setPlayingVideo(null)}
                          onEnded={() => setPlayingVideo(null)}
                        />
                        {/* Play Button Overlay - Only show when video is not playing */}
                        {playingVideo !== post.images[0] && (
                          <div 
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"
                            onClick={(e) => {
                              e.preventDefault();
                              const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                              if (video) {
                                video.play();
                              }
                            }}
                          >
                            <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <svg 
                                className="w-8 h-8 text-gray-800 ml-1" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        )}
                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center justify-between text-white text-sm">
                            <span>{playingVideo === post.images[0] ? 'Playing' : 'Click to play'}</span>
                            <span>0:00</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={post.images[0] || "/placeholder.svg"}
                        alt="Post content"
                        className="w-full h-64 object-cover"
                      />
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Share2 className="w-4 h-4" />
                      <span>{post.shares}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="admin-button-secondary rounded-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drafts">
          <Card className="admin-card admin-glass p-8 text-center animate-fade-in-up">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-bounce" />
            <h3 className="text-lg font-semibold mb-2">No Draft Posts</h3>
            <p className="text-gray-600 dark:text-gray-400">Save posts as drafts to continue working on them later</p>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="admin-card admin-glass p-8 text-center animate-fade-in-up">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-bounce" />
            <h3 className="text-lg font-semibold mb-2">No Scheduled Posts</h3>
            <p className="text-gray-600 dark:text-gray-400">Schedule posts to be published at specific times</p>
          </Card>
        </TabsContent>

        {/* AI Poster Generator */}
        <TabsContent value="poster" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Poster Form */}
            <Card className="admin-card admin-glass p-6">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  <Sparkles className="w-6 h-6 mr-2" />
                  AI Poster Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="poster-title">Event Title *</Label>
                  <Input
                    id="poster-title"
                    value={posterForm.title}
                    onChange={(e) => setPosterForm({ ...posterForm, title: e.target.value })}
                    placeholder="e.g., TechTatva 2025"
                    className="admin-input"
                  />
                </div>
                <div>
                  <Label htmlFor="poster-subtitle">Subtitle</Label>
                  <Input
                    id="poster-subtitle"
                    value={posterForm.subtitle}
                    onChange={(e) => setPosterForm({ ...posterForm, subtitle: e.target.value })}
                    placeholder="e.g., Annual Technical Festival"
                    className="admin-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="poster-date">Date *</Label>
                    <Input
                      id="poster-date"
                      type="date"
                      value={posterForm.date}
                      onChange={(e) => setPosterForm({ ...posterForm, date: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="poster-time">Time</Label>
                    <Input
                      id="poster-time"
                      type="time"
                      value={posterForm.time}
                      onChange={(e) => setPosterForm({ ...posterForm, time: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="poster-venue">Venue</Label>
                  <Input
                    id="poster-venue"
                    value={posterForm.venue}
                    onChange={(e) => setPosterForm({ ...posterForm, venue: e.target.value })}
                    placeholder="e.g., MIT Campus, Library Auditorium"
                    className="admin-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="poster-theme">Theme</Label>
                    <Select value={posterForm.theme} onValueChange={(value) => setPosterForm({ ...posterForm, theme: value })}>
                      <SelectTrigger className="admin-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="poster-color">Color Scheme</Label>
                    <Select value={posterForm.color} onValueChange={(value) => setPosterForm({ ...posterForm, color: value })}>
                      <SelectTrigger className="admin-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="teal">Teal</SelectItem>
                        <SelectItem value="sky">Sky</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="poster-description">Description</Label>
                  <div className="space-y-2">
                    <Textarea
                      id="poster-description"
                      value={posterForm.description}
                      onChange={(e) => setPosterForm({ ...posterForm, description: e.target.value })}
                      placeholder="Brief description of the event..."
                      rows={3}
                      className="admin-input"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {posterForm.description.length}/500 characters
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateAIDescription}
                        disabled={isGeneratingDescription || !posterForm.title || !posterForm.theme}
                        className="text-xs"
                      >
                        {isGeneratingDescription ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* AI Generated Description Display */}
                {posterForm.aiDescription && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-green-700 dark:text-green-300">
                      ✨ AI Generated Description
                    </Label>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {posterForm.aiDescription}
                      </p>
                      <div className="flex justify-end mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPosterForm({ ...posterForm, aiDescription: "" })}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={generatePoster} 
                  disabled={isGeneratingPoster}
                  className="w-full admin-button-primary bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {isGeneratingPoster ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Poster
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview Area */}
            <Card className="admin-card admin-glass p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  {posterForm.title ? (
                    <div className="text-center p-4">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{posterForm.title}</h3>
                      {posterForm.subtitle && <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{posterForm.subtitle}</p>}
                      {posterForm.date && <p className="text-md text-gray-500 dark:text-gray-500">{posterForm.date}</p>}
                      {posterForm.venue && <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{posterForm.venue}</p>}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Palette className="w-12 h-12 mx-auto mb-2" />
                      <p>Fill in the form to see preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Certificate Generator */}
        <TabsContent value="certificate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Certificate Form */}
            <Card className="admin-card admin-glass p-6">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  <Award className="w-6 h-6 mr-2" />
                  AI Certificate Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cert-recipient">Recipient Name *</Label>
                  <Input
                    id="cert-recipient"
                    value={certificateForm.recipientName}
                    onChange={(e) => setCertificateForm({ ...certificateForm, recipientName: e.target.value })}
                    placeholder="e.g., XYZ"
                    className="admin-input"
                  />
                </div>
                <div>
                  <Label htmlFor="cert-event">Event Name *</Label>
                  <Input
                    id="cert-event"
                    value={certificateForm.eventName}
                    onChange={(e) => setCertificateForm({ ...certificateForm, eventName: e.target.value })}
                    placeholder="e.g., AI/ML Workshop"
                    className="admin-input"
                  />
                </div>
                <div>
                  <Label htmlFor="cert-date">Event Date</Label>
                  <Input
                    id="cert-date"
                    type="date"
                    value={certificateForm.eventDate}
                    onChange={(e) => setCertificateForm({ ...certificateForm, eventDate: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <Label htmlFor="cert-achievement">Achievement/Position</Label>
                  <Input
                    id="cert-achievement"
                    value={certificateForm.achievement}
                    onChange={(e) => setCertificateForm({ ...certificateForm, achievement: e.target.value })}
                    placeholder="e.g., Participant, Winner, Organizer"
                    className="admin-input"
                  />
                </div>
                <div>
                  <Label htmlFor="cert-signature">Signature/Authority</Label>
                  <Input
                    id="cert-signature"
                    value={certificateForm.signature}
                    onChange={(e) => setCertificateForm({ ...certificateForm, signature: e.target.value })}
                    placeholder="e.g., ISTE MIT Manipal"
                    className="admin-input"
                  />
                </div>
                <div>
                  <Label htmlFor="cert-template">Template Style</Label>
                  <Select value={certificateForm.template} onValueChange={(value) => setCertificateForm({ ...certificateForm, template: value })}>
                    <SelectTrigger className="admin-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Background Template Section */}
                <div className="space-y-4">
                  <Label>Background Template</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="bg-default"
                        name="backgroundType"
                        value="default"
                        checked={certificateForm.backgroundType === 'default'}
                        onChange={(e) => setCertificateForm({ ...certificateForm, backgroundType: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Label htmlFor="bg-default" className="text-sm font-normal">Use Default Template</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="bg-upload"
                        name="backgroundType"
                        value="upload"
                        checked={certificateForm.backgroundType === 'upload'}
                        onChange={(e) => setCertificateForm({ ...certificateForm, backgroundType: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Label htmlFor="bg-upload" className="text-sm font-normal">Upload Background Image</Label>
                    </div>
                    
                    {certificateForm.backgroundType === 'upload' && (
                      <div className="ml-6">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              console.log('File selected:', file.name, file.size, file.type)
                              // Create preview URL
                              const previewUrl = URL.createObjectURL(file)
                              setCertificateForm({ 
                                ...certificateForm, 
                                backgroundTemplate: file,
                                backgroundPreview: previewUrl
                              })
                            }
                          }}
                          className="admin-input"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 1000x700px or higher resolution. Supports JPG, PNG, SVG.
                        </p>
                        {certificateForm.backgroundTemplate && (
                          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                            <p className="text-sm text-green-700 dark:text-green-300">
                              ✓ {certificateForm.backgroundTemplate.name} selected ({Math.round(certificateForm.backgroundTemplate.size / 1024)}KB)
                            </p>
                            {certificateForm.backgroundPreview && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Preview:</p>
                                <img 
                                  src={certificateForm.backgroundPreview} 
                                  alt="Background preview" 
                                  className="w-full h-32 object-cover rounded border"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={generateCertificate} 
                  disabled={isGeneratingCertificate}
                  className="w-full admin-button-primary bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                >
                  {isGeneratingCertificate ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Generate Certificate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview Area */}
            <Card className="admin-card admin-glass p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-[10/7] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  {certificateForm.recipientName ? (
                    <div className="text-center p-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Certificate</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">This is to certify that</p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">{certificateForm.recipientName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">has successfully completed</p>
                      <p className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">{certificateForm.eventName}</p>
                      {certificateForm.eventDate && <p className="text-xs text-gray-500 dark:text-gray-500">on {certificateForm.eventDate}</p>}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2" />
                      <p>Fill in the form to see preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            <Card className="admin-card admin-glass p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2 animate-pulse">1.4K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reach</div>
              <div className="text-xs text-green-600 mt-1">+12% from last week</div>
            </Card>
            <Card className="admin-card admin-glass p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2 animate-pulse">254</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Likes</div>
              <div className="text-xs text-green-600 mt-1">+8% from last week</div>
            </Card>
            <Card className="admin-card admin-glass p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2 animate-pulse">41</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Comments</div>
              <div className="text-xs text-green-600 mt-1">+15% from last week</div>
            </Card>
            <Card className="admin-card admin-glass p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2 animate-pulse">34</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Shares</div>
              <div className="text-xs text-green-600 mt-1">+22% from last week</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in-up">
            <Card className="admin-card admin-glass">
              <CardHeader>
                <CardTitle>Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  📊 Engagement chart would go here
                </div>
              </CardContent>
            </Card>

            <Card className="admin-card admin-glass">
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">AI/ML Workshop Post</p>
                    <p className="text-xs text-gray-500">124 views</p>
                  </div>
                  <Badge>Top</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Startup Competition</p>
                    <p className="text-xs text-gray-500">89 views</p>
                  </div>
                  <Badge variant="secondary">2nd</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Generated Poster Dialog */}
      <Dialog open={showPosterDialog} onOpenChange={setShowPosterDialog}>
        <DialogContent className="max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Generated Poster
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {generatedPoster && (
              <div className="flex justify-center">
                <img 
                  src={generatedPoster} 
                  alt="Generated Poster" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPosterDialog(false)}>
                Close
              </Button>
              <Button onClick={downloadPoster} className="admin-button-primary">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={downloadPosterAsPDF} className="admin-button-primary">
                <FileDown className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generated Certificate Dialog */}
      <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <DialogContent className="max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Generated Certificate
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {generatedCertificate && (
              <div className="flex justify-center">
                <img 
                  src={generatedCertificate} 
                  alt="Generated Certificate" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCertificateDialog(false)}>
                Close
              </Button>
              <Button onClick={downloadCertificate} className="admin-button-primary">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={downloadCertificateAsPDF} className="admin-button-primary">
                <FileDown className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
