import React, { useState, CSSProperties } from 'react';
import { useTheme } from '../context/ThemeContext';

const TextReverser: React.FC = () => {
  const { tokens } = useTheme();
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [smartMode, setSmartMode] = useState<boolean>(true);

  const reverseLogic = (text: string): string => {
    if (!text) return '';

    const clusterRegex = /tch|dge|ch|sh|th|ph|wh|ng|gh|ck|qu|kn|wr|./gi;

    const reverseWord = (word: string) => {
      const isCapitalized = word[0] === word[0].toUpperCase() && word.length > 1;
      const tokens = word.match(clusterRegex) || [];
      const reversedTokens = tokens.reverse();
      let result = reversedTokens.join('').toLowerCase();
      if (isCapitalized && result.length > 0) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
      }
      return result;
    };

    if (smartMode) {
      return text.split(/(\s+)/).map(segment => {
        if (/\w/.test(segment)) return reverseWord(segment);
        return segment;
      }).join('');
    }

    return text.split('').reverse().join('');
  };

  const handleReverse = (): void => setOutputText(reverseLogic(inputText));

  const handleSpeak = (): void => {
    if (!outputText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const styles: Record<string, CSSProperties> = {
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '30px',
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: tokens.surface,
      borderRadius: '16px',
      boxShadow: tokens.shadow,
      border: `1px solid ${tokens.border}`,
      transition: 'background-color 0.3s, border-color 0.3s',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '15px',
      fontSize: '14px',
      color: tokens.textSecondary,
      cursor: 'pointer',
    },
    textarea: {
      width: '100%',
      height: '120px',
      padding: '15px',
      borderRadius: '10px',
      border: `2px solid ${tokens.border}`,
      fontSize: '18px',
      marginBottom: '15px',
      outline: 'none',
      transition: 'border-color 0.2s, background-color 0.3s',
      backgroundColor: tokens.bg,
      color: tokens.textPrimary,
    },
    buttonGroup: { display: 'flex', gap: '12px', marginBottom: '25px' },
    primaryBtn: {
      flex: 2,
      padding: '14px',
      backgroundColor: tokens.accent,
      color: tokens.accentFg,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '16px',
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
      fontSize: '16px',
    },
    outputBox: {
      padding: '20px',
      backgroundColor: tokens.surfaceHover,
      borderRadius: '10px',
      minHeight: '80px',
      border: `1px dashed ${tokens.border}`,
      fontSize: '24px',
      textAlign: 'center',
      color: tokens.textPrimary,
      lineHeight: '1.4',
      transition: 'background-color 0.3s, border-color 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', margin: '0 0 20px 0', color: tokens.textPrimary }}>Phonetic Reverser</h1>

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
        {outputText || <span style={{ color: tokens.textMuted, fontSize: '18px' }}>Waiting for input...</span>}
      </div>

      <p style={{ fontSize: '12px', color: tokens.textMuted, marginTop: '15px', textAlign: 'center' }}>
        Try: "The cheese is sharp" → "Eht eseech si prahs"
      </p>
    </div>
  );
};

export default TextReverser;
