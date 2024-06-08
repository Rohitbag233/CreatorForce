document.addEventListener('DOMContentLoaded', () => {
    const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));

    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
        window.location.href = 'login.html';
    }

    const pointsForm = document.getElementById('points-form');
    const changePasswordForm = document.getElementById('change-password-form');

    const renderUsersTable = async () => {
        const usersTableBody = document.querySelector('#users-table tbody');
        usersTableBody.innerHTML = '';

        try {
            const usersSnapshot = await db.collection('users').get();
            usersSnapshot.forEach(doc => {
                const user = doc.data();
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
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    renderUsersTable();

    pointsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const points = parseInt(document.getElementById('points').value);

        try {
            const userDoc = await db.collection('users').doc(username).get();
            if (userDoc.exists) {
                const user = userDoc.data();
                await db.collection('users').doc(username).update({
                    points: (user.points || 0) + points
                });
                alert(`Points assigned to ${username}.`);
                renderUsersTable();
            } else {
                alert('User not found.');
            }
        } catch (error) {
            console.error('Error assigning points:', error);
            alert('Error assigning points.');
        }
    });

    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('change-username').value.trim();
        const newPassword = document.getElementById('new-password').value.trim();

        try {
            const userDoc = await db.collection('users').doc(username).get();
            if (userDoc.exists) {
                await db.collection('users').doc(username).update({
                    password: newPassword
                });
                alert(`Password changed for ${username}.`);
            } else {
                alert('User not found.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Error changing password.');
        }
    });

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authenticatedUser');
            window.location.href = 'login.html';
        });
    }
});
