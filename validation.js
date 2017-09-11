function validate()
{
	var fname=document.getElementById("fname");
	var lname=document.getElementById("lname");
	var contact=document.getElementById("contact");
	var password=document.getElementById("password");
    if(fname.value==null || fname.value=="")
	{
		fname.focus();
		alert("Enter valid first name");
		return false;
	}
	if(fname.value.match(alphaExp)){}
	else{
		alert("First name can have only letters");
		fname.focus();
		return false;
	}
	if(lname.value==null || lname.value=="")
	{
		lname.focus();
		alert("Enter valid last name");
		return false;
	}
	if(lname.value.match(alphaExp)){}
	else{
		alert("Last name can have only letters");
		lname.focus();
		return false;
	}
	if(contact.value==null || contact.value==" ")
	{
		alert("Please Enter Mobile Number");
		contact.focus();
		return false;
	}
	if (isNaN(contact.value))
	{
		alert(" Your Mobile Number must be Integers");
		contact.focus();
		return false;
	}
	if((contact.value.length!= 10))
	{
		alert("Enter the valid Mobile Number(Like : 9999999999)");
		contact.focus();
		return false;
	}
 	if(password.value.length< 8)
	{
		alert("Please enter a password of atleast 8 characters");
		password.focus();
		return false;
	}
	return true;
}