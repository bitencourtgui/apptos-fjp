import gql from "graphql-tag";

export const CREATE_DOCUMENT = gql`
    query {
        mutation CreateDocumentMutation(
        $document: DocumentInput!, # Definição das variáveis $document,
        $signers: [SignerInput!]!, # $signers e $file, com seus respectivos
        $file: Upload!             # tipos. (Os "!" indicam que são
        ) {                          # parâmetros obrigatórios)      
        createDocument(
            document: $document,     # Passa para os parâmetros da mutation o 
            signers: $signers,       # valor das variáveis.
            file: $file,             #
            organization_id: 123,    # OPCIONAL: Cria em outras organizações do usuário, senão usa a atual
            folder_id: "a1b2c3"      # OPCIONAL: Cria arquivado em uma pasta
        ) {
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
            action { name }
            link { short_link }
            user { id name email }
            }
        }
    }
`;
