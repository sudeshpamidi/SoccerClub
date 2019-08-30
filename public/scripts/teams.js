$(document).ready(function() {

    fillDropDown($("#leagues"));
    $("#leagues").on("change", displayTeams);

    getTeams("all");

    /**
     * Display the team information in the table.
     */
    function displayTeams() {
        clearResults($("#tableTeams thead"));
        clearResults($("#tableTeams tbody"));
        getTeams($("#leagues").val());
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
     * Display the team information by category. 
     * all -- provides all the teams.
     * @param {string} category 
     */
    function getTeams(league) {

        let url = "/api/teams/byleague/" + league;
        if (league == "all") {
            url = "/api/teams";
        };

        $.getJSON(url, function(teams) {
            populateHeader();
            populateTable(teams)
        });
    };

    /**
     * creating header in the table
     */
    function populateHeader() {
        let markup = "<tr><th>Team Name</th><th>League</th><th>Manager Name</th><th>Manager Phone</th><th>Action</th></tr>";
        $("#tableTeams thead").append(markup)
    }

    /**
     * Display team information in the table -#tableteams
     * @param {object} data  -- teams object from Restfull services
     */
    function populateTable(data) {
        data.forEach(function(e) {
            let url = `<span>

                         <a class= 'details mr-2' href='team.html?id=${e.TeamId}' title='Details' data-toggle='tooltip'><i class="far fa-file-alt fa-lg"></i></a>
                         <a class='edit mr-2' title='Edit' data-toggle='tooltip' href='team.html?id=${e.TeamId}&edit=true'> <i class='fa fa-pencil fa-lg' aria-hidden='true'></i></a>
                         <a class="delete" title="Delete" data-teamid=${e.TeamId} data-toggle="modal" data-target="#myModal">                
                         <i class="fas fa-trash-alt fa-lg"></i>
                         </a>
                     </span>`
            let markup = "<tr><td>" + e.TeamName + "</td><td>" + e.League + "</td><td>" + e.ManagerName + "</td><td>" + e.ManagerPhone + "</td><td>" + url + "</td> </tr>";
            $("#tableTeams tbody").append(markup);
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