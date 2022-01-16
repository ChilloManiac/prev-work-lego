using System.Threading.Tasks;

namespace UserCore {
    public interface IEmailConfirmer
    {
        Task<bool> ConfirmEmail(string clientId, string confirmationCode, string username);
    }
}