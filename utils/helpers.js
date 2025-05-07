// utils/helpers.js
/**
 * Generates a random string
 * @param {number} length - Length of string to generate
 * @returns {string} - Random string
 */
const generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  /**
   * Formats date as readable string
   * @param {Date} date - Date to format
   * @returns {string} - Formatted date string
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  module.exports = { generateRandomString, formatDate };