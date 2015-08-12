<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeFile="Default2.aspx.cs" Inherits="_Default2" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
 <link rel="stylesheet" type="text/css" href="Styles/MyFontsWebfontsKit/MyFontsWebfontsKit.css"/>
    <link href="Styles/Site.css" rel="stylesheet" type="text/css" />
    <script src="Scripts/imagesloaded.min.js" type="text/javascript"></script>
    <script src="Scripts/TweenMax.min.js" type="text/javascript"></script>
    <script src="Scripts/Physics2DPlugin.min.js" type="text/javascript"></script>
    <script src="Scripts/flair.js" type="text/javascript"></script>
    <script>
       
            function populatefromtheback(){
                imagelist = <%= allimages %>;
                originalbuildspeed = parseInt(<%= buildtime %>);
                originalgamespeed = parseInt(<%= gamespeed %>);
                finalcountdown = parseInt(<%= playtime %>);
                timetoidleAfterWin = parseInt(<%= idletiptime %>);
                timetoidleAfterTimeout = parseInt(<%= idletimeouttime %>);
            }
    </script>
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    

<div id="gameboard">
	<div id="seperationlayer">
        <div id="hiddentrigger" style="display:none;"></div>
    	<div id="toplayer"></div>
        <div id="bottomlayer"></div>
        <div id="prizemelogo"><div id="topbar" class="bar"></div><img src="Images/SiteImages/prizemelogo.png" /><div id="bottombar" class="bar"></div></div>
        <div id="wanttoplay"><img src="Images/SiteImages/wantprize.png" /></div>
    </div>
    <div id="innerboard">
        <div id="prizeitems">
            <div id="top">
            	<div class="outer p0">
                    <div class="circle p0">
                    </div>
                </div>
            	<div class="outer p1">
                    <div class="circle p1">
                    </div>
                </div>
                <div class="outer p2">
                    <div class="circle p2">
                    </div>
                </div>
                <div class="outer p3">
                    <div class="circle p3">
                    </div>
                </div>
                <div class="outer p4">
                    <div class="circle p4">
                    </div>
                </div>
                <div class="outer p5">
                    <div class="circle p5">
                    </div>
                </div>
                <div class="outer p6">
                    <div class="circle p6">
                    </div>
                </div>              
            </div>
            <div id="right">
                <div class="outer p7">
                    <div class="circle p7">
                    </div>
                </div>
                <div class="outer p8">
                    <div class="circle p8">
                    </div>
                </div>
            </div>
            <div class="bounce-container"><div class="get-ready-container"><div id="getready"></div></div><div class="shadow"></div></div>
             <div id="countdownlogo">
                <div id="youhave" style="margin-left: -522px; margin-top: -8px;"></div>
             </div>
             <div id="noneleft" class="DIN">Oh no!  </div>
             <div class="countdown">
                <div class="bloc-time sec" data-init-value="0">
                    <div class="figure sec sec-1">
                    <span class="top">0</span>
                    <span class="top-back">
                      <span>0</span>
                    </span>
                    <span class="bottom">0</span>
                    <span class="bottom-back">
                      <span>0</span>
                    </span>          
                  </div>

                  <div class="figure sec sec-2">
                    <span class="top">0</span>
                    <span class="top-back">
                      <span>0</span>
                    </span>
                    <span class="bottom">0</span>
                    <span class="bottom-back">
                      <span>0</span>
                    </span>
                  </div>
                </div>
             </div>
             <div id="winner"><div id="emitter"></div></div>
             <div id="tryagain"></div>
             <div id="left">
                <div class="outer p17">
                    <div class="circle p17">
                    </div>
                </div>
                <div class="outer p16">
                    <div class="circle p16">
                    </div>
                </div>
            </div> 
            <div style="clear:both;"></div> 
            <div id="bottom">               
                <div class="outer p15">
                    <div class="circle p15">
                    </div>
                </div>
                <div class="outer p14">
                    <div class="circle p14">
                    </div>
                </div>
                <div class="outer p13">
                    <div class="circle p13">
                    </div>
                </div>
                <div class="outer p12">
                    <div class="circle p12">
                    </div>
                </div>
                <div class="outer p11">
                    <div class="circle p11">
                    </div>
                </div>
                <div class="outer p10">
                    <div class="circle p10">
                    </div>
                </div>
                <div class="outer p9">
                    <div class="circle p9">
                    </div>
                </div>
            </div>           
        </div>
    </div> 
    <div id="winnerboard">
        <div id="congrats"><img src="Images/SiteImages/congrats.png" /></div>
        <div id="justwon" class="DIN">You've just won <span class="wonprizename"></span></div>
        <div id="prizetipimg">
            <div id="claimprize"></div><div id="tipimage"></div><div id="tip" class="DIN"></div>
            <div style="clear:both;"></div>
        </div>
        <div id="restart"></div>
    </div>   
</div>

<audio id="audioBg" src="audio/01-Background.wav"></audio>
<audio id="audioBoop1" src="audio/02-Boop-01.wav"></audio>
<audio id="audioBoop2" src="audio/02-Boop-02.wav"></audio>
<audio id="audioCheer" src="audio/02-Cheer.wav"></audio>
<audio id="audioGameBell" src="audio/02-GameBell.wav"></audio>
<audio id="audioTickTock" src="audio/02-TickTock.mp3"></audio>
<audio id="audioTimesUp" src="audio/03-TimesUp.wav"></audio>

</asp:Content>
