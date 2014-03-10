var movieApp = {};

movieApp.api_key = "bd3d274b9eae1737c76b7679b574ba23";

movieApp.init = function(){
	movieApp.grabConfig();

	movieApp.getSessionId();

	movieApp.genres();

	// listen for click on star ratings
	$('body').on('change','input[type=radio]',function(){
		var rating = $(this).val();
		var movieId = $(this).attr('id').split('-')[0].replace('movie','');
		movieApp.ratingHandler(rating, movieId);
	});

	$('body').on('change','select', function() {
		var selectedGenre = $(this).val();
		var genreName = $(this).find(':selected').text();

		$('h2').text(genreName);
		movieApp.getGenre(selectedGenre);
	});

}; // end movieApp.init

// This function will go to the movie db api and get all the config data that we require.
// When it finishes it will put the data it gets onto movieApp.config

movieApp.genres = function() {
	var genreList = "http://api.themoviedb.org/3/genre/list";
	$.ajax(genreList, {
		type : 'GET',
		dataType : 'jsonp',
		data : {
			api_key : movieApp.api_key
		},
		success : function(data) {
			console.log(data.genres);
			for (var i = 0; i < data.genres.length; i++) {
				$('<option>').attr('value',data.genres[i].id).text(data.genres[i].name).appendTo('select');
			};
		}
	}); // end genres
};

movieApp.grabConfig = function() {
	var configURL = "http://api.themoviedb.org/3/configuration";
	$.ajax(configURL, {
		type : 'GET',
		dataType : 'jsonp',
		data : {
			api_key : movieApp.api_key
		},
		success : function(config) {
			movieApp.config = config;
			movieApp.getGenre(); // call the next thing to do
		}
	}); // end config ajax
};

movieApp.getGenre = function(selectedGenre){
	var genreURL = "http://api.themoviedb.org/3/genre/" + selectedGenre + "/movies";
	$.ajax(genreURL,{
		type: 'GET',
		dataType : 'jsonp',
		data : {
			api_key : movieApp.api_key
		},
		success : function(data){
			console.log(data);
			// run the displayMovies method to put them on the page
			movieApp.displayMovies(data.results);

		}
	}); // end top-rated ajax
};

movieApp.displayMovies = function(movies) {
	$('.allMovies').empty();
	for (var i = 0; i < movies.length; i++) {
		var title = $('<h3>').text(movies[i].title);
		var image = $('<img>').attr('src',movieApp.config.images.base_url + "w500" + movies[i].poster_path);
		// grab the one existing fieldset and copy it to all these other things
		var rating = $('fieldset.rateMovie')[0].outerHTML;
		rating = rating.replace(/star/g,'movie' + movies[i].id + '-star');
		rating = rating.replace(/rating/g,'rating-' + movies[i].id);
		var movieWrap = $('<div>').addClass('movie');
		movieWrap.append(image,title,rating);
		$('.allMovies').append(movieWrap);
	};
};

// movieApp.ratingHandler = function(rating, movieId){
// 	$.ajax('http://api.themoviedb.org/3/movie/' + movieId + '/rating', {
// 		type : 'POST',
// 		data : {
// 			api_key : movieApp.api_key,
// 			guest_session_id : movieApp.session_id,
// 			value : rating * 2
// 		},
// 		success : function(response){
// 			if(response.status_code) {
// 				alert("Thanks for the vote!");
// 			} else {
// 				alert(response.status_message);
// 			}
// 		}
// 	});

// };

movieApp.getSessionId = function() {
	$.ajax('http://api.themoviedb.org/3/authentication/guest_session/new', {
		data : {
			api_key : movieApp.api_key
		},
		type : 'GET',
		dataType : 'jsonp',
		success : function (session) {
			// store the session id for later use
			movieApp.session_id = session.guest_session_id;
		}
	});
};

// doc ready
$(function() {

	movieApp.init();


}); // end doc ready