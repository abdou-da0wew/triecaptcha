# Triecaptcha

CAPTCHA generator for Node.js with customizable options.

## Installation

```bash
npm install triecaptcha
```

## Usage

### Basic Usage

```javascript
const CAPTCHAGenerator = require('triecaptcha');
const fs = require('fs');

const captcha = new CAPTCHAGenerator();
const { image, text, hash } = captcha.generate();

// Save image to file
fs.writeFileSync('captcha.png', image);

console.log(`CAPTCHA text: ${text}`);
console.log(`CAPTCHA hash: ${hash}`);
```

### Custom Options

```javascript
const captcha = new CAPTCHAGenerator({
  width: 400,
  height: 150,
  length: 8,
  characters: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', // Avoid ambiguous characters
  textColor: '#FF5733',
  background: '#F0F0F0',
  noise: 500,
  font: 'bold 60px Comic Sans MS'
});
```

### Verification

```javascript
const isValid = captcha.verify(userInput, storedHash);
```

### Express Example

See `examples/express-example.js` for a complete Express server implementation.

## Options

| Option      | Type    | Default            | Description |
|-------------|---------|--------------------|-------------|
| width       | number  | 300                | Image width |
| height      | number  | 100                | Image height |
| textColor   | string  | '#FFFFFF'          | Text color |
| length      | number  | 6                  | CAPTCHA length |
| characters  | string  | '0123456789'       | Characters to use |
| background  | string  | '#000000'          | Background color |
| noise       | number  | 300                | Number of noise elements |
| font        | string  | 'bold 50px Arial'  | Font style |
| hashAlgorithm | string | 'sha256'        | Hash algorithm for verification |

## License

MIT
