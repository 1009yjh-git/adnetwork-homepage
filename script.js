// Mobile Nav Toggle
document.getElementById('menuBtn').addEventListener('click', function(){
  const nav = document.getElementById('mobileNav');
  nav.classList.toggle('hidden');
});
// Fake submit
document.getElementById('leadForm').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('formSuccess').classList.remove('hidden');
  e.target.reset();
});
