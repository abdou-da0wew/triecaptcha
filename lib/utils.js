/**
 * Validate and normalize options
 */
function validateOptions(options) {
  const defaults = {
    width: 300,
    height: 100,
    textColor: '#FFFFFF',
    length: 6,
    characters: '0123456789',
    background: '#000000',
    noise: 300,
    font: 'bold 50px Arial',
    hashAlgorithm: 'sha256'
  };

  const validated = { ...defaults, ...options };

  // Validate numeric values
  if (typeof validated.width !== 'number' || validated.width <= 0) {
    throw new Error('Width must be a positive number');
  }
  
  if (typeof validated.height !== 'number' || validated.height <= 0) {
    throw new Error('Height must be a positive number');
  }

  // Validate length
  if (typeof validated.length !== 'number' || validated.length <= 0) {
    throw new Error('Length must be a positive number');
  }

  return validated;
}

/**
 * Generate random string for CAPTCHA
 */
function generateRandomString(length, characters) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Create noisy background
 */
function createNoisyBackground(ctx, width, height, background, noiseCount) {
  // Fill background
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Inverted spectrum colors
  const spectrum = [
    '#FFFFFF', '#8B00FF', '#4B0082', '#0000FF', '#00FF00', 
    '#FFFF00', '#FF7F00', '#FF0000', '#000000'
  ];

  // Add noise
  for (let i = 0; i < noiseCount; i++) {
    ctx.beginPath();
    const color = spectrum[Math.floor(Math.random() * spectrum.length)];
    ctx.fillStyle = color;
    ctx.arc(
      Math.random() * width, 
      Math.random() * height, 
      Math.random() * 2, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
  }
}

/**
 * Apply distortion to text
 */
function applyTextDistortion(ctx, text, options) {
  const { font, color, width, height } = options;
  
  ctx.font = font;
  ctx.fillStyle = color;

  const charWidth = width / (text.length + 1);
  
  for (let i = 0; i < text.length; i++) {
    ctx.save();
    
    // Position and transform each character
    ctx.translate(
      charWidth * (i + 0.5) + Math.random() * 10 - 5,
      height / 2 + Math.random() * 20 - 10
    );
    
    // Rotation
    ctx.rotate(Math.random() * 0.8 - 0.4);
    
    // Skew effect
    ctx.transform(1, 0.3 + Math.random() * 0.5, 0.1, 1, 0, 0);
    
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
}

module.exports = {
  validateOptions,
  generateRandomString,
  createNoisyBackground,
  applyTextDistortion
};