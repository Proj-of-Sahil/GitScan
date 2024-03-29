import { addUserDetailstoPage, addRepoDetailstoPage, filterRepoData, addRepoData } from './uiUpdate.js';
import { getlastPageNumber } from './api.js';

let githubUsername = 'octocat';
export let currentPage = 1; // Global variable to store the current page number
export let reposPerPage = 10; // Global variable to store the number of repositories per page
export let lastPage = 10; // Global variable to store the last page number

$('.user-card-twitter-link').hide();
$('.paginationline').hide();
$('.repoFilterSearch').hide();

$(document).ready(function () {
    $('.card-container').hide();

    $('#searchRepo').on('input', function (event) {
        event.preventDefault(); // Prevent the default action
        const repoName = $(this).val(); // Get the input value
        if (repoName === '') {
            addRepoDetailstoPage(githubUsername, currentPage, reposPerPage);
        } else {
            filterRepoData(repoName);
        }
    });

    $('#searchRepo').closest('form').on('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        const repoName = $('#searchRepo').val(); // Get the input value
        filterRepoData(repoName);
    });
    

    $('.dropdown-item').click(function (event) {
        event.preventDefault(); // Prevent the default action
        reposPerPage = parseInt($(this).text()); // Set the global variable to the clicked value
        setLastPageNumber().then(function () {
            handlePaginationClick('first');
            addRepoDetailstoPage(githubUsername, 1, reposPerPage);
        });
    });

    $('#searchUsername').submit(function (event) {
        event.preventDefault(); // Prevent form submission
        githubUsername = $('#username').val();
        addUserDetailstoPage(githubUsername);
        setLastPageNumber().then(function () {
            handlePaginationClick('first');
            addRepoDetailstoPage(githubUsername, currentPage, reposPerPage);
            addRepoData(githubUsername);
        });
        $('.paginationline').show();
    });

    $('.pagination .page-link').click(function (event) {
        event.preventDefault(); // Prevent the default action
        const clickedButton = $(this).text().trim().toLowerCase();
        setLastPageNumber().then(function () {
            handlePaginationClick(clickedButton);
            addRepoDetailstoPage(githubUsername, currentPage, reposPerPage);
        });
    });
});

function setLastPageNumber() {
    return getlastPageNumber(githubUsername, reposPerPage)
        .then(function (response) {
            lastPage = response;
        })
        .catch(function (error) {
            lastPage = 1;
        });
}

/**
 * Handles the pagination click event.
 * @param {string} clickedButton - The button that was clicked ('first', 'prev', 'next', 'last').
 */
function handlePaginationClick(clickedButton) {
    if (clickedButton === 'first') {
        currentPage = 1;
    } else if (clickedButton === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (clickedButton === 'next' && currentPage < lastPage) {
        currentPage++;
    } else if (clickedButton === 'last') {
        currentPage = lastPage;
    }
    // Set the current page
    $('.pagination .current-page').text(`${currentPage}/${lastPage}`);

    // Update the visibility of the Prev and Next buttons
    $('.pagination .page-link:contains("Prev")').parent().toggle(currentPage > 1);
    $('.pagination .page-link:contains("Next")').parent().toggle(currentPage < lastPage);

}