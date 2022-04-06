using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Web.API.Common.UnitOfWork;
using AutoMapper;
using Credor.Client.Entities;
using Microsoft.Extensions.Configuration;

namespace Credor.Web.API
{
    public class DistributionsRepository : IDistributionsRepository
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public DistributionsRepository(IMapper mapper, IConfiguration configuration)
        {
            _unitOfWork = new UnitOfWork(configuration);
            _mapper = mapper;
        }       
        public DistributionDataDto GetAllDistributions(int userId)
        {
            List<DistributionsDto> distributions = new List<DistributionsDto>();
            var contextData = _unitOfWork.PaymentRepository.Context;
            try
            {
                var TotalInvested = (from investment in contextData.Investment
                                    where investment.UserId == userId
                                    //&& investment.Status == 1// Approved by admin
                                    && investment.Active == true // Active Investment
                                    select investment.Amount).Sum();
                var OperatingIncome = (from distribution in contextData.Distributions
                                       where distribution.InvestorId == userId
                                             && distribution.Type == 1 //Operating Income
                                             && distribution.Active == true
                                       select distribution.PaymentAmount).Sum();
                var RetainedEarnings = (from distribution in contextData.Distributions                                        
                                        where distribution.InvestorId == userId
                                              && distribution.Type == 2 //Retained Earnings
                                              && distribution.Active == true
                                        select distribution.PaymentAmount).Sum();
                var ReturnOfCapital = (from distribution in contextData.Distributions
                                        where distribution.InvestorId == userId
                                              && distribution.Type == 3 //Return of Capital
                                              && distribution.Active == true
                                       select distribution.PaymentAmount).Sum();
                var GainFromSale = (from distribution in contextData.Distributions
                                        where distribution.InvestorId == userId
                                              && distribution.Type == 4 //Gain from Sale
                                              && distribution.Active == true
                                    select distribution.PaymentAmount).Sum();
                var ProceedsFromRefi = (from distribution in contextData.Distributions
                                        where distribution.InvestorId == userId
                                              && distribution.Type == 5 //Proceeds from Refi
                                              && distribution.Active == true
                                        select distribution.PaymentAmount).Sum();
                var PreferredReturn = (from distribution in contextData.Distributions
                                        where distribution.InvestorId == userId
                                              && distribution.Type == 6 //Preferred Return
                                              && distribution.Active == true
                                       select distribution.PaymentAmount).Sum();
                var Interest = (from distribution in contextData.Distributions
                                        where distribution.InvestorId == userId
                                              && distribution.Type == 7 //Interest
                                              && distribution.Active == true
                                select distribution.PaymentAmount).Sum();
                distributions = (from distribution in contextData.Distributions 
                                 join investment in contextData.Investment on distribution.InvestmentId equals investment.Id
                                 join userAccount in contextData.UserAccount on investment.UserId equals userAccount.Id
                                 join userProfile in contextData.UserProfile on investment.UserProfileId equals userProfile.Id
                                 join offering in contextData.PortfolioOffering on investment.OfferingId equals offering.Id
                                 join distributionType in contextData.DistributionType on distribution.DistributionMethod equals distributionType.Id
                                 join profileType in contextData.UserProfileType on userProfile.Type equals profileType.Id
                                 join portfolioDistType in contextData.PortfolioDistributionType on distribution.Type equals portfolioDistType.Id
                                 where distribution.InvestorId == userId 
                                        && distribution.Active == true
                                      select new DistributionsDto
                                      {
                                          Id = investment.Id,
                                          UserId = investment.UserId,
                                          UserProfileId = investment.UserProfileId,
                                          OfferingId = investment.OfferingId,
                                          PaymentId = distribution.Id,
                                          OfferingName = offering.Name,                                         
                                          AmountInvested = investment.Amount,
                                          AmountReceived = distribution.PaymentAmount,
                                          ReceivedDate = distribution.PaymentDate,
                                          Type = portfolioDistType.Name,
                                          Memo = distribution.Memo,
                                          DistributionMethod = distributionType.Name,                                    
                                          UserProfileType = profileType.Name,
                                          UserProfile = userProfile.FirstName + " " + userProfile.LastName + userProfile.Name + userProfile.RetirementPlanName + userProfile.TrustName,
                                      }
                                      ).ToList();
              var singledistribution = (from distribution in contextData.Distributions          
                                 join offeringDistribution in contextData.OfferingDistribution on distribution.OfferingDistributionId equals offeringDistribution.Id
                                 join userAccount in contextData.UserAccount on distribution.InvestorId equals userAccount.Id
                                 join userProfile in contextData.UserProfile on userAccount.Id equals userProfile.UserId
                                 join offering in contextData.PortfolioOffering on offeringDistribution.OfferingId equals offering.Id
                                 join distributionType in contextData.DistributionType on distribution.DistributionMethod equals distributionType.Id                               
                                 join portfolioDistType in contextData.PortfolioDistributionType on distribution.Type equals portfolioDistType.Id
                                        where distribution.InvestorId == userId
                                        && distribution.Active == true
                                        && userProfile.IsOwner == true
                                 select new DistributionsDto
                                 {                                   
                                     UserId = Convert.ToInt32(distribution.InvestorId),                                
                                     OfferingId = offeringDistribution.OfferingId,
                                     PaymentId = distribution.Id,
                                     OfferingName = offering.Name,
                                     AmountInvested = 0,
                                     AmountReceived = distribution.PaymentAmount,
                                     ReceivedDate = distribution.PaymentDate,
                                     Type = portfolioDistType.Name,
                                     Memo = distribution.Memo,
                                     DistributionMethod = distributionType.Name,
                                     UserProfileType = "Individual",                                   
                                     UserProfile = userProfile.FirstName + " " + userProfile.LastName + userProfile.Name + userProfile.RetirementPlanName + userProfile.TrustName,
                                 }
                                     ).ToList();


                distributions.AddRange(singledistribution);
                DistributionDataDto distributionData = new DistributionDataDto();
                DistributionFooterDto distributionFooterDto = new DistributionFooterDto();
                distributionFooterDto.TotalInvested = TotalInvested;
                distributionFooterDto.OperatingIncome = OperatingIncome;
                distributionFooterDto.RetainedEarnings = RetainedEarnings;
                distributionFooterDto.ReturnOfCapital = ReturnOfCapital;
                distributionFooterDto.GainFromSale = GainFromSale;
                distributionFooterDto.ProceedsFromRefi = ProceedsFromRefi;
                distributionFooterDto.PreferredReturn = PreferredReturn;
                distributionFooterDto.Interest = Interest;

                distributionData.Distributions = distributions;
                distributionData.DistributionFooter = distributionFooterDto;

                return distributionData;

            }
            catch(Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;                
            }
            
        }
    }
}
