const K = { user: 'cfc_user', fav: 'cfc_fav', alerta: 'cfc_alerta' };
const readArr = k => JSON.parse(localStorage.getItem(k) || '[]');
const writeArr = (k, a) => localStorage.setItem(k, JSON.stringify(a));
const toggle = (k, id) => {
  const a = readArr(k); const i = a.indexOf(id);
  if (i === -1) a.push(id); else a.splice(i, 1);
  writeArr(k, a); return a;
};
export const store = {
  login(email){ localStorage.setItem(K.user, JSON.stringify({ email, nome: '' })); },
  logout(){ localStorage.removeItem(K.user); },
  isLogged(){ return !!localStorage.getItem(K.user); },
  getUsuario(){
    const u = JSON.parse(localStorage.getItem(K.user) || 'null');
    return u ? { email: u.email, nome: u.nome || '' } : null;
  },
  setNome(nome){
    const u = store.getUsuario();
    if (!u) return;
    localStorage.setItem(K.user, JSON.stringify({ email: u.email, nome }));
  },
  toggleFavorito(id){ return toggle(K.fav, id); },
  getFavoritos(){ return readArr(K.fav); },
  isFavorito(id){ return readArr(K.fav).includes(id); },
  toggleAlerta(id){ return toggle(K.alerta, id); },
  getAlertas(){ return readArr(K.alerta); },
  isAlerta(id){ return readArr(K.alerta).includes(id); },
};
