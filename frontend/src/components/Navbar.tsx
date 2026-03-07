import { useState } from 'react'
import { Sun, MessageCircle, BookOpen, Scroll, Bookmark, LogOut, Menu, X } from 'lucide-react'
import './Navbar.css'

interface NavbarProps {
  activePage: string
  onNavigate: (page: string) => void
  userEmail: string
  onLogout: () => void
}

function ChakraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="50" cy="50" r="44" strokeOpacity="0.6" />
      <circle cx="50" cy="50" r="30" strokeOpacity="0.4" />
      <circle cx="50" cy="50" r="8" fill="currentColor" fillOpacity="0.8" stroke="none" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="6"
          x2="50"
          y2="20"
          transform={`rotate(${angle} 50 50)`}
          strokeOpacity="0.7"
        />
      ))}
    </svg>
  )
}

const NAV_ITEMS = [
  { key: 'chat', label: 'Vaani', icon: MessageCircle },
  { key: 'deva', label: 'Deva Cards', icon: Sun },
  { key: 'katha', label: 'Katha Mandal', icon: Scroll },
  { key: 'gita', label: 'Gita Path', icon: BookOpen },
  { key: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
]

export default function Navbar({ activePage, onNavigate, userEmail, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="divine-navbar">
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => onNavigate('chat')}>
          <ChakraIcon className="chakra-logo" />
          <span className="brand-text">Myth.ai</span>
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`nav-link ${activePage === key ? 'active' : ''}`}
              onClick={() => { onNavigate(key); setMobileOpen(false) }}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <span className="nav-email">{userEmail}</span>
          <button className="nav-logout" onClick={onLogout} title="Logout">
            <LogOut size={16} strokeWidth={1.5} />
          </button>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
