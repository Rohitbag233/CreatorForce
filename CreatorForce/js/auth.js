document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Dummy admin user for the demonstration
    const adminUsername = 'admin';
    const adminPassword = 'Rohit@123';
    const adminUser = { username: adminUsername, password: adminPassword, role: 'admin' };

    // Ensure the dummy admin user is stored in localStorage
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
                if (users[username].role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'user.html';
                }
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (username === '' || password === '') {
                alert('Username and password are required.');
                return;
            }

            if (users[username]) {
                alert('Username is already taken.');
                return;
            }

            users[username] = { username, password, points: 0, role: 'user' };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful. You can now log in.');
            window.location.href = 'login.html';
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
