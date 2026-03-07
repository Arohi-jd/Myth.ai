import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Sun, MessageCircle, BookOpen, Scroll, Bookmark, LogOut, Menu, X } from 'lucide-react'
import './Navbar.css'

interface NavbarProps {
  userEmail: string
  onLogout: () => void
}

function BrandLogo({ className }: { className?: string }) {
  return (
    <img 
      src="/images/logo.png" 
      alt="Myth.ai Logo" 
      className={className}
      width="32" 
      height="32"
    />
  )
}

const NAV_ITEMS = [
  { key: 'chat', label: 'Vaani', icon: MessageCircle, path: '/chat' },
  { key: 'deva', label: 'Deva Cards', icon: Sun, path: '/deva-cards' },
  { key: 'katha', label: 'Katha Mandal', icon: Scroll, path: '/katha-mandal' },
  { key: 'gita', label: 'Gita Path', icon: BookOpen, path: '/gita-path' },
  { key: 'bookmarks', label: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
]

export default function Navbar({ userEmail, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="divine-navbar">
      <div className="navbar-inner">
        <NavLink to="/chat" className="navbar-brand">
          <BrandLogo className="brand-logo" />
          <span className="brand-text">Myth.ai</span>
        </NavLink>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => (
            <NavLink
              key={key}
              to={path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{label}</span>
            </NavLink>
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
