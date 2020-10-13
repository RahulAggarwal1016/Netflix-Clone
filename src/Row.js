import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
	const [movies, setMovies] = useState([]);
	const [trailerUrl, setUrl] = useState("");

	useEffect(() => {
		// if []. run once when row loads and never again
		// if variable is being pulled from outside add to empty brackets (i.e. fetchUrl)
		async function fetchData() {
			const request = await axios.get(fetchUrl);
			setMovies(request.data.results);
			return request;
		}
		fetchData();
	}, [fetchUrl]);

	const opts = {
		height: "390",
		width: "100%",
		playerVars: {
			autoplay: 1,
		},
	};

	const handleClick = (movie) => {
		if (trailerUrl) {
			setUrl("");
		} else {
			movieTrailer(movie?.name || "")
				//url of movie clicked on
				.then((url) => {
					const urlParams = new URLSearchParams(new URL(url).search);
					// get everything after "v-" in url (i.e. traiilerKey)
					setUrl(urlParams.get("v"));
				})
				.catch((err) => console.log(err));
		}
	};

	return (
		<div className="row">
			<h2>{title}</h2>
			<div className="row_posters">
				{movies.map((movie) => (
					<img
						//always include key (for optimization)
						onClick={() => handleClick(movie)}
						key={movie.id}
						className={`row_poster ${isLargeRow && "row_posterLarge"}`}
						src={`${base_url}${
							isLargeRow ? movie.poster_path : movie.backdrop_path
						}`}
						alt={movie.name}
					/>
				))}
			</div>
			{trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
		</div>
	);
}

export default Row;
