// Components
import Header from '../../components/Header/Header';
import CategoryCard from '../../components/CategoryCard/CategoryCard';

// Css
import style from './App.module.css';

const categories = [
  { name: 'Films', url: 'films', image: './img/affiche.jpg' },
  { name: 'Vehicles', url: 'vehicles', image: './img/vehicle.webp' },
  { name: 'Species', url: 'species', image: './img/species.webp' },
  { name: 'Planets', url: 'planets', image: './img/planet.jpg' },
  { name: 'People', url: 'people', image: './img/people.jpg' },
  { name: 'Starship', url: 'starship', image: './img/Starship.jpg' },
];

function App() {
  return (
    <div className={style.app}>
      <Header />
      <div className={style.container}>
        {categories.map((item) => (
          <CategoryCard key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
