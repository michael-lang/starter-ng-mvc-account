using Candor;
using Candor.Configuration.Provider;
using Candor.Security;
using StarterFly.Account;
using StarterFly.MvcWeb.Models.Account;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace StarterFly.MvcWeb.ApiControllers
{
    [RoutePrefix("rest/account")]
    public class AccountController : ApiController
    {
        [HttpPost]
        [Route("login")]
        public HttpResponseMessage Login([FromBody]LoginViewModel model)
        {
            try
            {
                var authResult = ProviderResolver<AccountSummaryProvider>.Get.Provider.Login(
                    model.identifier, model.password, Request.GetClientIp(), UserSessionDurationType.Extended);
                model.password = "";

                return Request.CreateResponse(HttpStatusCode.OK,
                    new LoginResultViewModel
                    {
                        account = new AccountSummaryViewModel(authResult.Account)
                        {
                            authSessionToken = authResult.User.IsAuthenticated
                                ? authResult.User.Ticket.UserSession.RenewalToken.ToString() : ""
                        },
                        message = authResult.Result.Success ? "" : authResult.Result.ToString(),
                        status = authResult.User.IsAuthenticated ? "" : "401"
                    }); //401 via status instead of HttpStatusCode so caller can get the 'message' 
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.OK,
                    new LoginResultViewModel
                    {
                        account = null,
                        message = "Unexpected server error.  Try again later or contact support.",
                        status = "500"
                    });
            }
        }

        [HttpPost]
        [Route("register")]
        public HttpResponseMessage Register([FromBody]RegisterViewModel model)
        {
            try
            {
                DateTime dob;
                DateTime.TryParseExact(model.dob, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.AssumeUniversal, out dob);
                var registration = new RegistrationRequest
                {
                    UserName = model.userName,
                    FirstName = model.firstName,
                    LastName = model.lastName,
                    EmailAddress = model.emailAddress,
                    PhoneNumber = model.phoneNumber,
                    Password = model.password,
                    DateOfBirth = dob
                };

                var authResult = ProviderResolver<AccountSummaryProvider>.Get.Provider.Register(
                    registration, Request.GetClientIp(), UserSessionDurationType.Extended);
                model.password = "";

                return Request.CreateResponse(HttpStatusCode.OK,
                    new LoginResultViewModel
                    {
                        account = new AccountSummaryViewModel(authResult.Account)
                        {
                            authSessionToken = authResult.User.IsAuthenticated
                                ? authResult.User.Ticket.UserSession.RenewalToken.ToString() : ""
                        },
                        message = authResult.Result.Success ? "" : authResult.Result.ToString(),
                        status = authResult.User.IsAuthenticated ? "" : "401"
                    }); //401 via status instead of HttpStatusCode so caller can get the 'message' 
            }
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.OK,
                    new LoginResultViewModel
                    {
                        account = null,
                        message = "Unexpected server error.  Try again later or contact support.",
                        status = "500"
                    });
            }
        }

        [HttpPost]
        [Route("verify")]
        public HttpResponseMessage Verify([FromBody]AuthTokenViewModel model)
        {
            try
            {
                var authResult = ProviderResolver<AccountSummaryProvider>.Get.Provider.RenewToken(
                    model.authSessionToken, Request.GetClientIp(), UserSessionDurationType.Extended);

                return Request.CreateResponse(HttpStatusCode.OK,
                    new LoginResultViewModel
                    {
                        account = new AccountSummaryViewModel(authResult.Account)
                        {
                            authSessionToken = authResult.User.IsAuthenticated
                                ? authResult.User.Ticket.UserSession.RenewalToken.ToString() : ""
                        },
                        message = authResult.Result.Success ? "" : authResult.Result.ToString(),
                        status = authResult.User.IsAuthenticated ? "" : "401"
                    }); //401 via status instead of HttpStatusCode so caller can get the 'message' 
            }
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.OK,
                    new LoginResultViewModel
                    {
                        account = null,
                        message = "Unexpected server error.  Try again later or contact support.",
                        status = "500"
                    });
            }
        }

        [HttpPost]
        [Route("logout")]
        public HttpResponseMessage Logout([FromBody]AuthTokenViewModel model)
        {
            try
            {
                var result = new ExecutionResults();
                ProviderResolver<UserProvider>.Get.Provider.InvalidateSession(
                    model.authSessionToken, Request.GetClientIp(), result);

                return Request.CreateResponse(HttpStatusCode.OK,
                    new LoginResultViewModel
                    {   //tell client the session has been invalidated
                        account = null,
                        message = "",
                        status = ""
                    }); 
            }
            catch (Exception)
            {   //this only means the datastore is inaccessible at this time.
                return Request.CreateResponse(HttpStatusCode.OK,
                    new LoginResultViewModel
                    {
                        account = null,
                        message = "Unexpected server error.  Try again later or contact support.",
                        status = "500"
                    });
            }
        }
    }
}
