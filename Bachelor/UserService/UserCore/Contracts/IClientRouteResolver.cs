using System.Threading.Tasks;

namespace UserCore {
    public interface IClientRouteResolver {
        Task<string> Resolve(string ClientName);
    }
}