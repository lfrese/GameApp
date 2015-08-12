using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.IO;
using System.Data;
/// <summary>
/// Summary description for PrizeController
/// </summary>
public class PrizeController
{
    public static string errorpath = System.AppDomain.CurrentDomain.BaseDirectory+@"\error.txt";
    public static string prizespath =System.AppDomain.CurrentDomain.BaseDirectory+ @"\prizes.txt";
    public static string settingspath = System.AppDomain.CurrentDomain.BaseDirectory+@"\gamesettings.txt";
    public static string imgpath = System.AppDomain.CurrentDomain.BaseDirectory+@"\Images\";
	public PrizeController()
	{
		//
		// TODO: Add constructor logic here
		//
	}

    /// <summary>
    /// Gets the JSON prize db & puts all of the prizes from the db into a Prize object
    /// </summary>
    /// <param name="jsonstr">the serialized json string</param>
    /// <returns>The list of prize objects</returns>
    public static List<Prize> GetPrizes()
    {
        string jsonstr = GetJsonText(prizespath);
        List<Prize> prizes = new List<Prize>();
        // Reading JSON response
        dynamic result = JsonConvert.DeserializeObject(jsonstr);
        foreach (var prize in result)
        {
            Prize prizeitem = new Prize();
            prizeitem.id = prize.id;
            prizeitem.name = prize.name;
            prizeitem.currentquantity = prize.currentquantity;
            prizeitem.originalquantity = prize.originalquantity;
            prizeitem.quantitygiven = prize.quantitygiven;
            prizeitem.isnonprize = prize.isnonprize;
            prizeitem.image1 = prize.image1;
            prizeitem.image2 = prize.image2;
            //prizeitem.image3 = prize.image3;
            prizeitem.tip = prize.tip;
            prizeitem.ratio = prize.ratio;
            prizes.Add(prizeitem);
        }
        return prizes;
    }

    /// <summary>
    /// Reads the JSON txt document into a string
    /// </summary>
    /// <param name="filepath">Path of the file to open & read</param>
    /// <returns>a JSON serialized string</returns>
    public static string GetJsonText(string filepath)
    {
        string output = "";
        using (var streamReader = new StreamReader(filepath))
        {
            output = streamReader.ReadToEnd();
        }

        return output;
    }

    public static void EditPrizeAmount(string prizeid)
    {
        try{
            //lets just delete existing and add new
            string jsonstr = GetJsonText(prizespath);
            List<Prize> prizelist = GetPrizes();        
            Prize oldprize = prizelist.Find(x => x.id == prizeid);            
            if (!oldprize.isnonprize)
            {
                Prize newprize = new Prize();
                double currentqty = Convert.ToDouble(oldprize.currentquantity) - 1;
                string ratio = ((currentqty / Convert.ToDouble(oldprize.originalquantity)) * 100).ToString();
                newprize.id = oldprize.id;
                newprize.name = oldprize.name;
                newprize.originalquantity = oldprize.originalquantity;
                newprize.currentquantity = currentqty.ToString();
                newprize.isnonprize = oldprize.isnonprize;
                newprize.image1 = oldprize.image1;
                newprize.image2 = oldprize.image2;
                //newprize.image3 = oldprize.image3;
                newprize.quantitygiven = oldprize.quantitygiven;
                newprize.tip = oldprize.tip;
                newprize.ratio = ratio;
                prizelist.Remove(oldprize);
                //in with the new
                prizelist.Add(newprize);
                string output = JsonConvert.SerializeObject(prizelist);
                File.WriteAllText(prizespath, output);
            }
        }
        catch (Exception ex)
        {
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(errorpath, true))
            {
                file.WriteLine(DateTime.Now.ToString() + " Error in PrizeController.cs Method EditPrizeAmount: " + ex.Message);
            }
        }    
       
    }

    /// <summary>
    /// Gets the settings associated with the project from gamesettings.txt
    /// </summary>
    /// <returns>a settings object</returns>
    public static Settings GetSettings()
    {
        string jsonstr = GetJsonText(settingspath);
        // Reading JSON response
        dynamic result = JsonConvert.DeserializeObject(jsonstr);
        Settings settingitem = new Settings();
        settingitem.username = result.username;
        settingitem.pass = result.pass;
        settingitem.buildtime = result.buildtime;
        settingitem.gamespeed = result.gamespeed;
        settingitem.idletimeouttime = result.idletimeouttime;
        settingitem.idletiptime = result.idletiptime;
        settingitem.playtime = result.playtime;

        return settingitem;
    }
       

    public class Settings
    {
        public string username { get; set; }
        public string pass { get; set; }
        public string buildtime { get; set; }
        public string gamespeed { get; set; }
        public string playtime { get; set; }
        public string idletimeouttime { get; set; }
        public string idletiptime { get; set; }
    }

    public class Prize
    {
        public string id { get; set; }
        public string name { get; set; }
        public string currentquantity { get; set; }
        public string originalquantity { get; set; }
        public string quantitygiven { get; set; }
        public string image1 { get; set; }
        public string image2 { get; set; }
        //public string image3 { get; set; }
        public string ratio { get; set; }
        public bool isnonprize { get; set; }
        public string tip { get; set; }
    }
}