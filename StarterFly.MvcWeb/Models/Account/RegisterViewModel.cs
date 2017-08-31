using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StarterFly.MvcWeb.Models.Account
{
    public class RegisterViewModel
    {
        public string userName { get; set; }
        public string emailAddress { get; set; }
        public string phoneNumber { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        /// <summary>
        /// ISO 8601 Date string, YYYY-MM-DD, with or without a time component.
        /// </summary>
        public string dob { get; set; }
        public string password { get; set; }
    }
}