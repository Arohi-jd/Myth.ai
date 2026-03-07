import { useState } from 'react'
import { ChevronRight, BookmarkPlus, BookmarkCheck, Volume2 } from 'lucide-react'
import './GitaPath.css'

interface Shloka {
  number: string
  sanskrit: string
  transliteration: string
  meaning: string
}

interface Chapter {
  number: number
  name: string
  sanskritName: string
  summary: string
  shlokas: Shloka[]
}

const CHAPTERS: Chapter[] = [
  {
    number: 1,
    name: 'Arjuna\'s Dilemma',
    sanskritName: 'Arjuna Vishada Yoga',
    summary: 'On the battlefield of Kurukshetra, Arjuna sees his kinsmen arrayed against him and is overwhelmed by sorrow and moral confusion.',
    shlokas: [
      {
        number: '1.1',
        sanskrit: 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥',
        transliteration: 'dharma-kshetre kuru-kshetre samavetaa yuyutsavah\nmaamakah paandavaash chaiva kim akurvata sanjaya',
        meaning: 'Dhritarashtra said: O Sanjaya, assembled on the holy field of Kurukshetra, eager to fight, what did my sons and the sons of Pandu do?',
      },
      {
        number: '1.2',
        sanskrit: 'दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा ।\nआचार्यमुपसङ्गम्य राजा वचनमब्रवीत् ॥',
        transliteration: 'drishtva tu paandavaaneekam vyoodham duryodhanastada\naachaaryam upasangamya raajaa vachanam abraveet',
        meaning: 'Seeing the army of the Pandavas arrayed in battle formation, King Duryodhana approached his teacher Drona and spoke these words.',
      },
      {
        number: '1.47',
        sanskrit: 'एवमुक्त्वार्जुनः संख्ये रथोपस्थ उपाविशत् ।\nविसृज्य सशरं चापं शोकसंविग्नमानसः ॥',
        transliteration: 'evam uktvaa arjunah sankhye rathopastha upaavishat\nvisrijya sa-sharam chaapam shoka-samvigna-maanasah',
        meaning: 'Having spoken thus on the battlefield, Arjuna cast aside his bow and arrows and sat down on the seat of his chariot, his mind overwhelmed with grief.',
      },
    ],
  },
  {
    number: 2,
    name: 'The Yoga of Knowledge',
    sanskritName: 'Sankhya Yoga',
    summary: 'Krishna begins his teachings, revealing the immortality of the soul and the path of selfless action.',
    shlokas: [
      {
        number: '2.11',
        sanskrit: 'अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे ।\nगतासूनगतासूंश्च नानुशोचन्ति पण्डिताः ॥',
        transliteration: 'ashochyaan anvashochas tvam prajna-vaadaamsh cha bhaashase\ngataasoon agataasoomsh cha naanushochanti panditaah',
        meaning: 'You grieve for those who should not be grieved for, yet speak words of wisdom. The truly wise mourn neither for the living nor for the dead.',
      },
      {
        number: '2.20',
        sanskrit: 'न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ॥',
        transliteration: 'na jaayate mriyate vaa kadaachin\nnaayam bhootvaa bhavitaa vaa na bhooyah\najo nityah shaashvato ayam puraano\nna hanyate hanyamaane shareere',
        meaning: 'The soul is neither born, nor does it ever die. Having come into being once, it never ceases to be. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.',
      },
      {
        number: '2.47',
        sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
        transliteration: 'karmanye vaadhikaaraste maa phaleshu kadaachana\nmaa karma-phala-hetur bhoor maa te sango astv akarmani',
        meaning: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results, and never be attached to inaction.',
      },
    ],
  },
  {
    number: 3,
    name: 'The Yoga of Action',
    sanskritName: 'Karma Yoga',
    summary: 'Krishna explains the path of selfless action, performing one\'s duty without attachment to results.',
    shlokas: [
      {
        number: '3.19',
        sanskrit: 'तस्मादसक्तः सततं कार्यं कर्म समाचर ।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः ॥',
        transliteration: 'tasmaad asaktah satatam kaaryam karma samaachara\nasakto hy aacharan karma param aapnoti poorushah',
        meaning: 'Therefore, without attachment, always perform your duty efficiently, for by performing action without attachment, one attains the Supreme.',
      },
      {
        number: '3.35',
        sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् ।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥',
        transliteration: 'shreyaan sva-dharmo vigunah para-dharmaat sv-anushthitaat\nsva-dharme nidhanam shreyah para-dharmo bhayaavahah',
        meaning: 'It is far better to perform one\'s natural prescribed duty, though tinged with faults, than to perform another\'s prescribed duty perfectly. It is better to die performing one\'s own duty, for another\'s path is fraught with danger.',
      },
    ],
  },
  {
    number: 11,
    name: 'The Cosmic Vision',
    sanskritName: 'Vishvarupa Darshana Yoga',
    summary: 'Arjuna beholds the terrifying and awe-inspiring universal form of Krishna, containing all of creation.',
    shlokas: [
      {
        number: '11.32',
        sanskrit: 'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो\nलोकान्समाहर्तुमिह प्रवृत्तः ।',
        transliteration: 'kaalo asmi loka-kshaya-krit pravriddho\nlokaan samaahartu miha pravrittah',
        meaning: 'I am mighty Time, the destroyer of all. I have come here to consume all people.',
      },
      {
        number: '11.33',
        sanskrit: 'तस्मात्त्वमुत्तिष्ठ यशो लभस्व\nजित्वा शत्रून् भुङ्क्ष्व राज्यं समृद्धम् ।',
        transliteration: 'tasmaat tvam uttishtha yasho labhasva\njitvaa shatroon bhunkshva raajyam samriddham',
        meaning: 'Therefore, arise and attain glory. Conquer your enemies and enjoy a flourishing kingdom.',
      },
    ],
  },
]

export default function GitaPath() {
  const [activeChapter, setActiveChapter] = useState(0)
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  const chapter = CHAPTERS[activeChapter]

  function toggleBookmark(id: string) {
    setBookmarked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="gita-page">
      <div className="gita-page-header">
        <h1>Gita Path</h1>
        <p>The eternal song of the divine</p>
      </div>

      <div className="gita-layout">
        {/* Chapter Nav */}
        <nav className="gita-chapters">
          <h3>Chapters</h3>
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.number}
              className={`chapter-btn ${activeChapter === idx ? 'active' : ''}`}
              onClick={() => setActiveChapter(idx)}
            >
              <span className="chapter-num">{ch.number}</span>
              <div className="chapter-meta">
                <span className="chapter-name">{ch.name}</span>
                <span className="chapter-sanskrit">{ch.sanskritName}</span>
              </div>
              <ChevronRight size={14} strokeWidth={1.5} className="chapter-arrow" />
            </button>
          ))}
        </nav>

        {/* Shloka Display */}
        <div className="gita-content">
          <div className="gita-content-header">
            <div>
              <h2>Chapter {chapter.number}: {chapter.name}</h2>
              <span className="gita-sanskrit-title">{chapter.sanskritName}</span>
            </div>
          </div>
          <p className="gita-chapter-summary">{chapter.summary}</p>

          <div className="shloka-list">
            {chapter.shlokas.map((shloka) => (
              <div key={shloka.number} className="shloka-card">
                <div className="shloka-top">
                  <span className="shloka-number">Verse {shloka.number}</span>
                  <div className="shloka-actions">
                    <button
                      className={`shloka-action ${bookmarked.has(shloka.number) ? 'bookmarked' : ''}`}
                      onClick={() => toggleBookmark(shloka.number)}
                      title="Bookmark"
                    >
                      {bookmarked.has(shloka.number)
                        ? <BookmarkCheck size={16} strokeWidth={1.5} />
                        : <BookmarkPlus size={16} strokeWidth={1.5} />}
                    </button>
                    <button className="shloka-action" title="Listen">
                      <Volume2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <p className="shloka-sanskrit">{shloka.sanskrit}</p>
                <p className="shloka-transliteration">{shloka.transliteration}</p>
                <p className="shloka-meaning">{shloka.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
