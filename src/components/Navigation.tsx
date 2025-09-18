'use client'

import Link from 'next/link'
import { BarChart3, Home } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="fixed top-4 right-4 z-50">
      <div className="glass rounded-lg p-1 flex gap-0.5">
        <Link
          href="/"
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-card-bg transition-all duration-300 text-xs"
          title="Survey"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:block text-xs">Survey</span>
        </Link>
        <Link
          href="/admin"
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-card-bg transition-all duration-300 text-xs"
          title="Analytics"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span className="hidden sm:block text-xs">Analytics</span>
        </Link>
      </div>
    </nav>
  )
}