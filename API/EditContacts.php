<?php
	$inData = getRequestInfo();
	
	$UserID = $inData["UserID"];
	$ContactID = $inData["ID"];
	$Name = $inData["Name"];
	$Phone = $inData["Phone"];
	$Email = $inData["Email"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		if ((strcmp($Name, "")) == 0)
		{
			$query = $conn->prepare("SELECT Name FROM Contacts WHERE ID = ?");
			$query->bind_param("s", $ContactID);
			$query->execute();
			$result = $query->get_result();
			$temp= $result -> fetch_assoc();
			$Name = $temp['Name'];
			returnWithError("Unchanged Name: $Name");
		}
		if ((strcmp($Phone, "")) == 0)
		{
			$query = $conn->prepare("SELECT Phone FROM Contacts WHERE ID = ?");
			$query->bind_param("s", $ContactID);
			$query->execute();
			$result = $query->get_result();
			$temp= $result -> fetch_assoc();
			$Phone = $temp['Phone'];
			returnWithError("Unchanged phone: $Phone");
		}
		if ((strcmp($Email, "")) == 0)
		{
			$query = $conn->prepare("SELECT Email FROM Contacts WHERE ID = ?");
			$query->bind_param("s", $ContactID);
			$query->execute();
			$result = $query->get_result();
			$temp= $result -> fetch_assoc();
			$Email = $temp['Email'];
			returnWithError("Unchanged Email: $Email");
		}
		
		$stmt = $conn->prepare("UPDATE Contacts SET Name = ?, Phone = ?, Email = ? WHERE 					UserID = ? AND ID = ?");
		$stmt->bind_param("sssss", $Name, $Phone, $Email, $UserID, $ContactID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>