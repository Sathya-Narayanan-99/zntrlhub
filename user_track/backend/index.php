<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirect</title>
    <script src="../node_modules/device-uuid/lib/device-uuid.js" type="text/javascript"></script>
</head>
<body>

    <form action="index.php" method="post">
        <label>Enter your number:</label>
        <input type="tel" name="phone" id="">
        <br>
        <input type="submit" name="encrypt" value="submit">
    </form>
    <?php
    function Encryption($original_value)
    {
        // Storingthe cipher method
        $ciphering = "AES-128-CTR";
    
        // Non-NULL Initialization Vector for encryption
        $encryption_iv = '1234567891011121';
    
        // Storing the encryption key
        $encryption_key = "W3docs";
    
        // Using OpenSSl Encryption method
        $iv_length = openssl_cipher_iv_length($ciphering);
        $options = 0;
    
        // Storing a string into the variable which
        // needs to be Encrypted
        $simple_string = "$original_value";
    
        // Displaying the original string
        //echo "Original String: " . $simple_string;
    
        // Using openssl_encrypt() function to encrypt the data
        $encryption = openssl_encrypt($simple_string, $ciphering, $encryption_key, $options, $encryption_iv);
        return $encryption;
    
    }
    if(isset($_POST['encrypt'])){
        $phone = "phone=".$_POST['phone'];
        echo "Encrypted value: <input type='readOnly' value='".Encryption($phone)."'>";
    }

    if(isset($_GET['data'])){
        $data = $_GET['data'];
    }

    function decryption($encrypted_value)
    {

        // Storingthe cipher method
        $ciphering = "AES-128-CTR";

        // Using OpenSSl Encryption method
        $iv_length = openssl_cipher_iv_length($ciphering);
        $options = 0;
        // Non-NULL Initialization Vector for decryption
        $decryption_iv = '1234567891011121';

        // Storing the decryption key
        $decryption_key = "W3docs";

        // Using openssl_decrypt() function to decrypt the data
        $decryption = openssl_decrypt($encrypted_value, $ciphering, $decryption_key, $options, $decryption_iv);

        // Displaying the decrypted string
        return $decryption;

    }

//echo "Encrypted : ".Encryption('phone=917418315875')."<br>";
//echo "Decrypted : " . decryption(Encryption('phone=917418315875')) . "<br>";

?>
</body>
<script>
    const uuid = new DeviceUUID().get();
    const d = new Date(),
        dformat = [d.getFullYear(),
				   d.getMonth()+1,
                   d.getDate()].join('-')+' '+
                  [d.getHours(),
                   d.getMinutes(),
                   d.getSeconds()].join(':');
                   
    window.addEventListener("beforeunload", () => {
        url_data = `uuid=${uuid}&dateTime=${dformat}&<?php echo decryption($data) ?>`;
        navigator.sendBeacon("https://dashboard.foton.ai/analytics/backend/file.php?" + url_data)
    });

    <?php if(isset($_GET['data'])){ ?>
     setTimeout(() => {
        window.location = "https://staging.onecheq.co.nz/";
     }, 2000);
     <?php } ?>
</script>
</html>