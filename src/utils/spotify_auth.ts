export const stateKey = "spotify_auth_token";

type HP = {
  access_token: string;
  expires_in: string;
  state: string;
  token_type: string;
};

export function getHashParams(): HP | undefined {
  const { hash } = window.location;
  return (hash !== ""
    ? hash
        .substring(1)
        .split("&")
        .map(x => x.split("="))
        .reduce(
          (acum, [key, value]) => ({
            ...acum,
            [key]: value
          }),
          {}
        )
    : undefined) as HP | undefined;
}

const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateRandomString(length: number) {
  const text = new Array(length)
    .fill(() => possible.charAt(Math.floor(Math.random() * possible.length)))
    .map(f => f())
    .join("");
  return text;
}

export function login() {
  const client_id = "36857722e25648a38fe65d054100e8c9";
  const redirect_uri = "http://localhost:3000/";
  const state = generateRandomString(16);
  const scope = "user-read-email";
  const url =
    `https://accounts.spotify.com/authorize?` +
    `response_type=token&` +
    `client_id=${client_id}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
    `state=${state}`;
  window.location.href = url;
}
