<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeFile="Admin.aspx.cs" Inherits="_Admin" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
    <link href="Styles/Site.css" rel="stylesheet" type="text/css" />
    <title>Admin</title>
    <style>
    body
    {
        overflow-y:scroll;
        padding-bottom:20px;
    }
    </style>
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">

<div class="page">
        <div class="header">
            <div class="title">
                <h1>
                    Admin
                </h1>
                <div id="logout">
                    <asp:Button ID="btnLogout" runat="server" OnClick="btnLogout_OnClick" Text="Log Out" Visible="false" />
                </div>
            </div>   
        </div>
        <div class="main">
            <asp:MultiView ID="mvMulti" runat="server" ActiveViewIndex="0">
                <asp:View ID="vwLogin" runat="server">
                    <div id="login">
                        Username: <asp:TextBox ID="tbUser" runat="server"></asp:TextBox> <br /><br />
                        Password: <asp:TextBox ID="tbPass" runat="server" TextMode="Password"></asp:TextBox><br /><br />
                        <asp:Button ID="btnLogin" runat="server" Text="Log In" OnClick="LoginBtn_OnClick" /> <br /><br />
                        <asp:Label ID="lblError" runat="server" CssClass="error"></asp:Label>
                    </div>
                </asp:View>

                <asp:View ID="vwTable" runat="server">
                    <asp:Button ID="btnNewPrize" runat="server" Text="New Prize" OnCommand="gvPrizeList_RowCommand" CommandName="NewPrize" CommandArgument="" /><br />
                    <asp:Label ID="lblChangesSuccess" runat="server"></asp:Label>
                    <div id="settings">
                        <h2>Settings:</h2><br />
                        Higher # is slower<br />
                        Play Time: <asp:TextBox ID="tbPlayTime" runat="server" Width="40"></asp:TextBox> seconds<br />
                        Selector Speed: <asp:TextBox ID="tbPlaySpeed" runat="server" Width="40"></asp:TextBox> milliseconds<br />
                        Build Time: <asp:TextBox ID="tbBuildTime" runat="server" Width="40"></asp:TextBox> milliseconds<br />
                        Idle Try Again: <asp:TextBox ID="tbTimeOutTime" runat="server" Width="40"></asp:TextBox> seconds<br />
                        Idle Tip: <asp:TextBox ID="tbTipTime" runat="server" Width="40"></asp:TextBox> seconds<br />
                        <asp:Button ID="btnChangeSettings" runat="server" OnClick="btnChangeSettings_OnClick" Text="Change" /><br />
                    </div>
                    <div id="prizetable" runat="server">
                        <h2>Prizes</h2>
                        <asp:GridView id="gvPrizeList" runat="server" AutoGenerateColumns="False" DataKeyNames="ProductName" >
                            <Columns>
                                <asp:BoundField DataField="ID" HeaderText="ID" />
                                <asp:BoundField DataField="ProductName" HeaderText="Product" />
                                <asp:BoundField DataField="CurrentAmount" HeaderText="Current Amount" />
                                <asp:BoundField DataField="OriginalAmount" HeaderText="Original Amount" />
                                <asp:BoundField DataField="IsNonPrize" HeaderText="IsNonPrize" />
                                <asp:TemplateField HeaderText="Edit">
                                    <ItemTemplate>
                                        <asp:LinkButton ID="lbEdit" runat="server" Text="Edit" CommandName="EditPrize" CommandArgument='<%#Bind("ProductName") %>' OnCommand="gvPrizeList_RowCommand"></asp:LinkButton>
                                    </ItemTemplate>
                                </asp:TemplateField>
                            </Columns>                        
                        </asp:GridView><br />
                        <asp:Button ID="btnResetAll" runat="server" OnClick="ResetAll_OnClick"  OnClientClick="javascript: return checkReset();" Text="Reset All Current Quantities to Original" />
                    </div>   
                    <script>
                        function checkReset() {
                            var r = window.confirm("Are you sure you want to reset all of the prize amounts to the original amounts?");
                            if (r) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    </script>             
                </asp:View>

                <asp:View ID="vwEditPrize" runat="server">
                    <div id="editprize">
                        <asp:Label runat="server" ID="lblChanges"></asp:Label>
                        <ul>
                            <li>
                                <b>ID:</b> <asp:Label ID="lblPrizeID" runat="server"></asp:Label>
                            </li>
                            <li>
                                <b>Name:</b> <asp:TextBox ID="tbName" runat="server"></asp:TextBox>
                            </li>
                            <li>
                                <b>Current Amount:</b> <asp:TextBox ID="tbCurrentAmount" runat="server"></asp:TextBox>
                            </li>
                            <li>
                                <b>Original Amount:</b> <asp:TextBox ID="tbOriginalAmount" runat="server"></asp:TextBox>
                            </li>
                            <li>
                                <b>Tip:</b> <asp:TextBox ID="tbTip" runat="server" Columns="80"></asp:TextBox>
                            </li>
                            <li>
                                <b>Is Not A Prize:</b> <asp:CheckBox ID="cbIsNonPrize" runat="server" />
                            </li>
                            <li>
                               <b> Image:</b> <asp:FileUpload ID="fuImg1" runat="server" /><br />
                                <b>Current Image:</b> <asp:Label ID="lblImg1" runat="server"></asp:Label><br />
                                <asp:Image ID="imgImage1" runat="server" />
                            </li>
                            <li>
                                <b>Alternate Image:</b> <asp:FileUpload ID="fuImg2" runat="server" /><br />
                               <b>Current Image:</b> <asp:Label ID="lblImg2" runat="server"></asp:Label><br />
                                <asp:Image ID="imgImage2" runat="server" />
                            </li>
                            <%--<li>
                                <b>Tip Image:</b> <asp:FileUpload ID="fuImg3" runat="server" /><br />
                               <b>Current Image:</b> <asp:Label ID="lblImg3" runat="server"></asp:Label><br />
                                <asp:Image ID="imgImage3" runat="server" />
                            </li>--%>
                        </ul>
                        <asp:Button ID="btnEditPrize" runat="server" OnClick="EditPrize_OnClick" Text="Submit Changes" Visible="false" />
                        <asp:Button ID="btnAddNewPrize" runat="server" OnClick="EditPrize_OnClick" Text="Submit" Visible="false" /> &nbsp; &nbsp; &nbsp; 
                        <asp:Button ID="btnDeletePrize" runat="server" OnClientClick="javascript: return checkdelete();" OnClick="DeletePrize_OnClick" Text="Delete Prize" />
                        <br /><br />
                        <asp:LinkButton ID="lbBack" runat="server" OnClick="lbBack_OnClick" Text="< Back"></asp:LinkButton>
                    </div>
                    <script>
                        function checkdelete() {
                            var r = window.confirm("Are you sure you want to delete this prize?");
                            if (r) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    </script>                
                </asp:View>

           </asp:MultiView>
         </div>
        <div class="clear"></div>
    </div>
</asp:Content>
