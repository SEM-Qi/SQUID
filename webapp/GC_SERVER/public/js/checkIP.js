
$(document).ready(function() {
    updateIP();
});

function updateIP() {
    $.getJSON("ipaddress/ipaddress.json", function(data) {
        if (data.ip === "") {
            document.getElementById("link").href = "#";
            $("#link").removeClass("active");
            $("#link-text").text("this drone is not accessible");
        } else {
            document.getElementById("link").href = "http://" + data.ip;
            $("#link").addClass("active");
            $("#link-text").text("this drone is ready to fly");
        }
        console.log(data.ip);
    });
    setTimeout(updateIP, 120000);
}
