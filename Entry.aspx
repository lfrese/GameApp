<%@ Page Title="Home Page" Language="C#" AutoEventWireup="true"
    CodeFile="Entry.aspx.cs" MasterPageFile="~/Site.master" Inherits="_Entry" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
   <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.5">   
   <link rel="stylesheet" type="text/css" href="Styles/MyFontsWebfontsKit/MyFontsWebfontsKit.css"/>
   <link href="Styles/Entry.css" rel="stylesheet" type="text/css" />
   <script src="Scripts/jquery-2.1.3.min.js" type="text/javascript"></script>
   <script>
        //Email domain suggestion
        //http://webdesign.tutsplus.com/tutorials/building-a-mobile-friendly-form-with-email-domain-suggestion--pre-31048
        //by Jim Nielson
       $(document).ready(function () {

           // Insert the <span> tag. This will be the suggestion box  
           $('<span class="suggestion"></span>').insertAfter('input[type=email]').hide();

           // Every keyup watches for the entering of a domain 
           $("input[type=email]").keyup(function () {

               // We need to define the following variables 
               //      1. Define the parent element. We use this in selecting the context of the input[type=email] in focus 
               //      2. Get the current input value 
               //      3. Get the position of the '@' symbol 

               var parent = $(this).parent();
               var value = $(this).val();
               var a_pos = value.indexOf('@'); // value will default to -1 if not entered 

               // If the @ symbol has been entered, execute the suggested function          
               if (a_pos != -1) {

                   // If the character AFTER the '@' symbol matches any of the following email domains, suggest them 
                   if (value[a_pos + 1] == 'a') {
                       $('.suggestion', parent).text('aol.com').show();
                   }
                   else if (value[a_pos + 1] == 'c') {
                       $('.suggestion', parent).text('comcast.net').show();
                   }
                   else if (value[a_pos + 1] == 'g') {
                       $('.suggestion', parent).text('gmail.com').show();
                   }
                   else if (value[a_pos + 1] == 'h') {
                       $('.suggestion', parent).text('hotmail.com').show();
                   }
                   else if (value[a_pos + 1] == 'm') { //  "msn" is more popular, so it is the default suggestion for just the letter 'm' 
                       if (value[a_pos + 2] == 'e') {
                           $('.suggestion', parent).text('me.com').show();
                       } else {
                           $('.suggestion', parent).text('msn.com').show();
                       }
                   }
                   else if (value[a_pos + 1] == 'l') {
                       $('.suggestion', parent).text('live.com').show();
                   }
                   else if (value[a_pos + 1] == 'o') {
                       $('.suggestion', parent).text('outlook.com').show();
                   }
                   else if (value[a_pos + 1] == 'y') {
                       $('.suggestion', parent).text('yahoo.com').show();
                   }
                   else { //if none match, hide the tooltip 
                       $('.suggestion', parent).hide();
                   }

               } else {
                   $('.suggestion', parent).hide();
               }
           });



           // Add the domain to the currently entered value 
           $('.suggestion').click(function () {

               // Define the following variables: 
               // These will be used to concatenate the suggested email domain to whatever the user has entered thus far: 
               //      1. Email domain suggestions  
               //      2. Current input value from user 
               //      3. Position of the '@' symbol 
               //      4. Current value before the '@' symbol 

               //      Also get the parent element for context of input[type=email] 
               var parent = $(this).parent();
               var suggested_val = $(this).text(); //currently suggested email domain 
               var input_val = $('input[type=email]', parent).val(); //current input value by user 
               var a_pos = input_val.indexOf('@'); //position of '@' symbol in input value 
               var before_a = input_val.substr(0, a_pos); //value of email address before '@' symbol 



               // Concatenante the suggested email domain to the current value suggested by the user 
               $('input[type=email]', parent).val(before_a + '@' + suggested_val);
               $(this).hide();
           });


           // we need to track mouse events on the suggestion field. If the user is hovering over the suggestion,  
           //      it will execute the insert_suggestion 
           //      otherwise, on mouseout it will hide the suggestion  
           var mouseOver = false; //default state is false 
           $('.suggestion').mouseover(function () {
               mouseOver = true;
           })
            .mouseout(function () {
                mouseOver = false;
            });


           //hide suggestion when field is out of focus 
           $('input[type=email]').blur(function () {
               if (!(mouseOver)) {
                   $('.suggestion').hide();
               }
           });

   });
   </script>
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
<div id="inneroverlay">
    <div id="closeme"></div>
    <div id="innersubmit"></div>
</div>
<div id="overlay">    
</div>
<div id="entryform">
    <div id="error"></div>
    <div id="names">
        <div id="firstname" class="input name">
            <asp:TextBox ID="tbFirstName" runat="server" placeholder="First Name"> </asp:TextBox>
        </div> 
        <div id="lastname" "input name">
            <asp:TextBox ID="tbLastName" runat="server" placeholder="Last Name"></asp:TextBox>
        </div>
    </div>
    <div id="email" class="input">
        <asp:TextBox ID="tbEmail" runat="server" placeholder="Email Address" type="email"></asp:TextBox>
    </div>
    <div id="checkboxterms">        
        <input type="checkbox" name="cbTerms" id="cbTerms" /> <span id="cbText">I have read and agree with the terms and conditions below.</span>
    </div>
    <div id="buttons">
        <div id="clearbutton" class="button">
            
        </div>
        <div id="submitbutton" class="button">
            
        </div>
    </div>  
</div>
<div id="footer">
    <div id="terms">
        <div style="font-weight:bold;font-size:28pt;">Terms and Conditions </div>
        Lorem ipsum dolor sit amet, sapien nullam phasellus vestibulum mollis, sollicitudin a id adipiscing, congue nec donec bibendum. A etiam quis vel mi, magna tellus ac scelerisque nunc. At blandit potenti iaculis diam, magna mi donec integer risus. Et imperdiet non porttitor, velit viverra mauris adipiscing. At blandit rhoncus justo, porttitor vel ante vel. Id in cras mi ut, eleifend nec sapiente ultricies nibh, odio commodo aenean rhoncus sagittis, nec a sed elementum eget. Pede nibh quisque ultricies, penatibus magna quam sit, tincidunt nunc sollicitudin leo ut, lectus turpis lacinia vehicula. Iaculis dolor dictum dolor, rutrum dictum.
    </div>
    <div id="copy">
    </div>
</div>

<script>
    $(function () {

        $("#cbText").click(function () {
            if ($("#cbTerms").prop("checked")) {
                $("#cbTerms").prop('checked', false);
            }
            else {
                $("#cbTerms").prop('checked', true);
            }
        });

        $("#clearbutton").click(function () {
            $('input').val('');
            $("#cbTerms").attr('checked', false);
            $("#firstname input").css("background", "#fff");
            $("#lastname input").css("background", "#fff");
            $("#email input").css("background", "#fff");
            $("#checkboxterms").css("color", "#fff");
            $("#error").hide();
            window.scrollTo(0, 0);
        });

        $("#submitbutton").click(function () {
            var fname = $("#firstname input").val();
            var lname = $("#lastname input").val();
            var email = $("#email input").val();
            var terms = $("#cbTerms").prop('checked');
            var isvalid = validateentry(fname, lname, email);
            var date = new Date();
            if (isvalid) {
                var data = { "datetime": date.toString(), "firstname": fname, "lastname": lname, "email": email,'terms':terms };
                $.ajax({
                    url: "EntryHandler.ashx",
                    data: data,
                    type: 'POST',
                    success: function (response) {
                        console.log(response);
                        if (response == "success") {
                            window.scrollTo(0, 0);
                            $("#inneroverlay").show();
                            $("#overlay").show();
                            setTimeout(function () {
                                $("#clearbutton").click();
                                $("#overlay").hide();
                                $("#inneroverlay").hide();
                            }, 15000);
                        }
                        else {
                            $("#error").html('We’re sorry, there was an error. ');
                            $("#error").show();
                        }
                    },
                    error: function (response) {
                        $("#error").html('We’re sorry, there was an error. ');
                        $("#error").show();
                        console.log(response);
                    }
                });
            }
        });

        function validateentry(fname, lname, email) {
            $("#firstname input").css("background", "#fff");
            $("#lastname input").css("background", "#fff");
            $("#email input").css("background", "#fff");
            $("#checkboxterms").css("color", "#fff");
            $("#error").html('');
            $("#error").hide();
            var isvalid = true;
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            var error = "The following fields are required or have errors:<br>";
            var cb = $("#checkboxterms input").is(':checked');
            if (fname.length < 1) {
                error += "First Name <br>"
                $("#firstname input").css("background", "#fcf910");
                isvalid = false;
            }
            if (lname.length < 1) {
                error += "Last Name <br>"
                $("#lastname input").css("background", "#fcf910");
                isvalid = false;
            }
            if (email.trim() == '' || !re.test(email)) {
                error += "Email Address <br>";
                $("#email input").css("background", "#fcf910");
                isvalid = false;
            }
            if (!cb) {
                error += "Please agree to the terms and conditions"
                $("#checkboxterms").css("color", "#fcf910");
                isvalid = false;
            }

            if (!isvalid) {
                $("#error").show();
                $("#error").html(error);
            }

            return isvalid;
        }


        $("#closeme, #innersubmit").click(function () {
            $("#inneroverlay").hide();
            $("#overlay").hide();
            $("#clearbutton").click();
        });

    });
</script>

</asp:Content>
