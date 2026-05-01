# BACKWORDS 🔊 
### Phonetic Text Reverser for Natural Speech

Backwords is a React-based utility that reverses text while preserving phonetic clusters (digraphs). Standard text reversers turn "Cheese" into "eseehC" (unpronounceable). EchoBack turns it into "Eseech," preserving the 'ch' sound so it sounds like the word is actually being spoken backwards.

## ✨ Features
- **Phonetic Preservation:** Keeps `ch`, `sh`, `th`, `ph`, `ng`, etc., together during reversal.
- **Title Case Awareness:** Maintains proper capitalization (e.g., "Hello" -> "Olleh").
- **TTS Integration:** Integrated Speech Synthesis to hear your reversed phrases immediately.
- **Responsive Design:** Clean, modern UI built with TypeScript and CSS-in-JS.

## 🛠️ Tech Stack
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** CSS-in-JS / Standard CSS
- **Speech API:** Web Speech API (SpeechSynthesis)

## 🚀 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/ngmays1/backwords.git