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

const spotifyPOST = (url: string, headers: IHeader, body: BodyInit) =>
  fetch(`${baseUrl}${url}`, {
    headers: { ...headers },
    method: "POST",
    body,
  });

const spotifyPUT = (url: string, headers: IHeader, body: BodyInit) =>
  fetch(`${baseUrl}${url}`, {
    headers: { ...headers },
    method: "PUT",
    body,
  });

const spotifyDELETE = (url: string, headers: IHeader, body: BodyInit) =>
  fetch(`${baseUrl}${url}`, {
    headers: { ...headers },
    method: "DELETE",
    body,
  });

export { authHeaders, spotifyGET, spotifyPOST, spotifyPUT, spotifyDELETE };

