const baseUrl = "https://api.spotify.com/v1";

interface IHeader {
  Authorization: string;
  "Content-Type": string;
  Accept: string;
}

const authHeaders = (access_token: string): IHeader => {
  return {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

const spotifyGET = async (
  url: string,
  access_token: string,
) => {
  
  return await fetch(`${baseUrl}${url}`, {
    headers: { ...authHeaders(access_token) },
  });
};

const spotifyPOST = ({ url, body, access_token }: { access_token: string, url: string, body: BodyInit }) =>
  fetch(`${baseUrl}${url}`, {
    headers: { ...authHeaders(access_token) },
    method: "POST",
    body,
  });

const spotifyPUT = (url: string, headers: IHeader, body: BodyInit) =>
  fetch(`${baseUrl}${url}`, {
    headers: { ...headers },
    method: "PUT",
    body,
  });

interface ISpotifyDelete{
  access_token: string,
  body?: BodyInit,
  url: string
}
const spotifyDELETE = ({ url, body, access_token }: ISpotifyDelete ) =>{
  if(body)return fetch(`${baseUrl}${url}`, {
    headers: { ...authHeaders(access_token) },
    method: "DELETE",
    body,
  });
  else fetch(`${baseUrl}${url}`, {
    headers: { ...authHeaders(access_token) },
    method: "DELETE",
  });
}
  

export { authHeaders, spotifyGET, spotifyPOST, spotifyPUT, spotifyDELETE };

