# Hex Dice 🎲 Bip39 Mnemonic Generator

Generate a 12-24 word [BIP39 mnemonic](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) using hex dice, inspired by: [bitup.space/8ff](http://bitup.space/8ff/) | [iancoleman.io/bip39](https://iancoleman.io/bip39/)  
Author: [st3b1t](https://x.com/st3b1t) | [GitHub Sources](https://github.com/st3b1t/bip39-hex-dice) | [Donate](https://github.com/st3b1t#donate)

## Download and use offline

Access the offline version here:  
https://st3b1t.github.io/bip39-hex-dice/index.html

## Requirements

You will need one 8-sided die and two 16-sided dice, as shown below.

![Dice](src/dices.png)

## Development

After making changes to the source files, compile the project to generate a new standalone page for offline use.

Run the `compile.py` script to merge resources from the `/src` folder and generate a new `/index.html` file:

```bash
python3 compile.py
```

This command creates the optimized version in `dist/`.  
Make sure you have Python installed and `compile.py` available in your PATH.