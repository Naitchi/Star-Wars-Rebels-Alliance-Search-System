import './CategoryCard.css';

export default function CategoryCard(
  props: Readonly<{
    item: { name: string; url: string; image: string };
  }>,
) {
  return (
    <a className="link" href={`/${props.item.url}`}>
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
    </a>
  );
}
