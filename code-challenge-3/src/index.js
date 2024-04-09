$(document).ready(function() { 
    const baseUrl = "http://localhost:3000";
    
    // Function to fetch and display movie details
    const displayMovieDetails = async (filmId) => {
    try {
    const response = await fetch(`${baseUrl}/films/${filmId}`);
    if (!response.ok) {
    throw new Error("Failed to fetch movie details");
    }
    const movieData = await response.json();
    
    const { title, runtime, capacity, showtime, tickets_sold, poster, description } = movieData; 
    const availableTickets = capacity - tickets_sold;
    $("#poster").attr("src", poster);
    $("#title").text(title); 
    $("#runtime").text(`${runtime} minutes`);
    $("#film-info").text(description); 
    $("#showtime").text(showtime); 
    $("#ticket-num").text(`${availableTickets} remaining tickets`);
    
    // Enable or disable buy ticket button based on ticket availability
    const buyTicketButton = $("#buy-ticket");
    if (availableTickets > 0) {
    buyTicketButton.prop("disabled", false);
    buyTicketButton.text("Buy Ticket");
    buyTicketButton.off('click').on('click', function() {
    buyTicket(movieData);
    });
    } else {
    buyTicketButton.prop("disabled", true);
    buyTicketButton.text("Sold Out");
    }
    
    // Delete movie button
    $("#delete-movie").off('click').on('click', function() {
    deleteMovie(movieData.id);
    });
    } catch (error) {
    console.error("Error fetching movie details:", error.message);
    }
    };
    
    // Function to fetch all movies and populate the left side menu
    function fetchMovies() {
    $.get(`${baseUrl}/films`, function(data) {
    const filmsList = $("#films");
    filmsList.empty(); // Clear existing list items
    data.forEach(function(movie) {
    const listItem = $("<li>").addClass("film item").text(movie.title);
    listItem.on('click', function() {
    displayMovieDetails(movie.id);
    });
    filmsList.append(listItem);
    });
    }).fail(function(error) {
    console.log("Fetch error:", error);
    });
    }
    
    // Function to handle buying a ticket for a movie
    function buyTicket(movie) {
    const updatedTicketsSold = movie.tickets_sold + 1;
    $.ajax({
    url: `${baseUrl}/films/${movie.id}`,
    type: "PATCH",
    contentType: "application/json",
    data: JSON.stringify({ tickets_sold: updatedTicketsSold }),
    success: function() {
    displayMovieDetails(movie); // Refresh movie details after buying ticket
    alert("Congratulations on buying the movie ticket!");
    },
    error: function(xhr, status, error) {
    console.error("Error buying ticket:", error);
    }
    });
    }
    
    // Function to delete a movie
    function deleteMovie(movieId) {
    $.ajax({
    url: `${baseUrl}/films/${movieId}`,
    type: "DELETE",
    success: function() {
    fetchMovies(); // Refresh movie list after deletion
    // Clear movie details from the right side
    $("#poster").attr("src", "");
    $("#title").text("");
    $("#runtime").text("");
    $("#showtime").text("");
    $("#ticket-num").text("");
    $("#buy-ticket").prop("disabled", true);
    $("#buy-ticket").text("Buy Ticket");
    },
    error: function(xhr, status, error) {
    console.error("Error deleting movie:", error);
    }
    });
    }
    
    // Initial setup
    fetchMovies();
    });
    