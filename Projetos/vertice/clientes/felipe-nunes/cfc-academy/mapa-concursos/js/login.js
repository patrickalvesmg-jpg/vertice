import { store } from './store.js';
if (store.isLogged()) location.href = 'app.html';
document.querySelector('#form-login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value.trim();
  if (!email) return;
  store.login(email);
  location.href = 'app.html';
});

// Toggle de texto entre "Entrar" e "Criar conta" (mesmo formulário, só muda o rótulo)
let modoCadastro = false;
const btnToggle = document.querySelector('#toggle-cadastro');
const titulo = document.querySelector('#auth-titulo');
const subtitulo = document.querySelector('#auth-sub');
const botaoSubmit = document.querySelector('#form-login button[type="submit"]');
const textoToggle = document.querySelector('.auth-toggle');

if (btnToggle) {
  btnToggle.addEventListener('click', () => {
    modoCadastro = !modoCadastro;
    if (modoCadastro) {
      titulo.textContent = 'Criar conta';
      subtitulo.textContent = 'Cadastre-se para acompanhar os concursos.';
      botaoSubmit.textContent = 'Criar conta';
      btnToggle.textContent = 'Entrar';
      textoToggle.firstChild.textContent = 'Já tem conta? ';
    } else {
      titulo.textContent = 'Entrar';
      subtitulo.textContent = 'Acesse sua conta para ver os concursos.';
      botaoSubmit.textContent = 'Entrar';
      btnToggle.textContent = 'Criar conta';
      textoToggle.firstChild.textContent = 'Ainda não tem conta? ';
    }
  });
}
