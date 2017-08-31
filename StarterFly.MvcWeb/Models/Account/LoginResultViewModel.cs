using StarterFly.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StarterFly.MvcWeb.Models.Account
{
    public class LoginResultViewModel
    {
        public AccountSummaryViewModel account { get; set; }
        public string status { get; set; }
        public string message { get; set; }
    }
}