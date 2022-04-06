using Credor.Client.Entities;
using Credor.Web.API.Common.UnitOfWork;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Credor.Web.API
{
    public class ReportsRepository : IReportsRepository
    {
        private readonly UnitOfWork _unitOfWork;        
        
        private readonly IConfiguration _configuration;
        public ReportsRepository(IConfiguration configuration)
        {
            _unitOfWork = new UnitOfWork(configuration);          
            _configuration = configuration;
        }
        public List<DistributionsReportsDto> GetDistributionsReports()
        {
            var contextData = _unitOfWork.DistributionsRepository.Context;
            try
            {
                var distributionsData = (from distribution in contextData.Distributions
                                      join investment in contextData.Investment on distribution.InvestmentId equals investment.Id
                                      join offering in contextData.PortfolioOffering on investment.OfferingId equals offering.Id
                                      join user in contextData.UserAccount on distribution.InvestorId equals user.Id
                                      join profile in contextData.UserProfile on investment.UserProfileId equals profile.Id
                                      join bankAccount in contextData.BankAccount on profile.BankAccountId equals bankAccount.Id
                                      where distribution.Active == true 
                                        && investment.Active == true
                                      select new DistributionsReportsDto
                                      {
                                          OfferingName = offering.Name,
                                          Status = (from status in contextData.InvestmentStatus where status.Id == investment.Status select status.Name).FirstOrDefault(),
                                          Name = user.FirstName + " " + user.LastName,
                                          Email = user.EmailId,
                                          Phone = user.PhoneNumber != null ? user.PhoneNumber : "-",
                                          ProfileName = (profile.FirstName + " " + profile.LastName) + profile.Name + profile.RetirementPlanName + profile.TrustName,
                                          ProfileId = profile.DisplayId,
                                          AddressLine1 = profile.StreetAddress1 == null ? profile.CheckAddressLine1 : profile.StreetAddress1,
                                          AddressLine2 = profile.StreetAddress2 == null ? profile.CheckAddressLine2 : profile.StreetAddress2,
                                          City = profile.City != null ? profile.City : "-",
                                          State = profile.State != null ? profile.State : "-",
                                          ZipCode = profile.ZipCode != null ? profile.ZipCode : "-",
                                          DisregardedEntity = profile.IsDisregardedEntity != null ? (Convert.ToBoolean(profile.IsDisregardedEntity) ? "Yes" : "No") : "-",
                                          IRALLC = profile.IsIRALLC != null ? (Convert.ToBoolean(profile.IsIRALLC) ? "Yes" : "No") : "-",
                                          ProfileTaxId = profile.TaxId != null ? profile.TaxId : "-",
                                          InvestmentAmount = investment.Amount,
                                          PaymentAmount = distribution.PaymentAmount,
                                          PaymentDate = distribution.PaymentDate,
                                          PercentageFunded = distribution.PercentageFunded, 
                                          PercentageOwnership = distribution.PercentageOwnership,
                                          SignedUpDate = user.LastLogin != null ? string.Format("{0:MMM dd, yyyy}", user.LastLogin) : "-",
                                          FundedDate = investment.FundedDate != null ? string.Format("{0:MMM dd, yyyy}", investment.FundedDate) : "-",
                                          IsVerified = (user.IsEmailVerified || user.IsPhoneVerified) ? "Yes" : "No",
                                          IsSelfAccredited = user.IsAccreditedInvestor == null ? "-" : (Convert.ToBoolean(user.IsAccreditedInvestor) ? "Yes" : "No"),
                                          DistributionMethod = (from method in contextData.DistributionType where method.Id == profile.DistributionTypeId select method.Name).FirstOrDefault(),
                                          BankName = bankAccount.BankName,
                                          AccountNumber = bankAccount.AccountNumber,
                                          RoutingNumber = bankAccount.RoutingNumber,
                                          AccountType = (from accountType in contextData.BankAccountType where accountType.Id == bankAccount.AccountType select accountType.Type).FirstOrDefault()                                          
                                      }).ToList();
                return distributionsData;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public List<InvestmentsReportDto> GetInvestmentReports(int adminUserId)
        {            
            var contextData = _unitOfWork.InvestmentRepository.Context;
            try
            {
                var investmentData = (from investment in contextData.Investment
                                      join offering in contextData.PortfolioOffering on investment.OfferingId equals offering.Id
                                      join user in contextData.UserAccount on investment.UserId equals user.Id
                                      join profile in contextData.UserProfile on investment.UserProfileId equals profile.Id
                                      join bankAccount in contextData.BankAccount on profile.BankAccountId equals bankAccount.Id
                                      where investment.Active == true                                    
                                      select new InvestmentsReportDto
                                        { 
                                          OfferingName = offering.Name,
                                          Status = (from status in contextData.InvestmentStatus where status.Id == investment.Status select status.Name).FirstOrDefault(),
                                          Name = user.FirstName + " " + user.LastName,
                                          Email = user.EmailId,
                                          OfferingId = offering.Id,
                                          Phone = user.PhoneNumber != null? user.PhoneNumber: "-",
                                          ProfileName = (profile.FirstName + " " + profile.LastName) + profile.Name + profile.RetirementPlanName + profile.TrustName,
                                          ProfileId = profile.DisplayId,
                                          AddressLine1 = profile.StreetAddress1 == null? profile.CheckAddressLine1: profile.StreetAddress1,
                                          AddressLine2 = profile.StreetAddress2 == null ? profile.CheckAddressLine2 : profile.StreetAddress2,
                                          City = profile.City!= null?profile.City:"-",
                                          State = profile.State != null?profile.State:"-",
                                          ZipCode = profile.ZipCode != null?profile.ZipCode:"-",
                                          DisregardedEntity = profile.IsDisregardedEntity != null?(Convert.ToBoolean(profile.IsDisregardedEntity)?"Yes":"No"):"-",
                                          IRALLC = profile.IsIRALLC != null ? (Convert.ToBoolean(profile.IsIRALLC) ? "Yes" : "No") : "-",
                                          ProfileTaxId = profile.TaxId != null? profile.TaxId:"-",
                                          InvestmentAmount = investment.Amount,
                                          PercentageFunded = (from investment in contextData.Investment
                                                              where investment.OfferingId == offering.Id
                                                                     && investment.Status == 1 // Approved
                                                                     && investment.Active == true// Active
                                                              select investment.Amount).Sum() != 0
                                                              ?(investment.Amount / (from investment in contextData.Investment
                                                                                    where investment.OfferingId == offering.Id
                                                                                           && investment.Status == 1 // Approved
                                                                                           && investment.Active == true // Active
                                                                                     select investment.Amount).Sum() * 100) : 0, 
                                          PercentageOwnership = (investment.Amount / offering.Size) * 100,
                                          SignedUpDate = user.LastLogin != null ? string.Format("{0:MMM dd, yyyy}", user.LastLogin) : "-",
                                          FundedDate = investment.FundedDate != null ? string.Format("{0:MMM dd, yyyy}", investment.FundedDate) : "-",
                                          IsVerified = (user.IsEmailVerified || user.IsPhoneVerified) ? "Yes" : "No",
                                          IsSelfAccredited = user.IsAccreditedInvestor == null ? "-" : (Convert.ToBoolean(user.IsAccreditedInvestor) ? "Yes" : "No"),
                                          AccreditationVerifiedBy = user.AccreditationVerifiedBy != null ? (user.AccreditationVerifiedBy == adminUserId ? "Yes" : "No") : "No",
                                          DistributionMethod = (from method in contextData.DistributionType where method.Id == profile.DistributionTypeId select method.Name).FirstOrDefault(),
                                          BankName = bankAccount.BankName,
                                          AccountNumber = bankAccount.AccountNumber,
                                          RoutingNumber = bankAccount.RoutingNumber,
                                          AccountType = (from accountType in contextData.BankAccountType where accountType.Id == bankAccount.AccountType select accountType.Type).FirstOrDefault(),
                                          OtherDetails = investment.Notes
                                      }).ToList();
                return investmentData;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }   
        public List<UsersReportDto> GetUserReports(int adminUserId)
        {
            var contextData = _unitOfWork.UserAccountRepository.Context;
            try
            {
                var usersData = (from user in contextData.UserAccount
                                     where user.Active == true
                                     && (user.RoleId == 1 || user.RoleId == 2)//Investor or Lead
                                     select new UsersReportDto
                                     {
                                         Name = user.FirstName + " " + user.LastName,
                                         Email = user.EmailId,
                                         Phone = user.PhoneNumber == null ? "-" : user.PhoneNumber,
                                         State = user.Residency == 0 ? user.Country :
                                                (from state in contextData.StateOrProvince
                                                 where state.Id == user.Residency
                                                 select state.Name).FirstOrDefault(),
                                         Status = user.RoleId == 1 ? "Investor" : "Lead",
                                         IsVerified = (user.IsEmailVerified || user.IsPhoneVerified) ? "Yes" : "No",
                                         IsSelfAccredited = user.IsAccreditedInvestor == null ? "-" : (Convert.ToBoolean(user.IsAccreditedInvestor) ? "Yes" : "No"),
                                         AccreditationVerifiedBy = user.AccreditationVerifiedBy != null ? (user.AccreditationVerifiedBy == adminUserId ? "Yes" : "No") : "No",
                                         Registered = user.LastLogin != null ? "Signed Up" : "Invited",
                                         SignUpDate = user.LastLogin != null?string.Format("{0:MMM dd, yyyy}", user.LastLogin):"-",
                                         InvestmentCapacity = user.Capacity == null ? "-" :
                                                            (from capacity in contextData.Capacity
                                                             where capacity.Id == user.Capacity
                                                             select capacity.CapacityRange).FirstOrDefault(),
                                         LeadSource = user.HeardFrom,
                                         AdditionalUsers = (from userPermission in contextData.UserPermission
                                                           join userAccount in contextData.UserAccount on userPermission.AccessGrantedTo equals userAccount.Id
                                                           where userPermission.UserId == user.Id && userPermission.Active == true
                                                           select userAccount.EmailId).ToList(),
                                         Notes = (from note in contextData.UserNotes
                                                  where note.UserId == user.Id
                                                  select note.Notes).ToList(),
                                         CreatedOn = user.CreatedOn
                                     }).OrderByDescending(x=>x.CreatedOn).ToList();
                return usersData;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public List<TaxReportsDto> GetTaxReports(int offeringId)
        {
            var contextData = _unitOfWork.InvestmentRepository.Context;
            try
            {
                var TaxData = (from investment in contextData.Investment
                            join distribution in contextData.Distributions on investment.Id equals distribution.InvestmentId
                            join offering in contextData.PortfolioOffering on investment.OfferingId equals offering.Id
                            join user in contextData.UserAccount on distribution.InvestorId equals user.Id
                            join profile in contextData.UserProfile on investment.UserProfileId equals profile.Id
                            join bankAccount in contextData.BankAccount on profile.BankAccountId equals bankAccount.Id
                            where distribution.Active == true
                            && investment.Active == true
                            && investment.OfferingId == offeringId
                               select new TaxReportsDto
                                         {
                                             OfferingId = offering.Id,
                                             OfferingName = offering.Name,                                             
                                             Name = user.FirstName + " " + user.LastName,
                                             ProfileName = (profile.FirstName + " " + profile.LastName) + profile.Name + profile.RetirementPlanName + profile.TrustName,
                                             ProfileType = (from profileType in contextData.UserProfileType where profileType.Id == profile.Type select profileType.Name).FirstOrDefault(),
                                             ProfileDisplayId= profile.DisplayId,                                             
                                             AddressLine1 = profile.StreetAddress1 == null ? profile.CheckAddressLine1 : profile.StreetAddress1,
                                             AddressLine2 = profile.StreetAddress2 == null ? profile.CheckAddressLine2 : profile.StreetAddress2,
                                             City = profile.City != null ? profile.City : "-",
                                             State = profile.State != null ? profile.State : "-",
                                             ZipCode = profile.ZipCode != null ? profile.ZipCode : "-",
                                             IsDisregardedEntity = profile.IsDisregardedEntity != null ? (Convert.ToBoolean(profile.IsDisregardedEntity) ? "Yes" : "No") : "-",
                                             IsIRALLC = profile.IsIRALLC != null ? (Convert.ToBoolean(profile.IsIRALLC) ? "Yes" : "No") : "-",
                                             ProfileTaxId = profile.TaxId != null ? profile.TaxId : "-",
                                             InvestmentAmount = investment.Amount,
                                             InvestmentBalance = 0, // To do    
                                             PercentageFunded = distribution.PercentageFunded,
                                             PercentageOwnerShip = distribution.PercentageOwnership,
                                             FundedDate = investment.FundedDate != null ? string.Format("{0:MMM dd, yyyy}", investment.FundedDate) : "-",
                                             CreatedOn = investment.CreatedOn,
                                             OperatingIncome = (from distribution in contextData.Distributions                                                                
                                                                where distribution.InvestmentId == investment.Id
                                                                && distribution.Type == 1 //Operating Income
                                                                select distribution.PaymentAmount).Sum(), 
                                             GainFromSales = (from distribution in contextData.Distributions
                                                              where distribution.InvestmentId == investment.Id
                                                           && distribution.Type == 4 //GainOnSale
                                                           select distribution.PaymentAmount).Sum(),
                                             ProceedsFromrRefi = (from distribution in contextData.Distributions
                                                                  where distribution.InvestmentId == investment.Id
                                                                   && distribution.Type == 5 //Refinance Proceeds
                                                                  select distribution.PaymentAmount).Sum() ,
                                             TotalReturnOfCapital = (from distribution in contextData.Distributions
                                                                     where distribution.InvestmentId == investment.Id
                                                                     && distribution.Type == 3 //Return Of Capital
                                                                select distribution.PaymentAmount).Sum(),
                                             PreferredReturn = (from distribution in contextData.Distributions
                                                                where distribution.InvestmentId == investment.Id
                                                                && distribution.Type == 6 //Preferred Return
                                                                select distribution.PaymentAmount).Sum(),
                                             Interest = (from distribution in contextData.Distributions
                                                         where distribution.InvestmentId == investment.Id
                                                         && distribution.Type == 7 //Interest
                                                         select distribution.PaymentAmount).Sum()
                                         }).OrderByDescending(x=>x.CreatedOn).Distinct().ToList();
                return TaxData;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public List<FormDReportsDto> GetFormDReports(int offeringId)
        {
            var contextData = _unitOfWork.InvestmentRepository.Context;
            try
            {
                var states = (from investment in contextData.Investment
                              join user in contextData.UserAccount on investment.UserId equals user.Id
                              join state in contextData.StateOrProvince on user.Residency equals state.Id
                              where investment.OfferingId == offeringId
                              && investment.Active == true
                              && investment.FundedDate != null
                              select state.Id).Distinct().ToList();
                var formDReports = (from stateId in states                                    
                                    select new FormDReportsDto
                                    {
                                        OfferingId = offeringId, 
                                        State = (from state in contextData.StateOrProvince where state.Id == stateId select state.Name).FirstOrDefault(),
                                        AmountFunded = (from user in contextData.UserAccount
                                                        join investment in contextData.Investment on user.Id equals investment.UserId
                                                        where investment.OfferingId == offeringId
                                                        && investment.Active == true
                                                        && investment.FundedDate != null
                                                        && user.Residency == stateId
                                                        select investment.Amount).Sum(),
                                        DateFirstFundReceived = (string.Format("{0:MMM dd, yyyy}",(from user in contextData.UserAccount
                                                                                                   join investment in contextData.Investment on user.Id equals investment.UserId
                                                                                                   where investment.OfferingId == offeringId
                                                                                                   && investment.Active == true
                                                                                                   && investment.FundedDate != null
                                                                                                   && user.Residency == stateId
                                                                                                   select investment.FundedDate
                                                        ).FirstOrDefault())),
                                        NoOfInvestors = (from user in contextData.UserAccount
                                                         join investment in contextData.Investment on user.Id equals investment.UserId
                                                         where investment.OfferingId == offeringId
                                                         && user.RoleId == 1// Investor
                                                         && user.Residency == stateId
                                                         select user.Id).Distinct().Count(),
                                        NonAccreditedInvestors = (from user in contextData.UserAccount
                                                                  join investment in contextData.Investment on user.Id equals investment.UserId
                                                                  where investment.OfferingId == offeringId
                                                                  && user.RoleId == 1// Investor
                                                                  && user.Residency == stateId
                                                                  && user.IsAccreditedInvestor == false
                                                                 select user.Id).Distinct().Count()
                                    }).OrderByDescending(x=>x.State).Distinct().ToList();
                return formDReports;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }
        }
        public List<InvestorProfileUpdatesDto> GetInvestorProfileUpdatesReports()
        {
            var contextData = _unitOfWork.UserProfileRepository.Context;
            try
            {                                
                return null;
            }
            catch (Exception e)
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
