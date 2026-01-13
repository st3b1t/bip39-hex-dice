# Hex Dice 🎲 Bip39 Mnemonic Generator

Generate a 12-24 word [BIP39 mnemonic](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) using hex dice, inspired by: [bitup.space/8ff](http://bitup.space/8ff/) | [iancoleman.io/bip39](https://iancoleman.io/bip39/) | [valerio-vaccaro/TRMG](https://github.com/valerio-vaccaro/TRMG)

Author: [st3b1t](https://x.com/st3b1t) | [GitHub Sources](https://github.com/st3b1t/bip39-hex-dice) | [Donate](https://github.com/st3b1t#donate)

Online Demo: [st3b1t.github.io/bip39-hex-dice](https://st3b1t.github.io/bip39-hex-dice)

## About the project
This project is built entirely with vanilla JavaScript, without any external dependencies or frameworks.
Only the CSS styles from Bootstrap are included to enhance the user interface, keeping the codebase lightweight and easy to audit.

This design choice was made to maximize security and minimize potential bugs or vulnerabilities that can arise from third-party libraries, making the tool more trustworthy for sensitive use cases such as generating cryptographic mnemonics.

## Security Recommendations

You can try the tool using the online demo:
https://st3b1t.github.io/bip39-hex-dice/index.html

**For maximum security and privacy, it is strongly recommended to use this page offline.**

Simply save the page locally from your browser saved .html file will remain fully functional, similar to how https://iancoleman.io/bip39 can be used on air-gapped hardware.

*It is always encouraged to use dice as the source of entropy. 
The `Simulate Roll` function is only to facilitate development mode and exceeds the primary scope of this project.*

## Requirements

You will need one 8-sided die and two 16-sided dice, as shown below.

![Dice](src/dices.png)

## Development

You can work in development mode without compilation by simply opening the file `/src/index.html` directly in your browser.
This allows for quick testing and iterations. After the changes compile the project to generate a new standalone page `/index.html` for offline use.

Run the `compile.py` script to merge resources from the `/src` folder and generate a new `/index.html` file:

```bash
python3 compile.py
```

This command creates and replace the compiled version in `/index.html`.
Make sure you have Python2/3 installed and `compile.py` available in your PATH.

# Contribute

This project is open source and welcomes community contributions.
You can submit pull requests for new features or bug fixes, and report issues to help improve the tool.
All contributions are appreciated and reviewed with care.
