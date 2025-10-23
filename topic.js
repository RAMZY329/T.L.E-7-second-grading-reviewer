let currentTopic = "tle_quiz"; // default to TLE questions

// Question tracking system to ensure all questions are answered before repetition
let questionTrackers = {
  tle_quiz: {
    usedQuestions: [],
    shuffledIndices: [],
    currentIndex: 0
  },
  ap_long_quiz: {
    usedQuestions: [],
    shuffledIndices: [],
    currentIndex: 0
  }
};

// TLE Question Bank
const TLEQuestionBank = [
  // Agricultural Jobs
  { id: 1, q: 'The person responsible for managing daily farm operations is called a:', options: { A: 'Supervisor', B: 'Farm Manager', C: 'Accountant', D: 'Auditor' }, ans: 'B' },
  { id: 2, q: 'A professional who specializes in plant breeding and crop production is a:', options: { A: 'Agronomist', B: 'Veterinarian', C: 'Chemist', D: 'Biologist' }, ans: 'A' },
  { id: 3, q: 'The worker who operates machinery such as tractors and harvesters is a:', options: { A: 'Driver', B: 'Equipment Operator', C: 'Mechanic', D: 'Planter' }, ans: 'B' },
  { id: 4, q: 'A person who takes care of farm animals and ensures their health is a:', options: { A: 'Carpenter', B: 'Veterinarian', C: 'Agronomist', D: 'Technician' }, ans: 'B' },
  { id: 5, q: 'The person who helps farmers improve productivity through field education is an:', options: { A: 'Agricultural Extension Worker', B: 'Factory Supervisor', C: 'Market Analyst', D: 'Machine Operator' }, ans: 'A' },
  { id: 6, q: 'A farm technician\'s main responsibility is to:', options: { A: 'Maintain farm equipment and monitor crops', B: 'Record office attendance', C: 'Prepare financial reports', D: 'Manage city waste' }, ans: 'A' },
  { id: 7, q: 'Agricultural entrepreneurs are primarily engaged in:', options: { A: 'Managing and innovating agricultural production and sales', B: 'Conducting political campaigns', C: 'Organizing cultural events', D: 'Practicing law' }, ans: 'A' },
  { id: 8, q: 'Who among the following specializes in fruit and vegetable production?', options: { A: 'Fisherman', B: 'Horticulturist', C: 'Metallurgist', D: 'Miner' }, ans: 'B' },
  { id: 9, q: 'The person who ensures the proper operation of irrigation systems is a:', options: { A: 'Irrigation Technician', B: 'Harvest Supervisor', C: 'Mechanic', D: 'Builder' }, ans: 'A' },
  { id: 10, q: 'Farm laborers mainly perform:', options: { A: 'Office accounting', B: 'Physical fieldwork such as planting and harvesting', C: 'Tax computation', D: 'Machine repair in factories' }, ans: 'B' },

  // Crop Maintenance
  { id: 11, q: 'Crop maintenance refers to:', options: { A: 'The marketing of farm produce', B: 'The care given to crops after planting until harvest', C: 'The study of soil composition', D: 'The harvesting process' }, ans: 'B' },
  { id: 12, q: 'The act of removing unwanted weeds is called:', options: { A: 'Weeding', B: 'Pruning', C: 'Sowing', D: 'Spraying' }, ans: 'A' },
  { id: 13, q: 'The purpose of pruning is to:', options: { A: 'Encourage growth and improve fruit quality', B: 'Remove all leaves', C: 'Stop flowering', D: 'Reduce sunlight' }, ans: 'A' },
  { id: 14, q: 'The process of transferring young seedlings to the main field is:', options: { A: 'Transplanting', B: 'Irrigating', C: 'Harvesting', D: 'Fertilizing' }, ans: 'A' },
  { id: 15, q: 'Applying fertilizers helps to:', options: { A: 'Improve soil fertility and plant growth', B: 'Kill pests', C: 'Block water', D: 'Dry the soil' }, ans: 'A' },
  { id: 16, q: 'The agricultural practice that conserves soil nutrients and prevents pest buildup is:', options: { A: 'Crop rotation', B: 'Monocropping', C: 'Burning residues', D: 'Continuous planting' }, ans: 'A' },
  { id: 17, q: 'Mulching is done to:', options: { A: 'Conserve soil moisture and control weeds', B: 'Increase erosion', C: 'Attract pests', D: 'Block sunlight completely' }, ans: 'A' },
  { id: 18, q: 'The best time to water crops is:', options: { A: 'Early morning or late afternoon', B: 'Noon', C: 'Midnight', D: 'Anytime' }, ans: 'A' },
  { id: 19, q: 'The practice of watering plants in a controlled manner is called:', options: { A: 'Irrigation', B: 'Spraying', C: 'Threshing', D: 'Broadcasting' }, ans: 'A' },
  { id: 20, q: 'Which of the following is an organic fertilizer?', options: { A: 'Compost', B: 'Urea', C: 'Ammonium nitrate', D: 'Superphosphate' }, ans: 'A' },
  { id: 21, q: 'The use of insects to control harmful pests is called:', options: { A: 'Biological control', B: 'Chemical control', C: 'Mechanical control', D: 'Physical control' }, ans: 'A' },
  { id: 22, q: 'Soil testing is done to:', options: { A: 'Determine suitable crops and fertilizer requirements', B: 'Identify rainfall patterns', C: 'Measure sunlight', D: 'Record harvest data' }, ans: 'A' },
  { id: 23, q: 'What tool is best for tilling small areas?', options: { A: 'Hoe', B: 'Plow', C: 'Tractor', D: 'Harrow' }, ans: 'A' },
  { id: 24, q: 'The improper use of chemical fertilizers may lead to:', options: { A: 'Soil degradation', B: 'Higher yields', C: 'Improved fertility', D: 'Less pollution' }, ans: 'A' },
  { id: 25, q: 'Sustainable crop maintenance promotes:', options: { A: 'Environmental protection and long-term productivity', B: 'Fast depletion of soil', C: 'Overuse of pesticides', D: 'Burning of wastes' }, ans: 'A' },

  // Waste Management
  { id: 26, q: 'Agricultural waste is defined as:', options: { A: 'Waste from crop and livestock production', B: 'Waste from hospitals', C: 'Industrial waste', D: 'Ocean debris' }, ans: 'A' },
  { id: 27, q: 'The 3Rs principle in waste management stands for:', options: { A: 'Reduce, Reuse, Recycle', B: 'Rebuild, Restore, Reform', C: 'Record, Report, Reapply', D: 'Rinse, Replace, Remove' }, ans: 'A' },
  { id: 28, q: 'The process of decomposing organic waste to form fertilizer is called:', options: { A: 'Composting', B: 'Burning', C: 'Dumping', D: 'Incineration' }, ans: 'A' },
  { id: 29, q: 'The law that governs solid waste management in the Philippines is:', options: { A: 'Republic Act 9003', B: 'Republic Act 10068', C: 'Republic Act 1425', D: 'Republic Act 7586' }, ans: 'A' },
  { id: 30, q: 'Proper waste management in agriculture promotes:', options: { A: 'Sustainable and safe farming practices', B: 'Water pollution', C: 'Spread of pests', D: 'Air contamination' }, ans: 'A' }
];

// Problem generators
const ProblemGenerator = {
  // Metric conversions: length, weight, volume
  metric_conversion: () => {
    // Helpers
    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function roundTo(n, decimals) {
      const p = Math.pow(10, decimals || 0);
      return Math.round(n * p) / p;
    }

    // Define unit groups and multipliers following the exact chains provided
    // Metric base units: meter (m), gram (g), liter (L)
    // Also include English/Imperial groups for Length, Weight, and Volume
    const groups = [
      {
        name: "Metric Length",
        // mm -> cm -> dm -> m -> dam -> hm -> km (each step x10)
        units: [
          { name: "mm", toBase: 0.001 },
          { name: "cm", toBase: 0.01 },
          { name: "dm", toBase: 0.1 },
          { name: "m", toBase: 1 },
          { name: "dam", toBase: 10 },
          { name: "hm", toBase: 100 },
          { name: "km", toBase: 1000 },
        ],
      },
      {
        name: "Metric Mass",
        // mg -> cg -> dg -> g -> dag -> hg -> kg (each step x10)
        units: [
          { name: "mg", toBase: 0.001 },
          { name: "cg", toBase: 0.01 },
          { name: "dg", toBase: 0.1 },
          { name: "g", toBase: 1 },
          { name: "dag", toBase: 10 },
          { name: "hg", toBase: 100 },
          { name: "kg", toBase: 1000 },
        ],
      },
      {
        name: "Metric Volume",
        // mL -> cL -> dL -> L -> daL -> hL -> kL (each step x10)
        units: [
          { name: "mL", toBase: 0.001 },
          { name: "cL", toBase: 0.01 },
          { name: "dL", toBase: 0.1 },
          { name: "L", toBase: 1 },
          { name: "daL", toBase: 10 },
          { name: "hL", toBase: 100 },
          { name: "kL", toBase: 1000 },
        ],
      },
      {
        name: "English Length",
        // Use inch as the base unit for this group: in, ft, yd, mi
        // 1 ft = 12 in, 1 yd = 3 ft = 36 in, 1 mi = 5280 ft = 63360 in
        units: [
          { name: "in", toBase: 1 },
          { name: "ft", toBase: 12 },
          { name: "yd", toBase: 36 },
          { name: "mi", toBase: 63360 },
        ],
      },
      {
        name: "English Weight",
        // Use ounce (oz) as base: 1 lb = 16 oz, 1 ton = 2000 lb = 32000 oz
        units: [
          { name: "oz", toBase: 1 },
          { name: "lb", toBase: 16 },
          { name: "ton", toBase: 32000 },
        ],
      },
      {
        name: "English Volume",
        // Use teaspoon (tsp) as base. Standard US customary relationships:
        // 1 tbsp = 3 tsp, 1 fl oz = 2 tbsp = 6 tsp, 1 cup (c) = 8 fl oz = 48 tsp
        // 1 pt = 2 c = 96 tsp, 1 qt = 2 pt = 4 c = 192 tsp, 1 gal = 4 qt = 768 tsp
        units: [
          { name: "tsp", toBase: 1 },
          { name: "tbsp", toBase: 3 },
          { name: "fl oz", toBase: 6 },
          { name: "c", toBase: 48 },
          { name: "pt", toBase: 96 },
          { name: "qt", toBase: 192 },
          { name: "gal", toBase: 768 },
        ],
      },
    ];

    // Pick a random group and two different units from it
    const grp = groups[Math.floor(Math.random() * groups.length)];
    const fromIdx = randInt(0, grp.units.length - 1);
    let toIdx = randInt(0, grp.units.length - 1);
    while (toIdx === fromIdx) {
      toIdx = randInt(0, grp.units.length - 1);
    }

    const from = grp.units[fromIdx];
    const to = grp.units[toIdx];

    // Choose a base numeric value that's sensible depending on units
    // Use different ranges to avoid very tiny/huge answers
    let value;
    if (from.toBase >= 1000) {
      // from is large (e.g., km, t) -> pick small integer
      value = roundTo(Math.random() * 50 + 1, 3); // 1..51
    } else if (from.toBase <= 0.001) {
      // from is very small (e.g., mm, mg, mL) -> pick larger integer
      value = roundTo(Math.random() * 500 + 10, 3); // 10..510
    } else {
      value = roundTo(Math.random() * 200 + 1, 3); // 1..201
    }

    // Compute in base unit then convert to target
    const base = value * from.toBase; // value in base units
    const rawAnswer = base / to.toBase;

    // Format question and sensible rounding for display
    const roundedAnswer = roundTo(rawAnswer, 3);

    // Remove unnecessary .0 or trailing zeros when possible for nicer options
    function fmtNumber(n) {
      if (Number.isInteger(n)) return `${n}`;
      return `${n}`.replace(/(?:\.0+|(?<=\.[0-9]*[1-9])0+)$/, "");
    }

    const question = `Convert ${fmtNumber(value)} ${from.name} to ${to.name} (${grp.name})`;

    return { question, answer: roundedAnswer };
  },
};

// QUESTION BANK for Araling Panlipunan (Migration & Globalization)
const APQuestionBank = [
  { id: 1, q: 'Ang migrasyon ay tumutukoy sa', options: { A: 'paglipat ng tao mula sa isang lugar patungo sa iba', B: 'pagtutulungan ng mga bansa', C: 'paglaganap ng teknolohiya', D: 'pagpapalitan ng kultura' }, ans: 'A' },
  { id: 2, q: 'Ang taong lumilipat ng bansa upang doon permanenteng manirahan ay tinatawag na', options: { A: 'turista', B: 'migrante', C: 'bisita', D: 'dayuhan' }, ans: 'B' },
  { id: 3, q: 'Ang immigration ay tumutukoy sa', options: { A: 'pag-alis ng bansa', B: 'pagpasok sa bansa', C: 'paglalakbay', D: 'pag-aaral sa ibang bansa' }, ans: 'B' },
  { id: 4, q: 'Ang emigration ay nangangahulugang', options: { A: 'pagpasok ng tao sa bansa', B: 'pag-alis ng tao mula sa bansa', C: 'pamamalagi sa sariling bansa', D: 'pagbalik sa sariling bayan' }, ans: 'B' },
  { id: 5, q: 'Ano ang tawag sa mga Pilipinong nagtatrabaho sa ibang bansa?', options: { A: 'OFW', B: 'DOLE', C: 'POEA', D: 'DFA' }, ans: 'A' },
  { id: 6, q: 'Ang pangunahing dahilan ng migrasyon ay', options: { A: 'edukasyon', B: 'trabaho at kabuhayan', C: 'libangan', D: 'turismo' }, ans: 'B' },
  { id: 7, q: 'Ang seasonal migration ay', options: { A: 'pansamantalang migrasyon', B: 'permanenteng migrasyon', C: 'sapilitang migrasyon', D: 'ilegal na migrasyon' }, ans: 'A' },
  { id: 8, q: 'Ang internal migration ay', options: { A: 'paglipat sa loob ng sariling bansa', B: 'paglipat sa ibang kontinente', C: 'paglalakbay sa ibang bansa', D: 'pagpasok ng mga dayuhan' }, ans: 'A' },
  { id: 9, q: 'Ang forced migration ay nangyayari kapag', options: { A: 'pinili ng tao ang lumipat', B: 'may kalamidad o digmaan', C: 'may bakasyon', D: 'may kasayahan' }, ans: 'B' },
  { id: 10, q: 'Ang return migration ay', options: { A: 'hindi pagbabalik sa bansa', B: 'pagbabalik sa sariling bayan', C: 'pagtira sa bagong bansa', D: 'pagpunta sa ibang lungsod' }, ans: 'B' },
  { id: 11, q: 'Ano ang tawag sa migrasyong dulot ng pagnanais ng mas mataas na edukasyon?', options: { A: 'political migration', B: 'social migration', C: 'educational migration', D: 'economic migration' }, ans: 'C' },
  { id: 12, q: 'Ang mga tumatakas sa digmaan ay halimbawa ng', options: { A: 'refugees', B: 'turista', C: 'negosyante', D: 'trabahador' }, ans: 'A' },
  { id: 13, q: 'Ang brain drain ay', options: { A: 'pagtaas ng kalidad ng edukasyon', B: 'pagkawala ng mga propesyonal sa bansa', C: 'pagdami ng manggagawa', D: 'pagbabalik ng mga OFW' }, ans: 'B' },
  { id: 14, q: 'Ang push factor ay tumutukoy sa', options: { A: 'dahilan upang manatili sa bansa', B: 'dahilan ng pag-alis', C: 'dahilan ng pagbalik', D: 'dahilan ng pag-angat' }, ans: 'B' },
  { id: 15, q: 'Ang pull factor ay tumutukoy sa', options: { A: 'dahilan ng pagtigil sa pag-aaral', B: 'dahilan ng pagnanais lumipat sa ibang bansa', C: 'dahilan ng pag-alis ng iba', D: 'dahilan ng pagkasira ng kultura' }, ans: 'B' },
  { id: 16, q: 'Ang pagtaas ng demand sa mga manggagawang Pilipino sa ibang bansa ay isang', options: { A: 'push factor', B: 'pull factor', C: 'negative effect', D: 'political effect' }, ans: 'B' },
  { id: 17, q: 'Alin sa mga sumusunod ang halimbawa ng push factor?', options: { A: 'oportunidad sa trabaho', B: 'mataas na suweldo sa abroad', C: 'kahirapan at kawalan ng trabaho', D: 'pagkakaroon ng scholarship' }, ans: 'C' },
  { id: 18, q: 'Ang mga bansang tumatanggap ng migrante ay tinatawag na', options: { A: 'host country', B: 'source country', C: 'migrant country', D: 'tourist country' }, ans: 'A' },
  { id: 19, q: 'Ang mga bansang pinagmumulan ng migrante ay tinatawag na', options: { A: 'guest country', B: 'host country', C: 'source country', D: 'home country' }, ans: 'C' },
  { id: 20, q: 'Ang remittance ay', options: { A: 'pera na ipinapadala ng mga OFW sa pamilya', B: 'buwis ng gobyerno', C: 'tulong pinansyal ng LGU', D: 'perang donasyon' }, ans: 'A' },
  { id: 21, q: 'Ang globalisasyon ay', options: { A: 'pagkakabukod-bukod ng mga bansa', B: 'pag-uugnay ng mga bansa sa ekonomiya, kultura, at politika', C: 'pag-aaway ng mga bansa', D: 'pagtaas ng lokal na kita' }, ans: 'B' },
  { id: 22, q: 'Isa sa mga dahilan ng globalisasyon ay', options: { A: 'pagputol ng komunikasyon', B: 'mabilis na teknolohiya', C: 'pagbagal ng transportasyon', D: 'kakulangan ng trabaho' }, ans: 'B' },
  { id: 23, q: 'Ang World Trade Organization (WTO) ay nagtataguyod ng', options: { A: 'kalakalang pandaigdig', B: 'turismo', C: 'edukasyon', D: 'relihiyon' }, ans: 'A' },
  { id: 24, q: 'Ang global village ay nangangahulugang', options: { A: 'mundo ay nagiging parang iisang baryo', B: 'nagkakahiwalay ang mga bansa', C: 'pagkawala ng komunikasyon', D: 'pagbagal ng kalakalan' }, ans: 'A' },
  { id: 25, q: 'Isa sa mga positibong epekto ng globalisasyon ay', options: { A: 'pagtaas ng presyo ng bilihin', B: 'pagdami ng impormasyon at oportunidad', C: 'pagtaas ng polusyon', D: 'pagkawala ng kultura' }, ans: 'B' },
  { id: 26, q: 'Isa sa mga negatibong epekto ng globalisasyon ay', options: { A: 'mas malawak na kaalaman', B: 'pagdami ng trabaho', C: 'pagkawala ng lokal na identidad', D: 'mas murang produkto' }, ans: 'C' },
  { id: 27, q: 'Alin sa mga sumusunod ang epekto ng globalisasyon sa edukasyon?', options: { A: 'pagbaba ng kalidad', B: 'pagtaas ng global standards', C: 'pagkakait ng impormasyon', D: 'pagtaas ng matrikula' }, ans: 'B' },
  { id: 28, q: 'Ang multinational companies ay', options: { A: 'negosyo sa loob lamang ng bansa', B: 'kompanyang may operasyon sa iba\'t ibang bansa', C: 'lokal na negosyo', D: 'pagmamay-ari ng gobyerno' }, ans: 'B' },
  { id: 29, q: 'Alin ang halimbawa ng cultural globalization?', options: { A: 'pagkain ng fast food na galing ibang bansa', B: 'pagtaas ng buwis', C: 'pagkakaroon ng agrikultura', D: 'paggawa ng batas' }, ans: 'A' },
  { id: 30, q: 'Ang economic globalization ay', options: { A: 'ugnayan sa palitan ng produkto, serbisyo, at kapital', B: 'pakikialam sa relihiyon', C: 'pagputol ng ugnayan', D: 'paglayo ng mga bansa' }, ans: 'A' },
  { id: 31, q: 'Isa sa positibong epekto ng migrasyon ay', options: { A: 'pagtaas ng remittance', B: 'pagbaba ng ekonomiya', C: 'pagkawala ng manggagawa', D: 'brain drain' }, ans: 'A' },
  { id: 32, q: 'Isa sa negatibong epekto ng migrasyon ay', options: { A: 'pagtaas ng kabuhayan', B: 'pagkakahiwalay ng pamilya', C: 'pagbalik ng mga migrante', D: 'pag-unlad ng bansa' }, ans: 'B' },
  { id: 33, q: 'Ang mga migrante ay nakakatulong sa host country sa pamamagitan ng', options: { A: 'pagdadagdag ng lakas paggawa', B: 'pagtaas ng buwis', C: 'pagtaas ng krimen', D: 'pag-alis ng trabaho' }, ans: 'A' },
  { id: 34, q: 'Ang brain gain ay', options: { A: 'pagkawala ng propesyonal', B: 'pagbabalik ng mga eksperto sa sariling bansa', C: 'pagtaas ng kahirapan', D: 'pagbaba ng edukasyon' }, ans: 'B' },
  { id: 35, q: 'Ang globalisasyon ay nagdudulot ng mas malawak na', options: { A: 'kompetisyon', B: 'pagkakahiwalay', C: 'kalituhan', D: 'kakulangan sa kaalaman' }, ans: 'A' },
  { id: 36, q: 'Alin sa mga sumusunod ang positibong epekto ng globalisasyon sa ekonomiya?', options: { A: 'pagbaba ng dayuhang pamumuhunan', B: 'pagtaas ng oportunidad sa trabaho', C: 'pagtaas ng buwis', D: 'pagkawala ng industriya' }, ans: 'B' },
  { id: 37, q: 'Ang kakulangan ng proteksyon sa OFW ay isang', options: { A: 'positibong epekto', B: 'negatibong epekto', C: 'personal na isyu', D: 'pambansang tagumpay' }, ans: 'B' },
  { id: 38, q: 'Ang paglaganap ng dayuhang kultura ay isang', options: { A: 'positibong epekto', B: 'neutral na epekto', C: 'negatibong epekto', D: 'walang epekto' }, ans: 'C' },
  { id: 39, q: 'Ang pagtaas ng remittance ay may epekto sa', options: { A: 'ekonomiya ng bansa', B: 'relihiyon', C: 'politika', D: 'kalikasan' }, ans: 'A' },
  { id: 40, q: 'Sa kabuuan, ang globalisasyon at migrasyon ay may', options: { A: 'puro negatibong epekto', B: 'puro positibong epekto', C: 'parehong positibo at negatibong epekto', D: 'walang epekto' }, ans: 'C' }
];

// Add an AP MCQ problem generator so getProblem() can return AP items when currentTopic is set
ProblemGenerator.ap_long_quiz = () => {
  const tracker = questionTrackers.ap_long_quiz;
  
  // If all questions have been used, reset the tracker and create new shuffled order
  if (tracker.usedQuestions.length >= APQuestionBank.length) {
    tracker.usedQuestions = [];
    tracker.currentIndex = 0;
    // Create a new shuffled array of indices
    tracker.shuffledIndices = Array.from({length: APQuestionBank.length}, (_, i) => i);
    // Shuffle the indices using Fisher-Yates algorithm
    for (let i = tracker.shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracker.shuffledIndices[i], tracker.shuffledIndices[j]] = [tracker.shuffledIndices[j], tracker.shuffledIndices[i]];
    }
  }
  
  // If shuffledIndices is empty (first time), create it
  if (tracker.shuffledIndices.length === 0) {
    tracker.shuffledIndices = Array.from({length: APQuestionBank.length}, (_, i) => i);
    // Shuffle the indices using Fisher-Yates algorithm
    for (let i = tracker.shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracker.shuffledIndices[i], tracker.shuffledIndices[j]] = [tracker.shuffledIndices[j], tracker.shuffledIndices[i]];
    }
  }
  
  // Get the next question using shuffled index
  const questionIndex = tracker.shuffledIndices[tracker.currentIndex];
  const item = APQuestionBank[questionIndex];
  tracker.currentIndex++;
  
  // Mark this question as used
  tracker.usedQuestions.push(item.id);
  
  // Return a problem object with options and ans (letter)
  return {
    id: item.id,
    question: item.q,
    options: item.options,
    answer: item.ans
  };
};

// Add a TLE MCQ problem generator
ProblemGenerator.tle_quiz = () => {
  const tracker = questionTrackers.tle_quiz;
  
  // If all questions have been used, reset the tracker and create new shuffled order
  if (tracker.usedQuestions.length >= TLEQuestionBank.length) {
    tracker.usedQuestions = [];
    tracker.currentIndex = 0;
    // Create a new shuffled array of indices
    tracker.shuffledIndices = Array.from({length: TLEQuestionBank.length}, (_, i) => i);
    // Shuffle the indices using Fisher-Yates algorithm
    for (let i = tracker.shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracker.shuffledIndices[i], tracker.shuffledIndices[j]] = [tracker.shuffledIndices[j], tracker.shuffledIndices[i]];
    }
  }
  
  // If shuffledIndices is empty (first time), create it
  if (tracker.shuffledIndices.length === 0) {
    tracker.shuffledIndices = Array.from({length: TLEQuestionBank.length}, (_, i) => i);
    // Shuffle the indices using Fisher-Yates algorithm
    for (let i = tracker.shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracker.shuffledIndices[i], tracker.shuffledIndices[j]] = [tracker.shuffledIndices[j], tracker.shuffledIndices[i]];
    }
  }
  
  // Get the next question using shuffled index
  const questionIndex = tracker.shuffledIndices[tracker.currentIndex];
  const item = TLEQuestionBank[questionIndex];
  tracker.currentIndex++;
  
  // Mark this question as used
  tracker.usedQuestions.push(item.id);
  
  // Return a problem object with options and ans (letter)
  return {
    id: item.id,
    question: item.q,
    options: item.options,
    answer: item.ans
  };
};

function loadTopic() {
  const section = document.getElementById('topic-section');
  currentTopic = 'metric_conversion';

  // Study guide content for T.L.E.
  section.innerHTML = `
    <h2>STUDY GUIDE: AGRICULTURAL JOBS, CROP MAINTENANCE, AND WASTE MANAGEMENT</h2>
    
    <div style="background:#e8f5e9;padding:1rem;border-radius:8px;border-left:5px solid #4caf50;margin-bottom:1rem;">
      <h3>I. AGRICULTURAL JOBS</h3>
      <p><strong>Definition:</strong> Agricultural jobs refer to occupations directly involved in the production, processing, and management of crops and livestock. These roles ensure the sustainability and efficiency of the agriculture sector.</p>
      
      <h4>Major Agricultural Occupations</h4>
      <table style="width:100%;border-collapse:collapse;margin:1rem 0">
        <tr style="background:#e9ecef">
          <th style="padding:8px;border:1px solid #dee2e6">Job Title</th>
          <th style="padding:8px;border:1px solid #dee2e6">Primary Role</th>
          <th style="padding:8px;border:1px solid #dee2e6">Example Tasks</th>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Farmer</td>
          <td style="padding:8px;border:1px solid #dee2e6">Cultivates and manages crops or livestock</td>
          <td style="padding:8px;border:1px solid #dee2e6">Planting, watering, harvesting</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Farm Manager</td>
          <td style="padding:8px;border:1px solid #dee2e6">Oversees farm operations and personnel</td>
          <td style="padding:8px;border:1px solid #dee2e6">Planning schedules, managing labor and finances</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Agronomist</td>
          <td style="padding:8px;border:1px solid #dee2e6">Studies soil and crops for improved yield</td>
          <td style="padding:8px;border:1px solid #dee2e6">Conducting soil tests, recommending fertilizers</td>
        </tr>
      </table>
    </div>

    <div style="background:#efebe9;padding:1rem;border-radius:8px;border-left:5px solid #795548;margin-bottom:1rem;">
      <h3>II. CROP MAINTENANCE</h3>
      <p><strong>Definition:</strong> Crop maintenance is the process of caring for crops after planting to ensure proper growth, productivity, and resistance to pests and diseases.</p>
      
      <h4>Key Practices</h4>
      <table style="width:100%;border-collapse:collapse;margin:1rem 0">
        <tr style="background:#e9ecef">
          <th style="padding:8px;border:1px solid #dee2e6">Practice</th>
          <th style="padding:8px;border:1px solid #dee2e6">Description</th>
          <th style="padding:8px;border:1px solid #dee2e6">Purpose</th>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Weeding</td>
          <td style="padding:8px;border:1px solid #dee2e6">Removing unwanted plants</td>
          <td style="padding:8px;border:1px solid #dee2e6">Prevents competition for nutrients and sunlight</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Irrigation</td>
          <td style="padding:8px;border:1px solid #dee2e6">Controlled watering of crops</td>
          <td style="padding:8px;border:1px solid #dee2e6">Ensures sufficient moisture</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Fertilization</td>
          <td style="padding:8px;border:1px solid #dee2e6">Application of nutrients</td>
          <td style="padding:8px;border:1px solid #dee2e6">Promotes healthy crop growth</td>
        </tr>
      </table>
    </div>

    <div style="background:#e1f5fe;padding:1rem;border-radius:8px;border-left:5px solid #03a9f4;margin-bottom:1rem;">
      <h3>III. WASTE MANAGEMENT</h3>
      <p><strong>Definition:</strong> Waste management in agriculture refers to the systematic handling, reduction, recycling, and proper disposal of wastes produced from farm activities.</p>
      
      <h4>The 3Rs Principle</h4>
      <ul>
        <li><strong>Reduce</strong> – Minimize waste generation by using only what is necessary</li>
        <li><strong>Reuse</strong> – Use materials multiple times before disposal</li>
        <li><strong>Recycle</strong> – Process used materials into new useful products</li>
      </ul>

      <h4>Types of Agricultural Waste</h4>
      <table style="width:100%;border-collapse:collapse;margin:1rem 0">
        <tr style="background:#e9ecef">
          <th style="padding:8px;border:1px solid #dee2e6">Type</th>
          <th style="padding:8px;border:1px solid #dee2e6">Examples</th>
          <th style="padding:8px;border:1px solid #dee2e6">Description</th>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Biodegradable</td>
          <td style="padding:8px;border:1px solid #dee2e6">Rice straw, leaves, manure</td>
          <td style="padding:8px;border:1px solid #dee2e6">Can decompose naturally</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Non-Biodegradable</td>
          <td style="padding:8px;border:1px solid #dee2e6">Plastics, glass, metal cans</td>
          <td style="padding:8px;border:1px solid #dee2e6">Cannot easily decompose</td>
        </tr>
      </table>
    </div>

    <div style="background:#f1f8e9;padding:1rem;border-radius:8px;border-left:5px solid #689f38;margin-bottom:1rem;">
      <h3>IV. SUMMARY TABLE</h3>
      <table style="width:100%;border-collapse:collapse;margin:1rem 0">
        <tr style="background:#e9ecef">
          <th style="padding:8px;border:1px solid #dee2e6">Topic</th>
          <th style="padding:8px;border:1px solid #dee2e6">Core Concept</th>
          <th style="padding:8px;border:1px solid #dee2e6">Key Goal</th>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Agricultural Jobs</td>
          <td style="padding:8px;border:1px solid #dee2e6">Different roles in farming and agribusiness</td>
          <td style="padding:8px;border:1px solid #dee2e6">Efficient food production and management</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Crop Maintenance</td>
          <td style="padding:8px;border:1px solid #dee2e6">Care of crops through proper techniques</td>
          <td style="padding:8px;border:1px solid #dee2e6">Healthy, high-yield crops and sustainable farming</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #dee2e6">Waste Management</td>
          <td style="padding:8px;border:1px solid #dee2e6">Handling and disposal of farm wastes responsibly</td>
          <td style="padding:8px;border:1px solid #dee2e6">Environmental protection and sustainability</td>
        </tr>
      </table>
    </div>

    <div style="margin-top:1rem;">
      <button id="btn-open-quiz">Open Practice Quiz</button>
    </div>
  `;

  // Provide quick link to open Practice mode with AP questions
  document.getElementById('btn-open-quiz').addEventListener('click', () => {
    // switch topic to use TLE questions
    currentTopic = 'tle_quiz';
    // show Practice section
    if (typeof initPractice === 'function') initPractice();
    // navigate to Practice via main.js if available
    try { document.getElementById('btn-practice').click(); } catch (e) {}
  });
}

// Function to reset question tracking for a specific topic
function resetQuestionTracker(topic) {
  if (questionTrackers[topic]) {
    questionTrackers[topic].usedQuestions = [];
    questionTrackers[topic].currentIndex = 0;
    questionTrackers[topic].shuffledIndices = [];
  }
}

// Function to reset all question trackers
function resetAllQuestionTrackers() {
  Object.keys(questionTrackers).forEach(topic => {
    resetQuestionTracker(topic);
  });
}

// Always returns a valid problem
// Always returns a valid problem object: { question: string, answer: number }
function getProblem() {
  if (!currentTopic) {
    currentTopic = "metric_conversion"; // fallback
  }
  return ProblemGenerator[currentTopic]();
}
