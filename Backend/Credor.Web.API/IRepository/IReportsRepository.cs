using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Client.Entities;
using Credor.Data.Entities;

namespace Credor.Web.API
{
    public interface IReportsRepository
    {
        List<UsersReportDto> GetUserReports(int admiuserid);
        List<InvestmentsReportDto> GetInvestmentReports(int admiuserid);
        List<DistributionsReportsDto> GetDistributionsReports();
        List<TaxReportsDto> GetTaxReports(int offeringId);
        List<FormDReportsDto> GetFormDReports(int offeringId);
        List<InvestorProfileUpdatesDto> GetInvestorProfileUpdatesReports();
    }
}
