using Candor.Configuration.Provider;
using Candor.Security;
using Candor.Security.Cryptography;
using Candor.Security.Web;
using System.Web;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(StarterFly.MvcWeb.App_Start.ProviderBootstrapper), "PreStartup")]
[assembly: WebActivatorEx.PostApplicationStartMethod(typeof(StarterFly.MvcWeb.App_Start.ProviderBootstrapper), "PostStartup")]

namespace StarterFly.MvcWeb.App_Start
{
    public class ProviderBootstrapper
    {
        public static void PreStartup()
        {
        }
        public static void PostStartup()
        {
            InitProviders();
        }

        private static void InitProviders()
        {
            ProviderResolver<HashProvider>.Configure()
                .AppendActive(new SHA2HashProvider("sha2") { IsObsolete = false, SaltModifier = "" });
            ProviderResolver<SecurityContextProvider>.Configure().AppendActive(
                new WebSecurityContextProvider("web"));
            ProviderResolver<UserProvider>.Configure().AppendActive(new Account.MockUserProvider()
            {
                UserJsonDataPath = HttpContext.Current.Server.MapPath("~/App_Data/users.json"),
                UserSaltJsonDataPath = HttpContext.Current.Server.MapPath("~/App_Data/user-salts.json"),
                UserSessionJsonDataPath = HttpContext.Current.Server.MapPath("~/App_Data/user-sessions.json"),
                AuthenticationHistoryJsonDataPath = HttpContext.Current.Server.MapPath("~/App_Data/user-auth-history.json"),
                PasswordResetCodeExpirationHours = 24,
                GuestUserExpirationDays = 21,
                PublicSessionDuration = 24 * 60,
                DisableIpAddressSessionLock = true,
                LoginCredentialsFailureMessage = "The supplied identity or password is incorrect."
            });
            //ProviderResolver<UserProvider>.Configure().AppendActive(
            //    new Candor.Security.AzureStorageProvider.UserProvider("azure", "DefaultTableConnection",
            //                                                          "UserTableConnection", "UserSaltTableConnection",
            //                                                          "UserAuditTableConnection")
            //    {
            //        PasswordResetCodeExpirationHours = 24,
            //        GuestUserExpirationDays = 21,
            //        PublicSessionDuration = 24 * 60,
            //        DisableIpAddressSessionLock = true,
            //        LoginCredentialsFailureMessage = "The supplied identity or password is incorrect."
            //    });

            ProviderResolver<Account.AccountSummaryProvider>.Configure()
                .AppendActive(new Account.MockAccountSummaryProvider()
                {
                    JsonDataPath = HttpContext.Current.Server.MapPath("~/App_Data/accounts.json")
                });
        }
    }
}