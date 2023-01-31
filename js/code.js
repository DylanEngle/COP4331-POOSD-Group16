const urlBase = 'http://cop4331group16.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = [];

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
		xhr.onreadystatechange = function() 
		{
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
	
				window.location.href = "contactMenu.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
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

    let url = urlBase + '/AddUser.' + extension;

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
	let contactName = document.getElementById("name").value;
	let email = document.getElementById("email").value;
	let phoneNumber = document.getElementById("number").value;

	let tmp = {
		contactName: contactName,
		contactEmail: email,
		contactPhoneNumber: phoneNumber,
		userId: userId
	};
	

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddContact.' + extension;

	let xhr =  new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type","application/json; charset = UTF-8");
	try {
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				console.log("Contact Added.");
				document.getElementById("add-contact-container").reset();
				loadContacts();
			}
		}
		xhr.send(jsonPayload);
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

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/SearchContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST",url,true);
	xhr.setRequestHeader("Content-type","application/json; charset = UTF-8");

	xhr.onreadystatechange = function(){
		try {
			if(this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.error){
					console.log(jsonObject.error);
					return;
				}
				// let text = "starting HTML";
				// not sure how to display container elements 
				// document.getElementByID(id).innerHTML = text;
				// is function in contactMenu.js usable? ask at meeting
			}
			xhr.send(jsonPayload);
		} catch (error) {
			console.log(err.message);
		}
		
	}
}

//id tells which contact is being edited (in for loop)
function editContact(id)
{

    let nameI = document.getElementById("name" + id);
    let email = document.getElementById("email" + id);
    let phone = document.getElementById("number" + id);

    let namef_data = firstNameI.innerText;
    let namel_data = lastNameI.innerText;
    let email_data = email.innerText;
    let phone_data = phone.innerText;

    nameI.innerHTML = "<input type='text' id='namef_text" + id + "' value='" + namef_data + "'>";
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

function toggleEditContact (){
	const edit_contact_container = document.querySelector('.edit-contact-container');

	edit_contact_container.classList.toggle('is-active');
}




	
