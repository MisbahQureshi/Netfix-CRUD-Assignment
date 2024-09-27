const { ApolloServer, gql } = require('apollo-server');
const { MongoClient } = require('mongodb');

// MongoDB connection string
const client = new MongoClient('mongodb+srv://username:password@cluster0.ovad4.mongodb.net/');

const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    description: String
    genres: [String]
    imdb_score: Float
    release_year: Int
    runtime: Int
  }

  type Query {
    movies: [Movie]
    movie(title: String!): Movie
  }

  type Mutation {
    createMovie(title: String!, description: String, genres: [String], imdb_score: Float, release_year: Int, runtime: Int): Movie
    updateMovie(title: String!, description: String, genres: [String], imdb_score: Float, runtime: Int): Movie
    deleteMovie(title: String!): String
  }
`;

const resolvers = {
  Query: {
    movies: async () => {
      const db = client.db('database');
      const collection = db.collection('netflixes');
      return collection.find().toArray();
    },
    movie: async (parent, args) => {
      const db = client.db('database');
      const collection = db.collection('netflixes');
      return collection.findOne({ title: args.title });
    }
  },
  Mutation: {
    createMovie: async (parent, args) => {
      const db = client.db('database');
      const collection = db.collection('netflixes');
      const newMovie = { ...args };
      await collection.insertOne(newMovie);
      return newMovie;
    },
    updateMovie: async (parent, args) => {
      const db = client.db('database');
      const collection = db.collection('netflixes');
      await collection.updateOne({ title: args.title }, { $set: { description: args.description, genres: args.genres, imdb_score: args.imdb_score, runtime: args.runtime } });
      return collection.findOne({ title: args.title });
    },
    deleteMovie: async (parent, args) => {
      const db = client.db('database');
      const collection = db.collection('netflixes');
      await collection.deleteOne({ title: args.title });
      return `Movie ${args.title} deleted`;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
