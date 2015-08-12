<%@ Page Language="C#" AutoEventWireup="true" CodeFile="EntryAdmin.aspx.cs" Inherits="EntryAdmin" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <asp:MultiView ID="mvMulti" runat="server">
    <asp:View ID="vwLogin" runat="server">
    Username: <asp:TextBox ID="tbUser" runat="server"></asp:TextBox><br />
    Pass: <asp:TextBox ID="tbPass" runat="server" TextMode="Password"></asp:TextBox><br />
    <asp:Button ID="btnLogin" runat="server" Text="Sign In" OnClick="LoginBtn_OnClick" />
    <asp:Label ID="lblError" runat="server"></asp:Label>
    </asp:View>
    <asp:View ID="vwData" runat="server">
    <asp:Button ID="btnLogOut" runat="server" OnClick="btnLogout_OnClick" Text="Log Out" />
    <asp:DataGrid ID="gvEntries" runat="server"></asp:DataGrid>
    <asp:Button ID="btnGetEntries" runat="server" OnClick="btnGetEntries_OnClick" Text="Export to CSV" />
    </asp:View>
    </asp:MultiView>
    </div>
    </form>
</body>
</html>
