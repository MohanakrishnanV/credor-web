using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Client.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Credor.Web.API.Controllers
{
    [Route("Settings")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingsService _settingsService;
        public IConfiguration _configuration { get; }
        public SettingsController(ISettingsService settingsService,IConfiguration configuration)
        {
            _settingsService = settingsService;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("getbyroleId/{roleid}")]
        public IActionResult GetByRoleId(int roleid)
        {
            var userList = _settingsService.GetByRoleId(roleid);
            return Ok(userList);
        }

        [HttpPost]
        [Route("saveadminuser")]
        public IActionResult SaveAdminUser([FromBody] AdminAccountDto adminAccountDto)
        {
            var status = _settingsService.SaveAdminUser(adminAccountDto);
            if (status == 1)
            {
                return Ok(new { StatusCode = status, Message = "Added  Successful" });
            }
            else if (status == 2)
            {
                return Ok(new { StatusCode = status, Message = "Invalid Data" });
            }
            else if (status == 3)
            {
                return Ok(new { StatusCode = status, Message = "Active/Approved Account Already Exists" });
            }
            else
            {
                return Ok(new { StatusCode = status, Message = "Invalid" });
            }
        }

        [HttpPut]
        [Route("updateadminuser")]
        public IActionResult UpdateAdminUser([FromBody] AdminAccountDto adminAccountDto)
        {
            var status = _settingsService.UpdateAdminUser(adminAccountDto);
            return Ok(status);
        }

        [HttpPut]
        [Route("deleteadminuser")]
        public IActionResult DeleteAdminUser([FromBody] AdminAccountDto adminAccountDto)
        {
            var status = _settingsService.DeleteAdminUser(adminAccountDto);
            return Ok(status);
        }

        [HttpPut]
        [Route("updateadminaccount")]
        public async Task<IActionResult> UpdateAdminAccount([FromForm] UpdateAdminAccountDto updateAdminAccountDto)
        {
            var status = await _settingsService.UpdateAdminAccount(updateAdminAccountDto);
            return Ok(status);
        }

        [HttpPut]
        [Route("adminuseraccountstatus")]
        public IActionResult AdminUserAccountStatus([FromBody] AdminAccountDto adminAccountDto)
        {
            var status = _settingsService.AdminUserAccountStatus(adminAccountDto);
            return Ok(status);
        }

        [HttpGet]
        [Route("getrolefeaturemapping/{roleid}")]
        public IActionResult GetRoleFeatureMapping(int roleId)
        {
            var roleList = _settingsService.GetRoleFeatureMapping(roleId);
            return Ok(roleList);
        }

        [HttpGet]
        [Route("getuserfeaturemapping/{userid}")]
        public IActionResult GetUserFeatureMapping(int userid)
        {
            var userList = _settingsService.GetUserFeatureMapping(userid);
            return Ok(userList);
        }

        [HttpPut]
        [Route("updateowneraccount")]
        public IActionResult UpdateOwnerAccount([FromBody] AdminAccountDto adminAccountDto)
        {
            var status = _settingsService.UpdateOwnerAccount(adminAccountDto);
            return Ok(status);
        }

        [HttpGet]
        [Route("getemailtemplate")]
        public IActionResult GetEmailTemplate()
        {
            var emailList = _settingsService.GetEmailTemplate();
            return Ok(emailList);
        }

        [HttpPut]
        [Route("updateemailtemplate")]
        public IActionResult UpdateEmailTemplate([FromBody] CredorEmailTemplateDto credorEmailTemplate)
        {
            var status = _settingsService.UpdateEmailTemplate(credorEmailTemplate);
            return Ok(status);
        }

        [HttpPut]
        [Route("activeinactiveemailtemplate")]
        public IActionResult ActiveInactiveEmailTemplate([FromBody] CredorEmailTemplateDto credorEmailTemplate)
        {
            var status = _settingsService.ActiveInactiveEmailTemplate(credorEmailTemplate);
            return Ok(status);
        }

        [HttpGet]
        [Route("credorinfo")]
        public IActionResult CredorInfo()
        {
            var CredorInfoList = _settingsService.CredorInfo();
            return Ok(CredorInfoList);
        }

        [HttpPut]
        [Route("credorinfoupdate")]
        public IActionResult CredorInfoUpdate(CredorInfoDto credorInfoDto)
        {
            var status = _settingsService.CredorInfoUpdate(credorInfoDto);
            return Ok(status);
        }

    }
}
