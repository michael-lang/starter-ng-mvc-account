using System;
using Candor.Security;

namespace StarterFly.Account
{
    /// <summary>
    /// A result from login or register with the relevant account info, session details and relevant error message(s).
    /// </summary>
    public class AuthenticationResult
    {
        /// <summary>
        /// The relevant session details.
        /// </summary>
        public UserIdentity User { get; set; }
        /// <summary>
        /// Any applicable error or warning messages to inform the user about.
        /// </summary>
        public Candor.ExecutionResults Result { get; set; }
        /// <summary>
        /// The account information.
        /// </summary>
        public AccountSummary Account { get; set; }
    }
}
