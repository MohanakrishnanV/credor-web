﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class TagDetailDto
    {
        public int? Id { get; set; }
        public int? TagId { get; set; }
        public int? UserId { get; set; }       
        public bool? Active { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
