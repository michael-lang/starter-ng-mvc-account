using StarterFly.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StarterFly.MvcWeb.Models.Account
{
    public class AccountSummaryViewModel
    {
        public string authSessionToken { get; set; }
        public string userId { get; set; }
        public string userName { get; set; }
        public string emailAddress { get; set; }
        public string phoneNumber { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public DateTime dob { get; set; }
        public string role { get; set; }

        public AccountSummaryViewModel() { }
        public AccountSummaryViewModel(AccountSummary source)
        {
            if (source == null) return;

            userId = source.UserId;
            userName = source.UserName;
            emailAddress = source.EmailAddress;
            phoneNumber = source.PhoneNumber;
            firstName = source.FirstName;
            lastName = source.LastName;
            dob = source.DOB;
            role = source.Role;
        }
    }
}