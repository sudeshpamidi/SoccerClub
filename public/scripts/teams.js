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
        alert(league);
        let url = "/api/teams/byleague/" + league;
        console.log(url);
        if (league == "all") {
            url = "/api/teams";
        };

        $.getJSON(url, function(teams) {
            console.log(teams);
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
                         <a href='details.html?id=${e.teamId}'><i class='fas fa-info-circle fa-lg' title='Details' data-toggle='tooltip'></i></a>
                         <a class='edit1 mr-2' title='Edit' data-toggle='tooltip' href='team.html?id=${e.teamId}&edit=true'><i class='fa fa-pencil fa-lg' aria-hidden='true'></i></a>
                     </span>`
            let markup = "<tr><td>" + e.TeamName + "</td><td>" + e.League + "</td><td>" + e.ManagerName + "</td><td>" + e.ManagerPhone + "</td><td>" + url + "</td> </tr>";
            $("#tableTeams tbody").append(markup);
        });
    };

});