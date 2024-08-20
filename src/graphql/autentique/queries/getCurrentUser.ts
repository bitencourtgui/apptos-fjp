import gql from "graphql-tag";

export const GET_CURRENT_USER = gql`
  query {
    me {
      id
      name
      email
      phone
      cpf
      cnpj
      birthday
      subscription {
        has_premium_features
        documents
        credits
      }
      organization {
        id
        uuid
        name
        cnpj
      }
    }
  }
`;
