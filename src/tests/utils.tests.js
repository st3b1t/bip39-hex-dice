//TODO include utils.js
//...work in progress...

import { decodeEntry, getRandomFace, validChecksum, genFinalWords } from '../src/utils.js';

//scrivi unit test per utils.js
describe('utils.js', function() {
  // Mock globale WORDLIST
  beforeAll(function() {
    window.WORDLIST = [];
    for (let i = 0; i < 2048; i++) {
      WORDLIST.push('word' + i);
    }
  });

  describe('decodeEntry', function() {
    it('decodifica una entry valida', function() {
      const entry = '18F';
      // group = 0, row = 8, col = 15, index = 0*256 + 8*16 + 15 = 143
      const result = decodeEntry(entry);
      expect(result.word).toBe('word143');
      expect(result.index).toBe(143);
    });

    it('lancia errore se la lunghezza non è 3', function() {
      expect(() => decodeEntry('12')).toThrow();
    });

    it('lancia errore se il primo carattere non è 1-8', function() {
      expect(() => decodeEntry('98F')).toThrow();
    });

    it('lancia errore se secondo o terzo carattere non sono hex', function() {
      expect(() => decodeEntry('1XZ')).toThrow();
    });

    it('lancia errore se l\'indice è fuori dal WORDLIST', function() {
      expect(() => decodeEntry('8FF')).toThrow();
    });
  });

  describe('getRandomFace', function() {
    beforeAll(function() {
      spyOn(window.crypto, 'getRandomValues').and.callFake(arr => {
        arr[0] = 7; arr[1] = 15; arr[2] = 10;
        return arr;
      });
    });

    it('genera una stringa casuale nel formato corretto', async function() {
      const face = await getRandomFace();
      expect(face.length).toBe(3);
      expect(face[0]).toMatch(/[1-8]/);
      expect(face[1]).toMatch(/[0-9A-F]/);
      expect(face[2]).toMatch(/[0-9A-F]/);
    });
  });

  describe('validChecksum', function() {
    beforeAll(function() {
      // Mock crypto.subtle.digest
      spyOn(window.crypto.subtle, 'digest').and.callFake(async function(alg, arr) {
        // Restituisce 32 byte di zeri
        return new Uint8Array(32).buffer;
      });
    });

    it('restituisce false se la lunghezza dei bit non è valida', async function() {
      const result = await validChecksum(['word1', 'word2']);
      expect(result).toBe(false);
    });

    it('restituisce true se il checksum corrisponde (mock)', async function() {
      // 12 parole = 132 bit, ENT = 128, CS = 4
      const words = [];
      for (let i = 0; i < 12; i++) words.push('word0');
      const result = await validChecksum(words);
      expect(result).toBe(true);
    });
  });

  describe('genFinalWords', function() {
    beforeAll(function() {
      spyOn(window, 'validChecksum').and.callFake(async function(words) {
        // Solo 'word42' è valido come ultima parola
        return words[words.length - 1] === 'word42';
      });
    });

    it('restituisce solo le parole con checksum valido', async function() {
      const result = await genFinalWords(['word0', 'word1']);
      expect(result).toContain('word42');
      expect(result.length).toBe(1);
    });
  });
});
