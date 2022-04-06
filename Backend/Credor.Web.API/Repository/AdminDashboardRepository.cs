using AutoMapper;
using Credor.Client.Entities;
using Credor.Data.Entities;
using Credor.Web.API.Common;
using Credor.Web.API.Common.UnitOfWork;
using Credor.Web.API.Shared;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public class AdminDashboardRepository : IAdminDashboardRepository
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHubContext<NotificationHub> _hubContext;
        public IConfiguration _configuration { get; }

        public AdminDashboardRepository(IHubContext<NotificationHub> hubContext,
                                        IMapper mapper,
                                        IConfiguration configuration)
        {
            _unitOfWork = new UnitOfWork(configuration);
            _mapper = mapper;
            _configuration = configuration;
            _hubContext = hubContext;
        }

        public List<UserAccountDto> GetLeads()
        {
            try
            {
                List<UserAccountDto> updateAdminAccountDto = new List<UserAccountDto>();
                var contextData = _unitOfWork.UserAccountRepository.Context;
                updateAdminAccountDto = (from ua in contextData.UserAccount
                                         where ua.RoleId == 2
                                         select new UserAccountDto
                                         {
                                             Id = ua.Id,
                                             FullName = ua.FirstName + ' ' + ua.LastName,
                                             VerifyAccount = ua.VerifyAccount
                                         }).ToList();
                return updateAdminAccountDto;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }

        }

        public List<PortfolioOfferingDto> GetAdminOffering()
        {
            try
            {
                List<PortfolioOfferingDto> portfolioOfferingDto = new List<PortfolioOfferingDto>();
                var contextData = _unitOfWork.PortfolioOfferingRepository.Context;
                portfolioOfferingDto = (from pf in contextData.PortfolioOffering
                                        join os in contextData.OfferingStatus on pf.Status equals os.Id
                                        where pf.IsReservation == false && pf.Active == true
                                        select new PortfolioOfferingDto
                                        {
                                            Id = pf.Id,
                                            Name = pf.Name,
                                            StatusName = os.Name
                                        }).ToList();
                return portfolioOfferingDto;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        public UserInvestorDto GetUserInvestorDetails()
        {
            try
            {
                var contextData = _unitOfWork.UserAccountRepository.Context;
                UserInvestorDto userInvestorDto = new UserInvestorDto();
                userInvestorDto.AllUsers = (from ua in contextData.UserAccount select ua.Id).Count();
                userInvestorDto.VerifiedUsers = (from lead in contextData.UserAccount
                                                where lead.RoleId == 2 // Lead Role
                                                && lead.Active == true //Active Leads      
                                                && (lead.IsEmailVerified == true //Account verified via Email
                                                 || lead.IsPhoneVerified) // Account verified via text code
                                                select lead.Id).Count();
                userInvestorDto.UnVerifiedUsers = (from lead in contextData.UserAccount
                                                  where lead.RoleId == 2 // Lead Role
                                                  && lead.Active == true //Active Leads      
                                                  && lead.IsEmailVerified == false //Account not verified via Email
                                                  && lead.IsPhoneVerified == false // Account not verified via text code
                                                  && lead.IsAccreditedInvestor == false //Not Accredited Account
                                                  select lead.Id).Count();
                userInvestorDto.Investors = (from lead in contextData.UserAccount
                                            where lead.RoleId == 1 // Investor Role
                                            && lead.Active == true //Active Investor                                         
                                            select lead.Id).Count();

                return userInvestorDto;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        public HeaderSummaryDto GetAdminHeaderSummary()
        {
            try
            {
                HeaderSummaryDto headerSummaryDto = new HeaderSummaryDto();
                var contextData = _unitOfWork.InvestmentRepository.Context;
                headerSummaryDto.ActiveInvestments = (from investment in contextData.Investment
                                                      join offering in contextData.PortfolioOffering on investment.OfferingId equals offering.Id
                                                      where investment.Active == true // Active Investment
                                                      && offering.Active == true && (offering.Status == 2 || offering.Status == 3)
                                                      select investment.Amount).Sum();
                headerSummaryDto.TotalInvestments = (from investment in contextData.Investment
                                                     join offering in contextData.PortfolioOffering on investment.OfferingId equals offering.Id
                                                     where investment.Active == true // Active Investment
                                                     && offering.Active == true && (offering.Status == 2 || offering.Status == 3)
                                                     select investment.Id).Count();
                if(headerSummaryDto.TotalInvestments != 0)
                {
                    headerSummaryDto.AverageInvestment = headerSummaryDto.ActiveInvestments / headerSummaryDto.TotalInvestments;
                }
                headerSummaryDto.InvestedAllTime = (from investment in contextData.Investment
                                                    join offering in contextData.PortfolioOffering on investment.OfferingId equals offering.Id
                                                    where investment.Active == true // Active Investment
                                                    && offering.Active == true && (offering.Status == 2 || offering.Status == 3 || offering.Status == 4)
                                                    select investment.Amount).Sum();
                headerSummaryDto.Distributions = (from dist in contextData.Distributions
                                                  where dist.Active == true && dist.Status == 2//Status Paid
                                                  select dist.PaymentAmount).Sum();
                return headerSummaryDto;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return null;
            }
        }
    }

    
}
