import gql from "graphql-tag";

export const GET_DOCUMENT = gql`
  query GetDocument($id: UUID!) {  # Modificado para UUID
    document(id: $id) {
      id
      name
      refusable
      sortable
      created_at
      files {
        original
        signed
      }
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
        email_events {
          sent
          opened
          delivered
          refused
          reason
        }
        viewed {
          ...event
        }
        signed {
          ...event
        }
        rejected {
          ...event
        }
      }
    }
  }

  fragment event on Event {
    ip
    port
    reason
    created_at
    geolocation {
      country
      countryISO
      state
      stateISO
      city
      zipcode
      latitude
      longitude
    }
  }
`;
