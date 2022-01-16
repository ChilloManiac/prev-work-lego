using Amazon.Lambda.Core;
using Newtonsoft.Json;
using UserCore;
using Amazon.APIGateway.Model;
using Amazon.APIGateway;
using System.Threading.Tasks;
using UserExternal;

namespace UserInfrastructure
{
    public class GenerateEmailConfirmationFunction
    {
        ILambdaLogger _logger;
        public async Task<CustomMessageEvent> FunctionHandler(CustomMessageEvent cognitoEvent, ILambdaContext context)
        {
            _logger = context.Logger;
            if (cognitoEvent.triggerSource == "CustomMessage_SignUp")
            {
                // Lookup api id on runtime to break circular dependency
                string apiName = System.Environment.GetEnvironmentVariable("ApiName");
                string apiRegion = System.Environment.GetEnvironmentVariable("ApiRegion");
                var codeParameter = cognitoEvent.request.codeParameter;
                var username = cognitoEvent.userName;
                var clientId = cognitoEvent.callerContext.clientId;

                ConfirmationEmailGenerator emailGen = new ConfirmationEmailGenerator(
                    new ApiGatewayRouteResolver()
                );

                cognitoEvent.response.emailSubject = emailGen.GetEmailSubject();
                cognitoEvent.response.emailMessage = await emailGen.GetEmailBody(apiName, apiRegion, codeParameter, username, clientId);
                return cognitoEvent;
            }

            return cognitoEvent;
        }
    }
}
