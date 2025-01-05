const video = document.getElementById('backgroundVideo');
const unmuteButton = document.getElementById('unmuteButton');

// Check if the video is muted due to autoplay restrictions
window.addEventListener('load', () => {
  video.muted = false; // Attempt to play with audio

  video.play().catch(() => {
    // If autoplay with sound is blocked, show the unmute button
    video.muted = true;
    unmuteButton.style.display = 'block';
  });
});

// Unmute and play the video when the button is clicked
unmuteButton.addEventListener('click', () => {
  video.muted = false;
  video.play();
  unmuteButton.style.display = 'none'; // Hide the button after unmuting
});

// Function to show the selected section
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.card');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Show the selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add('active');
  }
}
