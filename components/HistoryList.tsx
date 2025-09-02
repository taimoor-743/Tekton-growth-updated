'use client'

import { useState, useEffect } from 'react'
import Button from './Button'
import { supabase } from '@/lib/supabase'
import { formatRelativeTime, formatExactTime } from '@/lib/time'

interface Request {
  id: string
  project_name: string
  business_details: string
  website_structure: string
  output_link?: string
  status: 'pending' | 'ready' | 'error' | 'saved'
  error_message?: string
  created_at: string
  updated_at: string
}

export default function HistoryList() {
  const [requests, setRequests] = useState<Request[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch data from Supabase
  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching requests:', error)
        return
      }

      setRequests(data || [])
    } catch (err) {
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(request => 
    request.business_details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.website_structure.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return formatRelativeTime(dateString)
  }

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by business details or website structure..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Business Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Structure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Output</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-zinc-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  {formatDate(request.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  {formatDate(request.updated_at)}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900">
                  {request.project_name}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900">
                  {request.business_details.length > 120 
                    ? request.business_details.substring(0, 120) + '...'
                    : request.business_details
                  }
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900">
                  {request.website_structure.length > 120 
                    ? request.website_structure.substring(0, 120) + '...'
                    : request.website_structure
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  {request.status === 'ready' && request.output_link ? (
                    <a 
                      href={request.output_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:text-cyan-800"
                    >
                      View Output
                    </a>
                  ) : request.status === 'error' ? (
                    <span className="text-red-600">Error</span>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No requests found.</p>
        </div>
      )}
    </div>
  )
}