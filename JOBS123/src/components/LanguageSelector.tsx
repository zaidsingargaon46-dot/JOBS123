import React from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

const LANG_OPTIONS: { code: Language; label: string; aria: string }[] = [
  { code: 'en', label: 'EN', aria: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ', aria: 'Kannada' },
  { code: 'hi', label: 'हिन्दी', aria: 'Hindi' },
];

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useApp();

  return (
    <div
      role="group"
      aria-label="Language selector"
      className="inline-flex items-center rounded-lg bg-[#E8F0EB] p-1 border border-[#D4E2D9] shrink-0"
    >
      {LANG_OPTIONS.map((opt) => {
        const active = language === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            aria-label={opt.aria}
            aria-pressed={active}
            className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123B65] ${
              active
                ? 'bg-[#123B65] text-white'
                : 'text-[#263238] hover:bg-white/70'
            }`}
          >
            {compact ? opt.label : opt.code === 'en' ? 'English' : opt.label}
          </button>
        );
      })}
    </div>
  );
};
