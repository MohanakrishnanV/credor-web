using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class EmailAttachmentDto
    {
        public int Id { get; set; }
        public int AdminUserId { get; set; }
        public int CredorEmailDetailId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Extension { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
