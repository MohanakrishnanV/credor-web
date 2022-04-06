using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API.Controllers
{
    [Route("Reports")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;
        public IConfiguration _configuration { get; }

        public ReportsController(IReportsService reportsService,
                                        IConfiguration configuration
                                        )
        {
            _configuration = configuration;
            _reportsService = reportsService;
        }
        [HttpGet]
        [Route("getusersreports/{admiuserid}")]
        public IActionResult GetUsersReports(int admiuserid)
        {
            var usersReports = _reportsService.GetUserReports(admiuserid);
            return Ok(usersReports);
        }
        [HttpGet]
        [Route("getinvestmentsreports/{admiuserid}")]
        public IActionResult GetInvestmentsReports(int admiuserid)
        {
            var reports = _reportsService.GetInvestmentReports(admiuserid);
            return Ok(reports);
        }
        [HttpGet]
        [Route("getdistributionsreports")]
        public IActionResult GetDistributionsReports()
        {
            var reports = _reportsService.GetDistributionsReports();
            return Ok(reports);
        }
        [HttpGet]
        [Route("gettaxreports/{offeringid}")]
        public IActionResult GetTaxReports(int offeringid)
        {
            var reports = _reportsService.GetTaxReports(offeringid);
            return Ok(reports);
        }
        [HttpGet]
        [Route("getformdreports/{offeringid}")]
        public IActionResult GetFormDReports(int offeringid)
        {
            var reports = _reportsService.GetFormDReports(offeringid);
            return Ok(reports);
        }
        [HttpGet]
        [Route("getinvestorprofileupdatesreports")]
        public IActionResult GetInvestorProfileUpdatesReports()
        {
            var reports = _reportsService.GetInvestorProfileUpdatesReports();
            return Ok(reports);
        }
    }
}
