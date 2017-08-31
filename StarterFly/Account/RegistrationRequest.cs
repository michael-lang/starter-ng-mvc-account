using System;

namespace StarterFly.Account
{
    /// <summary>
    /// Registration requests are not persisted, but are only used to create an account.
    /// Functionality for a specific account that needs approvals should be tracked through
    /// other records stored in the feature area.
    /// </summary>
    public class RegistrationRequest
    {
        public string UserName { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        /// <summary>
        /// Clear text password.  Do not store this record in any database or log without clearing out this field.
        /// </summary>
        public string Password { get; set; }
    }
}