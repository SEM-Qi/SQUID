<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title>create JSON for controller data</title>
    </head>
    <body>
   
            <?php
                // Saving data from form in text file in JSON format
// variables from ajax to arduino
            
         // Arduino names to be used in JSON
        //    pitch = right_axis_vertical
        //    roll = right_axis_horizontal
        //    yaw =  left_axis_horizontal
        //    thrust = left_axis_vertical
        //    debugbutton = buttonA
     
            
           // get from controller from AJAX
  
        //    buttonA            
        //    start_button
        //    left_axis_horizontal
        //    left_axis_vertical
            
        //    right_axis_horizontal
        //    right_axis_vertical


// From: http://coursesweb.net/php-mysql/

        // check if all form data are submited, else output error message
        if(isset($_POST['buttonA'])) { 
                // && ($_POST['right_axis_vertical']) && isset($_POST['right_axis_horizontal']) && isset($_POST['left_axis_horizontal']) && isset($_POST['left_axis_vertical'])) {
        // if form fields are empty, outputs message, else, gets their data
          if(empty($_POST['buttonA'])) {
              //    &&($_POST['right_axis_vertical']) || empty($_POST['right_axis_horizontal']) || empty($_POST['left_axis_horizontal']) || empty($_POST['left_axis_vertical'])) 
              
            echo 'No PC controller input!';
          }
          else {
            // adds form data into an array
            $arr = array(
              'debugbutton' => $_POST['buttonA']
                    
             /* 'pitch'=> $_POST['right_axis_vertical'],
              'roll'=> $_POST['right_axis_horizontal'],
              'yaw'=> $_POST['left_axis_horizontal'],
              'thrust'=> $_POST['left_axis_vertical']
          */  );

            // encodes the array into a string in JSON format (JSON_PRETTY_PRINT - uses whitespace in json-string, for human readable)
            $jsondata = json_encode($arr, JSON_PRETTY_PRINT);

               // saves the json string in "formdata.txt" (in "dirdata" folder)
                // outputs error message if data cannot be saved
                if(file_put_contents('gamepaddata.json', $jsondata)) echo 'Data successfully saved';
                else echo 'Unable to save data in "gamepaddata.json"';
              }
            }
            else echo 'Could not store data to "gamepaddata.json"';
        
  //
  //        
      //      $arr = array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5);

      //      echo json_encode($arr);
        
        
        // put your code here
        ?>
    </body>
</html>
