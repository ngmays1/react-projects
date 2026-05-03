import React, { useState, CSSProperties } from 'react';

const TextReverser: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [smartMode, setSmartMode] = useState<boolean>(true);

  const reverseLogic = (text: string): string => {
    if (!text) return '';

    // 1. Define phonetic units (digraphs/trigraphs) to keep together
    // ch, sh, th, ph, wh, ng, gh, ck, qu, tch, dge
    const clusterRegex = /tch|dge|ch|sh|th|ph|wh|ng|gh|ck|qu|kn|wr|./gi;

    const reverseWord = (word: string) => {
      // Find the capitalization pattern of the original word
      const isCapitalized = word[0] === word[0].toUpperCase() && word.length > 1;
      
      // Tokenize the word into characters and clusters
      const tokens = word.match(clusterRegex) || [];
      const reversedTokens = tokens.reverse();

      let result = reversedTokens.join('').toLowerCase();

      // Re-apply capitalization if original was Title Case
      if (isCapitalized && result.length > 0) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
      }
      return result;
    };

    if (smartMode) {
      // Split by words to handle them individually (sounds better for speech)
      return text.split(/(\s+)/).map(segment => {
        // Only reverse if it's a word (not whitespace or punctuation)
        if (/\w/.test(segment)) {
          return reverseWord(segment);
        }
        return segment; // Keep whitespace as is
      }).join('');
    }

    // Fallback: Simple character reversal
    return text.split('').reverse().join('');
  };

  const handleReverse = (): void => {
    setOutputText(reverseLogic(inputText));
  };

  const handleSpeak = (): void => {
    if (!outputText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Styles
  const styles: Record<string, CSSProperties> = {
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '30px',
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      border: '1px solid #f0f0f0'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '15px',
      fontSize: '14px',
      color: '#666',
      cursor: 'pointer'
    },
    textarea: {
      width: '100%',
      height: '120px',
      padding: '15px',
      borderRadius: '10px',
      border: '2px solid #e0e0e0',
      fontSize: '18px',
      marginBottom: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    buttonGroup: { display: 'flex', gap: '12px', marginBottom: '25px' },
    primaryBtn: {
      flex: 2,
      padding: '14px',
      backgroundColor: '#4F46E5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '16px'
    },
    secondaryBtn: {
      flex: 1,
      padding: '14px',
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '16px'
    },
    outputBox: {
      padding: '20px',
      backgroundColor: '#F9FAFB',
      borderRadius: '10px',
      minHeight: '80px',
      border: '1px dashed #D1D5DB',
      fontSize: '24px',
      textAlign: 'center',
      color: '#111827',
      lineHeight: '1.4'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#111827' }}>Phonetic Reverser</h1>
      
      <textarea
        style={styles.textarea}
        placeholder="Type something like 'Cheese and Ships'..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <label style={styles.label}>
        <input 
          type="checkbox" 
          checked={smartMode} 
          onChange={(e) => setSmartMode(e.target.checked)} 
        />
        Smart Mode (Keep sounds like 'ch' and 'sh' together)
      </label>

      <div style={styles.buttonGroup}>
        <button style={styles.primaryBtn} onClick={handleReverse}>Reverse Text</button>
        <button style={styles.secondaryBtn} onClick={handleSpeak}>🔊 Speak</button>
      </div>

      <div style={styles.outputBox}>
        {outputText || <span style={{ color: '#9CA3AF', fontSize: '18px' }}>Waiting for input...</span>}
      </div>
      
      <p style={{ fontSize: '12px', color: '#999', marginTop: '15px', textAlign: 'center' }}>
        Try: "The cheese is sharp" → "Eht eseech si prahs"
      </p>
    </div>
  );
};

export default TextReverser;