using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Data.Entities
{
    public class CredorInfo
    {
        public int Id { get; set; }
        public int CredorInfoTypeId { get; set; }
        public string TemplateName { get; set; }
        public string BodyContent { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
