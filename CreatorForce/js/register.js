document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            let users = JSON.parse(localStorage.getItem('users')) || {};

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
});
