using AutoMapper;
using Credor.Web.API.Common.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Credor.Client.Entities;
using Microsoft.Extensions.Configuration;
using Credor.Data.Entities;

namespace Credor.Web.API
{
    public class UpdatesRepository : IUpdatesRepository
    {
        private readonly UnitOfWork _unitOfWork;       
        private readonly IMapper _mapper;
        public UpdatesRepository(IMapper mapper,
                                 IConfiguration configuration)
        {
            _unitOfWork = new UnitOfWork(configuration);
            _mapper = mapper;
        }
        public List<PortfolioUpdatesDto> GetAllPortfolioUpdates(int userid)
        {
            List<PortfolioUpdatesDto> updates = new List<PortfolioUpdatesDto>();
            var contextData = _unitOfWork.PortfolioUpdatesRepository.Context;
            try
            {
                updates = (from investment in contextData.Investment
                           join offering in contextData.PortfolioOffering on investment.OfferingId equals offering.Id
                           join update in contextData.PortfolioUpdates on offering.Id equals update.OfferingId
                           where investment.UserId == userid
                                && update.Active == true
                                && investment.Active == true
                                select new PortfolioUpdatesDto
                                {
                                    Id = update.Id, 
                                    OfferingId = investment.OfferingId,
                                    Name = offering.Name,
                                    Subject = update.Subject,
                                    //Content = update.Content,                                    
                                    Active = update.Active,
                                    Status = update.Status,
                                    CreatedOn = update.CreatedOn,
                                    CreatedBy = update.CreatedBy,
                                    ModifiedOn = update.ModifiedOn,
                                    ModifiedBy = update.ModifiedBy
                                }).OrderByDescending(x=>x.CreatedOn).Distinct().ToList();
            }
            catch(Exception e)
            {
                var exception = e.ToString();
                updates = null;
            }
            finally
            {
                contextData = null;
            }
            return updates;
        }
        public PortfolioUpdatesDto GetPortfolioUpdate(int id)
        {           
            var contextData = _unitOfWork.PortfolioUpdatesRepository.Context;
            try
            {
                var updates = (from update in contextData.PortfolioUpdates
                               join offering in contextData.PortfolioOffering on update.OfferingId equals offering.Id
                               where update.Id == id
                               select new PortfolioUpdatesDto
                               {
                                   Id = update.Id,
                                   OfferingId = update.OfferingId,
                                   Name = offering.Name,
                                   Subject = update.Subject,
                                   Content = update.Content,
                                   Active = update.Active,
                                   Status = update.Status,
                                   CreatedOn = update.CreatedOn,
                                   CreatedBy = update.CreatedBy,
                                   ModifiedOn = update.ModifiedOn,
                                   ModifiedBy = update.ModifiedBy
                               }).FirstOrDefault();
                return updates;
            }
            catch (Exception e)
            {
                var exception = e.ToString();
                return null;
            }
            finally
            {
                contextData = null;
            }            
        }
        public List<PortfolioUpdatesDto> AddPortfolioUpdates(PortfolioUpdatesDto portfolioUpdatesDto)
        {
            var contextData = _unitOfWork.PortfolioUpdatesRepository.Context;
            try
            {
                using (var transaction = _unitOfWork.PortfolioSummaryRepository.Context.Database.BeginTransaction())
                {
                    PortfolioUpdates portfolioUpdates = new PortfolioUpdates();
                    portfolioUpdates.OfferingId = portfolioUpdatesDto.OfferingId;
                    portfolioUpdates.Subject = portfolioUpdatesDto.Subject;
                    portfolioUpdates.Date = portfolioUpdatesDto.Date;
                    portfolioUpdates.FromName = portfolioUpdatesDto.FromName;
                    portfolioUpdates.FromEmailId = portfolioUpdatesDto.FromEmailId;
                    portfolioUpdates.ReplyTo = portfolioUpdatesDto.ReplyTo;
                    portfolioUpdates.Content = portfolioUpdatesDto.Content;
                    portfolioUpdates.Status = 1;
                    portfolioUpdates.Active = true;
                    portfolioUpdates.CreatedBy = portfolioUpdatesDto.AdminUserId.ToString();
                    portfolioUpdates.CreatedOn = DateTime.Now;

                    _unitOfWork.PortfolioUpdatesRepository.Insert(portfolioUpdates);
                    contextData.SaveChanges();
                    transaction.Commit();

                    var portfolioUpdatesData = (from update in contextData.PortfolioUpdates
                                                where update.OfferingId == portfolioUpdatesDto.OfferingId
                                                && update.Active == true
                                                join offering in contextData.PortfolioOffering on update.OfferingId equals offering.Id
                                                select new PortfolioUpdatesDto
                                                {
                                                    Id = update.Id,
                                                    OfferingId = update.OfferingId,
                                                    Name = offering.Name,
                                                    Date = update.Date,
                                                    ReplyTo = update.ReplyTo,
                                                    FromEmailId = update.FromEmailId,
                                                    FromName = update.FromName,
                                                    Subject = update.Subject,
                                                    Content = update.Content,
                                                    CreatedOn = update.CreatedOn,
                                                    CreatedBy = update.CreatedBy,
                                                    Status = update.Status
                                                }).OrderByDescending(x=>x.CreatedOn).ToList();

                    return portfolioUpdatesData;
                }
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<PortfolioUpdatesDto> GetPortfolioUpdates(int offeringId)
        {
            var contextData = _unitOfWork.PortfolioUpdatesRepository.Context;
            try
            {
                var portfolioUpdatesData = (from update in contextData.PortfolioUpdates
                                            where update.OfferingId == offeringId
                                            && update.Active == true
                                            select new PortfolioUpdatesDto
                                            {
                                                Id = update.Id,
                                                OfferingId = update.OfferingId,
                                                Name = (from offering in contextData.PortfolioOffering
                                                        where offering.Id == offeringId
                                                        select offering.Name).FirstOrDefault(),
                                                Date = update.Date,
                                                ReplyTo = update.ReplyTo,
                                                FromEmailId = update.FromEmailId,
                                                FromName = update.FromName,
                                                Subject = update.Subject,
                                                Content = update.Content,
                                                CreatedOn = update.CreatedOn,
                                                CreatedBy = update.CreatedBy,
                                                Status = update.Status
                                            }).OrderByDescending(x=>x.CreatedOn).ToList();

                return portfolioUpdatesData;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<PortfolioUpdatesDto> UpdatePortfolioUpdates(PortfolioUpdatesDto portfolioUpdatesDto)
        {
            var contextData = _unitOfWork.PortfolioUpdatesRepository.Context;
            try
            {
                var portfolioUpdatesData = _unitOfWork.PortfolioUpdatesRepository.GetByID(portfolioUpdatesDto.Id);
                if (portfolioUpdatesData != null)
                {
                    using (var transaction = _unitOfWork.PortfolioSummaryRepository.Context.Database.BeginTransaction())
                    {
                        PortfolioUpdates portfolioUpdates = portfolioUpdatesData;
                        portfolioUpdates.Subject = portfolioUpdatesDto.Subject;
                        portfolioUpdates.Date = portfolioUpdatesDto.Date;
                        portfolioUpdates.FromName = portfolioUpdatesDto.FromName;
                        portfolioUpdates.FromEmailId = portfolioUpdatesDto.FromEmailId;
                        portfolioUpdates.ReplyTo = portfolioUpdatesDto.ReplyTo;
                        portfolioUpdates.Content = portfolioUpdatesDto.Content;
                        portfolioUpdates.ModifiedBy = portfolioUpdatesDto.AdminUserId.ToString();
                        portfolioUpdates.ModifiedOn = DateTime.Now;

                        _unitOfWork.PortfolioUpdatesRepository.Update(portfolioUpdates);
                        contextData.SaveChanges();
                        transaction.Commit();

                        var portfolioUpdatesList = (from update in contextData.PortfolioUpdates
                                                    where update.OfferingId == portfolioUpdatesDto.OfferingId
                                                    && update.Active == true
                                                    join offering in contextData.PortfolioOffering on update.OfferingId equals offering.Id
                                                    select new PortfolioUpdatesDto
                                                    {
                                                        Id = update.Id,
                                                        OfferingId = update.OfferingId,
                                                        Name = offering.Name,
                                                        Date = update.Date,
                                                        ReplyTo = update.ReplyTo,
                                                        FromEmailId = update.FromEmailId,
                                                        FromName = update.FromName,
                                                        Subject = update.Subject,
                                                        Content = update.Content,
                                                        CreatedOn = update.CreatedOn,
                                                        CreatedBy = update.CreatedBy,
                                                        Status = update.Status
                                                    }).ToList();

                        return portfolioUpdatesList;
                    }
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<PortfolioUpdatesDto> DeletePortfolioUpdates(int Id, int offeringId, int adminUserId)
        {
            var contextData = _unitOfWork.PortfolioUpdatesRepository.Context;
            try
            {
                var portfolioUpdatesData = _unitOfWork.PortfolioUpdatesRepository.GetByID(Id);
                if (portfolioUpdatesData != null)
                {
                    using (var transaction = _unitOfWork.PortfolioSummaryRepository.Context.Database.BeginTransaction())
                    {
                        PortfolioUpdates portfolioUpdates = portfolioUpdatesData;
                        portfolioUpdates.Active = false;
                        portfolioUpdates.ModifiedBy = adminUserId.ToString();
                        portfolioUpdates.ModifiedOn = DateTime.Now;

                        _unitOfWork.PortfolioUpdatesRepository.Update(portfolioUpdates);
                        contextData.SaveChanges();
                        transaction.Commit();

                        var portfolioUpdatesList = (from update in contextData.PortfolioUpdates
                                                    where update.OfferingId == offeringId
                                                    && update.Active == true
                                                    join offering in contextData.PortfolioOffering on update.OfferingId equals offering.Id
                                                    select new PortfolioUpdatesDto
                                                    {
                                                        Id = update.Id,
                                                        OfferingId = update.OfferingId,
                                                        Name = offering.Name,
                                                        Date = update.Date,
                                                        ReplyTo = update.ReplyTo,
                                                        FromEmailId = update.FromEmailId,
                                                        FromName = update.FromName,
                                                        Subject = update.Subject,
                                                        Content = update.Content,
                                                        CreatedOn = update.CreatedOn,
                                                        CreatedBy = update.CreatedBy,
                                                        Status = update.Status
                                                    }).ToList();

                        return portfolioUpdatesList;
                    }
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                e.ToString();
                return null;//Failure 
            }
            finally
            {
                contextData = null;
            }
        }
        public List<CredorFromEmailAddressDto> GetCredorFromEmailAddresses()
        {
            List<CredorFromEmailAddressDto> CredorFromEmailAddresses = new List<CredorFromEmailAddressDto>();
            var contextData = _unitOfWork.CredorFromEmailAddressRepository.Context;
            try
            {
                CredorFromEmailAddresses = (from fromAddress in contextData.CredorFromEmailAddress
                                            join domain in contextData.CredorDomain on fromAddress.DomainId equals domain.Id
                                            where fromAddress.Active == true
                                            select new CredorFromEmailAddressDto
                                            {
                                                Id = fromAddress.Id,
                                                FromName = fromAddress.FromName,
                                                EmailId = fromAddress.EmailId+"@"+domain.Name
                                            }).ToList();
            }
            catch (Exception e)
            {
                e.ToString();
                return CredorFromEmailAddresses;
            }
            finally
            {
                contextData = null;
            }
            return CredorFromEmailAddresses;
        }
    }
}
