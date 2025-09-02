'use client'

import { useState, useEffect, useRef } from 'react'
import Button from './Button'
import Toast from './Toast'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default function NewCopyForm() {
  const [businessDetails, setBusinessDetails] = useState('')
  const [websiteStructure, setWebsiteStructure] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [outputLink, setOutputLink] = useState('')
  const [error, setError] = useState('')
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning' | 'error'>('info')

  const handleGenerate = async () => {
    if (!businessDetails.trim() || !websiteStructure.trim()) return

    setIsGenerating(true)
    setError('')
    setHasResult(false)
    setOutputLink('')

    try {
      // Generate UUID
      const requestId = uuidv4()
      setCurrentRequestId(requestId)

      // Insert into Supabase
      const { error: insertError } = await supabase
        .from('requests')
        .insert({
          id: requestId,
          business_details: businessDetails.trim(),
          website_structure: websiteStructure.trim(),
          status: 'pending'
        })

      if (insertError) {
        throw new Error('Failed to create request')
      }

      // Call n8n webhook through our proxy
      const callbackUrl = 'https://words.tektongrowth.com/api/callback'
      
      const response = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId,
          businessDetails: businessDetails.trim(),
          websiteStructure: websiteStructure.trim(),
          callbackUrl
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('n8n response error:', response.status, errorText)
        throw new Error(`Failed to send request to n8n (${response.status})`)
      }

      // Show success toast and reset form
      setToastMessage('Request sent successfully! Check the History tab for results in 2-3 minutes.')
      setToastType('success')
      setShowToast(true)
      
      // Reset form
      setBusinessDetails('')
      setWebsiteStructure('')
      setIsGenerating(false)
      setCurrentRequestId(null)

    } catch (err) {
      console.error('Generation error:', err)
      let errorMessage = 'An error occurred'
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to connect to the service. Please check your internet connection and try again.'
        } else if (err.message.includes('n8n') || err.message.includes('webhook')) {
          errorMessage = `Service error: ${err.message}`
        } else {
          errorMessage = err.message
        }
      }
      
      setToastMessage(errorMessage)
      setToastType('error')
      setShowToast(true)
      setIsGenerating(false)
      setCurrentRequestId(null)
    }
  }



  const handleReset = () => {
    setBusinessDetails('')
    setWebsiteStructure('')
    setIsGenerating(false)
    setHasResult(false)
    setOutputLink('')
    setError('')
    setCurrentRequestId(null)
  }

  const handleToastClose = () => {
    setShowToast(false)
  }



  const isFormValid = businessDetails.trim() && websiteStructure.trim()

  return (
    <div className="max-w-4xl space-y-8">
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={handleToastClose}
        />
      )}
      
      {/* Form */}
      <div className="space-y-6">
        <div>
          <label htmlFor="business-details" className="block text-sm font-medium text-zinc-700 mb-2">
            Business Details
          </label>
          <textarea
            id="business-details"
            value={businessDetails}
            onChange={(e) => setBusinessDetails(e.target.value)}
            placeholder="Describe your business, target audience, tone of voice, and any specific requirements..."
            className="w-full h-48 px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label htmlFor="website-structure" className="block text-sm font-medium text-zinc-700 mb-2">
            Website Structure / Pages
          </label>
          <textarea
            id="website-structure"
            value={websiteStructure}
            onChange={(e) => setWebsiteStructure(e.target.value)}
            placeholder="List the pages you need copy for (e.g., Home, About, Services, Contact) and any specific content requirements..."
            className="w-full h-48 px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid}
            loading={isGenerating}
            size="lg"
          >
            {isGenerating ? 'Sending Request...' : 'Generate Copy'}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">How it works</h3>
        <div className="space-y-3 text-blue-800">
          <p className="text-sm">1. Fill out the form above with your business details and website structure</p>
          <p className="text-sm">2. Click &quot;Generate Copy&quot; to send your request</p>
          <p className="text-sm">3. Check the <strong>History tab</strong> to see your results (usually ready in 2-3 minutes)</p>
          <p className="text-sm">4. All your requests are saved and can be viewed anytime in the History section</p>
        </div>
      </div>

      {/* Callback URL Display */}
      <div className="border border-zinc-200 rounded-xl p-6 bg-zinc-50">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Callback URL</h3>
        <p className="text-sm text-zinc-600 mb-2">Use this URL in your n8n workflow:</p>
        <div className="bg-white border border-zinc-200 rounded-lg p-3">
          <code className="text-sm text-zinc-800">
            https://tekton-updated-interface.netlify.app/api/callback
          </code>
        </div>
      </div>
    </div>
  )
}

