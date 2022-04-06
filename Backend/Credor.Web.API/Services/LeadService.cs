using Credor.Web.API.Common.UnitOfWork;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Client.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Credor.Data.Entities;
using System.Net.Mail;
using Credor.Web.API.Shared;
using LumenWorks.Framework.IO.Csv;
using System.IO;
using System.Data;

namespace Credor.Web.API
{
    public class LeadService : ILeadService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly ILeadRepository _leadRepository;

        public IConfiguration _configuration { get; }
        public LeadService(ILeadRepository leadRepository, IConfiguration configuration)
        {
            _leadRepository = leadRepository;
            _unitOfWork = new UnitOfWork(configuration);
            _configuration = configuration;
        }
        public UserAccountDto GetUserAccount(int leadId)
        {
            return _leadRepository.GetUserAccount(leadId);
        }

        public UserAccountDto GetUserAccountDetails(int UserId)
        {
            return _leadRepository.GetUserAccountDetails(UserId);
        }
        public List<UserAccountDto> GetAllLeadAccounts()
        {
            return _leadRepository.GetAllLeadAccounts();
        }
        public int DeleteLeadAccount(int adminuserId, int leadId)
        {
            return _leadRepository.DeleteLeadAccount(adminuserId, leadId);
        }
        public int DeleteLeads(DeleteUserAccountDto deleteUserAccountDto)
        {
            return _leadRepository.DeleteLeads(deleteUserAccountDto);
        }
        public int UpdateLeadAccount(UserAccountDto userAccountDto)
        {
            return _leadRepository.UpdateLeadAccount(userAccountDto);
        }
        public bool AddLeadAccount(UserAccountDto userAccountDto)
        {
            var result = _leadRepository.AddLeadAccount(userAccountDto);
            if (result)
            {
                if(userAccountDto.SendConfirmMail)
                {
                    try
                    {
                        var env = _configuration["environment"];
                        string mailAddress = _configuration["MailAddress"];
                        string mailDisplayName = _configuration["MailDisplayName"];
                        var emailTemplate = _unitOfWork.CredorEmailTemplateRepository.GetWithInclude(x => x.TemplateName.ToLower() == "JoinInvite".ToLower()).FirstOrDefault();
                    }
                    catch(Exception e)
                    {
                        e.ToString();
                    }
                    return true;
                }
                else
                    return result;
            }
            else
                return result;
        }

        public bool BulkLeadSaveAccount(IFormFileCollection files)
        {
            try
            {
                             
                foreach(var file in files)
                {
                    var result = new StringBuilder();
                    List<CSVUserAccountListModel> csvValues = new List<CSVUserAccountListModel>();
                    using (var reader = new StreamReader(file.OpenReadStream()))
                    {
                        while (reader.Peek() >= 0)
                        {
                            var text = reader.ReadLine();
                            result.AppendLine(text);
                            var v = CSVUserAccountListModel.FromCsv(text);
                            csvValues.Add(v);
                        }

                    }
                        //var ranges = GetCapacityRanges();
                        var stateOrProvincelist = GetStateOrProvinceList();
                    for(int i=1; i < csvValues.Count; i++)
                    {
                        var firstName = csvValues[i].FirstName;
                        var lastName = csvValues[i].LastName;
                        var nickName = csvValues[i].NickName;
                        var email = csvValues[i].Email;
                        var country = csvValues[i].Country;
                        var phoneNumber = csvValues[i].PhoneNumber;
                        var isAccreditedInvestor = csvValues[i].IsAccreditedInvestor;                       
                        var status = csvValues[i].Status;
                        var residency = csvValues[i].Residency;
                        var capacity = csvValues[i].Capacity;
                        var heardFrom = csvValues[i].HeardFrom;
                        var newInvestmentAnnouncements = csvValues[i].NewInvestmentAnnouncements;

                        UserAccountDto userAccountDto = new UserAccountDto();
                        userAccountDto.FirstName = firstName;
                        userAccountDto.LastName = lastName;
                        userAccountDto.NickName = nickName;
                        userAccountDto.EmailId = email;
                        userAccountDto.Country = country;
                        userAccountDto.PhoneNumber = phoneNumber;
                        userAccountDto.IsAccreditedInvestor = bool.Parse(isAccreditedInvestor);
                        userAccountDto.Status = Int32.Parse(status);
                        var state = 0;
                        for (int j=0;j<stateOrProvincelist.Count;j++)
                        {
                            if (residency == stateOrProvincelist[j].Name)
                            {
                                state = stateOrProvincelist[j].Id;
                            }
                        }
                        userAccountDto.Residency = state;
                        userAccountDto.Capacity = Int32.Parse(capacity);
                        userAccountDto.HeardFrom = heardFrom;
                        userAccountDto.Active = true;
                        userAccountDto.NewInvestmentAnnouncements = bool.Parse(newInvestmentAnnouncements);

                        var result1 = _leadRepository.AddLeadAccount(userAccountDto);
                    }
                    return true;
                }
                              

                return true;
            }
            catch(Exception ex)
            {
                ex.Message.ToString();
                return false;
            }
            
        }

        public List<StateOrProvince> GetStateOrProvinceList()
        {
            try
            {
                var result = _unitOfWork.StateOrProvinceRepository.GetAll().ToList();
                return result;
            }
            catch
            {
                return null;
            }
        }
        public List<UserAccountDto> AddLeadAccounts(IFormFile bulkInsertFile)
        {
            return _leadRepository.AddLeadAccounts(bulkInsertFile);
        }
        public LeadSummary GetLeadSummary()
        {
            return _leadRepository.GetLeadSummary();
        }
        public bool AddLeadNotes(UserNotesDto notes)
        {
            return _leadRepository.AddLeadNotes(notes);
        }
        public bool UpdateLeadNotes(UserNotesDto notes)
        {
            return _leadRepository.UpdateLeadNotes(notes);
        }
        public bool DeleteLeadNotes(int adminuserId, int leadid)
        {
            return _leadRepository.DeleteLeadNotes(adminuserId, leadid);
        }
        public List<UserNotesDto> GetLeadNotes(int leadid)
        {
            return _leadRepository.GetLeadNotes(leadid);
        }
        public async Task<bool> ResendInvites(int adminuserid)
        {
            try
            {
                var unRegisteredAccounts = _leadRepository.GetUnRegisteredLeadAccounts();
                if (unRegisteredAccounts != null)
                {
                    var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == adminuserid && x.Active == true && x.RoleId == 3);//Active admin user
                    if (adminAccount != null)
                    {
                        var env = _configuration["environment"];
                        string mailAddress = _configuration["MailAddress"];
                        string mailDisplayName = _configuration["MailDisplayName"];                       
                        var emailTemplate = _unitOfWork.CredorEmailTemplateRepository.GetWithInclude(x => x.TemplateName.ToLower() == "JoinInvite".ToLower()).FirstOrDefault();                        

                        foreach (UserAccountDto user in unRegisteredAccounts)
                        {
                            var userAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == user.Id && x.Active == true);
                            if (userAccount != null)
                            {
                                var token = "";
                                token = await GenerateJSONWebToken(userAccount, _configuration);
                                MailMessage mail = new MailMessage();
                                string SmtpClientName = _configuration["SmtpClientName"];
                                SmtpClient smtpserver = new SmtpClient("SmtpClientName");
                                mail.From = new MailAddress(mailAddress, mailDisplayName);
                                mail.To.Add(userAccount.EmailId);
                                mail.Subject = emailTemplate.Subject;

                                StringBuilder msgBody = new StringBuilder(emailTemplate.BodyContent);

                                msgBody.Replace("{{NewUserName}}", userAccount.FirstName + " " + userAccount.LastName);
                                msgBody.Replace("{{CurrentUserName}}", adminAccount.FirstName + " " + adminAccount.LastName);
                                msgBody.Replace("{{SignUpURL}}", "<a href=" + env + "signup/" + userAccount.Id + "?token=" + token + "/> Click Here to Sign-Up");
                                mail.Body = msgBody.ToString();
                                Helper _helper = new Helper(_configuration);
                                var result = _helper.MailSend(mail, smtpserver);
                                if (!result) return false;
                            }
                        }
                        return true;
                    }
                    else
                        return false;
                }
                else
                    return true;
            }
            catch (Exception e)
            {
                e.ToString();
                return false;
            }
        }
        public async Task<bool> ResendInviteMultipleLeads(ResendInviteDto resendInviteDto)
        {
            try
            {
                if (resendInviteDto.Ids != null && resendInviteDto.Ids.Count == 1)
                {
                    return await ResendInvite(resendInviteDto.AdminUserId, resendInviteDto.Ids.ElementAt(0));
                }
                if (resendInviteDto.Ids != null && resendInviteDto.Ids.Count > 1)
                {
                    var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == resendInviteDto.AdminUserId && x.Active == true && x.RoleId == 3);//Active admin user
                    if (adminAccount != null)
                    {
                        var env = _configuration["environment"];
                        string mailAddress = _configuration["MailAddress"];
                        string mailDisplayName = _configuration["MailDisplayName"];
                        var emailTemplate = _unitOfWork.CredorEmailTemplateRepository.GetWithInclude(x => x.TemplateName.ToLower() == "JoinInvite".ToLower()).FirstOrDefault();

                        foreach (int leadId in resendInviteDto.Ids)
                        {
                            var userAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == leadId && x.Active == true);
                            if (userAccount != null)
                            {
                                var token = "";
                                token = await GenerateJSONWebToken(userAccount, _configuration);
                                MailMessage mail = new MailMessage();
                                string SmtpClientName = _configuration["SmtpClientName"];
                                SmtpClient smtpserver = new SmtpClient("SmtpClientName");
                                mail.From = new MailAddress(mailAddress, mailDisplayName);
                                mail.To.Add(userAccount.EmailId);
                                mail.Subject = emailTemplate.Subject;

                                StringBuilder msgBody = new StringBuilder(emailTemplate.BodyContent);

                                msgBody.Replace("{{NewUserName}}", userAccount.FirstName + " " + userAccount.LastName);
                                msgBody.Replace("{{CurrentUserName}}", adminAccount.FirstName + " " + adminAccount.LastName);
                                msgBody.Replace("{{SignUpURL}}", "<a href=" + env + "signup/" + userAccount.Id + "?token=" + token + "/> Click Here to Sign-Up");
                                mail.Body = msgBody.ToString();
                                Helper _helper = new Helper(_configuration);
                                var result = _helper.MailSend(mail, smtpserver);
                                if (!result) return false;
                            }
                        }
                        return true;
                    }
                    else
                        return false;
                }
                else
                    return true;
            }
            catch (Exception e)
            {
                e.ToString();
                return false;
            }
        }
        public async Task<string> GenerateJSONWebToken(UserAccount userAccount, IConfiguration configuration)
        {
            try
            {
                SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                SignUpUserTokenModelDto signUpDetails = new SignUpUserTokenModelDto();
                signUpDetails.FirstName = userAccount.FirstName;
                signUpDetails.LastName = userAccount.LastName;
                signUpDetails.EmailId = userAccount.EmailId;
                signUpDetails.NickName = userAccount.NickName;
                signUpDetails.RoleId = 2;// Lead                
                signUpDetails.UserId = userAccount.Id;
                var UserClaims = new Claim[]
                          {
                            new Claim(JwtRegisteredClaimNames.Sub, signUpDetails.EmailId),
                            new Claim("FirstName", signUpDetails.FirstName),
                            new Claim("LastName", signUpDetails.LastName),
                            new Claim("RoleId",  signUpDetails.RoleId.ToString()),                            
                            new Claim("EmailId",signUpDetails.EmailId),
                            new Claim("Id", signUpDetails.UserId.ToString()),
                            new Claim(JwtRegisteredClaimNames.Jti, Convert.ToString(Guid.NewGuid()))
                          };

                JwtSecurityToken token = new JwtSecurityToken(_configuration["Jwt:Issuer"],
                       _configuration["Jwt:Issuer"],
                       UserClaims,
                       signingCredentials: credentials);

                return await Task.FromResult<string>(new JwtSecurityTokenHandler().WriteToken(token));
            }
            catch (Exception)
            {
                return null;
            }
        }
        public async Task<bool> ResendInvite(int adminuserid, int leadid)
        {
            try
            {
                var adminAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == adminuserid && x.Active == true && x.RoleId == 3);//Active admin user
                if (adminAccount != null)
                {
                    var env = _configuration["environment"];
                    string mailAddress = _configuration["MailAddress"];
                    string mailDisplayName = _configuration["MailDisplayName"];                    
                    var userAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == leadid && x.Active == true && x.RoleId == 2); //Active Lead user
                    if (userAccount != null)
                        {
                            var token = "";
                            token = await GenerateJSONWebToken(userAccount, _configuration);
                            var emailTemplate = _unitOfWork.CredorEmailTemplateRepository.GetWithInclude(x => x.TemplateName.ToLower() == "JoinInvite".ToLower()).FirstOrDefault();

                            MailMessage mail = new MailMessage();
                            string SmtpClientName = _configuration["SmtpClientName"];
                            SmtpClient smtpserver = new SmtpClient("SmtpClientName");
                            mail.From = new MailAddress(mailAddress, mailDisplayName);
                            mail.To.Add(userAccount.EmailId);
                            mail.Subject = emailTemplate.Subject;

                            StringBuilder msgBody = new StringBuilder(emailTemplate.BodyContent);

                            msgBody.Replace("{{NewUserName}}", userAccount.FirstName + " " + userAccount.LastName);
                            msgBody.Replace("{{CurrentUserName}}", adminAccount.FirstName + " " + adminAccount.LastName);
                            msgBody.Replace("{{SignUpURL}}", "<a href=" + env + "signup/" + userAccount.Id + "?token=" + token + "/> Click Here to Sign-Up");
                            mail.Body = msgBody.ToString();
                            Helper _helper = new Helper(_configuration);
                            var result = _helper.MailSend(mail, smtpserver);
                            if (!result) return false;
                        }                    
                    return true;
                }
                else
                    return false;
            }
            catch(Exception e)
            {
                e.ToString();
                return false;
            }           
        }
        public bool AddLeadTags(TagDto tag)
        {
            return _leadRepository.AddLeadTags(tag);
        }
        public bool UpdateLeadTags(TagDto tag)
        {
            return _leadRepository.UpdateLeadTags(tag);
        }
        public bool DeleteLeadTags(int adminUserId, int tagId)
        {
            return _leadRepository.DeleteLeadTags(adminUserId, tagId);
        }
        public List<TagDto> GetLeadTags(int adminUserId)
        {
            return _leadRepository.GetLeadTags(adminUserId);
        }
    }
}
