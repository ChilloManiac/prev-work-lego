using System.Threading.Tasks;
using Amazon.Amplify;
using Amazon.Amplify.Model;
using UserCore;
using System.Linq;

namespace UserExternal
{
    public class AmplifyRouteResolver : IClientRouteResolver
    {
        public async Task<string> Resolve(string ClientName)
        {
            using (var amplify = new AmazonAmplifyClient())
            {
                var request = new ListAppsRequest();
                var response = await amplify.ListAppsAsync(request);

                var currentApp = response.Apps.Find(a => a.Name == ClientName);
                if (currentApp == null)
                    throw new System.Exception($"App '${ClientName}' not found");
                var domainRequest = new ListDomainAssociationsRequest
                {
                    AppId = currentApp.AppId
                };
                var domainResponse = await amplify.ListDomainAssociationsAsync(domainRequest);

                // Found a custom domain
                if (domainResponse.DomainAssociations.Count > 0)
                {
                    // Using first domain
                    var domain = domainResponse.DomainAssociations.First();
                    // Using first subdomain
                    var subDomain = domainResponse.DomainAssociations[0].SubDomains[0];
                    return $"https://{subDomain.SubDomainSetting.Prefix}.{domain.DomainName}/";
                }
                else
                {
                    return $"https://main.{currentApp.DefaultDomain}/";
                }
            }
        }
    }
}