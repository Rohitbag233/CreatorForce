document.addEventListener('DOMContentLoaded', () => {
    const fetchUserData = async (username) => {
        try {
            const userDoc = await db.collection('users').doc(username).get();
            if (!userDoc.exists) {
                throw new Error('User not found');
            }
            return userDoc.data();
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    const calculateEquity = (userPoints, allUsers) => {
        const totalPoints = allUsers.reduce((sum, user) => sum + (user.points || 0), 0);
        return totalPoints === 0 ? 0 : (userPoints / totalPoints) * 100;
    };

    const displayUserData = async (userData, allUsers) => {
        const userCard = document.getElementById('user-card');
        if (!userData) {
            userCard.innerHTML = 'Error fetching user data';
            return;
        }

        const equity = calculateEquity(userData.points || 0, allUsers);

        userCard.innerHTML = `
            <img src="${userData.avatar || 'https://via.placeholder.com/100'}" alt="Avatar" class="card-avatar">
            <div class="card-title text-xl font-bold text-white">${userData.username}</div>
            <div class="card-text text-white">Email: ${userData.email || 'N/A'}</div>
            <div class="card-text text-white">Points: ${userData.points || 0}</div>
            <div class="card-text text-white">Equity: ${equity.toFixed(2)}%</div>
        `;
    };

    const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
    if (authenticatedUser && authenticatedUser.username) {
        fetchUserData(authenticatedUser.username)
            .then(async (userData) => {
                const usersSnapshot = await db.collection('users').get();
                const allUsers = usersSnapshot.docs.map(doc => doc.data());
                displayUserData(userData, allUsers);
            })
            .catch(error => {
                console.error('Error:', error);
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
