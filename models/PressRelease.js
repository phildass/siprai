const { v4: uuidv4 } = require('uuid');

class PressRelease {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.content = data.content;
    this.author = data.author;
    this.region = data.region; // Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, All
    this.category = data.category; // Business, Politics, Sports, Entertainment, Technology, Health, Education
    this.contactEmail = data.contactEmail;
    this.contactPhone = data.contactPhone;
    this.status = data.status || 'pending'; // pending, approved, distributed
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.distributedAt = data.distributedAt || null;
  }

  validate() {
    const errors = [];
    
    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }
    
    if (!this.content || this.content.trim().length === 0) {
      errors.push('Content is required');
    }
    
    if (!this.author || this.author.trim().length === 0) {
      errors.push('Author is required');
    }
    
    if (!this.region) {
      errors.push('Region is required');
    }
    
    const validRegions = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'All'];
    if (this.region && !validRegions.includes(this.region)) {
      errors.push('Invalid region');
    }
    
    if (!this.category) {
      errors.push('Category is required');
    }
    
    const validCategories = ['Business', 'Politics', 'Sports', 'Entertainment', 'Technology', 'Health', 'Education'];
    if (this.category && !validCategories.includes(this.category)) {
      errors.push('Invalid category');
    }
    
    if (!this.contactEmail || !this.isValidEmail(this.contactEmail)) {
      errors.push('Valid contact email is required');
    }
    
    return errors;
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = PressRelease;
