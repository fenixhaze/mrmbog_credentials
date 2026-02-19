export const authConfig = {
    auth: {
        clientId: "23d1168d-113b-48c0-a4fe-6e6d743f77af",
        authority: "https://login.microsoftonline.com/d026e4c1-5892-497a-b9da-ee493c9f0364",
        // Usamos la URL completa del repo para evitar errores de mismatch
        redirectUri: "https://fenixhaze.github.io/mrmbog_credentials/", 
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: ["Files.Read", "User.Read"]
};