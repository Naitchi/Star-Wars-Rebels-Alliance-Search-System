// Components
import Header from '../../components/Header/Header';
import CategoryCard from '../../components/CategoryCard/CategoryCard';

// Css
import style from './App.module.css';

const categories = [
  { name: 'Films', url: 'films', image: '' },
  { name: 'Vehicles', url: 'vehicles', image: '' },
  { name: 'Species', url: 'species', image: '' },
  { name: 'Planets', url: 'planets', image: '' },
  { name: 'People', url: 'people', image: '' },
  { name: 'Starship', url: 'starship', image: '' },
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
