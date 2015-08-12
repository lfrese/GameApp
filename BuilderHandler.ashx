<%@ WebHandler Language="C#" Class="BuilderHandler" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

public class BuilderHandler : IHttpHandler {
    int numnonprizes = 6; //number of non prizes to use on the board
    int numprizes = 12; // number of prizes to show on the board
    int totalspots = 18; // number of spots on the board
    bool allowduplicates = false; //if prizes available gets too low and we dont have enough nonprizes, allow nonprize duplicates
    List<int> numused = new List<int>();
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";        
        List<PrizeController.Prize> prizelist = PrizeController.GetPrizes();
        CalculatePrizes(prizelist, context);   
        
    }

    public void CalculatePrizes(List<PrizeController.Prize> prizelist, HttpContext context)
    {
        List<PrizesToPlay> playlist = new List<PrizesToPlay>();
        
        //get the total amount of prizes left
        int totalleft = 0;
        foreach (PrizeController.Prize p in prizelist.Where(p => p.isnonprize == false))
        {
            try
            {
                totalleft += Convert.ToInt32(p.currentquantity);
            }
            catch { }
        }
        if (totalleft <= 0)
        {
            context.Response.Write("none");
        }
        else
        {
            //if there arent enough, calculate how many non prizes to put up
            if (totalleft < numprizes)
            {
                numnonprizes = totalspots - totalleft;
                numprizes = totalleft;
            }

            //get prizes where qty is greater than 0 & order by ratio
            List<PrizeController.Prize> initprizes = PrizeController.GetPrizes().Where(x => x.isnonprize == false).Where(r => Convert.ToDouble(r.ratio) > 0).OrderByDescending(y => Convert.ToDouble(y.ratio)).ToList();
            List<PrizeController.Prize> initnonprizes = PrizeController.GetPrizes().Where(x => x.isnonprize == true).Where(r => Convert.ToDouble(r.ratio) > 0).OrderByDescending(y => Convert.ToDouble(y.ratio)).ToList();

            //only get the prizes we will use
            initprizes = initprizes.Take((numprizes + 1)).ToList();
            if (numprizes > initprizes.Count())
            {
                numprizes = initprizes.Count();
                numnonprizes = totalspots - numprizes;
            }
            if ((initprizes.Count() + initnonprizes.Count()) < totalspots || initnonprizes.Count() < numnonprizes)
            {
                allowduplicates = true;
            }

            //generate a list of random nonprizes
            List<PrizeController.Prize> temp = new List<PrizeController.Prize>();
            for (int i = 0; i < numnonprizes; i++)
            {
               // if (allowduplicates && i == Math.Floor(Convert.ToDecimal(numnonprizes / 2)))
               // {
                    //numused.Clear();
               // }
                int r = generateRandom(initnonprizes.Count());
                temp.Add(initnonprizes.ElementAt(r));

            }
            //put non prizes and prizes in one list

            temp.AddRange(initprizes);
            numused.Clear();

            //shuffle everything
            for (int i = 0; i < totalspots; i++)
            {
                PrizeController.Prize tempprize = temp.ElementAt(generateRandom(totalspots));
                PrizesToPlay play = new PrizesToPlay();
                play.id = tempprize.id;
                play.isnonprize = tempprize.isnonprize;
                if (tempprize.isnonprize)
                {
                    play.image = tempprize.image1;
                }
                else
                {
                    Random rnd = new Random();
                    int r = rnd.Next(1, 3);
                    if (r == 1)
                    {
                        play.image = tempprize.image1;
                    }
                    else
                    {
                        play.image = tempprize.image2;
                    }
                }
                playlist.Add(play);
            }
            numused.Clear();
            context.Response.Write(JsonConvert.SerializeObject(playlist));
        }
    }

    public int generateRandom(int len)
    {
        int r = 0;
        Random rnd = new Random();
        r = rnd.Next(len);
        if (numused.Contains(r))
        {
            while (numused.Contains(r))
            {
                r = rnd.Next(len);
            }
        }
        numused.Add(r);
        return r;
    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}

 

public class PrizesToPlay
{
    public string id { get; set; }
    public string image { get; set; }
    public bool isnonprize { get; set; }
}