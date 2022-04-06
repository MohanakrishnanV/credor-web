using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class RoleFeatureMappingDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string FeatureName { get; set; }
        public bool Active { get; set; }
    }
    public class UserFeatureMappingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public int RoleFeatureMappingId { get; set; }
        public string FeatureName { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}