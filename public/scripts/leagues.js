// Call the dataTables jQuery plugin
$(document).ready(function() {
    // $('#dataTable').DataTable();


    getLeagues();

    /**
     * 
     */
    function getLeagues() {

        let url = "/api/leagues";
        $.getJSON(url, function(leagues) {
            populateLeagues(leagues);
        });
    };

    /**
     * This custom function to populate the service information on the screen
     * @param {*} leagues 
     */
    function populateLeagues(leagues) {

        let i = 0;
        leagues.forEach(function(e) {

            /*
                        let html = `<div class="col-xl-3 col-sm-6 mb-3">
                            <div class="card text-white bg-primary h-100">
                            <div class="card-body">
                                <div class="card-body-icon">
                                    <i class="fas fa-fw fa-comments"></i>
                                </div>
                                <div class="mr-5">` + e.Description + `</div>
                            </div>
                            <a class="card-footer text-white clearfix small z-1" href="#">
                                <span class="float-left">View Details</span>
                                <span class="float-right"><i class="fas fa-angle-right"></i></span>
                            </a>
                            </div>
                        </div>`;

                        html = `<div class="card bg-dark text-white">
              <img class="card-img" src="..." alt="Card image">
              <div class="card-img-overlay">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <p class="card-text">Last updated 3 mins ago</p>
              </div>
            </div>`
            */
            i = i + 1;
            html = `<div class="card mt-4">
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