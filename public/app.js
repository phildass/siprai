const API_BASE = '/api/press-releases';

// Tab management
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const btns = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    btns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'view') {
        loadPressReleases();
    } else if (tabName === 'stats') {
        loadStatistics();
    }
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Form submission
document.getElementById('press-release-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        author: document.getElementById('author').value,
        region: document.getElementById('region').value,
        category: document.getElementById('category').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value
    };
    
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Press release submitted successfully!', 'success');
            document.getElementById('press-release-form').reset();
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to submit press release', 'error');
    }
});

// Load press releases
async function loadPressReleases() {
    const region = document.getElementById('filter-region').value;
    const category = document.getElementById('filter-category').value;
    const status = document.getElementById('filter-status').value;
    
    let url = API_BASE;
    const params = new URLSearchParams();
    
    if (region) params.append('region', region);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    
    if (params.toString()) {
        url += '?' + params.toString();
    }
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            displayPressReleases(result.data);
        } else {
            showNotification('Failed to load press releases', 'error');
        }
    } catch (error) {
        showNotification('Failed to load press releases', 'error');
    }
}

// Display press releases
function displayPressReleases(pressReleases) {
    const container = document.getElementById('press-releases-list');
    
    if (pressReleases.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📰</div>
                <h3>No press releases found</h3>
                <p>Submit your first press release to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pressReleases.map(pr => `
        <div class="press-release-card">
            <div class="card-header">
                <div>
                    <h3 class="card-title">${escapeHtml(pr.title)}</h3>
                    <div class="card-meta">
                        <span class="badge badge-region">📍 ${escapeHtml(pr.region)}</span>
                        <span class="badge badge-category">🏷️ ${escapeHtml(pr.category)}</span>
                        <span class="badge badge-status ${pr.status}">${escapeHtml(pr.status.toUpperCase())}</span>
                    </div>
                </div>
            </div>
            <div class="card-content">
                ${escapeHtml(pr.content.substring(0, 300))}${pr.content.length > 300 ? '...' : ''}
            </div>
            <div class="card-footer">
                <div class="card-info">
                    <div><strong>Author:</strong> ${escapeHtml(pr.author)}</div>
                    <div><strong>Contact:</strong> ${escapeHtml(pr.contactEmail)}</div>
                    <div><strong>Created:</strong> ${formatDate(pr.createdAt)}</div>
                    ${pr.distributedAt ? `<div><strong>Distributed:</strong> ${formatDate(pr.distributedAt)}</div>` : ''}
                </div>
                <div class="card-actions">
                    ${pr.status !== 'distributed' ? `
                        <button class="btn btn-success btn-small" onclick="distributePressRelease('${pr.id}')">
                            Distribute
                        </button>
                    ` : ''}
                    <button class="btn btn-danger btn-small" onclick="deletePressRelease('${pr.id}')">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Distribute press release
async function distributePressRelease(id) {
    if (!confirm('Are you sure you want to distribute this press release?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/${id}/distribute`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Press release distributed successfully!', 'success');
            loadPressReleases();
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to distribute press release', 'error');
    }
}

// Delete press release
async function deletePressRelease(id) {
    if (!confirm('Are you sure you want to delete this press release?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Press release deleted successfully!', 'success');
            loadPressReleases();
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to delete press release', 'error');
    }
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE}/stats/summary`);
        const result = await response.json();
        
        if (result.success) {
            displayStatistics(result.data);
        } else {
            showNotification('Failed to load statistics', 'error');
        }
    } catch (error) {
        showNotification('Failed to load statistics', 'error');
    }
}

// Display statistics
function displayStatistics(stats) {
    const container = document.getElementById('statistics-container');
    
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${stats.total}</div>
                <div class="stat-label">Total Releases</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.pending}</div>
                <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.approved}</div>
                <div class="stat-label">Approved</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.distributed}</div>
                <div class="stat-label">Distributed</div>
            </div>
        </div>
        
        <div class="region-stats">
            <h3>Distribution by Region</h3>
            ${Object.entries(stats.byRegion).map(([region, count]) => `
                <div class="region-stat-item">
                    <span>${region}</span>
                    <strong>${count}</strong>
                </div>
            `).join('')}
        </div>
    `;
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
