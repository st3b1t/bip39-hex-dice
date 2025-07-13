
function hasStrongCrypto() {
    if ('crypto' in window && window['crypto'] !== null) {
        return true;
    } else {
        throw new Error('Mnemonic should be generated with strong randomness, but crypto.getRandomValues() is unavailable');
    }
}

async function fetchBip39Raw (lang) {
  return await fetch(`https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/${lang}.txt`)
    .then(resp => resp.text())
    .then(text => text.split('\n').filter(line => line.trim() !== ''));
}

async function genRandomFace() {
    const randomBytes = new Uint8Array(3); //3 bytes of randomness
    hasStrongCrypto();
    await crypto.getRandomValues(randomBytes);
    return  (randomBytes[0] % 8 + 1).toString() + //range 1-8
            (randomBytes[1] % 16).toString(16) +  //range 0-15, hex
            (randomBytes[2] % 16).toString(16);   //range 0-15, hex
}

function decodeEntry(inputValue) {
    const entry = inputValue.trim().toUpperCase();

    if (!entry || entry.length !== 3) {
        throw new Error("Enter 3 characters for the dice roll, e.g., '28E'");
    }
    if (!/^[1-8]$/.test(entry[0])) {
        throw new Error("The first character must be a number from 1 to 8.");
    }
    const first = parseInt(entry[0], 10);
    
    if (!/^[0-9A-F]$/.test(entry[1])) {
        throw new Error("The second character must be hex (0-9, A-F).");
    }
    const second = parseInt(entry[1], 16);

    if (!/^[0-9A-F]$/.test(entry[2])) {
        throw new Error("The third character must be hex (0-9, A-F).");
    }
    const third = parseInt(entry[2], 16);

    const wordIndex = (first - 1) * 256
                + second * 16
                + third;

    if (wordIndex >= WORDLIST.length) {
        throw new Error(`Error value ${inputValue}, word index is out of bounds.`);
    }

    return WORDLIST[wordIndex];
}

async function validChecksum(words) {
    const indexes = words.map(w => WORDLIST.indexOf(w));
    const bits = indexes.map(i => i.toString(2).padStart(11, '0')).join('');

    const total_bit_length = bits.length;
    if (![132, 165, 198, 231, 264].includes(total_bit_length)) {
        return false;
    }

    const ENT = total_bit_length * 32 / 33;
    const CS = total_bit_length - ENT;

    const entropy_bits = bits.substring(0, ENT);
    const checksum_bits = bits.substring(ENT);

    const entropy_bytes = new Uint8Array(ENT / 8);
    for (let i = 0; i < ENT / 8; i++) {
        entropy_bytes[i] = parseInt(entropy_bits.substring(i * 8, (i + 1) * 8), 2);
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', entropy_bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash_bits = hashArray.map(b => b.toString(2).padStart(8, '0')).join('');
    
    const expected_checksum = hash_bits.substring(0, CS);

    return checksum_bits === expected_checksum;
}

async function genFinalWords(partialWords) {
    const validWords = [];
    for (const word of WORDLIST) {
        if (await validChecksum([...partialWords, word])) {
            validWords.push(word);
        }
    }
    return validWords;
}