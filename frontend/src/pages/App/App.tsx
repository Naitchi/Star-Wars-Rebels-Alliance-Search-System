// Components
import Header from '../../components/Header/Header';
import CategoryCard from '../../components/CategoryCard/CategoryCard';

// Css
import './App.css';

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
    <div className="app">
      <Header />
      <div className="container">
        {categories.map((item, index) => (
          <CategoryCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
