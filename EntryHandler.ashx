<%@ WebHandler Language="C#" Class="EntryHandler" %>

using System;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
public class EntryHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string fname = context.Request["firstname"];
        string lname = context.Request["lastname"];
        string email = context.Request["email"];
        string terms = context.Request["terms"];
        DateTime datetime = DateTime.Now;

        //write to sql database
        try
        {
            string conn = System.Configuration.ConfigurationManager.ConnectionStrings["EntryDB"].ConnectionString;
            using (SqlConnection cn = new SqlConnection(conn))
            {
                SqlCommand cmd = new SqlCommand("INSERT INTO Entry (FirstName, LastName, EmailAddress, DateTime, TermsAgreed) VALUES (@FirstName, @LastName, @EmailAddress, @DateTime,@TermsAgreed)");
                cmd.CommandType = CommandType.Text;
                cmd.Connection = cn;
                cmd.Parameters.AddWithValue("@FirstName", fname);
                cmd.Parameters.AddWithValue("@LastName", lname);
                cmd.Parameters.AddWithValue("@EmailAddress", email);
                cmd.Parameters.AddWithValue("@DateTime", datetime);
                cmd.Parameters.AddWithValue("@TermsAgreed", terms);
                cn.Open();
                cmd.ExecuteNonQuery();                
            }
            context.Response.Write("success");
        }
        catch (Exception ex)
        {
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(PrizeController.errorpath, true))
            {
                file.WriteLine(DateTime.Now.ToString() + " Error in EntryHandler.ashx: " + ex.Message);
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