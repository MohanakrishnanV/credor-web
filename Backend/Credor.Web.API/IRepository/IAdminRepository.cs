using Credor.Client.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public interface IAdminRepository
    {
        int CreateUserAccount(UserAccountDto userAccount);
        Task<int> UpdateUserAccount(UpdateUserAccountDto userAccountDto);
        int UpdatePassword(UpdatePasswordDto passwordDto);
        Task<bool> AddProfileImage(DocumentModelDto documentDto);
        int DeleteUserAccount(int Id, int currentUserId);
    }
}
