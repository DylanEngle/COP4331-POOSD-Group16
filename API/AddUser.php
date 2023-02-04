<?php
	$inData = getRequestInfo();
	
	$login = $inData["login"];
	$password = $inData["password"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT * FROM Users WHERE Login=?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();
		$rows = mysqli_num_rows($result);
		if($rows == 0){
			$stmt = $conn->prepare("INSERT into Users (login,password,firstName,lastName) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $login, $password, $firstName, $lastName);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithError("");
		}
		else{
			http_response_code(409);
			returnWithError("Username taken");
		}
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