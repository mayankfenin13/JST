const Movie = require('../models/Movie');
const User = require('../models/User');

const dummyMovies = [
  { title: "The Shawshank Redemption", director: "Frank Darabont", releaseYear: 1994, genre: "Drama" },
  { title: "The Godfather", director: "Francis Ford Coppola", releaseYear: 1972, genre: "Crime" },
  { title: "The Dark Knight", director: "Christopher Nolan", releaseYear: 2008, genre: "Action" },
  { title: "12 Angry Men", director: "Sidney Lumet", releaseYear: 1957, genre: "Drama" },
  { title: "Schindler's List", director: "Steven Spielberg", releaseYear: 1993, genre: "Drama" },
  { title: "The Lord of the Rings: The Return of the King", director: "Peter Jackson", releaseYear: 2003, genre: "Fantasy" },
  { title: "Pulp Fiction", director: "Quentin Tarantino", releaseYear: 1994, genre: "Crime" },
  { title: "The Good, the Bad and the Ugly", director: "Sergio Leone", releaseYear: 1966, genre: "Western" },
  { title: "Fight Club", director: "David Fincher", releaseYear: 1999, genre: "Drama" },
  { title: "Forrest Gump", director: "Robert Zemeckis", releaseYear: 1994, genre: "Drama" },
  { title: "Inception", director: "Christopher Nolan", releaseYear: 2010, genre: "Sci-Fi" },
  { title: "The Lord of the Rings: The Fellowship of the Ring", director: "Peter Jackson", releaseYear: 2001, genre: "Fantasy" },
  { title: "Star Wars: Episode V - The Empire Strikes Back", director: "Irvin Kershner", releaseYear: 1980, genre: "Sci-Fi" },
  { title: "The Lord of the Rings: The Two Towers", director: "Peter Jackson", releaseYear: 2002, genre: "Fantasy" },
  { title: "The Matrix", director: "The Wachowskis", releaseYear: 1999, genre: "Sci-Fi" },
  { title: "Goodfellas", director: "Martin Scorsese", releaseYear: 1990, genre: "Crime" },
  { title: "One Flew Over the Cuckoo's Nest", director: "Milos Forman", releaseYear: 1975, genre: "Drama" },
  { title: "Seven Samurai", director: "Akira Kurosawa", releaseYear: 1954, genre: "Adventure" },
  { title: "Se7en", director: "David Fincher", releaseYear: 1995, genre: "Thriller" },
  { title: "City of God", director: "Fernando Meirelles", releaseYear: 2002, genre: "Crime" },
  { title: "The Silence of the Lambs", director: "Jonathan Demme", releaseYear: 1991, genre: "Thriller" },
  { title: "It's a Wonderful Life", director: "Frank Capra", releaseYear: 1946, genre: "Drama" },
  { title: "Life Is Beautiful", director: "Roberto Benigni", releaseYear: 1997, genre: "Comedy" },
  { title: "The Usual Suspects", director: "Bryan Singer", releaseYear: 1995, genre: "Mystery" },
  { title: "Léon: The Professional", director: "Luc Besson", releaseYear: 1994, genre: "Action" },
  { title: "Spirited Away", director: "Hayao Miyazaki", releaseYear: 2001, genre: "Animation" },
  { title: "Saving Private Ryan", director: "Steven Spielberg", releaseYear: 1998, genre: "War" },
  { title: "La La Land", director: "Damien Chazelle", releaseYear: 2016, genre: "Musical" },
  { title: "The Avengers", director: "Joss Whedon", releaseYear: 2012, genre: "Action" },
  { title: "Interstellar", director: "Christopher Nolan", releaseYear: 2014, genre: "Sci-Fi" },
];

// Generate more movies to reach 1000+
const generateMovies = () => {
  const titles = [
    "The Adventure", "Mystery Night", "Summer Dreams", "Winter Storm", "Golden Hour",
    "Silent Waters", "Broken Wings", "Rising Sun", "Fallen Angel", "Secret Garden",
    "Lost Highway", "Midnight Express", "Silver Bullet", "Diamond Dogs", "Iron Will",
    "Velvet Sky", "Crimson Tide", "Purple Rain", "Green Mile", "Blue Moon",
    "Red Dawn", "Black Swan", "White Noise", "Grey Matter", "Rainbow Bridge"
  ];
  
  const directors = [
    "James Cameron", "Steven Spielberg", "Martin Scorsese", "Quentin Tarantino", "Christopher Nolan",
    "David Fincher", "Ridley Scott", "Tim Burton", "Woody Allen", "Stanley Kubrick",
    "Alfred Hitchcock", "Francis Ford Coppola", "George Lucas", "Peter Jackson", "Denis Villeneuve",
    "Jordan Peele", "Greta Gerwig", "Ari Aster", "Paul Thomas Anderson", "Wes Anderson",
    "The Coen Brothers", "Clint Eastwood", "Spike Lee", "John Carpenter", "David Lynch"
  ];
  
  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance",
    "Sci-Fi", "Thriller", "Western", "Animation", "Crime", "Documentary", "Family",
    "Musical", "War", "Biography", "History", "Sport"
  ];
  
  const movies = [...dummyMovies];
  
  // Generate additional movies to reach 1000+
  while (movies.length < 1200) {
    const title = titles[Math.floor(Math.random() * titles.length)] + " " + 
                 (Math.floor(Math.random() * 100) + 1);
    const director = directors[Math.floor(Math.random() * directors.length)];
    const releaseYear = Math.floor(Math.random() * (2024 - 1950 + 1)) + 1950;
    const genre = genres[Math.floor(Math.random() * genres.length)];
    
    movies.push({ title, director, releaseYear, genre });
  }
  
  return movies;
};

const seedDatabase = async () => {
  try {
    // Check if we already have movies in the database
    const existingMoviesCount = await Movie.countDocuments();
    
    if (existingMoviesCount > 0) {
      console.log(`Database already seeded with ${existingMoviesCount} movies`);
      return;
    }
    
    // Create a default system user for seeding
    let systemUser = await User.findOne({ email: 'system@movieapp.com' });
    
    if (!systemUser) {
      systemUser = new User({
        googleId: 'system-user-id',
        name: 'System User',
        email: 'system@movieapp.com',
        avatar: ''
      });
      await systemUser.save();
      console.log('Created system user for seeding');
    }
    
    const movies = generateMovies();
    const moviesWithUserId = movies.map(movie => ({
      ...movie,
      userId: systemUser._id
    }));
    
    await Movie.insertMany(moviesWithUserId);
    console.log(`Seeded database with ${movies.length} movies`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase };