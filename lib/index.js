const { createCanvas } = require('canvas');
const crypto = require('crypto');
const { 
  generateRandomString,
  createNoisyBackground,
  applyTextDistortion,
  validateOptions
} = require('./utils');

class CAPTCHAGenerator {
  /**
   * Create a CAPTCHA generator
   * @param {Object} options - Configuration options
   * @param {number} [options.width=300] - Image width
   * @param {number} [options.height=100] - Image height
   * @param {string} [options.textColor='#FFFFFF'] - Text color
   * @param {number} [options.length=6] - CAPTCHA length
   * @param {string} [options.characters='0123456789'] - Characters to use
   * @param {string} [options.background='#000000'] - Background color
   * @param {number} [options.noise=300] - Number of noise elements
   * @param {string} [options.font='bold 50px Arial'] - Font style
   */
  constructor(options = {}) {
    const validated = validateOptions(options);
    
    this.width = validated.width;
    this.height = validated.height;
    this.textColor = validated.textColor;
    this.length = validated.length;
    this.characters = validated.characters;
    this.background = validated.background;
    this.noise = validated.noise;
    this.font = validated.font;
    this.hashAlgorithm = validated.hashAlgorithm;
  }

  /**
   * Generate a CAPTCHA
   * @returns {Object} CAPTCHA object with image, text, and hash
   */
  generate() {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    // Generate CAPTCHA text
    const text = generateRandomString(this.length, this.characters);
    
    // Create hash for verification
    const hash = crypto.createHash(this.hashAlgorithm)
      .update(text)
      .digest('hex');

    // Create background with noise
    createNoisyBackground(ctx, this.width, this.height, this.background, this.noise);
    
    // Apply text distortion
    applyTextDistortion(ctx, text, {
      font: this.font,
      color: this.textColor,
      width: this.width,
      height: this.height
    });

    return {
      image: canvas.toBuffer('image/png'),
      text: text,
      hash: hash
    };
  }

  /**
   * Verify user input against CAPTCHA hash
   * @param {string} userInput - User's input
   * @param {string} originalHash - Original hash to compare against
   * @returns {boolean} Whether the input matches the CAPTCHA
   */
  verify(userInput, originalHash) {
    if (!userInput || !originalHash) return false;
    
    const inputHash = crypto.createHash(this.hashAlgorithm)
      .update(userInput.toString())
      .digest('hex');
      
    return inputHash === originalHash;
  }
}

module.exports = CAPTCHAGenerator;