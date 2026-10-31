/**
 * Browser-supported Speech Synthesis & Recognition helper for Kannada & English
 */

export function speakText(text: string, lang = 'kn-IN'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser');
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // Slightly slower for clear pronunciation
    utterance.pitch = 1.0;

    // Pick best available voice for language if available
    const voices = window.speechSynthesis.getVoices();
    const voiceMatch = voices.find((v) => v.lang.includes(lang.split('-')[0]) || v.lang === lang);
    if (voiceMatch) {
      utterance.voice = voiceMatch;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
