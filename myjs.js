/**
 * Created by hementsharma on 04/12/16.
 */
window.onload = function() {
    //login and Register logic
    var currentObject, currentEmail;
    // Register button auto reaction
    document.querySelectorAll(".register-button")[0].addEventListener("click", function() {
        //update the page for register options
        document.querySelectorAll(".login-box-option")[0].innerHTML = "Register";
        document.querySelectorAll(".submit-button")[0].classList.add('hidden');
        document.querySelectorAll(".new-user-button")[0].classList.remove('hidden');
        cleanup();
    });

    //assign registration auto reaction method to submit button which will register new user
    document.querySelectorAll(".new-user-button")[0].addEventListener("click", function() {
        var email = document.querySelectorAll(".username")[0].value;
        var re = /\S+@\S+\.\S+/;
        if (!re.test(email)) {
            //print error message as email entered is incorrect
            document.querySelectorAll(".login-message")[0].innerHTML = "User name is not supported !!!";
            return false;
        }
        var pwd = document.querySelectorAll(".password")[0].value;
        if (!pwd) {
            //print error message for empty password
            document.querySelectorAll(".login-message")[0].innerHTML = "Please enter a valid password !!";
            return false;
        }
        currentObject = chirpMethods.logonRegister(email, pwd);
        currentEmail = email;
        if (currentObject) {
            console.log(email);
            document.querySelectorAll(".logon-box")[0].classList.add('hidden');
            document.querySelectorAll(".messaging-app")[0].classList.remove('hidden');
            var userdata = currentObject.getMessages();
            console.log(userdata);
            if (userdata[0].length > 0) {
                printdetails(currentEmail, userdata[0], userdata[1]);
            }
            document.querySelectorAll(".logout-button")[0].classList.remove('hidden');
            document.querySelectorAll(".login-logout")[0].classList.add('hidden');
            document.querySelectorAll(".user-details")[0].innerHTML = email + " says";
            document.querySelectorAll(".logout-message")[0].innerHTML = "loged in as " + email;
        } else {
            //print error message
            document.querySelectorAll(".login-message")[0].innerHTML = "User already exist !!!!";
        }
    });

    //assign auto reaction to chirp button
    document.querySelectorAll(".chirp-button")[0].addEventListener("click", function() {
        if (document.querySelectorAll(".message-box")[0].value) {
            console.log(currentEmail + document.querySelectorAll(".message-box")[0].value);
            currentObject.updateMessage(currentEmail, document.querySelectorAll(".message-box")[0].value);
            printdetails(currentEmail, [document.querySelectorAll(".message-box")[0].value], [new Date().toLocaleString()]);
            cleanup();
        } else {
            alert("please enter data to save");
        }
    });

    //Logon button AutoReaction
    document.querySelectorAll(".login-button")[0].addEventListener("click", function() {
        document.querySelectorAll(".login-box-option")[0].innerHTML = "Log In";
        document.querySelectorAll(".submit-button")[0].classList.remove('hidden');
        document.querySelectorAll(".new-user-button")[0].classList.add('hidden');
        cleanup();
    });

    //assign Login auto reaction method to submit button
    document.querySelectorAll(".submit-button")[0].addEventListener("click", function() {
        var email = document.querySelectorAll(".username")[0].value;
        var pwd = document.querySelectorAll(".password")[0].value;
        currentObject = chirpMethods.loginVerify(email, pwd);
        console.log(currentObject);
        if (currentObject) {
            currentEmail = email;
            document.querySelectorAll(".logon-box")[0].classList.add('hidden');
            document.querySelectorAll(".messaging-app")[0].classList.remove('hidden');
            console.log(currentObject.getMessages);
            var userdata = currentObject.getMessages();
            console.log(userdata);
            if (userdata[0].length > 0) {
                printdetails(currentEmail, userdata[0], userdata[1]);
            }
            document.querySelectorAll(".logout-button")[0].classList.remove('hidden');
            document.querySelectorAll(".login-logout")[0].classList.add('hidden');
            document.querySelectorAll(".user-details")[0].innerHTML = email + " says";
            document.querySelectorAll(".logout-message")[0].innerHTML = "loged in as " + email;
        } else {
            document.querySelectorAll(".login-message")[0].innerHTML = "Please enter the correct userID/password";
        }
    });


    //below function will assign autoreaction method to logout
    document.querySelectorAll(".logout-button")[0].addEventListener("click", function() {
        var Messages = document.querySelectorAll(".post-messages")[0];
        Messages.innerHTML = "";
        document.querySelectorAll(".logon-box")[0].classList.remove('hidden');;
        document.querySelectorAll(".messaging-app")[0].classList.add('hidden');
        document.querySelectorAll(".logout-button")[0].classList.add('hidden');
        document.querySelectorAll(".login-logout")[0].classList.remove('hidden');
        document.querySelectorAll(".login-box-option")[0].innerHTML = "Log In";
        document.querySelectorAll(".submit-button")[0].classList.remove('hidden');
        document.querySelectorAll(".new-user-button")[0].classList.add('hidden');
        cleanup();
    });

    //cleanup function will clear all fields	
    function cleanup() {
        document.querySelectorAll(".username")[0].value = "";
        document.querySelectorAll(".password")[0].value = "";
        document.querySelectorAll(".message-box")[0].value = "";
        document.querySelectorAll(".login-message")[0].innerHTML = "";
        document.querySelectorAll(".logout-message")[0].innerHTML = "";
    }

    function printdetails(email, msg, date) {
        var messageNode = document.querySelectorAll(".post-messages")[0];
        console.log(msg);
        for (i = 0; i < msg.length; i++) {
            var divNode = document.createElement("div");
            var node = document.createElement("p");
            var nodetext = document.createTextNode(msg[i]);
            var mailnode = document.createElement("span");
            mailnode.appendChild(document.createTextNode("Posted by " + email));
            var dateNode = document.createElement("span");
            dateNode.appendChild(document.createTextNode(date[i]));
            node.appendChild(nodetext);
            divNode.appendChild(node);
            divNode.appendChild(mailnode);
            divNode.appendChild(dateNode);
            divNode.classList.add('new-messages');
            if (messageNode.firstChild) messageNode.insertBefore(divNode, messageNode.firstChild);
            else messageNode.appendChild(divNode);
        }
    }
    var chirpMethods = (function() {
        var dataObject = {};
        if (localStorage.getItem('dataObjectlocal')) {
            var dataObjecttemp = JSON.parse(localStorage.getItem('dataObjectlocal'));
            console.log(dataObjecttemp);
            console.log(dataObject);
            for (i in dataObjecttemp) {
                console.log(i);
                var local = dataObjecttemp[i];
                dataObject[i] = new emailObject(i, local.pwd);
                dataObject[i].msg = local.msg;
                dataObject[i].date = local.date;
                console.log(dataObject[i]);
            }
        } else var dataObject = {};
        //dataObject will contain all the data , it will have 'email' as keys to inner objects that will contain "email" "passwords" and "message information"
        /* dataObject = {
         email:{
         mail: user email,
         pwd: password,
         msg: [] message array
         date: [] date array entry for each message
         }
         }
         */


        function emailObject(email, pwd) {
            this.pwd = pwd;
            this.msg = [];
            this.date = [];

        };
        emailObject.prototype.updateMessage = function(email, msg) {
            var length = this.msg.length;
            this.msg[length] = msg;
            this.date[length] = new Date().toLocaleString();
            dataObject[email] = this;
            localStorage.setItem('dataObjectlocal', JSON.stringify(dataObject));
        };
        emailObject.prototype.getMessages = function() {
            return [this.msg, this.date];
        };


        return {
            loginVerify: function(email, pwd) {
                if (dataObject[email]) {
                    if (dataObject[email].pwd === pwd) {
                        return dataObject[email];
                    }
                } else {
                    return false;
                }
            },

            //Below function will be used for registering new user
            logonRegister: function(email, pwd) {
                if (email in dataObject) {
                    return false;
                } else {
                    var userObject = new emailObject(email, pwd);
                    dataObject[email] = userObject;
                    localStorage.setItem('dataObjectlocal', JSON.stringify(dataObject));
                    console.log(dataObject);
                    return userObject;
                }
            }
        }

    })();
}