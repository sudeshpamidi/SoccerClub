$(document).ready(function() {

    fillDropDown($("#leagues"));

    $("#leagues").on("change", displayTeams);

    getTeams("all");

    /**
     * Display the course information in the table.
     */
    function displayTeams() {
        clearResults($("#tableTeams thead"));
        clearResults($("#tableTeams thead"));
        getTeams("all") //  ($("#leagues").val());
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
     * Display the course information by category. 
     * all -- provides all the courses.
     * @param {string} category 
     */
    function getTeams(league) {

        let url = "/api/teams/" + league;
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
        let markup = "<tr><th>Team Name</th><th>League</th><th>Manager Name</th><th>Manager Phone</th></tr>";
        $("#tableTeams thead").append(markup)
    }

    /**
     * Display course information in the table -#tableCourses
     * @param {object} data  -- Courses object from Restfull services
     */
    function populateTable(data) {
        data.forEach(function(e) {
            // let url = `<span>
            //             <a href='details.html?id=${e.CourseId}'><i class='fas fa-info-circle fa-lg' title='Details' data-toggle='tooltip'></i></a>
            //             <a class='edit mr-2' title='Edit' data-toggle='tooltip' href='course.html?id=${e.CourseId}&edit=true'><i class='fa fa-pencil fa-lg' aria-hidden='true'></i></a>
            //         </span>`
            let markup = "<tr><td>" + e.TeamName + "</td><td>" + e.League + "</td><td>" + e.ManagerName + "</td><td>" + e.ManagerPhone + "</td></tr>";
            $("#tableTeams tbody").append(markup);
        });
    };

});