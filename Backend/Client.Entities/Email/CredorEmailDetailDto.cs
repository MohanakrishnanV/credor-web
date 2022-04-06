using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class CredorEmailDetailDto
    {
        public int Id { get; set; }
        public int AdminUserId { get; set; }
        public string Subject { get; set; }
        public DateTime? ScheduledOn { get; set; }
        public string FromName { get; set; }
        public string FromEmail { get; set; }
        public int FromEmailAddressId { get; set; }
        public string ReplyTo { get; set; }
        public int EmailTypeId { get; set; }
        public int? EmailTemplateId { get; set; }
        public string EmailTemplate { get; set; }
        public string EmailDesign { get; set; }
        public int? SentTo { get; set; }
        public int? Delivered { get; set; }
        public int? Opened { get; set; }
        public int? Clicked { get; set; }
        public int? Bounced { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public int Recipients { get; set; }
    }
    public class CredorEmailDetailDataDto
    {
        public CredorEmailDetailDto CredorEmailDetail { get; set; }
        public List<CredorEmailDto> CredorEmails { get; set; }
        public List<EmailAttachmentDto> EmailAttachments { get; set; }
        public List<EmailRecipientGroupDto> EmailRecipientGroups { get; set; }
        public string EmailTemplate { get; set; }
    }
    public class DeleteCredorEmailDetailDto
    {
        public List<int> CredorEmailDetailIds { get; set; }
        public int AdminUserId { get; set; }
    }
    public class ArchiveCredorEmailDetailDto
    {
        public List<int> CredorEmailDetailIds { get; set; }
        public int AdminUserId { get; set; }
    }
}
