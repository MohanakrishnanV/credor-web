using Credor.Client.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API.Controllers
{
    [Route("Admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        public IConfiguration _configuration { get; }

        public AdminController(IAdminService adminService,
                                        IConfiguration configuration
                                        )
        {
            _configuration = configuration;
            _adminService = adminService;
        }
        [HttpPost]
        [Route("createadminuser")]
        public IActionResult CreateAdminUser([FromBody] UserAccountDto userAccount)
        {
            var status = _adminService.CreateUserAccount(userAccount);
            return Ok(status);
        }
        [HttpPut]
        [Route("updateadminuser")]
        public async Task<IActionResult> UpdateAdminUser([FromBody] UpdateUserAccountDto userAccount)
        {
            var status = await _adminService.UpdateUserAccount(userAccount);
            return Ok(status);
        }
        [HttpDelete]
        [Route("deleteadminuser/{id}/{currentuserid}")]
        public IActionResult DeleteAdminUser(int id, int currentuserid)
        {
            var status = _adminService.DeleteUserAccount(id, currentuserid);
            return Ok(status);
        }
        [HttpPut]
        [Route("updatepassword")]
        public IActionResult UpdatePassword([FromBody] UpdatePasswordDto updatePasswordDto)
        {
            var status = _adminService.UpdatePassword(updatePasswordDto);
            return Ok(status);
        }
        [HttpPut]
        [Route("addprofileimage")]
        public async Task<IActionResult> AddProfileImage([FromBody] DocumentModelDto documentModel)
        {
            var status = await _adminService.AddProfileImage(documentModel);
            return Ok(status);
        }
    }
}
