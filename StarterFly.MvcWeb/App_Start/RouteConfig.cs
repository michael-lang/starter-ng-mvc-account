using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace StarterFly.MvcWeb
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.RouteExistingFiles = true;
            routes.MapMvcAttributeRoutes();
            //attribute routed actions, then the catchall sends the rest the the Angular app
            routes.MapRoute(
                name: "AngularApp",
                url: "{*.}",
                defaults: new { controller = "Home", action = "AppBookmarkableRoutes" }
            );
        }
    }
}
