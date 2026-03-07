import { useState } from 'react'
import { X, Zap, Eye, BookOpen, Quote } from 'lucide-react'
import './DevaCards.css'

interface Deva {
  name: string
  title: string
  tradition: string
  portrait: string
  summary: string
  powers: string[]
  symbolism: string[]
  stories: string[]
  quotes: string[]
}

const DEVAS: Deva[] = [
  {
    name: 'Shiva',
    title: 'The Destroyer & Transformer',
    tradition: 'Hindu',
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg/440px-Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg',
    summary: 'Lord Shiva is the supreme being who creates, protects and transforms the universe. He is the cosmic dancer, Nataraja, whose dance sustains the rhythm of all existence.',
    powers: ['Cosmic destruction and creation', 'Third eye of divine fire', 'Master of yoga and meditation', 'Lord of time (Mahakala)'],
    symbolism: ['Trident (Trishula) — mastery over three gunas', 'Crescent moon — mastery over time', 'Snake (Vasuki) — mastery over desire', 'Damaru — cosmic rhythm'],
    stories: ['The churning of the ocean (Samudra Manthan)', 'The marriage of Shiva and Parvati', 'Destruction of Tripura', 'The story of Ganga descending to Earth'],
    quotes: ['I am the beginning, the middle, and the end of creation.', 'The one who has conquered the mind has conquered the world.'],
  },
  {
    name: 'Athena',
    title: 'Goddess of Wisdom & Warfare',
    tradition: 'Greek',
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Mattei_Athena_Louvre_Ma530_n2.jpg/440px-Mattei_Athena_Louvre_Ma530_n2.jpg',
    summary: 'Athena, born fully armored from the head of Zeus, embodies wisdom, strategic warfare, and the civilizing arts. Patron of Athens, she is reason incarnate.',
    powers: ['Divine wisdom and strategy', 'Aegis and Gorgon shield', 'Mastery of crafts and weaving', 'Shape-shifting'],
    symbolism: ['Owl — wisdom and knowledge', 'Olive tree — peace and prosperity', 'Aegis — divine protection', 'Spear — just warfare'],
    stories: ['Birth from the head of Zeus', 'Contest with Poseidon for Athens', 'Guidance of Odysseus', 'Transformation of Arachne'],
    quotes: ['Wisdom outweighs any wealth.', 'The bravest are those who have the clearest vision of what lies before them.'],
  },
  {
    name: 'Odin',
    title: 'The Allfather',
    tradition: 'Norse',
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Georg_von_Rosen_-_Oden_som_vandringsman%2C_1886_%28Odin%2C_the_Wanderer%29.jpg/440px-Georg_von_Rosen_-_Oden_som_vandringsman%2C_1886_%28Odin%2C_the_Wanderer%29.jpg',
    summary: 'Odin, ruler of Asgard, sacrificed his eye at the Well of Mimir for cosmic wisdom. He hung upon Yggdrasil for nine days to gain the sacred runes.',
    powers: ['Mastery of runes and seidr magic', 'Shape-shifting', 'Wisdom of the cosmos', 'Command over the Valkyries'],
    symbolism: ['Ravens (Huginn & Muninn) — thought and memory', 'Spear Gungnir — authority', 'Yggdrasil — connection of worlds', 'Single eye — sacrifice for wisdom'],
    stories: ['Sacrifice at the Well of Mimir', 'Hanging upon Yggdrasil', 'The creation of Ask and Embla', 'Ragnarok and the final battle'],
    quotes: ['The wise man does not lay up his own treasures.', 'Where wisdom sits, evil cannot prevail.'],
  },
  {
    name: 'Anubis',
    title: 'Guardian of the Dead',
    tradition: 'Egyptian',
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Anubis_standing.svg/440px-Anubis_standing.svg.png',
    summary: 'Anubis, the jackal-headed god, guides souls through the underworld and presides over the sacred weighing of hearts against the feather of Ma\'at.',
    powers: ['Guidance of souls to the afterlife', 'Embalming and mummification', 'Weighing of hearts', 'Protection of tombs'],
    symbolism: ['Jackal head — vigilance over the dead', 'Scales — divine justice', 'Ankh — eternal life', 'Black color — fertile Nile soil'],
    stories: ['The weighing of the heart ceremony', 'Embalming of Osiris', 'Guardian of the necropolis', 'Contest with Set'],
    quotes: ['The heart knows its own truth.', 'Death is but a door to eternity.'],
  },
  {
    name: 'Amaterasu',
    title: 'Goddess of the Sun',
    tradition: 'Japanese',
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Amaterasu_cave_crop.jpg/440px-Amaterasu_cave_crop.jpg',
    summary: 'Amaterasu Omikami, supreme deity of the Shinto pantheon, is the radiant sun goddess from whom the Japanese imperial line claims descent.',
    powers: ['Illumination of the world', 'Weaving the fabric of reality', 'Divine sovereignty', 'Purification'],
    symbolism: ['Sun — life and truth', 'Mirror (Yata no Kagami) — truth', 'Jewel — benevolence', 'Sword — valor'],
    stories: ['Retreat into the cave (Ama-no-Iwato)', 'Conflict with Susanoo', 'Sending Ninigi to rule the earth', 'Creation of the three sacred treasures'],
    quotes: ['Light endures beyond all shadow.', 'Where radiance dwells, darkness cannot abide.'],
  },
  {
    name: 'Krishna',
    title: 'The Divine Charioteer',
    tradition: 'Hindu',
    portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Bhagavad_Gita%2C_19th_century.jpg/440px-Bhagavad_Gita%2C_19th_century.jpg',
    summary: 'Lord Krishna, the eighth avatar of Vishnu, is the divine speaker of the Bhagavad Gita. From playful cowherd to cosmic sovereign, he embodies dharma itself.',
    powers: ['Cosmic universal form (Vishvarupa)', 'Sudarshan Chakra', 'Divine enchantment (Yogamaya)', 'Master of dharma'],
    symbolism: ['Flute — call of the divine', 'Peacock feather — beauty and grace', 'Yellow garments — earth and fertility', 'Sudarshan Chakra — cycle of time'],
    stories: ['The Bhagavad Gita discourse', 'Lifting of Govardhan Hill', 'Slaying of Kamsa', 'The Rasa Lila'],
    quotes: ['Whenever dharma declines, I manifest myself.', 'You have a right to perform your prescribed duty, but not to the fruits of action.'],
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
  const [selected, setSelected] = useState<Deva | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('powers')

  function renderTabContent(deva: Deva) {
    const items = deva[activeTab]
    return (
      <ul className="tab-content-list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
  }

  return (
    <div className="deva-page">
      <div className="deva-page-header">
        <h1>Deva Cards</h1>
        <p>The divine pantheon across civilizations</p>
      </div>

      <div className="deva-grid">
        {DEVAS.map((deva) => (
          <button
            key={deva.name}
            className="deva-card"
            onClick={() => { setSelected(deva); setActiveTab('powers') }}
          >
            <div className="deva-card-image">
              <img src={deva.portrait} alt={deva.name} loading="lazy" />
              <div className="deva-aura" />
            </div>
            <div className="deva-card-info">
              <h3>{deva.name}</h3>
              <span className="deva-tradition">{deva.tradition}</span>
              <p className="deva-title">{deva.title}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="deva-modal-overlay" onClick={() => setSelected(null)}>
          <div className="deva-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="modal-header">
              <div className="modal-portrait">
                <img src={selected.portrait} alt={selected.name} />
              </div>
              <div className="modal-info">
                <h2>{selected.name}</h2>
                <span className="modal-tradition">{selected.tradition} Tradition</span>
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
