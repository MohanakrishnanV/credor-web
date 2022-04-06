using Credor.Client.Entities;
using Credor.Data.Entities;
using Credor.Web.API.Common;
using Credor.Web.API.Common.UnitOfWork;
using Credor.Web.API.Shared;
using iText.Html2pdf;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public class InvestorRepository : IInvestorRepository
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly INotificationRepository _notificationRepository;
        private readonly IDocumentRepository _documentRepository;
        private readonly IHubContext<NotificationHub> _hubContext;
        public IConfiguration _configuration { get; }
        public InvestorRepository(IConfiguration configuration,
                                  INotificationRepository notificationRepository,    
                                  IDocumentRepository documentRepository,
                                  IHubContext<NotificationHub> hubContext)
        {
            _unitOfWork = new UnitOfWork(configuration);
            _configuration = configuration;
            _notificationRepository = notificationRepository;
            _documentRepository = documentRepository;
            _hubContext = hubContext;
        }

        public UserAccountDto GetUserAccount(int leadId)
        {
            UserAccountDto userAccount = new UserAccountDto();
            var contextData = _unitOfWork.UserAccountRepository.Context;
            try
            {
                userAccount = (from user in contextData.UserAccount
                               where user.Id == leadId
                               && user.RoleId == 1 //Investor
                               && user.Active == true
                               select new UserAccountDto
                               {
                                   Id = user.Id,
                                   FirstName = user.FirstName,
                                   LastName = user.LastName,
                                   FullName = user.FirstName + " " + user.LastName,
                                   NickName = user.NickName,
                                   EmailId = user.EmailId,
                                   SecondaryEmail = user.SecondaryEmail,
                                   ReceiveEmailNotifications = user.ReceiveEmailNotifications,
                                   DateOfBirth = user.DateOfBirth,
                                   ProfileImageUrl = user.ProfileImageUrl,
                                   Capacity = user.Capacity,
                                   HeardFrom = user.HeardFrom,
                                   PhoneNumber = user.PhoneNumber,
                                   Status = user.Status,
                                   Residency = user.Residency,
                                   Country = user.Country,
                                   IsAccreditedInvestor = user.IsAccreditedInvestor,
                                   IsEmailVerified = user.IsEmailVerified,
                                   IsPhoneVerified = user.IsPhoneVerified,
                                   IsTOCApproved = user.IsTOCApproved,
                                   IsTwoFactorAuthEnabled = user.IsTwoFactorAuthEnabled,
                                   CreatedBy = user.CreatedBy,
                                   CreatedOn = user.CreatedOn,
                                   LastLogin = user.LastLogin,
                                   PasswordChangedOn = user.PasswordChangedOn,
                                   VerifyAccount = user.VerifyAccount,                                  
                                   CompanyNewsLetterUpdates = user.CompanyNewsLetterUpdates,
                                   NewInvestmentAnnouncements = user.NewInvestmentAnnouncements,
                                   Notes = (from notes in contextData.UserNotes
                                            where notes.UserId == leadId
                                            && notes.Active == true
                                            select new UserNotesDto
                                            {
                                                Id = notes.Id,
                                                UserId = notes.UserId,
                                                Notes = notes.Notes,
                                                CreatedBy = notes.CreatedBy,
                                                CreatedOn = notes.CreatedOn,
                                                ModifiedBy = notes.ModifiedBy,
                                                ModifiedOn = notes.ModifiedOn
                                            }).FirstOrDefault()
                               }).FirstOrDefault();
            }
            catch
            {
                userAccount = null;
            }
            finally
            {
                contextData = null;
            }
            return userAccount;
        }
        public List<UserAccountDto> GetAllInvestorAccounts()
        {
            List<UserAccountDto> userAccounts = new List<UserAccountDto>();
            var contextData = _unitOfWork.UserAccountRepository.Context;
            try
            {
                userAccounts = (from user in contextData.UserAccount
                                where user.RoleId == 1 //Investor
                                && user.Active == true
                                select new UserAccountDto
                                {
                                    Id = user.Id,
                                    FirstName = user.FirstName,
                                    LastName = user.LastName,
                                    NickName = user.NickName,
                                    FullName = user.FirstName + " " + user.LastName,
                                    EmailId = user.EmailId,
                                    SecondaryEmail = user.SecondaryEmail,
                                    ReceiveEmailNotifications = user.ReceiveEmailNotifications,
                                    DateOfBirth = user.DateOfBirth,
                                    ProfileImageUrl = user.ProfileImageUrl,
                                    Capacity = user.Capacity,
                                    HeardFrom = user.HeardFrom,
                                    PhoneNumber = user.PhoneNumber,
                                    Status = user.Status,
                                    Residency = user.Residency,
                                    Country = user.Country,
                                    IsAccreditedInvestor = user.IsAccreditedInvestor,
                                    IsEmailVerified = user.IsEmailVerified,
                                    IsPhoneVerified = user.IsPhoneVerified,
                                    IsTOCApproved = user.IsTOCApproved,
                                    IsTwoFactorAuthEnabled = user.IsTwoFactorAuthEnabled,
                                    CreatedBy = user.CreatedBy,
                                    CreatedOn = user.CreatedOn,
                                    PasswordChangedOn = user.PasswordChangedOn,
                                    VerifyAccount = user.VerifyAccount,
                                    CompanyNewsLetterUpdates = user.CompanyNewsLetterUpdates,
                                    NewInvestmentAnnouncements = user.NewInvestmentAnnouncements,
                                    LastLogin = user.LastLogin,
                                    TotalInvestments = (from investment in contextData.Investment
                                                        where investment.UserId == user.Id
                                                            && investment.Active == true
                                                            && investment.Status == 1
                                                        select investment.Id).Count(),
                                    TotalAmount = (from investment in contextData.Investment
                                                   where investment.UserId == user.Id
                                                       && investment.Active == true
                                                       && investment.Status == 1
                                                   select investment.Amount).Sum(),
                                    //Tags = (from tagDetail in contextData.TagDetail
                                    //        join tag in contextData.Tag on tagDetail.UserId equals user.Id
                                    //        where tagDetail.Active == true
                                    //        && tag.Active == true
                                    //        select new TagDto
                                    //        {
                                    //            Id = tag.Id,
                                    //            Name = tag.Name
                                    //        }).ToList()
                                }).ToList();
            }
            catch
            {
                userAccounts = null;
            }
            finally
            {
                contextData = null;
            }
            return userAccounts;
        }
        public int UpdateInvestorAccount(UserAccountDto userAccountDto)
        {
            var userAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == userAccountDto.Id);
            if (userAccount != null)
            {
                try
                {
                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                        UserAccount userAccountData = userAccount;
                        userAccountData.FirstName = userAccountDto.FirstName;
                        userAccountData.LastName = userAccountDto.LastName;
                        userAccountData.NickName = userAccountDto.NickName;
                        userAccountData.PhoneNumber = userAccountDto.PhoneNumber;
                        userAccountData.EmailId = userAccountDto.EmailId;
                        userAccountData.IsEmailVerified = userAccountDto.IsEmailVerified;
                        userAccountData.Residency = userAccountDto.Residency;
                        userAccountData.PhoneNumber = userAccountDto.PhoneNumber;
                        userAccountData.IsPhoneVerified = userAccountDto.IsPhoneVerified;
                        userAccountData.IsAccreditedInvestor = userAccountDto.IsAccreditedInvestor;
                        userAccountData.Capacity = userAccountDto.Capacity;
                        userAccountData.HeardFrom = userAccountDto.HeardFrom;
                        userAccountData.SecondaryEmail = userAccountDto.SecondaryEmail;
                        userAccountData.ReceiveEmailNotifications = userAccountDto.ReceiveEmailNotifications;
                        userAccountData.DateOfBirth = userAccountDto.DateOfBirth;
                        userAccountData.IsTwoFactorAuthEnabled = userAccountDto.IsTwoFactorAuthEnabled;
                        userAccountData.VerifyAccount = userAccountDto.VerifyAccount;
                        userAccountData.CompanyNewsLetterUpdates = userAccountDto.CompanyNewsLetterUpdates;
                        userAccountData.NewInvestmentAnnouncements = userAccountDto.NewInvestmentAnnouncements;
                        userAccountData.ModifiedBy = userAccountDto.AdminUserId.ToString();
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
        public bool AddInvestorNotes(UserNotesDto notesDto)
        {
            var leadAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == notesDto.UserId);
            var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == notesDto.AdminUserId);
            if (leadAccount != null && adminAccount != null)
            {
                try
                {
                    using (var transaction = _unitOfWork.UserNotesRepository.Context.Database.BeginTransaction())
                    {
                        UserNotes userNotesData = new UserNotes();
                        userNotesData.UserId = notesDto.UserId;
                        userNotesData.Notes = notesDto.Notes;
                        userNotesData.CreatedBy = adminAccount.FirstName + " " + adminAccount.LastName;
                        userNotesData.CreatedOn = DateTime.Now;
                        userNotesData.Active = true;
                        _unitOfWork.UserNotesRepository.Insert(userNotesData);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return true; //Success
                }
                catch (Exception e)
                {
                    var ex = e.ToString();
                    return false;//Failure
                }
                finally
                {
                    _unitOfWork.Dispose();
                }
            }
            else
                return false;//Failure;           
        }
        public bool UpdateInvestorNotes(UserNotesDto notesDto)
        {
            var leadAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == notesDto.UserId);
            var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == notesDto.AdminUserId);
            if (leadAccount != null && adminAccount != null)
            {
                try
                {
                    var userNotes = _unitOfWork.UserNotesRepository.Get(x => x.Id == notesDto.Id);
                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                        UserNotes userNotesData = userNotes;
                        userNotesData.Notes = notesDto.Notes;
                        userNotesData.ModifiedBy = adminAccount.FirstName + " " + adminAccount.LastName;
                        _unitOfWork.UserNotesRepository.Update(userNotesData);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return true; //Success
                }
                catch (Exception e)
                {
                    var ex = e.ToString();
                    return false;//Failure
                }
                finally
                {
                    _unitOfWork.Dispose();
                }
            }
            else
                return false;//Failure; 
        }
        public bool DeleteInvestorNotes(int adminUserId, int investorId)
        {
            var leadAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == investorId);
            var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == adminUserId);
            if (leadAccount != null && adminAccount != null)
            {
                try
                {
                    var userNotes = _unitOfWork.UserNotesRepository.Get(x => x.Id == investorId);
                    if (userNotes != null)
                    {
                        using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                        {
                            UserNotes userNotesData = userNotes;
                            userNotesData.Active = false;
                            userNotesData.ModifiedBy = adminAccount.FirstName + " " + adminAccount.LastName;
                            _unitOfWork.Save();
                            transaction.Commit();
                        }
                    }
                    return true; //Success
                }
                catch (Exception e)
                {
                    var ex = e.ToString();
                    return false;//Failure
                }
                finally
                {
                    _unitOfWork.Dispose();
                }
            }
            else
                return false;//Failure; 
        }
        public List<UserNotesDto> GetInvestorNotes(int investorId)
        {
            try
            {
                List<UserNotesDto> userNotes = new List<UserNotesDto>();
                var contextData = _unitOfWork.UserAccountRepository.Context;
                userNotes = (from notes in contextData.UserNotes
                             where notes.UserId == investorId
                             && notes.Active == true
                             select new UserNotesDto
                             {
                                 Id = notes.Id,
                                 UserId = notes.UserId,
                                 Notes = notes.Notes,
                                 CreatedBy = notes.CreatedBy,
                                 CreatedOn = notes.CreatedOn,
                                 ModifiedBy = notes.ModifiedBy,
                                 ModifiedOn = notes.ModifiedOn
                             }).ToList();
                return userNotes;
            }
            catch (Exception e)
            {
                var ex = e.ToString();
                return null;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
        public bool AddInvestorTags(TagDto tagDto)
        {
            var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == tagDto.AdminUserId && x.Active == true && x.RoleId == 3); //Active admin user
            if (adminAccount != null)
            {
                try
                {
                    using (var transaction = _unitOfWork.TagRepository.Context.Database.BeginTransaction())
                    {
                        Tag tagData = new Tag();
                        tagData.AdminUserId = (int)tagDto.AdminUserId;
                        tagData.Name = tagDto.Name;
                        tagData.Active = true;
                        tagData.Type = 1;//Investor
                        tagData.CreatedBy = tagDto.AdminUserId.ToString();
                        tagData.CreatedOn = DateTime.Now;
                        _unitOfWork.TagRepository.Insert(tagData);
                        _unitOfWork.Save();
                        transaction.Commit();
                        var tagId = tagData.Id;

                        if (tagDto.tagDetails != null)
                        {
                            using (var tagDetailtransaction = _unitOfWork.TagDetailRepository.Context.Database.BeginTransaction())
                            {
                                var contextData = _unitOfWork.TagDetailRepository.Context;
                                List<TagDetail> tagDetails = new List<TagDetail>();
                                foreach (TagDetailDto tagDetail in tagDto.tagDetails)
                                {
                                    TagDetail tagDetailData = new TagDetail();
                                    tagDetailData.TagId = tagId;
                                    tagDetailData.UserId = (int)tagDetail.UserId;
                                    tagDetailData.Active = true;
                                    tagDetailData.CreatedBy = tagDto.AdminUserId.ToString();
                                    tagDetailData.CreatedOn = DateTime.Now;
                                    tagDetailData.Active = true;
                                    tagDetails.Add(tagDetailData);
                                }
                                contextData.AddRange(tagDetails);
                                contextData.SaveChanges();
                                tagDetailtransaction.Commit();
                            }
                        }
                    }
                    return true; //Success
                }
                catch (Exception e)
                {
                    var ex = e.ToString();
                    return false;//Failure
                }
                finally
                {
                    _unitOfWork.Dispose();
                }
            }
            else
                return false;//Failure; 
        }
        public bool UpdateInvestorTags(TagDto tagDto)
        {
            var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == tagDto.AdminUserId && x.Active == true && x.RoleId == 3); //Active admin user
            if (adminAccount != null)
            {
                try
                {
                    var tag = _unitOfWork.TagRepository.Get(x => x.Id == tagDto.Id && x.Active == true);
                    if (tag != null)
                    {
                        using (var transaction = _unitOfWork.TagRepository.Context.Database.BeginTransaction())
                        {
                            Tag tagData = tag;
                            if (tag.Name != tagDto.Name)
                            {
                                tag.Name = tagDto.Name;
                                tagData.ModifiedBy = tagDto.AdminUserId.ToString();
                                tagData.ModifiedOn = DateTime.Now;
                                _unitOfWork.TagRepository.Update(tagData);
                                _unitOfWork.Save();
                                transaction.Commit();
                            }
                        }
                        var contextData = _unitOfWork.TagDetailRepository.Context;
                        using (var tagDetailtransaction = _unitOfWork.TagDetailRepository.Context.Database.BeginTransaction())
                        {
                            if (tagDto.tagDetails != null)
                            {
                                foreach (TagDetailDto tagDetail in tagDto.tagDetails)
                                {
                                    var tagData = _unitOfWork.TagDetailRepository.Get(x => x.UserId == tagDetail.UserId
                                                                                        && x.Active == true
                                                                                        && x.TagId == tagDto.Id);
                                    if (tagData != null)
                                    {
                                        TagDetail tagDetailData = tagData;
                                        if (tagDetail.Active == false)
                                        {
                                            tagDetailData.Active = false;
                                            tagDetailData.ModifiedBy = tagDto.AdminUserId.ToString();
                                            tagDetailData.ModifiedOn = DateTime.Now;
                                            _unitOfWork.TagDetailRepository.Update(tagDetailData);
                                            _unitOfWork.Save();
                                        }
                                    }
                                    else
                                    {
                                        TagDetail tagDetailData = new TagDetail();
                                        tagDetailData.TagId = (int)tagDto.Id;
                                        tagDetailData.UserId = (int)tagDetail.UserId;
                                        tagDetailData.Active = true;
                                        tagDetailData.CreatedBy = tagDto.AdminUserId.ToString();
                                        tagDetailData.CreatedOn = DateTime.Now;
                                        tagDetailData.Active = true;
                                        _unitOfWork.TagDetailRepository.Insert(tagDetailData);
                                        _unitOfWork.Save();
                                    }
                                }
                                tagDetailtransaction.Commit();
                            }
                        }
                    }
                    return true; //Success
                }
                catch (Exception e)
                {
                    var ex = e.ToString();
                    return false;//Failure
                }
                finally
                {
                    _unitOfWork.Dispose();
                }
            }
            else
                return false;//Failure; 
        }

        public bool UpdateMultiInvestorTags(List<TagDto> tagDto)
        {
            try
            {
            var adminUserId = tagDto[0].AdminUserId;
            var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == adminUserId && x.Active == true && x.RoleId == 3); //Active admin user
                if (adminAccount != null)
                {
                for (var i = 0; i < tagDto.Count; i++)
                    {
                        var tag = _unitOfWork.TagRepository.Get(x => x.Id == tagDto[i].Id && x.Active == true);
                        if (tag != null)
                        {
                            using (var transaction = _unitOfWork.TagRepository.Context.Database.BeginTransaction())
                            {
                                Tag tagData = tag;
                                if (tag.Name != tagDto[i].Name)
                                {
                                    tag.Name = tagDto[i].Name;
                                    tagData.ModifiedBy = tagDto[i].AdminUserId.ToString();
                                    tagData.ModifiedOn = DateTime.Now;
                                    _unitOfWork.TagRepository.Update(tagData);
                                    _unitOfWork.Save();
                                    transaction.Commit();
                                }
                            }
                            var contextData = _unitOfWork.TagDetailRepository.Context;
                            using (var tagDetailtransaction = _unitOfWork.TagDetailRepository.Context.Database.BeginTransaction())
                            {
                                if (tagDto[i].tagDetails != null)
                                {
                                    foreach (TagDetailDto tagDetail in tagDto[i].tagDetails)
                                    {
                                        var tagData = _unitOfWork.TagDetailRepository.Get(x => x.UserId == tagDetail.UserId
                                                                                            && x.Active == true
                                                                                            && x.TagId == tagDto[i].Id);
                                        if (tagData != null)
                                        {
                                            TagDetail tagDetailData = tagData;
                                            if (tagDetail.Active == false)
                                            {
                                                tagDetailData.Active = false;
                                                tagDetailData.ModifiedBy = tagDto[i].AdminUserId.ToString();
                                                tagDetailData.ModifiedOn = DateTime.Now;
                                                _unitOfWork.TagDetailRepository.Update(tagDetailData);
                                                _unitOfWork.Save();
                                            }
                                        }
                                        else
                                        {
                                            TagDetail tagDetailData = new TagDetail();
                                            tagDetailData.TagId = (int)tagDto[i].Id;
                                            tagDetailData.UserId = (int)tagDetail.UserId;
                                            tagDetailData.Active = true;
                                            tagDetailData.CreatedBy = tagDto[i].AdminUserId.ToString();
                                            tagDetailData.CreatedOn = DateTime.Now;
                                            tagDetailData.Active = true;
                                            _unitOfWork.TagDetailRepository.Insert(tagDetailData);
                                            _unitOfWork.Save();
                                        }
                                    }
                                    tagDetailtransaction.Commit();
                                }

                            }
                        }
                    }
                }
                return true;
            }
            catch (Exception e)
            {
                var ex = e.ToString();
                return false;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public bool DeleteInvestorTags(int adminUserId, int tagId)
        {
            var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == adminUserId && x.Active == true && x.RoleId == 3); //Active admin user
            if (adminAccount != null)
            {
                try
                {
                    var tag = _unitOfWork.TagRepository.Get(x => x.Id == tagId && x.Active == true);
                    if (tag != null)
                    {
                        using (var transaction = _unitOfWork.TagRepository.Context.Database.BeginTransaction())
                        {
                            Tag tagData = tag;
                            tagData.Active = false;
                            tagData.ModifiedBy = adminUserId.ToString();
                            tagData.ModifiedOn = DateTime.Now;
                            _unitOfWork.TagRepository.Update(tagData);
                            _unitOfWork.Save();
                            transaction.Commit();
                        }
                        var tagDetails = _unitOfWork.TagDetailRepository.GetMany(x => x.TagId == tagId && x.Active == true);
                        if (tagDetails != null)
                        {
                            var contextData = _unitOfWork.TagDetailRepository.Context;
                            List<TagDetail> tagDetailsData = new List<TagDetail>();
                            using (var tagDetailtransaction = _unitOfWork.TagDetailRepository.Context.Database.BeginTransaction())
                            {
                                foreach (TagDetail tagDetail in tagDetails)
                                {
                                    TagDetail tagDetailData = tagDetail;
                                    tagDetailData.Active = false;
                                    tagDetailData.ModifiedBy = adminUserId.ToString();
                                    tagDetailData.ModifiedOn = DateTime.Now;
                                    tagDetailsData.Add(tagDetailData);
                                }
                                contextData.UpdateRange(tagDetailsData);
                                contextData.SaveChanges();
                                tagDetailtransaction.Commit();
                            }
                        }
                    }
                    return true; //Success
                }
                catch (Exception e)
                {
                    var ex = e.ToString();
                    return false;//Failure
                }
                finally
                {
                    _unitOfWork.Dispose();
                }
            }
            else
                return false;//Failure; 
        }
        public List<TagDto> GetInvestorTags(int adminUserId)
        {
            try
            {
                List<TagDto> tags = new List<TagDto>();
                var contextData = _unitOfWork.TagRepository.Context;
                tags = (from tag in contextData.Tag
                        where tag.AdminUserId == adminUserId
                        && tag.Active == true
                        && tag.Type == 1 // Investor tags
                        select new TagDto
                        {
                            Id = tag.Id,
                            AdminUserId = tag.AdminUserId,
                            Name = tag.Name,
                            Active = tag.Active,
                            Type = tag.Type,
                            CreatedBy = tag.CreatedBy,
                            CreatedOn = tag.CreatedOn,
                            ModifiedBy = tag.ModifiedBy,
                            ModifiedOn = tag.ModifiedOn,
                            tagDetails = (from tagDetail in contextData.TagDetail
                                          where tagDetail.TagId == tag.Id
                                          && tagDetail.Active == true
                                          select new TagDetailDto
                                          {
                                              Id = tagDetail.Id,
                                              TagId = tagDetail.TagId,
                                              UserId = tagDetail.UserId,
                                              Active = tagDetail.Active,
                                              CreatedBy = tagDetail.CreatedBy,
                                              CreatedOn = tagDetail.CreatedOn,
                                              ModifiedBy = tagDetail.ModifiedBy,
                                              ModifiedOn = tagDetail.ModifiedOn
                                          }).ToList()
                        }).ToList();
                return tags;
            }
            catch (Exception e)
            {
                var ex = e.ToString();
                return null;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
        public bool ResetPassword(ResetPasswordDto passwordDto)
        {
            try
            {
                var user = _unitOfWork.UserAccountRepository.GetNoTrackWithInclude(x => x.Id == passwordDto.UserId).FirstOrDefault();
                if (user != null)
                {
                    byte[] existingSalt = user.PasswordSalt;
                    string existingHashedPassword = "";
                    var hashedPassword = Convert.ToBase64String(Helper.HashPasswordWithSalt(Encoding.UTF8.GetBytes(passwordDto.Password), existingSalt));
                    existingHashedPassword = user.Password;
                    if (hashedPassword != existingHashedPassword)
                    {
                        using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                        {
                            byte[] salt = Helper.GenerateSalt();
                            user.PasswordSalt = salt;
                            var newPasswordHash = Helper.HashPasswordWithSalt(Encoding.UTF8.GetBytes(passwordDto.Password), salt);
                            user.Password = Convert.ToBase64String(newPasswordHash);
                            user.PasswordChangedOn = DateTime.Now;
                            user.OldPassword = existingHashedPassword;
                            user.ModifiedBy = passwordDto.AdminUserId.ToString();
                            user.ModifiedOn = DateTime.Now;
                            // updates user password and salt
                            _unitOfWork.UserAccountRepository.Update(user);                                                                
                            _unitOfWork.Save();

                            transaction.Commit();
                            return true;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch
            {
            }
            finally
            {
                _unitOfWork.Dispose();
            }
            return false;
        }
        public bool AccountVerification(int adminUserId, int investorId,bool isverify)
        {
            try
            {
                var user = _unitOfWork.UserAccountRepository.GetNoTrackWithInclude(x => x.Id == investorId).FirstOrDefault();
                if (user != null)
                {                   
                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {                        
                            user.IsEmailVerified = isverify; // investor Email verified by the relevant admin user                                                     
                            user.IsPhoneVerified = isverify;
                            user.VerifyAccount = isverify;
                            if(isverify)
                            {
                                user.AccountVerifiedBy = adminUserId;
                            }
                            user.ModifiedBy = adminUserId.ToString();
                            user.ModifiedOn = DateTime.Now;                            
                            _unitOfWork.UserAccountRepository.Update(user);
                            _unitOfWork.Save();
                            transaction.Commit();
                            return true;                       
                    }                    
                }
                else
                {
                    return false;
                }
            }
            catch(Exception e)
            {
                e.ToString();
                return false;
            }
            finally
            {
                _unitOfWork.Dispose();
            }           
        }
        
        public bool UpdateAccreditation(int adminUserId, int investorId, bool isverify)
        {
            try
            {
                var user = _unitOfWork.UserAccountRepository.GetNoTrackWithInclude(x => x.Id == investorId).FirstOrDefault();
                if (user != null)
                {
                    using (var transaction = _unitOfWork.UserAccountRepository.Context.Database.BeginTransaction())
                    {
                       
                            user.IsAccreditedInvestor = isverify; //  Verify Accreditation by the relevant admin user
                            user.ModifiedBy = adminUserId.ToString();
                            user.ModifiedOn = DateTime.Now;
                            if(isverify == true)
                            {
                                user.AccreditationVerifiedBy = adminUserId;
                            }
                            _unitOfWork.UserAccountRepository.Update(user);
                            _unitOfWork.Save();
                            transaction.Commit();
                            return true;                        
                    }
                }
                else
                {
                    return false;
                }
            }
            catch(Exception e)
            {
                e.ToString();
                return false;
            }
            finally
            {
                _unitOfWork.Dispose();
            }           
        }        
        public async Task<bool> UploadDocuments(DocumentModelDto documentsDto)
        {
            var contextData = _unitOfWork.DocumentRepository.Context;

            try
            {
                List<Document> documents = new List<Document>();
                using (var transaction = _unitOfWork.DocumentRepository.Context.Database.BeginTransaction())
                {
                    if (documentsDto.Files != null)
                    {
                        foreach (var file in documentsDto.Files)
                        {
                            Helper _helper = new Helper(_configuration);
                            var blobFilePath = (await _helper.DocumentSaveAndUpload(file, documentsDto.UserId, documentsDto.Type)).ToString();

                            Document document = new Document();
                            document.UserId = documentsDto.UserId;
                            document.FilePath = blobFilePath;
                            document.Type = documentsDto.Type;
                            document.Name = file.FileName;
                            var extn = Path.GetExtension(file.FileName);
                            document.Extension = extn.Replace(".", "");
                            document.Size = (file.Length / 1024).ToString();
                            document.Status = 1;//Pending
                            document.Active = true;
                            document.CreatedBy = documentsDto.UserId.ToString();
                            document.CreatedOn = DateTime.Now;
                            documents.Add(document);
                        }
                    }
                    contextData.AddRange(documents);
                    contextData.SaveChanges();
                    transaction.Commit();                    
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
        public InvestorSummaryDto GetHeaderElements(int userId)
        {
            InvestorSummaryDto elements = null;
            var contextData = _unitOfWork.InvestmentRepository.Context;
            try
            {               
                /* elements = (from summary in contextData.InvestorSummary
                                where summary.UserId == userId
                                select new InvestmentSummaryDto
                                {
                                    UserId = summary.UserId,
                                    TotalInvestments = summary.TotalInvestments == null ? 0 : summary.TotalInvestments,
                                    PendingInvestments = summary.PendingInvestments == null ? 0 : summary.PendingInvestments,
                                    TotalInvested = summary.TotalInvested,
                                    TotalEarnings = summary.TotalEarnings,
                                    TotalReturn = summary.TotalReturn
                                }
                                ).FirstOrDefault();*/
                if (elements == null)
                {
                    elements = new InvestorSummaryDto();
                    elements.TotalInvestments = (from investment in contextData.Investment
                                                    where investment.UserId == userId
                                                    //&& investment.Status == 1// Approved by admin
                                                    && investment.Active == true // Active Investment
                                                    && investment.IsReservation == false
                                                    select investment.Id).Count();

                    elements.PendingInvestments = (from investment in contextData.Investment
                                                    where investment.UserId == userId
                                                    && (investment.Status == 2 || // Pending when investment added by Admin
                                                    investment.Status == 3 // Pending Investor Signature and Funding
                                                    || investment.Status == 4) // Pending Funding
                                                    && investment.Active == true // Active Investment
                                                    && investment.IsReservation == false
                                                    select investment.Id).Count();

                    elements.TotalInvested = (from investment in contextData.Investment
                                                where investment.UserId == userId
                                                //&& investment.Status == 1// Approved by admin
                                                && investment.Active == true // Active Investment
                                                && investment.IsReservation == false // Offering Investment
                                                select investment.Amount).Sum();

                    elements.TotalReserved = (from investment in contextData.Investment
                                                where investment.UserId == userId
                                                // && investment.Status == 1// Approved by admin
                                                && investment.Active == true // Active Investment
                                                && investment.IsReservation == true // Reservation Investment
                                                select investment.Amount).Sum();
                    return elements;
                }
                else
                    return elements;                                               
            }
            catch (Exception e)
            {
                e.ToString();
                return elements;
            }
            finally
            {
                contextData = null;
            }
        }
        public InvestorsSummaryDto GetInvestorsHeaderElements()
        {
            InvestorsSummaryDto elements = null;
            var contextData = _unitOfWork.InvestmentRepository.Context;
            try
            {
                /* elements = (from summary in contextData.InvestorSummary
                                where summary.UserId == userId
                                select new InvestmentSummaryDto
                                {
                                    UserId = summary.UserId,
                                    TotalInvestments = summary.TotalInvestments == null ? 0 : summary.TotalInvestments,
                                    PendingInvestments = summary.PendingInvestments == null ? 0 : summary.PendingInvestments,
                                    TotalInvested = summary.TotalInvested,
                                    TotalEarnings = summary.TotalEarnings,
                                    TotalReturn = summary.TotalReturn
                                }
                                ).FirstOrDefault();*/
                if (elements == null)
                {
                    elements = new InvestorsSummaryDto();
                    elements.TotalInvestors = (from investor in contextData.UserAccount
                                               where investor.RoleId == 1// Investor
                                               && investor.Active == true // Active Investor
                                                 select investor.Id).Count();

                    elements.TotalInvestments = (from investment in contextData.Investment
                                                   where 
                                                   (investment.Status == 3 // Pending Investor Signature and Funding
                                                    || investment.Status == 1 // Approved
                                                   || investment.Status == 4) // Pending Funding
                                                   && investment.Active == true // Active Investment
                                                   select investment.Id).Count();

                    elements.TotalApprovedAmount = (from investment in contextData.Investment
                                              where investment.Status == 1// Approved by admin
                                              && investment.Active == true // Active Investment
                                              && investment.IsReservation == false // Offering Investment
                                              select investment.Amount).Sum();

                    elements.TotalReserved = (from investment in contextData.Investment
                                              where investment.Active == true // Active Investment
                                              && investment.IsReservation == true // Reservation Investment
                                              select investment.Amount).Sum();

                    elements.AverageInvestment = elements.TotalInvestments / elements.TotalInvestors;

                    return elements;
                }
                else
                    return elements;
            }
            catch (Exception e)
            {
                e.ToString();
                return elements;
            }
            finally
            {
                contextData = null;
            }
        }
        public List<ReservationDataDto> GetReservations(int investorId)
        {
            try
            {
                var contextData = _unitOfWork.InvestmentRepository.Context;

                var reservationsData = (from reservation in contextData.Investment
                                       join userprofile in contextData.UserProfile on reservation.UserProfileId equals userprofile.Id
                                       join offering in contextData.PortfolioOffering on reservation.OfferingId equals offering.Id
                                       join profiletype in contextData.UserProfileType on userprofile.Type equals profiletype.Id
                                       where reservation.UserId == investorId 
                                             && reservation.IsReservation == true
                                             && reservation.Active == true
                                       select new ReservationDataDto
                                       {
                                           Id = reservation.Id,
                                           ReservationId = offering.Id,
                                           UserId = reservation.UserId,
                                           ProfileId = reservation.UserProfileId,                                           
                                           Amount = reservation.Amount,
                                           ReservationName = offering.Name,  
                                           ProfileName =  userprofile.FirstName + " " + userprofile.LastName +userprofile.Name +userprofile.RetirementPlanName + userprofile.TrustName,
                                           ProfileType = userprofile.Type,
                                           ProfileTypeName = profiletype.Name,
                                           ConfidenceLevel = reservation.ConfidenceLevel, 
                                           CreatedOn = reservation.CreatedOn,
                                           UserProfile = (from profile in contextData.UserProfile
                                                          where profile.Id == reservation.UserProfileId
                                                          select new UserProfileDto
                                                          {                                                              
                                                              Type = profile.Type,
                                                              Name = profile.Name,
                                                              FirstName = profile.FirstName,
                                                              LastName = profile.LastName,
                                                              RetirementPlanName = profile.RetirementPlanName,
                                                              TrustName = profile.TrustName
                                                          }).FirstOrDefault()
                                           
                                       }).OrderByDescending(x=>x.CreatedOn).ToList();
                contextData = null;
                return reservationsData;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
        }
        public List<InvestmentResultDataDto> GetInvestments(int investorId)
        {
            try
            {
                var contextData = _unitOfWork.InvestmentRepository.Context;

                var investmentsData = (from investment in contextData.Investment
                                       join userprofile in contextData.UserProfile on investment.UserProfileId equals userprofile.Id
                                       join offering in contextData.PortfolioOffering on investment.OfferingId equals offering.Id
                                       join profiletype in contextData.UserProfileType on userprofile.Type equals profiletype.Id
                                       where investment.UserId == investorId 
                                            && investment.IsReservation == false
                                            && investment.Active == true
                                       select new InvestmentResultDataDto
                                       {
                                           Id = investment.Id,
                                           OfferingId = offering.Id,
                                           Amount = investment.Amount,
                                           Status = investment.Status,
                                           OfferingName = offering.Name,
                                           ProfileId = userprofile.Id,
                                           ProfileName = userprofile.FirstName + " " + userprofile.LastName + userprofile.Name + userprofile.RetirementPlanName + userprofile.TrustName,
                                           ProfileTypeName = profiletype.Name,
                                           UserId = userprofile.UserId,
                                           FundsReceivedDate = investment.FundedDate,
                                           eSignedDocumentPath = investment.eSignedDocumentPath,
                                           DocumenteSignedDate = investment.DocumenteSignedDate,
                                           CreatedOn = investment.CreatedOn,
                                           UserProfile = (from profile in contextData.UserProfile
                                                          where profile.Id == investment.UserProfileId
                                                          select new UserProfileDto
                                                          {
                                                              Type = profile.Type,
                                                              Name = profile.Name,
                                                              FirstName = profile.FirstName,
                                                              LastName = profile.LastName,
                                                              RetirementPlanName = profile.RetirementPlanName,
                                                              TrustName = profile.TrustName
                                                          }).FirstOrDefault(),

                                       }).OrderByDescending(x => x.CreatedOn).ToList();
                contextData = null;
                return investmentsData;
            }
            catch (Exception e) 
            {
                e.ToString();
                return null;
            }
        }        
        public List<PortfolioOfferingDto> GetReservationList()
        {
            try
            {
                var contextData = _unitOfWork.PortfolioOfferingRepository.Context;

                var reservationList = (from offering in contextData.PortfolioOffering
                                    where (offering.Visibility == 2 || offering.Visibility == 3 || offering.Visibility == 6)//All Users/Verified Users/Test(IT and Admin)
                                    && offering.IsReservation == true
                                    select new PortfolioOfferingDto
                                    {
                                        Id = offering.Id,
                                        Name = offering.Name,
                                        PictureUrl = offering.PictureUrl,
                                        EntityName = offering.EntityName,
                                        Active = offering.Active,
                                        Status = offering.Status,
                                        Size = offering.Size,                                        
                                        Visibility = offering.Visibility,
                                        CreatedOn = offering.CreatedOn,
                                    }).ToList();
                return reservationList;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
        }
        public List<PortfolioOfferingDto> GetOfferingList()
        {
            try
            {
                var contextData = _unitOfWork.PortfolioOfferingRepository.Context;

                var offeringList = (from offering in contextData.PortfolioOffering
                                       where (offering.Visibility == 2 || offering.Visibility == 3 || offering.Visibility == 6)//All Users/Verified Users/Test(IT and Admin)
                                       && offering.IsReservation == false
                                       select new PortfolioOfferingDto
                                       {
                                           Id = offering.Id,
                                           Name = offering.Name,
                                           PictureUrl = offering.PictureUrl,
                                           EntityName = offering.EntityName,
                                           Active = offering.Active,
                                           Status = offering.Status,
                                           Size = offering.Size,
                                           Visibility = offering.Visibility,
                                           CreatedOn = offering.CreatedOn,
                                       }).ToList();
                return offeringList;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
        }
        public List<UserProfileDto> GetAllUserProfile(int userId)
        {
            List<UserProfileDto> userProfileList = new List<UserProfileDto>();
            var contextData = _unitOfWork.UserProfileRepository.Context;
            try
            {
                userProfileList = (from userProfile in contextData.UserProfile
                                   join dType in contextData.UserProfileType on userProfile.Type equals dType.Id
                                   from paymentType in contextData.DistributionType.Where(paymentType => paymentType.Id == userProfile.DistributionTypeId).DefaultIfEmpty()
                                   from bankAccount in contextData.BankAccount.Where(bankAccount => bankAccount.Id == userProfile.BankAccountId).DefaultIfEmpty()
                                   from bankAccountType in contextData.BankAccountType.Where(bankAccountType => bankAccountType.Id == bankAccount.AccountType).DefaultIfEmpty()                                   
                                   where userProfile.UserId == userId && userProfile.Active == true

                                   select new UserProfileDto
                                   {
                                       Id = userProfile.Id,
                                       UserId = userProfile.UserId,
                                       ProfileDisplayId = userProfile.DisplayId,
                                       Type = userProfile.Type,
                                       TypeName = dType.Name,
                                       ProfileName = userProfile.Name + (userProfile.FirstName + " " + userProfile.LastName) + userProfile.RetirementPlanName
                                                     + userProfile.TrustName,
                                       Name = userProfile.Name,                                       
                                       FirstName = userProfile.FirstName,
                                       LastName = userProfile.LastName,
                                       TrustName = userProfile.TrustName,
                                       RetirementPlanName = userProfile.RetirementPlanName,
                                       SignorName = userProfile.SignorName,
                                       InCareOf = userProfile.InCareOf,
                                       StreetAddress1 = userProfile.StreetAddress1,
                                       StreetAddress2 = userProfile.StreetAddress2,
                                       City = userProfile.City,
                                       StateOrProvinceId = userProfile.StateOrProvinceId,
                                       Country = userProfile.Country,
                                       State = userProfile.State,
                                       ZipCode = userProfile.ZipCode,
                                       TaxId = userProfile.TaxId,
                                       DistributionTypeId = userProfile.DistributionTypeId == null ? 0 : userProfile.DistributionTypeId,
                                       PaymentMethod = paymentType.Name,
                                       IsDisregardedEntity = userProfile.IsDisregardedEntity,
                                       IsIRALLC = userProfile.IsIRALLC,
                                       IsOwner = userProfile.IsOwner,
                                       OwnerTaxId = userProfile.OwnerTaxId,
                                       DistributionDetail = userProfile.DistributionDetail,
                                       CheckInCareOf = userProfile.CheckInCareOf,
                                       CheckAddressLine1 = userProfile.CheckAddressLine1,
                                       CheckAddressLine2 = userProfile.CheckAddressLine2,
                                       CheckCity = userProfile.CheckCity,
                                       CheckStateId = userProfile.CheckStateId,
                                       CheckZip = userProfile.CheckZip,
                                       BankAccountId = userProfile.BankAccountId,
                                       BankName = bankAccount.BankName,
                                       BankAccountNumber = bankAccount.AccountNumber,
                                       BankAccountType = bankAccountType.Type,
                                       BankRoutingNumber = bankAccount.RoutingNumber,
                                       Active = userProfile.Active,
                                       Status = userProfile.Status,
                                       CreatedBy = userProfile.CreatedBy,
                                       CreatedOn = userProfile.CreatedOn,
                                       ModifiedOn = userProfile.ModifiedOn,
                                       ModifiedBy = userProfile.ModifiedBy,
                                       ApprovedOn = userProfile.ApprovedOn,
                                       ApprovedBy = userProfile.ApprovedBy,
                                       Investors = (from investor in contextData.Investor
                                                    where investor.UserProfileId == userProfile.Id
                                                    select new InvestorDto
                                                    {
                                                        Id = investor.Id,
                                                        UserProfileId = investor.UserProfileId,
                                                        FirstName = investor.FirstName,
                                                        LastName = investor.LastName,
                                                        EmailId = investor.EmailId,
                                                        Phone = investor.Phone,
                                                        IsNotificationEnabled = investor.IsNotificationEnabled,
                                                        IsOwner = investor.IsOwner,
                                                        Active = investor.Active,
                                                        Status = investor.Status,
                                                        CreatedBy = investor.CreatedBy,
                                                        CreatedOn = investor.CreatedOn,
                                                        ModifiedBy = investor.ModifiedBy,
                                                        ModifiedOn = investor.ModifiedOn
                                                    }).ToList()                              
                                   }).OrderByDescending(x => x.CreatedOn).ToList();

            }
            catch (Exception e)
            {
                var x = e.ToString();
                userProfileList = null;
            }
            finally
            {
                contextData = null;
            }
            return userProfileList;
        }
        public bool AddReservation(ReservationDataDto reservationDataDto)
        {            
            try
            {
                using (var transaction = _unitOfWork.InvestmentRepository.Context.Database.BeginTransaction())
                {

                    Investment investment = new Investment();
                    investment.IsReservation = true;
                    investment.UserId = reservationDataDto.UserId;
                    investment.Amount = reservationDataDto.Amount;
                    investment.UserProfileId = reservationDataDto.ProfileId;
                    investment.OfferingId = reservationDataDto.ReservationId;
                    investment.ConfidenceLevel = reservationDataDto.ConfidenceLevel;
                    investment.Status = 1; // Approved by default
                    investment.Active = true;
                    investment.CreatedBy = reservationDataDto.AdminUserId.ToString();
                    investment.CreatedOn = DateTime.Now;
                    _unitOfWork.InvestmentRepository.Insert(investment);
                    _unitOfWork.Save();
                    transaction.Commit();
                    var offering = _unitOfWork.PortfolioOfferingRepository.GetByID(reservationDataDto.ReservationId);
                    string message = "You added $" + reservationDataDto.Amount + " reservation in " + offering.Name + " under profile " + reservationDataDto.ProfileName;
                    var notification = _notificationRepository.AddNotification(reservationDataDto.UserId, "Reservation added", message, reservationDataDto.AdminUserId);
                    if (notification != null)
                    {
                        _hubContext.Clients.All.SendAsync("Push_Notification", notification);
                    }
                }
                return true; //Success
            }

            catch (Exception e)
            {
                e.ToString();
                return false;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }                      
        }
        public bool UpdateReservation(ReservationDataDto reservationDataDto)
        {
            try
            {
                using (var transaction = _unitOfWork.InvestmentRepository.Context.Database.BeginTransaction())
                {
                    var reservation = _unitOfWork.InvestmentRepository.GetByID(reservationDataDto.Id);
                    reservation.UserId = reservationDataDto.UserId;
                    reservation.Amount = reservationDataDto.Amount;
                    reservation.UserProfileId = reservationDataDto.ProfileId;
                    reservation.OfferingId = reservationDataDto.ReservationId;
                    reservation.ConfidenceLevel = reservationDataDto.ConfidenceLevel;                   
                    reservation.Active = true;
                    reservation.CreatedBy = reservationDataDto.AdminUserId.ToString();
                    reservation.CreatedOn = DateTime.Now;
                    _unitOfWork.InvestmentRepository.Update(reservation);
                    _unitOfWork.Save();
                    transaction.Commit();
                    var offering = _unitOfWork.PortfolioOfferingRepository.GetByID(reservationDataDto.ReservationId);
                    string message = "";
                    if (reservation.Amount != reservationDataDto.Amount)
                    {
                        message = "You edited "+ reservation.Amount+" reservation amount to " + reservationDataDto.Amount + " in " + offering.Name;
                        var notification = _notificationRepository.AddNotification(reservationDataDto.UserId, "Reservation updated", message, reservationDataDto.AdminUserId);
                        if (notification != null)
                        {
                            _hubContext.Clients.All.SendAsync("Push_Notification", notification);
                        }
                    }
                    if (reservation.UserProfileId != reservationDataDto.ProfileId)
                    {
                        message = "You edited "+ reservationDataDto.Amount +" reservation in " + offering.Name + " to profile " +reservationDataDto.ProfileName;
                        var notification = _notificationRepository.AddNotification(reservationDataDto.UserId, "Reservation updated", message, reservationDataDto.AdminUserId);
                        if (notification != null)
                        {
                            _hubContext.Clients.All.SendAsync("Push_Notification", notification);
                        }
                    }                   
                }
                return true; //Success
            }

            catch (Exception e)
            {
                e.ToString();
                return false;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
        public bool DeleteReservation(int adminUserId, int reservationId)
        {
            try
            {
                using (var transaction = _unitOfWork.InvestmentRepository.Context.Database.BeginTransaction())
                {
                    var reservation = _unitOfWork.InvestmentRepository.GetByID(reservationId);
                    reservation.Active = false;
                    reservation.ModifiedBy = adminUserId.ToString();                    
                    _unitOfWork.InvestmentRepository.Update(reservation);
                    _unitOfWork.Save();
                    transaction.Commit();
                    var offering = _unitOfWork.PortfolioOfferingRepository.GetByID(reservation.OfferingId);
                    string message = "";
                    message = "You deleted $" + reservation.Amount+"reservation in " + offering.Name;
                    var notification = _notificationRepository.AddNotification(reservation.UserId, "Reservation deleted", message, adminUserId);
                    if (notification != null)
                    {
                        _hubContext.Clients.All.SendAsync("Push_Notification", notification);
                    }
                    return true; //Success
                }
            }

            catch (Exception e)
            {
                e.ToString();
                return false;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
        public bool AddInvestment(InvestmentDataDto investmentDataDto)
        {
            try
            {
                using (var transaction = _unitOfWork.InvestmentRepository.Context.Database.BeginTransaction())
                {

                    Investment investment = new Investment();
                    investment.IsReservation = false;
                    investment.UserId = investmentDataDto.UserId;
                    investment.Amount = investmentDataDto.Amount;
                    investment.UserProfileId = investmentDataDto.ProfileId;
                    investment.OfferingId = investmentDataDto.OfferingId;
                    investment.FundedDate = investmentDataDto.FundsReceivedDate;
                    investment.DocumenteSignedDate = investmentDataDto.DocumenteSignedDate;                                       
                    investment.eSignedDocumentPath = investmentDataDto.eSignedDocumentPath;
                    investment.Status = investmentDataDto.Status;
                    investment.Active = true;
                    investment.CreatedBy = investmentDataDto.AdminUserId.ToString();
                    investment.CreatedOn = DateTime.Now;
                    _unitOfWork.InvestmentRepository.Insert(investment);
                    _unitOfWork.Save();
                    transaction.Commit();
                    var offering = _unitOfWork.PortfolioOfferingRepository.GetByID(investmentDataDto.OfferingId);
                    string message = "You added $" + investmentDataDto.Amount + " investment in " + offering.Name + " under profile " + investmentDataDto.ProfileName;
                    var notification = _notificationRepository.AddNotification(investmentDataDto.UserId, "Investment added", message, investmentDataDto.AdminUserId);
                    if (notification != null)
                    {
                        _hubContext.Clients.All.SendAsync("Push_Notification", notification);
                    }
                }
                return true; //Success
            }

            catch (Exception e)
            {
                e.ToString();
                return false;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
        public bool UpdateInvestment(InvestmentDataDto investmentDataDto)
        {
            try
            {
                using (var transaction = _unitOfWork.InvestmentRepository.Context.Database.BeginTransaction())
                {
                    var investment = _unitOfWork.InvestmentRepository.GetByID(investmentDataDto.Id);
                    investment.UserId = investmentDataDto.UserId;
                    investment.Amount = investmentDataDto.Amount;
                    investment.UserProfileId = investmentDataDto.ProfileId;
                    investment.OfferingId = investmentDataDto.OfferingId;
                    investment.Status = investmentDataDto.Status;
                    investment.DocumenteSignedDate = investmentDataDto.DocumenteSignedDate;
                    investment.FundedDate = investmentDataDto.FundsReceivedDate;                    
                    if (investment.eSignedDocumentPath == null)
                    {
                        DocumentModelDto neweSignedDocument = new DocumentModelDto();
                        neweSignedDocument.AdminUserId = investmentDataDto.AdminUserId;
                        neweSignedDocument.UserId = investmentDataDto.UserId;
                        neweSignedDocument.Type = 2;
                        neweSignedDocument.Files = investmentDataDto.eSignedDocument;
                        var filePath = _documentRepository.AddDocument(neweSignedDocument);
                        if (filePath.Result != null)
                            investment.eSignedDocumentPath = filePath.Result;
                    }
                   /* else if (investmentDataDto.eSignedDocumentPath == null)
                    {
                        investment.eSignedDocumentPath = null;
                    }*/
                    else if(investment.eSignedDocumentPath != investmentDataDto.eSignedDocumentPath)
                    { 
                        DocumentModelDto neweSignedDocument = new DocumentModelDto();
                        neweSignedDocument.AdminUserId = investmentDataDto.AdminUserId;
                        neweSignedDocument.UserId = investmentDataDto.UserId;
                        neweSignedDocument.Type = 2;
                        neweSignedDocument.Files = investmentDataDto.eSignedDocument;
                        var filePath1 = _documentRepository.AddDocument(neweSignedDocument);
                        if (filePath1.Result != null)
                            investment.eSignedDocumentPath = filePath1.Result;
                    }
                    investment.ModifiedBy = investmentDataDto.AdminUserId.ToString();
                    _unitOfWork.InvestmentRepository.Update(investment);
                    _unitOfWork.Save();
                    transaction.Commit();
                    var offering = _unitOfWork.PortfolioOfferingRepository.GetByID(investmentDataDto.OfferingId);
                    string message = "";
                    if (investment.Amount != investmentDataDto.Amount)
                    {
                        message = "You edited $" + investment.Amount + " investment amount to " + investmentDataDto.Amount + " in " + offering.Name;
                        var notification = _notificationRepository.AddNotification(investmentDataDto.UserId, "Investment updated", message, investmentDataDto.AdminUserId);
                        if (notification != null)
                        {
                            _hubContext.Clients.All.SendAsync("Push_Notification", notification);
                        }
                    }
                    if (investment.UserProfileId != investmentDataDto.ProfileId)
                    {
                        message = "You edited " + investmentDataDto.Amount + " investment in " + offering.Name + " to profile " + investmentDataDto.ProfileName;
                        var notification = _notificationRepository.AddNotification(investmentDataDto.UserId, "Investment updated", message, investmentDataDto.AdminUserId);
                        if (notification != null)
                        {
                            _hubContext.Clients.All.SendAsync("Push_Notification", notification);
                        }
                    }
                    if (investmentDataDto.eSignedDocumentPath != investment.eSignedDocumentPath)
                    {       
                        //To do
                    }
                    if (investmentDataDto.Status != investment.Status)
                    {
                        //To do
                    }
                    if (investmentDataDto.DocumenteSignedDate != investment.DocumenteSignedDate)
                    {
                        //To do
                    }
                    if (investmentDataDto.FundsReceivedDate != investment.FundedDate)
                    {
                        //To do
                    }
                    return true; //Success
                }
            }
            catch (Exception e)
            {
                e.ToString();
                return false;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
        public bool DeleteInvestment(int adminUserId, int investmentId)
        {
            try
            {
                using (var transaction = _unitOfWork.InvestmentRepository.Context.Database.BeginTransaction())
                {
                    var investment = _unitOfWork.InvestmentRepository.GetByID(investmentId);
                    investment.Active = false;
                    investment.ModifiedBy = adminUserId.ToString();
                    _unitOfWork.InvestmentRepository.Update(investment);
                    _unitOfWork.Save();
                    transaction.Commit();
                    var offering = _unitOfWork.PortfolioOfferingRepository.GetByID(investment.OfferingId);
                    string message = "";
                    message = "You deleted $" + investment.Amount + "investment in " + offering.Name;
                    var notification = _notificationRepository.AddNotification(investment.UserId, "Investment deleted", message, adminUserId);
                    if (notification != null)
                    {
                        _hubContext.Clients.All.SendAsync("Push_Notification", notification);
                    }
                    return true; //Success
                }
            }

            catch (Exception e)
            {
                e.ToString();
                return false;//Failure
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
        public AccountStatementDto GetAccountStatement(int investorid)
        {
            try
            {
                var investor = _unitOfWork.UserAccountRepository.GetByID(investorid);
                if (investor != null)
                {
                    var contextData = _unitOfWork.InvestmentRepository.Context;
                    AccountStatementDto accountStatement = new AccountStatementDto();
                    accountStatement.InvestorName = investor.FirstName + " " + investor.LastName;
                    accountStatement.InvestorId = investorid;
                    ContactDto credorContact = new ContactDto();
                    credorContact.PhoneNumber = "+922-9494-93443";
                    credorContact.EmailId = "ir@credor.com";
                    credorContact.WebsiteUrl = "www.credor.com";

                    accountStatement.CredorContact = credorContact;

                    accountStatement.TotalInvested = (from investment in contextData.Investment
                                                      where investment.UserId == investorid
                                                      //&& investment.Status == 1// Approved by admin
                                                      && investment.Active == true // Active Investment
                                                      select investment.Amount).Sum();
                    accountStatement.StatementDate = DateTime.Now;                    
                    
                    var offerings = (from offering in contextData.PortfolioOffering
                                join investment in contextData.Investment on offering.Id equals investment.OfferingId
                                where investment.UserId == investorid
                                select offering.Id).Distinct().ToList();
                    if (offerings != null)
                    {
                        accountStatement.Portfolio = (from offering in contextData.PortfolioOffering
                                                      where offerings.Contains(offering.Id)
                                                      select new PortfolioDto
                                                      {
                                                          OfferingId = offering.Id,
                                                          OfferingName = offering.Name,
                                                          /*PortfolioPercentage = ((from investment in contextData.Investment
                                                                                  join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                                                                                  where investment.OfferingId == offering.Id
                                                                                  select distribution.PaymentAmount).Sum()/
                                                                                  (from investment in contextData.Investment
                                                                                   where investment.OfferingId == offering.Id
                                                                                   select investment.Amount).Sum()) * 100*/
                                                          PortfolioPercentage = ((from investment in contextData.Investment
                                                                                   where investment.OfferingId == offering.Id
                                                                                   && investment.Active == true                                                                                   
                                                                                   select investment.Amount).Sum()/accountStatement.TotalInvested) * 100
                                                      }).Distinct().ToList();
                        accountStatement.InvestmentOverviews = (from offering in contextData.PortfolioOffering
                                                                where offerings.Contains(offering.Id)                                                                                                                      
                                                                select new InvestmentOverviewDto
                                                                {
                                                                    OfferingName = offering.Name,
                                                                    EntityName = offering.EntityName,
                                                                    Date = (from investment in contextData.Investment
                                                                            where investment.OfferingId == offering.Id
                                                                            select investment.FundedDate).FirstOrDefault(),
                                                                    InvestmentAmount = (from investment in contextData.Investment
                                                                                        where investment.OfferingId == offering.Id
                                                                                        select investment.Amount).Sum(),
                                                                    FundedAmount = (from investment in contextData.Investment
                                                                                    where investment.OfferingId == offering.Id
                                                                                    select investment.Amount).Sum(),
                                                                    Distributions = (from investment in contextData.Investment
                                                                                     join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                                                                                     where investment.OfferingId == offering.Id
                                                                                     select distribution.PaymentAmount).Sum(),
                                                                    EM = (from investment in contextData.Investment
                                                                          join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                                                                          where investment.OfferingId == offering.Id
                                                                          select distribution.PaymentAmount).Sum() / (from investment in contextData.Investment
                                                                                                                      where investment.OfferingId == offering.Id
                                                                                                                      select investment.Amount).Sum(),
                                                                    Status = (from offeringStatus in contextData.OfferingStatus
                                                                              where offeringStatus.Id == offering.Status
                                                                              select offeringStatus.Name).FirstOrDefault()
                                                                }
                                                                ).Distinct().ToList();
                        accountStatement.DistributionsSummaries = (from offering in contextData.PortfolioOffering
                                                                where offerings.Contains(offering.Id)                                                                                                                          
                                                                select new DistributionsSummaryDto
                                                                {
                                                                   OfferingName = offering.Name,
                                                                   EntityName = offering.EntityName,
                                                                   Funded = (from investment in contextData.Investment
                                                                             join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                                                                             where investment.OfferingId == offering.Id
                                                                             select investment.Amount).Sum(), 
                                                                   InvestmentBalance = 0,//To do
                                                                   OperatingIncome = (from investment in contextData.Investment 
                                                                                      join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId                                                                                       
                                                                                      where investment.OfferingId == offering.Id
                                                                                      && distribution.Type == 1 //Operating Income
                                                                                      select distribution.PaymentAmount).Sum() +
                                                                                      (from investment in contextData.Investment
                                                                                       join distribution in contextData.Distributions on investment.UserId equals distribution.InvestorId
                                                                                       where investment.OfferingId == offering.Id
                                                                                       && distribution.InvestmentId == null
                                                                                       && distribution.Type == 1 //Operating Income
                                                                                       select distribution.PaymentAmount).Sum(),
                                                                   GainOnSale = (from investment in contextData.Investment
                                                                                  join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                                                                                  where investment.OfferingId == offering.Id
                                                                                  && distribution.Type == 4 //GainOnSale
                                                                                 select distribution.PaymentAmount).Sum() +
                                                                                      (from investment in contextData.Investment
                                                                                       join distribution in contextData.Distributions on investment.UserId equals distribution.InvestorId
                                                                                       where investment.OfferingId == offering.Id
                                                                                       && distribution.InvestmentId == null
                                                                                       && distribution.Type == 4 //GainOnSale
                                                                                       select distribution.PaymentAmount).Sum(),
                                                                   RefinanceProceeds = (from investment in contextData.Investment
                                                                                        join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                                                                                        where investment.OfferingId == offering.Id
                                                                                        && distribution.Type == 5 //Refinance Proceeds
                                                                                        select distribution.PaymentAmount).Sum() +
                                                                                      (from investment in contextData.Investment
                                                                                       join distribution in contextData.Distributions on investment.UserId equals distribution.InvestorId
                                                                                       where investment.OfferingId == offering.Id
                                                                                       && distribution.InvestmentId == null
                                                                                        && distribution.Type == 5 //Refinance Proceeds
                                                                                       select distribution.PaymentAmount).Sum(),
                                                                   ReturnOfCapital = (from investment in contextData.Investment
                                                                                        join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                                                                                        where investment.OfferingId == offering.Id
                                                                                        && distribution.Type == 3 //Return Of Capital
                                                                                      select distribution.PaymentAmount).Sum() +
                                                                                      (from investment in contextData.Investment
                                                                                       join distribution in contextData.Distributions on investment.UserId equals distribution.InvestorId
                                                                                       where investment.OfferingId == offering.Id
                                                                                       && distribution.InvestmentId == null
                                                                                       && distribution.Type == 3 //Return Of Capital
                                                                                       select distribution.PaymentAmount).Sum(),
                                                                    PreferredReturn = (from investment in contextData.Investment
                                                                                       join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                                                                                       where investment.OfferingId == offering.Id
                                                                                       && distribution.Type == 6 //Preferred Return
                                                                                       select distribution.PaymentAmount).Sum() +
                                                                                      (from investment in contextData.Investment
                                                                                       join distribution in contextData.Distributions on investment.UserId equals distribution.InvestorId
                                                                                       where investment.OfferingId == offering.Id
                                                                                       && distribution.InvestmentId == null
                                                                                       && distribution.Type == 6 //Preferred Return
                                                                                       select distribution.PaymentAmount).Sum(),
                                                                    Interest = (from investment in contextData.Investment
                                                                                join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                                                                                where investment.OfferingId == offering.Id
                                                                                && distribution.Type == 7 //Interest
                                                                                select distribution.PaymentAmount).Sum() +
                                                                                (from investment in contextData.Investment
                                                                                join distribution in contextData.Distributions on investment.UserId equals distribution.InvestorId
                                                                                where investment.OfferingId == offering.Id
                                                                                && distribution.InvestmentId == null
                                                                                && distribution.Type == 7 //Interest
                                                                                select distribution.PaymentAmount).Sum()
                                                                }
                                                               ).Distinct().ToList();
                    }
                    return accountStatement;
                }
                else return null;
            }
            catch(Exception e)
            {
                e.ToString();
                return null;
            }           
        }

        public async Task<AccountStatementPDFDto> AccountStatementPDF(AccountStatementPDFDto accountStatementPDFDto)
        {
            try
            {
                var Account = GetAccountStatement(accountStatementPDFDto.InvestorId);
                AccountStatementPDFDto accountStatementpdfDto = new AccountStatementPDFDto();
                #region "pdf building"

                StringBuilder sb = new StringBuilder();
                sb.Append("<html><head><title>");
                sb.Append("Account Statement");
                sb.Append("</title></head><body>");
                sb.Append("<div>");

                sb.Append("<div>" + Account.CredorContact.PhoneNumber + "</div>");
                sb.Append("<div>" + Account.CredorContact.EmailId + "</div>");
                sb.Append("<div>" + Account.CredorContact.WebsiteUrl + "</div>");
                sb.Append("<h3>A C C O U N T S T A T E M E N T</h3>");
                sb.Append("<div>" + Account.InvestorName + "</div>");
                sb.Append("<div>TOTAL INVESTED : " + string.Format("$ {0:n0}", Account.TotalInvested) + "</div>");
                sb.Append("<div>STATEMENT DATE : " + Account.StatementDate.ToString("MM/dd/yyyy") + "</div><br>");
                sb.Append("<div><img width='700px' height='300px' alt = '' src = '@" + accountStatementPDFDto.Imagesource + "'/>" + "</div><br>");
                sb.Append("<h3>INVESTMENT OVERVIEW</h3>");
                if (Account.InvestmentOverviews.Count > 0)
                {
                    sb.Append("<div><table><thead><tr>");
                    sb.Append("<th>Offerings</th>");
                    sb.Append("<th>Date</th>");
                    sb.Append("<th>Investment</th>");
                    sb.Append("<th>Funded</th>");
                    sb.Append("<th>Distributions</th>");
                    sb.Append("<th>EM</th>");
                    sb.Append("<th>Status</th>");
                    sb.Append("</tr></thead><tbody>");
                    decimal TotalInvestmentAmount = 0;
                    decimal TotalFundedAmount = 0;
                    decimal TotalDistributions = 0;
                    for (int i = 1; i <= Account.InvestmentOverviews.Count; i++)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + Account.InvestmentOverviews[i - 1].OfferingName + "</td>");
                        sb.Append("<td>" + Account.InvestmentOverviews[i - 1].Date.Value.ToString("MM/dd/yyyy") + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.InvestmentOverviews[i - 1].InvestmentAmount) + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.InvestmentOverviews[i - 1].FundedAmount) + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.InvestmentOverviews[i - 1].Distributions) + "</td>");
                        sb.Append("<td>" + Account.InvestmentOverviews[i - 1].EM.ToString() + "</td>");
                        sb.Append("<td>" + Account.InvestmentOverviews[i - 1].Status.ToString() + "</td>");
                        sb.Append("</tr>");
                        TotalInvestmentAmount = TotalInvestmentAmount + Account.InvestmentOverviews[i - 1].InvestmentAmount;
                        TotalFundedAmount = TotalFundedAmount + Account.InvestmentOverviews[i - 1].FundedAmount;
                        TotalDistributions = TotalDistributions + Account.InvestmentOverviews[i - 1].Distributions;
                    }
                    sb.Append("<tr>");
                    sb.Append("<td></td>");
                    sb.Append("<td> Total</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalInvestmentAmount) + "</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalFundedAmount) + "</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalDistributions) + "</td>");
                    sb.Append("<td></td>");
                    sb.Append("<td></td>");
                    sb.Append("</tr>");
                    sb.Append("</tbody></table></div>");
                }
                sb.Append("<h3>DISTRIBUTION SUMMARY</h3>");
                if (Account.DistributionsSummaries.Count > 0)
                {
                    sb.Append("<div><table><thead><tr>");
                    sb.Append("<th>Offerings</th>");
                    sb.Append("<th>Funded</th>");
                    sb.Append("<th>Operating Income</th>");
                    sb.Append("<th>Gain on Sale</th>");
                    sb.Append("<th>Refinance Proceeds</th>");
                    sb.Append("<th>Return of Capital</th>");
                    sb.Append("<th>Preferred Return</th>");
                    sb.Append("<th>Interest</th>");
                    sb.Append("<th>Investment Balance</th>");
                    sb.Append("</tr></thead><tbody>");
                    decimal TotalFunded = 0;
                    decimal TotalOperatingIncome = 0;
                    decimal TotalGainOnSale = 0;
                    decimal TotalRefinanceProceeds = 0;
                    decimal TotalReturnOfCapital = 0;
                    decimal TotalPreferredReturn = 0;
                    decimal TotalInterest = 0;
                    decimal TotalInvestmentBalance = 0;
                    for (int i = 1; i <= Account.DistributionsSummaries.Count; i++)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + Account.DistributionsSummaries[i - 1].OfferingName + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.DistributionsSummaries[i - 1].Funded) + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.DistributionsSummaries[i - 1].OperatingIncome) + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.DistributionsSummaries[i - 1].GainOnSale) + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.DistributionsSummaries[i - 1].RefinanceProceeds) + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.DistributionsSummaries[i - 1].ReturnOfCapital) + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.DistributionsSummaries[i - 1].PreferredReturn) + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.DistributionsSummaries[i - 1].Interest) + "</td>");
                        sb.Append("<td>" + string.Format("$ {0:n0}", Account.DistributionsSummaries[i - 1].InvestmentBalance) + "</td>");
                        sb.Append("</tr>");
                        TotalFunded = TotalFunded + Account.DistributionsSummaries[i - 1].Funded;
                        TotalOperatingIncome = TotalOperatingIncome + Account.DistributionsSummaries[i - 1].OperatingIncome;
                        TotalGainOnSale = TotalGainOnSale + Account.DistributionsSummaries[i - 1].GainOnSale;
                        TotalRefinanceProceeds = TotalRefinanceProceeds + Account.DistributionsSummaries[i - 1].RefinanceProceeds;
                        TotalReturnOfCapital = TotalReturnOfCapital + Account.DistributionsSummaries[i - 1].ReturnOfCapital;
                        TotalPreferredReturn = TotalPreferredReturn + Account.DistributionsSummaries[i - 1].PreferredReturn;
                        TotalInterest = TotalInterest + Account.DistributionsSummaries[i - 1].Interest;
                        TotalInvestmentBalance = TotalInvestmentBalance + Account.DistributionsSummaries[i - 1].InvestmentBalance;
                    }
                    sb.Append("<tr>");
                    sb.Append("<td> Total</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalFunded) + "</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalOperatingIncome) + "</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalGainOnSale) + "</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalRefinanceProceeds) + "</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalReturnOfCapital) + "</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalPreferredReturn) + "</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalInterest) + "</td>");
                    sb.Append("<td>" + string.Format("$ {0:n0}", TotalInvestmentBalance) + "</td>");
                    sb.Append("</tr>");
                    sb.Append("</tbody></table></div>");
                }                
                sb.Append("</div></body></html>");

                Helper _helper = new Helper(_configuration);
                
                StringReader sr = new StringReader(sb.ToString());
                MemoryStream memoryStream = new MemoryStream();                
                HtmlConverter.ConvertToPdf(sb.ToString(), memoryStream);
                byte[] bytes = memoryStream.ToArray();
                var stream = new MemoryStream(bytes);
                IFormFile file = new FormFile(stream, 0, bytes.Length, "AccountStatement", "AccountStatement_" + accountStatementPDFDto.InvestorId + ".pdf");
                var filePath = (await _helper.DocumentSaveAndUpload(file, accountStatementPDFDto.InvestorId, 10)).ToString();
                accountStatementpdfDto.AccountStatement = filePath;                
                #endregion
                return accountStatementpdfDto;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
        }
    }
}
