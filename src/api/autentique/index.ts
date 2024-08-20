'use server';

import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';
import FormData from 'form-data';
import axios from 'axios';

const token = process.env.AUTENTIQUE_TOKEN!;

class Autentique {
  constructor(private token: string, private sandbox: boolean = false) {}

  private get api() {
    return axios.create({
      baseURL: 'https://api.autentique.com.br',
      headers: {
        'X-Autntiq-Api': this.token,
      },
    });
  }

  async accountInfos() {
    console.info('accountInfos init');
    try {
      const response = await this.api.get('/pessoas/me.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching account info:', error);
    }
  }

  async createDocument(data) {
    console.info('createDocument init');
    try {
      const filePath = path.join(process.cwd(), 'src', 'utils', 'sample.pdf');
      const templatePath = path.join(
        process.cwd(),
        'src',
        'resources',
        'autentique',
        'documents',
        'create.graphql'
      );

      const operations = JSON.stringify({
        query: (await readFile(templatePath)).toString('utf8'),
        variables: {
          document: {
            name: data.document.name,
          },
          signers: data.signers.map((signer) => ({
            email: signer.email,
            action: signer.action,
          })),
          file: null,
          sandbox: this.sandbox,
        },
      });

      const map = JSON.stringify({
        '0': ['variables.file'],
      });

      const formData = new FormData();
      formData.append('operations', operations);
      formData.append('map', map);
      formData.append('0', fs.createReadStream(filePath));

      const response = await axios.post(
        'https://api.autentique.com.br/v2/graphql',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      if (Math.trunc(response.status / 100) !== 2) {
        const errorText = response.data;
        console.error('Response error:', response.status, response.statusText);
        console.error('Response body:', errorText);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const jsonResponse = response.data;

      if (jsonResponse.errors) {
        console.error('GraphQL response errors:', jsonResponse.errors);
      } else {
        console.log('GraphQL response data:', JSON.stringify(jsonResponse.data, null, 2));
      }

      return jsonResponse.data;
    } catch (error: any) {
      console.error('Error creating document:', error);
      throw error;
    }
  }
}

// Exemplo de handler para a API route
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const autentique = new Autentique(token);
      const documentData = req.body;
      const result = await autentique.createDocument(documentData);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
