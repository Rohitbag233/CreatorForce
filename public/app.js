document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission in admin.html
    const pointsForm = document.getElementById('points-form');
    if (pointsForm) {
        pointsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const points = parseInt(document.getElementById('points').value, 10);

            if (username === '' || isNaN(points) || points < 0 || points > 10) {
                alert('Please provide a valid username and points between 0 and 10.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/assign-points', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, points })
                });
                const result = await response.json();
                alert(result.message);
                pointsForm.reset();
            } catch (error) {
                alert('Error assigning points.');
            }
        });
    }

    // Display user points and equity in user.html
    const userDetails = document.getElementById('user-details');
    if (userDetails) {
        const authenticatedUser = localStorage.getItem('authenticatedUser');
        if (authenticatedUser) {
            fetch(`http://localhost:3000/user/${authenticatedUser}`)
                .then(response => response.json())
                .then(data => {
                    if (data.points !== undefined) {
                        userDetails.innerHTML = `
                            <p class="text-xl font-bold">Points: ${data.points}</p>
                            <p class="text-xl font-bold">Equity: ${data.equity.toFixed(2)}%</p>
                        `;
                    } else {
                        userDetails.innerHTML = '<p class="text-xl font-bold">No points assigned yet.</p>';
                    }
                });
        }
    }
});
