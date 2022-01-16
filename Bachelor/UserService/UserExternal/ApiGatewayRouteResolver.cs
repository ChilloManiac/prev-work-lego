using System.Threading.Tasks;
using Amazon.APIGateway;
using Amazon.APIGateway.Model;
using UserCore;

namespace UserExternal
{
    public class ApiGatewayRouteResolver : IApiRouteResolver
    {
        public async Task<string> Resolve(string apiName, string apiRegion)
        {
            using (var client = new AmazonAPIGatewayClient())
            {

                var request = new GetRestApisRequest();
                GetRestApisResponse apis = await client.GetRestApisAsync(request);
                var api = apis.Items.Find(api => api.Name == apiName);
                if (api == null)
                {
                    throw new System.Exception($"Api with name: {apiName} not found");

                }

                string apiId = api.Id;

                return $"https://{apiId}.execute-api.{apiRegion}.amazonaws.com/Prod/";
            }
        }
    }
}