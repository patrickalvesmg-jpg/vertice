import { montarHeader } from './header.js';
import { store } from './store.js';

montarHeader('perfil');

const usuario = store.getUsuario();
document.querySelector('#perfil-email').value = usuario ? usuario.email : '';
document.querySelector('#perfil-nome').value = usuario ? usuario.nome : '';

document.querySelector('#perfil-salvar').addEventListener('click', () => {
  const nome = document.querySelector('#perfil-nome').value.trim();
  store.setNome(nome);
  document.querySelector('#perfil-msg').textContent = 'Nome salvo com sucesso.';
});

document.querySelector('#perfil-sair').addEventListener('click', () => {
  store.logout();
  location.href = 'index.html';
});
