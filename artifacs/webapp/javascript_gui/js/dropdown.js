/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    $(".menu-panel").on("click",".icon",function(){
        var $this = $(this),
            id = $this.attr('id');
        $(".dropdown-element").addClass("invisible");
        $(".dropdown-menu").addClass("invisible");
        if($this.hasClass("selected")){
            $this.removeClass("selected");
        }else{
            $(".dropdown-menu").removeClass("invisible");
            $(".icon").removeClass("selected");
            $this.addClass("selected");
            switch(id){
                case "settings":
                    $(".setting-option").removeClass("invisible");
                    break;
                case "battery":
                    $(".battery-option").removeClass("invisible");
                    break;
                case "connection":
                    $(".connection-option").removeClass("invisible");
                    break;
                case "sound":
                    $(".sound-option").removeClass("invisible");
                    break;
                case "icon-controller":
                    $(".controller-option").removeClass("invisible");
                    break;
                default:
                    $(".dropdown-element").removeClass("invisible");
            }
        }
    });
});  

