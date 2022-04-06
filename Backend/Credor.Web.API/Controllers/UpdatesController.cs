﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API.Controllers
{
    [Route("Updates")]
    [ApiController]
    public class UpdatesController : ControllerBase
    {
        private readonly IUpdatesService _updatesService;
        public IConfiguration _configuration { get; }

        public UpdatesController(IUpdatesService updatesService,
                                        IConfiguration configuration
                                        )
        {
            _configuration = configuration;
            _updatesService = updatesService;
        }
        [HttpGet]
        [Route("getallportfolioupdates/{userid}")]
        public IActionResult GetAllPortfolioUpdates(int userid)
        {
            var updates = _updatesService.GetAllPortfolioUpdates(userid);
            return Ok(updates);
        }
        [HttpGet]
        [Route("getportfolioupdates/{offeringid}")]
        public IActionResult GetPortfolioUpdates(int offeringid)
        {
            var capTableData = _updatesService.GetPortfolioUpdates(offeringid);
            return Ok(capTableData);
        }
        [HttpGet]
        [Route("getportfolioupdate/{id}")]
        public IActionResult GetPortfolioUpdate(int id)
        {
            var capTableData = _updatesService.GetPortfolioUpdate(id);
            return Ok(capTableData);
        }
    }
}
