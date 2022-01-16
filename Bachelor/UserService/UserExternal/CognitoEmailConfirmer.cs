using System;
using System.Threading.Tasks;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using UserCore;

namespace UserExternal
{
    public class CognitoEmailConfirmer : IEmailConfirmer
    {
        public async Task<bool> ConfirmEmail(string clientId, string confirmationCode, string username)
        {
            using (var cognito = new AmazonCognitoIdentityProviderClient())
            {
                ConfirmSignUpRequest request = new ConfirmSignUpRequest
                {
                    ClientId = clientId,
                    ConfirmationCode = confirmationCode,
                    Username = username
                };

                try
                {
                    await cognito.ConfirmSignUpAsync(request);
                    return true;
                }
                catch (NotAuthorizedException e)
                {
                    if (e.Message == "User cannot be confirmed. Current status is CONFIRMED")
                    {
                        return true;
                    }
                    else
                    {
                        throw e;
                    }
                }
            }
        }
    }
}
