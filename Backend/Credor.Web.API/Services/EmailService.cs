using Credor.Client.Entities;
using Credor.Web.API.Common.UnitOfWork;
using Credor.Web.API.Shared;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public class EmailService : IEmailService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IEmailRepository _emailRepository;

        public IConfiguration _configuration { get; }
        public EmailService(IEmailRepository emailRepository,
                                IConfiguration configuration)
        {
            _unitOfWork = new UnitOfWork(configuration);
            _configuration = configuration;
            _emailRepository = emailRepository;
        }
        public List<CredorFromEmailAddressDto> GetCredorFromEmailAddresses()
        {
            return _emailRepository.GetCredorFromEmailAddresses();
        }
        public List<CredorDomainDto> GetCredorDomains()
        {
            return _emailRepository.GetCredorDomains();
        }
        public List<CredorDomainDto> AddCredorDomain(CredorDomainDto credorDomainDto)
        {
            return _emailRepository.AddCredorDomain(credorDomainDto);
        }
        public List<CredorDomainDto> UpdateCredorDomain(CredorDomainDto credorDomainDto)
        {
            return _emailRepository.UpdateCredorDomain(credorDomainDto);
        }
        public List<CredorDomainDto> DeleteCredorDomain(int domainId, int adminUserId)
        {
            return _emailRepository.DeleteCredorDomain(domainId, adminUserId);
        }
        public List<CredorFromEmailAddressDto> AddCredorFromEmailAddress(CredorFromEmailAddressDto credorFromEmailAddressDto)
        {
            return _emailRepository.AddCredorFromEmailAddress(credorFromEmailAddressDto);
        }
        public List<CredorFromEmailAddressDto> UpdateCredorFromEmailAddress(CredorFromEmailAddressDto credorFromEmailAddressDto)
        {
            return _emailRepository.UpdateCredorFromEmailAddress(credorFromEmailAddressDto);
        }
        public List<CredorFromEmailAddressDto> DeleteCredorFromEmailAddress(int fromEmailAddressId, int adminUserId)
        {
            return _emailRepository.DeleteCredorFromEmailAddress(fromEmailAddressId, adminUserId);
        }

        public List<EmailTemplateDto> GetEmailTemplates()
        {
            return _emailRepository.GetEmailTemplates();
        }

        public List<EmailTemplateDto> AddEmailTemplate(EmailTemplateDto emailTemplateDto)
        {
            return _emailRepository.AddEmailTemplate(emailTemplateDto);
        }

        public List<EmailTemplateDto> UpdateEmailTemplate(EmailTemplateDto emailTemplateDto)
        {
            return _emailRepository.UpdateEmailTemplate(emailTemplateDto);
        }

        public List<EmailTemplateDto> DeleteEmailTemplate(int emailTemplateId, int adminUserId)
        {
            return _emailRepository.DeleteEmailTemplate(emailTemplateId, adminUserId);
        }

        public List<EmailRecipientDto> GetEmailRecipients()
        {
            return _emailRepository.GetEmailRecipients();
        }
        public List<EmailTypeDto> GetEmailTypes()
        {
            return _emailRepository.GetEmailTypes();
        }
        public async Task<int> ResendMail(int credorEmailDetailId, int adminUserId)
        {
            try
            {
                var sendMailRequest = GetAllCredorEmailDetail(credorEmailDetailId);
                var adminUser = _unitOfWork.UserAccountRepository.GetByID(adminUserId);
                var fromEmailAddress = _unitOfWork.CredorFromEmailAddressRepository.GetByID(sendMailRequest.CredorEmailDetail.FromEmailAddressId);
                List<string> failedEmailIds = new List<string>();

                if (adminUser != null && fromEmailAddress != null)
                {
                    List<string> Recipients = new List<string>();
                   
                    var env = _configuration["environment"];
                    string FromMailDisplayName = sendMailRequest.CredorEmailDetail.FromName != null ? sendMailRequest.CredorEmailDetail.FromName : fromEmailAddress.FromName;
                    string SmtpClientName = _configuration["SmtpClientName"];
                    SmtpClient smtpserver = new SmtpClient(SmtpClientName);
                    MailMessage mail = new MailMessage();
                    mail.From = new MailAddress(fromEmailAddress.EmailId, FromMailDisplayName);
                    mail.Subject = sendMailRequest.CredorEmailDetail.Subject;

                    string emailTemplate = "";
                    //Set mail body messgae
                    if (sendMailRequest.CredorEmailDetail.EmailTemplateId == 0 || sendMailRequest.CredorEmailDetail.EmailTemplateId == null)
                    {
                        emailTemplate = sendMailRequest.CredorEmailDetail.EmailTemplate;
                        mail.Body = emailTemplate;
                    }
                    else
                    {
                        emailTemplate = _unitOfWork.EmailTemplateRepository.GetByID(sendMailRequest.CredorEmailDetail.EmailTemplateId).Template;
                        mail.Body = emailTemplate;
                    }
                    Recipients = GetRecipientsFromEmailRecipientGroups(sendMailRequest.EmailRecipientGroups);

                    if (!string.IsNullOrEmpty(sendMailRequest.CredorEmailDetail.ReplyTo))
                        // Set mail Reply To email address
                        mail.ReplyTo = new MailAddress(sendMailRequest.CredorEmailDetail.ReplyTo);
                    else
                        mail.ReplyTo = new MailAddress(fromEmailAddress.EmailId);

                    Helper _helper = new Helper(_configuration);

                    //Set mail Email Attachments
                    if (sendMailRequest.EmailAttachments != null && sendMailRequest.EmailAttachments.Count() > 0)
                    {                                              
                        //Add EmailAttachement Records
                        foreach (var attachment in sendMailRequest.EmailAttachments)
                        {                            
                            if (attachment != null)
                            {
                                var container = await _helper.InitFileUpload();
                                var dirPath = container.GetDirectoryReference("EmailAttachments/" + credorEmailDetailId.ToString());
                                if (dirPath != null)
                                {
                                    #region Email Attachment type 
                                    var fileExtension = Path.GetExtension(attachment.FileName);
                                    // Retrieve reference to a blob.
                                    CloudBlockBlob blockBlob = dirPath.GetBlockBlobReference(attachment.FileName);

                                    if (fileExtension == "jpeg")
                                    {
                                        var stream = new MemoryStream();
                                        await blockBlob.DownloadToStreamAsync(stream);
                                        stream.Seek(0, SeekOrigin.Begin);
                                        ContentType content = new ContentType(MediaTypeNames.Image.Jpeg);
                                        Attachment emailattachment = new Attachment(stream, content);
                                        mail.Attachments.Add(emailattachment);
                                    }
                                    else if (fileExtension == "png")
                                    {
                                        var stream = new MemoryStream();
                                        await blockBlob.DownloadToStreamAsync(stream);
                                        stream.Seek(0, SeekOrigin.Begin);
                                        ContentType content = new ContentType("image/png");
                                        Attachment emailattachment = new Attachment(stream, content);
                                        mail.Attachments.Add(emailattachment);
                                    }
                                    else if (fileExtension == "pdf")
                                    {
                                        var stream = new MemoryStream();
                                        await blockBlob.DownloadToStreamAsync(stream);
                                        stream.Seek(0, SeekOrigin.Begin);
                                        ContentType content = new ContentType("application/pdf");
                                        Attachment emailattachment = new Attachment(stream, content);
                                        mail.Attachments.Add(emailattachment);
                                    }
                                    #endregion
                                }
                            }
                        }
                    }                    
                    
                    if (Recipients != null && Recipients.Count > 0)
                        {
                            foreach (var emailAddress in Recipients)
                            {
                                mail.To.Clear();
                                mail.To.Add(emailAddress);
                                var mailStatus = _helper.MailSend(mail, smtpserver, fromEmailAddress.EmailId, fromEmailAddress.Password);
                                if (mailStatus)
                                {
                                    //Set CredorEmail Status to 1 - Sent
                                    CredorEmailDto credorEmail = new CredorEmailDto();
                                    credorEmail.AdminUserId = adminUserId;
                                    credorEmail.CredorEmailDetailId = credorEmailDetailId;
                                    credorEmail.RecipientEmailId = emailAddress;
                                    credorEmail.Status = 1;//Sent
                                    credorEmail.Active = true;
                                    var credorEmailId = _emailRepository.AddCredorEmail(credorEmail);
                                }
                                else
                                {
                                    //Set CredorEmail Status to to 2 - Failure
                                    CredorEmailDto credorEmail = new CredorEmailDto();
                                    credorEmail.AdminUserId = adminUserId;
                                    credorEmail.CredorEmailDetailId = credorEmailDetailId;
                                    credorEmail.RecipientEmailId = emailAddress;
                                    credorEmail.Status = 2;//Failure
                                    credorEmail.Active = true;
                                    var credorEmailId = _emailRepository.AddCredorEmail(credorEmail);
                                    failedEmailIds.Add(emailAddress);
                                }
                            }
                            //To do - Add failed email addresses to Bounce Email
                        }

                    return 1; //Success
                }
                else return 0; // Failure
            }
            catch (Exception e)
            {
                e.ToString();
                return 0; //Failure
            }
        }
        public async Task<SendMailResponseDto> SendMail(SendMailRequestDto sendMailRequest)
        {
            try
            {
                int credorEmailDetailId = 0;
                var adminUser = _unitOfWork.UserAccountRepository.GetByID(sendMailRequest.AdminUserId);
                var fromEmailAddress = _unitOfWork.CredorFromEmailAddressRepository.GetByID(sendMailRequest.FromEmailAddressId);                
                List<string> failedEmailIds = new List<string>();

                if (adminUser != null && fromEmailAddress != null)
                {
                    List<string> Recipients = new List<string>();

                    if(string.IsNullOrEmpty(sendMailRequest.FromName))
                        sendMailRequest.FromName = fromEmailAddress.FromName;

                    var env = _configuration["environment"];                                                                              
                    string FromMailDisplayName = sendMailRequest.FromName != null ? sendMailRequest.FromName : _configuration["MailDisplayName"];
                    MailMessage mail = new MailMessage();
                    string SmtpClientName = _configuration["SmtpClientName"];
                    SmtpClient smtpserver = new SmtpClient(SmtpClientName);
                    mail.From = new MailAddress(fromEmailAddress.EmailId, FromMailDisplayName);
                    mail.Subject = sendMailRequest.Subject;

                    string emailTemplate = "";
                    //Set mail body messgae
                    if (sendMailRequest.EmailTemplateId == 0 || sendMailRequest.EmailTemplateId == null)
                    {
                        emailTemplate = sendMailRequest.Template;
                        mail.Body = emailTemplate;
                    }
                    else
                    {
                        emailTemplate = _unitOfWork.EmailTemplateRepository.GetByID(sendMailRequest.EmailTemplateId).Template;
                        mail.Body = emailTemplate;
                    }
                    List<string> groups = sendMailRequest.EmailRecipientGroups[0].Split(',').ToList();
                    sendMailRequest.EmailRecipientGroups = groups;

                    if (sendMailRequest.CredorEmailDetailId == 0)
                    {
                        //Add CredorEmailDetail record
                        CredorEmailDetailDto credorEmailDetail = new CredorEmailDetailDto();
                        credorEmailDetail.AdminUserId = sendMailRequest.AdminUserId;
                        credorEmailDetail.Subject = sendMailRequest.Subject;
                        credorEmailDetail.FromEmail = fromEmailAddress.EmailId;
                        credorEmailDetail.FromEmailAddressId = sendMailRequest.FromEmailAddressId;
                        credorEmailDetail.FromName = sendMailRequest.FromName;
                        credorEmailDetail.ReplyTo = sendMailRequest.ReplyTo;
                        credorEmailDetail.ScheduledOn = sendMailRequest.ScheduledOn;
                        credorEmailDetail.EmailTypeId = sendMailRequest.EmailTypeId;
                        credorEmailDetail.EmailTemplate = sendMailRequest.Template;
                        credorEmailDetail.EmailDesign = sendMailRequest.TemplateDesign;
                        credorEmailDetail.EmailTemplateId = sendMailRequest.EmailTemplateId;
                        credorEmailDetail.Active = true;
                        credorEmailDetail.Status = sendMailRequest.IsDraft ? 1 : 2;

                        credorEmailDetailId = _emailRepository.AddCredorEmailDetail(credorEmailDetail);
                    }
                    else
                    {
                        credorEmailDetailId = sendMailRequest.CredorEmailDetailId;
                        // Update details if anything modified
                    }

                    //Get mail recipients list based on Recipient groups
                    if (!sendMailRequest.IsTestMail)
                    {
                        Recipients = GetAllRecipientEmailAddresses(sendMailRequest.EmailRecipientGroups);
                    }
                    else //Test maill will send mail to Admin user email Id
                    {
                        Recipients.Add(adminUser.EmailId);
                    }

                    if (!string.IsNullOrEmpty(sendMailRequest.ReplyTo))
                        // Set mail Reply To email address
                        mail.ReplyTo = new MailAddress(sendMailRequest.ReplyTo);
                    else
                        mail.ReplyTo = new MailAddress(fromEmailAddress.EmailId);

                    Helper _helper = new Helper(_configuration);

                    //Set mail Email Attachments
                    if (sendMailRequest.Attachments != null && sendMailRequest.Attachments.Count() > 0)
                    {                                  
                        if(sendMailRequest.CredorEmailDetailId != 0)
                        {
                            //Delete all existing attachments 
                            var status = _emailRepository.DeleteEmailAttahments(credorEmailDetailId, sendMailRequest.AdminUserId);

                        }
                        //Add EmailAttachement Records
                        foreach (var attachment in sendMailRequest.Attachments)
                        {                                 
                            var blobFilePath =  (await _helper.DocumentSaveAndUpload(attachment, credorEmailDetailId , 11)).ToString();

                            EmailAttachmentDto emailAttachment = new EmailAttachmentDto();                            
                            emailAttachment.CredorEmailDetailId = credorEmailDetailId;
                            emailAttachment.AdminUserId = sendMailRequest.AdminUserId;
                            emailAttachment.FileName = attachment.FileName;
                            emailAttachment.Extension = Path.GetExtension(attachment.FileName);
                            emailAttachment.FilePath = blobFilePath;
                            emailAttachment.Active = true;
                            emailAttachment.Status = 1;//Pending
                            emailAttachment.CreatedOn = DateTime.Now;
                            emailAttachment.CreatedBy = sendMailRequest.AdminUserId.ToString();
                            
                            var attachmentId = _emailRepository.AddEmailAttahment(emailAttachment);
                            if (attachmentId != 0)
                            {
                                var container = await _helper.InitFileUpload();
                                var dirPath = container.GetDirectoryReference("EmailAttachments/" + credorEmailDetailId.ToString());
                                if (dirPath != null)
                                {
                                    #region Email Attachment type 
                                    var fileExtension = Path.GetExtension(attachment.FileName);
                                    // Retrieve reference to a blob.
                                    CloudBlockBlob blockBlob = dirPath.GetBlockBlobReference(attachment.FileName);

                                    if (fileExtension == "jpeg")
                                    {                                        
                                        var stream = new MemoryStream();
                                        await blockBlob.DownloadToStreamAsync(stream);
                                        stream.Seek(0, SeekOrigin.Begin);
                                        ContentType content = new ContentType(MediaTypeNames.Image.Jpeg);
                                        Attachment emailattachment = new Attachment(stream, content);
                                        mail.Attachments.Add(emailattachment);
                                    }
                                    else if(fileExtension == "png")
                                    {
                                        var stream = new MemoryStream();
                                        await blockBlob.DownloadToStreamAsync(stream);
                                        stream.Seek(0, SeekOrigin.Begin);
                                        ContentType content = new ContentType("image/png");
                                        Attachment emailattachment = new Attachment(stream, content);
                                        mail.Attachments.Add(emailattachment);
                                    }
                                    else if(fileExtension == "pdf")
                                    {
                                        var stream = new MemoryStream();
                                        await blockBlob.DownloadToStreamAsync(stream);
                                        stream.Seek(0, SeekOrigin.Begin);
                                        ContentType content = new ContentType("application/pdf");
                                        Attachment emailattachment = new Attachment(stream, content);
                                        mail.Attachments.Add(emailattachment);
                                    }
                                    #endregion
                                }
                            }
                        }
                    }
                    if(sendMailRequest.EmailRecipientGroups != null && sendMailRequest.EmailRecipientGroups.Count() > 0)
                    {                        
                        foreach (var group in sendMailRequest.EmailRecipientGroups)
                        {
                            //Add Email Recipient groups                                                                                   
                            EmailRecipientGroupDto emailRecipientGroup = new EmailRecipientGroupDto();
                            emailRecipientGroup.CredorEmailDetailId = credorEmailDetailId;
                            emailRecipientGroup.AdminUserId = sendMailRequest.AdminUserId;

                            int namelength = group.Length;
                            string groupName = group.Substring(0, group.IndexOf("_"));

                            string Id = group.Substring(groupName.Length + 1, namelength - groupName.Length - 1);
                            int groupId = Convert.ToInt32(Id);
                            if(groupName.ToLower() == "group")
                            {
                                groupName = _unitOfWork.EmailRecipientRepository.Get(x => x.Id == groupId).Name;
                                emailRecipientGroup.EmailRecipientId = groupId;
                                emailRecipientGroup.EmailRecipientGroupName = groupName;                                
                            }
                            else if(groupName.ToLower() == "tag")
                            {
                                groupName = _unitOfWork.TagRepository.Get(x => x.Id == groupId).Name;
                                emailRecipientGroup.TagId = groupId;
                                emailRecipientGroup.TagName = groupName;                                
                            }
                            else if(groupName.ToLower() == "user")
                            {
                                var userAccount = _unitOfWork.UserAccountRepository.Get(x => x.Id == groupId);
                                if (userAccount != null)
                                {
                                    emailRecipientGroup.EmailId = userAccount.EmailId;
                                    emailRecipientGroup.UserId = userAccount.Id;
                                }
                            }                                
                            emailRecipientGroup.Active = true;
                            emailRecipientGroup.Status = 1;                            
                            groupId = _emailRepository.AddEmailRecipientGroup(emailRecipientGroup);
                        }
                    }
                    if (!sendMailRequest.IsDraft && !sendMailRequest.IsScheduled)
                    {                        
                        if (Recipients != null && Recipients.Count > 0)
                        {
                            foreach (var emailAddress in Recipients)
                            {
                                mail.To.Clear();
                                mail.To.Add(emailAddress);                                    
                                var mailStatus = _helper.MailSend(mail, smtpserver, fromEmailAddress.EmailId, fromEmailAddress.Password);
                                if(mailStatus)
                                {
                                    //Set CredorEmail Status to 1 - Sent
                                    CredorEmailDto credorEmail = new CredorEmailDto();
                                    credorEmail.AdminUserId = sendMailRequest.AdminUserId;
                                    credorEmail.CredorEmailDetailId = credorEmailDetailId;
                                    credorEmail.RecipientEmailId = emailAddress;
                                    credorEmail.Status = 1;//Sent
                                    credorEmail.Active = true;
                                    var credorEmailId = _emailRepository.AddCredorEmail(credorEmail);
                                }
                                else
                                {
                                    //Set CredorEmail Status to to 2 - Failure
                                    CredorEmailDto credorEmail = new CredorEmailDto();
                                    credorEmail.AdminUserId = sendMailRequest.AdminUserId;
                                    credorEmail.CredorEmailDetailId = credorEmailDetailId;
                                    credorEmail.RecipientEmailId = emailAddress;
                                    credorEmail.Status = 2;//Failure
                                    credorEmail.Active = true;
                                    var credorEmailId = _emailRepository.AddCredorEmail(credorEmail);
                                    failedEmailIds.Add(emailAddress);
                                }
                            }  
                            //To do - Add failed email addresses to Bounce Email
                        }
                    }                    
                    SendMailResponseDto sendMailResponse = new SendMailResponseDto();
                    sendMailResponse.CredorEmailDetail = _emailRepository.GetCredorEmailDetail(credorEmailDetailId);
                    sendMailResponse.EmailAttachments = _emailRepository.GetEmailAttachments(credorEmailDetailId);                    
                    sendMailResponse.CredorEmails = _emailRepository.GetCredorEmails(credorEmailDetailId);
                    sendMailResponse.EmailRecipientGroups = _emailRepository.GetEmailRecipientGroups(credorEmailDetailId);
                    return sendMailResponse;
                    }                
                else return null;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }            
        }      
        
        public List<string> GetRecipientsFromEmailRecipientGroups(List<EmailRecipientGroupDto> emailRecipientGroups)
        {
            List<string> RecipientEmailAddresses = new List<string>();
            if (emailRecipientGroups != null)
            {
                foreach (var emailRecipientGroup in emailRecipientGroups)
                {                   
                    if (emailRecipientGroup.EmailRecipientId != 0 && emailRecipientGroup.EmailRecipientId !=  null)
                    {
                        if (emailRecipientGroup.EmailRecipientId == 1) // All Investors and Leads
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && (x.RoleId == 1 || x.RoleId == 2))
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue;
                        }
                        else if (emailRecipientGroup.EmailRecipientId == 2) // Verified Users
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && (x.IsEmailVerified || x.IsPhoneVerified))
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue;
                        }
                        else if (emailRecipientGroup.EmailRecipientId == 3) // Accredited Only
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && (x.IsEmailVerified || x.IsPhoneVerified))
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue;
                        }
                        else if (emailRecipientGroup.EmailRecipientId == 4) // All Investors
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && x.RoleId == 1)
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue;
                        }
                        else if (emailRecipientGroup.EmailRecipientId == 5) // All Leads
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && x.RoleId == 2)
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue;
                        }
                        else if (emailRecipientGroup.EmailRecipientId == 6) // Not registered
                        {
                            //Todo
                        }
                    }
                    else if (emailRecipientGroup.TagId != 0 && emailRecipientGroup.TagId != null)
                    {
                        var contextData = _unitOfWork.TagRepository.Context;
                        var taggedRecipients = (from tag in contextData.Tag
                                                join tagDetail in contextData.TagDetail on tag.Id equals tagDetail.TagId
                                                join user in contextData.UserAccount on tagDetail.UserId equals user.Id
                                                where tag.Id == emailRecipientGroup.TagId
                                                && tag.Active == true
                                                && tagDetail.Active == true
                                                && user.Active == true
                                                select user.EmailId
                                                ).Distinct().ToList();
                        RecipientEmailAddresses.AddRange(taggedRecipients);
                    }
                    else if (emailRecipientGroup.EmailId != null)
                    {
                        RecipientEmailAddresses.Add(emailRecipientGroup.EmailId);
                    }
                }
                RecipientEmailAddresses = RecipientEmailAddresses.Distinct().ToList();
                return RecipientEmailAddresses;
            }
            else
                return null;
        }
        public List<string> GetAllRecipientEmailAddresses(List<string> emailRecipients)
        {
            List<string> RecipientEmailAddresses = new List<string>();
            if (emailRecipients != null)
            {
                foreach(var emailRecipient in emailRecipients)
                {
                    int namelength = emailRecipient.Length;
                    string groupName = emailRecipient.Substring(0, emailRecipient.IndexOf("_"));

                    string Id = emailRecipient.Substring(groupName.Length + 1, namelength - groupName.Length - 1);
                    int groupId = Convert.ToInt32(Id);
                    if(groupName.ToLower() == "group")
                    {                       
                        if(groupId == 1) // All Investors and Leads
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && (x.RoleId == 1 || x.RoleId == 2))
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue;
                        }  
                        else if(groupId == 2) // Verified Users
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && (x.IsEmailVerified || x.IsPhoneVerified))
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue;
                        }
                        else if(groupId == 3) // Accredited Only
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && (x.IsEmailVerified || x.IsPhoneVerified))
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue;
                        }
                        else if (groupId == 4) // All Investors
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && x.RoleId == 1)
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue; 
                        }
                        else if (groupId == 5) // All Leads
                        {
                            RecipientEmailAddresses.AddRange(_unitOfWork.UserAccountRepository.GetMany(x => x.Active == true
                                                                                                && x.RoleId == 2)
                                                                                       .Select(x => x.EmailId).Distinct().ToList());
                            continue;
                        }
                        else if(groupId == 6) // Not registered
                        {
                            //Todo
                        }
                    }
                    else if(groupName.ToLower() == "tag")
                    {
                        var contextData = _unitOfWork.TagRepository.Context;
                        var taggedRecipients = (from tag in contextData.Tag
                                                join tagDetail in contextData.TagDetail on tag.Id equals tagDetail.TagId
                                                join user in contextData.UserAccount on tagDetail.UserId equals user.Id
                                                where tag.Id == groupId
                                                && tag.Active == true
                                                && tagDetail.Active == true
                                                && user.Active == true
                                                select user.EmailId
                                                ).Distinct().ToList();
                        RecipientEmailAddresses.AddRange(taggedRecipients);
                    }
                    else if(groupName.ToLower() == "user")
                    {
                        RecipientEmailAddresses.Add(_unitOfWork.UserAccountRepository.GetByID(groupId).EmailId);                                                                                      
                    }
                }
                RecipientEmailAddresses = RecipientEmailAddresses.Distinct().ToList();
                return RecipientEmailAddresses;
            }
            else
                return null;
        }

        public List<CredorEmailDetailDto> GetCredorEmailDetails()
        {
            return _emailRepository.GetCredorEmailDetails();
        }
        public CredorEmailDetailDataDto GetAllCredorEmailDetail(int credorEmailDetailId)
        {
            return _emailRepository.GetAllCredorEmailDetail(credorEmailDetailId);
        }
        public List<CredorEmailDto> GetSystemNotifications()
        {
            return _emailRepository.GetSystemNotifications();
        }
        public List<CredorEmailDetailDto> DeleteCredorEmailDetailById(DeleteCredorEmailDetailDto deleteCredorEmailDetailDto)
        {
            return _emailRepository.DeleteCredorEmailDetailById(deleteCredorEmailDetailDto);
        }
        public List<CredorEmailDetailDto> ArchiveCredorEmailDetailById(ArchiveCredorEmailDetailDto archiveCredorEmailDetailDto)
        {
            return _emailRepository.ArchiveCredorEmailDetailById(archiveCredorEmailDetailDto);
        }
    }
}
