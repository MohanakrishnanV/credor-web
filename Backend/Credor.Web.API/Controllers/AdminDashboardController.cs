using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Credor.Web.API.Controllers
{
    [Route("AdminDashboard")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _adminDashboardService;
        public IConfiguration _configuration { get; }
        public AdminDashboardController(IAdminDashboardService adminDashboardService,IConfiguration configuration)
        {
            _adminDashboardService = adminDashboardService;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("getleads")]
        public IActionResult GetLeads()
        {
            var leadsList = _adminDashboardService.GetLeads();
            return Ok(leadsList);
        }

        [HttpGet]
        [Route("getadminoffering")]
        public IActionResult GetAdminOfferings()
        {
            var offeringList = _adminDashboardService.GetAdminOffering();
            return Ok(offeringList);
        }

        [HttpGet]
        [Route("getuserinvestordetails")]
        public IActionResult GetUserInvestorDetails()
        {
            var userInvestorList = _adminDashboardService.GetUserInvestorDetails();
            return Ok(userInvestorList);
        }

        [HttpGet]
        [Route("getadminheadersummary")]
        public IActionResult GetAdminHeaderSummary()
        {
            var adminHeaderList = _adminDashboardService.GetAdminHeaderSummary();
            return Ok(adminHeaderList);
        }
    }
}
