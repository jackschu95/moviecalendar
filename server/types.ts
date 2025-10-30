export interface Theater {
  id: string;
  name: string;
  address: string;
  website: string;
  type: 'independent' | 'landmark';
}

export interface MovieShowing {
  id: string;
  title: string;
  theater: string;
  date: Date;
  time: string;
  description?: string;
  director?: string;
  year?: number;
  runtime?: number;
  genre?: string[];
  imageUrl?: string;
  url?: string;
}

export interface ScrapedMovie {
  title: string;
  date: Date;
  time: string;
  description?: string;
  director?: string;
  year?: number;
  runtime?: number;
  genre?: string[];
  imageUrl?: string;
  url?: string;
}
