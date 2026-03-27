document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('theme');
  
  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.innerHTML = `<span class="theme-icon">${theme === 'dark' ? '☀️' : '🌙'}</span> Mode ${theme === 'dark' ? 'clair' : 'sombre'}`;
    localStorage.setItem('theme', theme);
  }
  
  if (savedTheme) {
    setTheme(savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // Confirm delete functionality
  document.querySelectorAll('.confirm-delete').forEach(link => {
    link.addEventListener('click', function(e) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        e.preventDefault();
      }
    });
  });

  // Box entrance animation
  const boxes = document.querySelectorAll('.box');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  boxes.forEach(box => {
    box.style.opacity = 0;
    box.style.transform = 'translateY(20px)';
    box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(box);
  });

  // Add hover effects for action links
  document.querySelectorAll('.action-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.2s ease';
      this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});