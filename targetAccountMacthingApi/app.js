// API endpoints
const API_URL = 'http://localhost:3000';

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const companiesList = document.getElementById('companiesList');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

// Check if user is already logged in
const token = localStorage.getItem('token');
if (token) {
    showDashboard();
    fetchCompanies();
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            showDashboard();
            fetchCompanies();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Error connecting to server');
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('token');
    showLogin();
}

// Fetch Companies
async function fetchCompanies() {
    try {
        const response = await fetch(`${API_URL}/accounts`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            const companies = await response.json();
            displayCompanies(companies);
        } else {
            throw new Error('Failed to fetch companies');
        }
    } catch (error) {
        alert('Error fetching companies');
        handleLogout();
    }
}

// Update Company Status
async function updateCompanyStatus(companyId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/accounts/${companyId}/status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            fetchCompanies(); // Refresh the list
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to update status');
        }
    } catch (error) {
        alert('Error updating company status');
    }
}

// Display Companies
function displayCompanies(companies) {
    companiesList.innerHTML = companies.map(company => `
        <div class="card company-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">${company.name}</h5>
                        <p class="card-text">
                            Match Score: ${company.matchScore}%<br>
                            Status: <span class="badge ${company.status === 'Target' ? 'bg-success' : 'bg-secondary'}">${company.status}</span>
                        </p>
                    </div>
                    <div>
                        <button 
                            class="btn ${company.status === 'Target' ? 'btn-secondary' : 'btn-success'}"
                            onclick="updateCompanyStatus(${company.id}, '${company.status === 'Target' ? 'Not Target' : 'Target'}')"
                        >
                            ${company.status === 'Target' ? 'Mark as Not Target' : 'Mark as Target'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// UI Helpers
function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
}

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
} 