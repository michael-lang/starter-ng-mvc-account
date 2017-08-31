using Candor;
using Candor.Configuration.Provider;
using Candor.Security;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;

namespace StarterFly.Account
{
    public class MockAccountSummaryProvider : AccountSummaryProvider
    {
        private List<AccountSummary> _mockData = null;
        public string JsonDataPath { get; set; }
        public MockAccountSummaryProvider()
        {
            Initialize("mock", new NameValueCollection());
        }
        public MockAccountSummaryProvider(string name)
        {
            Initialize(name, new NameValueCollection());
        }
        public override void Initialize(string name, NameValueCollection config)
        {   //for XML configuration option
            base.Initialize(name, config);
            JsonDataPath = config.GetStringValue("jsonDataPath", null);
        }
        private void LoadSampleData()
        {
            var json = File.ReadAllText(JsonDataPath);
            var items = JsonConvert.DeserializeObject<List<AccountSummary>>(json);
            _mockData = items;
        }

        /// <summary>
        /// Login with fake cached data only.
        /// </summary>
        public override AuthenticationResult Login(string identifier, string password, string ipAddress, UserSessionDurationType duration)
        {
            if (_mockData == null)
                LoadSampleData();

            var result = new ExecutionResults();
            var accts = _mockData
                .Where(x => x.UserName.ToLower() == identifier.ToLower() 
                    || x.EmailAddress.ToLower() == identifier.ToLower() 
                    || x.PhoneNumber.ToDigitsOnly() == identifier.ToDigitsOnly())
                .ToList();
            if (accts == null || accts.Count == 0)
            {
                result.AppendError(ProviderResolver<UserProvider>.Get.Provider.LoginCredentialsFailureMessage);
                return new AuthenticationResult
                {
                    Account = null,
                    Result = result,
                    User = new Candor.Security.UserIdentity() //anonymous
                };
            }

            AccountSummary acct = null;
            UserIdentity identity = null;
            var byUserName = accts.FirstOrDefault(x => x.UserName.ToLower() == identifier.ToLower());
            var byEmailAddress = accts.FirstOrDefault(x => x.EmailAddress.ToLower() == identifier.ToLower());
            var byPhoneNumber = accts.FirstOrDefault(x => x.PhoneNumber.ToDigitsOnly() == identifier.ToDigitsOnly());
            if (byUserName != null)
            {
                identity = ProviderResolver<UserProvider>.Get.Provider.AuthenticateUser(
                    identifier, password, duration, ipAddress, result);
                acct = byUserName;
            }
            if (!identity.IsAuthenticated && byEmailAddress != null)
            {
                result.Reset();
                identity = ProviderResolver<UserProvider>.Get.Provider.AuthenticateUser(
                    byEmailAddress.UserName, password, duration, ipAddress, result);
                acct = byEmailAddress;
            }
            if (!identity.IsAuthenticated && byPhoneNumber != null)
            {
                result.Reset();
                identity = ProviderResolver<UserProvider>.Get.Provider.AuthenticateUser(
                    byPhoneNumber.UserName, password, duration, ipAddress, result);
                acct = byPhoneNumber;
            }
            
            return new AuthenticationResult
            {
                Account = identity.IsAuthenticated ? acct : null,
                Result = result,
                User = identity
            };
        }
        /// <summary>
        /// Register new account into cached mock data.  A temporary backend before database is ready.
        /// </summary>
        /// <param name="registration"></param>
        /// <returns></returns>
        public override AuthenticationResult Register(RegistrationRequest registration, string ipAddress, UserSessionDurationType duration)
        {
            if (_mockData == null)
                LoadSampleData();

            var result = new ExecutionResults();
            var user = ProviderResolver<UserProvider>.Get.Provider.GetUserByName(registration.UserName);
            if (user != null)
            {
                result.AppendError(registration.UserName + " is already in use.  Choose another identity.");
                return new AuthenticationResult
                {
                    Account = null,
                    Result = result,
                    User = new UserIdentity() //anonymous
                };
            }

            user = new User
            {
                Name = registration.UserName,
                IsGuest = false,
                PasswordHash = registration.Password //will be hashed by UserProvider
            };
            var identity = ProviderResolver<UserProvider>.Get.Provider.RegisterUser(user, duration, ipAddress, result);
            if (!identity.IsAuthenticated)
            {
                return new AuthenticationResult
                {
                    Account = null,
                    Result = result,
                    User = identity
                };
            }

            var acct = new AccountSummary
            {
                UserName = user.Name,
                Role = "member",
                PhoneNumber = registration.PhoneNumber,
                EmailAddress = registration.EmailAddress,
                DOB = registration.DateOfBirth,
                FirstName = registration.FirstName,
                LastName = registration.LastName,
                UserId = user.UserID.ToString()
            };
            _mockData.Add(acct);

            return new AuthenticationResult
            {
                Account = acct,
                Result = result,
                User = identity
            };
        }
        /// <summary>
        /// Renews an authentication token and returns the updated account summary.
        /// </summary>
        public override AuthenticationResult RenewToken(string authToken, string ipAddress, UserSessionDurationType duration)
        {
            if (_mockData == null)
                LoadSampleData();

            var result = new ExecutionResults();
            var identity = ProviderResolver<UserProvider>.Get.Provider.AuthenticateUser(
                authToken, duration, ipAddress, result);
            AccountSummary acct = null;
            if (identity.IsAuthenticated)
            {
                acct = _mockData.FirstOrDefault(x => x.UserId == identity.Ticket.UserSession.UserID.ToString());
            }

            return new AuthenticationResult
            {   //not authenticated
                Account = acct,
                Result = result,
                User = identity
            };
        }
    }
}
