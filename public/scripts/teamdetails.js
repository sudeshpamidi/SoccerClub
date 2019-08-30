$(document).ready(function() {

    let urlParams = new URLSearchParams(location.search);
    let teamId = urlParams.get("id");

    if (teamId != "") {
        getTeam(teamId);
    }





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

            diplayTeamDetails(team);
            diplayManagerDetails(team);
            diplayPlayers(team.Members);


            $("#teamid").val(teamId);
            $("#teamname").val(team["TeamName"]);
            $("#league option:contains(" + team["League"] + ")").attr('selected', 'selected');
            $("#managername").val(team["ManagerName"]);
            $("#managerphone").val(team["ManagerPhone"]);
            $("#manageremail").val(team["ManagerEmail"]);
            $("#minage option:contains(" + team["MinMemberAge"] + ")").attr('selected', 'selected');
            $("#maxage option:contains(" + team["MaxMemberAge"] + ")").attr('selected', 'selected');
            $("#maxnum option:contains(" + team["MaxTeamMembers"] + ")").attr('selected', 'selected');
            $("input[name='teamgender'][value='" + team["TeamGender"] + "']").prop('checked', true);

            $("#save, h2").html("Edit Team");
        }
    };

    function diplayTeamDetails(team) {


    }

    function diplayManagerDetails(team) {


    }

    function diplayPlayers(players) {
        console.log(players);
        populateHeader();
        populateTable(players)

    }


    /**
     * clears the table information.
     * @param {*} table 
     */
    function clearResults(table) {
        table.empty();
    }

    /**
     * This is to fill the dropDown with the data in array of elements.
     * @param {*} dropdown  -- dropdown name 
     * @param {*} obj       -- javascript object
     */
    function fillDropDown(dropdown) {
        let url = "/api/leagues";
        $.getJSON(url, function(leagues) {
            leagues.forEach(function(e) {
                let option = new $("<option>", { value: e.Code, text: e.Name })
                dropdown.append(option);
            });
        });
    };


    /**
     * creating header in the table
     */
    function populateHeader() {
        let markup = "<tr><th>Team Name</th><th>League</th><th>Manager Name</th><th>Manager Phone</th><th>Action</th></tr>";
        $("#tableTeamPlayers thead").append(markup)
    }

    /**
     * Display team information in the table -#tableteams
     * @param {object} data  -- teams object from Restfull services
     */
    function populateTable(data) {
        data.forEach(function(e) {
            let url = `<span>
                         <a class= 'details mr-2' href='teamdetails.html?id=${e.MemberId}' title='Details' data-toggle='tooltip'><i class="far fa-file-alt fa-lg"></i></a>
                         <a class='edit mr-2' title='Edit' data-toggle='tooltip' href='team.html?id=${e.MemberId}&edit=true'> <i class='fa fa-pencil fa-lg' aria-hidden='true'></i></a>
                         <a class="delete" title="Delete" data-teamid=${e.MemberId} data-toggle="modal" data-target="#myModal">                
                         <i class="fas fa-trash-alt fa-lg"></i>
                         </a>
                     </span>`

            let markup = "<tr><td>" + e.MemberName + "</td><td>" + e.ContactName + "</td><td>" + e.Email + "</td><td>" + e.Phone + "</td><td>" + url + "</td> </tr>";
            $("#tableTeamPlayers tbody").append(markup);
        });


        /** Delete event handling */
        $(".delete").on("click", function() {
            let row = $(this);
            let teamId = row.attr("data-teamid");
            let url = "/api/teams/" + teamId;

            $("#btnConfirm").on('click', function() {
                $.ajax({
                        url: url,
                        type: "DELETE"
                    })
                    .done(function() {
                        row.parents("tr").remove();
                        $("#myModal").modal('hide');
                    });
                // row.parents("tr").remove();
                // $("#myModal").modal('hide');
            });
        });
    };
});