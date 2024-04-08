$(document).ready(function() {
    // Function to fetch all movies and populate the left side menu
    function fetchMovies() {
      $.get("http://localhost:3000/films", function(data) {
        const filmsList = $("#films");
        filmsList.empty(); // Clear existing list items
        data.forEach(function(movie) {
          const listItem = $("<li>").addClass("film item").text(movie.title);
          filmsList.append(listItem);
        });
      });
    }
  
    // Function to fetch and display details of the first movie
    function displayFirstMovieDetails() {
      $.get("http://localhost:3000/films/1", function(movie) {
        $("#poster").attr("src", movie.poster);
        $("#title").text(movie.title);
        $("#runtime").text(movie.runtime + " minutes");
        $("#showtime").text(movie.showtime);
        const availableTickets = movie.capacity - movie.tickets_sold;
        $("#ticket-num").text(availableTickets);
        if (availableTickets === 0) {
          $("#buy-ticket").text("Sold Out").prop("disabled", true);
        }
      });
    }
  
    // Function to handle buying a ticket for a movie
    $("#buy-ticket").click(function() {
      $.get("http://localhost:3000/films/1", function(movie) {
        const availableTickets = movie.capacity - movie.tickets_sold;
        if (availableTickets > 0) {
          const updatedTicketsSold = movie.tickets_sold + 1;
          $.ajax({
            url: "http://localhost:3000/films/1",
            type: "PATCH",
            contentType: "application/json",
            data: JSON.stringify({ tickets_sold: updatedTicketsSold }),
            success: function() {
              $("#ticket-num").text(availableTickets - 1);
              if (availableTickets - 1 === 0) {
                $("#buy-ticket").text("Sold Out").prop("disabled", true);
              }
              alert("Congratulation on buying the movie ticket!");
            }
          });
        } else {
          alert("Pardon us the movie tickets are sold out!");
        }
      });
    });
  
    $("#films").on("click", ".delete-button", function() {
      const movieId = $(this).data("movie-id");
      $.ajax({
      url: `http://localhost:3000/films/${movieId}`,
      type: "DELETE",
      success: function() {
      fetchMovies(); // Refresh the movies list after deletion
      alert("DEletion of the Movie was succesful!");
      }
      });
      });
      
  
      // Initial setup
      fetchMovies(); // fetchMovies() is not defined
      displayFirstMovieDetails(); // displayFirstMovieDetails() is not defined
      deleteFirstMovieDetails(); // deleteFirstMovieDetails() is not defined
  });