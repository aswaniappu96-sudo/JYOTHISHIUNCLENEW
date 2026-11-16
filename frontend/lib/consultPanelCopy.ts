import type { Locale } from "@/lib/i18n";

type Item = { title: string; question: string; answer: string };

type Panel = {
  services: string;
  also: string;
  call: string;
  chat: string;
  video: string;
  genericQ: string;
  genericA: string;
  kundli: Item;
  prashna: Item;
  match: Item;
  family: Item;
  remedies: Item;
  pooja: Item;
  yatra: Item;
  products: Item;
};

const en: Panel = {
  services: "Services",
  also: "We also provide",
  call: "Call",
  chat: "Chat",
  video: "Video Consultation",
  genericQ: "What is {name}?",
  genericA: "A personal consultation with a MaharshiOm astrologer on this subject.",
  kundli: {
    title: "Kundli",
    question: "What is Kundli?",
    answer:
      "A kundli is the birth chart made from your date, time, and place of birth. It shows the planetary positions used to read dasha, dosha, and the direction of life.",
  },
  prashna: {
    title: "Prashna",
    question: "What is Prashna?",
    answer:
      "Prashna is a question chart. You ask one clear question, and the astrologer reads the moment of that question for a direct answer.",
  },
  match: {
    title: "Matchmaking",
    question: "What is Matchmaking?",
    answer:
      "Matchmaking compares two birth charts for marriage. It looks at guna milan, mangal, and remedies the family can follow.",
  },
  family: {
    title: "Family guidance",
    question: "What is Family guidance?",
    answer:
      "Family guidance looks at home, children, career, and marriage together, so the reading stays practical for the people you live with.",
  },
  remedies: {
    title: "Remedies",
    question: "What are Remedies?",
    answer:
      "Remedies are simple corrections for a planetary dosha, such as a mantra, charity, or a rite, chosen so they reduce fear and fit daily life.",
  },
  pooja: {
    title: "Pooja booking",
    question: "What is pooja booking?",
    answer:
      "We arrange homam and pooja with a priest for your sankalpa. You share the name and preferred date, and the timing and dakshina are confirmed privately.",
  },
  yatra: {
    title: "Temple yatra",
    question: "What is temple yatra?",
    answer:
      "Temple yatra is guidance for a darshan journey. We share temple timing and the path so the family can travel with a clear plan.",
  },
  products: {
    title: "Spiritual products",
    question: "What are spiritual products?",
    answer:
      "Spiritual products include rudraksha, malas, and puja items arranged for your need. You enquire privately, and prices are not listed on the page.",
  },
};

const hi: Panel = {
  services: "सेवाएँ",
  also: "हम यह भी देते हैं",
  call: "कॉल",
  chat: "चैट",
  video: "वीडियो परामर्श",
  genericQ: "{name} क्या है?",
  genericA: "इस विषय पर महर्षिओम ज्योतिषी के साथ व्यक्तिगत परामर्श।",
  kundli: {
    title: "कुंडली",
    question: "कुंडली क्या है?",
    answer:
      "कुंडली जन्म की तारीख, समय और स्थान से बनने वाली जन्मपत्री है। इसमें ग्रह स्थिति दिखती है, जिससे दशा, दोष और जीवन की दिशा पढ़ी जाती है।",
  },
  prashna: {
    title: "प्रश्न",
    question: "प्रश्न क्या है?",
    answer:
      "प्रश्न एक सवाल की कुंडली है। आप एक साफ सवाल पूछते हैं, और ज्योतिषी उस क्षण को पढ़कर सीधा उत्तर देते हैं।",
  },
  match: {
    title: "मिलान",
    question: "मिलान क्या है?",
    answer: "मिलान विवाह के लिए दो जन्मपत्रियों की तुलना है। इसमें गुण मिलान, मंगल और परिवार के उपाय देखे जाते हैं।",
  },
  family: {
    title: "पारिवारिक मार्गदर्शन",
    question: "पारिवारिक मार्गदर्शन क्या है?",
    answer:
      "पारिवारिक मार्गदर्शन घर, बच्चे, करियर और विवाह को साथ देखता है, ताकि पढ़ाई आपके साथ रहने वालों के लिए व्यावहारिक रहे।",
  },
  remedies: {
    title: "उपाय",
    question: "उपाय क्या हैं?",
    answer: "उपाय ग्रह दोष के सरल सुधार हैं, जैसे मंत्र, दान या अनुष्ठान, जो डर घटाएँ और दैनिक जीवन में फिट हों।",
  },
  pooja: {
    title: "पूजा बुकिंग",
    question: "पूजा बुकिंग क्या है?",
    answer:
      "हम आपके संकल्प के लिए पुजारी के साथ होम और पूजा कराते हैं। आप नाम और पसंदीदा तारीख बताते हैं; समय और दक्षिणा निजी रूप से तय होती है।",
  },
  yatra: {
    title: "मंदिर यात्रा",
    question: "मंदिर यात्रा क्या है?",
    answer: "मंदिर यात्रा दर्शन की यात्रा का मार्गदर्शन है। हम मंदिर का समय और रास्ता बताते हैं, ताकि परिवार स्पष्ट योजना से जा सके।",
  },
  products: {
    title: "आध्यात्मिक वस्तुएँ",
    question: "आध्यात्मिक वस्तुएँ क्या हैं?",
    answer: "इनमें रुद्राक्ष, माला और पूजा सामग्री शामिल हैं। आप निजी रूप से पूछते हैं; कीमतें पृष्ठ पर नहीं होतीं।",
  },
};

const ta: Panel = {
  services: "சேவைகள்",
  also: "இதையும் வழங்குகிறோம்",
  call: "அழைப்பு",
  chat: "அரட்டை",
  video: "வீடியோ ஆலோசனை",
  genericQ: "{name} என்றால் என்ன?",
  genericA: "இந்தப் பொருளில் மகரிஷிஓம் ஜோதிடருடன் தனிப்பட்ட ஆலோசனை.",
  kundli: {
    title: "ஜாதகம்",
    question: "ஜாதகம் என்றால் என்ன?",
    answer:
      "ஜாதகம் பிறந்த தேதி, நேரம், இடத்திலிருந்து அமையும் பிறப்பு வரைபடம். தசை, தோஷம், வாழ்க்கை திசையைப் படிக்கும் கிரக நிலைகளைக் காட்டும்.",
  },
  prashna: {
    title: "பிரச்சினை",
    question: "பிரச்சினை என்றால் என்ன?",
    answer: "பிரச்சினை ஒரு கேள்வி ஜாதகம். ஒரு தெளிவான கேள்வி கேளுங்கள்; ஜோதிடர் அந்தக் கணத்தைப் படித்து நேரடி பதில் தருவார்.",
  },
  match: {
    title: "பொருத்தம்",
    question: "பொருத்தம் என்றால் என்ன?",
    answer: "பொருத்தம் திருமணத்திற்காக இரண்டு ஜாதகங்களை ஒப்பிடும். குண மிலன், செவ்வாய், குடும்பம் பின்பற்றும் பரிகாரங்களைப் பார்க்கும்.",
  },
  family: {
    title: "குடும்ப வழிகாட்டுதல்",
    question: "குடும்ப வழிகாட்டுதல் என்றால் என்ன?",
    answer: "வீடு, குழந்தை, தொழில், திருமணம் ஆகியவற்றை ஒன்றாகப் பார்க்கும். அதனால் வாசிப்பு நீங்கள் வாழும் மக்களுக்கு நடைமுறையாக இருக்கும்.",
  },
  remedies: {
    title: "பரிகாரங்கள்",
    question: "பரிகாரங்கள் என்றால் என்ன?",
    answer: "பரிகாரங்கள் கிரக தோஷத்துக்கான எளிய திருத்தங்கள் — மந்திரம், தானம் அல்லது சடங்கு. பயம் குறையும், அன்றாட வாழ்க்கைக்குப் பொருந்தும்.",
  },
  pooja: {
    title: "பூஜை முன்பதிவு",
    question: "பூஜை முன்பதிவு என்றால் என்ன?",
    answer: "உங்கள் சங்கல்பத்துக்குப் பூஜாரியுடன் ஹோமமும் பூஜையும் ஏற்பாடு செய்கிறோம். பெயரும் விருப்பத் தேதியும் சொல்லுங்கள்; நேரமும் தட்சிணையும் தனிப்பட்ட முறையில் உறுதி செய்யப்படும்.",
  },
  yatra: {
    title: "கோவில் யாத்திரை",
    question: "கோவில் யாத்திரை என்றால் என்ன?",
    answer: "தரிசனப் பயணத்துக்கான வழிகாட்டுதல். கோவில் நேரமும் பாதையும் சொல்கிறோம், குடும்பம் தெளிவான திட்டத்துடன் செல்ல.",
  },
  products: {
    title: "ஆன்மிக பொருள்கள்",
    question: "ஆன்மிக பொருள்கள் என்றால் என்ன?",
    answer: "ருத்ராட்சம், மாலை, பூஜைப் பொருள்கள் உங்கள் தேவைக்கு ஏற்ப. தனிப்பட்ட முறையில் கேளுங்கள்; விலைகள் பக்கத்தில் இல்லை.",
  },
};

const ml: Panel = {
  services: "സേവനങ്ങൾ",
  also: "ഞങ്ങൾ ഇതും നൽകുന്നു",
  call: "കോൾ",
  chat: "ചാറ്റ്",
  video: "വീഡിയോ കൺസൾട്ടേഷൻ",
  genericQ: "{name} എന്താണ്?",
  genericA: "ഈ വിഷയത്തിൽ മഹർഷിഓം ജ്യോതിഷിയുമായി വ്യക്തിഗത കൂടിക്കാഴ്ച.",
  kundli: {
    title: "ജാതകം",
    question: "ജാതകം എന്താണ്?",
    answer:
      "ജാതകം ജനന തീയതി, സമയം, സ്ഥലം വച്ച് ഉണ്ടാക്കുന്ന ജനനചാർട്ട് ആണ്. ദശ, ദോഷം, ജീവിതദിശ വായിക്കാനുള്ള ഗ്രഹസ്ഥിതി അതിൽ കാണാം.",
  },
  prashna: {
    title: "പ്രശ്നം",
    question: "പ്രശ്നം എന്താണ്?",
    answer: "പ്രശ്നം ഒരു ചോദ്യജാതകമാണ്. ഒരു വ്യക്തമായ ചോദ്യം ചോദിക്കുക; ജ്യോതിഷി ആ നിമിഷം വായിച്ച് നേരിട്ട് ഉത്തരം തരും.",
  },
  match: {
    title: "പൊരുത്തം",
    question: "പൊരുത്തം എന്താണ്?",
    answer: "വിവാഹത്തിനായി രണ്ട് ജാതകങ്ങൾ താരതമ്യം ചെയ്യുന്നു. ഗുണമേളനം, ചൊവ്വ, കുടുംബം പിന്തുടരാവുന്ന പരിഹാരങ്ങൾ നോക്കുന്നു.",
  },
  family: {
    title: "കുടുംബ മാർഗ്ഗനിർദ്ദേശം",
    question: "കുടുംബ മാർഗ്ഗനിർദ്ദേശം എന്താണ്?",
    answer: "വീട്, കുട്ടികൾ, ജോലി, വിവാഹം എന്നിവ ഒരുമിച്ച് നോക്കുന്നു. അതിനാൽ വായന നിങ്ങളോടൊപ്പം ജീവിക്കുന്നവർക്ക് പ്രായോഗികമാകും.",
  },
  remedies: {
    title: "പരിഹാരങ്ങൾ",
    question: "പരിഹാരങ്ങൾ എന്താണ്?",
    answer: "ഗ്രഹദോഷത്തിനുള്ള ലളിതമായ തിരുത്തലുകളാണ് — മന്ത്രം, ദാനം, അല്ലെങ്കിൽ കർമം. ഭയം കുറയ്ക്കാനും ദൈനംദിന ജീവിതത്തിന് ഒത്തുപോകാനും.",
  },
  pooja: {
    title: "പൂജ ബുക്കിംഗ്",
    question: "പൂജ ബുക്കിംഗ് എന്താണ്?",
    answer: "നിങ്ങളുടെ സങ്കൽപ്പത്തിന് പൂജാരിയോടൊപ്പം ഹോമവും പൂജയും ക്രമീകരിക്കുന്നു. പേരും ഇഷ്ട തീയതിയും പറയുക; സമയവും ദക്ഷിണയും സ്വകാര്യമായി ഉറപ്പാക്കും.",
  },
  yatra: {
    title: "ക്ഷേത്രയാത്ര",
    question: "ക്ഷേത്രയാത്ര എന്താണ്?",
    answer: "ദർശന യാത്രയുടെ മാർഗ്ഗനിർദ്ദേശം. ക്ഷേത്ര സമയവും വഴിയും പങ്കിടുന്നു, കുടുംബത്തിന് വ്യക്തമായ പദ്ധതിയോടെ പോകാം.",
  },
  products: {
    title: "ആത്മീയ വസ്തുക്കൾ",
    question: "ആത്മീയ വസ്തുക്കൾ എന്താണ്?",
    answer: "രുദ്രാക്ഷം, മാല, പൂജാ സാധനങ്ങൾ നിങ്ങളുടെ ആവശ്യത്തിന്. സ്വകാര്യമായി ചോദിക്കുക; വിലകൾ പേജിൽ ഇല്ല.",
  },
};

const kn: Panel = {
  services: "ಸೇವೆಗಳು",
  also: "ನಾವು ಇದನ್ನೂ ನೀಡುತ್ತೇವೆ",
  call: "ಕರೆ",
  chat: "ಚಾಟ್",
  video: "ವೀಡಿಯೊ ಸಮಾಲೋಚನೆ",
  genericQ: "{name} ಎಂದರೇನು?",
  genericA: "ಈ ವಿಷಯದ ಬಗ್ಗೆ ಮಹರ್ಷಿಓಂ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ವೈಯಕ್ತಿಕ ಸಮಾಲೋಚನೆ.",
  kundli: {
    title: "ಜಾತಕ",
    question: "ಜಾತಕ ಎಂದರೇನು?",
    answer: "ಜಾತಕ ಜನ್ಮ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳದಿಂದ ಆಗುವ ಜನ್ಮಪಟ. ದಶೆ, ದೋಷ ಮತ್ತು ಜೀವನದ ದಿಕ್ಕನ್ನು ಓದಲು ಗ್ರಹ ಸ್ಥಿತಿ ತೋರಿಸುತ್ತದೆ.",
  },
  prashna: {
    title: "ಪ್ರಶ್ನೆ",
    question: "ಪ್ರಶ್ನೆ ಎಂದರೇನು?",
    answer: "ಪ್ರಶ್ನೆ ಒಂದು ಪ್ರಶ್ನೆಯ ಜಾತಕ. ಒಂದು ಸ್ಪಷ್ಟ ಪ್ರಶ್ನೆ ಕೇಳಿ; ಜ್ಯೋತಿಷಿ ಆ ಕ್ಷಣವನ್ನು ಓದಿ ನೇರ ಉತ್ತರ ಕೊಡುತ್ತಾರೆ.",
  },
  match: {
    title: "ಹೊಂದಾಣಿಕೆ",
    question: "ಹೊಂದಾಣಿಕೆ ಎಂದರೇನು?",
    answer: "ಮದುವೆಗೆ ಎರಡು ಜಾತಕಗಳನ್ನು ಹೋಲಿಸುತ್ತದೆ. ಗುಣ ಮಿಲನ, ಮಂಗಳ ಮತ್ತು ಕುಟುಂಬ ಪಾಲಿಸಬಹುದಾದ ಪರಿಹಾರಗಳನ್ನು ನೋಡುತ್ತದೆ.",
  },
  family: {
    title: "ಕುಟುಂಬ ಮಾರ್ಗದರ್ಶನ",
    question: "ಕುಟುಂಬ ಮಾರ್ಗದರ್ಶನ ಎಂದರೇನು?",
    answer: "ಮನೆ, ಮಕ್ಕಳು, ವೃತ್ತಿ ಮತ್ತು ಮದುವೆಯನ್ನು ಒಟ್ಟಿಗೆ ನೋಡುತ್ತದೆ. ಓದು ನೀವು ಜೊತೆ ವಾಸಿಸುವವರಿಗೆ ಪ್ರಾಯೋಗಿಕವಾಗಿ ಉಳಿಯುತ್ತದೆ.",
  },
  remedies: {
    title: "ಪರಿಹಾರಗಳು",
    question: "ಪರಿಹಾರಗಳು ಎಂದರೇನು?",
    answer: "ಗ್ರಹ ದೋಷಕ್ಕೆ ಸರಳ ತಿದ್ದುಪಡಿಗಳು — ಮಂತ್ರ, ದಾನ ಅಥವಾ ವಿಧಿ. ಭಯ ಕಡಿಮೆ ಆಗಿ ದೈನಂದಿನ ಜೀವನಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳಲಿ.",
  },
  pooja: {
    title: "ಪೂಜೆ ಬುಕಿಂಗ್",
    question: "ಪೂಜೆ ಬುಕಿಂಗ್ ಎಂದರೇನು?",
    answer: "ನಿಮ್ಮ ಸಂಕಲ್ಪಕ್ಕೆ ಪುರೋಹಿತರೊಂದಿಗೆ ಹೋಮ ಮತ್ತು ಪೂಜೆ ಏರ್ಪಾಡು. ಹೆಸರು ಮತ್ತು ಇಷ್ಟದ ದಿನಾಂಕ ಹೇಳಿ; ಸಮಯ ಮತ್ತು ದಕ್ಷಿಣೆ ಖಾಸಗಿಯಾಗಿ ಖಚಿತವಾಗುತ್ತದೆ.",
  },
  yatra: {
    title: "ದೇವಾಲಯ ಯಾತ್ರೆ",
    question: "ದೇವಾಲಯ ಯಾತ್ರೆ ಎಂದರೇನು?",
    answer: "ದರ್ಶನ ಪ್ರಯಾಣದ ಮಾರ್ಗದರ್ಶನ. ದೇವಾಲಯದ ಸಮಯ ಮತ್ತು ದಾರಿ ಹಂಚಿಕೊಳ್ಳುತ್ತೇವೆ, ಕುಟುಂಬ ಸ್ಪಷ್ಟ ಯೋಜನೆಯೊಂದಿಗೆ ಹೋಗಲಿ.",
  },
  products: {
    title: "ಆಧ್ಯಾತ್ಮಿಕ ವಸ್ತುಗಳು",
    question: "ಆಧ್ಯಾತ್ಮಿಕ ವಸ್ತುಗಳು ಎಂದರೇನು?",
    answer: "ರುದ್ರಾಕ್ಷಿ, ಮಾಲೆ ಮತ್ತು ಪೂಜಾ ವಸ್ತುಗಳು ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ. ಖಾಸಗಿಯಾಗಿ ಕೇಳಿ; ಬೆಲೆಗಳು ಪುಟದಲ್ಲಿ ಇಲ್ಲ.",
  },
};

const te: Panel = {
  services: "సేవలు",
  also: "మేము ఇవి కూడా అందిస్తాం",
  call: "కాల్",
  chat: "చాట్",
  video: "వీడియో సంప్రదింపు",
  genericQ: "{name} అంటే ఏమిటి?",
  genericA: "ఈ అంశంపై మహర్షిఓం జ్యోతిష్కునితో వ్యక్తిగత సంప్రదింపు.",
  kundli: {
    title: "జాతకం",
    question: "జాతకం అంటే ఏమిటి?",
    answer: "జాతకం పుట్టిన తేదీ, సమయం, స్థలం నుంచి వచ్చే జనన చార్ట్. దశ, దోషం, జీవిత దిశ చదవడానికి గ్రహ స్థితులు చూపిస్తుంది.",
  },
  prashna: {
    title: "ప్రశ్న",
    question: "ప్రశ్న అంటే ఏమిటి?",
    answer: "ప్రశ్న ఒక ప్రశ్న జాతకం. ఒక స్పష్టమైన ప్రశ్న అడగండి; జ్యోతిష్కుడు ఆ క్షణాన్ని చదివి నేరుగా సమాధానం ఇస్తారు.",
  },
  match: {
    title: "పొంతన",
    question: "పొంతన అంటే ఏమిటి?",
    answer: "వివాహానికి రెండు జాతకాలను పోల్చుతుంది. గుణ మిలనం, మంగళం, కుటుంబం పాటించగల పరిహారాలు చూస్తుంది.",
  },
  family: {
    title: "కుటుంబ మార్గదర్శకం",
    question: "కుటుంబ మార్గదర్శకం అంటే ఏమిటి?",
    answer: "ఇల్లు, పిల్లలు, వృత్తి, వివాహం కలిపి చూస్తుంది. చదువు మీతో ఉండే వారికి ఆచరణలో ఉంటుంది.",
  },
  remedies: {
    title: "పరిహారాలు",
    question: "పరిహారాలు అంటే ఏమిటి?",
    answer: "గ్రహ దోషానికి సులభమైన సవరణలు — మంత్రం, దానం లేదా కర్మ. భయం తగ్గి రోజువారీ జీవితానికి సరిపోతాయి.",
  },
  pooja: {
    title: "పూజ బుకింగ్",
    question: "పూజ బుకింగ్ అంటే ఏమిటి?",
    answer: "మీ సంకల్పానికి పూజారితో హోమం, పూజ ఏర్పాటు. పేరు, కావలసిన తేదీ చెప్పండి; సమయం, దక్షిణ ప్రైవేటుగా నిర్ధారిస్తాం.",
  },
  yatra: {
    title: "దేవాలయ యాత్ర",
    question: "దేవాలయ యాత్ర అంటే ఏమిటి?",
    answer: "దర్శన ప్రయాణానికి మార్గదర్శకం. ఆలయ సమయం, దారి చెబుతాం, కుటుంబం స్పష్టమైన ప్రణాళికతో వెళ్లేందుకు.",
  },
  products: {
    title: "ఆధ్యాత్మిక వస్తువులు",
    question: "ఆధ్యాత్మిక వస్తువులు అంటే ఏమిటి?",
    answer: "రుద్రాక్ష, మాలలు, పూజా వస్తువులు మీ అవసరానికి. ప్రైవేటుగా అడగండి; ధరలు పేజీలో ఉండవు.",
  },
};

const PANELS: Record<Locale, Panel> = { en, hi, ta, ml, kn, te };

export type ServiceKind = "kundli" | "prashna" | "match" | "family" | "remedies" | "pooja" | "yatra" | "products" | "generic";

export function serviceKind(label: string): ServiceKind {
  const key = label.toLowerCase();
  if (/kundli|kundali|jathak|birth/.test(key)) return "kundli";
  if (/prashna|prasna/.test(key)) return "prashna";
  if (/match/.test(key)) return "match";
  if (/family/.test(key)) return "family";
  if (/remed/.test(key)) return "remedies";
  if (/pooja|homam/.test(key)) return "pooja";
  if (/yatra|temple/.test(key)) return "yatra";
  if (/product|spiritual/.test(key)) return "products";
  return "generic";
}

export function isVideoConsultationService(label: string) {
  const kind = serviceKind(label);
  return kind !== "pooja" && kind !== "yatra" && kind !== "products";
}

export function panelChrome(locale: Locale) {
  const panel = PANELS[locale] || PANELS.en;
  return { services: panel.services, also: panel.also, call: panel.call, chat: panel.chat, video: panel.video };
}

export function serviceCopy(label: string, detail: string, locale: Locale): Item {
  const panel = PANELS[locale] || PANELS.en;
  const kind = serviceKind(label);
  if (kind === "generic") {
    return {
      title: label,
      question: panel.genericQ.replace("{name}", label),
      answer: locale === "en" && detail ? detail : panel.genericA,
    };
  }
  return panel[kind];
}

export const ALSO_SERVICES: { id: string; kind: Exclude<ServiceKind, "generic">; english: string }[] = [
  { id: "pooja-booking", kind: "pooja", english: "Pooja booking" },
  { id: "temple-yatra", kind: "yatra", english: "Temple yatra" },
  { id: "spiritual-products", kind: "products", english: "Spiritual products" },
];
