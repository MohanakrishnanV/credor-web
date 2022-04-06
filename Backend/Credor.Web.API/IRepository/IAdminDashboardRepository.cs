using Credor.Client.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public interface IAdminDashboardRepository
    {
        List<UserAccountDto> GetLeads();
        List<PortfolioOfferingDto> GetAdminOffering();
        UserInvestorDto GetUserInvestorDetails();
        HeaderSummaryDto GetAdminHeaderSummary();
    }
}
