import gql from "graphql-tag";

export const CREATE_DOCUMENT = gql`
  mutation CreateDocumentMutation(
    $document: DocumentInput!
    $signers: [SignerInput!]!
    $file: Upload!
  ) {
    createDocument(document: $document, signers: $signers, file: $file) {
      id
      name
      refusable
      sortable
      created_at
      signatures {
        public_id
        name
        email
        created_at
        action {
          name
        }
        link {
          short_link
        }
        user {
          id
          name
          email
        }
      }
    }
  }
`;
