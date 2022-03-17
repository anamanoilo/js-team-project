const refs = {
   logo: document.querySelector('#logo'),
   header: document.querySelector('.header'),
   home: document.querySelector('#home'),
   library: document.querySelector('#library'),
   libraryBtn: document.querySelector('#libraryBtn'),
   search: document.querySelector('.search'),
   watchedBtn: document.querySelector('.watched__link'),
   queueBtn: document.querySelector('.queue__link'),
}
function onHome() {
   refs.header.classList.remove('library');
   refs.search.classList.remove('visually-hidden');
   refs.libraryBtn.classList.add('visually-hidden');
   refs.home.classList.add('current');
   refs.library.classList.remove('current');
   
}
function onLibrary() {
   refs.header.classList.add('library');
   refs.search.classList.add('visually-hidden');
   refs.libraryBtn.classList.remove('visually-hidden');
   refs.home.classList.remove('current');
   refs.library.classList.add('current');
}
function watchedBtn() {
   refs.watchedBtn.classList.add('is-active');
   refs.queueBtn.classList.remove('is-active');
}
function queueBtn() {
   refs.watchedBtn.classList.remove('is-active');
   refs.queueBtn.classList.add('is-active');
}

refs.watchedBtn.addEventListener('click', watchedBtn);
refs.queueBtn.addEventListener('click', queueBtn);
refs.logo.addEventListener('click', onHome);
refs.home.addEventListener('click', onHome);
refs.library.addEventListener('click', onLibrary);
