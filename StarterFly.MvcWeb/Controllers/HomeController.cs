using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StarterFly.MvcWeb.Controllers
{
    [RoutePrefix("")]
    public class HomeController : Controller
    {
        /// <summary>
        /// This is the main marketing page, not in the angular app for now.
        /// </summary>
        /// <returns></returns>
        [Route("")]
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// This action handles all routes unknown to MVC config, as configured in App_Start/RouteConfig.cs
        /// </summary>
        /// <returns></returns>
        public ActionResult AppBookmarkableRoutes()
        {
            return View("NgApp");
        }
    }
}