import { Session } from "@inrupt/solid-client-authn-browser";

const SOLID_IDENTITY_PROVIDER = 'https://solidcommunity.net/';

export async function login(session: Session): Promise<void> {
  if (!session.info.isLoggedIn) {
    try {
      await session.login({
        oidcIssuer: SOLID_IDENTITY_PROVIDER,
        clientName: "GrainPath App",
        redirectUrl: window.location.href
      });
    } catch(ex) { alert('[Login failure] ' + ex); }
  }
}

export async function handleRedirectAfterLogin(session: Session): Promise<boolean> {
  await session.handleIncomingRedirect(window.location.href);
  return session.info.isLoggedIn;
}
