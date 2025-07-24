
// Form validation and localStorage for submission form
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const title = form.title.value.trim();
      const description = form.description.value.trim();
      if (!title || !description) {
        alert('Please fill in all required fields.');
        return;
      }
      const submission = {
        title: title,
        description: description,
        timestamp: new Date().toISOString()
      };
      let submissions = JSON.parse(localStorage.getItem('submissions')) || [];
      submissions.push(submission);
      localStorage.setItem('submissions', JSON.stringify(submissions));
      alert('Submission saved locally!');
      form.reset();
    });
  }

  // Simulate user role and adjust dashboard content
  const userRole = localStorage.getItem('userRole') || 'Regular User';
  const dashboard = document.querySelector('main');
  if (dashboard && document.title.includes('Dashboard')) {
    const roleInfo = document.createElement('p');
    
    dashboard.appendChild(roleInfo);
    if (userRole === 'Reviewer') {
      dashboard.innerHTML += '<p>You have access to review submissions.</p>';
    } else if (userRole === 'Implementer') {
      dashboard.innerHTML += '<p>You can update implementation status.</p>';
    }
  }

  // Simple login simulation
  const loginForm = document.querySelector('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const role = loginForm.role.value;
      localStorage.setItem('userRole', role);
      alert('Logged in as ' + role);
      window.location.href = 'index.html';
    });
  }
});
