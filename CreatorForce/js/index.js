document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        const { username, role } = loggedInUser;
        const welcomeMessage = document.getElementById('welcome-message');
        const adminLink = document.getElementById('admin-link');

        welcomeMessage.textContent = `Welcome, ${username}!`;

        // Show admin link if user is an admin
        if (role === 'admin') {
            adminLink.classList.remove('hidden');
            adminLink.href = 'admin.html';
        }

        // Logout functionality
        const logoutButton = document.getElementById('logout-button');
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    } else {
        // If no user is logged in, redirect to login page
        window.location.href = 'login.html';
    }
});
