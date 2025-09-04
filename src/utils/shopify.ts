import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export function formatProductId(id: string | null): string {
  if (!id) {
    throw new Error('Invalid product ID');
  }
  if (id.startsWith('gid://')) {
    return id;
  }
  return `gid://shopify/Product/${id}`;
}

export function formatVariantId(id: string | null): string {
  if (!id) {
    throw new Error('Invalid variant ID');
  }
  if (id.startsWith('gid://')) {
    return id;
  }
  return `gid://shopify/ProductVariant/${id}`;
}

const DOMAIN = 'll-theme.myshopify.com';
const TOKEN = 'b2506cf21eef17d954028e02a4f3eb46';
const API_VER = '2025-07';

//const VARIANT_ID = 'gid://shopify/ProductVariant/49903425388848';

const client = createStorefrontApiClient({
  storeDomain: DOMAIN,
  apiVersion: API_VER,
  publicAccessToken: TOKEN,
});

export async function getProducts() {
  try {
    const { data, errors } = await client.request(
      `
      query Products {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    quantityAvailable
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
      `
    );

    if (errors) {
      throw new Error(errors.message);
    }
    return data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductsByIDs(ids: (string | null)[]) {
  if (!ids || ids.length === 0) return [];

  const formattedIds = ids.map((id) => formatProductId(id));

  try {
    const { data, errors } = await client.request(
      `
        query ($ids: [ID!]!) {
        nodes(ids: $ids) {
            ... on Product {
              id
              handle
              title
              gameType:  metafield(namespace:"custom", key:"game_type"){ value }
              startTime: metafield(namespace:"custom", key:"start_time"){ value }
              duration:  metafield(namespace:"custom", key:"duration"){ value }
              format:    metafield(namespace:"custom", key:"format"){ value }
              variants(first: 50) {
                edges { node {
                  id
                  price { amount }
                  quantityAvailable
                  selectedOptions { name value }
                }}
              }
            }
          }
        }
      `,
      { variables: { ids: formattedIds } }
    );

    if (errors) {
      throw new Error(errors.graphQLErrors?.[0]?.message || errors.message);
    }
    return data.nodes;
  } catch (error) {
    console.error('Error fetching products by IDs:', error);
    return [];
  }
}

export async function getEventByID(id: string) {
  try {
    const formattedId = formatProductId(id);

    const { data, errors } = await client.request(
      `
      query EventByID($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          description
          gameType:  metafield(namespace:"custom", key:"game_type") { value }
          startTime: metafield(namespace:"custom", key:"start_time") { value }
          duration:  metafield(namespace:"custom", key:"duration") { value }
          format:    metafield(namespace:"custom", key:"format") { value }
          bandai:    metafield(namespace:"custom", key:"bandai_tcg") { value }
          complementaryProducts: metafield(namespace:"shopify--discovery--product_recommendation", key:"complementary_products") {
            references(first: 20) {
              edges { node { ... on Product { 
                id 
                title
                variants(first: 4) {
                  edges { node {
                    id 
                    title 
                    quantityAvailable
                    price { amount currencyCode }
                  }}
                }
              }}}
            }
          }
          variants(first: 50) {
            edges { node {
              id
              title
              quantityAvailable
              price { amount currencyCode }
              selectedOptions { name value }
            } }
          }
        }
      }
      `,
      { variables: { id: formattedId } }
    );

    if (errors) {
      throw new Error(errors.graphQLErrors?.[0]?.message || errors.message);
    }

    return data.product;
  } catch (error) {
    console.error(`Error fetching event product with ID ${id}:`, error);
    return null;
  }
}

export async function getEventByHandle(handle: string) {
  try {
    const { data, errors } = await client.request(
      `
      query EventByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          gameType:  metafield(namespace:"custom", key:"game_type") { value }
          startTime: metafield(namespace:"custom", key:"start_time") { value }
          duration:  metafield(namespace:"custom", key:"duration") { value }
          format:    metafield(namespace:"custom", key:"format") { value }
          bandai:    metafield(namespace:"custom", key:"bandai_tcg") { value }
          complementaryProducts: metafield(namespace:"shopify--discovery--product_recommendation", key:"complementary_products") {
            references(first: 20) {
              edges { node { ... on Product { 
                id 
                title
                variants(first: 4) {
                  edges { node {
                    id 
                    title 
                    quantityAvailable
                    price { amount currencyCode }
                  }}
                }
              }}}
            }
          }
          variants(first: 50) {
            edges { node {
              id
              title
              quantityAvailable
              price { amount currencyCode }
              selectedOptions { name value }
            } }
          }
        }
      }
      `,
      { variables: { handle } }
    );

    if (errors) {
      throw new Error(errors.graphQLErrors?.[0]?.message || errors.message);
    }

    return data.productByHandle;
  } catch (error) {
    console.error(`Error fetching event product with handle ${handle}:`, error);
    return null;
  }
}

export async function getCollectionByHandle(handle: string) {
  try {
    const { data, errors } = await client.request(
      `
        query ($handle: String!) {
        collectionByHandle(handle: $handle) {
          products(first: 100) {
            edges { node {
              id
              handle
              title
              totalInventory
              gameType:   metafield(namespace: "custom", key: "game_type") { value }
              startTime:  metafield(namespace: "custom", key: "start_time") { value }
              duration:   metafield(namespace: "custom", key: "duration") { value }
              format:     metafield(namespace: "custom", key: "format") { value }
              variants(first: 50) { edges { node {
                id quantityAvailable price { amount currencyCode }
                selectedOptions { name value }
              }}}
            }}
          }
        }
      }
      `,
      { variables: { handle } }
    );

    if (errors) {
      throw new Error(errors.graphQLErrors?.[0]?.message || errors.message);
    }
    return data;
  } catch (error) {
    console.error(`Error fetching collection with handle ${handle}:`, error);
    return null;
  }
}

// Create a cart
export async function createCart() {
  try {
    const { data, errors } = await client.request(
      `
      mutation CreateCart {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
      `
    );

    if (errors) {
      throw new Error(errors.message);
    }

    return data.cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

export type CartLineInputLite = {
  merchandiseId: string | null;
  quantity: number;
  attributes?: { key: string; value: string }[];
};

export async function createCartWithLines(lines: CartLineInputLite[]) {
  try {
    const formatted = lines.map((l) => ({
      merchandiseId: formatVariantId(l.merchandiseId),
      quantity: l.quantity,
      attributes: l.attributes || [],
    }));

    const { data, errors } = await client.request(
      `
      mutation cartCreate($input: CartInput) {
        cartCreate(input: $input) {
          cart { id checkoutUrl }
          userErrors { field message }
        }
      }
      `,
      { variables: { input: { lines: formatted } } }
    );

    if (errors) {
      throw new Error(errors.graphQLErrors?.[0]?.message || errors.message);
    }

    const userErrors = data?.cartCreate?.userErrors;
    if (userErrors?.length) {
      throw new Error(userErrors[0]?.message || 'Cart create failed');
    }

    return data?.cartCreate?.cart;
  } catch (error) {
    console.error('Error creating cart with lines:', error);
    throw error;
  }
}

// Add items to cart with improved error handling
export async function addItemsToCart(
  cartId: string | null,
  lines: { merchandiseId: string | null; quantity: number }[]
) {
  try {
    const formattedLines = lines.map((line) => ({
      attributes: [{ key: 'Custom Attribute', value: 'Custom Value' }],
      merchandiseId: formatVariantId(line.merchandiseId),
      quantity: line.quantity,
    }));
    const response = await client.request(
      `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 10) {
              edges {
                node {
                  attributes {
                    key
                    value
                  }
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
      `,
      {
        variables: { cartId, lines: formattedLines },
      }
    );

    const { data, errors } = response;

    if (errors) {
      console.error('GraphQL Errors:', errors);
      throw new Error('GraphQL errors occurred');
    }

    // Check for user errors from the mutation
    const userErrors = data?.cartLinesAdd?.userErrors;
    if (userErrors && userErrors.length > 0) {
      console.error('User Errors:', userErrors);
      throw new Error(userErrors[0].message);
    }

    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding items to cart:', error);
    throw error;
  }
}

// async function createCheckout(playerName: string, deckId: string) {
//   const query = `
//     mutation cartCreate($input: CartInput) {
//       cartCreate(input: $input) {
//         cart {
//         	id
//           checkoutUrl
//         }
//         userErrors { field message }
//       }
//     }`;

//   const variables = {
//     input: {
//       lines: [{
//         merchandiseId: VARIANT_ID,
//         quantity: 1,
//         attributes: [
//           { key: "Player Name", value: playerName },
//           { key: "Deck / Game ID", value: deckId }
//         ]
//       }]
//     }
//   };

//   const request = await client.request(query, variables);
//   console.log(request, '1');
//   const { data, errors } = request;
//   if (errors?.length) throw new Error(errors[0].message);
//   console.log(data, errors);

// }
