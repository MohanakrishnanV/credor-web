using Credor.Client.Entities;
using Credor.Web.API.Common.UnitOfWork;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public class AdminService : IAdminService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IAdminRepository _adminRepository;
        public IConfiguration _configuration { get; }
        public AdminService(IAdminRepository adminRepository,
                                IConfiguration configuration)
        {
            _unitOfWork = new UnitOfWork(configuration);
            _configuration = configuration;
            _adminRepository = adminRepository;
        }

        public int CreateUserAccount(UserAccountDto userAccount)
        {
            return _adminRepository.CreateUserAccount(userAccount);
        }

        public Task<int> UpdateUserAccount(UpdateUserAccountDto userAccountDto)
        {
            return _adminRepository.UpdateUserAccount(userAccountDto);
        }

        public int UpdatePassword(UpdatePasswordDto passwordDto)
        {
            return _adminRepository.UpdatePassword(passwordDto);
        }

        public Task<bool> AddProfileImage(DocumentModelDto documentDto)
        {
            return _adminRepository.AddProfileImage(documentDto);
        }

        public int DeleteUserAccount(int Id, int currentUserId)
        {
            return _adminRepository.DeleteUserAccount(Id, currentUserId);
        }
    }
}
