$(() => {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB0DJ8eHK2-Yx2iMTG1wmBvsi0T6fOgkQ0",
        authDomain: "student-do-downbutton-d7ab8.firebaseapp.com",
        databaseURL: "https://student-do-downbutton-d7ab8.firebaseio.com",
        projectId: "student-do-downbutton-d7ab8",
        storageBucket: "student-do-downbutton-d7ab8.appspot.com",
        messagingSenderId: "1085604261324"
      };
      firebase.initializeApp(config);

    let db = firebase.database();

    db.ref().on('child_added', (snap) => {
            display.key = snap.key;
            display.btn(snap.val().btn);
    });

    let API = {
        link: "https://api.giphy.com/v1/gifs/search?api_key=jW6Mt4aTmmLzEWQgODAcznZRFHYbKLKh",
        key: "jW6Mt4aTmmLzEWQgODAcznZRFHYbKLKh&q=anime&limit=25&offset=0&rating=R&lang=en",
        query: "&q=",
        limit: "&limit=",
        off: "&offset=",
        rate: "&rating=",
        lang: "&lang=en",
        qterm: "",
    }

    let display = {
        result: (r) => {
            $(".results").empty();
            let newR;
            console.log(r.data[0].images.fixed_height_small.url);
            console.log(r.data.length);
            for(i = 0; i < r.data.length; i++){
                newR = $("<div/>").addClass("giphy").css({
                    "position": "relative",
                    "display": "inline-block",
                    "justify-self": "center",
                    "margin": "10px"}).append(
                    "<div style= 'position: absolute; z-index: 1;' class = rating>" +
                    "<p style= 'background: rgba(0, 0, 0, .5); color: white;'>" +
                    "Rated: " +
                    r.data[i].rating +
                    "</p></div>" +
                    "<img src = '" + 
                    r.data[i].images.fixed_height_small_still.url +
                    "' data-still= '" +
                    r.data[i].images.fixed_height_small_still.url +
                    "' data-animate= '" +
                    r.data[i].images.fixed_height_small.url +
                    "' data-state= 'still' class= 'gif'>" 
                );
                $(".results").append(newR);
                console.log(newR);
            }
        },
        btn: (i) => {
            let newBtn = $("<div/>", {
                class: 'btn',
                value: i,
            }).append("<p>" + i + "</p>");
            let btnWrapper = $("<div/>").css('position', 'relative').append(newBtn);
            btnWrapper.append($("<span class = 'close' id = '" +
            display.key +
            "'" + 
            "style = '" +
            "width: 20px; " +
            "height: 20px; " +
            "position: absolute; " +
            "z-index: 1; " +
            "cursor: crosshair; " +
            "top: calc(50% - 10px); " +
            "right: 10px;'>x</span>"
            ));
            $(".nav").append(btnWrapper);
        },
        setbtn: (i) => {
            let pRef = db.ref().push({
                btn: i,
            });
            display.key = pRef.key;
        },
        counter: 0,
        key: "",
    }

    let search = {
        find: (input) => {
            API.qterm = input;
            $.ajax({
                url: API.link + API.query + API.qterm,
                method: "GET"
            }).then((r) => {
                console.log(r);
                display.result(r);
            });
        },
    }

//===========================================================================================================
    //CLICK FUNCTIONS

    $(".nav").on("click", ".btn", function(e){
        API.qterm = $(this).attr('value');
        $.ajax({
            url: API.link + API.query + API.qterm,
            method: "GET"
        }).then((r) => {
            console.log(r);
            display.result(r);
        });
        
    });
    $(".favBtn").on("click", (e) => {
        e.preventDefault();
        let x = $("#favInput").val().trim();
        if(x == ""){
            display.setbtn("FAIL");
        }
        else{
            display.setbtn(x);
        }
        $("#favInput").val('');
    });

    $(".searchBtn").on("click", (e) => {
        e.preventDefault();
        let x = $("#searchInput").val().trim();
        if(x == ""){
            search.find("FAIL");
        }
        else{
            search.find(x);
        }
        $("#searchInput").val('');
    });

    $("body").on("click", ".gif", function() {
        
        let s = $(this).attr("data-state");
        if(s === "still"){
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        }
        else{
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });
    $(".nav").on("click", ".close", function() {
        $(this).parent().remove();
        let tempkey = $(this).attr('id');
        db.ref().child(tempkey).remove();

    });

});