/**
 * Reverses text while preserving phonetic digraphs (ch, sh, etc.)
 * to make the output sound more natural when spoken backwards.
 */

const DIGRAPHS = /tch|dge|ch|sh|th|ph|wh|ng|gh|ck|qu|kn|wr|./gi;

export const reversePhonetically = (text: string): string => {
  if (!text) return '';

  return text.split(/(\s+)/).map(segment => {
    // Only process words, leave whitespace/punctuation as is
    if (/\w/.test(segment)) {
      const isCapitalized = segment[0] === segment[0].toUpperCase() && segment.length > 1;
      const tokens = segment.match(DIGRAPHS) || [];
      let reversed = tokens.reverse().join('').toLowerCase();

      if (isCapitalized) {
        reversed = reversed.charAt(0).toUpperCase() + reversed.slice(1);
      }
      return reversed;
    }
    return segment;
  }).join('');
};