"use strict"
$(document).ready(function() {

    let urlParams = new URLSearchParams(location.search);
    let teamId = urlParams.get("id");

    if (teamId != "") {
        getTeam(teamId);
        $("#teamid").val(teamId);
        fillAge($("#age"));
    }

    /**
     * This function makes a call to restful services and gets the team information and 
     * display in the tbody element.
     * @param {string} teamId  -- team Id
     */
    function getTeam(teamId) {
        let url = "/api/teams/" + teamId;
        $.getJSON(url, function(team) {
                //teamDetail = team;
                clearResults($("table"));
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
     * This function makes a call to restful services and gets the team information and 
     * display in the tbody element.
     * @param {string} teamId  -- team Id
     */
    function getMember(teamId, memberId) {
        let url = "/api/teams/" + teamId + "/members/" + memberId;
        $.getJSON(url, function(member) {
                populateMember(member);
            })
            .fail(function() {
                //$("#teamid").popover("hide");
            })
            .done(function() {
                //$("#save").html("Edit Course");
            });
    };


    function populateTeam(team) {

        if (team != undefined) {
            diplayTeamDetails(team);
            diplayManagerDetails(team);
            diplayPlayers(team.TeamId, team.Members);

            if (team.Members.length >= team.MaxTeamMembers) {
                $("#add").addClass("disabled");
                $("#add").addClass("btn-secondary");
            } else {
                $("#add").removeClass("disabled");
                $("#add").removeClass("btn-secondary");
            }
        }
    };

    function populateMember(member) {

        $("#memberid").val(member.MemberId);
        $("#playername").val(member.MemberName);
        $("#contactname").val(member.ContactName);
        $("#email").val(member.Email);
        $("#phone").val(member.Phone);
        $("input[name='gender'][value='" + member.Gender + "']").prop('checked', true);
        $("#age").val(member.Age);
    }

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
                <th>Gender:</th>
                <td>${team.TeamGender}</td>
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
     * Display team information in the table -#tableteams
     * @param {object} data  -- teams object from Restfull services
     */
    function diplayPlayers(teamid, data) {
        let table = $("<table>", { class: "table table-bordered", id: "tablePlayers", width: "100%" });
        let tbody = $("<tbody>");

        let thead = $("<thead>");
        let headerMarkup = "<tr><th>Player Name</th><th>Player Contact Name</th><th>Player Email</th><th>Player Phone</th><th>Action</th></tr>";
        //$("#tableTeamPlayers thead").append(headerMarkup)
        thead.append(headerMarkup);
        table.append(thead);

        data.forEach(function(e) {
            let url = `<span>
                         <a class= 'view mr-2'  title='View player' data-toggle='tooltip' data-teamid=${teamid} data-memberid=${e.MemberId}><i class="far fa-file-alt fa-lg"></i></a>
                         <a class='edit mr-2' title='Edit player' data-toggle='tooltip' data-teamid=${teamid} data-memberid=${e.MemberId} > <i class='fa fa-pencil fa-lg' aria-hidden='true'></i></a>
                         <a class="delete" title="Delete player" data-teamid=${teamid} data-memberid=${e.MemberId} data-toggle="modal" data-target="#myModal">
                         <i class="fas fa-trash-alt fa-lg"></i>
                         </a>
                     </span>`

            let markup = "<tr><td>" + e.MemberName + "</td><td>" + e.ContactName + "</td><td>" + e.Email + "</td><td>" + e.Phone + "</td><td>" + url + "</td> </tr>";
            //$("#tableTeamPlayers tbody").append(markup);
            tbody.append(markup);
        });
        table.append(tbody);

        $("#cardPlayers .card-body .table-responsive").append(table);

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
                        //row.parents("tr").remove();
                        getTeam(teamId);
                        $("#myModal").modal('hide');
                    });
            });
        });

        $(".edit").on('click', function() {
            let row = $(this);
            let teamId = row.attr("data-teamid");
            let memberId = row.attr("data-memberid");
            getMember(teamId, memberId);
            $("#playerModal .modal-title").html("Edit Player");
            makePlayerReadOnly(false);
            $("#playeridrow").hide();
            $("#playerModal").modal('show');
        });

        $(".view").on('click', function() {
            let row = $(this);
            let teamId = row.attr("data-teamid");
            let memberId = row.attr("data-memberid");
            $("#playerModal .modal-title").html("Player");
            getMember(teamId, memberId);
            makePlayerReadOnly(true);
            $("#playerModal").modal('show');
        });
    };
    /** end of diplayPlayers */

    $("#add").on('click', function() {

        $("#frmPlayer")[0].reset(); //clear the all the element values        
        $("#playerModal .modal-title").html("Add Player");
        makePlayerReadOnly(false);

        $("#playeridrow").hide();
        $("#playerModal").modal('show');
    });

    /** Add event handling in Modal screen*/
    $("#btnSave").on("click", function() {
        if (!validator.validate("#frmPlayer")) {
            return;
        }
        let url = "/api/teams/" + teamId + "/members";
        let postData = $("#frmPlayer").serialize();
        let type = "POST";
        if ($("#memberid").val() != '') {
            type = "PUT";
        }
        let jqXHR = $.ajax({
                url: url,
                type: type, //"POST",
                data: postData
            })
            .done(function() {
                getTeam(teamId);
                $("#playerModal").modal('hide');
            })
            .fail(function(jqXHR, status) {
                //$("#age").popover({
                $("#playerModal .modal-dialog").attr('data-content', jqXHR.responseText);
                $("#playerModal .modal-dialog").popover({
                    trigger: 'manual',
                    placement: 'bottom',
                    content: jqXHR.responseText
                });
                $("#playerModal .modal-dialog").popover('enable');
                $("#playerModal .modal-dialog").popover('show');
            });
    });

    $("#playerModal").on('hidden.bs.modal', function() {
        $("#playerModal .modal-dialog").popover('hide');
        $("#playerModal .modal-dialog").popover('disable');
    });

    /**
     * clears the table information.
     * @param {*} table 
     */
    function clearResults(table) {
        table.empty();
    }

    function fillAge(dropdown) {
        for (let i = 1; i < 101; i++) {
            let option = $("<option>", { value: i, text: i });
            dropdown.append(option);
        }
    };

    function makePlayerReadOnly(readonly) {

        $("#playername").attr("readonly", readonly);
        $("#contactname").attr("readonly", readonly);
        $("#email").attr("readonly", readonly);
        $("#phone").attr("readonly", readonly);
        $("input[name='gender']").attr('disabled', readonly);

        //$("#age").attr("readonly", readonly);
        $("#age").attr("disabled", readonly);


        if (readonly == true) {
            $("#playername").popover('disable');
            $("#contactname").popover('disable');
            $("#email").popover('disable');
            $("#phone").popover('disable');

            $("#btnCacel").html("Ok");
            $("#btnSave").hide();

        } else {
            $("#playername").popover('enable');
            $("#contactname").popover('enable');
            $("#email").popover('enable');
            $("#phone").popover('enable');

            $("#btnCacel").html("Cancel");
            $("#btnSave").show();
        }

    }
})