import { gapi } from "gapi-script";

export const initGoogleDrive = () => {
    gapi.load("client:auth2", () => {
        gapi.client.init({
            clientId: "1042806940087-so9hnr6j15hv0bdt1cmmvi29g8iof7vs.apps.googleusercontent.com",  // ✅ Add Client ID here
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            scope: "https://www.googleapis.com/auth/drive.file",
        });
    });
};
