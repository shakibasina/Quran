function getRandomVerseNumber(except) {
    var noVerses = 6236;
    var verseNumber;
    do{
        verseNumber = Math.floor(Math.random() * noVerses) + 1
    }while(except.includes(verseNumber))
                
    return verseNumber;
}

function changeContent(div, newContent) {
    div.html(newContent);
}

function newVerse() {
    if($("#getVerse").hasClass("requesting")) {
        return;
    }
    $("#getVerse").addClass("requesting");

    

    var ayehs;
    (async () => {
        ayehs = await fetch_ayehs();

        verseNumber = getRandomVerseNumber(ayehs);
        
        var url = "http://api.alquran.cloud/v1/ayah/"
        url += verseNumber + "/editions/ar.sahih,fa.ayati";        
        console.log(url);
        
        $.getJSON(url, function(json) {
            var verse = json.data[0];
            var translation = json.data[1];
            var content = verse.text;
            var surah = verse.surah.number;
            var suranName = verse.surah.name;
            console.log(suranName);
            
            var number = verse.numberInSurah;
    
            var link = "https://quran.com/" + surah + "/" + number;
            document.getElementById("ayat").setAttribute("href", link)
            changeContent($("#verse"), content);
            changeContent($("#translate"), translation.text);
            changeContent($("#surah"), suranName);
            changeContent($("#ayeh"), verse.numberInSurah);
    
            $("#getVerse").removeClass("requesting");
    
            update_khatm(verseNumber);

            (async () => {
                khatms = await fetch_khatms();
                
                changeContent($("#khatm"), khatms);
            })();
    
        });
    })();
}

(function($) {
    "use strict";

    $(document).ready(function() {
        newVerse();
    })
    $("#getVerse").on("click", function() {
        newVerse();
    });
})(jQuery);

function get_ayehs(){
    return new Promise(function(resolve, reject){
        $.ajax({
            url: "get_ayehs.php",
            method: "post",
            dataType: "json",
            success: function(response){
                resolve(response);
            }
        });
    })
}
async function fetch_ayehs(){
    let ayehs = await get_ayehs();
    console.log("ayehs: "+ayehs);
    return ayehs
}

function get_khatms(){
    return new Promise(function(resolve, reject){
        $.ajax({
            url: "get_khatms.php",
            method: "post",
            dataType: "json",
            success: function(response){
                resolve(response)
            }
        });
    });
}
async function fetch_khatms(){
    let khatms = await get_khatms();
    console.log("khatms: "+khatms);
    return khatms
}

function update_khatm(ayeh){
    $.ajax({
        url: "update_ayeh.php",
        method: "post",
        dataType: "json",
        data: {ayeh: ayeh},
        success: function(response){
            alert(response["message"]);
        }
    })
}

$("#getVerse").click(function(){
    newVerse();
})