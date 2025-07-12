
async function getRandomFace() {
    const randomBytes = new Uint8Array(3);
    await crypto.getRandomValues(randomBytes);
    return  (randomBytes[0] % 8 + 1).toString() + 
            (randomBytes[1] % 16).toString(16).toUpperCase() + 
            (randomBytes[2] % 16).toString(16).toUpperCase();
}

function decodeEntry(entry) {
    if (entry.length !== 3) {
        throw new Error("Enter 3 characters for the dice roll, e.g., '28E'");
    }
    const group = parseInt(entry[0], 10) - 1;
    if (isNaN(group) || group < 0 || group > 7) {
        throw new Error("The first character must be a number from 1 to 8.");
    }
    const row = parseInt(entry[1], 16);
    const col = parseInt(entry[2], 16);
    if (isNaN(row) || isNaN(col)) {
            throw new Error("The second and third characters must be hex (0-9, A-F).");
    }
    const index = group * 256 + row * 16 + col;
    if (index >= WORDLIST.length) {
        throw new Error("Error, word index is out of bounds.");
    }
    return { word: WORDLIST[index], index };
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
    const words = [];
    for (const word of WORDLIST) {
        if (await validChecksum([...partialWords, word])) {
            words.push(word);
        }
    }
    return words;
}