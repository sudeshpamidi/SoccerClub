"use strict"
$(document).ready(function() {

    let urlParams = new URLSearchParams(location.search);
    let teamId = urlParams.get("id");

    fillLeague($("#league"));
    fillAge($("#minage"));
    fillAge($("#maxage"));
    fillAge($("#maxnum"));
    $("#teamidrow").hide();

    if (teamId != "" && teamId != null) {
        getTeam(teamId);
    }

    $("#save").click(function() {
        if (!validator.validate("#frmTeam") || !validateAge()) {
            return;
        }
        let postData = $("#frmTeam").serialize();
        let url = "/api/teams",
            type = ($(this).html() == "Edit Team" ? "PUT" : "POST");

        let jqXHR = $.ajax({
                url: url,
                type: type,
                data: postData
            })
            .done(function() {
                displayMessage("Team has been added/edited."); // need to do
                $('#teamModal').modal('show');
                $(".card-header h2").html("Edit Team");
                $("#save").html("Edit Team");

            })
            .fail(function(jqXHR1, status) {
                $("#iconCards .card-body").attr('data-content', jqXHR.responseText);
                $("#iconCards .card-body").popover({
                    trigger: 'click',
                    placement: 'bottom',
                    content: jqXHR.responseText
                });
                $("#iconCards .card-body").popover('enable');
                $("#iconCards .card-body").popover('show');
            });
    });

    $("#reset").on('click', function(e) {
        if ($(".card-header h2").html() == "Edit Team") {
            e.preventDefault();
            getTeam(teamId);
        } else
            $('#frmTeam')[0].reset();
    });

    $("#modalOk").click(function(event) {
        event.preventDefault();
        window.location.href = "teams.html";
        $("#teamModal").modal("hide");
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

    /**
     * populate the team data to screen fields
     * @param {*} team 
     */
    function populateTeam(team) {

        if (team != undefined) {

            let minAgeOfMember = getMinAgeOfMember(team);
            let maxAgeOfMember = getMaxAgeOfMember(team);


            $("#teamid").val(teamId);
            $("#teamname").val(team["TeamName"]);
            $("#league option:contains(" + team["League"] + ")").attr('selected', 'selected');
            $("#managername").val(team["ManagerName"]);
            $("#managerphone").val(team["ManagerPhone"]);
            $("#manageremail").val(team["ManagerEmail"]);
            $("#minage").val(team["MinMemberAge"]);
            $("#maxage").val(team["MaxMemberAge"]);
            $("#maxnum").val(team["MaxTeamMembers"]);

            $("#minageofmember").val(minAgeOfMember);
            $("#maxageofmember").val(maxAgeOfMember);

            $("input[name='teamgender'][value='" + team["TeamGender"] + "']").prop('checked', true);

            $("#save, h2").html("Edit Team");
        }
    }

    /**
     * display the success message, 
     * disable the register button 
     * and change the text from Cancel to OK
     * THis is not been used
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

    /**
     * This is to fill the Age dropDown with numbers
     * @param {*} dropdown 
     */
    function fillAge(dropdown) {
        for (let i = 1; i < 101; i++) {
            let option = $("<option>", { value: i, text: i });
            dropdown.append(option);
        }
    };

    /**
     * Validates the min and max ages.
     */
    function validateAge() {

        let url = "/api/teams/" + teamId;
        if (!(Number($("#minage").val()) <= Number($("#minageofmember").val()) && Number($("#maxageofmember").val()) <= Number($("#maxage").val()))) {
            popover($("#iconCards .card-body"), "Age is out of range of existing team members min age: " + $("#minageofmember").val() + ", max age: " + $("#maxageofmember").val());
            return false;
        }
        if (Number($("#minage").val()) > Number($("#maxage").val())) {
            popover($("#iconCards .card-body"), "Min.Age is greater than Max.Age.")
            return false;
        } else
            return true;
    }


    function popover(element, message) {
        element.popover('dispose');
        element.popover({
            trigger: 'focus',
            placement: 'right',
            content: message
        });
        element.popover('show');
    }

    function getMinAgeOfMember(team) {
        let minAge = 100000;
        for (let i = 0; i < team.Members.length; i++) {
            if (Number(team.Members[i].Age) < minAge) {
                minAge = Number(team.Members[i].Age);
            }
        }
        return minAge;
    }

    function getMaxAgeOfMember(team) {
        let maxAge = -1;
        for (let i = 0; i < team.Members.length; i++) {
            if (Number(team.Members[i].Age) > maxAge) {
                maxAge = Number(team.Members[i].Age);
            }
        }
        return maxAge;
    }

});