export const stateKey = 'spotify_auth_state';

type HP = {
  access_token: string;
  expires_in: string;
  state: string;
  token_type: string;
};

export function getHashParams(): HP | undefined {
  const hash = window.location.hash;
  return (hash !== ''
    ? hash
        .substring(1)
        .split('&')
        .map(x => x.split('='))
        .reduce(
          (acum, [key, value]) => ({
            ...acum,
            [key]: value
          }),
          {}
        )
    : undefined) as HP | undefined;
}

export function generateRandomString(length: number) {
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const text = new Array(length)
    .fill(() => possible.charAt(Math.floor(Math.random() * possible.length)))
    .map(f => f())
    .join('');
  return text;
}

export function login() {
  const client_id = '36857722e25648a38fe65d054100e8c9';
  const redirect_uri = 'http://localhost:3001/';
  const state = generateRandomString(16);
  localStorage.setItem(stateKey, state);
  const scope = 'user-read-email';
  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}`;

  console.log(url);

  window.location.href = url;
}
