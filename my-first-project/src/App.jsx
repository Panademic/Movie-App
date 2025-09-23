import { useEffect , useState } from 'react'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errormessage,  setErrormessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');


  useDebounce(()=> setDebounceSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (querry = '')=>{
    setIsLoading(true);
    setErrormessage('');
    try{
      const endpoint = querry ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(querry)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS);
      
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      console.log(data);
      
      if(data.response == false){ 
        setErrormessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      // if(querry && data.results.length>0){
      //   await updateSearchCount(querry, data.results[0]);
      // } 
    
    }catch(error){
      console.log("Fetch Error", error);
      setErrormessage("Error fetching movies. Please try again later");
    }finally{
      setIsLoading(false);
    }
  }
  useEffect(()=>{
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);
  return (
    <main>
      <div className='pattern'/>
      
      <div className='wrapper'>
        <header>
          <img src="./hero-img.svg" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className='all-movies'>
          <h2 className='mt-40px'>All Movies</h2>

          {isLoading ?(
            <p className= 'text-white'>Loading...</p>
          ): errormessage?(
            <p className='text-red-500'>{errormessage}</p>
          ): (
            <ul>
              {movieList.map((movie)=>(

                <MovieCard key = {movie.id} movie = {movie}/>
              ))}
            </ul>
          )
          }

          {/* {errormessage && <p className='text-red-500'>{errormessage}</p>} */}
        </section>

        
      </div>

    </main>
  )
}

export default App
