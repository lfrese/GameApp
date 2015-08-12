using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;

public partial class _Default2 : System.Web.UI.Page
{
    public string allimages; // all the images - load for idle screen rotation
    public string buildtime;
    public string gamespeed;
    public string playtime;
    public string idletimeouttime;
    public string idletiptime;
    protected void Page_Load(object sender, EventArgs e)
    {
        allimages = "[";
        List<PrizeController.Prize> prizelist = PrizeController.GetPrizes();
        List<string> imglist = new List<string>();
        foreach (PrizeController.Prize prize in prizelist)
        {
            if (prize.isnonprize)
            {
                allimages += "'" + prize.image1 + "',";
            }
            else
            {
                allimages += "'" + prize.image1 + "',";
                allimages += "'" + prize.image2 + "',"; 
            } 
            
        }
        allimages = allimages.TrimEnd(',') + "]";

        //load settings
        PrizeController.Settings settings = PrizeController.GetSettings();
        playtime = (Convert.ToInt32(settings.playtime)*1000).ToString();
        gamespeed = settings.gamespeed;
        buildtime = settings.buildtime;
        idletimeouttime = (Convert.ToInt32(settings.idletimeouttime)*1000).ToString();
        idletiptime = (Convert.ToInt32(settings.idletiptime)*1000).ToString();
    }

     
    
}
