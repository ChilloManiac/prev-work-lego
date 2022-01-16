using System.Threading.Tasks;

namespace UserCore
{
    public interface IApiRouteResolver
    {
        Task<string> Resolve(string apiName, string apiRegion);
    }
}