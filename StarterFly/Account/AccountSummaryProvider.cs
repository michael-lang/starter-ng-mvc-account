using Candor.Security;
using System;
using System.Configuration.Provider;

namespace StarterFly.Account
{
    public abstract class AccountSummaryProvider : ProviderBase
    {
        /// <summary>
        /// To load users with a matching identifier, then use the Authentication service for the matching user
        /// and supplied password.
        /// </summary>
        /// <remarks>
        /// Prioritize identifier match order on username, email address, then phonenumber.
        /// </remarks>
        /// <param name="identifier">The username, email address, or phone number of the user account.</param>
        /// <param name="password">The plain text password for the linked user account.</param>
        /// <param name="ipAddress">The address of the web user.</param>
        /// <param name="duration">The preferred duration of the new session.</param>
        /// <returns></returns>
        public abstract AuthenticationResult Login(String identifier, String password, string ipAddress, UserSessionDurationType duration);
        /// <summary>
        /// Creates a new account with the supplied username, if available, otherwise return error message.
        /// Also create identifier lookups as needed for login to work across the three identifier fields.
        /// </summary>
        /// <param name="registration">The new account details, must be a new unused user name.</param>
        /// <param name="ipAddress">The address of the web user.</param>
        /// <param name="duration">The preferred duration of the new session.</param>
        /// <returns></returns>
        public abstract AuthenticationResult Register(RegistrationRequest registration, string ipAddress, UserSessionDurationType duration);
        /// <summary>
        /// Renews an authentication token and returns the updated account summary.
        /// </summary>
        /// <param name="authToken">An authenticationToken from a prior login or register.</param>
        /// <param name="ipAddress">The address of the web user.</param>
        /// <param name="duration">The preferred duration of the new session.</param>
        /// <returns></returns>
        public abstract AuthenticationResult RenewToken(String authToken, string ipAddress, UserSessionDurationType duration);
    }
}
