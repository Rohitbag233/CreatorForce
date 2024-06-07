document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Ensure the dummy admin user is stored in localStorage
    const adminUsername = 'admin';
    const adminPassword = 'Rohit@123';
    const adminUser = { username: adminUsername, password: adminPassword, role: 'admin' };

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (!users[adminUsername]) {
        users[adminUsername] = adminUser;
        localStorage.setItem('users', JSON.stringify(users));
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (users[username] && users[username].password === password) {
                localStorage.setItem('authenticatedUser', JSON.stringify({ username, role: users[username].role }));
                window.location.href = users[username].role === 'admin' ? 'admin.html' : 'user.html';
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authenticatedUser');
            window.location.href = 'login.html';
        });
    }
});
