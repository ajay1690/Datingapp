// Fetch the user's name and potential matches dynamically (on load)
window.onload = async function () {
    try {
      const response = await fetch('/api/dashboard');  // Fetch user and matches data from server
      const data = await response.json();
      document.getElementById('user-name').textContent = data.user.name;
  
      const matchesContainer = document.getElementById('matches-container');
      data.matches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.classList.add('match-card');
        matchDiv.innerHTML = `
          <img src="/uploads/${match.profilePicture}" alt="${match.name}" class="profile-pic">
          <p>${match.name} (${match.gender})</p>
        `;
        matchesContainer.appendChild(matchDiv);
      });
    } catch (err) {
      console.error('Error loading matches', err);
    }
  };
  
  // Find Match button functionality
  document.getElementById('find-match-btn').addEventListener('click', async function() {
    try {
      const response = await fetch('/api/find-match', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        alert(`You've been matched with ${data.match.name}!`);
      } else {
        alert('No match found at this time. Try again later.');
      }
    } catch (err) {
      console.error('Error finding match', err);
    }
  });
  