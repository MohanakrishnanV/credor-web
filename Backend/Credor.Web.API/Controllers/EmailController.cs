using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Client.Entities;

namespace Credor.Web.API.Controllers
{
    [Route("Email")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        public IConfiguration _configuration { get; }

        public EmailController(IEmailService emailService,
                                        IConfiguration configuration
                                        )
        {
            _configuration = configuration;
            _emailService = emailService;
        }
        [HttpGet]
        [Route("getcredorfromemailaddresses")]
        public IActionResult GetCredorFromEmailAddresses()
        {
            var emailAddresses = _emailService.GetCredorFromEmailAddresses();
            return Ok(emailAddresses);
        }
        [HttpGet]
        [Route("getcredordomains")]
        public IActionResult GetCredorDomains()
        {
            var domains = _emailService.GetCredorDomains();
            return Ok(domains );
        }
        [HttpGet]
        [Route("getemailtemplates")]
        public IActionResult GetEmailTemplates()
        {
            var emailTemplates = _emailService.GetEmailTemplates();
            return Ok(emailTemplates);
        }
        [HttpPost]
        [Route("addcredordomain")]
        public IActionResult AddCredorDomain([FromBody] CredorDomainDto credorDomain)
        {
            var domains = _emailService.AddCredorDomain(credorDomain);
            return Ok(domains);
        }
        [HttpPut]
        [Route("updatecredordomain")]
        public IActionResult UpdateCredorDomain([FromBody] CredorDomainDto credorDomain)
        {
            var domains = _emailService.UpdateCredorDomain(credorDomain);
            return Ok(domains);
        }
        [HttpDelete]
        [Route("deletecredordomain/{domainid}/{adminuserid}")]
        public IActionResult DeleteCredorDomain(int domainid, int adminuserid)
        {
            var domains = _emailService.DeleteCredorDomain(domainid,adminuserid);
            return Ok(domains);
        }
        [HttpPost]
        [Route("addcredorfromemailaddress")]
        public IActionResult AddCredorFromEmailAddress([FromBody] CredorFromEmailAddressDto credorFromEmailAddress)
        {
            var emailAddresses = _emailService.AddCredorFromEmailAddress(credorFromEmailAddress);
            return Ok(emailAddresses);
        }
        [HttpPut]
        [Route("updatecredorfromemailaddress")]
        public IActionResult UpdateCredorFromEmailAddress([FromBody] CredorFromEmailAddressDto credorFromEmailAddress)
        {
            var emailAddresses = _emailService.UpdateCredorFromEmailAddress(credorFromEmailAddress);
            return Ok(emailAddresses);
        }
        [HttpDelete]
        [Route("deletecredorfromemailaddress/{fromemailaddressid}/{adminuserid}")]
        public IActionResult DeleteCredorFromEmailAddress(int fromemailaddressid, int adminuserid)
        {
            var emailAddresses = _emailService.DeleteCredorFromEmailAddress(fromemailaddressid, adminuserid);
            return Ok(emailAddresses);
        }
        [HttpPost]
        [Route("addemailtemplate")]
        public IActionResult AddEmailTemplate([FromBody] EmailTemplateDto emailTemplate)
        {
            var emailTemplates = _emailService.AddEmailTemplate(emailTemplate);
            return Ok(emailTemplates);
        }
        [HttpPut]
        [Route("updateemailtemplate")]
        public IActionResult UpdateEmailTemplate([FromBody] EmailTemplateDto emailTemplate)
        {
            var emailTemplates = _emailService.UpdateEmailTemplate(emailTemplate);
            return Ok(emailTemplates);
        }
        [HttpDelete]
        [Route("deleteemailtemplate/{emailtemplateid}/{adminuserid}")]
        public IActionResult DeleteEmailTemplate(int emailtemplateid, int adminuserid)
        {
            var emailTemplates = _emailService.DeleteEmailTemplate(emailtemplateid, adminuserid);
            return Ok(emailTemplates);
        }
        [HttpGet]
        [Route("getemailtypes")]
        public IActionResult GetEmailTypes()
        {
            var emailTypes = _emailService.GetEmailTypes();
            return Ok(emailTypes);
        }
        [HttpGet]
        [Route("getemailrecipients")]
        public IActionResult GetEmailRecipients()
        {
            var emailrecipients = _emailService.GetEmailRecipients();
            return Ok(emailrecipients);
        }
        [HttpPost]
        [Route("resendmail/{emaildetailid}/{adminuserid}")]
        public async Task<IActionResult> ResendMail(int emaildetailid, int adminuserid)
        {
            var result = await _emailService.ResendMail(emaildetailid, adminuserid);
            return Ok(result);
        }
        [HttpPost]
        [Route("sendmail")] 
        public async Task<IActionResult> SendMail([FromForm] SendMailRequestDto sendMailRequest)
        {
            var result = await _emailService.SendMail(sendMailRequest);
            return Ok(result);
        }
        [HttpPut]
        [Route("deletecredoremaildetailbyid")]
        public IActionResult DeleteCredorEmailDetailById([FromBody] DeleteCredorEmailDetailDto deleteCredorEmailDetailDto)
        {
            var result =  _emailService.DeleteCredorEmailDetailById(deleteCredorEmailDetailDto);
            return Ok(result);
        }
        [HttpPut]
        [Route("archivecredoremaildetailbyid")]
        public IActionResult ArchiveCredorEmailDetailById([FromBody] ArchiveCredorEmailDetailDto archiveCredorEmailDetailDto)
        {
            var result = _emailService.ArchiveCredorEmailDetailById(archiveCredorEmailDetailDto);
            return Ok(result);
        }
        [HttpPost]
        [Route("sendmailtest")]
        public async Task<IActionResult> SendMailTest(IFormFile file1, IFormFile file2)
        {
            SendMailRequestDto sendMailRequest = new SendMailRequestDto();
            sendMailRequest.AdminUserId = 34;
            sendMailRequest.EmailTypeId = 1;
            sendMailRequest.EmailTemplateId = 33;
            sendMailRequest.FromEmailAddressId = 1;
            sendMailRequest.Attachments = null;
            sendMailRequest.ReplyTo = "maheswari.mahendran@excelenciaconsulting.com";
            sendMailRequest.Subject = "New Investment Announcements!";
            List<string> test = new List<string>();
            //test.Add("group_1");
            //test.Add("tag_1");
            test.Add("user_130,user_39,user_129,user_14");
            List<IFormFile> filelist = new List<IFormFile>();           
            sendMailRequest.Attachments = filelist;
            sendMailRequest.Attachments.Add(file1);
            sendMailRequest.Attachments.Add(file2);           
            sendMailRequest.EmailRecipientGroups = test;
            var result = await _emailService.SendMail(sendMailRequest);
            return Ok(result);
        }
        [HttpGet]
        [Route("getcredoremaildetails")]
        public IActionResult GetCredorEmailDetails()
        {
            var emailDetails = _emailService.GetCredorEmailDetails();
            return Ok(emailDetails);
        }
        [HttpGet]
        [Route("getallcredoremaildetail/{credoremaildetailid}")]
        public IActionResult GetAllCredorEmailDetail(int credoremaildetailid)
        {
            var emailDetails = _emailService.GetAllCredorEmailDetail(credoremaildetailid);
            return Ok(emailDetails);
        }
        [HttpGet]
        [Route("getsystemnotifications")]
        public IActionResult GetSystemNotifications()
        {
            var emailDetails = _emailService.GetSystemNotifications();
            return Ok(emailDetails);
        }
    }
}
