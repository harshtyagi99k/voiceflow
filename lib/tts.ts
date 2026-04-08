// ⚠️ SERVER-ONLY — only import this in API routes (app/api/*)
// Never import this in client components or pages!
// For the VOICES list on client side, import from '@/lib/voices' instead

export interface TtsOptions {
  voice: string
  rate?: string  // e.g. "+0%", "-10%", "+20%"
  pitch?: string // e.g. "+0Hz", "-5Hz"
  volume?: string // e.g. "+0%"
}

export async function generateSpeech(text: string, options: TtsOptions): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts')
  
  const tts = new MsEdgeTTS()
  
  await tts.setMetadata(
    options.voice,
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
  )

  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
    <voice name='${options.voice}'>
      <prosody rate='${options.rate || "+0%"}' pitch='${options.pitch || "+0Hz"}' volume='${options.volume || "+0%"}'>
        ${escapeXml(text)}
      </prosody>
    </voice>
  </speak>`

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    
    const readable = tts.toStream(ssml)
    
    readable.on('data', (chunk: Buffer) => chunks.push(chunk))
    readable.on('end', () => resolve(Buffer.concat(chunks)))
    readable.on('error', reject)
  })
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
