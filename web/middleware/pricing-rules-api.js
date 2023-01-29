/*
  The custom REST API to support the app frontend.
  Handlers combine application data from qr-codes-db.js with helpers to merge the Shopify GraphQL Admin API data.
  The Shop is the Shop that the current user belongs to. For example, the shop that is using the app.
  This information is retrieved from the Authorization header, which is decoded from the request.
  The authorization header is added by App Bridge in the frontend code.
*/

import express from "express";

import shopify from "../shopify.js";
import { QRCodesDB } from "../qr-codes-db.js";
import {
  getQrCodeOr404,
  getShopUrlFromSession,
  parseQrCodeBody,
  formatQrCodeResponse,
} from "../helpers/qr-codes.js";

const NUM = 15;

const PRODUCTS_QUERY = `
 {
    products(first: 10) {
      edges {
        node {
          id
          title
          tags
          images(first: 1) {
            edges {
              node {
                id
                url
              }
            }
          }
          collections(first: 10) {
            nodes {
              id
            }
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  {
    collections(first: 10) {
      edges {
        node {
          id
          title
          image {
            id
            url
          }
          products(first: 10) {
            edges {
              node {
                id
                title
                tags
                images(first: 1) {
                  edges {
                    node {
                      id
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const TAGS_QUERY = `
  {
    shop {
      productTags(first: 10) {
        edges {
          node
        }
      }
    }
  }
`;

export default function applyPricingRulesApiEndpoints(app) {
  app.use(express.json());

  // products
  app.get("/api/products", async (_req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const products = await client.query({
      data: {
        query: PRODUCTS_QUERY,
        variables: {
          first: 25,
        },
      },
    });

    res.send(products.body.data);
  });

  // collections
  app.get("/api/collections", async (_req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const collections = await client.query({
      data: {
        query: COLLECTIONS_QUERY,
        variables: {
          first: 25,
        },
      },
    });

    res.send(collections.body.data);
  });

  // collections
  app.get("/api/tags", async (_req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const tags = await client.query({
      data: {
        query: TAGS_QUERY,
        variables: {
          first: 25,
        },
      },
    });

    res.send(tags.body.data);
  });
}
