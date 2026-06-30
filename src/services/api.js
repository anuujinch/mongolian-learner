const MYMEMORY = 'https://api.mymemory.translated.net/get'
const DICTIONARY = 'https://api.dictionaryapi.dev/api/v2/entries/en'

export async function translateWord(text, from = 'en', to = 'mn') {
  const url = `${MYMEMORY}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Translation request failed')
  const data = await res.json()
  if (data.responseStatus !== 200 && data.responseStatus !== '200') {
    throw new Error('Translation failed: ' + data.responseDetails)
  }
  return data.responseData.translatedText
}

export async function getWordDefinition(word) {
  const res = await fetch(`${DICTIONARY}/${encodeURIComponent(word)}`)
  if (!res.ok) return null
  const data = await res.json()
  return Array.isArray(data) ? data[0] : null
}

export async function buildContextExamples(word, definition) {
  // Pull up to 3 examples from the dictionary
  const rawExamples = []
  if (definition?.meanings) {
    for (const meaning of definition.meanings) {
      for (const def of meaning.definitions) {
        if (def.example && rawExamples.length < 3) rawExamples.push(def.example)
      }
    }
  }

  // Fall back to generated sentences if needed
  const toFill = 3 - rawExamples.length
  if (toFill > 0) {
    const fallbacks = [
      `The concept of ${word} is important to understand.`,
      `She studied the meaning of ${word} carefully.`,
      `We use the word ${word} in everyday language.`,
    ]
    rawExamples.push(...fallbacks.slice(0, toFill))
  }

  const translated = await Promise.allSettled(
    rawExamples.map(s => translateWord(s))
  )

  return rawExamples.map((en, i) => ({
    english: en,
    mongolian: translated[i].status === 'fulfilled' ? translated[i].value : '...',
  }))
}
