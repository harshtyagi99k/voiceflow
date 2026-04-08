// ✅ This file is SAFE to import on client-side (no Node.js modules)
// Voice list for Microsoft Edge TTS

export const VOICES = [
  // Hindi voices
  { id: 'hi-IN-SwaraNeural', name: 'Swara (Hindi Female)', lang: 'Hindi', gender: 'Female' },
  { id: 'hi-IN-MadhurNeural', name: 'Madhur (Hindi Male)', lang: 'Hindi', gender: 'Male' },

  // English India
  { id: 'en-IN-NeerjaNeural', name: 'Neerja (English-IN Female)', lang: 'English (India)', gender: 'Female' },
  { id: 'en-IN-PrabhatNeural', name: 'Prabhat (English-IN Male)', lang: 'English (India)', gender: 'Male' },

  // English US/UK
  { id: 'en-US-JennyNeural', name: 'Jenny (English-US Female)', lang: 'English (US)', gender: 'Female' },
  { id: 'en-US-GuyNeural', name: 'Guy (English-US Male)', lang: 'English (US)', gender: 'Male' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia (English-UK Female)', lang: 'English (UK)', gender: 'Female' },

  // Tamil
  { id: 'ta-IN-PallaviNeural', name: 'Pallavi (Tamil Female)', lang: 'Tamil', gender: 'Female' },
  { id: 'ta-IN-ValluvarNeural', name: 'Valluvar (Tamil Male)', lang: 'Tamil', gender: 'Male' },

  // Telugu
  { id: 'te-IN-MohanNeural', name: 'Mohan (Telugu Male)', lang: 'Telugu', gender: 'Male' },
  { id: 'te-IN-ShrutiNeural', name: 'Shruti (Telugu Female)', lang: 'Telugu', gender: 'Female' },

  // Bengali
  { id: 'bn-IN-TanishaaNeural', name: 'Tanishaa (Bengali Female)', lang: 'Bengali', gender: 'Female' },
  { id: 'bn-IN-BashkarNeural', name: 'Bashkar (Bengali Male)', lang: 'Bengali', gender: 'Male' },

  // Marathi
  { id: 'mr-IN-AarohiNeural', name: 'Aarohi (Marathi Female)', lang: 'Marathi', gender: 'Female' },
  { id: 'mr-IN-ManoharNeural', name: 'Manohar (Marathi Male)', lang: 'Marathi', gender: 'Male' },

  // Gujarati
  { id: 'gu-IN-DhwaniNeural', name: 'Dhwani (Gujarati Female)', lang: 'Gujarati', gender: 'Female' },
  { id: 'gu-IN-NiranjanNeural', name: 'Niranjan (Gujarati Male)', lang: 'Gujarati', gender: 'Male' },

  // Kannada
  { id: 'kn-IN-SapnaNeural', name: 'Sapna (Kannada Female)', lang: 'Kannada', gender: 'Female' },
  { id: 'kn-IN-GaganNeural', name: 'Gagan (Kannada Male)', lang: 'Kannada', gender: 'Male' },

  // Malayalam
  { id: 'ml-IN-MidhunNeural', name: 'Midhun (Malayalam Male)', lang: 'Malayalam', gender: 'Male' },
  { id: 'ml-IN-SobhanaNeural', name: 'Sobhana (Malayalam Female)', lang: 'Malayalam', gender: 'Female' },

  // Punjabi
  { id: 'pa-IN-OjaswanthNeural', name: 'Ojaswanth (Punjabi Male)', lang: 'Punjabi', gender: 'Male' },
  { id: 'pa-IN-VaaniNeural', name: 'Vaani (Punjabi Female)', lang: 'Punjabi', gender: 'Female' },

  // World languages
  { id: 'ar-AE-FatimaNeural', name: 'Fatima (Arabic Female)', lang: 'Arabic', gender: 'Female' },
  { id: 'zh-CN-XiaoxiaoNeural', name: 'Xiaoxiao (Chinese Female)', lang: 'Chinese', gender: 'Female' },
  { id: 'es-ES-ElviraNeural', name: 'Elvira (Spanish Female)', lang: 'Spanish', gender: 'Female' },
  { id: 'fr-FR-DeniseNeural', name: 'Denise (French Female)', lang: 'French', gender: 'Female' },
  { id: 'de-DE-KatjaNeural', name: 'Katja (German Female)', lang: 'German', gender: 'Female' },
  { id: 'ja-JP-NanamiNeural', name: 'Nanami (Japanese Female)', lang: 'Japanese', gender: 'Female' },
]

export type Voice = typeof VOICES[0]
