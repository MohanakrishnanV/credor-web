using Credor.Client.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public interface IReportsService
    {
        List<UsersReportDto> GetUserReports(int admiuserid);
        List<InvestmentsReportDto> GetInvestmentReports(int admiuserid);
        List<DistributionsReportsDto> GetDistributionsReports();
        List<TaxReportsDto> GetTaxReports(int offeringId);
        List<FormDReportsDto> GetFormDReports(int offeringId);
        List<InvestorProfileUpdatesDto> GetInvestorProfileUpdatesReports();
    }
}
