using Credor.Client.Entities;
using Credor.Web.API.Common.UnitOfWork;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IAdminDashboardRepository _adminDashboardRepository;
        public IConfiguration _configuration { get; }
        public AdminDashboardService(IAdminDashboardRepository adminDashboardRepository,IConfiguration configuration)
        {
            _adminDashboardRepository = adminDashboardRepository;
            _configuration = _configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        public List<UserAccountDto> GetLeads()
        {
            return _adminDashboardRepository.GetLeads();
        }

        public List<PortfolioOfferingDto> GetAdminOffering()
        {
            return _adminDashboardRepository.GetAdminOffering();
        }

        public UserInvestorDto GetUserInvestorDetails()
        {
            return _adminDashboardRepository.GetUserInvestorDetails();
        }

        public HeaderSummaryDto GetAdminHeaderSummary()
        {
            return _adminDashboardRepository.GetAdminHeaderSummary();
        }
    }
}
