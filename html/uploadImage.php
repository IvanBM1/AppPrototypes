<?php

	$file = $_FILES['file'];
	$guid = $_POST['guid'];

	move_uploaded_file($file['tmp_name'], "./uploads/".$guid.".png");
	echo json_encode("ok", "1");