import React, {useEffect, useState} from 'react';
import './App.css'
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]); 
  const [featuredData, SetFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o Featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length-1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      SetFeaturedData(chosenInfo);
      
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }

  }, []);
  
  return (
    <div className='page'>

      <Header black= {blackHeader}/>

      {featuredData &&
        <FeaturedMovie item= {featuredData} />  
      }

      <section className='lists'>
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
        
        Direitos de imagem para a Netflix<br/>
        Dados extraídos do site Themoviedb.org
      </footer>

      {movieList.length <=0 &&
      <div className='loading'>
        <img src="https://tenor.com/view/netflix-loading-buffering-gif-6089689.gif" alt= "carregando" />
      </div>
      }
    </div>
  )
}
