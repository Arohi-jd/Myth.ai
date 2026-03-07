import { useState } from 'react'
import { X, Clock } from 'lucide-react'
import './KathaMandal.css'

interface Katha {
  title: string
  tradition: string
  era: string
  preview: string
  fullStory: string
  image: string
}

const KATHAS: Katha[] = [
  {
    title: 'The Churning of the Ocean',
    tradition: 'Hindu',
    era: 'Satya Yuga',
    preview: 'When devas and asuras united for the elixir of immortality, the cosmos itself became the vessel of transformation.',
    image: '/images/TheChurningoftheOcean.jpeg',
    fullStory: `In the beginning of a great cosmic epoch, the devas found themselves weakened by the curse of the sage Durvasa. The asuras, sensing opportunity, grew bold. Lord Vishnu, in his infinite wisdom, proposed an alliance — devas and asuras would churn the cosmic ocean together to obtain the Amrita, the nectar of immortality.

Mount Mandara became the churning rod, and Vasuki, the serpent king, became the rope. Vishnu himself, in the form of the great tortoise Kurma, descended to the ocean floor to bear the mountain upon his back.

As the churning began, terrible poisons arose first — the Halahala, a venom so potent it could destroy all creation. In that moment of cosmic peril, Lord Shiva stepped forward and drank the poison, holding it in his throat, which turned blue — earning him the name Neelakantha.

From the ocean emerged wonders: Kamadhenu the wish-fulfilling cow, Uchhaishravas the divine horse, Airavata the white elephant, the Kalpavriksha tree, the apsaras, Goddess Lakshmi herself, and finally — the physician Dhanvantari bearing the pot of Amrita.

The churning of the ocean teaches us that all great transformation requires patience, cooperation even with adversaries, and the willingness to endure poison before nectar emerges.`,
  },
  {
    title: 'Savitri and the Conquest of Death',
    tradition: 'Hindu',
    era: 'Ancient Times',
    preview: 'A devoted wife followed Yama, the God of Death, and through her wisdom and devotion won back her husband\'s life.',
    image: '/images/Savitri%20and%20the%20Conquest%20of%20Death.jpeg',
    fullStory: `Princess Savitri, daughter of King Ashwapati, was blessed with extraordinary beauty and wisdom. When she came of age, her father asked her to choose her own husband. She traveled the kingdoms and forests until she met Satyavan, a prince living as a woodcutter in exile with his blind father.

Despite the sage Narada warning her that Satyavan was destined to die within a year, Savitri chose him, declaring: "I have chosen my husband with my heart. I choose only once, in life or in death."

They married and lived in the forest. Savitri never told Satyavan of the prophecy, but as the fated day approached, she observed a three-day fast and kept vigil. On the destined day, she accompanied Satyavan to the forest. As he was chopping wood, he collapsed, complaining of a headache.

Savitri cradled his head in her lap. Suddenly, she saw a mighty figure approaching — Yama, the God of Death, draped in crimson, holding his noose. He extracted Satyavan's soul and began to walk south, toward his realm.

Savitri rose and followed. Yama commanded her to turn back, but she replied: "Where my husband goes, I must follow. This is the eternal duty of a devoted wife."

Impressed by her devotion, Yama offered her a boon — anything except Satyavan's life. She asked for her father-in-law's sight to be restored. Granted. She followed still.

Yama offered a second boon. She asked that her father be blessed with a hundred sons. Granted. Still she followed, reciting verses of wisdom and dharma.

Amazed by her knowledge, Yama offered a third boon. Savitri smiled and said: "Grant me a hundred sons born of Satyavan and me."

Yama, bound by his word and struck by her wisdom, laughed — a sound like distant thunder. "Clever daughter of the earth! To grant this boon, I must return your husband's life."

And so Satyavan's soul was restored. When he woke in his wife's arms, he said: "I dreamed we walked through strange lands together." Savitri smiled and replied: "Some dreams are journeys, beloved. We have returned."

The story of Savitri teaches us that unwavering devotion, wisdom, and the courage to question even death itself can alter the designs of fate.`,
  },
  {
    title: 'Prahlada and the Pillar of Faith',
    tradition: 'Hindu',
    era: 'Ancient Times',
    preview: 'A young prince\'s unshakable devotion to Vishnu defied his demon father, until the divine emerged from stone itself.',
    image: '/images/Prahlada%20and%20the%20Pillar%20of%20Faith.webp',
    fullStory: `Hiranyakashipu, the demon king, performed terrible austerities until Brahma granted him a boon: he could not be killed by man or beast, inside or outside, by day or by night, on earth or in sky, by any weapon created. Drunk with power, he declared himself the supreme god and demanded all worship be directed to him alone.

But his own son, young Prahlada, was born with devotion to Lord Vishnu flowing through his very soul. From his earliest breath, the boy chanted "Narayana, Narayana" — the sacred names of Vishnu.

Hiranyakashipu was enraged. He commanded his son: "Worship me! I am the only god!" But Prahlada, with the calm of ancient mountains, replied: "Father, Vishnu dwells in all things. He is in you, in me, in every grain of sand. I cannot worship the part and ignore the whole."

The demon king's fury knew no bounds. He ordered Prahlada thrown from a cliff — but the boy floated down like a feather. He had him trampled by elephants — but they bowed before the child. He had him bitten by serpents — but they could not pierce his skin. He had him cast into fire — but the flames became cool as moonlight.

Finally, Hiranyakashipu roared: "If your Vishnu is everywhere, is he in this pillar?" He struck a pillar in his throne room with his mace.

Prahlada calmly replied: "Yes, father. He is there too."

"Then let him save you now!" bellowed the demon, raising his sword.

At that instant, the pillar split open with a sound like creation itself being born. From within emerged Narasimha — the Man-Lion, neither man nor beast. It was twilight — neither day nor night. Narasimha dragged Hiranyakashipu to the threshold — neither inside nor outside. He placed the demon on his lap — neither earth nor sky. And with his claws — no weapon made by gods or mortals — he tore the demon king apart.

The cosmos itself seemed to tremble with Narasimha's rage. But young Prahlada approached fearlessly and bowed. At the touch of the devoted child, the divine fury subsided. Narasimha blessed him, saying: "You have proven that faith unbending is stronger than all the powers of the world."

Prahlada's story teaches us that genuine devotion cannot be destroyed by any force in creation, and that the divine protects those who surrender to truth with complete faith.`,
  },
  {
    title: 'King Harishchandra and the Throne of Truth',
    tradition: 'Hindu',
    era: 'Treta Yuga',
    preview: 'A king pledged to never speak a lie, and the gods themselves tested him by taking everything — kingdom, son, and dignity.',
    image: '/images/King%20Harishchandra%20and%20the%20Throne%20of%20Truth.jpg',
    fullStory: `King Harishchandra of the Solar Dynasty was renowned throughout the three worlds as Satyavadi — the speaker of truth. It was said that falsehood had never touched his lips, not even in jest.

One day, the sage Vishwamitra appeared at his court and demanded the dakshina (ritual payment) for a ceremony. Harishchandra, bound by dharma, agreed without asking the price. Vishwamitra demanded his entire kingdom.

Without hesitation, the king gave away his throne, his treasury, his palace — everything. He left the city as a pauper with only his wife Shaivya and infant son Rohitashva, wearing the simple clothes of commoners.

But Vishwamitra was not finished testing him. He demanded additional payment for the deed of transfer. Harishchandra had nothing. The sage gave him one month.

The royal family walked to the holy city of Kashi (Varanasi). To earn money, Harishchandra sold himself and his family into slavery. A Brahmin bought the queen and prince. A keeper of the cremation grounds bought the king himself.

Harishchandra spent his days among the funeral pyres, collecting the tax from grieving families who came to cremate their dead. The once-mighty king now lived in a hut beside the burning ghats, his hands stained with ash.

Months passed. One night, a woman came bearing the small body of a child. It was Shaivya, his beloved queen. Their son had been bitten by a serpent and died. She had no money to pay the cremation tax.

Harishchandra's heart shattered into a thousand pieces. But as the keeper of the grounds, he could not let even his own son be cremated without payment. His dharma demanded it. His wife wept: "I have nothing but this single cloth I wear."

With tears streaming down his face, bound by truth, Harishchandra said: "Then the law demands I take half of it as payment."

At that moment, the sky itself seemed to crack open. The gods had been watching. Vishwamitra revealed himself, declaring the test complete. The keeper of the cremation grounds revealed himself as Yama, the God of Death. The child Rohitashva sat up, alive — it had been divine illusion.

Indra himself descended and said: "Harishchandra, you have proven that truth is more precious than kingdom, comfort, or even the life of one's own child. Your name shall be eternal — Satyavadi Raja, the King of Truth."

Harishchandra was restored to his kingdom, his family reunited. But the story teaches us that dharma may demand terrible sacrifices, and that truth upheld at any cost is the highest worship.`,
  },
  {
    title: 'Rama and the Bridge of Devotion',
    tradition: 'Hindu',
    era: 'Treta Yuga',
    preview: 'An army of devoted vanara built a bridge across the ocean, each stone inscribed with the name of the divine.',
    image: '/images/Rama%20and%20the%20Bridge%20of%20Devotion.jpg',
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
            <div className="katha-card-image">
              <img src={katha.image} alt={katha.title} loading="lazy" />
              <div className="katha-image-overlay" />
            </div>
            <div className="katha-card-content">
              <h3>{katha.title}</h3>
              <div className="katha-meta">
                <Clock size={12} strokeWidth={1.5} />
                <span>{katha.era}</span>
              </div>
              <p className="katha-preview">{katha.preview}</p>
              <div className="katha-scroll-edge" />
            </div>
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
            <div className="katha-modal-image">
              <img src={openKatha.image} alt={openKatha.title} />
            </div>
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
