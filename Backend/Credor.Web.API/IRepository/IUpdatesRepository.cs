using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Client.Entities;

namespace Credor.Web.API
{
    public interface IUpdatesRepository
    {
        public List<PortfolioUpdatesDto> GetAllPortfolioUpdates(int userid);
        List<PortfolioUpdatesDto> AddPortfolioUpdates(PortfolioUpdatesDto portfolioUpdatesDto);
        public List<PortfolioUpdatesDto> GetPortfolioUpdates(int offeringId);
        List<PortfolioUpdatesDto> UpdatePortfolioUpdates(PortfolioUpdatesDto portfolioUpdatesDto);
        List<PortfolioUpdatesDto> DeletePortfolioUpdates(int Id, int offeringId, int adminUserId);
        List<CredorFromEmailAddressDto> GetCredorFromEmailAddresses();
        PortfolioUpdatesDto GetPortfolioUpdate(int id);
    }
}
