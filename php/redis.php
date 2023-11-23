<?php

require '.././redis/vendor/autoload.php'; 

// Connect to Redis server
$redis = new Predis\Client('tcp://127.0.0.1:6379'); 

return $redis;

?>
