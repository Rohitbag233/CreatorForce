document.addEventListener('DOMContentLoaded', () => {
    // Fetch user data function
    const fetchUserData = async (username) => {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || {};
            if (!users[username]) {
                throw new Error('User not found');
            }
            return users[username];
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Calculate equity
    const calculateEquity = (userPoints, allUsers) => {
        const totalPoints = Object.values(allUsers).reduce((sum, user) => sum + (user.points || 0), 0);
        return totalPoints === 0 ? 0 : (userPoints / totalPoints) * 100;
    };

    // Display user data function
    const displayUserData = (userData, users) => {
        const userCard = document.getElementById('user-card');
        if (!userData) {
            userCard.innerHTML = 'Error fetching user data';
            return;
        }

        // Calculate equity for the user
        const equity = calculateEquity(userData.points || 0, users);

        userCard.innerHTML = `
            <img src="${userData.avatar || 'https://via.placeholder.com/100'}" alt="Avatar" class="card-avatar">
            <div class="card-title text-xl font-bold text-white">${userData.username}</div>
            <div class="card-text text-white">Email: ${userData.email || 'N/A'}</div>
            <div class="card-text text-white">Points: ${userData.points || 0}</div>
            <div class="card-text text-white">Equity: ${equity.toFixed(2)}%</div>
        `;
    };

    // Get authenticated user from local storage
    const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (authenticatedUser && authenticatedUser.username) {
        fetchUserData(authenticatedUser.username)
            .then((userData) => {
                displayUserData(userData, users);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // Logout button event listener
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authenticatedUser');
            window.location.href = 'login.html';
        });
    }
});
