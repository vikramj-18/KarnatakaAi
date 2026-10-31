import React, { useState, useEffect } from 'react';
import { getHeritageGuide } from '../services/api';
import { speakText, stopSpeaking } from '../services/audio';
import {
  Landmark,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  CheckCircle2,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface HeritageCompanionModalProps {
  monumentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const HeritageCompanionModal: React.FC<HeritageCompanionModalProps> = ({
  monumentName,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !monumentName) return null;

  const [guideData, setGuideData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    stopSpeaking();
    setIsPlayingAudio(false);

    getHeritageGuide(monumentName)
      .then((data) => {
        if (isMounted) {
          setGuideData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Heritage guide load error', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      stopSpeaking();
    };
  }, [monumentName]);

  const handleToggleAudio = () => {
    if (!guideData?.audioGuideScript) return;

    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(guideData.audioGuideScript, 'en-IN').finally(() => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleSelectQuiz = (qIdx: number, optIdx: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">AI Heritage Companion</h3>
              <p className="text-xs text-stone-500">Audio Guide & Architectural Storyteller</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-stone-500 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-600" />
            <p>Retrieving verified architectural inscriptions and folklore for {monumentName}...</p>
          </div>
        ) : guideData ? (
          <div className="mt-5 space-y-5 text-xs text-stone-700">
            {/* Monument Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-800">
                  {guideData.dynastyAndPeriod || 'Historic Dynasty Era'}
                </span>
                <h4 className="text-lg font-extrabold text-stone-900 mt-0.5">{guideData.monumentName}</h4>
              </div>

              {/* Audio Playback Button */}
              <button
                onClick={handleToggleAudio}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 ${
                  isPlayingAudio
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-amber-300'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Stop Audio Guide' : 'Play 2-Min Audio Guide'}</span>
              </button>
            </div>

            {/* Audio Script Quote Box */}
            <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 italic leading-relaxed border border-stone-800 relative">
              <span className="text-amber-400 font-bold block not-italic text-[11px] mb-1">
                🎧 Spoken Audio Script:
              </span>
              "{guideData.audioGuideScript}"
            </div>

            {/* Historical Overview */}
            <div>
              <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                Historical Context & Verified Facts
              </h5>
              <p className="leading-relaxed text-stone-700 font-normal">
                {guideData.historicalOverview}
              </p>
            </div>

            {/* Architectural Highlights */}
            {guideData.architecturalHighlights && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1.5">Architectural Details to Observe:</span>
                <ul className="space-y-1">
                  {guideData.architecturalHighlights.map((hl: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5 text-stone-600">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Folklore vs Verified Fact */}
            {guideData.folkloreVsFact && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                  <span className="font-bold text-orange-900 block text-[11px] uppercase">
                    ✨ Popular Folklore & Legend
                  </span>
                  <p className="mt-1 text-orange-950 leading-relaxed">
                    {guideData.folkloreVsFact.popularLegend}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-900 block text-[11px] uppercase">
                    📜 Verified Historical Inscriptions
                  </span>
                  <p className="mt-1 text-emerald-950 leading-relaxed">
                    {guideData.folkloreVsFact.verifiedHistory}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Interactive Quiz */}
            {guideData.quizQuestions && guideData.quizQuestions.length > 0 && (
              <div className="pt-2 border-t border-stone-200">
                <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                  Quick Traveller Heritage Quiz
                </h5>

                {guideData.quizQuestions.map((q: any, qIdx: number) => {
                  const userAnswer = selectedQuizAnswers[qIdx];
                  const hasAnswered = userAnswer !== undefined;
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div key={qIdx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 mb-2">
                      <p className="font-bold text-stone-800 mb-2">{q.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {q.options.map((opt: string, optIdx: number) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuiz(qIdx, optIdx)}
                            className={`p-2 rounded-xl text-left text-xs border transition-all ${
                              userAnswer === optIdx
                                ? isCorrect
                                  ? 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold'
                                  : 'bg-red-50 border-red-300 text-red-900'
                                : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {hasAnswered && (
                        <div
                          className={`mt-2 p-2 rounded-lg text-[11px] ${
                            isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {isCorrect ? '✅ Correct! ' : '💡 Fact: '}
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
