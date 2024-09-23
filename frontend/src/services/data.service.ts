import axios from 'axios';

export async function getAll(name: string | undefined) {
  let url: string = '';

  switch (name) {
    case 'films':
      url = 'http://localhost:3000/films';
      break;
    case 'starship':
      url = 'http://localhost:3000/starship';
      break;
    case 'people':
      url = 'http://localhost:3000/people';
      break;
    case 'planets':
      url = 'http://localhost:3000/planets';
      break;
    case 'species':
      url = 'http://localhost:3000/species';
      break;
    case 'vehicles':
      url = 'http://localhost:3000/vehicles';
      break;
    default:
      url = 'http://localhost:3000/people';
      break;
  }
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (e) {
    throw console.log(JSON.stringify(e));
  }
}

// export async function getOneLogement(id) {
//   const response = await fetch('../src/data/logements.json', {
//     method: 'GET',
//     headers: {
//       Accept: 'application/json',
//     },
//   });
//   const logements = await response.json();
//   if (logements.some((logement) => logement.id === id)) {
//     return logements.find((logement) => logement.id === id);
//   }
//   window.location.href = '/NotFound';
// }
