export interface Vehicle {
  name: string;
  model: string;
  vehicle_class: string;
  manufacturer: string;
  length: string;
  cost_in_credits: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  cargo_capacity: string;
  consumables: string;
  films: string[];
  pilots: string[];
  url: string;
  created: string;
  edited: string;
}
export interface People {
  name: string;
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: string;
  films: string[];
  species: string[];
  starships: string[];
  vehicles: string[];
  url: string;
  created: string;
  edited: string;
}

export interface Films {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  species: string[];
  vehicles: string[];
  characters: string[];
  planets: string[];
  starships: string[];
  url: string;
  created: string;
  edited: string;
}

export interface Starship {
  name: string;
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  films: string[];
  pilots: string[];
  url: string;
  created: string;
  edited: string;
}

export interface Species {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  eye_colors: string;
  hair_colors: string;
  skin_colors: string;
  language: string;
  homeworld: string;
  people: string[];
  films: string[];
  url: string;
  created: string;
  edited: string;
}

export interface Planet {
  name: string;
  diameter: string;
  rotation_period: string;
  orbital_period: string;
  gravity: string;
  population: string;
  climate: string;
  terrain: string;
  surface_water: string;
  residents: string[];
  films: string[];
  url: string;
  created: string;
  edited: string;
}

export interface All {
  name?: string;
  model?: string;
  vehicle_class?: string;
  manufacturer?: string;
  length?: string;
  cost_in_credits?: string;
  crew?: string;
  passengers?: string;
  max_atmosphering_speed?: string;
  cargo_capacity?: string;
  consumables?: string;
  pilots?: string[];
  birth_year?: string;
  eye_color?: string;
  gender?: string;
  hair_color?: string;
  height?: string;
  mass?: string;
  skin_color?: string;
  homeworld?: string;
  films?: string[];
  starships?: string[];
  title?: string;
  episode_id?: number;
  opening_crawl?: string;
  director?: string;
  producer?: string;
  release_date?: string;
  species?: string[];
  vehicles?: string[];
  characters?: string[];
  planets?: string[];
  starship_class?: string;
  hyperdrive_rating?: string;
  MGLT?: string;
  classification?: string;
  designation?: string;
  average_height?: string;
  average_lifespan?: string;
  eye_colors?: string;
  hair_colors?: string;
  skin_colors?: string;
  language?: string;
  people?: string[];
  diameter?: string;
  rotation_period?: string;
  orbital_period?: string;
  gravity?: string;
  population?: string;
  climate?: string;
  terrain?: string;
  surface_water?: string;
  residents?: string[];
  url: string;
  created: string;
  edited: string;
}

export type Items = Vehicle[] | People[] | Starship[] | Films[] | Planet[] | Species[];
export type Item = Vehicle | People | Starship | Films | Planet | Species;
