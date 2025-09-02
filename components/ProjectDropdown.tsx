'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Project {
  id: string
  project_name: string
  business_details: string
  website_structure: string
}

interface ProjectDropdownProps {
  onProjectSelect: (project: Project) => void
  selectedProjectName?: string
}

export default function ProjectDropdown({ onProjectSelect, selectedProjectName }: ProjectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch projects from Supabase
  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('id, project_name, business_details, website_structure')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
        return
      }

      // Remove duplicates based on project_name
      const uniqueProjects = data?.filter((project, index, self) => 
        index === self.findIndex(p => p.project_name === project.project_name)
      ) || []

      setProjects(uniqueProjects)
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchProjects()
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.business_details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.website_structure.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleProjectSelect = (project: Project) => {
    onProjectSelect(project)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white text-left flex items-center justify-between"
      >
        <span className={selectedProjectName ? 'text-zinc-900' : 'text-zinc-500'}>
          {selectedProjectName || 'Select a saved project...'}
        </span>
        <svg
          className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-300 rounded-xl shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-zinc-200">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              autoFocus
            />
          </div>

          {/* Projects List */}
          <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-100">
            {loading ? (
              <div className="p-4 text-center text-zinc-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mx-auto mb-2"></div>
                Loading projects...
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className="w-full p-4 text-left hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-zinc-900 mb-1">{project.project_name}</div>
                  <div className="text-sm text-zinc-600 mb-1">
                    {project.business_details.length > 80 
                      ? project.business_details.substring(0, 80) + '...'
                      : project.business_details
                    }
                  </div>
                  <div className="text-xs text-zinc-500">
                    {project.website_structure.length > 60 
                      ? project.website_structure.substring(0, 60) + '...'
                      : project.website_structure
                    }
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-zinc-500">
                {searchTerm ? 'No projects found matching your search.' : 'No saved projects yet.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
