using AutoMapper;
using Credor.Client.Entities;
using Credor.Data.Entities;
using Credor.Web.API.Common;
using Credor.Web.API.Common.UnitOfWork;
using Credor.Web.API.Shared;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public class SettingsRepository : ISettingsRepository
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IMapper _mapper;        
        private readonly IHubContext<NotificationHub> _hubContext;
        public IConfiguration _configuration { get; }

        public SettingsRepository(IHubContext<NotificationHub> hubContext,
                                        IMapper mapper,                                        
                                        IConfiguration configuration)
        {
            _unitOfWork = new UnitOfWork(configuration);
            _mapper = mapper;
            _configuration = configuration;
            _hubContext = hubContext;
        }

        public List<AdminAccountDto> GetByRoleId(int RoleId)
        {
            try
            {
                List<AdminAccountDto> userAccount = new List<AdminAccountDto>();
                var contextData = _unitOfWork.UserAccountRepository.Context;
                userAccount = (from user in contextData.UserAccount
                               where user.RoleId == RoleId && user.Active == true
                               select new AdminAccountDto
                               {
                                   Id = user.Id,
                                   RoleId = user.RoleId,
                                   FirstName = user.FirstName,
                                   LastName = user.LastName,                                   
                                   EmailId = user.EmailId,
                                   PhoneNumber = user.PhoneNumber, 
                                   Title = user.Title,
                                   IsTwoFactorAuthEnabled = user.IsTwoFactorAuthEnabled,
                                   Status = user.Status, 
                                   Active = user.Active,
                                   IsOwner = user.IsOwner,
                                   RoleMapping = (from ufm in contextData.UserFeatureMapping
                                                  join rfm in contextData.RoleFeatureMapping on ufm.RoleFeatureMappingId equals rfm.Id
                                                  where ufm.Active == true && ufm.UserId == user.Id
                                                  select new UserFeatureMappingDto
                                                  {
                                                      Id = ufm.Id,
                                                      RoleId = rfm.RoleId,
                                                      FeatureName = rfm.FeatureName,
                                                      Active = ufm.Active
                                                  }).ToList(),
                                   CreatedBy = user.CreatedBy,
                                   CreatedOn = user.CreatedOn,
                               }).OrderByDescending(x => x.CreatedOn).ToList();
                return userAccount;
            }
            catch(Exception e)
            {
                e.ToString();
                return null;
            }
        }        

        public int SaveAdminUser(AdminAccountDto adminAccountDto)
        {
            try
            {
                UserAccount userAccount = new UserAccount();
                using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                {
                    if (!string.IsNullOrEmpty(adminAccountDto.EmailId))
                    {
                        var isEmailIdExists = _unitOfWork.UserAccountRepository.GetWithInclude(x => x.EmailId.ToLower() == adminAccountDto.EmailId.ToLower() && x.Active == true && x.Status == 1).FirstOrDefault();
                        if (isEmailIdExists != null)
                        {
                            return 3;//  Already an active/approved account exists with this EmailId
                        }
                    }
                    userAccount.FirstName = adminAccountDto.FirstName;
                    userAccount.LastName = adminAccountDto.LastName;
                    userAccount.EmailId = adminAccountDto.EmailId;
                    userAccount.PhoneNumber = adminAccountDto.PhoneNumber;
                    userAccount.Title = adminAccountDto.Title;
                    userAccount.RoleId = 3; //admin
                    userAccount.Status = 1;
                    userAccount.Active = true;
                    byte[] salt = Helper.GenerateSalt();
                    userAccount.PasswordSalt = salt;
                    userAccount.Password = Convert.ToBase64String(Helper.HashPasswordWithSalt(Encoding.UTF8.GetBytes(adminAccountDto.Password), salt));
                    userAccount.CreatedOn = DateTime.Now;
                    userAccount.CreatedBy = adminAccountDto.UserId.ToString();
                    _unitOfWork.UserAccountRepository.Insert(userAccount);
                    _unitOfWork.Save();                    
                    transaction.Commit();
                    
                }
                using (var transaction = _unitOfWork.UserFeatureMappingRepository.Context.Database.BeginTransaction())
                {
                    List<UserFeatureMapping> userFeatureMappingList = new List<UserFeatureMapping>();
                    if (adminAccountDto.RoleMapping.Count > 0)
                    {
                        foreach (UserFeatureMappingDto userFeature in adminAccountDto.RoleMapping)
                        {
                            UserFeatureMapping userFeatureMapping = new UserFeatureMapping();
                            userFeatureMapping.UserId = userAccount.Id;
                            userFeatureMapping.RoleFeatureMappingId = userFeature.Id;
                            userFeatureMapping.Active = userFeature.Active;
                            userFeatureMapping.CreatedOn = DateTime.Now;
                            userFeatureMapping.CreatedBy = adminAccountDto.UserId.ToString();
                            userFeatureMappingList.Add(userFeatureMapping);
                        }
                        _unitOfWork.UserFeatureMappingRepository.InsertList(userFeatureMappingList);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }

                }
                return 1;

            }
            catch(Exception e)
            {
                e.ToString();
                return 0;
            }
        }

        public int UpdateAdminUser(AdminAccountDto adminAccountDto)
        {
            try
            {
                var contextData = _unitOfWork.UserAccountRepository.Context;
                var adminUserList = _unitOfWork.UserAccountRepository.GetByID(adminAccountDto.Id);
                if(adminUserList != null)
                {
                    using(var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                        adminUserList.FirstName = adminAccountDto.FirstName;
                        adminUserList.LastName = adminAccountDto.LastName;
                        adminUserList.EmailId = adminAccountDto.EmailId;
                        adminUserList.PhoneNumber = adminAccountDto.PhoneNumber;
                        adminUserList.Title = adminAccountDto.Title;
                        adminUserList.ModifiedOn = DateTime.Now;
                        adminUserList.ModifiedBy = adminAccountDto.UserId.ToString();
                        _unitOfWork.UserAccountRepository.Update(adminUserList);
                        contextData.SaveChanges();
                        transaction.Commit();
                    }
                }
                using (var transaction = _unitOfWork.UserFeatureMappingRepository.Context.Database.BeginTransaction())
                {
                    List<UserFeatureMapping> userFeatureMappingList = new List<UserFeatureMapping>();
                    if (adminAccountDto.RoleMapping.Count > 0)
                    {
                        foreach (UserFeatureMappingDto userFeature in adminAccountDto.RoleMapping)
                        {
                            var userFeaturedata = _unitOfWork.UserFeatureMappingRepository.GetByID(userFeature.Id);
                            if(userFeaturedata != null)
                            {
                                UserFeatureMapping userFeatureMapping = userFeaturedata;
                                userFeatureMapping.Active = userFeature.Active;
                                userFeatureMapping.ModifiedOn = DateTime.Now;
                                userFeatureMapping.ModifiedBy = adminAccountDto.UserId.ToString();
                                userFeatureMappingList.Add(userFeatureMapping);
                            }
                        }
                        _unitOfWork.UserFeatureMappingRepository.UpdateList(userFeatureMappingList);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }

                }
                return 1;
            }
            catch(Exception e)
            {
                e.ToString();
                return 0;
            }
        }

        public int DeleteAdminUser(AdminAccountDto adminAccountDto)
        {
            try
            {
                var contextData = _unitOfWork.UserAccountRepository.Context;
                var adminUserList = _unitOfWork.UserAccountRepository.GetByID(adminAccountDto.Id);
                if (adminUserList != null)
                {
                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                        adminUserList.Active = false;                                              
                        adminUserList.ModifiedOn = DateTime.Now;
                        adminUserList.ModifiedBy = adminAccountDto.UserId.ToString();
                        _unitOfWork.UserAccountRepository.Update(adminUserList);
                        contextData.SaveChanges();
                        transaction.Commit();
                    }
                }
                return 1;
            }
            catch(Exception e)
            {
                e.ToString();
                return 0;
            }
        }

        public async Task<int> UpdateAdminAccount(UpdateAdminAccountDto updateAdminAccountDto)
        {
            try
            {
                var userAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == updateAdminAccountDto.Id);
                if (userAccount.Id != 0)
                {
                    try
                    {
                        string blobFilePath = userAccount.ProfileImageUrl;
                        if (userAccount.ProfileImageUrl != updateAdminAccountDto.ProfileImageUrl)
                        {
                            Helper _helper = new Helper(_configuration);
                            if (updateAdminAccountDto.profileImage != null)
                            {
                                blobFilePath = await _helper.DocumentSaveAndUpload(updateAdminAccountDto.profileImage, updateAdminAccountDto.Id, 7);
                            }
                        }

                        using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                        {
                            UserAccount userAccountData = userAccount;
                            userAccountData.FirstName = updateAdminAccountDto.FirstName;
                            userAccountData.LastName = updateAdminAccountDto.LastName;                            
                            userAccountData.PhoneNumber = updateAdminAccountDto.PhoneNumber;
                            userAccountData.EmailId = updateAdminAccountDto.EmailId;
                            userAccountData.IsEmailVerified = updateAdminAccountDto.IsEmailVerified;
                            userAccountData.PhoneNumber = updateAdminAccountDto.PhoneNumber;
                            userAccountData.IsPhoneVerified = updateAdminAccountDto.IsPhoneVerified;                                                        
                            userAccountData.DateOfBirth = updateAdminAccountDto.DateOfBirth;
                            userAccountData.IsTwoFactorAuthEnabled = updateAdminAccountDto.IsTwoFactorAuthEnabled;                            
                            userAccountData.ProfileImageUrl = blobFilePath;
                            userAccountData.ModifiedBy = updateAdminAccountDto.Id.ToString();                            
                            _unitOfWork.UserAccountRepository.Update(userAccountData);
                            _unitOfWork.Save();
                            transaction.Commit();
                        }
                        return 1; //Success
                    }

                    catch (Exception e)
                    {
                        var ex = e.ToString();
                        return 0;//Failure
                    }
                    finally
                    {
                        _unitOfWork.Dispose();
                    }
                }
                return 1;
            }
            catch(Exception e)
            {
                e.ToString();
                return 0;
            }
        }

        public int AdminUserAccountStatus(AdminAccountDto adminAccountDto)
        {
            try
            {
                var contextData = _unitOfWork.UserAccountRepository.Context;
                var adminUserList = _unitOfWork.UserAccountRepository.GetByID(adminAccountDto.Id);
                if (adminUserList != null)
                {
                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                        adminUserList.Status = adminAccountDto.Status;
                        adminUserList.ModifiedOn = DateTime.Now;
                        adminUserList.ModifiedBy = adminAccountDto.UserId.ToString();
                        _unitOfWork.UserAccountRepository.Update(adminUserList);
                        contextData.SaveChanges();
                        transaction.Commit();
                    }
                }
                return 1;
            }
            catch(Exception e)
            {
                e.ToString();
                return 0;
            }
        }

        public List<RoleFeatureMappingDto> GetRoleFeatureMapping(int RoleId)
        {
            try
            {
                List<RoleFeatureMappingDto> roleFeatureMappingDto = new List<RoleFeatureMappingDto>();
                var contextData = _unitOfWork.RoleFeatureMappingRepository.Context;
                roleFeatureMappingDto = (from rfm in contextData.RoleFeatureMapping                                         
                                         where rfm.RoleId == RoleId && rfm.Active == true                                         
                                         select new RoleFeatureMappingDto
                                         {
                                             Id = rfm.Id,
                                             RoleId = rfm.RoleId,
                                             FeatureName = rfm.FeatureName,                                             
                                         }).ToList();
                return roleFeatureMappingDto;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
        }

        public List<UserFeatureMappingDto> GetUserFeatureMapping(int userid)
        {
            try
            {
                List<UserFeatureMappingDto> userFeatureMappingDto = new List<UserFeatureMappingDto>();
                var contextData = _unitOfWork.UserFeatureMappingRepository.Context;
                userFeatureMappingDto = (from ufm in contextData.UserFeatureMapping
                                         join rfm in contextData.RoleFeatureMapping on ufm.RoleFeatureMappingId equals rfm.Id
                                         where ufm.UserId == userid
                                         select new UserFeatureMappingDto
                                         {
                                             Id = ufm.Id,
                                             RoleId = rfm.RoleId,
                                             FeatureName = rfm.FeatureName,
                                             Active = ufm.Active
                                         }).ToList();
                return userFeatureMappingDto;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        public int UpdateOwnerAccount(AdminAccountDto adminAccountDto)
        {
            try
            {
                var contextData = _unitOfWork.UserAccountRepository.Context;
                var adminUserList = _unitOfWork.UserAccountRepository.GetByID(adminAccountDto.Id);
                if (adminUserList != null)
                {
                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                        adminUserList.IsOwner = adminAccountDto.IsOwner;
                        adminUserList.ModifiedOn = DateTime.Now;
                        adminUserList.ModifiedBy = adminAccountDto.UserId.ToString();
                        _unitOfWork.UserAccountRepository.Update(adminUserList);
                        contextData.SaveChanges();
                        transaction.Commit();
                    }
                }
                return 1;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return 0;
            }
        }

        public List<CredorEmailTemplateDto> GetEmailTemplate()
        {
            try
            {
                List<CredorEmailTemplateDto> credorEmailTemplateDto = new List<CredorEmailTemplateDto>();
                var contextData = _unitOfWork.CredorEmailTemplateRepository.Context;
                credorEmailTemplateDto = (from CET in contextData.CredorEmailTemplate
                                          where CET.Active == true && CET.EmailTypeId == 3 || CET.EmailTypeId == 4
                                          select new CredorEmailTemplateDto
                                          {
                                              Id = CET.Id,
                                              Subject = CET.Subject,
                                              BodyContent = CET.BodyContent,
                                              Status = CET.Status,
                                              IsEnabled = CET.IsEnabled,
                                              TemplateName = CET.TemplateName,
                                              EmailTypeId = CET.EmailTypeId,
                                              Active = CET.Active
                                          }).ToList();
                return credorEmailTemplateDto;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        public int UpdateEmailTemplate(CredorEmailTemplateDto credorEmailTemplate)
        {
            try
            {
                var contextData = _unitOfWork.CredorEmailTemplateRepository.Context;
                var email = _unitOfWork.CredorEmailTemplateRepository.GetByID(credorEmailTemplate.Id);
                if(email != null)
                {
                    using(var transaction = _unitOfWork.CredorEmailTemplateRepository.Context.Database.BeginTransaction())
                    {
                        email.Subject = credorEmailTemplate.Subject;
                        email.BodyContent = credorEmailTemplate.BodyContent;
                        email.ModifiedOn = DateTime.Now;
                        email.ModifiedBy = credorEmailTemplate.UserId.ToString();
                        _unitOfWork.CredorEmailTemplateRepository.Update(email);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                }

                return 1;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return 0;
            }
        }

        public int ActiveInactiveEmailTemplate(CredorEmailTemplateDto credorEmailTemplate)
        {
            try
            {
                var contextData = _unitOfWork.CredorEmailTemplateRepository.Context;
                var email = _unitOfWork.CredorEmailTemplateRepository.GetByID(credorEmailTemplate.Id);
                if(email != null)
                {
                    using(var transaction = _unitOfWork.CredorEmailTemplateRepository.Context.Database.BeginTransaction())
                    {
                        email.IsEnabled = credorEmailTemplate.IsEnabled;
                        email.ModifiedOn = DateTime.Now;
                        email.ModifiedBy = credorEmailTemplate.UserId.ToString();
                        _unitOfWork.CredorEmailTemplateRepository.Update(email);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                }
                return 1;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return 0;
            }
        }

        public List<CredorInfoDto> CredorInfo()
        {
            try
            {
                List<CredorInfoDto> credorInfoDto = new List<CredorInfoDto>();
                var contextData = _unitOfWork.CredorInfoRepository.Context;
                credorInfoDto = (from cir in contextData.CredorInfo
                                 where cir.Active == true
                                 select new CredorInfoDto
                                 {
                                    Id = cir.Id,
                                    CredorInfoTypeId = cir.CredorInfoTypeId,
                                    TemplateName = cir.TemplateName,
                                    BodyContent = cir.BodyContent,
                                    Active = cir.Active
                                 }).ToList();
                return credorInfoDto;

            }
            catch(Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        public int CredorInfoUpdate(CredorInfoDto credorInfoDto)
        {
            try
            {
                var contextData = _unitOfWork.CredorInfoRepository.Context;
                var credorInfo = _unitOfWork.CredorInfoRepository.GetByID(credorInfoDto.Id);
                if(credorInfo != null)
                {
                    using(var transaction = _unitOfWork.CredorInfoRepository.Context.Database.BeginTransaction())
                    {
                        credorInfo.BodyContent = credorInfoDto.BodyContent;
                        credorInfo.ModifiedBy = credorInfoDto.UserId.ToString();
                        credorInfo.ModifiedOn = DateTime.Now;
                        _unitOfWork.CredorInfoRepository.Update(credorInfo);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                }
                return 1;

            }
            catch(Exception ex)
            {
                ex.ToString();
                return 0;
            }
        }
    }
}
