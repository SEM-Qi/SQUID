/* 
 * Ground Control - Dropdown
 * Copyright (c) 2014 Group - Qi
 * 
 * Please read the Copyright file for further details.
 * 
 * dropdown.js .. TO-DO explanation
 * 
 */

$(document).ready(function(){
   
    $("#menu-panel").on("click",".icon",function(){
        
        var $this = $(this), id = $this.attr('id');
        $(".dropdown-element").addClass("invisible");
        $("#dropdown-menu").addClass("invisible");
        
        if($this.hasClass("selected")){
            $this.removeClass("selected");
        }else{
            $("#dropdown-menu").removeClass("invisible");
            $(".icon").removeClass("selected");
            $this.addClass("selected");
            
            switch(id){
                
                case "settings-icon":
                    $(".setting-option").removeClass("invisible");
                    break;
                    
                case "battery-icon":
                    $(".battery-option").removeClass("invisible");
                    break;
                    
                case "connection-icon":
                    $(".connection-option").removeClass("invisible");
                    break;
                    
                case "sound-icon":
                    $(".sound-option").removeClass("invisible");
                    break;
                    
                case "gamepad-icon":
                    $(".controller-option").removeClass("invisible");
                    break;
                    
                default:
                    $(".dropdown-element").removeClass("invisible");
            }
        }
    });
    
    $("#dropdown-menu").on("click", "div", function(){
        console.log(this.innerHTML);
    });
    
    $("#menu-panel").on("blur", ".icon", function(){
        $(this).removeClass("selected");
        $("#dropdown-menu").addClass("invisible");
//        setTimeout(function(){
//            
//        },50);     
    });
});  

