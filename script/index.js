// Function to show the selected section
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.section-content');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  // Show the selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
  }
}

// Show About Us section by default when the page loads
window.onload = function () {
  showSection('about-us');
};

// Optional: Logo click function
function openModal() {
  alert("Welcome to Kamyas!");
}
