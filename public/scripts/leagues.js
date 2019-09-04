/**
 * Description: This is contains supporing functions for league.html
 * Author: Sudesh Pamidi
 */

"use strict"
$(document).ready(function() {
    getLeagues();

    /**
     * gets the league information from RESTful sercices
     */
    function getLeagues() {
        let url = "/api/leagues";
        $.getJSON(url, function(leagues) {
            populateLeagues(leagues);
        });
    };

    /**
     * This custom function to populate the leagues information on the screen
     * @param {*} leagues 
     */
    function populateLeagues(leagues) {
        let i = 0;
        leagues.forEach(function(e) {
            i = i + 1;
            let html = `<div class="card shadow mt-4">
                            <img class="card-img-top" src="images/league${i}.jpg" alt="images/league${i}.jpg">
                            <div class="card-body">
                                <h5 class="card-title">${e.Name}</h5>
                                <p class="card-text">${e.Description}</p>
                                <a class="btn btn-primary btn-sm" role="button" href="teams.html">View Teams</a>
                                <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                            </div>
                        </div>`
            $("#iconCards .col-sm-9").append(html);
        });
    }
});