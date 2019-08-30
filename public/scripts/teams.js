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

                         <a href='team.html?id=${e.TeamId}'><i class='fas fa-info-circle fa-lg' title='Details' data-toggle='tooltip'></i></a>
                         <a class='edit mr-2' title='Edit' data-toggle='tooltip' href='team.html?id=${e.TeamId}&edit=true'> <i class='fa fa-pencil fa-lg' aria-hidden='true'></i></a>
                         <a class="delete" title="Unregister" data-teamid=${e.TeamId} data-toggle="modal" data-target="#exampleModal">                
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

            let postData = "/api/teams/" + teamId;
            console.log(teamId);

            // $(this).parents("tr").find("td:not(:last-child)").each(function(key, value) {
            //     if (key == "0")
            //         postData = postData + "&studentname=" + $(this).text();
            //     else
            //         postData = postData + "&email=" + $(this).text();
            // });

            $("#btnConfirm").on('click', function() {

                $("#exampleModal").modal('hide');

                // let url = "/api/unregister";
                // $.ajax({
                //         url: url,
                //         type: "POST",
                //         data: postData
                //     })
                //     .done(function() {
                //         //$(this).parents("tr").remove();
                //         row.parents("tr").remove();
                //     });

                row.parents("tr").remove();
            });
        });
    };



});