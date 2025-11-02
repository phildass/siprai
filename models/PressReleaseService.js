const PressRelease = require('../models/PressRelease');

// In-memory database (replace with actual database in production)
const pressReleases = [];

class PressReleaseService {
  static create(data) {
    const pressRelease = new PressRelease(data);
    const errors = pressRelease.validate();
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    pressReleases.push(pressRelease);
    return pressRelease;
  }
  
  static getAll(filters = {}) {
    let results = [...pressReleases];
    
    if (filters.region && filters.region !== 'All') {
      results = results.filter(pr => pr.region === filters.region || pr.region === 'All');
    }
    
    if (filters.category) {
      results = results.filter(pr => pr.category === filters.category);
    }
    
    if (filters.status) {
      results = results.filter(pr => pr.status === filters.status);
    }
    
    // Sort by createdAt descending
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return results;
  }
  
  static getById(id) {
    return pressReleases.find(pr => pr.id === id);
  }
  
  static update(id, data) {
    const index = pressReleases.findIndex(pr => pr.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedData = {
      ...pressReleases[index],
      ...data,
      id: pressReleases[index].id, // Preserve original id
      createdAt: pressReleases[index].createdAt, // Preserve original creation date
      updatedAt: new Date().toISOString()
    };
    
    const updatedPressRelease = new PressRelease(updatedData);
    const errors = updatedPressRelease.validate();
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    pressReleases[index] = updatedPressRelease;
    return updatedPressRelease;
  }
  
  static delete(id) {
    const index = pressReleases.findIndex(pr => pr.id === id);
    
    if (index === -1) {
      return false;
    }
    
    pressReleases.splice(index, 1);
    return true;
  }
  
  static distribute(id) {
    const pressRelease = this.getById(id);
    
    if (!pressRelease) {
      return null;
    }
    
    if (pressRelease.status === 'distributed') {
      throw new Error('Press release already distributed');
    }
    
    return this.update(id, {
      status: 'distributed',
      distributedAt: new Date().toISOString()
    });
  }
  
  static getStats() {
    return {
      total: pressReleases.length,
      pending: pressReleases.filter(pr => pr.status === 'pending').length,
      approved: pressReleases.filter(pr => pr.status === 'approved').length,
      distributed: pressReleases.filter(pr => pr.status === 'distributed').length,
      byRegion: {
        'Tamil Nadu': pressReleases.filter(pr => pr.region === 'Tamil Nadu').length,
        'Kerala': pressReleases.filter(pr => pr.region === 'Kerala').length,
        'Karnataka': pressReleases.filter(pr => pr.region === 'Karnataka').length,
        'Andhra Pradesh': pressReleases.filter(pr => pr.region === 'Andhra Pradesh').length,
        'Telangana': pressReleases.filter(pr => pr.region === 'Telangana').length,
        'All': pressReleases.filter(pr => pr.region === 'All').length
      }
    };
  }
}

module.exports = PressReleaseService;
