using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Candor;

namespace StarterFly.MvcWeb.ApiControllers
{
    public static class ApiControllerExtensions
    {
        public static string GetClientIp(this HttpRequestMessage request)
        {
            if (request.Properties.ContainsKey("MS_HttpContext"))
            {
                return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            }
            //else if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
            //{
            //    RemoteEndpointMessageProperty prop;
            //    prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
            //    return prop.Address;
            //}
            else
            {
                return null;
            }
        }

        public static HttpResponseMessage ErrorJsonResponse(this HttpRequestMessage request, string errorMessage, object itemInError = null)
        {
            return request.CreateResponse(HttpStatusCode.OK,
                new { success = false, message = errorMessage, item = itemInError });
        }
        public static HttpResponseMessage ErrorJsonResponse(this HttpRequestMessage request, ExecutionResults results, object itemInError = null)
        {
            return request.CreateResponse(HttpStatusCode.OK,
                new { success = false, message = results.ToString(". "), item = itemInError });
        }
        public static HttpResponseMessage ResultJsonResponse(this HttpRequestMessage request, ExecutionResults results, object model = null)
        {
            return request.CreateResponse(HttpStatusCode.OK,
                new { success = results.Success, message = results.ToString(". "), item = model });
        }
    }
}