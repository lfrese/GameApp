<%@ WebHandler Language="C#" Class="WinnerHandler" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

public class WinnerHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        try
        {
            string prizeid = context.Request["prizeid"];
            PrizeController.EditPrizeAmount(prizeid);
            List<PrizeController.Prize> prizelist = PrizeController.GetPrizes();
            PrizeController.Prize prizewon = prizelist.Find(x => x.id == prizeid);
            WinObject win = new WinObject();
            win.name = prizewon.name;
            win.tip = prizewon.tip;
            win.tipimage = prizewon.image1;

            context.Response.Write(JsonConvert.SerializeObject(win));
        }
        catch (Exception ex)
        {
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(PrizeController.errorpath, true))
            {
                file.WriteLine(DateTime.Now.ToString() + " Error in WinnerHandler.ashx: " + ex.Message);
            }
            context.Response.Write("error"); 
        }
        
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}

public class WinObject
{
    public string name { get; set; }        
    public string tipimage { get; set; }
    public string tip { get; set; }
}

