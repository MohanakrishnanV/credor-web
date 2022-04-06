using Credor.Client.Entities;
using Credor.Web.API.Common.UnitOfWork;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public class ReportsService : IReportsService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IReportsRepository _reportsRepository;

        public IConfiguration _configuration { get; }
        public ReportsService(IReportsRepository reportsRepository,
                                IConfiguration configuration)
        {
            _unitOfWork = new UnitOfWork(configuration);
            _configuration = configuration;
            _reportsRepository = reportsRepository;

        }
        public List<DistributionsReportsDto> GetDistributionsReports()
        {
            return _reportsRepository.GetDistributionsReports();
        }

        public List<InvestmentsReportDto> GetInvestmentReports(int admiuserid)
        {
            return _reportsRepository.GetInvestmentReports(admiuserid);
        }

        public List<UsersReportDto> GetUserReports(int admiuserid)
        {
            return _reportsRepository.GetUserReports(admiuserid);
        }
        public List<TaxReportsDto> GetTaxReports(int offeringId)
        {
            return _reportsRepository.GetTaxReports(offeringId);
        }
        public List<FormDReportsDto> GetFormDReports(int offeringId)
        {
            return _reportsRepository.GetFormDReports(offeringId);
        }
        public List<InvestorProfileUpdatesDto> GetInvestorProfileUpdatesReports()
        {
            return _reportsRepository.GetInvestorProfileUpdatesReports();
        }        
    }
}
