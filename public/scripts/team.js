"use strict"
$(document).ready(function() {


    let urlParams = new URLSearchParams(location.search);
    let teamId = urlParams.get("id");

    fillLeague($("#league"));
    fillAge($("#maxage"));
    fillAge($("#minage"));
    fillAge($("#maxnum"));

    if (teamId != "") {
        getTeam(teamId);
    }



    $("#save").click(function() {
        // if (!validator.validate("#frmTeam")) {
        //     return;
        // }
        let postData = $("#frmTeam").serialize();
        let url = "/api/teams",
            type = ($(this).html() == "Edit Team" ? "PUT" : "POST");

        $.ajax({
                url: url,
                type: type,
                data: postData
            })
            .done(function() {
                displayMessage("Team has been added/edited.");
                $("#save").html("Edit Team");
            })
            .fail(function() {
                console.log('Opps.. something went wrong in while creating the course.');
            });
    });



    /**
     * This function makes a call to restful services and gets the team information and 
     * display in the tbody element.
     * @param {string} teamId  -- team Id
     */
    function getTeam(teamId) {
        let url = "/api/teams/" + teamId;

        $.getJSON(url, function(team) {
                populateTeam(team);
            })
            .fail(function() {
                //$("#teamid").popover("hide");
            })
            .done(function() {
                //$("#save").html("Edit Course");
            });
    };

    function populateTeam(team) {
        console.log(team);
        if (team != undefined) {
            $("#teamid").val(teamId);
            $("#teamname").val(team["TeamName"]);
            $("#league option:contains(" + team["League"] + ")").attr('selected', 'selected');
            $("#managername").val(team["ManagerName"]);
            $("#managerphone").val(team["ManagerPhone"]);
            $("#manageremail").val(team["ManagerEmail"]);
            $("#minage option:contains(" + team["MinMemberAge"] + ")").attr('selected', 'selected');
            $("#maxage option:contains(" + team["MaxMemberAge"] + ")").attr('selected', 'selected');
            $("#maxnum option:contains(" + team["MaxTeamMembers"] + ")").attr('selected', 'selected');

            $("#save, h2").html("Edit Team");
        }

    }

    /**
     * display the success message, 
     * disable the register button 
     * and change the text from Cancel to OK
     */
    function displayMessage(message) {
        $("#msg").toggle();
        $("#msg").html(message);
    }

    /**
     * This is to fill the dropDown with the data in array of elements.
     * @param {*} dropdown  -- dropdown name 
     * @param {*} obj       -- javascript object
     */
    function fillLeague(dropdown) {
        let url = "/api/leagues";
        $.getJSON(url, function(leagues) {
            leagues.forEach(function(e) {
                let option = new $("<option>", { value: e.Code, text: e.Name })
                dropdown.append(option);
            });
        });
    };

    function fillAge(dropdown) {
        for (let i = 1; i < 101; i++) {
            let option = $("<option>", { value: i, text: i });
            dropdown.append(option);
        }
    };

});