using Credor.Client.Entities;
using Credor.Web.API.Common.UnitOfWork;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Data.Entities;

namespace Credor.Web.API
{
    public class EmailRepository : IEmailRepository
    {
        private readonly UnitOfWork _unitOfWork;
        public EmailRepository(IConfiguration configuration)
        {
            _unitOfWork = new UnitOfWork(configuration);
        }
        public List<CredorDomainDto> GetCredorDomains()
        {
            List<CredorDomainDto> domains = new List<CredorDomainDto>();
            var contextData = _unitOfWork.CredorDomainRepository.Context;
            try
            {
                domains = (from domain in contextData.CredorDomain
                           where domain.Active == true
                           select new CredorDomainDto
                           {
                               Id = domain.Id,
                               Name = domain.Name,
                               Active = domain.Active,
                               Status = domain.Status,
                               CreatedOn = domain.CreatedOn,
                               CreatedBy = domain.CreatedBy,
                               ModifiedBy = domain.ModifiedBy,
                               ModifiedOn = domain.ModifiedOn
                           }).OrderByDescending(x => x.CreatedOn).ToList();
            }
            catch (Exception e)
            {
                e.ToString();
                return domains;
            }
            finally
            {
                contextData = null;
            }
            return domains;
        }
        public List<CredorDomainDto> AddCredorDomain(CredorDomainDto credorDomainDto)
        {
            var contextData = _unitOfWork.CredorDomainRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.CredorDomainRepository.Context.Database.BeginTransaction())
                {
                    CredorDomain credorDomain = new CredorDomain();
                    credorDomain.Name = credorDomainDto.Name;
                    credorDomain.Active = true;
                    credorDomain.Status = 1;   // Un-Verified               
                    credorDomain.CreatedBy = credorDomainDto.AdminUserId.ToString();
                    credorDomain.CreatedOn = DateTime.Now;

                    _unitOfWork.CredorDomainRepository.Insert(credorDomain);
                    contextData.SaveChanges();
                    transaction.Commit();

                    var credorDomains = (from domain in contextData.CredorDomain
                                         where domain.Active == true
                                         select new CredorDomainDto
                                         {
                                             Id = domain.Id,
                                             Name = domain.Name,
                                             Active = domain.Active,
                                             Status = domain.Status,
                                             CreatedOn = domain.CreatedOn,
                                             CreatedBy = domain.CreatedBy,
                                             ModifiedBy = domain.ModifiedBy,
                                             ModifiedOn = domain.ModifiedOn
                                         }).OrderByDescending(x => x.CreatedOn).ToList();
                    return credorDomains;
                }
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<CredorDomainDto> UpdateCredorDomain(CredorDomainDto credorDomainDto)
        {
            var contextData = _unitOfWork.CredorDomainRepository.Context;
            try
            {
                var credorDomain = _unitOfWork.CredorDomainRepository.GetByID(credorDomainDto.Id);
                if (credorDomain != null)
                {
                    using (var transaction = _unitOfWork.CredorDomainRepository.Context.Database.BeginTransaction())
                    {
                        credorDomain.Name = credorDomainDto.Name;
                        credorDomain.Status = credorDomainDto.Status;
                        credorDomain.ModifiedBy = credorDomainDto.AdminUserId.ToString();
                        credorDomain.ModifiedOn = DateTime.Now;

                        _unitOfWork.CredorDomainRepository.Update(credorDomain);
                        contextData.SaveChanges();
                        transaction.Commit();

                        var credorDomains = (from domain in contextData.CredorDomain
                                             where domain.Active == true
                                             select new CredorDomainDto
                                             {
                                                 Id = domain.Id,
                                                 Name = domain.Name,
                                                 Active = domain.Active,
                                                 Status = domain.Status,
                                                 CreatedOn = domain.CreatedOn,
                                                 CreatedBy = domain.CreatedBy,
                                                 ModifiedBy = domain.ModifiedBy,
                                                 ModifiedOn = domain.ModifiedOn
                                             }).OrderByDescending(x => x.CreatedOn).ToList();
                        return credorDomains;
                    }
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<CredorDomainDto> DeleteCredorDomain(int domainId, int adminUserId)
        {
            var contextData = _unitOfWork.CredorDomainRepository.Context;
            try
            {
                var credorDomain = _unitOfWork.CredorDomainRepository.GetByID(domainId);
                if (credorDomain != null)
                {
                    using (var transaction = _unitOfWork.CredorDomainRepository.Context.Database.BeginTransaction())
                    {
                        credorDomain.Active = false;
                        credorDomain.ModifiedBy = adminUserId.ToString();
                        credorDomain.ModifiedOn = DateTime.Now;

                        _unitOfWork.CredorDomainRepository.Update(credorDomain);
                        contextData.SaveChanges();
                        transaction.Commit();

                        var credorDomains = (from domain in contextData.CredorDomain
                                             where domain.Active == true
                                             select new CredorDomainDto
                                             {
                                                 Id = domain.Id,
                                                 Name = domain.Name,
                                                 Active = domain.Active,
                                                 Status = domain.Status,
                                                 CreatedOn = domain.CreatedOn,
                                                 CreatedBy = domain.CreatedBy,
                                                 ModifiedBy = domain.ModifiedBy,
                                                 ModifiedOn = domain.ModifiedOn
                                             }).OrderByDescending(x => x.CreatedOn).ToList();
                        return credorDomains;
                    }
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<CredorFromEmailAddressDto> GetCredorFromEmailAddresses()
        {
            List<CredorFromEmailAddressDto> CredorFromEmailAddresses = new List<CredorFromEmailAddressDto>();
            var contextData = _unitOfWork.CredorFromEmailAddressRepository.Context;
            try
            {
                CredorFromEmailAddresses = (from emailAddress in contextData.CredorFromEmailAddress
                                            where emailAddress.Active == true
                                            select new CredorFromEmailAddressDto
                                            {
                                                Id = emailAddress.Id,
                                                FromName = emailAddress.FromName,
                                                EmailId = emailAddress.EmailId,
                                                DomainId = emailAddress.DomainId,
                                                CreatedOn = emailAddress.CreatedOn,
                                                CreatedBy = emailAddress.CreatedBy,
                                                ModifiedOn = emailAddress.ModifiedOn,
                                                ModifiedBy = emailAddress.ModifiedBy
                                            }).OrderByDescending(x => x.CreatedOn).ToList();
            }
            catch (Exception e)
            {
                e.ToString();
                return CredorFromEmailAddresses;
            }
            finally
            {
                contextData = null;
            }
            return CredorFromEmailAddresses;
        }
        public List<CredorFromEmailAddressDto> AddCredorFromEmailAddress(CredorFromEmailAddressDto credorFromEmailAddressDto)
        {
            var contextData = _unitOfWork.CredorFromEmailAddressRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.CredorFromEmailAddressRepository.Context.Database.BeginTransaction())
                {
                    CredorFromEmailAddress credorFromEmailAddress = new CredorFromEmailAddress();
                    credorFromEmailAddress.DomainId = credorFromEmailAddressDto.DomainId;
                    credorFromEmailAddress.FromName = credorFromEmailAddressDto.FromName;
                    credorFromEmailAddress.EmailId = credorFromEmailAddressDto.EmailId;
                    credorFromEmailAddress.Active = true;
                    credorFromEmailAddress.Status = 1;   // Un-Verified               
                    credorFromEmailAddress.CreatedBy = credorFromEmailAddressDto.AdminUserId.ToString();
                    credorFromEmailAddress.CreatedOn = DateTime.Now;

                    _unitOfWork.CredorFromEmailAddressRepository.Insert(credorFromEmailAddress);
                    contextData.SaveChanges();
                    transaction.Commit();

                    var credorFromEmailAddresses = (from emailAddress in contextData.CredorFromEmailAddress
                                                    where emailAddress.Active == true
                                                    select new CredorFromEmailAddressDto
                                                    {
                                                        Id = emailAddress.Id,
                                                        FromName = emailAddress.FromName,
                                                        EmailId = emailAddress.EmailId,
                                                        CreatedOn = emailAddress.CreatedOn,
                                                        CreatedBy = emailAddress.CreatedBy,
                                                        ModifiedOn = emailAddress.ModifiedOn,
                                                        ModifiedBy = emailAddress.ModifiedBy
                                                    }).OrderByDescending(x => x.CreatedOn).ToList();
                    return credorFromEmailAddresses;
                }
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<CredorFromEmailAddressDto> UpdateCredorFromEmailAddress(CredorFromEmailAddressDto credorFromEmailAddressDto)
        {
            var contextData = _unitOfWork.CredorFromEmailAddressRepository.Context;
            try
            {
                var credorFromEmailAddress = _unitOfWork.CredorFromEmailAddressRepository.GetByID(credorFromEmailAddressDto.Id);
                if (credorFromEmailAddress != null)
                {
                    using (var transaction = _unitOfWork.CredorFromEmailAddressRepository.Context.Database.BeginTransaction())
                    {
                        credorFromEmailAddress.FromName = credorFromEmailAddressDto.FromName;
                        credorFromEmailAddress.DomainId = credorFromEmailAddressDto.DomainId;
                        credorFromEmailAddress.EmailId = credorFromEmailAddressDto.EmailId;
                        credorFromEmailAddress.Status = credorFromEmailAddressDto.Status;
                        credorFromEmailAddress.ModifiedBy = credorFromEmailAddressDto.AdminUserId.ToString();
                        credorFromEmailAddress.ModifiedOn = DateTime.Now;

                        _unitOfWork.CredorFromEmailAddressRepository.Update(credorFromEmailAddress);
                        contextData.SaveChanges();
                        transaction.Commit();

                        var credorFromEmailAddresses = (from emailAddress in contextData.CredorFromEmailAddress
                                                        where emailAddress.Active == true
                                                        select new CredorFromEmailAddressDto
                                                        {
                                                            Id = emailAddress.Id,
                                                            FromName = emailAddress.FromName,
                                                            EmailId = emailAddress.EmailId,
                                                            CreatedOn = emailAddress.CreatedOn,
                                                            CreatedBy = emailAddress.CreatedBy,
                                                            ModifiedOn = emailAddress.ModifiedOn,
                                                            ModifiedBy = emailAddress.ModifiedBy
                                                        }).OrderByDescending(x => x.CreatedOn).ToList();
                        return credorFromEmailAddresses;
                    }
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<CredorFromEmailAddressDto> DeleteCredorFromEmailAddress(int fromEmailAddressId, int adminUserId)
        {
            var contextData = _unitOfWork.CredorFromEmailAddressRepository.Context;
            try
            {
                var credorFromEmailAddress = _unitOfWork.CredorFromEmailAddressRepository.GetByID(fromEmailAddressId);
                if (credorFromEmailAddress != null)
                {
                    using (var transaction = _unitOfWork.CredorFromEmailAddressRepository.Context.Database.BeginTransaction())
                    {
                        credorFromEmailAddress.Active = false;
                        credorFromEmailAddress.ModifiedBy = adminUserId.ToString();
                        credorFromEmailAddress.ModifiedOn = DateTime.Now;

                        _unitOfWork.CredorFromEmailAddressRepository.Update(credorFromEmailAddress);
                        contextData.SaveChanges();
                        transaction.Commit();

                        var credorFromEmailAddresses = (from emailAddress in contextData.CredorFromEmailAddress
                                                        where emailAddress.Active == true
                                                        select new CredorFromEmailAddressDto
                                                        {
                                                            Id = emailAddress.Id,
                                                            FromName = emailAddress.FromName,
                                                            EmailId = emailAddress.EmailId,
                                                            CreatedOn = emailAddress.CreatedOn,
                                                            CreatedBy = emailAddress.CreatedBy,
                                                            ModifiedOn = emailAddress.ModifiedOn,
                                                            ModifiedBy = emailAddress.ModifiedBy
                                                        }).OrderByDescending(x => x.CreatedOn).ToList();
                        return credorFromEmailAddresses;
                    }
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<EmailTemplateDto> GetEmailTemplates()
        {
            List<EmailTemplateDto> emailTemplates = new List<EmailTemplateDto>();
            var contextData = _unitOfWork.EmailTemplateRepository.Context;
            try
            {
                emailTemplates = (from emailTemplate in contextData.EmailTemplate
                                  where emailTemplate.Active == true
                                  select new EmailTemplateDto
                                  {
                                      Id = emailTemplate.Id,
                                      Name = emailTemplate.Name,
                                      Template = emailTemplate.Template,
                                      Design = emailTemplate.Design,
                                      IsDefault = emailTemplate.IsDefault,
                                      Active = emailTemplate.Active,
                                      Status = emailTemplate.Status,
                                      CreatedOn = emailTemplate.CreatedOn,
                                      CreatedBy = emailTemplate.CreatedBy,
                                      ModifiedBy = emailTemplate.ModifiedBy,
                                      ModifiedOn = emailTemplate.ModifiedOn
                                  }).OrderByDescending(x => x.CreatedOn).ToList();
                return emailTemplates;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public List<EmailTemplateDto> AddEmailTemplate(EmailTemplateDto emailTemplateDto)
        {
            var contextData = _unitOfWork.EmailTemplateRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.EmailTemplateRepository.Context.Database.BeginTransaction())
                {
                    EmailTemplate emailTemplateData = new EmailTemplate();
                    emailTemplateData.Name = emailTemplateDto.Name;
                    emailTemplateData.Template = emailTemplateDto.Template;
                    emailTemplateData.Design = emailTemplateDto.Design;
                    emailTemplateData.Description = emailTemplateDto.Description;
                    emailTemplateData.Active = true;
                    emailTemplateData.Status = 1;   // Un-Verified               
                    emailTemplateData.CreatedBy = emailTemplateDto.AdminUserId.ToString();
                    emailTemplateData.CreatedOn = DateTime.Now;

                    _unitOfWork.EmailTemplateRepository.Insert(emailTemplateData);
                    contextData.SaveChanges();
                    transaction.Commit();

                    var emailTemplates = (from emailTemplate in contextData.EmailTemplate
                                          where emailTemplate.Active == true
                                          select new EmailTemplateDto
                                          {
                                              Id = emailTemplate.Id,
                                              Name = emailTemplate.Name,
                                              Template = emailTemplate.Template,
                                              Design = emailTemplate.Design,
                                              IsDefault = emailTemplate.IsDefault,
                                              Active = emailTemplate.Active,
                                              Status = emailTemplate.Status,
                                              CreatedOn = emailTemplate.CreatedOn,
                                              CreatedBy = emailTemplate.CreatedBy,
                                              ModifiedBy = emailTemplate.ModifiedBy,
                                              ModifiedOn = emailTemplate.ModifiedOn
                                          }).OrderByDescending(x => x.CreatedOn).ToList();
                    return emailTemplates;
                }
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<EmailTemplateDto> UpdateEmailTemplate(EmailTemplateDto emailTemplateDto)
        {
            var contextData = _unitOfWork.EmailTemplateRepository.Context;
            try
            {
                var emailTemplateData = _unitOfWork.EmailTemplateRepository.GetByID(emailTemplateDto.Id);
                if (emailTemplateData != null)
                {
                    using (var transaction = _unitOfWork.EmailTemplateRepository.Context.Database.BeginTransaction())
                    {
                        emailTemplateData.Name = emailTemplateDto.Name;
                        emailTemplateData.Description = emailTemplateDto.Description;
                        emailTemplateData.Template = emailTemplateDto.Template;
                        emailTemplateData.Design = emailTemplateDto.Design;
                        //emailTemplateData.IsDefault = emailTemplateData.IsDefault;
                        emailTemplateData.Status = emailTemplateDto.Status;
                        emailTemplateData.ModifiedBy = emailTemplateDto.AdminUserId.ToString();
                        emailTemplateData.ModifiedOn = DateTime.Now;

                        _unitOfWork.EmailTemplateRepository.Update(emailTemplateData);
                        contextData.SaveChanges();
                        transaction.Commit();

                        var emailTemplates = (from emailTemplate in contextData.EmailTemplate
                                              where emailTemplate.Active == true
                                              select new EmailTemplateDto
                                              {
                                                  Id = emailTemplate.Id,
                                                  Name = emailTemplate.Name,
                                                  Template = emailTemplate.Template,
                                                  Design = emailTemplate.Design,
                                                  IsDefault = emailTemplate.IsDefault,
                                                  Active = emailTemplate.Active,
                                                  Status = emailTemplate.Status,
                                                  CreatedOn = emailTemplate.CreatedOn,
                                                  CreatedBy = emailTemplate.CreatedBy,
                                                  ModifiedBy = emailTemplate.ModifiedBy,
                                                  ModifiedOn = emailTemplate.ModifiedOn
                                              }).OrderByDescending(x => x.CreatedOn).ToList();
                        return emailTemplates;
                    }
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<EmailTemplateDto> DeleteEmailTemplate(int emailTemplateId, int adminUserId)
        {
            var contextData = _unitOfWork.EmailTemplateRepository.Context;
            try
            {
                var emailTemplateData = _unitOfWork.EmailTemplateRepository.GetByID(emailTemplateId);
                if (emailTemplateData != null)
                {
                    using (var transaction = _unitOfWork.EmailTemplateRepository.Context.Database.BeginTransaction())
                    {
                        emailTemplateData.Active = false;
                        emailTemplateData.ModifiedBy = adminUserId.ToString();
                        emailTemplateData.ModifiedOn = DateTime.Now;

                        _unitOfWork.EmailTemplateRepository.Update(emailTemplateData);
                        contextData.SaveChanges();
                        transaction.Commit();

                        var emailTemplates = (from emailTemplate in contextData.EmailTemplate
                                              where emailTemplate.Active == true
                                              select new EmailTemplateDto
                                              {
                                                  Id = emailTemplate.Id,
                                                  Name = emailTemplate.Name,
                                                  Template = emailTemplate.Template,
                                                  Design = emailTemplate.Design,
                                                  IsDefault = emailTemplate.IsDefault,
                                                  Active = emailTemplate.Active,
                                                  Status = emailTemplate.Status,
                                                  CreatedOn = emailTemplate.CreatedOn,
                                                  CreatedBy = emailTemplate.CreatedBy,
                                                  ModifiedBy = emailTemplate.ModifiedBy,
                                                  ModifiedOn = emailTemplate.ModifiedOn
                                              }).OrderByDescending(x => x.CreatedOn).ToList();
                        return emailTemplates;
                    }
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<EmailRecipientDto> GetEmailRecipients()
        {
            List<EmailRecipientDto> emailRecipients = new List<EmailRecipientDto>();
            var contextData = _unitOfWork.EmailRecipientRepository.Context;
            try
            {
                emailRecipients = (from recipient in contextData.EmailRecipient
                                   where recipient.Active == true
                                   select new EmailRecipientDto
                                   {
                                       Id = "group_" + recipient.Id,
                                       Name = recipient.Name,
                                       Description = recipient.Description
                                   }).ToList();

                var tags = (from tag in contextData.Tag
                            where tag.Active == true
                            select new EmailRecipientDto
                            {
                                Id = "tag_" + tag.Id,
                                Name = tag.Name
                            }).ToList();

                if (tags != null)
                    emailRecipients.AddRange(tags);

                var userEmailIds = (from userAccount in contextData.UserAccount
                                    where userAccount.Active == true
                                    && (userAccount.RoleId == 1 || userAccount.RoleId == 2)
                                    select new EmailRecipientDto
                                    {
                                        Id = "user_" + userAccount.Id,
                                        Name = userAccount.FirstName + " " + userAccount.LastName + "<" + userAccount.EmailId + ">"
                                    }).ToList();

                if (userEmailIds != null)
                    emailRecipients.AddRange(userEmailIds);
            }
            catch (Exception e)
            {
                e.ToString();
                return emailRecipients;
            }
            finally
            {
                contextData = null;
            }
            return emailRecipients;
        }
        public List<EmailTypeDto> GetEmailTypes()
        {
            List<EmailTypeDto> emailTypes = new List<EmailTypeDto>();
            var contextData = _unitOfWork.EmailRecipientRepository.Context;
            try
            {
                emailTypes = (from type in contextData.EmailType
                              where type.Active == true
                              select new EmailTypeDto
                              {
                                  Id = type.Id,
                                  Name = type.Name
                              }).ToList();
            }
            catch (Exception e)
            {
                e.ToString();
                return emailTypes;
            }
            finally
            {
                contextData = null;
            }
            return emailTypes;
        }
        public int AddCredorEmailDetail(CredorEmailDetailDto credorEmailDetailDto)
        {
            var contextData = _unitOfWork.CredorEmailDetailRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.CredorEmailDetailRepository.Context.Database.BeginTransaction())
                {
                    CredorEmailDetail emailDetail = new CredorEmailDetail();
                    emailDetail.Subject = credorEmailDetailDto.Subject;
                    emailDetail.FromEmail = credorEmailDetailDto.FromEmail;
                    emailDetail.FromEmailAddressId = credorEmailDetailDto.FromEmailAddressId;
                    emailDetail.FromName = credorEmailDetailDto.FromName;
                    emailDetail.EmailTypeId = credorEmailDetailDto.EmailTypeId;
                    emailDetail.EmailTemplateId = credorEmailDetailDto.EmailTemplateId;
                    emailDetail.EmailTemplate = credorEmailDetailDto.EmailTemplate;
                    emailDetail.EmailDesign = credorEmailDetailDto.EmailDesign;
                    emailDetail.ScheduledOn = credorEmailDetailDto.ScheduledOn;
                    emailDetail.Status = credorEmailDetailDto.Status;
                    emailDetail.Active = true;
                    emailDetail.CreatedBy = credorEmailDetailDto.AdminUserId.ToString();
                    emailDetail.CreatedOn = DateTime.Now;

                    _unitOfWork.CredorEmailDetailRepository.Insert(emailDetail);
                    contextData.SaveChanges();
                    transaction.Commit();

                    var Id = emailDetail.Id;
                    return Id;
                }
            }
            catch (Exception e)
            {
                e.ToString();
                return 0;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public int AddCredorEmail(CredorEmailDto credorEmailDto)
        {
            var contextData = _unitOfWork.CredorEmailRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.CredorEmailRepository.Context.Database.BeginTransaction())
                {
                    CredorEmail credorEmail = new CredorEmail();
                    credorEmail.CredorEmailDetailId = credorEmailDto.CredorEmailDetailId;
                    credorEmail.RecipientEmailId = credorEmailDto.RecipientEmailId;
                    credorEmail.Status = credorEmailDto.Status;
                    credorEmail.Active = true;
                    //Instance mails
                    credorEmail.UserId = credorEmailDto.UserId;
                    credorEmail.CredorEmailProviderId = credorEmailDto.CredorEmailProviderId;
                    credorEmail.Subject = credorEmailDto.Subject;
                    credorEmail.Body = credorEmailDto.Body;
                    credorEmail.CreatedBy = credorEmailDto.AdminUserId.ToString();
                    credorEmail.CreatedOn = DateTime.Now;

                    _unitOfWork.CredorEmailRepository.Insert(credorEmail);
                    contextData.SaveChanges();
                    transaction.Commit();

                    var Id = credorEmail.Id;
                    return Id;
                }
            }
            catch (Exception e)
            {
                e.ToString();
                return 0;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public int AddEmailRecipientGroup(EmailRecipientGroupDto emailRecipientGroupDto)
        {
            var contextData = _unitOfWork.EmailRecipientGroupRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.EmailRecipientGroupRepository.Context.Database.BeginTransaction())
                {
                    EmailRecipientGroup emailRecipientGroup = new EmailRecipientGroup();
                    emailRecipientGroup.CredorEmailDetailId = emailRecipientGroupDto.CredorEmailDetailId;
                    emailRecipientGroup.EmailRecipientId = emailRecipientGroupDto.EmailRecipientId;
                    emailRecipientGroup.TagId = emailRecipientGroupDto.TagId;
                    emailRecipientGroup.EmailId = emailRecipientGroupDto.EmailId;
                    emailRecipientGroup.UserId = emailRecipientGroup.UserId;
                    emailRecipientGroup.Status = emailRecipientGroupDto.Status;
                    emailRecipientGroup.Active = true;
                    emailRecipientGroup.CreatedBy = emailRecipientGroupDto.AdminUserId.ToString();
                    emailRecipientGroup.CreatedOn = DateTime.Now;

                    _unitOfWork.EmailRecipientGroupRepository.Insert(emailRecipientGroup);
                    contextData.SaveChanges();
                    transaction.Commit();

                    var Id = emailRecipientGroup.Id;
                    return Id;
                }
            }
            catch (Exception e)
            {
                e.ToString();
                return 0;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public int AddEmailAttahment(EmailAttachmentDto emailAttachmentDto)
        {
            var contextData = _unitOfWork.EmailAttachmentRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.EmailAttachmentRepository.Context.Database.BeginTransaction())
                {                    
                    EmailAttachment emailAttachment = new EmailAttachment();
                    emailAttachment.CredorEmailDetailId = emailAttachmentDto.CredorEmailDetailId;
                    emailAttachment.FileName = emailAttachmentDto.FileName;
                    emailAttachment.FilePath = emailAttachmentDto.FilePath;
                    emailAttachment.Extension = emailAttachmentDto.Extension;
                    emailAttachment.Status = emailAttachmentDto.Status;
                    emailAttachment.Active = true;
                    emailAttachment.CreatedBy = emailAttachmentDto.AdminUserId.ToString();
                    emailAttachment.CreatedOn = DateTime.Now;

                    _unitOfWork.EmailAttachmentRepository.Insert(emailAttachment);
                    contextData.SaveChanges();
                    transaction.Commit();

                    var Id = emailAttachment.Id;
                    return Id;
                }
            }
            catch (Exception e)
            {
                e.ToString();
                return 0;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<CredorEmailDetailDto> GetCredorEmailDetails()
        {
            List<CredorEmailDetailDto> credorEmailDetails = new List<CredorEmailDetailDto>();
            var contextData = _unitOfWork.CredorEmailDetailRepository.Context;
            try
            {
                credorEmailDetails = (from emailDetail in contextData.CredorEmailDetail
                                      where emailDetail.Active == true
                                      select new CredorEmailDetailDto
                                      {
                                          Id = emailDetail.Id,
                                          Subject = emailDetail.Subject,                                          
                                          FromEmail = emailDetail.FromEmail,
                                          FromName = emailDetail.FromName,
                                          ReplyTo = emailDetail.ReplyTo,
                                          Active = emailDetail.Active,
                                          Status = emailDetail.Status,
                                          ScheduledOn = emailDetail.ScheduledOn,
                                          EmailTemplate = emailDetail.EmailTemplate,
                                          EmailDesign = emailDetail.EmailDesign,
                                          EmailTemplateId = emailDetail.EmailTemplateId,
                                          EmailTypeId = emailDetail.EmailTypeId,
                                          SentTo = emailDetail.SentTo,
                                          Delivered = emailDetail.Delivered,
                                          Clicked = emailDetail.Clicked,
                                          Bounced = emailDetail.Bounced,
                                          Opened = emailDetail.Opened,
                                          CreatedBy = emailDetail.CreatedBy,
                                          CreatedOn = emailDetail.CreatedOn,
                                          ModifiedBy = emailDetail.ModifiedBy,
                                          ModifiedOn = emailDetail.ModifiedOn,
                                          Recipients = (from credorEmail in contextData.CredorEmail
                                                        where credorEmail.CredorEmailDetailId == emailDetail.Id
                                                        select credorEmail.Id).Count()
                                      }).OrderByDescending(x => x.CreatedOn).ToList();
            }
            catch (Exception e)
            {
                e.ToString();
                return credorEmailDetails;
            }
            finally
            {
                contextData = null;
            }
            return credorEmailDetails;
        }
        public List<CredorEmailDto> GetCredorEmails(int credorEmailDetailId)
        {
            List<CredorEmailDto> credorEmails = new List<CredorEmailDto>();
            var contextData = _unitOfWork.CredorEmailRepository.Context;
            try
            {
                credorEmails = (from email in contextData.CredorEmail
                                where email.Active == true
                                && email.CredorEmailDetailId == credorEmailDetailId
                                select new CredorEmailDto
                                {
                                    Id = email.Id,
                                    CredorEmailDetailId = email.CredorEmailDetailId,
                                    Status = email.Status,
                                    RecipientEmailId = email.RecipientEmailId,
                                    CreatedBy = email.CreatedBy,
                                    CreatedOn = email.CreatedOn,
                                    ModifiedBy = email.ModifiedBy,
                                    ModifiedOn = email.ModifiedOn
                                }).OrderByDescending(x => x.CreatedOn).ToList();
            }
            catch (Exception e)
            {
                e.ToString();
                return credorEmails;
            }
            finally
            {
                contextData = null;
            }
            return credorEmails;
        }
        public List<EmailRecipientGroupDto> GetEmailRecipientGroups(int credorEmailDetailId)
        {
            List<EmailRecipientGroupDto> emailRecipientGroups = new List<EmailRecipientGroupDto>();
            var contextData = _unitOfWork.EmailRecipientGroupRepository.Context;
            try
            {
                emailRecipientGroups = (from recipient in contextData.EmailRecipientGroup
                                        where recipient.Active == true
                                        && recipient.CredorEmailDetailId == credorEmailDetailId
                                        select new EmailRecipientGroupDto
                                        {
                                            Id = recipient.Id,
                                            CredorEmailDetailId = recipient.CredorEmailDetailId,
                                            Status = recipient.Status,
                                            EmailRecipientId = recipient.EmailRecipientId,
                                            EmailRecipientGroupName = (from emailRecipient in contextData.EmailRecipient
                                                                       where emailRecipient.Id == recipient.EmailRecipientId select emailRecipient.Name).FirstOrDefault(),
                                            EmailRecipientName = ((recipient.TagId != null) ? "tag_" + recipient.TagId :
                                                                 (recipient.EmailRecipientId != null) ? "group_" + recipient.EmailRecipientId :
                                                                 "user_" + recipient.UserId),
                                            EmailId = recipient.EmailId,
                                            UserId = recipient.UserId,
                                            TagId = recipient.TagId,
                                            TagName = (from tag in contextData.Tag
                                                       where tag.Id == recipient.TagId
                                                       select tag.Name).FirstOrDefault(),
                                            CreatedBy = recipient.CreatedBy,
                                            CreatedOn = recipient.CreatedOn,
                                            ModifiedBy = recipient.ModifiedBy,
                                            ModifiedOn = recipient.ModifiedOn
                                        }).OrderByDescending(x => x.CreatedOn).ToList();
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
            return emailRecipientGroups;
        }
        public CredorEmailDto GetCredorEmail(int credorEmailId)
        {
            var contextData = _unitOfWork.CredorEmailRepository.Context;
            try
            {
                var credorEmail = (from email in contextData.CredorEmail
                                   where email.Id == credorEmailId
                                   select new CredorEmailDto
                                   {
                                       Id = email.Id,
                                       CredorEmailDetailId = email.CredorEmailDetailId,
                                       Status = email.Status,
                                       RecipientEmailId = email.RecipientEmailId,
                                       CreatedBy = email.CreatedBy,
                                       CreatedOn = email.CreatedOn,
                                       ModifiedBy = email.ModifiedBy,
                                       ModifiedOn = email.ModifiedOn
                                   }).FirstOrDefault();
                return credorEmail;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public CredorEmailDetailDto GetCredorEmailDetail(int credorEmailDetailId)
        {
            var contextData = _unitOfWork.CredorEmailDetailRepository.Context;
            try
            {
                var credorEmailDetail = (from emailDetail in contextData.CredorEmailDetail
                                         where emailDetail.Id == credorEmailDetailId
                                         select new CredorEmailDetailDto
                                         {
                                             Id = emailDetail.Id,
                                             Subject = emailDetail.Subject,
                                             FromEmail = emailDetail.FromEmail,
                                             FromEmailAddressId = emailDetail.FromEmailAddressId == null? 0 :
                                                                   Convert.ToInt32(emailDetail.FromEmailAddressId),
                                             FromName = emailDetail.FromName,
                                             ReplyTo = emailDetail.ReplyTo,
                                             Status = emailDetail.Status,
                                             ScheduledOn = emailDetail.ScheduledOn,
                                             EmailTemplateId = emailDetail.EmailTemplateId,
                                             EmailTemplate = (emailDetail.EmailTemplateId == 0 || emailDetail.EmailTemplateId == null)
                                                              && emailDetail.EmailTemplate != null ?
                                                              emailDetail.EmailTemplate :
                                                                (from template in contextData.EmailTemplate
                                                                 where template.Id == emailDetail.EmailTemplateId
                                                                 select template.Template).FirstOrDefault().ToString(),
                                             EmailDesign = (emailDetail.EmailTemplateId == 0 || emailDetail.EmailTemplateId == null)
                                                              && emailDetail.EmailTemplate != null ?
                                                              emailDetail.EmailDesign :
                                                                (from template in contextData.EmailTemplate
                                                                 where template.Id == emailDetail.EmailTemplateId
                                                                 select template.Design).FirstOrDefault().ToString(),
                                             EmailTypeId = emailDetail.EmailTypeId,
                                             SentTo = emailDetail.SentTo,
                                             Delivered = emailDetail.Delivered,
                                             Clicked = emailDetail.Clicked,
                                             Bounced = emailDetail.Bounced,
                                             Opened = emailDetail.Opened,
                                             CreatedBy = emailDetail.CreatedBy,
                                             CreatedOn = emailDetail.CreatedOn,
                                             ModifiedBy = emailDetail.ModifiedBy,
                                             ModifiedOn = emailDetail.ModifiedOn
                                         }).FirstOrDefault();
                return credorEmailDetail;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public List<EmailAttachmentDto> GetEmailAttachments(int credorEmailDetailId)
        {
            var contextData = _unitOfWork.EmailAttachmentRepository.Context;
            try
            {
                var emailAttachments = (from attachment in contextData.EmailAttachment
                                   where attachment.CredorEmailDetailId == credorEmailDetailId
                                   && attachment.Active == true
                                   select new EmailAttachmentDto
                                   {
                                       Id = attachment.Id,
                                       CredorEmailDetailId = attachment.CredorEmailDetailId,
                                       Status = attachment.Status,
                                       FileName = attachment.FileName,
                                       FilePath = attachment.FilePath,
                                       Extension = attachment.Extension,
                                       CreatedBy = attachment.CreatedBy,
                                       CreatedOn = attachment.CreatedOn,
                                       ModifiedBy = attachment.ModifiedBy,
                                       ModifiedOn = attachment.ModifiedOn
                                   }).OrderByDescending(x => x.CreatedOn).ToList();
                return emailAttachments;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public CredorEmailDetailDataDto GetAllCredorEmailDetail(int credorEmailDetailId)
        {
            CredorEmailDetailDataDto credorEmailDetailData = new CredorEmailDetailDataDto();            
            try
            {
                credorEmailDetailData.CredorEmailDetail = GetCredorEmailDetail(credorEmailDetailId);
                credorEmailDetailData.CredorEmails = GetCredorEmails(credorEmailDetailId);
                credorEmailDetailData.EmailAttachments = GetEmailAttachments(credorEmailDetailId);
                credorEmailDetailData.EmailRecipientGroups = GetEmailRecipientGroups(credorEmailDetailId);                
                return credorEmailDetailData;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }           
        }
        public bool DeleteEmailAttahments(int credorEmailDetailId,int adminUserId)
        {
            var contextData = _unitOfWork.EmailAttachmentRepository.Context;
            try
            {
                var emailAttachments = _unitOfWork.EmailAttachmentRepository.GetMany(x => x.CredorEmailDetailId == credorEmailDetailId).ToList();
                if (emailAttachments != null)
                {
                    using (var transaction = _unitOfWork.EmailAttachmentRepository.Context.Database.BeginTransaction())
                    {
                        List<EmailAttachment> emailAttachmentsData = new List<EmailAttachment>();
                        foreach (var attachment in emailAttachments)
                        {
                            EmailAttachment emailAttachment = attachment;                           
                            emailAttachment.Active = false;
                            emailAttachment.ModifiedBy = adminUserId.ToString();
                            emailAttachment.ModifiedOn = DateTime.Now;
                            emailAttachmentsData.Add(emailAttachment);
                        }
                        _unitOfWork.EmailAttachmentRepository.UpdateList(emailAttachmentsData);
                        contextData.SaveChanges();
                        transaction.Commit();                       
                        return true;
                    }
                }
                return true;
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
        }
        public List<EmailProviderDto> GetEmailProviders()
        {
            var contextData = _unitOfWork.EmailProviderRepository.Context;
            try
            {
                var emailProviders = (from provider in contextData.EmailProvider
                                   where provider.Active == true
                                   select new EmailProviderDto
                                   {
                                       Id = provider.Id,
                                       IMAP = provider.IMAP,
                                       SMTP = provider.SMTP,
                                       Name = provider.Name,
                                       CreatedBy = provider.CreatedBy,
                                       CreatedOn = provider.CreatedOn,                                      
                                   }).ToList();
                return emailProviders;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public CredorEmailProviderDto GetCredorEmailProvider()
        {
            var contextData = _unitOfWork.CredorEmailProviderRepository.Context;
            try
            {
                var emailProvider = (from credorEmailProvider in contextData.CredorEmailProvider
                                      where credorEmailProvider.Active == true
                                      select new CredorEmailProviderDto
                                      {
                                          Id = credorEmailProvider.Id,
                                          IMAPHost = credorEmailProvider.IMAPHost,
                                          SMTPHost = credorEmailProvider.SMTPHost,
                                          EmailId = credorEmailProvider.EmailId,
                                          Password = credorEmailProvider.Password,
                                          DisplayName = credorEmailProvider.DisplayName,
                                          CreatedBy = credorEmailProvider.CreatedBy,
                                          CreatedOn = credorEmailProvider.CreatedOn,
                                      }).FirstOrDefault();
                return emailProvider;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public bool UpdateCredorEmailProvider(CredorEmailProviderDto credorEmailProviderDto)
        {
            var contextData = _unitOfWork.CredorEmailProviderRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.CredorEmailProviderRepository.Context.Database.BeginTransaction())
                {
                    var credorEmailProvider = _unitOfWork.CredorEmailProviderRepository.GetByID(credorEmailProviderDto.Id);
                    if (credorEmailProvider != null)
                    {
                        credorEmailProvider.IMAPHost = credorEmailProviderDto.IMAPHost;
                        credorEmailProvider.SMTPHost = credorEmailProviderDto.SMTPHost;
                        credorEmailProvider.EmailId = credorEmailProviderDto.EmailId;
                        credorEmailProvider.Password = credorEmailProviderDto.Password;
                        credorEmailProvider.ModifiedBy = credorEmailProviderDto.AdminUserId.ToString();
                        credorEmailProvider.ModifiedOn = DateTime.Now;

                        _unitOfWork.CredorEmailProviderRepository.Update(credorEmailProvider);
                        contextData.SaveChanges();
                        transaction.Commit();
                    }
                    else
                    {
                        CredorEmailProvider credorEmailProviderData = new CredorEmailProvider();
                        credorEmailProvider.IMAPHost = credorEmailProviderDto.IMAPHost;
                        credorEmailProvider.SMTPHost = credorEmailProviderDto.SMTPHost;
                        credorEmailProvider.EmailId = credorEmailProviderDto.EmailId;
                        credorEmailProvider.Password = credorEmailProviderDto.Password;
                        credorEmailProvider.Active = credorEmailProvider.Active;                        
                        credorEmailProvider.CreatedBy = credorEmailProviderDto.AdminUserId.ToString();
                        credorEmailProvider.CreatedOn = DateTime.Now;

                        _unitOfWork.CredorEmailProviderRepository.Insert(credorEmailProviderData);
                        contextData.SaveChanges();
                        transaction.Commit();                        
                    }
                    return true;
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
        }
        public List<CredorEmailDto> GetSystemNotifications()
        {
            List<CredorEmailDto> credorEmails = new List<CredorEmailDto>();
            var contextData = _unitOfWork.CredorEmailRepository.Context;
            try
            {
                credorEmails = (from email in contextData.CredorEmail
                                where email.Active == true
                                && (email.EmailTypeId == 3 || email.EmailTypeId == 4)
                                select new CredorEmailDto
                                {
                                    Id = email.Id,                                    
                                    Status = email.Status,
                                    RecipientEmailId = email.RecipientEmailId,
                                    EmailTypeId = email.EmailTypeId,
                                    Subject = email.Subject,
                                    Body = email.Body,       
                                    Active = email.Active,                                   
                                    CreatedBy = email.CreatedBy,
                                    CreatedOn = email.CreatedOn,
                                    ModifiedBy = email.ModifiedBy,
                                    ModifiedOn = email.ModifiedOn
                                }).OrderByDescending(x => x.CreatedOn).ToList();
            }
            catch (Exception e)
            {
                e.ToString();
                return credorEmails;
            }
            finally
            {
                contextData = null;
            }
            return credorEmails;
        }
        public List<CredorEmailDetailDto> DeleteCredorEmailDetailById(DeleteCredorEmailDetailDto deleteCredorEmailDetailDto)
        {
            var contextData = _unitOfWork.CredorEmailDetailRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.CredorDomainRepository.Context.Database.BeginTransaction())
                {
                    List<CredorEmailDetail> credorEmailDetailList = new List<CredorEmailDetail>();
                    foreach (var credorEmailDetailId in deleteCredorEmailDetailDto.CredorEmailDetailIds)
                    {
                        var credorEmailDetail = _unitOfWork.CredorEmailDetailRepository.GetByID(credorEmailDetailId);
                        if (credorEmailDetail != null)
                        {
                            credorEmailDetail.Active = false;
                            credorEmailDetail.ModifiedBy = deleteCredorEmailDetailDto.AdminUserId.ToString();
                            credorEmailDetail.ModifiedOn = DateTime.Now;

                            credorEmailDetailList.Add(credorEmailDetail);
                        }
                        else
                            return null;
                    }
                    _unitOfWork.CredorEmailDetailRepository.UpdateList(credorEmailDetailList);
                    contextData.SaveChanges();
                    transaction.Commit();
                }

                var credorEmailDetails = GetCredorEmailDetails();
                return credorEmailDetails;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }            
        }
        public List<CredorEmailDetailDto> ArchiveCredorEmailDetailById(ArchiveCredorEmailDetailDto archiveCredorEmailDetailDto)
        {
            var contextData = _unitOfWork.CredorEmailDetailRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.CredorDomainRepository.Context.Database.BeginTransaction())
                {
                    List<CredorEmailDetail> credorEmailDetailList = new List<CredorEmailDetail>();
                    foreach (var credorEmailDetailId in archiveCredorEmailDetailDto.CredorEmailDetailIds)
                    {
                        var credorEmailDetail = _unitOfWork.CredorEmailDetailRepository.GetByID(credorEmailDetailId);
                        if (credorEmailDetail != null)
                        {
                            credorEmailDetail.Status = 3; //Archived
                            credorEmailDetail.ModifiedBy = archiveCredorEmailDetailDto.AdminUserId.ToString();
                            credorEmailDetail.ModifiedOn = DateTime.Now;

                            credorEmailDetailList.Add(credorEmailDetail);
                        }
                        else
                            return null;
                    }
                    _unitOfWork.CredorEmailDetailRepository.UpdateList(credorEmailDetailList);
                    contextData.SaveChanges();
                    transaction.Commit();
                }

                var credorEmailDetails = GetCredorEmailDetails();
                return credorEmailDetails;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
    }
}
