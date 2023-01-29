const urlBase = 'http://cop4331group16.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;
	//let hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	
	let tmp = {
        login: login,
        password: password
    };

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		console.log(xhr.status);
		console.log(xhr.readyState);
		xhr.onreadystatechange = function() 
		{
			console.log("returned status of: "+this.status);
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				console.log("It worked.")
	
				window.location.href = "contactMenu.html";
			}
		};
		xhr.send(jsonPayload);
		console.log(xhr.status);
		console.log(xhr.readyState);
	}
	catch(err)
	{
		console.log("Error found!!!");
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function isLoginValid(loginName,loginPass)
{
	let loginNameErr = true;
	let loginPassErr = true;

	if(loginName = ""){
		console.log("Username is blank.")
	}
	else{

	}

}

//get info, package it, send to server
function doRegister()
{
    firstName = document.getElementById("registerNameFirst").value;
    lastName = document.getElementById("registerNameLast").value;
    let login = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    //let hash = md5( password );
    
    document.getElementById("signUpResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: password
    };

    let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);

    let url = urlBase + '/AddUser.' + extension;
    console.log(url);

    let xhr = new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function(){
            if(this.readyState != 4){
                return;
            }

            if(this.status == 409){
                document.getElementById("signUpResult").innerHTML = "User already exists. Try again.";
				console.log("here");
                return;
            }

            if(this.readyState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                userID = jsonObject.id;
                document.getElementById("signUpResult").innerHTML = "User Added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }

			console.log("It worked.");
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signUpResult").innerHTML = err.message;
    }
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let contactFirstName = document.getElementById("contactFirstName").value;
	let contactLastName = document.getElementById("contactLastName").value;
	let email = document.getElementById("contactEmail").value;
	let phoneNumber = document.getElementById("contactPhoneNumber").value;

	let tmp = {
		contactFirstName: contactFirstName,
		contactLastName: contactLastName,
		contactEmail: email,
		contactPhoneNumber: phoneNumber,
		userId: userId
	};
	

	let JSONPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddContact.' + extension;

	let xhr =  new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type","application/json; charset = UTF-8");
	try {
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				console.log("Contact Added.");
				document.getElementById("addContact").reset();
				loadContacts();
			}
		}
		xhr.send(JSONPayload);
	} catch (error) {
		console.log(err.message);
	}
}

function loadContacts()
{
	let tmp = {
		search: "",
		userId: userId
	};

	let JSONPayload = JSON.stringify(tmp);

	let url = urlBase + "/SearchContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST",url,true);
	xhr.setRequestHeader("Content-type","application/json; charset = UTF-8");

	xhr.onreadystatechange = function(){
		try {
			if(this.readyState == 4 && this.status == 200){
				let JSONObject = JSON.parse(xhr.responseText);
				if(JSONObject.error){
					console.log(JSONObject.error);
					return;
				}
				// let text = "starting HTML";
				// not sure how to display container elements 
				// document.getElementByID(id).innerHTML = text;
				// is function in contactMenu.js usable? ask at meeting
			}
			xhr.send(JSONPayload);
		} catch (error) {
			console.log(err.message);
		}
		
	}
}

//id tells which contact is being edited (in for loop)
function editContact(id)
{

    var firstNameI = document.getElementById("first_Name" + id);
    var lastNameI = document.getElementById("last_Name" + id);
    var email = document.getElementById("email" + id);
    var phone = document.getElementById("phone" + id);

    var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    firstNameI.innerHTML = "<input type='text' id='namef_text" + id + "' value='" + namef_data + "'>";
    lastNameI.innerHTML = "<input type='text' id='namel_text" + id + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' id='email_text" + id + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' id='phone_text" + id + "' value='" + phone_data + "'>"
}

//after you enter the edit, if save button is pressed then this function occurs
function saveContact(id)
{
	let namef_val = document.getElementById("namef_text" + no).value;
    let namel_val = document.getElementById("namel_text" + no).value;
    let email_val = document.getElementById("email_text" + no).value;
    let phone_val = document.getElementById("phone_text" + no).value;
    let id_val = userId;

    document.getElementById("first_Name" + no).innerHTML = namef_val;
    document.getElementById("last_Name" + no).innerHTML = namel_val;
    document.getElementById("email" + no).innerHTML = email_val;
    document.getElementById("phone" + no).innerHTML = phone_val;


    let tmp = {
        phoneNumber: phone_val,
        emailAddress: email_val,
        newFirstName: namef_val,
        newLastName: namel_val,
        id: id_val
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact(id)
{
	let namef_val = document.getElementById("first_Name" + no).innerText;
    let namel_val = document.getElementById("last_Name" + no).innerText;
    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);
    let check = confirm('Confirm deletion of contact: ' + nameOne + ' ' + nameTwo);
    if (check === true) {
        document.getElementById("row" + no + "").outerHTML = "";
        let tmp = {
            firstName: nameOne,
            lastName: nameTwo,
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };
}




	
