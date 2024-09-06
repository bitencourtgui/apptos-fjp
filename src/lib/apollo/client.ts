import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

function registerApolloClient(createClient: () => ApolloClient<any>) {
  const client = createClient();
  return { getClient: client };
}

export const { getClient: ClientUpload } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
      uri: "https://api.autentique.com.br/v2/graphql",
      headers: {
        authorization: `Bearer 567865f8d3c25517833ce4773b898831dc8e08bc355321173253d9f9bdbe85a9`,
      },
    }),
  });
});
