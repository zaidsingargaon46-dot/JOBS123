import { Language } from '../types';
import { en, TranslationKeys } from './en';
import { hi } from './hi';
import { kn } from './kn';

export type { TranslationKeys };

const DICTIONARIES: Record<Language, Record<TranslationKeys, string>> = {
  en,
  kn,
  hi,
};

const SKILL_TRANSLATIONS: Record<string, Record<Language, string>> = {
  Mason: { en: 'Mason', kn: 'ಮೇಸ್ತ್ರಿ', hi: 'राजमिस्त्री' },
  Electrician: { en: 'Electrician', kn: 'ಎಲೆಕ್ಟ್ರಿಷಿಯನ್', hi: 'इलेक्ट्रीशियन' },
  Plumber: { en: 'Plumber', kn: 'ಪ್ಲಂಬರ್', hi: 'प्लंबर' },
  Carpenter: { en: 'Carpenter', kn: 'ಬಡಗಿ', hi: 'बढ़ई' },
  Painter: { en: 'Painter', kn: 'ಪೇಂಟರ್', hi: 'पेंटर' },
  Welder: { en: 'Welder', kn: 'ವೆಲ್ಡರ್', hi: 'वेल्डर' },
  Helper: { en: 'Helper', kn: 'ಸಹಾಯಕ', hi: 'सहायक' },
  'Solar Technician': { en: 'Solar Technician', kn: 'ಸೋಲಾರ್ ತಂತ್ರಜ್ಞ', hi: 'सोलर तकनीशियन' },
  'AC Technician': { en: 'AC Technician', kn: 'ಎಸಿ ತಂತ್ರಜ್ಞ', hi: 'एसी तकनीशियन' },
  'Tile Setter': { en: 'Tile Setter', kn: 'ಟೈಲ್ಸ್ ಕೆಲಸಗಾರ', hi: 'टाइल मिस्त्री' },
  Gardener: { en: 'Gardener', kn: 'ತೋಟಗಾರ', hi: 'माली' },
  Loader: { en: 'Loader', kn: 'ಲೋಡರ್', hi: 'लोडर' },
};

export function translate(
  lang: Language,
  key: TranslationKeys | string,
  params?: Record<string, string | number>
): string {
  const dict = DICTIONARIES[lang] || DICTIONARIES.en;
  let text = (dict as Record<string, string>)[key] || (DICTIONARIES.en as Record<string, string>)[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}

export function translateSkill(lang: Language, skill: string): string {
  return SKILL_TRANSLATIONS[skill]?.[lang] || skill;
}
