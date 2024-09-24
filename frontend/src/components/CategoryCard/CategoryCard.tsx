import { Link } from 'react-router-dom';
import './CategoryCard.css';

export default function CategoryCard(
  props: Readonly<{
    item: { name: string; url: string; image: string };
  }>,
) {
  return (
    <Link className="link" to={`/${props.item.url}`}>
      <div
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 100%), url(${props.item.image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        className="thumb"
      >
        <h2>{props.item.name}</h2>
      </div>
    </Link>
  );
}
