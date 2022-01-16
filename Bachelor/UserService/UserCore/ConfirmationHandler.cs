using System;
using System.Threading.Tasks;

namespace UserCore
{
    public class ConfirmationHandler
    {

        private readonly IEmailConfirmer _emailConfirmer;
        private readonly IClientRouteResolver _clientRouteResolver;

        public ConfirmationHandler(IEmailConfirmer emailConfirmer, IClientRouteResolver clientRouteResolver)
        {
            _emailConfirmer = emailConfirmer;
            _clientRouteResolver = clientRouteResolver;
        }


        public async Task ConfirmEmail(string clientId, string confirmationCode, string username)
        {
            try
            {
                await _emailConfirmer.ConfirmEmail(clientId, confirmationCode, username);
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public async Task<string> GetClientUrl(string clientName)
        {
            try
            {
                var clientRootUrl = await _clientRouteResolver.Resolve(clientName);
                return $"{clientRootUrl}login";
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}