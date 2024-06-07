document.addEventListener('DOMContentLoaded', () => {
    const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));

    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
        // Redirect non-authenticated or non-admin roles to the login page
        window.location.href = 'login.html';
    }

    const pointsForm = document.getElementById('points-form');
    const changePasswordForm = document.getElementById('change-password-form');
    let users = JSON.parse(localStorage.getItem('users')) || {};

    const renderUsersTable = () => {
        const usersTableBody = document.querySelector('#users-table tbody');
        usersTableBody.innerHTML = '';

        Object.keys(users).forEach(username => {
            const user = users[username];
            const row = document.createElement('tr');

            const usernameCell = document.createElement('td');
            usernameCell.className = 'border border-gray-300 p-2';
            usernameCell.textContent = user.username;
            row.appendChild(usernameCell);

            const pointsCell = document.createElement('td');
            pointsCell.className = 'border border-gray-300 p-2';
            pointsCell.textContent = user.points !== undefined ? user.points : 0;
            row.appendChild(pointsCell);

            usersTableBody.appendChild(row);
        });
    };

    renderUsersTable();

    pointsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const points = parseInt(document.getElementById('points').value);

        if (users[username]) {
            users[username].points = (users[username].points || 0) + points;
            localStorage.setItem('users', JSON.stringify(users));
            alert(`Points assigned to ${username}.`);
            renderUsersTable();
        } else {
            alert('User not found.');
        }
    });

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('current-password').value.trim();
            const newPassword = document.getElementById('new-password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match.');
                return;
            }

            const adminUsername = authenticatedUser.username;
            if (users[adminUsername].password === currentPassword) {
                users[adminUsername].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
                alert('Password changed successfully.');
                changePasswordForm.reset();
            } else {
                alert('Current password is incorrect.');
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
