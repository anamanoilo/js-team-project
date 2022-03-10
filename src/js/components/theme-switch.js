const refs = {
   body: document.body,
   span: document.querySelector('#click'),
   checkbox: document.querySelector('#checkbox'),
   theme: document.querySelector('.theme-switch'),
}
refs.theme.addEventListener('click', onSwitch)
function onSwitch() {
   if (refs.checkbox.checked) {
      refs.body.classList.toggle('dark-theme')
      localStorage.setItem('theme', 'dark-theme');
   } else {
      localStorage.removeItem('theme','dark-theme')();
   }
}
function currentTheme() {
  if (localStorage.getItem('theme') === 'dark-theme') {
    refs.checkbox.checked = true;
    refs.body.classList.add('dark-theme');
  }
}
currentTheme();
