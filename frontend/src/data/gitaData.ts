export interface Shloka {
  number: string
  sanskrit: string
  transliteration: string
  meaning: string
}

export interface Chapter {
  number: number
  name: string
  sanskritName: string
  summary: string
  shlokas: Shloka[]
}

export const GITA_CHAPTERS: Chapter[] = [
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
    number: 4,
    name: 'The Yoga of Wisdom',
    sanskritName: 'Jnana Karma Sanyasa Yoga',
    summary: 'Krishna reveals the science of self-realization and the divine purpose of His incarnations.',
    shlokas: [
      {
        number: '4.7',
        sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
        transliteration: 'yadaa yadaa hi dharmasya glaanir bhavati bhaarata\nabhyutthaanam adharmasya tadaatmaanam srijaamyaham',
        meaning: 'Whenever there is a decline of righteousness and a rise of unrighteousness, O Arjuna, then I manifest Myself.',
      },
      {
        number: '4.8',
        sanskrit: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम् ।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥',
        transliteration: 'paritraanaaya sadhoonaam vinaashaaya cha dushkritaam\ndharma-samsthaapaanaarthaaya sambhavaami yuge yuge',
        meaning: 'To protect the righteous, to annihilate the wicked, and to reestablish the principles of dharma, I appear millennium after millennium.',
      },
    ],
  },
  {
    number: 5,
    name: 'The Yoga of Renunciation',
    sanskritName: 'Karma Sanyasa Yoga',
    summary: 'Krishna describes the paths of renunciation and selfless service, explaining they lead to the same goal.',
    shlokas: [
      {
        number: '5.10',
        sanskrit: 'ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः ।\nलिप्यते न स पापेन पद्मपत्रमिवाम्भसा ॥',
        transliteration: 'brahmany aadhaaya karmaani sangam tyaktvaa karoti yah\nlipyate na sa paapena padma-patram ivaambhasaa',
        meaning: 'One who performs their duty without attachment, surrendering the results unto the Supreme, is unaffected by sinful action, as the lotus leaf is untouched by water.',
      },
    ],
  },
  {
    number: 6,
    name: 'The Yoga of Meditation',
    sanskritName: 'Dhyana Yoga',
    summary: 'Krishna explains the eightfold path of yoga and the practice of meditation for self-realization.',
    shlokas: [
      {
        number: '6.5',
        sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥',
        transliteration: 'uddhared aatmanaatmaanam naatmaanamavasaadayet\naatmaiva hyaatmano bandhur aatmaiva ripur aatmanah',
        meaning: 'One must elevate, not degrade, oneself by one\'s own mind. The mind alone is one\'s friend as well as one\'s enemy.',
      },
      {
        number: '6.35',
        sanskrit: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम् ।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥',
        transliteration: 'asamshayam mahaabaaho mano durnigraham chalam\nabhyaasena tu kaunteya vairaagyena cha grihyate',
        meaning: 'Undoubtedly, O mighty-armed one, the mind is restless and difficult to control. But by practice and detachment, it can be controlled.',
      },
    ],
  },
  {
    number: 7,
    name: 'The Yoga of Knowledge and Wisdom',
    sanskritName: 'Jnana Vijnana Yoga',
    summary: 'Krishna reveals His divine nature and the different aspects of His manifestation.',
    shlokas: [
      {
        number: '7.3',
        sanskrit: 'मनुष्याणां सहस्रेषु कश्चिद्यतति सिद्धये ।\nयततामपि सिद्धानां कश्चिन्मां वेत्ति तत्त्वतः ॥',
        transliteration: 'manushyaanaam sahasreshu kashchid yatati siddhaye\nyatataамapi siddhaanaam kashchin maam vetti tattvatah',
        meaning: 'Among thousands of persons, hardly one strives for perfection; and among those who strive and succeed, hardly one knows Me in truth.',
      },
    ],
  },
  {
    number: 8,
    name: 'The Yoga of the Imperishable Brahman',
    sanskritName: 'Aksara Brahma Yoga',
    summary: 'Krishna explains the nature of the Supreme, the imperishable Brahman, and the path after death.',
    shlokas: [
      {
        number: '8.7',
        sanskrit: 'तस्मात्सर्वेषु कालेषु मामनुस्मर युध्य च ।\nमय्यर्पितमनोबुद्धिर्मामेवैष्यस्यसंशयः ॥',
        transliteration: 'tasmaat sarveshu kaaleshu maam anusmara yudhya cha\nmayy arpita-mano-buddhir maam evaishyasy asanshayah',
        meaning: 'Therefore, Arjuna, always remember Me and fight. With your mind and intellect surrendered to Me, you will surely attain Me.',
      },
    ],
  },
  {
    number: 9,
    name: 'The Yoga of Royal Knowledge',
    sanskritName: 'Raja Vidya Raja Guhya Yoga',
    summary: 'Krishna reveals the most confidential knowledge about His supreme nature and devotional service.',
    shlokas: [
      {
        number: '9.22',
        sanskrit: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते ।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥',
        transliteration: 'ananyaash chintayanto maam ye janaah paryupaasate\nteshaam nityaabhiyuktaanaam yoga-kshemam vahaamyaham',
        meaning: 'To those who are constantly devoted and who worship Me with love, I give the understanding by which they can come to Me.',
      },
      {
        number: '9.27',
        sanskrit: 'यत्करोषि यदश्नासि यज्जुहोषि ददासि यत् ।\nयत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम् ॥',
        transliteration: 'yat karoshi yad ashnaasi yaj juhoshi dadaasi yat\nyat tapasyasi kaunteya tat kurushva mad-arpanam',
        meaning: 'Whatever you do, whatever you eat, whatever you offer, whatever you give, whatever you practice as austerity—do it all as an offering to Me.',
      },
    ],
  },
  {
    number: 10,
    name: 'The Yoga of Divine Manifestations',
    sanskritName: 'Vibhuti Yoga',
    summary: 'Krishna describes His divine glories and manifestations throughout creation.',
    shlokas: [
      {
        number: '10.20',
        sanskrit: 'अहमात्मा गुडाकेश सर्वभूताशयस्थितः ।\nअहमादिश्च मध्यं च भूतानामन्त एव च ॥',
        transliteration: 'aham aatmaa gudaakesha sarva-bhootaashaya-sthitah\naham aadish cha madhyam cha bhootaanaam anta eva cha',
        meaning: 'I am the Self, O Arjuna, seated in the hearts of all beings. I am the beginning, the middle, and also the end of all beings.',
      },
    ],
  },
  {
    number: 11,
    name: 'The Yoga of the Cosmic Vision',
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
  {
    number: 12,
    name: 'The Yoga of Devotion',
    sanskritName: 'Bhakti Yoga',
    summary: 'Krishna explains the path of devotion and the qualities of a true devotee.',
    shlokas: [
      {
        number: '12.13',
        sanskrit: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥',
        transliteration: 'adveshtaa sarva-bhootaanaam maitrah karuna eva cha\nnirmamo nirahankaаrah sama-duhkha-sukhah kshamee',
        meaning: 'One who is not envious but a kind friend to all living beings, who does not think of themselves as a proprietor, free from false ego, equal in both happiness and distress, and forgiving.',
      },
    ],
  },
  {
    number: 13,
    name: 'The Yoga of Distinction',
    sanskritName: 'Kshetra Kshetrajna Vibhaga Yoga',
    summary: 'Krishna distinguishes between the physical body (the field) and the soul (the knower of the field).',
    shlokas: [
      {
        number: '13.2',
        sanskrit: 'इदं शरीरं कौन्तेय क्षेत्रमित्यभिधीयते ।\nएतद्यो वेत्ति तं प्राहुः क्षेत्रज्ञ इति तद्विदः ॥',
        transliteration: 'idam shareeram kaunteya kshetram ity abhidheeyate\netad yo vetti tam praahuh kshetra-jna iti tad-vidah',
        meaning: 'This body, O son of Kunti, is called the field, and one who knows this body is called the knower of the field.',
      },
    ],
  },
  {
    number: 14,
    name: 'The Yoga of the Three Qualities',
    sanskritName: 'Gunatraya Vibhaga Yoga',
    summary: 'Krishna explains the three modes of material nature: goodness, passion, and ignorance.',
    shlokas: [
      {
        number: '14.20',
        sanskrit: 'गुणानेतानतीत्य त्रीन्देही देहसमुद्भवान् ।\nजन्ममृत्युजरादुःखैर्विमुक्तोऽमृतमश्नुते ॥',
        transliteration: 'gunaan etaan ateetya treen dehee deha-samudbhavaan\njanma-mrityu-jaraa-duhkhair vimukto amritam ashnute',
        meaning: 'When the embodied being is able to transcend these three modes, they become free from birth, death, old age, and their distresses, and can enjoy immortality.',
      },
    ],
  },
  {
    number: 15,
    name: 'The Yoga of the Supreme Person',
    sanskritName: 'Purushottama Yoga',
    summary: 'Krishna describes the eternal tree of life and Himself as the Supreme Personality of Godhead.',
    shlokas: [
      {
        number: '15.7',
        sanskrit: 'ममैवांशो जीवलोके जीवभूतः सनातनः ।\nमनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति ॥',
        transliteration: 'mamaivaamso jeeva-loke jeeva-bhootah sanaatanah\nmanah-shashthaaneendriyaani prakriti-sthaani karshati',
        meaning: 'The living entities in this conditioned world are My eternal fragmental parts. Due to conditioned life, they are struggling very hard with the six senses, which include the mind.',
      },
    ],
  },
  {
    number: 16,
    name: 'The Yoga of Divine and Demoniac Qualities',
    sanskritName: 'Daivasura Sampad Vibhaga Yoga',
    summary: 'Krishna describes the divine and demoniac natures and their respective destinies.',
    shlokas: [
      {
        number: '16.1',
        sanskrit: 'अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितिः ।\nदानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम् ॥',
        transliteration: 'abhayam sattva-samshuddhir jnaana-yoga-vyavasthitih\ndaanam damash cha yajnash cha svaadhyaayas tapa aarjavam',
        meaning: 'Fearlessness, purification of one\'s existence, cultivation of spiritual knowledge, charity, self-control, performance of sacrifice, study of the Vedas, austerity, and simplicity.',
      },
    ],
  },
  {
    number: 17,
    name: 'The Yoga of the Three Divisions of Faith',
    sanskritName: 'Shraddhatraya Vibhaga Yoga',
    summary: 'Krishna explains how the three modes of nature influence faith, worship, food, and austerities.',
    shlokas: [
      {
        number: '17.3',
        sanskrit: 'सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत ।\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः ॥',
        transliteration: 'sattvaanuroopaa sarvasya shraddhaa bhavati bhaarata\nshraddhaa-mayo ayam purusho yo yach-chraddhah sa eva sah',
        meaning: 'The faith of each person, O Bharata, is in accordance with their nature. A person consists of their faith; as is their faith, so are they.',
      },
    ],
  },
  {
    number: 18,
    name: 'The Yoga of Liberation through Renunciation',
    sanskritName: 'Moksha Sanyasa Yoga',
    summary: 'Krishna summarizes the entire teaching of the Gita, emphasizing complete surrender to the Divine.',
    shlokas: [
      {
        number: '18.65',
        sanskrit: 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु ।\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे ॥',
        transliteration: 'man-manaa bhava mad-bhakto mad-yaajee maam namaskuru\nmaam evaishyasi satyam te pratijaane priyo asi me',
        meaning: 'Always think of Me, become My devotee, worship Me, and offer your homage unto Me. Thus you will come to Me without fail. I promise you this because you are My very dear friend.',
      },
      {
        number: '18.66',
        sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
        transliteration: 'sarva-dharmaan parityajya maam ekam sharanam vraja\naham tvaam sarva-paapebhyo mokshayishyaami maa shuchah',
        meaning: 'Abandon all varieties of dharmas and simply surrender unto Me alone. I shall liberate you from all sinful reactions; do not fear.',
      },
      {
        number: '18.78',
        sanskrit: 'यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः ।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ॥',
        transliteration: 'yatra yogeshvarah krishno yatra paartho dhanur-dharah\ntatra shreer vijayo bhootir dhruva neetir matir mama',
        meaning: 'Wherever there is Krishna, the master of all mystics, and wherever there is Arjuna, the supreme archer, there will also certainly be opulence, victory, extraordinary power, and morality. That is my opinion.',
      },
    ],
  },
]
