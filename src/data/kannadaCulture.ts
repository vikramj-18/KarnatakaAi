export interface KannadaPhrase {
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  category: 'Greetings' | 'Directions & Travel' | 'Dining & Food' | 'Shopping & Bargaining' | 'Emergencies';
  audioHint: string;
}

export const KANNADA_PHRASES: KannadaPhrase[] = [
  {
    id: 'p1',
    kannada: 'ನಮಸ್ಕಾರ',
    transliteration: 'Namaskara',
    english: 'Hello / Greetings (respectful)',
    category: 'Greetings',
    audioHint: 'Nah-mas-kaa-ra',
  },
  {
    id: 'p2',
    kannada: 'ಹೇಗಿದ್ದೀರಾ?',
    transliteration: 'Hegiddira?',
    english: 'How are you?',
    category: 'Greetings',
    audioHint: 'Hay-gid-dee-raa?',
  },
  {
    id: 'p3',
    kannada: 'ಚೆನ್ನಾಗಿದ್ದೀನಿ',
    transliteration: 'Chennagiddini',
    english: 'I am doing well',
    category: 'Greetings',
    audioHint: 'Chen-naa-gid-dee-nee',
  },
  {
    id: 'p4',
    kannada: 'ಧನ್ಯವಾದಗಳು',
    transliteration: 'Dhanyavadagalu',
    english: 'Thank you very much',
    category: 'Greetings',
    audioHint: 'Dhun-ya-vaa-da-ga-loo',
  },
  {
    id: 'p5',
    kannada: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
    transliteration: 'Idara bele eshtu?',
    english: 'How much does this cost?',
    category: 'Shopping & Bargaining',
    audioHint: 'Ih-da-ra beh-leh esh-too?',
  },
  {
    id: 'p6',
    kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ',
    transliteration: 'Svalpa kadime maadi',
    english: 'Please reduce the price a little',
    category: 'Shopping & Bargaining',
    audioHint: 'Swul-pa kuh-di-meh maa-dee',
  },
  {
    id: 'p7',
    kannada: 'ಊಟ ಆಯ್ತಾ?',
    transliteration: 'Oota aitha?',
    english: 'Did you have food? (Quintessential Kannada greeting showing warmth)',
    category: 'Dining & Food',
    audioHint: 'Oo-taa eye-thaa?',
  },
  {
    id: 'p8',
    kannada: 'ಖಾರ ಕಡಿಮೆ ಹಾಕಿ',
    transliteration: 'Khara kadime haaki',
    english: 'Please make it less spicy',
    category: 'Dining & Food',
    audioHint: 'Khaa-ra kuh-di-meh haa-kee',
  },
  {
    id: 'p9',
    kannada: 'ಒಂದು ಕಪ್ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ',
    transliteration: 'Ondu cup filter coffee kodi',
    english: 'Please give one cup of filter coffee',
    category: 'Dining & Food',
    audioHint: 'On-doo cup filter coffee koh-dee',
  },
  {
    id: 'p10',
    kannada: 'ಈ ಜಾಗಕ್ಕೆ ಹೇಗೆ ಹೋಗಬೇಕು?',
    transliteration: 'Ee jaagakke hege hogabeku?',
    english: 'How do I reach this place?',
    category: 'Directions & Travel',
    audioHint: 'Ee jaa-guk-keh hay-geh hoh-ga-beh-koo?',
  },
  {
    id: 'p11',
    kannada: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿ ಇದೆ?',
    transliteration: 'Bus nildana elli ide?',
    english: 'Where is the bus stand?',
    category: 'Directions & Travel',
    audioHint: 'Bus nil-daa-na el-lee ee-deh?',
  },
  {
    id: 'p12',
    kannada: 'ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ',
    transliteration: 'Dayavittu sahaaya maadi',
    english: 'Please help me',
    category: 'Emergencies',
    audioHint: 'Dah-yah-vit-too suh-haa-ya maa-dee',
  },
  {
    id: 'p13',
    kannada: 'ನನಗೆ ಕನ್ನಡ ಸ್ವಲ್ಪ ಗೊತ್ತು',
    transliteration: 'Nanage Kannada svalpa gottu',
    english: 'I know a little Kannada (locals love hearing this!)',
    category: 'Greetings',
    audioHint: 'Nuh-nuh-geh Kun-nuh-da swul-pa gote-too',
  },
];

export interface RegionalCuisine {
  regionName: string;
  description: string;
  signatureDishes: {
    name: string;
    kannadaName: string;
    description: string;
    dietary: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';
    bestPlaceToEat: string;
  }[];
}

export const REGIONAL_CUISINES: RegionalCuisine[] = [
  {
    regionName: 'Karavali (Coastal Karnataka & Udupi)',
    description: 'Coconut, curry leaves, kokum, tamarind, and fresh Arabian sea catch or pure sattvic temple cooking.',
    signatureDishes: [
      {
        name: 'Neer Dosa with Chutney & Sambar',
        kannadaName: 'ನೀರ್ ದೋಸೆ',
        description: 'Delicate, cloud-soft crepes made of unfermented rice batter served with spicy coconut chutney and jaggery coconut milk.',
        dietary: 'Vegan',
        bestPlaceToEat: 'Woodlands Restaurant or Mitra Samaj, Udupi',
      },
      {
        name: 'Mangalore Buns',
        kannadaName: 'ಮಂಗಳೂರು ಬನ್ಸ್',
        description: 'Fluffy, mildly sweet fermented banana pooris deep fried to golden perfection, served with spicy coconut chutney.',
        dietary: 'Vegetarian',
        bestPlaceToEat: 'Diana Restaurant, Udupi & City Lunch Home, Mangaluru',
      },
      {
        name: 'Anjal (Kingfish) Tawa Fry / Ghee Roast',
        kannadaName: 'ಅಂಜಲ್ ತವಾ ಫ್ರೈ',
        description: 'Fresh kingfish marinated in Kundapura byadgi chilli paste and slow-roasted on an iron tawa with pure desi ghee.',
        dietary: 'Non-Vegetarian',
        bestPlaceToEat: 'Machali Restaurant, Mangaluru',
      },
      {
        name: 'Kori Rotti',
        kannadaName: 'ಕೋರಿ ರೊಟ್ಟಿ',
        description: 'Crisp, wafer-thin sun-dried rice sheets drenched in a fiery, aromatic coastal coconut chicken gravy.',
        dietary: 'Non-Vegetarian',
        bestPlaceToEat: 'Hotel Narayana, Bunder, Mangaluru',
      },
    ],
  },
  {
    regionName: 'Malenadu & Kodagu (Western Ghats & Coorg)',
    description: 'Earthy forest produce, bamboo shoots, wild mushrooms, black pepper, and hearty steamed rice cakes.',
    signatureDishes: [
      {
        name: 'Kadambuttu with Pandi Curry / Wild Mushroom Curry',
        kannadaName: 'ಕದಂಬುಟ್ಟು ಮತ್ತು ಪಾಂಡಿ ಕರಿ',
        description: 'Steamed crushed rice spheres paired with authentic Coorg curry flavored with Kachampuli (dark wild Garcinia gummi-gutta vinegar).',
        dietary: 'Non-Vegetarian',
        bestPlaceToEat: 'Coorg Cuisine Restaurant or Taste of Coorg, Madikeri',
      },
      {
        name: 'Akki Rotti with Ellu Pajji',
        kannadaName: 'ಅಕ್ಕಿ ರೊಟ್ಟಿ',
        description: 'Rice flour flatbread kneaded with chopped dill leaves (sabbasige soppu), onions, green chillies, served with sesame chutney.',
        dietary: 'Vegan',
        bestPlaceToEat: 'Homestays across Chikkamagaluru & Sakleshpur',
      },
      {
        name: 'Halasina Hannina Kadubu (Steamed Jackfruit Cake)',
        kannadaName: 'ಹಲಸಿನ ಹಣ್ಣಿನ ಕಡುಬು',
        description: 'Sweet Malnad specialty made from ripe sweet jackfruit pulp and broken rice, wrapped and steamed in aromatic teak leaves.',
        dietary: 'Vegan',
        bestPlaceToEat: 'Local Malnad estate kitchens during June-August harvest',
      },
    ],
  },
  {
    regionName: 'Old Mysuru & Bengaluru',
    description: 'Rich royal heritage sweets, crispy butter dosas, ragi mudde, and iconic filter coffee.',
    signatureDishes: [
      {
        name: 'Authentic Mysore Pak',
        kannadaName: 'ಮೈಸೂರು ಪಾಕ್',
        description: 'Melt-in-mouth royal sweet invented in 1935 in the royal kitchen of Krishna Raja Wadiyar IV using besan, sugar, and generous desi ghee.',
        dietary: 'Vegetarian',
        bestPlaceToEat: 'Guru Sweet Mart (Sayyaji Rao Rd), Mysuru',
      },
      {
        name: 'Mylari Butter Masala Dosa',
        kannadaName: 'ಮೈಲಾರಿ ಮಸಾಲ ದೋಸೆ',
        description: 'Fluffy, cloud-like dosa crisped on the outside with fresh unsalted white butter and stuffed with special spiced onion filling.',
        dietary: 'Vegetarian',
        bestPlaceToEat: 'Original Vinayaka Mylari, Nazarbad, Mysuru',
      },
      {
        name: 'Ragi Mudde with Nati Koli Saaru / Bassaru',
        kannadaName: 'ರಾಗಿ ಮುದ್ದೆ',
        description: 'Nutritious steamed finger-millet balls swallowed with slow-cooked country chicken or lentil-greens clear spiced soup.',
        dietary: 'Non-Vegetarian',
        bestPlaceToEat: 'Military hotels across Bengaluru and Mysuru',
      },
      {
        name: 'Bisi Bele Bath',
        kannadaName: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
        description: 'Spicy, tangy, aromatic rice, toor dal, and vegetable stew finished with roasted cashew nuts and spiced boondi on top.',
        dietary: 'Vegetarian',
        bestPlaceToEat: 'MTR (Mavalli Tiffin Room) Lalbagh Road, Bengaluru',
      },
    ],
  },
  {
    regionName: 'Uttara & Kalyana Karnataka (North Plains)',
    description: 'Healthy millet rotis, spicy lentil gravies, groundnut chutneys, and rich milk pedas.',
    signatureDishes: [
      {
        name: 'Jolada Rotti with Yennegai & Shenga Chutney',
        kannadaName: 'ಜೋಳದ ರೊಟ್ಟಿ ಮತ್ತು ಎಣ್ಣೆಗಾಯಿ',
        description: 'Unleavened sorghum (jowar) rotis served with baby brinjals stuffed with peanut-spice paste and dry roasted garlic-groundnut powder.',
        dietary: 'Vegan',
        bestPlaceToEat: 'Khanavalis in Hubballi, Dharwad, and Badami',
      },
      {
        name: 'Dharwad Peda',
        kannadaName: 'ಧಾರವಾಡ ಪೇಡ',
        description: 'Famous GI-tagged caramelized mawa sweet coated with castor sugar, perfected by the Thakur family since the 19th century.',
        dietary: 'Vegetarian',
        bestPlaceToEat: 'Babu Singh Thakur Pedha, Dharwad',
      },
    ],
  },
];

export interface SeasonalGuideline {
  seasonName: string;
  months: string;
  status: 'Peak Best Window' | 'Monsoon Adventure' | 'Lush Post-Monsoon' | 'Pleasant Winter' | 'Summer Caution';
  westernGhatsAdvice: string;
  coastalAdvice: string;
  heritagePlainsAdvice: string;
  trekkingPermitStatus: string;
  safetyCautions: string[];
}

export const KARNATAKA_SEASONAL_INTELLIGENCE: SeasonalGuideline[] = [
  {
    seasonName: 'Southwest Monsoon',
    months: 'June to August',
    status: 'Monsoon Adventure',
    westernGhatsAdvice: 'Spectacular waterfalls at peak force (Jog, Abbey, Hebbe). Lush emerald rainforest canopy, mist-covered mountain passes. Drive carefully on ghat roads due to occasional rockfalls and thick fog.',
    coastalAdvice: 'Arabian Sea is extremely rough. Swimming and watersports strictly prohibited. St. Mary’s Island ferry suspended. However, scenic coastal drives and beach viewing from promenades are dramatic.',
    heritagePlainsAdvice: 'Comfortable cloudy weather in Hampi and Badami. Rains wash the red sandstone and granite ruins clean. Low tourist crowds.',
    trekkingPermitStatus: 'Forest department strictly closes high-altitude peaks (Kudremukh, Netravati, Kumaraparvatha) during heavy rainfall warnings for visitor safety.',
    safetyCautions: [
      'Do not venture into surging river currents or slippery waterfall bases.',
      'Always keep offline road maps downloaded as cellular signals weaken in foggy ghats.',
      'Carry waterproof dry-bags for cameras and wear leech-protection socks on forest walks.',
    ],
  },
  {
    seasonName: 'Post-Monsoon & Autumn',
    months: 'September to November',
    status: 'Peak Best Window',
    westernGhatsAdvice: 'Golden window: waterfalls are full, coffee berries begin ripening from green to red, skies are clear blue, and mornings feature iconic valley mist.',
    coastalAdvice: 'Beaches reopen for swimming in October; water sport operators resume at Gokarna, Malpe, and Kaup.',
    heritagePlainsAdvice: 'World-famous Mysuru Dasara (October) with illuminated palaces and royal elephant processions. Excellent weather for exploring Hampi and Badami.',
    trekkingPermitStatus: 'Online booking permits through Karnataka Eco-Tourism portal open for approved trails.',
    safetyCautions: [
      'Book Mysuru hotels weeks ahead during Dasara festival.',
      'Sunscreen and hats recommended for afternoon exploration in Hampi ruins.',
    ],
  },
  {
    seasonName: 'Winter Haven',
    months: 'December to February',
    status: 'Pleasant Winter',
    westernGhatsAdvice: 'Chilly crisp mornings (temperatures dropping to 12-14°C in Madikeri & Mullayanagiri). Coffee blossoming fragrance fills the air in late February.',
    coastalAdvice: 'Idyllic beach weather with calm turquoise seas, gentle sea breezes, and dazzling sunsets.',
    heritagePlainsAdvice: 'Prime season for Hampi Utsav and Pattadakal Dance Festival. Comfortable temperatures for full-day monument walking.',
    trekkingPermitStatus: 'All permitted trails operating normally with high demand on weekends.',
    safetyCautions: [
      'Popular spots can get crowded on long weekends—arrive at ticket counters before 08:30 AM.',
    ],
  },
  {
    seasonName: 'Summer & Pre-Monsoon',
    months: 'March to May',
    status: 'Summer Caution',
    westernGhatsAdvice: 'Pleasant retreat from lowland heat. Great for birdwatching and wildlife safaris in Kabini and Nagarhole as animals congregate around waterholes.',
    coastalAdvice: 'Humid afternoons. Best enjoyed in early mornings and late evenings.',
    heritagePlainsAdvice: 'High afternoon temperatures (36-40°C in Ballari and Bagalkote). Schedule all outdoor temple visits between 06:00 AM - 10:00 AM and after 04:30 PM.',
    trekkingPermitStatus: 'Some dry deciduous forest trails closed due to forest fire prevention protocols.',
    safetyCautions: [
      'Carry electrolyte hydration and wear cotton clothing in northern plains.',
      'Respect wildlife reserve fire bans and strict no-smoking policies.',
    ],
  },
];

export const KARNATAKA_EMERGENCY_CONTACTS = [
  { name: 'Unified Emergency Police / Fire / Ambulance', number: '112', notes: 'Toll-free 24x7 state-wide' },
  { name: 'Karnataka Tourism Police Helpline', number: '+91 80 2220 0034', notes: 'Dedicated traveller assistance' },
  { name: 'Government Ambulance Service', number: '108', notes: 'Free medical emergency response' },
  { name: 'Women Safety Helpline', number: '1091', notes: '24x7 dedicated emergency support' },
  { name: 'Western Ghats Forest Rescue (Wildlife & Trekker Alert)', number: '1926', notes: 'Forest department state desk' },
  { name: 'Karnataka State Road Transport (KSRTC Helpline)', number: '080 4959 6666', notes: 'Bus status and remote terminal aid' },
];
