import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Zap, Eye, BookOpen, Quote } from 'lucide-react'
import './DevaCards.css'

interface Deva {
  name: string
  sanskrit: string
  title: string
  tradition: string
  portrait: string
  color: string
  summary: string
  powers: string[]
  symbolism: string[]
  stories: string[]
  quotes: string[]
}

const DEVAS: Deva[] = [
  {
    name: 'Lord Rama',
    sanskrit: 'श्री राम',
    title: 'Maryada Purushottam — The Ideal Man',
    tradition: 'Vishnu Avatar',
    portrait: '/images/ram.jpeg',
    color: '#4fc3f7',
    summary: 'Sri Rama, the seventh avatar of Lord Vishnu, is the embodiment of dharma, honor, and virtue. Prince of Ayodhya and hero of the Ramayana, he walked the path of righteousness even when it demanded the ultimate sacrifice.',
    powers: ['Wielder of the divine bow Kodanda', 'Destroyer of Ravana and his demon army', 'Master of celestial weapons (Astras)', 'Embodiment of perfect dharma'],
    symbolism: ['Bow & Arrow — strength guided by righteousness', 'Blue skin — infinite like the sky, beyond mortal limits', 'Tilak — the mark of divine consciousness', 'Paduka (sandals) — his presence blesses where he treads'],
    stories: ['Exile to the forest for 14 years', 'Building of Rama Setu across the ocean', 'The battle of Lanka and defeat of Ravana', 'The Agni Pariksha and return to Ayodhya'],
    quotes: ['There is no greater dharma than truth.', 'A man should follow the path of righteousness, no matter how difficult.', 'Even stones float when inscribed with the name of Rama.'],
  },
  {
    name: 'Mata Sita',
    sanskrit: 'सीता माता',
    title: 'Daughter of the Earth — Symbol of Purity',
    tradition: 'Lakshmi Avatar',
    portrait: '/images/Sita.jpeg',
    color: '#f48fb1',
    summary: 'Sita Devi, born from the earth and daughter of King Janaka, is the avatar of Goddess Lakshmi. Her unwavering devotion, courage in captivity, and inner strength make her the supreme symbol of feminine divinity in Indian mythology.',
    powers: ['Born from the sacred earth (Bhoomi)', 'Lifted the divine bow of Shiva as a child', 'Withstood Agni Pariksha through purity of heart', 'Power of steadfast devotion (Pativrata shakti)'],
    symbolism: ['Earth — grounding, nurturing, and endurance', 'Lotus — purity emerging from adversity', 'Fire — truth that cannot be burned', 'Gold — inner radiance and auspiciousness'],
    stories: ['Born from a sacred furrow of the earth', 'Swayamvara — choosing Rama as he broke Shiva\'s bow', 'Abduction by Ravana and captivity in Lanka', 'The final return to Mother Earth'],
    quotes: ['My heart belongs to Rama — no force can change what the soul has chosen.', 'Truth needs no proof; it shines on its own.', 'Strength is not the absence of suffering, but the will to endure it.'],
  },
  {
    name: 'Lord Krishna',
    sanskrit: 'श्री कृष्ण',
    title: 'The Divine Charioteer — Speaker of the Gita',
    tradition: 'Vishnu Avatar',
    portrait: '/images/krishna.jpeg',
    color: '#64b5f6',
    summary: 'Lord Krishna, the eighth avatar of Vishnu, is the divine speaker of the Bhagavad Gita. From mischievous butter-thief in Vrindavan to the cosmic sovereign who revealed his Vishvarupa, he embodies love, wisdom, and dharma itself.',
    powers: ['Cosmic universal form (Vishvarupa)', 'Sudarshan Chakra — the invincible discus', 'Divine enchantment (Yogamaya)', 'Master of all 64 arts and dharma'],
    symbolism: ['Flute (Murali) — call of the divine to the soul', 'Peacock feather — beauty, grace, and cosmic dance', 'Yellow garments (Pitambara) — earth and prosperity', 'Sudarshan Chakra — the eternal cycle of time'],
    stories: ['The Bhagavad Gita discourse on Kurukshetra', 'Lifting of Govardhan Hill on a single finger', 'Slaying of the tyrant Kamsa', 'The divine Rasa Lila in Vrindavan'],
    quotes: ['Whenever dharma declines, I manifest myself.', 'You have a right to perform your prescribed duty, but not to the fruits of action.', 'The soul is neither born, nor does it ever die.'],
  },
  {
    name: 'Karna',
    sanskrit: 'कर्ण',
    title: 'Suryaputra — The Tragic Hero',
    tradition: 'Mahabharata',
    portrait: '/images/karna.jpeg',
    color: '#ffb74d',
    summary: 'Karna, the unacknowledged son of Kunti and Surya (the Sun God), is the greatest tragic hero of Indian mythology. Born with divine armor (Kavach-Kundal), abandoned at birth, yet he became the most generous warrior the world has ever known.',
    powers: ['Born with impenetrable divine armor (Kavach-Kundal)', 'Wielder of the Vijaya Bow', 'Possessed the Shakti Astra from Indra', 'Archery skills rivaling Arjuna himself'],
    symbolism: ['Sun — his divine father Surya, radiance despite darkness', 'Kavach-Kundal — divine protection sacrificed for honor', 'Charity — giving even what protects you', 'Chariot wheel — fate that cannot be escaped'],
    stories: ['Abandoned by Kunti in the river Ganga at birth', 'Friendship with Duryodhana who saw his worth', 'The sacrifice of Kavach-Kundal to Indra', 'The tragic death on the battlefield of Kurukshetra'],
    quotes: ['I will not turn back, even if the sun itself stands against me.', 'A man is defined not by his birth, but by his deeds.', 'Charity given without expectation is the highest dharma.'],
  },
  {
    name: 'Draupadi',
    sanskrit: 'द्रौपदी',
    title: 'Yajnaseni — Born from Sacred Fire',
    tradition: 'Mahabharata',
    portrait: '/images/draupadi.jpeg',
    color: '#ef5350',
    summary: 'Draupadi, born from the sacrificial fire of King Drupada, is one of the most powerful women in Indian mythology. Queen of the Pandavas, her call for justice after her humiliation in the Kaurava court set the wheels of the Mahabharata war in motion.',
    powers: ['Born from Agni (sacred fire) — embodiment of Shakti', 'Unending vessel of food (Akshaya Patra) from Surya', 'Divine beauty that enchanted kings and warriors', 'Indomitable spirit that bent the arc of destiny'],
    symbolism: ['Fire — justice, purification, and unstoppable will', 'Unbound hair — her vow of vengeance fulfilled', 'Five elements — her bond with the five Pandavas', 'Lotus — dignity amidst humiliation'],
    stories: ['Born from the sacred yajna fire', 'The Swayamvara and marriage to five Pandavas', 'The humiliation in the Kaurava court (Vastraharan)', 'Her role as the catalyst of the Kurukshetra war'],
    quotes: ['I will not tie my hair until it is washed with the blood of those who humiliated me.', 'A woman\'s honor is not a garment to be stripped away.', 'Even the gods tremble when a righteous woman calls for justice.'],
  },
  {
    name: 'Abhimanyu',
    sanskrit: 'अभिमन्यु',
    title: 'The Fearless Young Warrior',
    tradition: 'Mahabharata',
    portrait: '/images/abhimanyu.jpeg',
    color: '#ab47bc',
    summary: 'Abhimanyu, son of Arjuna and Subhadra (Krishna\'s sister), learned the secret of breaking the Chakravyuha while still in his mother\'s womb. At just sixteen, he breached the impenetrable formation alone — a feat no other warrior could accomplish.',
    powers: ['Knew the secret of entering the Chakravyuha', 'Mastery of celestial weapons at age sixteen', 'Warrior prowess rivaling the greatest Maharathis', 'Fearlessness that inspired armies'],
    symbolism: ['Chakravyuha — knowledge gained before birth', 'Broken chariot wheel — fighting against impossible odds', 'Youth — the price of war paid by the innocent', 'Moon — his grandfather Chandra (the Moon God)'],
    stories: ['Learned the Chakravyuha technique in Subhadra\'s womb', 'Marriage to Uttara, princess of Matsya kingdom', 'Single-handedly breaching the Chakravyuha', 'The tragic betrayal — six warriors against one boy'],
    quotes: ['A true warrior does not count his enemies; he counts his arrows.', 'I would rather die fighting than live as a coward.', 'The son of Arjuna does not know the meaning of retreat.'],
  },
]

const TABS = [
  { key: 'powers', label: 'Powers', icon: Zap },
  { key: 'symbolism', label: 'Symbolism', icon: Eye },
  { key: 'stories', label: 'Stories', icon: BookOpen },
  { key: 'quotes', label: 'Quotes', icon: Quote },
] as const

type TabKey = typeof TABS[number]['key']

export default function DevaCards() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Deva | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('powers')
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Stagger card entrance animations
    DEVAS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards(prev => new Set(prev).add(i))
      }, 150 * i)
    })
  }, [])

  function handleStoryClick(story: string) {
    navigate('/chat', { state: { prefilledText: `Tell me more about: ${story}` } })
  }

  function renderTabContent(deva: Deva) {
    const items = deva[activeTab]
    
    if (activeTab === 'stories') {
      return (
        <ul className="tab-content-list">
          {items.map((item, i) => (
            <li 
              key={i} 
              style={{ animationDelay: `${i * 0.08}s`, cursor: 'pointer' }}
              onClick={() => handleStoryClick(item)}
              className="story-item"
            >
              {item}
            </li>
          ))}
        </ul>
      )
    }
    
    return (
      <ul className="tab-content-list">
        {items.map((item, i) => (
          <li key={i} style={{ animationDelay: `${i * 0.08}s` }}>{item}</li>
        ))}
      </ul>
    )
  }

  return (
    <div className="deva-page">
      {/* Decorative background elements */}
      <div className="deva-bg-mandala" />
      <div className="deva-bg-glow" />

      <div className="deva-header-divider">
        <span className="divider-dot" />
        <span className="divider-line" />
        <span className="divider-om">ॐ</span>
        <span className="divider-line" />
        <span className="divider-dot" />
      </div>

      <div className="deva-grid">
        {DEVAS.map((deva, index) => (
          <button
            key={deva.name}
            className={`deva-card ${visibleCards.has(index) ? 'card-visible' : ''}`}
            onClick={() => { setSelected(deva); setActiveTab('powers') }}
            style={{ '--card-color': deva.color } as React.CSSProperties}
          >
            <div className="deva-card-glow" />
            <div className="deva-card-image">
              <img src={deva.portrait} alt={deva.name} loading="lazy" />
              <div className="deva-aura" />
              <div className="deva-card-overlay">
                <span className="deva-sanskrit-label">{deva.sanskrit}</span>
              </div>
            </div>
            <div className="deva-card-info">
              <h3>{deva.name}</h3>
              <span className="deva-tradition">{deva.tradition}</span>
              <p className="deva-title">{deva.title}</p>
            </div>
            <div className="deva-card-shimmer" />
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="deva-modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="deva-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ '--card-color': selected.color } as React.CSSProperties}
          >
            <button className="modal-close" onClick={() => setSelected(null)}>
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="modal-header">
              <div className="modal-portrait">
                <img src={selected.portrait} alt={selected.name} />
                <div className="modal-portrait-glow" />
              </div>
              <div className="modal-info">
                <span className="modal-sanskrit">{selected.sanskrit}</span>
                <h2>{selected.name}</h2>
                <span className="modal-tradition">{selected.tradition}</span>
                <p className="modal-title">{selected.title}</p>
                <p className="modal-summary">{selected.summary}</p>
              </div>
            </div>

            <div className="modal-tabs">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`modal-tab ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>

            <div className="modal-tab-content">
              {renderTabContent(selected)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
