﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Credor.Client.Entities
{
    public class UserAccountDto
    {
        public int Id { get; set; }
        public int AdminUserId { get; set; }
        public int RoleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NickName { get; set; }
        public string FullName { get; set; }
        public string EmailId { get; set; }
        public string SecondaryEmail { get; set; }
        public bool? ReceiveEmailNotifications { get; set; }
        public string PhoneNumber { get; set; }
        public string DateOfBirth { get; set; }
        public string ProfileImageUrl { get; set; }
        public int Residency { get; set; }
        public string Country { get; set; }
        public string Password { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string OldPassword { get; set; }
        public DateTime? PasswordChangedOn { get; set; }
        public int? Capacity { get; set; }
        public bool? IsAccreditedInvestor { get; set; }
        public string HeardFrom { get; set; }
        public bool IsTOCApproved { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public bool IsEmailVerified { get; set; }
        public bool IsPhoneVerified { get; set; }
        public bool IsTwoFactorAuthEnabled { get; set; }
        public string OneTimePassword { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public string ApprovedBy { get; set; }
        public bool Isowner { get; set; }
        public bool? VerifyAccount { get; set; }
        public bool? CompanyNewsLetterUpdates { get; set; }
        public bool? NewInvestmentAnnouncements { get; set; }
        public bool SendConfirmMail { get; set; }
        public UserNotesDto Notes { get; set; }
        public int TotalInvestments { get; set; }
        public decimal TotalAmount { get; set; }
        public bool? IsAdminOwner { get; set; }
        //public List<TagDto> Tags { get; set; }
    }
    public class UpdateUserAccountDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NickName { get; set; }
        public string EmailId { get; set; }
        public string SecondaryEmail { get; set; }
        public bool? ReceiveEmailNotifications { get; set; }
        public string PhoneNumber { get; set; }
        public string DateOfBirth { get; set; }
        public int Residency { get; set; }
        public string Country { get; set; }
        public int Capacity { get; set; }
        public bool? IsAccreditedInvestor { get; set; }
        public string HeardFrom { get; set; }
        public bool IsTOCApproved { get; set; }
        public bool IsEmailVerified { get; set; }
        public bool IsPhoneVerified { get; set; }
        public bool IsTwoFactorAuthEnabled { get; set; }
        public bool IsNewUser { get; set; }
        public bool? CompanyNewsLetterUpdates { get; set; }
        public bool? NewInvestmentAnnouncements { get; set; }
        public string ProfileImageUrl { get; set; }
        public IFormFile profileImage { get; set; }
    }
    public class UserAccountVerificationDto
    {
        public int Id { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public string OneTimePassword { get; set; }
    }
    public class NewUserAccountDto
    {
        public int Id { get; set; }
        public int CurrentUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NickName { get; set; }
        public string EmailId { get; set; }
        public string Title { get; set; }
        public int Permission { get; set; }
        public bool IsNotificationEnabled { get; set; }
    }
    public class DeleteUserAccountDto
    {
        public int AdminUserId { get; set; }
        public List<int> Ids { get; set; }
    }
    public class ResendInviteDto
    {
        public int AdminUserId { get; set; }
        public List<int> Ids { get; set; }
    }
    public class CapTableInvestorDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int ProfileId { get; set; }
        public int? DistributionMethod { get; set; }
    }

    public class CSVUserAccountListModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NickName { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string PhoneNumber { get; set; }        
        public string IsAccreditedInvestor { get; set; }
        public string Status { get; set; }
        public string Residency { get; set; }
        public string Capacity { get; set; }
        public string HeardFrom { get; set; }
        public string CompanyNewsLetterUpdates { get; set; }
        public string NewInvestmentAnnouncements { get; set; }
        public static CSVUserAccountListModel FromCsv(string csvLine)
        {
            string[] values = csvLine.Split(',');
            CSVUserAccountListModel csvUserAccountModel = new CSVUserAccountListModel();
            csvUserAccountModel.FirstName = values[0];
            csvUserAccountModel.LastName = values[1];
            csvUserAccountModel.NickName = values[2];
            csvUserAccountModel.Email = values[3];
            csvUserAccountModel.Country = values[4];
            csvUserAccountModel.PhoneNumber = values[5];
            csvUserAccountModel.IsAccreditedInvestor = values[6];
            csvUserAccountModel.Status = values[7];
            csvUserAccountModel.Residency = values[8];
            csvUserAccountModel.Capacity = values[9];
            csvUserAccountModel.HeardFrom = values[10];
            csvUserAccountModel.CompanyNewsLetterUpdates = values[11];
            csvUserAccountModel.NewInvestmentAnnouncements = values[12];
            return csvUserAccountModel;
        }               
    }
}
