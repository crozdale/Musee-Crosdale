// src/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const SUBGRAPH_URL =
  `https://gateway.thegraph.com/api/${import.meta.env.VITE_GRAPH_API_KEY}` +
  `/subgraphs/id/A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum`;

export const apolloClient = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
});
