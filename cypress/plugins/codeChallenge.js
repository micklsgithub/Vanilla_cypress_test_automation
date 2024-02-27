import getPkce from "oauth-pkce";

function codeChallenge () {
  getPkce(43, (error, { verifier, challenge}) => {
    if (!error) {
      console.log({ verifier, challenge });
      // Fetch the access token for the Microsoft Graph
     code_challenge = challenge
    }
  return code_challenge
  })
}


