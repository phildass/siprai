const request = require('supertest');
const app = require('../server');

describe('Press Release API', () => {
  let testPressReleaseId;

  describe('POST /api/press-releases', () => {
    it('should create a new press release', async () => {
      const pressRelease = {
        title: 'Test Press Release',
        content: 'This is a test press release content',
        author: 'Test Author',
        region: 'Tamil Nadu',
        category: 'Technology',
        contactEmail: 'test@example.com',
        contactPhone: '+91-9876543210'
      };

      const response = await request(app)
        .post('/api/press-releases')
        .send(pressRelease)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(pressRelease.title);
      expect(response.body.data.status).toBe('pending');
      
      testPressReleaseId = response.body.data.id;
    });

    it('should return error for invalid press release', async () => {
      const invalidPressRelease = {
        title: '',
        content: 'Content without title'
      };

      const response = await request(app)
        .post('/api/press-releases')
        .send(invalidPressRelease)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/press-releases', () => {
    it('should get all press releases', async () => {
      const response = await request(app)
        .get('/api/press-releases')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should filter press releases by region', async () => {
      const response = await request(app)
        .get('/api/press-releases?region=Tamil Nadu')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/press-releases/:id', () => {
    it('should get a press release by id', async () => {
      const response = await request(app)
        .get(`/api/press-releases/${testPressReleaseId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testPressReleaseId);
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .get('/api/press-releases/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/press-releases/:id', () => {
    it('should update a press release', async () => {
      const updates = {
        title: 'Updated Title',
        status: 'approved'
      };

      const response = await request(app)
        .put(`/api/press-releases/${testPressReleaseId}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.status).toBe(updates.status);
    });
  });

  describe('POST /api/press-releases/:id/distribute', () => {
    it('should distribute a press release', async () => {
      const response = await request(app)
        .post(`/api/press-releases/${testPressReleaseId}/distribute`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('distributed');
      expect(response.body.data.distributedAt).toBeDefined();
    });

    it('should not distribute an already distributed release', async () => {
      const response = await request(app)
        .post(`/api/press-releases/${testPressReleaseId}/distribute`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/press-releases/stats/summary', () => {
    it('should get statistics', async () => {
      const response = await request(app)
        .get('/api/press-releases/stats/summary')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('pending');
      expect(response.body.data).toHaveProperty('byRegion');
    });
  });

  describe('DELETE /api/press-releases/:id', () => {
    it('should delete a press release', async () => {
      const response = await request(app)
        .delete(`/api/press-releases/${testPressReleaseId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 when deleting non-existent release', async () => {
      const response = await request(app)
        .delete(`/api/press-releases/${testPressReleaseId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });
  });
});
