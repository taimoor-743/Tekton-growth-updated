'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Website Copy Generator' },
    { href: '/history', label: 'History' },
  ]

  return (
    <div className="w-64 bg-zinc-950 text-white flex flex-col">
      {/* Logo Area */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center justify-center">
          {/* Logo Image - Full width and height */}
          <img 
            src="/tekton words logo.png" 
            alt="Tekton Words Logo" 
            className="w-full h-16 object-contain" 
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'gradient-primary text-white shadow-lg'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
