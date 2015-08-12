using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Text;
public partial class EntryAdmin : System.Web.UI.Page
{
    protected DataSet ds;
    protected string username = "admin";
    protected string pass = "";
    protected bool isLoggedIn = false;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!isLoggedIn)
        {
            mvMulti.ActiveViewIndex = 0;
        }        
        
    }

    protected void LoginBtn_OnClick(Object sender, EventArgs e)
    {
       
        if (tbUser.Text == username && tbPass.Text == pass)
        {
            isLoggedIn = true;
            mvMulti.ActiveViewIndex = 1;
            LoadGrid();
        }
        else
        {
            lblError.Text = "Please enter the correct username & password";
        }

    }

    protected void btnLogout_OnClick(Object sender, EventArgs e)
    {
        isLoggedIn = false;
        mvMulti.ActiveViewIndex = 0;        
    }
    void LoadGrid()
    {
        string conn = "";
        using (SqlConnection cn = new SqlConnection(conn))
        {
            string query = "SELECT * FROM Entry Order By DateTime";
            cn.Open();
            SqlDataAdapter da = new SqlDataAdapter(query, cn);
            ds = new DataSet();
            da.Fill(ds);
            gvEntries.DataSource = ds;
            gvEntries.DataBind();
        }
    }
    //Show all of the entries in csv
    protected void btnGetEntries_OnClick(Object sender, EventArgs e)
    {
        LoadGrid();
        Response.Clear();
        Response.Buffer = true;
        Response.AddHeader("content-disposition",
         "attachment;filename=EntriesExport.csv");
        Response.Charset = "";
        Response.ContentType = "application/text";

        gvEntries.AllowPaging = false;
        gvEntries.DataBind();

        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < ds.Tables[0].Columns.Count; k++)
        {
            //add separator
            sb.Append(ds.Tables[0].Columns[k].ColumnName + ',');
        }
        //append new line
        sb.Append("\r\n");
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            for (int k = 0; k < ds.Tables[0].Columns.Count; k++)
            {
                //add separator
                sb.Append(ds.Tables[0].Rows[i][k].ToString() + ',');
            }
            //append new line
            sb.Append("\r\n");
        }
        Response.Output.Write(sb.ToString());
        Response.Flush();
        Response.End();
    }


}