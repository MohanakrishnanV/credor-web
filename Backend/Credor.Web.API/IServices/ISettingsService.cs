using Credor.Client.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public interface ISettingsService
    {
        List<AdminAccountDto> GetByRoleId(int RoleId);
        int SaveAdminUser(AdminAccountDto adminAccountDto);
        int UpdateAdminUser(AdminAccountDto adminAccountDto);
        int DeleteAdminUser(AdminAccountDto adminAccountDto);
        Task<int> UpdateAdminAccount(UpdateAdminAccountDto updateAdminAccountDto);
        int AdminUserAccountStatus(AdminAccountDto adminAccountDto);
        List<RoleFeatureMappingDto> GetRoleFeatureMapping(int RoleId);
        List<UserFeatureMappingDto> GetUserFeatureMapping(int userid);
        int UpdateOwnerAccount(AdminAccountDto adminAccountDto);
        List<CredorEmailTemplateDto> GetEmailTemplate();
        int UpdateEmailTemplate(CredorEmailTemplateDto credorEmailTemplate);
        int ActiveInactiveEmailTemplate(CredorEmailTemplateDto credorEmailTemplate);
        List<CredorInfoDto> CredorInfo();
        int CredorInfoUpdate(CredorInfoDto credorInfoDto);
    }
}
