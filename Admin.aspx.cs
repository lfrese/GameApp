using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using System.IO;
using System.Data;


public partial class _Admin : System.Web.UI.Page
{
    public bool isLoggedIn = false;
    public string errorpath = PrizeController.errorpath;
    public string prizespath = PrizeController.prizespath;
    public string settingspath = PrizeController.settingspath;
    public string imgpath = PrizeController.imgpath;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (isLoggedIn)
        {
            //get settings & populate
            PrizeController.Settings settings = PrizeController.GetSettings();
            tbPlayTime.Text = settings.playtime;
            tbPlaySpeed.Text = settings.gamespeed;
            tbBuildTime.Text = settings.buildtime;
            tbTimeOutTime.Text = settings.idletimeouttime;
            tbTipTime.Text = settings.idletiptime;
        }
       
    }


    //*****************************************************************//
    //***************Handle button clicks******************************//
    //*****************************************************************//
    /// <summary>
    /// Logs user into admin
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void LoginBtn_OnClick(Object sender, EventArgs e)
    {
        PrizeController.Settings settings = PrizeController.GetSettings();
        if (tbUser.Text == settings.username && tbPass.Text == settings.pass)
        {
            isLoggedIn = true;
            btnLogout.Visible = true;
            mvMulti.ActiveViewIndex = 1;
            tbPlayTime.Text = settings.playtime;
            tbPlaySpeed.Text = settings.gamespeed;
            tbBuildTime.Text = settings.buildtime;
            tbTimeOutTime.Text = settings.idletimeouttime;
            tbTipTime.Text = settings.idletiptime;
            LoadPrizeDataTable();
        }
        else
        {
            lblError.Text = "Please enter the correct username & password";
        }
            
    }

    /// <summary>
    /// Logs user out of admin
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void btnLogout_OnClick(Object sender, EventArgs e)
    {
        isLoggedIn = false;
        mvMulti.ActiveViewIndex = 0;
        btnLogout.Visible = false;
    }

    /// <summary>
    /// Handles when user clicks button to save edited settings
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void btnChangeSettings_OnClick(Object sender, EventArgs e)
    {
        try
        {
            PrizeController.Settings settings = PrizeController.GetSettings();
            settings.playtime = tbPlayTime.Text;
            settings.gamespeed = tbPlaySpeed.Text;
            settings.buildtime = tbBuildTime.Text;
            settings.idletimeouttime = tbTimeOutTime.Text;
            settings.idletiptime = tbTipTime.Text;
            string output = JsonConvert.SerializeObject(settings);
            File.WriteAllText(settingspath, output);
            LoadPrizeDataTable();
            lblChangesSuccess.Text = "Changes successful";
        }
        catch (Exception ex)
        {
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(errorpath, true))
            {
                file.WriteLine(DateTime.Now.ToString() + " Error in Admin.aspx.cs Method btnChangeSettings_OnClick: " + ex.Message);
            }
            lblChangesSuccess.Text = "Changes not successful";
        }
    }

    //reset all current amounts to original amounts
    protected void ResetAll_OnClick(Object sender, EventArgs e)
    {
        List<PrizeController.Prize> prizelist = PrizeController.GetPrizes();
        foreach (PrizeController.Prize prize in prizelist)
        {
            prize.currentquantity = prize.originalquantity;
            prize.ratio = "100";
        }
        string output = JsonConvert.SerializeObject(prizelist);
        try
        {
            File.WriteAllText(prizespath, output);
            lblChangesSuccess.Text = "Changes successful";
        }
        catch (Exception ex)
        {
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(errorpath, true))
            {
                file.WriteLine(DateTime.Now.ToString() + " Error in Admin.aspx.cs in method ResetAll_OnClick: " + ex.Message);
            }
        }
        LoadPrizeDataTable();
    }

    /// <summary>
    /// Takes user from edit page (view 2) to list of prizes page (view 1)
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void lbBack_OnClick(Object sender, EventArgs e)
    {
        mvMulti.ActiveViewIndex = 1;
        lblChangesSuccess.Text = "";
    }

    /// <summary>
    /// Handles command when user clicks Edit prize on prize table, or when user clicks New Prize button
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void gvPrizeList_RowCommand(object sender, CommandEventArgs e)
    {
        if (e.CommandName == "EditPrize")
        {
            string productname = e.CommandArgument.ToString();
            List<PrizeController.Prize> prizelist = PrizeController.GetPrizes();
            PrizeController.Prize prize = prizelist.Find(x => x.name == productname);
            mvMulti.ActiveViewIndex = 2;
            tbName.Text = prize.name;
            lblPrizeID.Text = prize.id;
            tbOriginalAmount.Text = prize.originalquantity;
            tbCurrentAmount.Text = prize.currentquantity;
            tbTip.Text = prize.tip;
            cbIsNonPrize.Checked = Convert.ToBoolean(prize.isnonprize);
            lblImg1.Text = prize.image1;
            lblImg2.Text = prize.image2;
            //lblImg3.Text = prize.image3;
            imgImage1.ImageUrl = prize.image1;
            imgImage2.ImageUrl = prize.image2;
            //imgImage3.ImageUrl = prize.image3;
            btnAddNewPrize.Visible = false;
            btnDeletePrize.Visible = true;
            btnEditPrize.Visible = true;
        }
        if (e.CommandName == "NewPrize")
        {
            mvMulti.ActiveViewIndex = 2;
            btnAddNewPrize.Visible = true;
            btnDeletePrize.Visible = false;
            tbName.Text = "";
            lblPrizeID.Text = "";
            tbTip.Text = "";
            tbOriginalAmount.Text = "";
            tbCurrentAmount.Text = "";
            cbIsNonPrize.Checked = false;
            lblImg1.Text = "";
            lblImg2.Text = "";
            //lblImg3.Text = "";
            imgImage1.ImageUrl = "";
            imgImage2.ImageUrl = "";
            //imgImage3.ImageUrl = "";
            btnEditPrize.Visible = false;
        }
    }

    /// <summary>
    /// Handles when user clicks edit button to make changes to an existing prize or creates a new prize if there is no
    /// ID associated 
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void EditPrize_OnClick(Object sender, EventArgs e)
    {
        //lets just delete existing and add new
        List<PrizeController.Prize> prizelist = PrizeController.GetPrizes();
        PrizeController.Prize newprize = new PrizeController.Prize();

        int numprizes = prizelist.Count;
        string prizeid = "";
        if (lblPrizeID.Text == "")
        {
            prizeid = (numprizes + 1).ToString();
        }
        else
        {
            prizeid = lblPrizeID.Text;
        }
        //save the images
        bool isValid = true;
        string img1 = "";
        string img2 = "";
        //string img3 = "";
        try
        {
            
            if (fuImg1.HasFile)
            {
                string ext1 = System.IO.Path.GetExtension(fuImg1.PostedFile.FileName);
                if (ValidateImage(ext1))
                {
                    img1 = "Images/" + SaveFile(fuImg1.PostedFile, prizeid);
                }
                else
                {
                    lblChanges.Text = "Please choose only .jpg, .png and .gif image types!";
                    isValid = false;
                }
            }
            if (fuImg2.HasFile)
            {
                string ext2 = System.IO.Path.GetExtension(fuImg2.PostedFile.FileName);
                if (ValidateImage(ext2))
                {
                    img2 = "Images/" + SaveFile(fuImg2.PostedFile, prizeid);
                }
                else
                {
                    lblChanges.Text = "Please choose only .jpg, .png and .gif image types!";
                    isValid = false;
                }
            }
            
        }
        catch (Exception ex) {
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(errorpath, true))
            {
                file.WriteLine(DateTime.Now.ToString() + " Error: "+ ex.Message );
                isValid = false;
            }
        }

        if (isValid)
        {            
            string qtygiven = "0";

            newprize.name = tbName.Text;
            //if current qty is greater than original set original to current
            if (tbCurrentAmount.Text.Trim() != "" && tbOriginalAmount.Text.Trim() != "")
            {
                if (Convert.ToInt32(tbCurrentAmount.Text) > Convert.ToInt32(tbOriginalAmount.Text))
                {
                    newprize.originalquantity = tbCurrentAmount.Text;
                    newprize.currentquantity = tbCurrentAmount.Text;
                }
                else
                {
                    newprize.originalquantity = tbOriginalAmount.Text;
                    newprize.currentquantity = tbCurrentAmount.Text;
                }
            }
            else
            {
                newprize.originalquantity = tbOriginalAmount.Text;
                newprize.currentquantity = tbCurrentAmount.Text;
            }
            //if its a new prize
            if (lblPrizeID.Text == "")
            {
                newprize.id = prizeid;
                newprize.ratio = "100";
            }
            else //if its an existing one being edited
            {
                newprize.id = prizeid;
                PrizeController.Prize oldprize = prizelist.Find(x => x.id == lblPrizeID.Text);
                //if we are changing an existing prize, but the images were not changed
                //need to keep the exising images
                if (img1 == "")
                {
                    img1 = oldprize.image1;
                }
                if (img2 == "")
                {
                    img2 = oldprize.image2;
                }
                //if (img3 == "")
                //{
                //    img3 = oldprize.image3;
                //}
                qtygiven = oldprize.quantitygiven;
                //out with the old   
                prizelist.Remove(oldprize);
                //calculate the ratio of current vs original
                if (tbOriginalAmount.Text.Trim() == "" || tbOriginalAmount.Text.Trim() == "0")
                {
                    newprize.ratio = "0";
                }
                if (tbCurrentAmount.Text.Trim() == "" || tbCurrentAmount.Text.Trim()== "0")
                {
                    newprize.ratio = "0";
                }
                else
                {
                    newprize.ratio = ((Convert.ToDouble(tbCurrentAmount.Text) / Convert.ToDouble(tbOriginalAmount.Text)) * 100).ToString();
                }
            }

            
            newprize.isnonprize = cbIsNonPrize.Checked;
            newprize.image1 = img1;
            newprize.image2 = img2;
            //newprize.image3 = img3;
            newprize.quantitygiven = qtygiven;
            newprize.tip = tbTip.Text;            
            //in with the new
            prizelist.Add(newprize);
            string output = JsonConvert.SerializeObject(prizelist);
            try
            {
                File.WriteAllText(prizespath, output);
                mvMulti.ActiveViewIndex = 1;
                lblChangesSuccess.Text = "Changes successful";
            }
            catch (Exception ex)
            {
                using (System.IO.StreamWriter file = new System.IO.StreamWriter(errorpath, true))
                {
                    file.WriteLine(DateTime.Now.ToString() + " Error in Admin.aspx.cs Method EditPrize_OnClick: " + ex.Message);
                }
            }
            LoadPrizeDataTable();
        }
    }

    /// <summary>
    /// Handles when user clicks delete button to delete a prize from the json db
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void DeletePrize_OnClick(Object sender, EventArgs e)
    {
        List<PrizeController.Prize> prizelist = PrizeController.GetPrizes();
        DeletePrize(prizelist, lblPrizeID.Text);
    }


    //*****************************************************************//
    //***************Handle JSON data**********************************//
    //*****************************************************************//

   
    /// <summary>
    /// Loades the list of prizes from the JSON db, puts into a datatable , gridview
    /// </summary>
    public void LoadPrizeDataTable()
    {
        List<PrizeController.Prize> prizelist = PrizeController.GetPrizes().OrderBy(x=>Convert.ToInt32(x.id)).ToList();

        DataTable dt = new DataTable();
        DataRow dr = null;
        dt.Columns.Add("ID", System.Type.GetType("System.String"));
        dt.Columns.Add("ProductName", System.Type.GetType("System.String"));
        dt.Columns.Add("CurrentAmount", System.Type.GetType("System.String"));
        dt.Columns.Add("OriginalAmount", System.Type.GetType("System.String"));
        dt.Columns.Add("IsNonPrize", System.Type.GetType("System.String"));

        foreach (PrizeController.Prize prize in prizelist)
        {
            dr = dt.NewRow();
            dr["ID"] = prize.id;
            dr["ProductName"] = prize.name;
            dr["CurrentAmount"] = prize.currentquantity;
            dr["OriginalAmount"] = prize.originalquantity;
            dr["IsNonPrize"] = prize.isnonprize;
            dt.Rows.Add(dr);
        }
        dt.AcceptChanges();
        gvPrizeList.DataSource = dt;
        gvPrizeList.DataBind();
    }

    /// <summary>
    /// Saves a file to the static path set above. Used to save the image uploaded
    /// </summary>
    /// <param name="file">The file to save</param>
    /// /// <param name="prizeid">ID of the prize the image is associated with</param>
    /// <returns>the filename</returns>
    protected string SaveFile(HttpPostedFile file, string prizeid)
    {
        // Specify the path to save the uploaded file to.
        string savePath = imgpath;

        // Get the name of the file to upload.
        string[] fileNamearr = file.FileName.Split('.');
        string fileName = fileNamearr[fileNamearr.Count() - 2] + "_" + prizeid + "."+fileNamearr[fileNamearr.Count() - 1];

        // Append the name of the file to upload to the path.
        savePath += fileName;

        // Call the SaveAs method to save the uploaded
        // file to the specified directory.
        file.SaveAs(savePath);
        return fileName;
    }

    /// <summary>
    /// Deletes a prize from the JSON db & returns the user to the previous view if successful
    /// </summary>
    /// <param name="prizelist">List of Prize objects</param>
    /// <param name="id">ID of the prize to delete</param>
    public void DeletePrize(List<PrizeController.Prize> prizelist, string id)
    {
        PrizeController.Prize oldprize = prizelist.Find(x => x.id == id);
        prizelist.Remove(oldprize);
        string output = JsonConvert.SerializeObject(prizelist);
        try
        {
            File.WriteAllText(prizespath, output);
            mvMulti.ActiveViewIndex = 1;
            lblChangesSuccess.Text = "Changes successful";
            LoadPrizeDataTable();
        }
        catch (Exception ex)
        {
            lblChanges.Text = "error";
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(errorpath, true))
            {
                file.WriteLine(DateTime.Now.ToString() + " Error in Admin.aspx.cs method DeletePrize: " + ex.Message);
            }
        }
        
    }

    /// <summary>
    /// Checks to ensure extension is an image
    /// </summary>
    /// <param name="ext">extension as a string</param>
    /// <returns>true if is an image, false otherwise</returns>
    public bool ValidateImage(string ext)
    {
        if (ext == ".jpg" || ext == ".png" || ext == ".gif" || ext == ".jpeg")
        {
            return true;
        }
        else
        {
            return false;
        }            
    }
    
}

