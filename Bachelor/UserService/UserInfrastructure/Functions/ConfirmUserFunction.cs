using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.Threading.Tasks;
using System.Linq;
using ApiCommon;
using Newtonsoft.Json;
using UserCore;
using UserExternal;
using System;

namespace UserInfrastructure
{
    public class ConfirmUserFunction
    {
        ILambdaLogger _logger;
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {
            _logger = context.Logger;

            var qParams = apigProxyEvent.QueryStringParameters;
            var expectedProps = new string[] { "ClientId", "Code", "Username" };
            var missingProps = expectedProps.Where(p => !qParams.ContainsKey(p));
            if (missingProps.Any())
            {
                return new APIGatewayProxyResponse
                {
                    StatusCode = 400,
                    Body = JsonConvert.SerializeObject(new
                    {
                        message = $"Missing query parameters: {string.Join(", ", missingProps)}",
                    })
                };
            }

            var clientId = qParams["ClientId"];
            var code = qParams["Code"];
            var username = qParams["Username"];
            var clientName = System.Environment.GetEnvironmentVariable("ClientName");

            var handler = new ConfirmationHandler(new CognitoEmailConfirmer(), new AmplifyRouteResolver());

            try
            {
                await handler.ConfirmEmail(clientId, code, username);
                var clientUrl = await handler.GetClientUrl(clientName);
                return ServerResponses.Redirect(clientUrl);

            }
            catch (Exception e)
            {
                return ServerResponses.ServerError(_logger, e.Message);
            }
        }
    }
}
