import { useState } from 'react'
import { X, Clock, BookOpen } from 'lucide-react'
import './KathaMandal.css'

interface Katha {
  title: string
  tradition: string
  era: string
  preview: string
  fullStory: string
}

const KATHAS: Katha[] = [
  {
    title: 'The Churning of the Ocean',
    tradition: 'Hindu',
    era: 'Satya Yuga',
    preview: 'When devas and asuras united for the elixir of immortality, the cosmos itself became the vessel of transformation.',
    fullStory: `In the beginning of a great cosmic epoch, the devas found themselves weakened by the curse of the sage Durvasa. The asuras, sensing opportunity, grew bold. Lord Vishnu, in his infinite wisdom, proposed an alliance — devas and asuras would churn the cosmic ocean together to obtain the Amrita, the nectar of immortality.

Mount Mandara became the churning rod, and Vasuki, the serpent king, became the rope. Vishnu himself, in the form of the great tortoise Kurma, descended to the ocean floor to bear the mountain upon his back.

As the churning began, terrible poisons arose first — the Halahala, a venom so potent it could destroy all creation. In that moment of cosmic peril, Lord Shiva stepped forward and drank the poison, holding it in his throat, which turned blue — earning him the name Neelakantha.

From the ocean emerged wonders: Kamadhenu the wish-fulfilling cow, Uchhaishravas the divine horse, Airavata the white elephant, the Kalpavriksha tree, the apsaras, Goddess Lakshmi herself, and finally — the physician Dhanvantari bearing the pot of Amrita.

The churning of the ocean teaches us that all great transformation requires patience, cooperation even with adversaries, and the willingness to endure poison before nectar emerges.`,
  },
  {
    title: 'Prometheus and the Gift of Fire',
    tradition: 'Greek',
    era: 'Age of Titans',
    preview: 'A Titan defied the gods to gift mortals the sacred flame — and paid the eternal price for compassion.',
    fullStory: `In the age when the world was young and gods walked freely upon the earth, Prometheus the Titan looked upon humanity with deep compassion. Mortals shivered in darkness, ate raw flesh, and lived little better than beasts.

Zeus, king of the gods, had decreed that fire — the essence of civilization itself — would remain the sole province of the divine. But Prometheus, whose very name means "forethought," saw a different path.

Under cover of night, he ascended to Mount Olympus and stole a glowing ember from the chariot of Helios, concealing it within the hollow stalk of a fennel plant. He descended to earth and gifted the flame to mortals.

With fire came everything: warmth, cooked food, metalwork, pottery, the forging of tools and weapons. Civilization itself was born from that single stolen spark.

Zeus was furious beyond measure. He chained Prometheus to a rock in the Caucasus mountains, where each day a great eagle would devour his liver, and each night it would regenerate, only to be consumed again.

For thirty thousand years Prometheus endured, until Heracles finally freed him. His sacrifice remains the eternal testament that compassion for the powerless is worth any price the powerful may exact.`,
  },
  {
    title: 'The Descent of Inanna',
    tradition: 'Sumerian',
    era: 'Ancient Mesopotamia',
    preview: 'The Queen of Heaven descended through seven gates of the underworld, shedding her power at each threshold.',
    fullStory: `Inanna, Queen of Heaven, Goddess of Love and War, greatest of the Sumerian deities, resolved to descend to Kur — the underworld — ruled by her sister Ereshkigal.

Before departing, she instructed her faithful servant Ninshubur: "If I do not return in three days, appeal to the gods for my rescue."

At the first gate, the gatekeeper demanded she surrender her crown. At the second, her lapis lazuli necklace. At the third, her breast plate. At each of the seven gates, she was stripped of another emblem of her divine power — her ring, her measuring rod, her garments — until she stood naked and powerless before Ereshkigal.

Ereshkigal fixed upon her the eye of death, and Inanna was struck down, her corpse hung upon a hook on the wall.

Three days passed. Ninshubur wept and pleaded before the gods. Enki, god of wisdom, fashioned two beings from the dirt beneath his fingernails and sent them to the underworld with the food and water of life.

They sprinkled it upon Inanna's corpse, and she rose. But the underworld demanded a substitute. Inanna ascended through the seven gates, reclaiming her power at each threshold.

The descent teaches us that true transformation requires the willingness to be stripped bare, to face death, and to rise renewed — carrying the wisdom of the depths.`,
  },
  {
    title: 'The Binding of Fenrir',
    tradition: 'Norse',
    era: 'Age of the Aesir',
    preview: 'The gods bound the great wolf with a ribbon woven from impossible things — and the price was a god\'s right hand.',
    fullStory: `Among the monstrous children of Loki was Fenrir, a wolf of terrifying power. The gods raised him in Asgard, but as he grew, his strength became a menace. Prophecy foretold that Fenrir would devour Odin himself at Ragnarok.

The gods forged Laeding, a mighty chain, and challenged Fenrir to test his strength. The wolf snapped it like thread. They forged Dromi, twice as strong. Fenrir shattered it with ease, and his fame grew.

In desperation, the gods commissioned the dwarves of Svartalfheim. They crafted Gleipnir — a ribbon thin as silk, woven from six impossible things: the sound of a cat's footstep, the beard of a woman, the roots of a mountain, the sinews of a bear, the breath of a fish, and the spittle of a bird. This is why these things no longer exist in the world.

Fenrir was suspicious. He agreed to be bound only if one of the gods placed a hand in his jaws as a pledge of good faith. Only Tyr, god of honor and justice, was brave enough to volunteer.

When Fenrir found he could not break free, he bit off Tyr's right hand. The wolf was bound upon a desolate island, a sword wedged between his jaws so his howls would echo until the end of days.

At Ragnarok, Gleipnir will break, and the great wolf will run free. The binding of Fenrir teaches us that containing chaos always demands sacrifice — and that even the mightiest bonds are temporary.`,
  },
  {
    title: 'Rama and the Bridge of Devotion',
    tradition: 'Hindu',
    era: 'Treta Yuga',
    preview: 'An army of devoted vanara built a bridge across the ocean, each stone inscribed with the name of the divine.',
    fullStory: `When Sita, beloved wife of Lord Rama, was abducted by the demon king Ravana and taken to the island fortress of Lanka, Rama stood upon the southern shore of Bharat and gazed across the vast ocean with tears in his eyes.

The mighty Vanara army, led by the devoted Hanuman, stood ready. But the ocean stretched endlessly before them. Rama meditated upon the shore for three days, asking the ocean for passage. When the ocean did not respond, Rama raised his divine bow in fury.

Samudra, lord of the ocean, appeared and said: "My lord, I cannot defy my nature. But Nala and Neela among your army possess a divine gift — whatever they cast into my waters, I shall hold afloat."

And so the great bridge, Rama Setu, began to rise. Every vanara contributed — carrying boulders, trees, and stones. The squirrels too came, rolling in sand and shaking it from their fur to fill the cracks. Rama, moved by their devotion, stroked a squirrel's back with three fingers, and to this day, Indian squirrels bear three stripes upon their backs.

Each stone was inscribed with the name "Rama," and by his grace, even rocks floated upon the water. In five days, the bridge stretched across the ocean.

The bridge of Rama teaches us that no obstacle is insurmountable when met with devotion, unity, and the willingness of even the smallest among us to contribute what they can.`,
  },
]

export default function KathaMandal() {
  const [openKatha, setOpenKatha] = useState<Katha | null>(null)

  return (
    <div className="katha-page">
      <div className="katha-page-header">
        <h1>Katha Mandal</h1>
        <p>Sacred stories from the ancient world</p>
      </div>

      <div className="katha-grid">
        {KATHAS.map((katha) => (
          <button
            key={katha.title}
            className="katha-card"
            onClick={() => setOpenKatha(katha)}
          >
            <div className="katha-card-top">
              <BookOpen size={20} strokeWidth={1.2} className="katha-icon" />
              <span className="katha-tradition">{katha.tradition}</span>
            </div>
            <h3>{katha.title}</h3>
            <div className="katha-meta">
              <Clock size={12} strokeWidth={1.5} />
              <span>{katha.era}</span>
            </div>
            <p className="katha-preview">{katha.preview}</p>
            <div className="katha-scroll-edge" />
          </button>
        ))}
      </div>

      {/* Story Modal */}
      {openKatha && (
        <div className="katha-modal-overlay" onClick={() => setOpenKatha(null)}>
          <div className="katha-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenKatha(null)}>
              <X size={20} strokeWidth={1.5} />
            </button>
            <div className="katha-scroll-header">
              <span className="katha-modal-tradition">{openKatha.tradition} — {openKatha.era}</span>
              <h2>{openKatha.title}</h2>
            </div>
            <div className="katha-scroll-body">
              {openKatha.fullStory.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
