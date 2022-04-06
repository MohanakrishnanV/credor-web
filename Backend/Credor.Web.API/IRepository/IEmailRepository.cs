using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Client.Entities;

namespace Credor.Web.API
{
    public interface IEmailRepository
    {
        List<CredorFromEmailAddressDto> GetCredorFromEmailAddresses();
        List<CredorDomainDto> GetCredorDomains();
        List<CredorDomainDto> AddCredorDomain(CredorDomainDto credorDomainDto);
        List<CredorDomainDto> UpdateCredorDomain(CredorDomainDto credorDomainDto);
        List<CredorDomainDto> DeleteCredorDomain(int domainId, int adminUserId);
        List<CredorFromEmailAddressDto> AddCredorFromEmailAddress(CredorFromEmailAddressDto credorFromEmailAddressDto);
        List<CredorFromEmailAddressDto> UpdateCredorFromEmailAddress(CredorFromEmailAddressDto credorFromEmailAddressDto);
        List<CredorFromEmailAddressDto> DeleteCredorFromEmailAddress(int fromEmailAddressId, int adminUserId);
        List<EmailTemplateDto> GetEmailTemplates();
        List<EmailTemplateDto> AddEmailTemplate(EmailTemplateDto emailTemplateDto);
        List<EmailTemplateDto> UpdateEmailTemplate(EmailTemplateDto emailTemplateDto);
        List<EmailTemplateDto> DeleteEmailTemplate(int emailTemplateId, int adminUserId);
        List<EmailRecipientDto> GetEmailRecipients();
        List<EmailTypeDto> GetEmailTypes();
        int AddCredorEmailDetail(CredorEmailDetailDto credorEmailDetailDto);
        int AddCredorEmail(CredorEmailDto credorEmailDto);
        int AddEmailRecipientGroup(EmailRecipientGroupDto emailRecipientGroupDto);
        int AddEmailAttahment(EmailAttachmentDto emailAttachmentDto);
        List<CredorEmailDto> GetCredorEmails(int credorEmailDetailId);
        List<CredorEmailDetailDto> GetCredorEmailDetails();
        List<EmailRecipientGroupDto> GetEmailRecipientGroups(int credorEmailDetailId);
        CredorEmailDto GetCredorEmail(int credorEmailId);
        CredorEmailDetailDto GetCredorEmailDetail(int credorEmailDetailId);
        List<EmailAttachmentDto> GetEmailAttachments(int credorEmailDetailId);
        bool DeleteEmailAttahments(int credorEmailDetailId, int adminUserId);
        List<EmailProviderDto> GetEmailProviders();
        CredorEmailProviderDto GetCredorEmailProvider();
        bool UpdateCredorEmailProvider(CredorEmailProviderDto credorEmailProviderDto);
        CredorEmailDetailDataDto GetAllCredorEmailDetail(int credorEmailDetailId);
        List<CredorEmailDto> GetSystemNotifications();
        List<CredorEmailDetailDto> DeleteCredorEmailDetailById(DeleteCredorEmailDetailDto deleteCredorEmailDetailDto);
        List<CredorEmailDetailDto> ArchiveCredorEmailDetailById(ArchiveCredorEmailDetailDto archiveCredorEmailDetailDto);
    }
}
