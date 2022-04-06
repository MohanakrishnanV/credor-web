using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class PortfolioOfferingDto
    {
        public int AdminUserId { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
        public string EntityName { get; set; }
        public int Type { get; set; }
        public bool Active { get; set; }
        public decimal Size { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal MinimumInvestment { get; set; }
        public string PublicLandingPageUrl { get; set; }
        public bool? IsPrivate { get; set; }
        public bool? ShowPercentageRaised { get; set; }
        public int Status { get; set; }
        public bool IsReservation { get; set; }
        public int Visibility { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public List<PortfolioKeyHighlightDto> KeyHighlights { get; set; }
        public List<PortfolioGalleryDto> Galleries { get; set; }
        public List<PortfolioDocumentDto> Documents { get; set; }         
        public List<PortfolioLocationDto> Locations { get; set; }
        public List<PortfolioSummaryDto> Summary { get; set; }     
        public PortfolioFundingInstructionsDto Funds { get; set; }    
        public decimal TotalReservationsAmount { get; set; }
        public int TotalReservations { get; set; }
        public decimal PercentageRaised { get; set; }
        public decimal TotalInvested { get; set; }
        public bool? IsDocumentPrivate { get; set; }
        public string StatusName { get; set; }
    }

    public class PortfolioOfferingVisibilityDto
    {
        public int OfferingId { get; set; }
        public int OfferingVisibiltyId { get; set; }
        public int OfferingGroupId { get; set; }
    }
    public class PortfolioOfferingUpdateDto
    {
        public int AdminUserId { get; set; }
        public int OfferingId { get; set; }
        public bool IsPrivate { get; set; }   
        public bool ShowPercentageRaised { get; set; }
        public bool IsDocumentPrivate { get; set; }
    }
    public class PortfolioOfferingUpdateResultDto
    {      
        public bool Status { get; set; }
        public PortfolioOfferingDto PortfolioOffering { get; set; }
    }
}
