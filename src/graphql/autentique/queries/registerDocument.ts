import gql from "graphql-tag";

export const REGISTER_DOCUMENT = gql`
query {
  document(id: "ID_DO_DOCUMENTO") {
    id
    name
    refusable
    sortable
    created_at
    files { original signed pades }
    signatures {
      public_id
      name
      email
      created_at
      action { name }
      link { short_link } # Link de assinatura se signatário for adicionado por "name" ao invés de "email"
      user { id name email }
      email_events {
        sent # Timestamp de confirmação de envio do email
        opened # Timestamp abertura do email (pode não registrar em alguns clientes de email)
        delivered # Timestamp de confirmação do recebimento do email no cliente
        refused # Timestamp de erro no envio do email
        reason # Mensagem de erro retornada ao ocorrer erro no envio
      }
      viewed { ...event } # Quando o signatário visualizar
      signed { ...event } # Quando o signatário assinar
      rejected { ...event } # Quando o signatário rejeitar
      signed_unapproved { ..event } # Quando signatário assinar, mas pendente de aprovação biométrica
      biometric_approved { ..event } # Quando biometria do signatário que estiver pendente de aprovação for aprovada
      biometric_rejected { ..event } # Quando biometria do signatário que estiver pendente de aprovação for rejeitada
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
