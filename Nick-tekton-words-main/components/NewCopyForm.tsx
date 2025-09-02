'use client'

import { useState, useEffect, useRef } from 'react'
import Button from './Button'
import Toast from './Toast'
import ProjectDropdown from './ProjectDropdown'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

interface Project {
  id: string
  project_name: string
  business_details: string
  website_structure: string
}

export default function NewCopyForm() {
  const [projectName, setProjectName] = useState('')
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
  const [selectedProjectName, setSelectedProjectName] = useState<string>('')

  const handleProjectSelect = (project: Project) => {
    setProjectName(project.project_name)
    setBusinessDetails(project.business_details)
    // Don't fill website structure - let user enter it manually
    setSelectedProjectName(project.project_name)
  }

  const handleGenerate = async () => {
    if (!projectName.trim() || !businessDetails.trim() || !websiteStructure.trim()) {
      setToastMessage('Please fill in all fields: Project Name, Business Details, and Website Structure.')
      setToastType('warning')
      setShowToast(true)
      return
    }

    setIsGenerating(true)
    setError('')
    setHasResult(false)
    setOutputLink('')

    try {
      let requestId: string
      const trimmedProjectName = projectName.trim()

      console.log('Checking for existing project:', trimmedProjectName)

      // First, check if a project with this name already exists
      const { data: existingProjects, error: findError } = await supabase
        .from('requests')
        .select('id, created_at, project_name')
        .eq('project_name', trimmedProjectName)
        .order('created_at', { ascending: false })

      if (findError) {
        console.error('Error finding existing project:', findError)
        throw new Error('Failed to check existing project')
      }

      console.log('Existing projects found:', existingProjects)

      // If project exists, use the most recent one (first in the list due to DESC order)
      if (existingProjects && existingProjects.length > 0) {
        const existingProject = existingProjects[0] // Get the most recent one
        console.log('Using existing project:', existingProject)
        requestId = existingProject.id

        // Update the existing record with new website structure and current timestamp
        const { error: updateError } = await supabase
          .from('requests')
          .update({
            website_structure: websiteStructure.trim(),
            status: 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('id', requestId)

        if (updateError) {
          console.error('Error updating existing project:', updateError)
          throw new Error('Failed to update existing project')
        }

        console.log('Successfully updated existing project')
      } else {
        console.log('Creating new project')
        // Generate new UUID for new project
        requestId = uuidv4()

        // Insert new record into Supabase
        const { error: insertError } = await supabase
          .from('requests')
          .insert({
            id: requestId,
            project_name: trimmedProjectName,
            business_details: businessDetails.trim(),
            website_structure: websiteStructure.trim(),
            status: 'pending'
          })

        if (insertError) {
          console.error('Error creating new project:', insertError)
          throw new Error('Failed to create request')
        }

        console.log('Successfully created new project')
      }

      setCurrentRequestId(requestId)

      // Call n8n webhook through our proxy
      const callbackUrl = 'https://tekton-updated-interface.netlify.app/api/callback'
      
      const response = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId,
          projectName: trimmedProjectName,
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
      setToastMessage('Project saved and request sent successfully! Check the History tab for results in 2-3 minutes.')
      setToastType('success')
      setShowToast(true)
      
      // Reset form
      setProjectName('')
      setBusinessDetails('')
      setWebsiteStructure('')
      setSelectedProjectName('')
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
    setProjectName('')
    setBusinessDetails('')
    setWebsiteStructure('')
    setSelectedProjectName('')
    setIsGenerating(false)
    setHasResult(false)
    setOutputLink('')
    setError('')
    setCurrentRequestId(null)
  }

  const handleToastClose = () => {
    setShowToast(false)
  }

  const isFormValid = projectName.trim() && businessDetails.trim() && websiteStructure.trim()

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
        {/* Load Saved Project Dropdown */}
        <div>
          <label className="block text-base font-bold text-zinc-900 mb-2">
            Load Saved Project
          </label>
          <ProjectDropdown 
            onProjectSelect={handleProjectSelect}
            selectedProjectName={selectedProjectName}
          />
        </div>

        {/* Project Name */}
        <div>
          <label htmlFor="project-name" className="block text-base font-bold text-zinc-900 mb-2">
            Project Name *
          </label>
          <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter a name for your project..."
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* Business Details */}
        <div>
          <label htmlFor="business-details" className="block text-base font-bold text-zinc-900 mb-2">
            Business Details *
          </label>
          <textarea
            id="business-details"
            value={businessDetails}
            onChange={(e) => setBusinessDetails(e.target.value)}
            placeholder="Describe your business, target audience, tone of voice, and any specific requirements..."
            className="w-full h-48 px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Website Structure */}
        <div>
          <label htmlFor="website-structure" className="block text-base font-bold text-zinc-900 mb-2">
            Website Structure / Pages *
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
          <p className="text-sm">1. Load a saved project or fill out the form with your business details and website structure</p>
          <p className="text-sm">2. Enter a unique project name for your request</p>
          <p className="text-sm">3. Click &quot;Generate Copy&quot; to save your project and send your request</p>
          <p className="text-sm">4. Check the <strong>History tab</strong> to see your results (usually ready in 2-3 minutes)</p>
          <p className="text-sm">5. All your projects are automatically saved and can be viewed anytime in the History section</p>
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