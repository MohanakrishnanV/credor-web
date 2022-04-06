using AutoMapper;
using Credor.Client.Entities;
using Credor.Data.Entities;
using Credor.Web.API.Common.UnitOfWork;
using Credor.Web.API.Shared;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Credor.Web.API.Repository
{
    public class AdminRepository: IAdminRepository
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public AdminRepository(IConfiguration configuration, IMapper mapper)
        {
            _unitOfWork = new UnitOfWork(configuration);
            _configuration = configuration;
            _mapper = mapper;
        }
        public int CreateUserAccount(UserAccountDto userAccount)
        {
            try
            {
                using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                {
                    if (!string.IsNullOrEmpty(userAccount.EmailId))
                    {
                        var isEmailIdExists = _unitOfWork.UserAccountRepository.GetWithInclude(x => x.EmailId.ToLower() == userAccount.EmailId.ToLower() && x.Active == true && x.Status == 1).FirstOrDefault();
                        if (isEmailIdExists != null)
                        {
                            return 3;//  Already an active/approved account exists with this EmailId
                        }
                    }
                    byte[] salt = Helper.GenerateSalt();
                    userAccount.PasswordSalt = salt;
                    userAccount.Password = Convert.ToBase64String(Helper.HashPasswordWithSalt(Encoding.UTF8.GetBytes(userAccount.Password), salt));
                    userAccount.CreatedOn = DateTime.Now;

                    UserAccount account = _mapper.Map<UserAccount>(userAccount);
                    account.RoleId = 3; //Admin
                    account.Active = true;
                    _unitOfWork.UserAccountRepository.Insert(account);
                    _unitOfWork.Save();
                    transaction.Commit();
                    var userId = account.Id;

                    return 1; //Success
                }
            }

            catch (Exception e)
            {
                e.ToString();
                return 0;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
        public async Task<int> UpdateUserAccount(UpdateUserAccountDto userAccountDto)
        {
            var userAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == userAccountDto.Id);
            if (userAccount.Id != 0)
            {
                try
                {
                    string blobFilePath = userAccount.ProfileImageUrl;
                    if (userAccount.ProfileImageUrl != userAccountDto.ProfileImageUrl)
                    {
                        Helper _helper = new Helper(_configuration);
                        blobFilePath = await _helper.DocumentSaveAndUpload(userAccountDto.profileImage, userAccountDto.Id, 7);
                    }

                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                        UserAccount userAccountData = userAccount;
                        userAccountData.FirstName = userAccountDto.FirstName;
                        userAccountData.LastName = userAccountDto.LastName;
                        userAccountData.NickName = userAccountDto.NickName;
                        userAccountData.PhoneNumber = userAccountDto.PhoneNumber;
                        userAccountData.EmailId = userAccountDto.EmailId;
                        userAccountData.IsEmailVerified = userAccountDto.IsEmailVerified;
                        userAccountData.PhoneNumber = userAccountDto.PhoneNumber;
                        userAccountData.IsPhoneVerified = userAccountDto.IsPhoneVerified;
                        userAccountData.IsAccreditedInvestor = userAccountDto.IsAccreditedInvestor;
                        userAccountData.Capacity = userAccountDto.Capacity;
                        userAccountData.HeardFrom = userAccountDto.HeardFrom;
                        userAccountData.SecondaryEmail = userAccountDto.SecondaryEmail;
                        userAccountData.ReceiveEmailNotifications = userAccountDto.ReceiveEmailNotifications;
                        userAccountData.DateOfBirth = userAccountDto.DateOfBirth;
                        userAccountData.IsTwoFactorAuthEnabled = userAccountDto.IsTwoFactorAuthEnabled;
                        userAccountData.CompanyNewsLetterUpdates = userAccountDto.CompanyNewsLetterUpdates;
                        userAccountData.NewInvestmentAnnouncements = userAccountDto.NewInvestmentAnnouncements;
                        userAccountData.ProfileImageUrl = blobFilePath;
                        userAccountData.ModifiedBy = userAccountDto.Id.ToString();
                        if (userAccountDto.IsNewUser)
                        {
                            //Changing Role from NewUser 4 to Investor 1 on Registration completion
                            userAccountData.RoleId = 1;//Investor 
                        }
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
            else
                return 0;//Failure
        }
        public int UpdatePassword(UpdatePasswordDto passwordDto)
        {
            try
            {
                var user = _unitOfWork.UserAccountRepository.GetNoTrackWithInclude(x => x.Id == passwordDto.UserId).FirstOrDefault();
                if (user != null)
                {
                    byte[] existingSalt = user.PasswordSalt;
                    string existingHashedPassword = user.Password;
                    var hashedNewPassword = Convert.ToBase64String(Helper.HashPasswordWithSalt(Encoding.UTF8.GetBytes(passwordDto.NewPassword), existingSalt));
                    var hashedOldPassword = Convert.ToBase64String(Helper.HashPasswordWithSalt(Encoding.UTF8.GetBytes(passwordDto.OldPassword), existingSalt));
                    if (hashedNewPassword == user.Password)
                    {
                        return 1;// New Password should not same as Current Password
                    }
                    if (hashedOldPassword == existingHashedPassword)
                    {
                        if (hashedNewPassword != user.OldPassword)
                        {
                            using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                            {
                                byte[] salt = Helper.GenerateSalt();
                                user.PasswordSalt = salt;
                                var newPasswordHash = Helper.HashPasswordWithSalt(Encoding.UTF8.GetBytes(passwordDto.NewPassword), salt);
                                user.Password = Convert.ToBase64String(newPasswordHash);
                                user.PasswordChangedOn = DateTime.Now;
                                user.OldPassword = existingHashedPassword;
                                user.LastLogin = DateTime.Now;
                                // updates user password and salt
                                _unitOfWork.UserAccountRepository.UpdateProperty(
                                    user
                                    , new List<string>
                                        {
                                    "Password",
                                    "PasswordSalt",
                                    "PasswordChangedOn",
                                    "OldPassword"
                                        });
                                _unitOfWork.Save();
                                transaction.Commit();
                                return 0;// Sucesss
                            }
                        }
                        else
                            return 3; // New password should not be same as previously changed password
                    }
                    else
                    {
                        return 2;//Existing Password and Confirmation Password does not match
                    }
                }
            }
            catch (Exception e)
            {
                e.ToString();
            }
            finally
            {
                _unitOfWork.Dispose();
            }
            return 0;//Success
        }
        public async Task<bool> AddProfileImage(DocumentModelDto documentDto)
        {
            var userAccount = _unitOfWork.UserAccountRepository.GetNoTrackWithInclude(x => x.Id == documentDto.UserId).FirstOrDefault();
            if (userAccount != null)
            {
                var contextData = _unitOfWork.UserAccountRepository.Context;
                try
                {
                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                        if (documentDto.Files != null)
                        {
                            Helper _helper = new Helper(_configuration);
                            var blobFilePath = (await _helper.DocumentSaveAndUpload(documentDto.Files.First(), documentDto.UserId, documentDto.Type)).ToString();

                            UserAccount userAccountData = userAccount;
                            userAccountData.ProfileImageUrl = blobFilePath;
                            userAccountData.ModifiedBy = documentDto.UserId.ToString();
                            contextData.Update(userAccountData);
                            contextData.SaveChanges();
                            transaction.Commit();
                        }
                    }
                }
                catch (Exception e)
                {
                    e.ToString();
                    return false;//Failure 
                }
                finally
                {
                    contextData = null;
                }
                return true;
            }
            return false;
        }
        public int DeleteUserAccount(int Id, int currentUserId)
        {
            var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == currentUserId);
            if (adminAccount != null && adminAccount.RoleId == 3 && adminAccount.Active == true) //Admin user                
            {
                try
                {
                    var userAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == Id);
                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                        UserAccount userAccountData = userAccount;
                        userAccountData.Active = false;
                        userAccountData.ModifiedBy = currentUserId.ToString();
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
            else
                return 0;//Failure;
        }

    }
}
