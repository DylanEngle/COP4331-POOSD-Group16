const urlBase = 'http://cop4331group16.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let contactId = 0;
let rowId = 0;
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
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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
		Name: contactName,
		Email: email,
		Phone: phoneNumber,
		UserID: userId
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
				loadContacts();
				document.getElementById("name").value = "";
				document.getElementById("number").value = "";
				document.getElementById("email").value = "";
				window.location.href = "contactMenu.html";
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
		UserID: userId
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/SearchContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST",url,true);
	xhr.setRequestHeader("Content-type","application/json; charset = UTF-8");

	try {
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.error){
						console.log(jsonObject.error);
						return;
				}
				let text="<table>";
				for(let i = 0; i<jsonObject.results.length;i++){
					ids[i] = jsonObject.results[i].ID;
					text += "<tr id='row" + i + "'>";
					text += "<td class='card'>";
					text += "<div class='header' id='header" + i + "'><span>" + jsonObject.results[i].Name + "</span></div>";
					text += "<div class='body'>";
					text += "<div class='contactNumber' id='contactNumber" + i + "'><span>" + jsonObject.results[i].Phone + "</span></div>";
					text += "<div class='contactEmail' id='contactEmail" + i + "'><span>" + jsonObject.results[i].Email + "</span></div>";
					text += "</div>";
					text += "<button class='edit-contact-button' id='edit-contact-button" + i + "' onclick='toggleEditContact(" + i + ")'>";
					text += "<img src='images/settingsGear.png' alt='edit user' class='edit-contact-img' id='edit-contact-img'>";
					text += "</button>";
					text += "</td>";       
					text += "</tr>";
				}
				text += "</table>";
				document.getElementById("tbody").innerHTML = text;
			}
		};
		xhr.send(jsonPayload);
	} catch (error) {
		console.log(err.message);
	}
		
}

// Search function that allows search of contact name, number, and email
function searchContacts() {
    const searchedText = document.getElementById("searchedText");
    const filter = searchedText.value.toUpperCase();
    const table = document.getElementById("contacts-table");
    const tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const contactName = tr[i].getElementsByTagName("div")[0]; // Name of curr contact
        const contactNumber = tr[i].getElementsByTagName("div")[1].getElementsByTagName("div")[0]; // Number of curr contact
        const contactEmail = tr[i].getElementsByTagName("div")[1].getElementsByTagName("div")[1]; // Email of curr contact

        if (contactName) {
            const txtValueName = contactName.textContent || contactName.innerText;
            const txtValueNumber = contactNumber.textContent || contactNumber.innerText;
            const txtValueEmail = contactEmail.textContent || contactEmail.innerText;

            if(txtValueName.toUpperCase().indexOf(filter) > -1 ||
                txtValueNumber.toUpperCase().indexOf(filter) > -1 ||
                txtValueEmail.toUpperCase().indexOf(filter) > -1) {

                tr[i].style.display = "";
            }

            else {
                tr[i].style.display = "none";
            }
        }
    }
}

//after you enter the edit, if save button is pressed then this function occurs
function editContact()
{
	let no = rowId;
	console.log(userId);
	console.log(no);
	let name_val = document.getElementById("editName").value;
    let phone_val = document.getElementById("editNumber").value;
    let email_val = document.getElementById("editEmail").value;
    let id_val = ids[no];
	console.log(name_val);
	console.log(phone_val);
	console.log(email_val);
	console.log(id_val);

    document.getElementById("header" + no).innerHTML = name_val;
    document.getElementById("contactEmail" + no).innerHTML = email_val;
   	document.getElementById("contactNumber" + no).innerHTML = phone_val;


    let tmp = {
        Phone: phone_val,
        Email: email_val,
        Name: name_val,
        UserID: userId,
		ID: id_val
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/EditContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
				toggleEditContact(0);
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact()
{
	let no = rowId;
	let name_val = document.getElementById("header" + no).innerText;
    nameOne = name_val.substring(0, name_val.length);
    let check = confirm('Confirm deletion of contact: ' + nameOne);
    if (check === true) {
        document.getElementById("row" + no + "").outerHTML = "";
        let tmp = {
            ID: contactId
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
					toggleEditContact(0);
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };
	
}

function toggleEditContact (id){
	document.getElementById("edit-contact").scrollIntoView({behavior: 'smooth'});
	contactId = ids[id];
	rowId = id;
	const edit_contact_container = document.querySelector('.edit-contact-container');

	edit_contact_container.classList.toggle('is-active');
	//console.log("!!"+edit_contact_container.edit-contact.name);
	//edit_contact_container.edit-contact.name.innerHTML =
	 //document.getElementById("header" + id).innerHTML;
   // email_val = document.getElementById("email_text" + no).value;
    //phone_val = document.getElementById("phone_text" + no).value;
}




	
