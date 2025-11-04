const PressRelease = require('../models/PressRelease');

describe('PressRelease Model', () => {
  describe('Constructor', () => {
    it('should create a press release with all fields', () => {
      const data = {
        title: 'Test Title',
        content: 'Test Content',
        author: 'Test Author',
        region: 'Tamil Nadu',
        category: 'Technology',
        contactEmail: 'test@example.com',
        contactPhone: '+91-9876543210'
      };

      const pr = new PressRelease(data);

      expect(pr.id).toBeDefined();
      expect(pr.title).toBe(data.title);
      expect(pr.content).toBe(data.content);
      expect(pr.status).toBe('pending');
      expect(pr.createdAt).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should validate a correct press release', () => {
      const pr = new PressRelease({
        title: 'Valid Title',
        content: 'Valid Content',
        author: 'Valid Author',
        region: 'Kerala',
        category: 'Business',
        contactEmail: 'valid@example.com'
      });

      const errors = pr.validate();
      expect(errors).toHaveLength(0);
    });

    it('should return error for missing title', () => {
      const pr = new PressRelease({
        content: 'Content',
        author: 'Author',
        region: 'Karnataka',
        category: 'Sports',
        contactEmail: 'test@example.com'
      });

      const errors = pr.validate();
      expect(errors).toContain('Title is required');
    });

    it('should return error for missing content', () => {
      const pr = new PressRelease({
        title: 'Title',
        author: 'Author',
        region: 'Telangana',
        category: 'Health',
        contactEmail: 'test@example.com'
      });

      const errors = pr.validate();
      expect(errors).toContain('Content is required');
    });

    it('should return error for invalid region', () => {
      const pr = new PressRelease({
        title: 'Title',
        content: 'Content',
        author: 'Author',
        region: 'Invalid Region',
        category: 'Education',
        contactEmail: 'test@example.com'
      });

      const errors = pr.validate();
      expect(errors).toContain('Invalid region');
    });

    it('should return error for invalid category', () => {
      const pr = new PressRelease({
        title: 'Title',
        content: 'Content',
        author: 'Author',
        region: 'Andhra Pradesh',
        category: 'Invalid Category',
        contactEmail: 'test@example.com'
      });

      const errors = pr.validate();
      expect(errors).toContain('Invalid category');
    });

    it('should return error for invalid email', () => {
      const pr = new PressRelease({
        title: 'Title',
        content: 'Content',
        author: 'Author',
        region: 'Tamil Nadu',
        category: 'Politics',
        contactEmail: 'invalid-email'
      });

      const errors = pr.validate();
      expect(errors).toContain('Valid contact email is required');
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email', () => {
      const pr = new PressRelease({});
      expect(pr.isValidEmail('test@example.com')).toBe(true);
      expect(pr.isValidEmail('user.name+tag@example.co.in')).toBe(true);
    });

    it('should reject invalid email', () => {
      const pr = new PressRelease({});
      expect(pr.isValidEmail('invalid')).toBe(false);
      expect(pr.isValidEmail('test@')).toBe(false);
      expect(pr.isValidEmail('@example.com')).toBe(false);
    });
  });
});
