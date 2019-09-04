/**
 * Descrition: This function to shrink the sidebar 
 * Author: Sudesh Pamidi
 */
"use strict"
$(document).ready(function() {
    $("#sidebarToggle").on('click', function(e) {
        e.preventDefault();
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
    });
});