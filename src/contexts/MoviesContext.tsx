import { createContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  Title: string;
  Poster: string;
  Ratings: Array<{
      Source: string;
      Value: string;
  }>;
  Runtime: string;
}

interface MoviesContextData {
  selectedGenreId: number
  genres: Array<GenreResponseProps>
  movies: Array<MovieProps>
  selectedGenre: GenreResponseProps
  handleClickButton: (id: number) => void
}

export const MoviesContext = createContext({} as MoviesContextData)
export function MoviesProvider({ children }: { children: any; }) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <MoviesContext.Provider
      value={{
        selectedGenreId,
        genres,
        movies,
        selectedGenre,
        handleClickButton
      }}
    >
      { children }
    </MoviesContext.Provider>
  )
}
