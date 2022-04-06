using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class AdminAccountDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Title { get; set; }
        public bool IsTwoFactorAuthEnabled { get; set; }
        //public string DateOfBirth { get; set; }
        //public bool IsEmailVerified { get; set; }
        //public bool IsPhoneVerified { get; set; }
        //public bool IsTwoFactorAuthEnabled { get; set; }
        public int RoleId { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public bool? IsOwner { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public List<UserFeatureMappingDto> RoleMapping { get; set; }
    }

    public class UpdateAdminAccountDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string DateOfBirth { get; set; }
        public bool IsEmailVerified { get; set; }
        public bool IsPhoneVerified { get; set; }
        public bool IsTwoFactorAuthEnabled { get; set; }
        public int RoleId { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public string ProfileImageUrl { get; set; }
        public IFormFile profileImage { get; set; }
    }    
}
