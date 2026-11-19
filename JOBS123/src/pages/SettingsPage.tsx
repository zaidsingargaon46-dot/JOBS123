import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageSelector } from '../components/LanguageSelector';

export const SettingsPage: React.FC = () => {
  const { t, accessibility, setAccessibility, resetDemoData } = useApp();
  const [resetMessage, setResetMessage] = useState(false);

  const handleReset = async () => {
    await resetDemoData();
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 3500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('settingsTitle')}</h1>
        <p className="text-sm sm:text-base text-[#546E7A] mt-1">{t('settingsSubtitle')}</p>
      </div>

      {/* Language Preference */}
      <section className="bg-white border border-[#D4E2D9] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#123B65]">{t('secLanguage')}</h2>
        <LanguageSelector />
      </section>

      {/* Accessibility */}
      <section className="bg-white border border-[#D4E2D9] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#123B65]">{t('secAccessibility')}</h2>

        <label className="flex items-center justify-between gap-4 cursor-pointer py-2">
          <span className="text-sm font-medium text-[#263238]">{t('optLargeText')}</span>
          <input
            type="checkbox"
            checked={accessibility.largeText}
            onChange={(e) =>
              setAccessibility({ ...accessibility, largeText: e.target.checked })
            }
            className="w-5 h-5 accent-[#16A36A]"
          />
        </label>

        <label className="flex items-center justify-between gap-4 cursor-pointer py-2 border-t border-[#E8F0EB]">
          <span className="text-sm font-medium text-[#263238]">{t('optHighContrast')}</span>
          <input
            type="checkbox"
            checked={accessibility.highContrast}
            onChange={(e) =>
              setAccessibility({ ...accessibility, highContrast: e.target.checked })
            }
            className="w-5 h-5 accent-[#16A36A]"
          />
        </label>
      </section>

      {/* Phase 1 Local Storage Notice & Reset */}
      <section className="bg-white border border-[#D4E2D9] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#123B65]">{t('secPhase1Notice')}</h2>
        <p className="text-sm text-[#455A64] leading-relaxed">{t('phase1NoticeBody')}</p>

        {resetMessage && (
          <div role="status" className="p-3 rounded-lg bg-[#E8F0EB] border border-[#BBF7D0] text-sm text-[#14532D]">
            {t('demoResetDone')}
          </div>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[42px] px-4 py-2 rounded-lg bg-[#E8F0EB] hover:bg-[#DCE8E0] text-[#123B65] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>{t('btnResetDemo')}</span>
        </button>
      </section>
    </div>
  );
};
