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
            diplayPlayers(team.TeamId, team.Members);

            // $("#save, h2").html("Edit Team");
        }
    };

    function diplayTeamDetails(team) {
        let table = $("<table>");
        let tbody = $("<tbody>");
        // $.each(team, function(key, val) {
        //     console.log(key);
        //     console.log(val);
        // });

        let html = `
            <tr>
                <th>Team Id:</th>
                <td>${team.TeamId}</td>
            </tr>
            <tr>
                <th>Team Name:</th>
                <td>${team.TeamName}</td>
            </tr>
            <tr>
                <th>League:</th>
                <td>${team.League}</td>
            </tr>
            <tr>
                <th>Min. Age:</th>
                <td>${team.MinMemberAge}</td>
            </tr>
            <tr>
                <th>Max. Age:</th>
                <td>${team.MaxMemberAge}</td>
            </tr>
            <tr>
                <th>Max Team Members:</th>
                <td>${team.MaxTeamMembers}</td>
            </tr>`;

        tbody.append(html);
        table.append(tbody)
        $("#teamCard .card-body").append(table);
    }

    function diplayManagerDetails(team) {

        let table = $("<table>");
        let tbody = $("<tbody>");
        let html = `
            <tr>
                <th>Manager Name:</th>
                <td>${team.ManagerName}</td>
            </tr>
            <tr>
                <th>Manager Phone:</th>
                <td>${team.ManagerPhone}</td>
            </tr>
            <tr>
                <th>Manager Email:</th>
                <td>${team.ManagerEmail}</td>
            </tr>`;

        tbody.append(html);
        table.append(tbody)
        $("#managerCard .card-body").append(table);
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
     * Display team information in the table -#tableteams
     * @param {object} data  -- teams object from Restfull services
     */
    function diplayPlayers(teamid, data) {

        let headerMarkup = "<tr><th>Player Name</th><th>Player Contact Name</th><th>Player Email</th><th>Player Phone</th><th>Action</th></tr>";
        $("#tableTeamPlayers thead").append(headerMarkup)

        data.forEach(function(e) {
            let url = `<span>
                         <a class= 'details mr-2' href='teamdetails.html?id=${e.MemberId}' title='Details' data-toggle='tooltip'><i class="far fa-file-alt fa-lg"></i></a>
                         <a class='edit mr-2' title='Edit' data-toggle='tooltip' href='team.html?id=${e.MemberId}&edit=true'> <i class='fa fa-pencil fa-lg' aria-hidden='true'></i></a>
                         <a class="delete" title="Delete" data-teamid=${teamid} data-memberid=${e.MemberId} data-toggle="modal" data-target="#myModal">
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
            let memberId = row.attr("data-memberid");
            let url = "/api/teams/" + teamId + "/members/" + memberId;

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