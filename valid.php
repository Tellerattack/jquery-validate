<?php 
sleep(2);
$a["info"]="该邮件已被占用！";
$a["status"] = 1;
	echo json_encode($a);
?>