const playButton = document.getElementById('playButton');
const videoIframe = document.getElementById('backgroundVideo');

playButton.addEventListener('click', () => {
  // Change iframe src to enable autoplay with sound
  videoIframe.src = "https://www.youtube.com/embed/-ZoSJNniqg8?autoplay=1&loop=1&playlist=-ZoSJNniqg8";
  playButton.style.display = 'none'; // Hide the button after clicking
});

// Function to show the selected section
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.section-content');
  sections.forEach(section => {
    section.style.display = 'none'; // Hide the section
  });

  // Show the selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block'; // Display the section
  }
}

// Initially hide both sections
window.onload = function() {
  showSection('about-us'); // Default to showing the About Us section
};
