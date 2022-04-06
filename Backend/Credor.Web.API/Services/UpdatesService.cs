using Credor.Web.API.Common.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Client.Entities;
using Microsoft.Extensions.Configuration;

namespace Credor.Web.API
{
    public class UpdatesService :IUpdatesService
    {
        private readonly IUpdatesRepository _updatesRespository;
        private readonly UnitOfWork _unitOfWork;
        public UpdatesService(IUpdatesRepository updatesRespository,
                             IConfiguration configuration)
        {
            _updatesRespository = updatesRespository;
            _unitOfWork = new UnitOfWork(configuration);
        }
        public List<PortfolioUpdatesDto> GetAllPortfolioUpdates(int userid)
        {
            return _updatesRespository.GetAllPortfolioUpdates(userid);
        }
        public List<PortfolioUpdatesDto> AddPortfolioUpdates(PortfolioUpdatesDto portfolioUpdatesDto)
        {
            return _updatesRespository.AddPortfolioUpdates(portfolioUpdatesDto);
        }
        public List<PortfolioUpdatesDto> GetPortfolioUpdates(int offeringId)
        {
            return _updatesRespository.GetPortfolioUpdates(offeringId);
        }
        public List<PortfolioUpdatesDto> UpdatePortfolioUpdates(PortfolioUpdatesDto portfolioUpdatesDto)
        {
            return _updatesRespository.UpdatePortfolioUpdates(portfolioUpdatesDto);
        }
        public List<PortfolioUpdatesDto> DeletePortfolioUpdates(int Id, int offeringId, int adminUserId)
        {
            return _updatesRespository.DeletePortfolioUpdates(Id, offeringId, adminUserId);
        }
        public PortfolioUpdatesDto GetPortfolioUpdate(int id)
        {
            return _updatesRespository.GetPortfolioUpdate(id);
        }
        public List<CredorFromEmailAddressDto> GetCredorFromEmailAddresses()
        {
            return _updatesRespository.GetCredorFromEmailAddresses();
        }
    }
}

