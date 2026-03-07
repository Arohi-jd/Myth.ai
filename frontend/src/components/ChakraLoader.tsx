import './ChakraLoader.css'

export default function ChakraLoader() {
  return (
    <div className="chakra-loader-wrap">
      <svg className="chakra-spinner" viewBox="0 0 100 100" width="28" height="28">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
        <circle cx="50" cy="50" r="6" fill="currentColor" fillOpacity="0.6" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="50" y1="10" x2="50" y2="22"
            transform={`rotate(${angle} 50 50)`}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
        ))}
      </svg>
      <span className="loader-text">Channeling ancient wisdom</span>
    </div>
  )
}
