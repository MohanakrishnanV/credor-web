CREATE INDEX Index_PortfolioKeyHighlight_OfferingId_KeyHighlightId
ON PortfolioKeyHighlight (OfferingId,KeyHighlightId);
CREATE INDEX Index_PortfolioKeyHighlight_OfferingId_KeyHighlightId_Active
ON PortfolioKeyHighlight (OfferingId,KeyHighlightId,Active);
CREATE INDEX Index_Document_OfferingId_Active
ON Document (OfferingId,Active);
 CREATE INDEX Index_PortfolioFundingInstructions_OfferingId
ON PortfolioFundingInstructions (OfferingId);
CREATE INDEX Index_PortfolioFundingInstructions_OfferingId_Active
ON PortfolioFundingInstructions (OfferingId, Active);
 CREATE INDEX Index_PortfolioGallery_OfferingId
ON PortfolioGallery (OfferingId);
 CREATE INDEX Index_PortfolioGallery_OfferingId_Active
ON PortfolioGallery (OfferingId,Active);

CREATE INDEX Index_PortfolioOffering_Visibility
ON PortfolioOffering (Visibility);
CREATE INDEX Index_PortfolioOffering_Visibility_Active
ON PortfolioOffering (Visibility,Active);
CREATE INDEX Index_PortfolioOffering_Visibility_Status_Active
ON PortfolioOffering (Visibility,Status,Active);
CREATE INDEX Index_Investment_UserId_Active
ON Investment (UserId,Active);
CREATE INDEX Index_Investment_Id_Active
ON Investment (Id,Active);
CREATE INDEX Index_Investment_OfferingId_Active
ON Investment (OfferingId,Active);
CREATE INDEX Index_Investment_UserId_IsReservation_Active
ON Investment (UserId, IsReservation,Active);
CREATE INDEX Index_Distributions_InvestmentId_Status
ON Distributions (InvestmentId,Status);

CREATE INDEX Index_PortfolioUpdates_OfferingId_Active
ON PortfolioUpdates (OfferingId,Active);
