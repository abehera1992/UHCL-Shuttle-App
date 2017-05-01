
/*

INITIALIZE

*/
document.addEventListener('DOMContentLoaded', function() { 
    
    
 //FIREBASE CONFIG
     var config = {
    apiKey: "AIzaSyCBZhBFK2sHs5B5Jle_3pk-u3TWU5hvIoE",
    authDomain: "uhcl-shuttle-app.firebaseapp.com",
    databaseURL: "https://uhcl-shuttle-app.firebaseio.com",
    projectId: "uhcl-shuttle-app",
    storageBucket: "uhcl-shuttle-app.appspot.com",
    messagingSenderId: "560988370163"
  };
//INITIALIZE FIREBASE WEB APP
  firebase.initializeApp(config);
    
    var auth = firebase.auth();
    var db = firebase.database();
    var messaging = firebase.messaging();
    
//    messaging.requestPermission().then(function() {
//  console.log('Notification permission granted.');
//        // TODO(developer): Retrieve an Instance ID token for use with FCM.
//        // ...
//    }).catch(function(err) {
//    console.log('Unable to get permission to notify.', err);
//    });
    
    
    
    

//REDEFINE DOCUMENT AS LOCAL DOC
    var doc = document;
    window.snackbarContainer = doc.querySelector('#toast');
   /* window.snackbarContainer = doc.querySelector("#alert-snackbar");*/
    
    /* Bootstrap Validator javascript */
    
  $(document).ready(function(){
          $('#login-form').bootstrapValidator({
              
                   feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
              fields : {
                      email : {
                          validators : {
                              emailAddress : {
                                  message : 'Please provide a valid uhcl.edu domain address'
                              },
                             
                          }
                      },
                      password : {
                          validators : {
                              notEmpty : {
                                  message : 'Please provide your Password'
                              },
                              stringLength : {
                                  min : 6,
                                  max : 20,
                                  message : 'Password should have minimum 6 characters'
                              }
                          }
                      }
              }
              
          }); 
      $(document).keyup(function(e) {
     if (e.keyCode == 27) { // escape key maps to keycode `27`
        // <DO YOUR WORK HERE>
          $('#login-form').bootstrapValidator('resetForm', true);
    } 
   
});
      });

/*

VARIABLES

*/

//ACCOUNT PAGE
var pwdUsersOnlyDiv = doc.getElementById("pwd-users-only-div");
var newEmailInput =  doc.getElementById("new-email-input");
var newEmailSubmitButton =  doc.getElementById("new-email-submit-button");
var newPasswordSubmitButton =  doc.getElementById("new-password-submit-button");
var newEmailInputMdlTextfield =  doc.getElementById("new-email-input-mdl-textfield");
var deleteAccountButton = doc.getElementById('delete-account-button');
var verifyPasswordInputMdlTextfield = doc.getElementById('verify-password-input-mdl-textfield');
var verifyPasswordInput = doc.getElementById('verify-password-input');
var verifyPasswordSubmitButton = doc.getElementById('verify-password-submit-button'); //created dynamically
var verifyPasswordEmailInput = doc.getElementById('verify-password-email-input');
var verifyPasswordDiv = doc.getElementById('verify-password-div');


//ACK PAGE
var getArg = getArg();
var mode = getArg['mode'];
var oobCode = getArg['oobCode'];
var apiKey = getArg['apiKey'];
var ackActionsDiv = doc.getElementById('ack-actions-div');

//LOGIN PAGE

  var registerCard = doc.getElementById('register-card');
  var registerButton = doc.getElementById('register-button');
  var loginButton = doc.getElementById('login-button');
  var submitButton = doc.getElementById('submit-button');
  var exitButton = doc.getElementById('exit-button');
  var loginCard = doc.getElementById('login-card');
  var logoutCard = doc.getElementById('logout-card');
  var noticeCard = doc.getElementById('notice-card');
  var passwordInputMdlTextfield = doc.getElementById('password-input-mdl-textfield');
  var registrationInputPassword2MdlTextfield = doc.getElementById('registration-input-password2-mdl-textfield');
  var backButton = doc.getElementById('back-button');
  var providers = doc.getElementsByClassName('oauth-login-button');
  var registrationInputPassword = doc.getElementById('registration-input-password');
  var registrationInputPassword2 = doc.getElementById('registration-input-password2');
  var emailInput = doc.getElementById('email');
  var displayNameInput = doc.getElementById('display-name');
  var userPhoneInput = doc.getElementById('phone');
  var usernameInput = doc.getElementById('username-input');
  var passwordInput = doc.getElementById('password-input');
    
//INDEX PAGE
    
 var indexSignupButton = doc.getElementById('index-signup');
 var indexBackButton = doc.getElementById('index-back');
    


//SHARED
  var email = null;
  var provider = null;
  var displayName = null;
  var phoneNumber = null;
  var photoUrl = null;
  var uid = null;    
  var verifiedUser = false;

  var signInButton = doc.getElementById('sign-in-button');
  var accountButton = doc.getElementById('account-menu-button');

/*

EVENT LISTENERS

*/


    
    
    //ACCOUNT PAGE

    //Enable pressing ENTER
    
    /*if(newEmailInputMdlTextfield){
        newEmailInputMdlTextfield.addEventListener("keyup",function(e){ */
    if(newEmailInput){
        newEmailInput.addEventListener("keyup",function(e){
           e.preventDefault();
            if(e.keyCode == 13){
                newEmailSubmitButton.click();
            }
        });
    }

    //SHARED
    signInButton.addEventListener("click", function(){            //Redirects to login page
       window.location = "/login";                        
    });
    


    //SOCIAL BUTTONS
    if(providers){
        for(var i = 0; i < providers.length; i++) {
            providers[i].addEventListener("click", fireAuth);     // For iterating through social buttons login options: Google+ and facebook
        }
    }


/*

FIREBASE METHODS

*/

    //SWITCH TO DETECT HOW TO HANDLE ACK PAGE/ EMAIL ACTION HANDLER ARGUMENTS

    switch(mode) {
        case 'resetPassword':
            handleResetPassword(auth, oobCode);
            break;
        case 'recoverEmail' :
            handleRecoverEmail(auth, oobCode);
            break;
        case 'verifyEmail':
            handleVerifyEmail(auth, oobCode);
            break;
    }

    //FIREBASE AUTH STATE CHANGE METHOD

  auth.onAuthStateChanged(function(user) {
    if (user) {
      provider = user.providerData[0].providerId ? user.providerData[0].providerId : null;
      verifiedUser = user.emailVerified ? user.emailVerified : null;
      displayName = user.displayName ? user.displayName : null;
      email = user.email ? user.email : null;
      photoUrl = user.photoURL ? user.photoURL : null;
      uid = user.uid ? user.uid : null;
      
        switch(provider) {
            case 'facebook':
            case 'google':
            break;
            case 'password':
            if(!verifiedUser){
                if(loginCard && logoutCard && noticeCard){
                        loginCard.style.display = "none";
                        logoutCard.style.display = "none";
                        noticeCard.style.display = "inline";              
                        }

                //kick unvalidated users to the login page
                redirect('login');
                //break out of function logic here
                return;
            }
            break;
                //var isAnonymous = user.isAnonymous;
        }
      
      verifiedUser = true;

      
      if (uid == 'pmKvDiX6itaaWrYH9R9Ggf0FRlG2'){
        
           if(loginCard && logoutCard && noticeCard){
                loginCard.style.display = "none";
                logoutCard.style.display = "none";
                noticeCard.style.display = "none";                
              }
            if(deleteAccountButton){
                        deleteAccountButton.disabled = false;
                        deleteAccountButton.addEventListener("click", function(){
                        deleteAccount(provider);
                    });  
                }
            if(pwdUsersOnlyDiv){
                if(provider == "password"){
                    if(verifiedUser){
                            // display account update options
                            pwdUsersOnlyDiv.style.display = "inline";
                            //enable email submit button only if input not empty
                            newEmailInputMdlTextfield.addEventListener("input", function() {
                            if (this != null) {
                            newEmailSubmitButton.disabled = false;
                            }
                        });
            
                    newEmailSubmitButton.addEventListener("click", function(){
                    var newEmailInputArg = newEmailInput.value;
                    newEmail(newEmailInputArg);
                    });
                    newPasswordSubmitButton.addEventListener("click", function(){
                    newPasswordViaEmailReset(email);
                    });
            
          } else {
            // tell them to verify first
          }
        }        
      } // pwdUsersOnlyDiv ENDS 
         
    } else {
        
       if(loginCard && logoutCard && noticeCard){
                loginCard.style.display = "none";
                logoutCard.style.display = "inline";
                noticeCard.style.display = "none";                
              }  
        
           if(deleteAccountButton){
        // any logged in user can delete their account
        deleteAccountButton.disabled = false;
        
        deleteAccountButton.addEventListener("click", function(){
          deleteAccount(provider);
        });  
      }
      
      if(pwdUsersOnlyDiv){
        if(provider == "password"){
          if(verifiedUser){
            // display account update options
            pwdUsersOnlyDiv.style.display = "inline";
           
            //enable email submit button only if input not empty
            newEmailInputMdlTextfield.addEventListener("input", function() {
              if (this != null) {
                newEmailSubmitButton.disabled = false;
              }
            });
            
            newEmailSubmitButton.addEventListener("click", function(){
              var newEmailInputArg = newEmailInput.value;
              newEmail(newEmailInputArg);
            });
            
            newPasswordSubmitButton.addEventListener("click", function(){
              newPasswordViaEmailReset(email);
            });
          } else {
            // tell them to verify first
          }
        }        
      }
    }
    //USER NOT SIGNED IN
    } else {
      
      //NULLIFY SHARED USER VARIABLES
      provider = null;
      verifiedUser = null;
      displayName = null;
      email = null;
      photoUrl = null;
      uid = null;
      
      if(loginCard && logoutCard && noticeCard){
        loginCard.style.display = "inline";
        logoutCard.style.display = "none";
        noticeCard.style.display = "none";         
      }
    }
    
    //ADJUST USER CHIP IN ANY CASE
    loadAccountChip();
  });
    
    
    
/*

FUNCTIONS

*/
       
    //ACCOUNT PAGE FUNCTIONS
                              

       function deleteAccount(providerData){                                            //Delete Authenticated Users
           var prdata = " ";
           prdata = providerData;
           if(prdata == 'google.com'){
               user = auth.currentUser;
               uid = user.uid;
               removeCurrentUserPro(uid);
               user.delete().then(function(value){
                  deleteAccountButton.disabled = true;
                   toast('Hope to see you again!');
               }).catch(function(error){
                  toast(error.message, 7000); 
               });
           } else if(prdata == 'facebook.com') {
                user = auth.currentUser;
                uid = user.uid;
                removeCurrentUserPro(uid);
                user.delete().then(function(value){
                        deleteAccountButton.disabled = true;
                        toast('Hope to see you again!');
                    }).catch(function(error){
                        toast(error.message, 7000); 
               });
           } else {
                user = auth.currentUser;
                uid = user.uid;
//                console.log(uid);
                removeCurrentUserReg(uid);
                user.delete().then(function(value){
                        deleteAccountButton.disabled = true;
                        toast('Hope to see you again!');
                    }).catch(function(error){
                        toast(error.message, 7000); 
               });
              
           }
       

      };
    
   function removeCurrentUserPro(uid) {
       var userIdPro = uid;
       db.ref('/USERS/Provider/').child(userIdPro).remove();
    };
    
    function removeCurrentUserReg(uid){
       var userIdReg = uid;
       db.ref('/USERS/Register/').child(userIdReg).remove();
    };
    

    
    function newEmail(newEmail){                                 //Sends new authenticatin mail to user for new mail request.
        user = auth.currentUser;
        user.updateEmail(newEmail).then(function(value){
           user.sendEmailVerification().then(function(value){
              /*showalert('#alert-snackbar', 'check ' + user.email + ' to validate change.', 10000);*/
               toast('check ' + user.email + ' to validate change.',7000);
               signout(); //Here 'signout' function is invoked
           }).catch(function(error){
               toast(error.message,7000);
              /*showalert('#alert-snackbar', error.message, 7000);*/
           }); 
        }).catch(function(error){
           /*showalert('#alert-snackbar', error.message, 7000);*/
            toast(error.message,7000);
        });
    }
          
    function newPassword(newPassword){
    //updatePassword(newPassword)
    auth.currentUser.updatePassword(newPassword).then(function(value) {
      /*showalert('#alert-snackbar','Password Updated',7000);*/
        toast('Password Updated',7000);
    }).catch(function(error) {
      /*showalert('#alert-snackbar', error.message, 7000);*/
        toast(error.message,7000);
    });    
  }

    function newPasswordViaEmailReset(email){                   //Password is reset using email validation
    auth.sendPasswordResetEmail(email).then(function(value) {
      /*showalert('#alert-snackbar','Check email to complete action',7000);*/
        toast('Check email to complete action',7000);
    }).catch(function(error) {
        toast(error.message,7000);
        /*showalert('#alert-snackbar', error.message, 7000);*/
    });    
  }


    //ACK PAGE / EMAIL ACTION HANDLER FUNCTIONS
        function handleResetPassword(auth, oobCode) {
        var accountEmail;
            
    // Verify the password reset code is valid.
        auth.verifyPasswordResetCode(oobCode).then(function(email) {
        var accountEmail = email;                                                    //email value is feed into accountEmail
        
        verifyPasswordDiv.style.display = "inline";
        verifyPasswordEmailInput.value = accountEmail;
        verifyPasswordEmailInput.parentNode.classList.add('is-dirty');
        var btn = doc.createElement("button");
        var txt = doc.createTextNode("submit");
        btn.appendChild(txt);
        btn.className = "btn btn-default";
        btn.disabled = true;
        btn.id = "verify-password-submit-button";
            
        ackActionsDiv.appendChild(btn);
            
        verifyPasswordSubmitButton = doc.getElementById("verify-password-submit-button");
            
        //enable email submit button
        /*verifyPasswordInputMdlTextfield.addEventListener("input", function(){*/
             verifyPasswordInput.addEventListener("input", function(){
           if(this != null){
               verifyPasswordSubmitButton.disabled = false;
           } 
        });
            
        
        //enable pressing enter
            
        /*verifyPasswordInputMdlTextfield.addEventListener("keyup", function(e){*/
             verifyPasswordInput.addEventListener("keyup", function(e){
           e.preventDefault();
            if (e.keyCode == 13) {
                verifyPasswordSubmitButton.click();
            }
        });
        
        verifyPasswordSubmitButton.addEventListener("click", function(){
           var newPassword = verifyPasswordInput.value;
            verifyPassword(oobCode, newPassword);                  //Here verifyPassword() is invoked.
        });
            
        }).catch(function(error){
          /*showalert('#alert-snackbar', error.message, 7000);*/
            toast(error.message,7000);
        });
  }

        function verifyPassword(oobCode,newPassword){
            auth.confirmPasswordReset(oobCode, newPassword).then(function(resp){
               auth.signInWithEmailAndPassword(email, newPassword);
                loadAccountChip();
                /*showalert('#alert-snackbar','Password Changed', 7000);*/
                toast('Password changed for the next time you login!',7000);
            }).catch(function(error){
               /*showalert('#alert-snackbar', error.message, 7000);*/
                toast(error.message,7000);
            });
        }

    
        function handleRecoverEmail(auth, oobCode){                       // Function for handle recover email
            var retoredEmail = null;
            
            //confirm the action code is valid.
            
            auth.checkActionCode(oobCode).then(function(info){
                //Get the restored email address.
                restoredEmail = info['data']['email'];
                //Revert to the old email.
                return auth.applyActionCode(oobCode);
            }).then(function(){
               /*showalert('#alert-snackbar','Account email change undone', 7000);*/
                toast('Account email change undone',7000);
               auth.sendPasswordResetEmail(restoredEmail).then(function(){
                  //Password reset conirmation sent. Ask user to check their email. 
               }).catch(function(error){
                  //Error encountered while sending password reset code.
                  /*showalert('#alert-snackbar', error.message, 7000);*/
                   toast(error.message,7000);
               });
            }).catch(function(error){
                //Invalid code
                /*showalert('#alert-snackbar', error.message, 7000);*/
                toast(error.message,7000);
            })
        }


         function handleVerifyEmail(auth, oobCode) {                      // Function for handle Verify Email
            // Try to apply the email verification code.
            auth.applyActionCode(oobCode).then(function(resp) {
            // js doesn't see email verified yet so we short circuit loadAccountChip.
            //loadAccountChip('good');
            toast('Email address has been verified',9000);
            /*showalert('#alert-snackbar','Email address has been verified');*/
        }).catch(function(error) {
        // Code is invalid or expired. Ask the user to verify their email address again.
        /*showalert('#alert-snackbar', error.message, 7000);*/
            toast(error.message);
    });
  }

function getArg(param) {
    var vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function(m, key, value) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}

//LOGIN PAGE FUNCTIONS

//FIRE OAUTH POPUPS
function fireAuth(){
    switch(this.id) {
        case 'facebook-button':
            provider = new firebase.auth.FacebookAuthProvider();
            break;
        case 'google-button':
            provider = new firebase.auth.GoogleAuthProvider();
            break;
    }
    authAction(); //Here authAction() function is invoked
}
    
       if(passwordInput){
  
//    PRESS ENTER FEATURE
       passwordInput.addEventListener("keyup", function(e){                                     //To be worked
//       e.preventDefault();
        if (e.keyCode == 13) {
            loginButton.click();
        }
     });

 
    }


    if(loginButton){
        loginButton.addEventListener('click',function(){
            var email = usernameInput.value;
            var password = passwordInput.value;
        
        if(!email){
            /*showalert('#alert-snackbar','Username Required', 7000);*/
            toast('Username Required');
            usernameInput.focus();
           /* usernameInput.parentNode.classList.add('is-dirty');*/
        } else if (!password){
            /*showalert('#alert-snackbar','Password Required', 7000);*/
            toast('Password Required');
            passwordInput.focus();
           /* passwordInput.parentNode.classList.add('is-dirty');*/
        } else{
            loginUsername(email,password);    //Here loginUsername() is invoked.
        }
    });
}
 
  


  //PRESS ENTER
  if(registrationInputPassword2MdlTextfield){
      registrationInputPassword2MdlTextfield.addEventListener("keyup", function(e){
          e.preventDefault();
          if (e.keyCode == 13) {
              submitButton.click();
          }
      });
      
  }

    if(registerButton){
        registerButton.addEventListener("click", function(){
        loginCard.style.display = "none";
        registerCard.style.display = "inline";
    });        
  }

    if(exitButton){
        exitButton.addEventListener("click", function(){
            signout();
        });
    }

    if(backButton){
        backButton.addEventListener("click", function(){
        loginCard.style.display = "inline";
        registerCard.style.display = "none";
      });
    }

    if(submitButton){
        submitButton.addEventListener("click", function(){
            var email = emailInput.value;
            var displayName = displayNameInput.value;
            var password = registrationInputPassword2.value;
            var phoneNumber = userPhoneInput.value;
            registerPasswordUser(email,displayName,password,phoneNumber);
        });
    }

    function loginUsername(email, password){
        auth.signInWithEmailAndPassword(email, password).then(function(value) {
          var user = auth.currentUser;
          uid = user.uid;
          if (uid == 'pmKvDiX6itaaWrYH9R9Ggf0FRlG2'){  
                redirect('admin'); 
                  
            
            }
            
    }).catch(function(error) {
     /*showalert('#alert-snackbar', error.message, 7000);*/
        toast(error.message, 7000);
    });              
  }      
          
    function promptDuplicateName (name){
        /*showalert('#alert-snackbar','Display Name Already Taken.  Please choose another.', 7000);*/
        toast('Display Name Already Taken.  Please choose another.',7000);
        displayNameInput.focus();
        displayNameInput.parentNode.classList.add('is-dirty');
  }

    if(registrationInputPassword2){
        registrationInputPassword2.oninput=function(){
        check(this);
    };        
  }

  function check(input) {
    if (input.value != registrationInputPassword.value) {
      input.setCustomValidity('Passwords Must Match');
      submitButton.disabled = true;
    } else {
      // VALID INPUT - RESET ERROR MESSAGE
      input.setCustomValidity('');
      submitButton.disabled = false;
    }
  }
          
    
    
    
    
    
    
    
 function authAction(){
    auth.signInWithPopup(provider).then(function(result) {
     
       
        var token = result.credential.accessToken;
        var user = auth.currentUser;
        uid = user.uid; 
        var providerDisplayName = user.displayName;
        var providerEmail = user.email;
        provider_data(uid, providerDisplayName, providerEmail);
        }).catch(function(error) {
        
          // Handle Errors here.
          /*showalert('#alert-snackbar', error.message, 7000);*/
        toast(error.message, 7000);
    });                    
  }
    
   function provider_data(uid, providername, provideremail ){
       
        var userId = uid;
        var pn = providername;
        var pe = provideremail;
    
      db.ref('/USERS/Provider/' + userId).set({
        UserDisplayName: pn,
        UserEmail: pe
    });
};
   
    
 function registerPasswordUser(email, displayName, password, phoneNumber, photoURL){
     
     var user = null;
     
     //NULLIFY EMPTY ARGUMENTS
     
     for(var i = 0; i < arguments.length; i++) {
         arguments[i] = arguments[i] ? arguments[i] :null;
     }
     auth.createUserWithEmailAndPassword(email, password).then(function(){
         user = auth.currentUser;
         uid = user.uid;
         user.sendEmailVerification();
         write_data(uid, email, displayName, phoneNumber);
        
     }).then(function(){
         user.updateProfile({
             displayName: displayName,
             photoURL: user.photoURL
         });
     }).catch(function(error){
         /*showalert('#alert-snackbar', error.message, 7000);*/
         toast(error.message,7000);
     });
     /*showalert('#alert-snackbar','Validation link was sent to ' + email + '.',7000);*/
     toast('Validation link was sent to ' + email + '.',9000);
     registerCard.style.display = "none";
     
 }

//Add user data to realtime database
function write_data(uid, emailId, username, contactnum){
  var userId = uid;
    
    //child elements for userId
    
    var em = emailId;
    var un = username;
    var cn = contactnum;
    
    db.ref('/USERS/Register/' + userId).set({
       emailId: em,
       DisplayName: un,
        Phone: cn    
    });
};
        
  //DETECTS DUPLICATE DISPLAY NAMES IN USERS BRANCH OF REALTIME DATABASE
  function displayNameExists (email, displayName, password){
    var users = db.ref('users');
    var duplicate = users.orderByChild('displayName').equalTo(displayName);
    duplicate.once('value').then(function(snap) {
      if(snap.val()){
        promptDuplicateName(displayName);
      } else {
        email = email;
        displayName = displayName;
        if(ls){
          localStorage.setItem('displayName', displayName);
        }else{
          // unavailable
        }                
        demoLogin.registerUsername(password);
      }
    }, function(error) {
      // The Promise was rejected.
     /*showalert('#alert-snackbar', error.message, 8000);*/
        toast(error.message,7000);
    });
  }

  /*
  
  SHARED FUNCTIONS FUNCTIONS
  
  */

//TOP RIGHT USER ELEMENT SWITCH
function loadAccountChip(msg){
    accountButton.innerHTML = '';
    
    //MSG SHORT CIRCUIT PROVIDES MEMBER ACCESS UPON EMAIL VERIFIED PAGE LOAD
    if(msg){
        if(displayName){
            signInButton.style.display = "none";
            accountButton.style.display = "inline-block";
        } else {
            signInButton.style.display = "block";
            accountButton.style.display = "inline-block";
        }
    } else {
        if(!uid || !displayName){
            signInButton.style.display = "block";
            accountButton.style.display = "none";
        } else {
            signInButton.style.display = "none";
            accountButton.style.display = "inline-block";
        }
    }
    if(msg) {
        
    }else{
        if(!verifiedUser && provider == "password"){
            signInButton.style.display = "none";
            return;
        }
    }
    
   accountButton.innerHTML = '<a class="dropdown-toggle" data-toggle="dropdown" style="color: aliceblue; background-color: transparent;">' + displayName + '</a><ul class="dropdown-menu animated slideInUp" style="background-color:#e8cc30;"><li><a id="account-settings-button" style="font-size:15px; border-bottom: 1px solid white; font-weight: 500;">Account settings</a></li><li><a id="sign-out-button" style="font-size:15px; font-weight: 500;">Logout</a></li></ul>';
    
    var signOutButton = doc.getElementById('sign-out-button');
    var accountSettingsButton = doc.getElementById('account-settings-button');
    
    signOutButton.addEventListener("click", function(){
        signout();
    });
    
    accountSettingsButton.addEventListener("click", function(){
        redirect("account");
    });
    
}

//SIGN OUT

function signout(){
    auth.signOut().then(function(){
        accountButton.style.display = "none";
        signInButton.style.display = "inline";
        /*showalert('#alert-snackbar','Signed Out', 10000);*/
        toast('Signed Out',7000);
        redirect('login');
    }, function(error){
        /*showalert('#alert-snackbar', error.message, 8000);*/
        toast('Sign out failed');
    
    });
}

    function redirect(path){
        var baseURL = window.location.protocol + '//' + window.location.host;
        var hasSlash = path.charAt(0) == '/';
    
        if(hasSlash) {
        path = baseURL;
        }
    
        if(!hasSlash){
        path = '/' + path;
        }
    
        var onThisPage = (window.location.href.indexOf(baseURL + path)  != -1);
        if (!onThisPage) {
        //redirect them to login page for message
       location = path;
    }
  }
    


      //TOAST
  function toast (msg,timeout){
    if(!timeout){timeout = 2750}
    var data = {
      message: msg,
      timeout: timeout
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  };
/*function showalert(elem, message, timeout){

    $(elem).show().html('<a href="#" class="close">&times;</a><span>'+message+'</span></div>');
    
    $(".close").click(function(){
        $(elem).alert('close');
     
    });
    if(timeout || timeout === 0 ){
        setTimeout(function(){
            $(elem).alert('close');
        }, timeout);
    }
} *///function showalert() ends
    
    
    
}, false); 


/*

REVEALED METHODS

*/

/*//REVEALED METHOD TO ADD NODES WITH DATA TO REALTIME DATABASE*/
/*demo.update('mynode','myKey','myValue')*/
/*var demo = (function()
    {
        var pub = {};
        pub.update = function (node,key,value)
        {
            var ref = firebase.database().ref().child('USERS');
            var obj = {};
            obj[key] = value;
            ref.child(node).update(obj).then(function()
            {
                console.log('Update Ran Successfully');
            });       
        }
        //API
        return pub;
    }());
*/



          

     /*$("#btnReset").click(function(){
         $('#formsignin').bootstrapValidator('resetForm', true);
     });

*/
     



      