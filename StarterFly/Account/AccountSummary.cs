using System;

namespace StarterFly.Account
{
    public class AccountSummary
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DOB { get; set; }
        /// <summary>
        /// The system level role for this user (typically 'member' or 'admin').
        /// This is not for record level authorization, but rather for determining enabled application level functionality.
        /// </summary>
        public string Role { get; set; }

        public AccountSummary() { }
        public AccountSummary(AccountSummary source)
        {
            if (source == null) return;

            UserId = source.UserId;
            UserName = source.UserName;
            EmailAddress = source.EmailAddress;
            PhoneNumber = source.PhoneNumber;
            FirstName = source.FirstName;
            LastName = source.LastName;
            DOB = source.DOB;
            Role = source.Role;
        }
    }
}
