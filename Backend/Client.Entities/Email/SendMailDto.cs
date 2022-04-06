using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class SendMailDto
    {
        public int CredorEmailDetailId { get; set; }
        public int AdminUserId { get; set; }
        public string FromName { get; set; }
        public string ReplyTo { get; set; }        
        public int FromEmailAddressId { get; set; }
        public string Subject { get; set; }
        public string Template { get; set; }
        public string TemplateDesign { get; set; }
        public int EmailTypeId { get; set; }
        public int? EmailTemplateId { get; set; }
        public List<IFormFile> Attachments { get; set; }
        public DateTime? ScheduledOn { get; set; }
    }   
    public class SendMailRequestDto : SendMailDto
    {
        public bool IsScheduled { get; set; }
        public bool IsDraft { get; set; }
        public bool IsTestMail { get; set; }
        public List<string> EmailRecipientGroups { get; set; }           
    }
    public class SendMailResponseDto
    {
        public CredorEmailDetailDto CredorEmailDetail { get; set; }
        public List<CredorEmailDto> CredorEmails { get; set; }
        public List<EmailAttachmentDto> EmailAttachments { get; set; }
        public List<EmailRecipientGroupDto> EmailRecipientGroups { get; set; }        
    }
}
