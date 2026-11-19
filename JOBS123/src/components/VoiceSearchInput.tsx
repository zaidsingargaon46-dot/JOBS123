import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface VoiceSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

export const VoiceSearchInput: React.FC<VoiceSearchInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const { language, t } = useApp();
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleVoiceToggle = () => {
    setVoiceMessage(null);
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      setVoiceMessage(t('voiceSearchUnsupported'));
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          onChange(transcript);
        }
        setListening(false);
      };

      recognition.onerror = () => {
        setVoiceMessage(t('voiceSearchError'));
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      setListening(true);
      recognition.start();
    } catch {
      setVoiceMessage(t('voiceSearchUnsupported'));
      setListening(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <Search
            className="w-5 h-5 text-[#546E7A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="w-full min-h-[48px] pl-11 pr-10 py-2.5 bg-white border border-[#C8D6CE] rounded-lg text-base text-[#263238] placeholder:text-[#607D8B] focus:outline-none focus:ring-2 focus:ring-[#123B65]"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#546E7A] hover:text-[#263238] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleVoiceToggle}
          aria-label={listening ? t('voiceSearchListening') : t('voiceSearchStart')}
          className={`min-h-[48px] px-4 py-2.5 rounded-lg font-semibold text-sm inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123B65] ${
            listening
              ? 'bg-[#B91C1C] text-white'
              : 'bg-[#E8F0EB] text-[#123B65] border border-[#C8D6CE] hover:bg-[#DCE8E0]'
          }`}
        >
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {listening ? t('voiceSearchListening') : t('voiceSearchStart')}
          </span>
        </button>
      </div>

      {voiceMessage && (
        <p role="status" className="mt-2 text-xs text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] rounded-md px-3 py-1.5">
          {voiceMessage}
        </p>
      )}
    </div>
  );
};
