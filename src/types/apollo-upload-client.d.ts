declare module 'apollo-upload-client/createUploadLink.mjs' {
    import { ApolloLink } from '@apollo/client';
    import { Fetcher } from 'apollo-upload-client';
  
    export default function createUploadLink(options: {
      uri: string;
      fetch?: Fetcher;
      headers?: Record<string, string>;
    }): ApolloLink;
  }
  