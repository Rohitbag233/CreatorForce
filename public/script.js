// Define the changePassword function globally
function changePassword() {
    // Retrieve passwordFeedback element
    const passwordFeedback = document.getElementById('password-feedback');

    // Your existing function code goes here
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');

    const currentPassword = currentPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();

    // Retrieve admin user data from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || {};
    const adminUsername = 'admin';
    const adminUser = users[adminUsername];

    // Verify current password
    if (adminUser && adminUser.password === currentPassword) {
        // Update password
        adminUser.password = newPassword;
        users[adminUsername] = adminUser;
        localStorage.setItem('users', JSON.stringify(users));
        passwordFeedback.textContent = 'Password changed successfully.';
        passwordFeedback.style.color = 'green';
    } else {
        passwordFeedback.textContent = 'Incorrect current password. Password change failed.';
        passwordFeedback.style.color = 'red';
    }

    // Clear input fields
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const changePasswordForm = document.getElementById('change-password-form');

    // Attach changePassword function to form submit event
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        changePassword(); // Call the changePassword function
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to display other users' points
    function displayOtherUsersPoints() {
        const otherUsersPointsList = document.getElementById('other-users-points');
        otherUsersPointsList.innerHTML = ''; // Clear previous entries
        
        // Retrieve user data from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || {};

        // Loop through each user
        for (let username in users) {
            // Skip the admin user
            if (username !== 'admin') {
                const user = users[username];
                const listItem = document.createElement('li');
                listItem.textContent = `${username}: ${user.points}`;
                otherUsersPointsList.appendChild(listItem);
            }
        }
    }

    // Display other users' points when the page loads
    displayOtherUsersPoints();
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to check if the user is logged in as an admin
    function isAdminLoggedIn() {
        // Retrieve user data from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || {};
        const adminUsername = 'admin';

        // Check if the admin user is logged in
        return users[adminUsername] && users[adminUsername].isLoggedIn === true;
    }

    // Function to render the appropriate page based on user role
    function renderPage() {
        if (isAdminLoggedIn()) {
            // Render admin page
            window.location.href = 'admin.html';
        } else {
            // Render user page
            window.location.href = 'user.html';
        }
    }

    // Render the appropriate page when the DOM is loaded
    renderPage();
});
