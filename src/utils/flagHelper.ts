/**
 * Utility to map emoji flags or team names to high-quality PNG flag URLs from FlagCDN.
 * This ensures beautiful, colorful flag rendering on all systems, including Windows,
 * which by default does not render emoji flags and displays two-letter country codes instead.
 */

const COUNTRY_MAP: Record<string, string> = {
  'méxico': 'mx', 'mexico': 'mx',
  'canadá': 'ca', 'canada': 'ca',
  'estados unidos': 'us', 'usa': 'us', 'estadosunidos': 'us',
  'marruecos': 'ma', 'morocco': 'ma',
  'argentina': 'ar',
  'arabia saudita': 'sa', 'arabia': 'sa', 'saudi': 'sa',
  'españa': 'es', 'espana': 'es', 'spain': 'es',
  'japón': 'jp', 'japon': 'jp', 'japan': 'jp',
  'brasil': 'br', 'brazil': 'br',
  'corea del sur': 'kr', 'corea': 'kr', 'korea': 'kr',
  'alemania': 'de', 'germany': 'de',
  'costa rica': 'cr', 'costarica': 'cr',
  'francia': 'fr', 'france': 'fr',
  'inglaterra': 'gb-eng', 'england': 'gb-eng',
  'italia': 'it', 'italy': 'it',
  'portugal': 'pt',
  'uruguay': 'uy',
  'colombia': 'co',
  'países bajos': 'nl', 'paises bajos': 'nl', 'holanda': 'nl', 'netherlands': 'nl',
  'bélgica': 'be', 'belgica': 'be', 'belgium': 'be',
  'croacia': 'hr', 'croatia': 'hr',
  'ecuador': 'ec',
  'perú': 'pe', 'peru': 'pe',
  'chile': 'cl',
  'venezuela': 've',
  'bolivia': 'bo',
  'paraguay': 'py',
  'panamá': 'pa', 'panama': 'pa',
  'honduras': 'hn',
  'el salvador': 'sv',
  'guatemala': 'gt',
  'senegal': 'sn',
  'ghana': 'gh',
  'camerún': 'cm', 'camerun': 'cm',
  'túnez': 'tn', 'tunez': 'tn',
  'suiza': 'ch', 'switzerland': 'ch',
  'dinamarca': 'dk', 'denmark': 'dk',
  'suecia': 'se', 'sweden': 'se',
  'polonia': 'pl', 'poland': 'pl',
  'turquía': 'tr', 'turquia': 'tr', 'turkey': 'tr',
  'australia': 'au',
  'nueva zelanda': 'nz', 'new zealand': 'nz',
  'egipto': 'eg', 'egypt': 'eg',
  'ucrania': 'ua', 'ukraine': 'ua',
  'gales': 'gb-wls', 'wales': 'gb-wls',
  'escocia': 'gb-sct', 'scotland': 'gb-sct',
  'serbia': 'rs',
  'austria': 'at',
  'republica checa': 'cz', 'czechia': 'cz',
  'rumania': 'ro', 'romania': 'ro',
  'grecia': 'gr', 'greece': 'gr',
  'costa de marfil': 'ci', 'marfil': 'ci',
  'nigeria': 'ng',
  'argelia': 'dz', 'algeria': 'dz',
  'irán': 'ir', 'iran': 'ir',
  'irak': 'iq', 'iraq': 'iq',
  'qatar': 'qa', 'catar': 'qa',
  'china': 'cn',
  'sudáfrica': 'za', 'sudafrica': 'za', 'south africa': 'za',
  'bosnia y herzegovina': 'ba', 'bosnia': 'ba',
  'haití': 'ht', 'haiti': 'ht',
  'curazao': 'cw', 'curacao': 'cw',
  'cabo verde': 'cv',
  'noruega': 'no', 'norway': 'no',
  'jordania': 'jo', 'jordan': 'jo',
  'rd congo': 'cd', 'congo rd': 'cd',
  'uzbekistán': 'uz', 'uzbekistan': 'uz'
};

const EMOJI_MAP: Record<string, string> = {
  '🇲🇽': 'mx', '🇨🇦': 'ca', '🇺🇸': 'us', '🇲🇦': 'ma', '🇦🇷': 'ar', '🇸🇦': 'sa', '🇪🇸': 'es', '🇯🇵': 'jp', '🇧🇷': 'br', '🇰🇷': 'kr',
  '🇩🇪': 'de', '🇨🇷': 'cr', '🇫🇷': 'fr', '🏴\u200D󠁢󠁥󠁮󠁧󠁿': 'gb-eng', '🇮🇹': 'it', '🇵🇹': 'pt', '🇺🇾': 'uy', '🇨🇴': 'co', '🇳🇱': 'nl',
  '🇧🇪': 'be', '🇭🇷': 'hr', '🇪🇨': 'ec', '🇵🇪': 'pe', '🇨🇱': 'cl', '🇻🇪': 've', '🇧🇴': 'bo', '🇵🇾': 'py', '🇵🇦': 'pa', '🇭🇳': 'hn',
  '🇸🇻': 'sv', '🇬🇹': 'gt', '🇸🇳': 'sn', '🇬🇭': 'gh', '🇨🇲': 'cm', '🇹🇳': 'tn', '🇨🇭': 'ch', '🇩🇰': 'dk', '🇸🇪': 'se', '🇵🇱': 'pl',
  '🇹🇷': 'tr', '🇦🇺': 'au', '🇳🇿': 'nz', '🇪🇬': 'eg', '🇺🇦': 'ua', '🏴󠁧󠁢󠁷󠁬󠁳󠁿': 'gb-wls', '🏴󠁧󠁢󠁳󠁣󠁴󠁿': 'gb-sct', '🇷🇸': 'rs', '🇦🇹': 'at',
  '🇨🇿': 'cz', '🇷🇴': 'ro', '🇬🇷': 'gr', '🇨🇮': 'ci', '🇳🇬': 'ng', '🇩🇿': 'dz', '🇮🇷': 'ir', '🇮🇶': 'iq', '🇶🇦': 'qa', '🇨🇳': 'cn',
  '🇿🇦': 'za', '🇧🇦': 'ba', '🇭🇹': 'ht', '🇨🇼': 'cw', '🇨🇻': 'cv', '🇳🇴': 'no', '🇯🇴': 'jo', '🇨🇩': 'cd', '🇺🇿': 'uz'
};

export const getTeamFlagUrl = (flag: string, teamName?: string): string | null => {
  const name = (teamName || '').toLowerCase().trim();
  const f = flag.trim();

  // 1. Exact match in emoji map
  if (EMOJI_MAP[f]) {
    return `https://flagcdn.com/w80/${EMOJI_MAP[f]}.png`;
  }

  // 2. Exact match in country map
  if (COUNTRY_MAP[name]) {
    return `https://flagcdn.com/w80/${COUNTRY_MAP[name]}.png`;
  }

  // 3. Partial check: does the country name contain any of our key names?
  for (const key of Object.keys(COUNTRY_MAP)) {
    if (name.includes(key) && key.length > 3) {
      return `https://flagcdn.com/w80/${COUNTRY_MAP[key]}.png`;
    }
  }

  // 4. Letter code patterns in flag
  for (const key of Object.keys(COUNTRY_MAP)) {
    if (f.toUpperCase().includes(COUNTRY_MAP[key].toUpperCase())) {
      return `https://flagcdn.com/w80/${COUNTRY_MAP[key]}.png`;
    }
  }

  return null;
};
