using Credor.Client.Entities;
using Credor.Web.API.Common.UnitOfWork;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public class SettingsService : ISettingsService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly ISettingsRepository _settingsRepository;

        public IConfiguration _configuration { get; }

        public SettingsService(ISettingsRepository settingsRepository,IConfiguration configuration)
        {
            _settingsRepository = settingsRepository;
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        public List<AdminAccountDto> GetByRoleId(int RoleId)
        {
            return _settingsRepository.GetByRoleId(RoleId);
        }

        public int SaveAdminUser(AdminAccountDto adminAccountDto)
        {
            return _settingsRepository.SaveAdminUser(adminAccountDto);
        }

        public int UpdateAdminUser(AdminAccountDto adminAccountDto)
        {
            return _settingsRepository.UpdateAdminUser(adminAccountDto);
        }

        public int DeleteAdminUser(AdminAccountDto adminAccountDto)
        {
            return _settingsRepository.DeleteAdminUser(adminAccountDto);
        }

        public Task<int> UpdateAdminAccount(UpdateAdminAccountDto updateAdminAccountDto)
        {
            return _settingsRepository.UpdateAdminAccount(updateAdminAccountDto);
        }

        public int AdminUserAccountStatus(AdminAccountDto adminAccountDto)
        {
            return _settingsRepository.AdminUserAccountStatus(adminAccountDto);
        }

        public List<RoleFeatureMappingDto> GetRoleFeatureMapping(int RoleId)
        {
            return _settingsRepository.GetRoleFeatureMapping(RoleId);
        }

        public List<UserFeatureMappingDto> GetUserFeatureMapping(int userid)
        {
            return _settingsRepository.GetUserFeatureMapping(userid);
        }

        public int UpdateOwnerAccount(AdminAccountDto adminAccountDto)
        {
            return _settingsRepository.UpdateOwnerAccount(adminAccountDto);
        }

        public List<CredorEmailTemplateDto> GetEmailTemplate()
        {
            return _settingsRepository.GetEmailTemplate();
        }

        public int UpdateEmailTemplate(CredorEmailTemplateDto credorEmailTemplate)
        {
            return _settingsRepository.UpdateEmailTemplate(credorEmailTemplate);
        }

        public int ActiveInactiveEmailTemplate(CredorEmailTemplateDto credorEmailTemplate)
        {
            return _settingsRepository.ActiveInactiveEmailTemplate(credorEmailTemplate);
        }

        public List<CredorInfoDto> CredorInfo()
        {
            return _settingsRepository.CredorInfo();
        }

        public int CredorInfoUpdate(CredorInfoDto credorInfoDto)
        {
            return _settingsRepository.CredorInfoUpdate(credorInfoDto);
        }
    }
}
