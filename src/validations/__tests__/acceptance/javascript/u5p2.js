$( document ).ready(function(){
$("#submit-name").click(function() {
    $("#greeting").append($("#name").val());
    });
  
$("#change-color").click(function() {
    $("body").css("background-color", "blue");
    });

$("#pic1").click(function(){
    $("#gallery-main").attr("src", "https://upload.wikimedia.org/wikipedia/commons/f/f9/Loxodonta_africana_-_old_bull_(Ngorongoro,_2009).jpg");
    });

$("#pic2").click(function(){
    $("#gallery-main").attr("src", "https://upload.wikimedia.org/wikipedia/commons/6/63/African_elephant_warning_raised_trunk.jpg");
    });
    
$("#pic3").click(function(){
    $("#gallery-main").attr("src", "https://iso.500px.com/wp-content/uploads/2014/08/2048-5.jpg");
    });
});