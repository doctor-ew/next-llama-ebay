const eBayAuthToken = require("ebay-oauth-nodejs-client");

const ebayClientId = process.env.EBAY_API_KEY || "";
const ebayClientSecret = process.env.EBAY_CLIENT_SECRET || "";
const redirectUri = process.env.EBAY_REDIRECT_URI || ""; // You might need this for other OAuth flows

const authToken = new eBayAuthToken({
  clientId: ebayClientId,
  clientSecret: ebayClientSecret,
  redirectUri: redirectUri, // Optional unless you're doing user consent flow
});

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

export async function getOAuthToken(): Promise<string | null> {
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
    return cachedToken;
  }

  try {
    const response = await authToken.getApplicationToken("PRODUCTION"); // or 'SANDBOX'

    let tokenData;

    if (typeof response === "string") {
      // Parse the response string into a JSON object
      tokenData = JSON.parse(response);
    } else {
      tokenData = response;
    }

    cachedToken = tokenData.access_token;
    tokenExpiration = Date.now() + tokenData.expires_in * 1000 - 60000; // Set expiration time

    return cachedToken;
  } catch (error) {
    console.error(
      "Error obtaining OAuth token:",
      error,
      ebayClientId,
      ebayClientSecret,
      redirectUri,
    );
    throw new Error("Failed to obtain OAuth token");
  }
}
