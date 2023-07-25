const baseUrl = "https://api.spotify.com/v1";

interface IHeader {
  Authorization: string;
  "Content-Type": string;
  Accept: string;
}
interface ISpotifyBody {
  access_token: string,
  body?: BodyInit,
  url: string
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

const spotifyPOST = ({ url, body, access_token }: ISpotifyBody) => {
  if (body) return fetch(`${baseUrl}${url}`, {
    headers: { ...authHeaders(access_token) },
    method: "POST",
    body,
  });
  else return fetch(`${baseUrl}${url}`, {
    headers: { ...authHeaders(access_token) },
    method: "POST",
  });
}
  

const spotifyPUT = ({ url, body, access_token }: ISpotifyBody) =>{
  if (body) return fetch(`${baseUrl}${url}`, {
    headers: { ...authHeaders(access_token) },
    method: "PUT",
    body,
  });
  else fetch(`${baseUrl}${url}`, {
    headers: { ...authHeaders(access_token) },
    method: "PUT",
  });
}

const spotifyDELETE = ({ url, body, access_token }: ISpotifyBody ) =>{
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

