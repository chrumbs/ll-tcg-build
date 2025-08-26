import { debounce } from '$utils/debounce';
import { dateFormatter, moneyFormatter, timeFormatter } from '$utils/formatters';
import { setTextByAttr } from '$utils/setText';
import { createCartWithLines, getEventByHandle } from '$utils/shopify';

// Minimal typing helpers
type VariantNode = {
  title: string;
  id: string;
  quantityAvailable: number;
  price?: { amount?: string; currencyCode?: string };
  selectedOptions?: { name: string; value: string }[];
};

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  gameType?: { value?: string } | null;
  startTime?: { value?: string } | null;
  duration?: { value?: string } | null;
  format?: { value?: string } | null;
  bandai?: boolean | null;
  complementaryProducts?: {
    references?: {
      edges?: {
        node?: {
          id: string;
          title?: string;
          variants?: {
            edges?: {
              node?: {
                id: string;
                title?: string;
                price?: { amount?: string; currencyCode?: string };
                quantityAvailable: number;
              };
            }[];
          };
        };
      }[];
    };
  } | null;
  variants?: { edges?: { node: VariantNode }[] };
};

window.Webflow ||= [];
window.Webflow.push(async () => {
  console.log('Webflow at src/events initialized');

  // Resolve product handle or id from DOM/URL
  const metaEl = document.querySelector<HTMLElement>('#event-meta'); //note: add this or fallback
  const cmsHandle = metaEl?.getAttribute('data-handle') || undefined;
  const urlHandle = location.pathname.split('/').filter(Boolean).pop();
  const handle = cmsHandle || urlHandle || '';

  // Fetch cart
  const cartEl = document.querySelector('[data-role="cart"]');
  //   let draftCartId: string | null = null;
  // Update the cartItems type at the top:
  let cartItems: Array<{
    id: string;
    title: string;
    variant: string;
    price: number;
    quantity?: number;
    variantId?: string;
  }> = [];

  let chosenVariantId: string | null = null;

  // Fetch product by handle using shared Shopify utils
  const p: ProductNode | null = await getEventByHandle(handle);

  if (!p) {
    console.error('[events] No product for handle', handle);
    return;
  }

  //   const initializeCart = async () => {
  //     try {
  //       const cart = await createCart();
  //       draftCartId = cart.id;
  //       console.log('Draft cart created:', draftCartId);
  //       return cart;
  //     } catch (error) {
  //       console.error('Error creating draft cart:', error);
  //       return null;
  //     }
  //   };

  // Update the updateCartDisplay function:
  const updateCartDisplay = () => {
    if (!cartEl) {
      console.error('Cart element not found');
      return;
    }

    const cartItemsContainer = cartEl.querySelector('[data-field="cart-items"]');
    const subtotalEl = cartEl.querySelector('[data-field="cart-subtotal"]');
    const cartItemTemplate = document.querySelector('[data-field="cart-line-item"]');

    if (!cartItemsContainer || !subtotalEl || !cartItemTemplate) {
      console.error('Required cart elements not found');
      return;
    }

    if (cartItemTemplate) {
      cartItemTemplate.classList.add('hide');
    }

    cartItemsContainer.innerHTML = '';

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    cartItems.forEach((item) => {
      const itemEl = cartItemTemplate.cloneNode(true) as HTMLElement;
      itemEl.classList.remove('hide');

      // Find and update the title element
      const titleEl = itemEl.querySelector('[data-field="cart-line-title"]');
      if (titleEl) {
        const displayTitle =
          item.quantity && item.quantity > 1 ? `${item.title} (${item.quantity}x)` : item.title;
        titleEl.textContent = displayTitle;
      }

      // Find and update the variant element
      const variantEl = itemEl.querySelector('[data-field="cart-line-variant"]');
      if (variantEl) variantEl.textContent = item.variant;

      // Find and update the price element
      const priceEl = itemEl.querySelector('[data-field="cart-line-price"]');
      if (priceEl) priceEl.textContent = moneyFormatter(item.price, currency);

      // Handle remove button for upsells (not main event)
      const removeBtn = itemEl.querySelector('[data-role="cart-line-clear"]');
      const handleRemove = () => removeFromCart(item.id);

      if (item.id !== 'event' && removeBtn) {
        // Show the remove button for upsells
        removeBtn.classList.remove('hide');
        removeBtn.addEventListener('click', handleRemove);
      } else if (removeBtn) {
        // Hide the remove button for the main event
        removeBtn.classList.add('hide');
      }

      cartItemsContainer.appendChild(itemEl);
    });

    // Update subtotal
    subtotalEl.textContent = moneyFormatter(subtotal, currency);
  };

  const safeUpdateCartDisplay = () => {
    try {
      updateCartDisplay();
    } catch (error) {
      console.error('Error updating cart display:', error);
      // Show user-friendly error message
    }
  };

  const updateEventInCart = async (variant: VariantNode, division: string) => {
    console.log('Updating event in cart:', JSON.stringify(variant), division);
    // Update local display first
    const price = Number(variant.price?.amount || '0');
    const { title } = p;
    const variantTitle = division;

    // Update the cart items array for display
    cartItems = cartItems.filter((item) => item.id !== 'event');
    cartItems.push({
      id: 'event',
      title,
      variant: variantTitle,
      price,
    });

    safeUpdateCartDisplay();
  };

  // ---- Normalize product ----
  const variants: VariantNode[] = (p.variants?.edges || []).map((e) => e.node);
  const seatsLeft = variants.reduce((s, v) => s + (v.quantityAvailable || 0), 0);
  const prices = variants
    .map((v) => Number(v.price?.amount || '0'))
    .filter((n) => Number.isFinite(n));
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const currency = variants[0]?.price?.currencyCode || 'USD';
  const start = p.startTime?.value ? new Date(p.startTime.value) : null;
  if (start) {
    setTextByAttr(document, 'date', dateFormatter(start));
    setTextByAttr(document, 'time', timeFormatter(start));
  }
  setTextByAttr(document, 'gameType', p.gameType?.value || '');
  setTextByAttr(document, 'format', p.format?.value || '');
  setTextByAttr(document, 'duration', p.duration?.value ? `${Number(p.duration.value)} min` : '');
  setTextByAttr(document, 'seats', seatsLeft > 0 ? `${seatsLeft} seats left` : 'Sold out');
  if (minPrice != null) {
    setTextByAttr(
      document,
      'price',
      maxPrice != null && maxPrice !== minPrice
        ? `${moneyFormatter(minPrice, currency)} - ${moneyFormatter(maxPrice, currency)}`
        : minPrice === 0
          ? 'Free'
          : moneyFormatter(minPrice, currency)
    );
  }

  //   await initializeCart();

  // ---- Build Ticket components for all variants ----
  const ticketTemplate = document.querySelector<HTMLElement>('[data-role="ticket"]');
  const ticketsContainer = ticketTemplate?.parentElement || null;

  // Function to update active ticket styling
  const setActiveTicket = (activeTicketEl: HTMLElement) => {
    // Remove active class from all tickets
    document.querySelectorAll('[data-role="ticket"]').forEach((ticket) => {
      ticket.querySelector('.ticket-select')?.classList.remove('is-active');
      ticket.setAttribute('aria-pressed', 'false');
    });

    // Add active class to selected ticket
    activeTicketEl.querySelector('.ticket-select')?.classList.add('is-active');
    activeTicketEl.setAttribute('aria-pressed', 'true');
  };

  if (ticketsContainer && ticketTemplate) {
    if (ticketTemplate) {
      ticketTemplate.classList.add('hide');
    }
    // Clear container
    ticketsContainer.innerHTML = '';

    // Sort variants by price (lowest first)
    const sortedVariants = [...variants].sort((a, b) => {
      const priceA = Number(a.price?.amount || '0');
      const priceB = Number(b.price?.amount || '0');
      return priceA - priceB;
    });

    // Track if we've selected a variant yet
    let hasSelectedVariant = false;

    // Create a ticket for each variant
    sortedVariants.forEach((variant) => {
      // Get variant details
      const options = Object.fromEntries(
        (variant.selectedOptions || []).map((o) => [o.name.toLowerCase(), o.value])
      );

      console.log('Variant options:', options);

      // Determine variant title to display - use first available option or fallback to variant.title
      let variantTitle = variant.title;

      // If we have selectedOptions, use the first one that's not "Title"
      if (variant.selectedOptions && variant.selectedOptions.length > 0) {
        const meaningfulOption = variant.selectedOptions.find(
          (opt) => opt.name.toLowerCase() !== 'title' && opt.value !== 'Default Title'
        );

        if (meaningfulOption) {
          variantTitle = meaningfulOption.value;
        } else {
          // If all options are "Title" or "Default Title", check if there's a meaningful title
          const titleOption = variant.selectedOptions.find(
            (opt) => opt.name.toLowerCase() === 'title' && opt.value !== 'Default Title'
          );
          if (titleOption) {
            variantTitle = titleOption.value;
          }
        }
      }

      // Skip variants that still have "Default Title" and there are multiple variants
      // (If there's only one variant, we'll show it regardless)
      if (variantTitle === 'Default Title' && variants.length > 1) {
        return;
      }

      // If it's still "Default Title" but it's the only variant, give it a better name
      if (variantTitle === 'Default Title') {
        variantTitle = 'Single Entry';
      }

      // Create ticket element
      const ticketEl = ticketTemplate.cloneNode(true) as HTMLElement;
      ticketEl.classList.remove('hide');

      // Set ticket data
      const titleEl = ticketEl.querySelector('[data-field="variant-title"]');
      const seatsEl = ticketEl.querySelector('[data-field="seats"]');
      const priceEl = ticketEl.querySelector('[data-field="price"]');

      if (titleEl) titleEl.textContent = variantTitle;

      const qty = variant.quantityAvailable || 0;
      if (seatsEl) seatsEl.textContent = qty > 0 ? `${qty} seats left` : 'Sold out';

      const price = Number(variant.price?.amount || '0');
      if (priceEl) priceEl.textContent = price === 0 ? 'Free' : moneyFormatter(price, currency);

      // Disable sold out tickets
      if (qty <= 0) {
        ticketEl.classList.add('sold-out');
        // Sold out tickets should not be focusable
        ticketEl.setAttribute('tabindex', '-1');
        ticketEl.setAttribute('aria-disabled', 'true');
      } else {
        // Store variant ID on the element
        ticketEl.dataset.variantId = variant.id;
        ticketEl.setAttribute('aria-pressed', 'false');

        // Create debounced cart update function
        const debouncedCartUpdate = debounce(() => {
          updateEventInCart(variant, variantTitle);
        }, 500);

        // Add click handler with immediate UI feedback and debounced cart update
        ticketEl.addEventListener('click', () => {
          if (qty <= 0) return;

          // Immediate UI updates (no debouncing needed)
          chosenVariantId = variant.id;
          setActiveTicket(ticketEl);

          // Debounced cart update
          debouncedCartUpdate();
        });

        // Add keyboard event handlers
        ticketEl.addEventListener('keydown', (e) => {
          if (qty <= 0) return;

          // Handle Enter and Space keys
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            chosenVariantId = variant.id;
            setActiveTicket(ticketEl);
            debouncedCartUpdate();
          }
        });

        // Select first available variant by default
        if (!hasSelectedVariant) {
          chosenVariantId = variant.id;
          setActiveTicket(ticketEl);
          updateEventInCart(variant, variantTitle);
          hasSelectedVariant = true;
        }
      }

      // Add to container
      ticketsContainer.appendChild(ticketEl);
    });

    // If we didn't find any valid variants, use the first one regardless of inventory
    if (!hasSelectedVariant && variants.length > 0) {
      const firstVariant = variants[0];
      const options = Object.fromEntries(
        (firstVariant.selectedOptions || []).map((o) => [o.name.toLowerCase(), o.value])
      );
      chosenVariantId = firstVariant.id;

      // Create a sold out ticket
      const ticketEl = ticketTemplate.cloneNode(true) as HTMLElement;
      ticketEl.classList.remove('hide');
      ticketEl.classList.add('sold-out');

      const titleEl = ticketEl.querySelector('[data-field="variant-title"]');
      const seatsEl = ticketEl.querySelector('[data-field="seats"]');
      const priceEl = ticketEl.querySelector('[data-field="price"]');

      if (titleEl) titleEl.textContent = options['division'] || firstVariant.title;
      if (seatsEl) seatsEl.textContent = 'Sold out';

      const price = Number(firstVariant.price?.amount || '0');
      if (priceEl) priceEl.textContent = price === 0 ? 'Free' : moneyFormatter(price, currency);

      // Add to container
      ticketsContainer.appendChild(ticketEl);
    }
  } else {
    // Fallback to old code
    chosenVariantId = variants[0]?.id || null;
  }

  const upsellTemplate = document.querySelector<HTMLElement>('[data-role="upsell"]');
  const upsellContainer = upsellTemplate?.parentElement;

  // Extract variants from complementary products
  const upsells = (p.complementaryProducts?.references?.edges || [])
    .map((e) => e.node)
    .filter(Boolean)
    .flatMap((product) => {
      // Get the first variant from each complementary product
      const firstVariant = product?.variants?.edges?.[0]?.node;
      return firstVariant
        ? [
            {
              id: firstVariant.id,
              title: `${product.title}`,
              price: firstVariant.price,
              quantityAvailable: firstVariant.quantityAvailable || 0, // Add inventory info
            },
          ]
        : [];
    });

  console.log('Upsells:', upsells);

  // Add this function after addUpsellToCart:
  const showInventoryError = (itemTitle: string, message: string) => {
    // You can customize this to show the error however you prefer
    console.error(`Inventory Error for ${itemTitle}: ${message}`);

    // Option 1: Show in the main error box
    const errBox = document.querySelector<HTMLElement>('[data-role="error"]');
    if (errBox) {
      errBox.textContent = `${itemTitle}: ${message}`;
      errBox.classList.remove('hide');

      // Auto-hide after 3 seconds
      setTimeout(() => {
        errBox.classList.add('hide');
      }, 5000);
    }

    // Option 2: Alert (simple but not ideal UX)
    // alert(`${itemTitle}: ${message}`);
  };

  // Update showAddToCartFeedback to be more user-friendly:
  const showAddToCartFeedback = (title: string, quantity: number) => {
    console.log(`Added ${quantity}x ${title} to cart`);

    // Optional: Show success message
    // You could create a toast notification here
  };

  // Replace the addUpsellToCart function with this improved version:
  const addUpsellToCart = (
    upsellId: string,
    title: string,
    price: number,
    quantity: number,
    variantId: string
  ) => {
    // Find the upsell item to check inventory
    const upsellItem = upsells.find((u) => u.id === variantId);
    if (!upsellItem) {
      console.error('Upsell item not found:', variantId);
      return;
    }

    // Calculate current quantity in cart for this item
    const existingItem = cartItems.find((item) => item.id === upsellId);
    const currentCartQuantity = existingItem?.quantity || 0;
    const totalRequestedQuantity = currentCartQuantity + quantity;

    // Check if requested quantity exceeds available inventory
    if (totalRequestedQuantity > upsellItem.quantityAvailable) {
      const availableToAdd = upsellItem.quantityAvailable - currentCartQuantity;

      if (availableToAdd <= 0) {
        showInventoryError(title, 'This item is already at maximum quantity in your cart.');
        return;
      }
    }

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex((item) => item.id === upsellId);

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const existingItem = cartItems[existingItemIndex];
      const newQuantity = (existingItem.quantity ?? 1) + quantity;
      cartItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        price: price * newQuantity,
      };
    } else {
      // Add new item to cart
      cartItems.push({
        id: upsellId,
        title,
        variant: '', // Upsells don't need variant display
        price: price * quantity,
        quantity: quantity,
        variantId: variantId,
      });
    }

    safeUpdateCartDisplay();
    showAddToCartFeedback(title, quantity);
  };

  // Add remove function for cart items
  const removeFromCart = (itemId: string) => {
    cartItems = cartItems.filter((item) => item.id !== itemId);
    safeUpdateCartDisplay();
  };

  // Replace the upsell rendering section (around line 450) with this:
  if (upsells.length && upsellContainer && upsellTemplate) {
    // Get the template element
    if (!upsellTemplate) {
      console.error('Upsell template not found');
      return;
    }

    if (upsellTemplate) {
      upsellTemplate.classList.add('hide');
    }

    upsellContainer.innerHTML = '';

    upsells.forEach((u) => {
      const price = Number(u?.price?.amount || '0');
      const upsellId = `upsell_${u?.id.split('/').pop()}`;
      const stock = u.quantityAvailable || 0;
      const maxQuantity = Math.min(10, stock); // Cap at 10 or available stock

      // Clone the template
      const upsellEl = upsellTemplate.cloneNode(true) as HTMLElement;
      upsellEl.classList.remove('hide');

      // Add sold out class if no stock
      if (stock <= 0) {
        upsellEl.classList.add('sold-out');
      }

      // Update title
      const titleEl = upsellEl.querySelector('[data-field="upsell-title"]');
      if (titleEl) titleEl.textContent = u?.title || 'Add-on';

      // Update price
      const priceEl = upsellEl.querySelector('[data-field="upsell-price"]');
      if (priceEl) priceEl.textContent = moneyFormatter(price, u?.price?.currencyCode || 'USD');

      // Update stock count
      const stockCountEl = upsellEl.querySelector('[data-field="upsell-stock-count"]');
      if (stockCountEl) stockCountEl.textContent = stock.toString();

      // Show/hide stock info based on availability AND quantity threshold
      const stockEl = upsellEl.querySelector<HTMLElement>('[data-field="upsell-stock"]');
      if (stockEl) {
        // Only show stock info if stock is between 1-4 (inclusive)
        if (stock > 0 && stock < 6) {
          stockEl.classList.remove('hide');
        } else {
          stockEl.classList.add('hide');
        }
      }

      // Get control elements
      const addBtn = upsellEl.querySelector('[data-field="upsell-add"]');
      const qtyWrap = upsellEl.querySelector<HTMLElement>('[data-field="upsell-qty-wrap"]');
      const qtyUpBtn = upsellEl.querySelector('[data-field="upsell-qty-up"]');
      const qtyDownBtn = upsellEl.querySelector('[data-field="upsell-qty-down"]');
      const qtyCountEl = upsellEl.querySelector('[data-field="upsell-qty-count"]');

      // Set initial quantity
      let currentQty = 1;
      if (qtyCountEl) qtyCountEl.textContent = currentQty.toString();

      // Update button text and state based on stock
      if (addBtn) {
        const buttonText = addBtn.querySelector('.button-text');
        if (stock <= 0) {
          if (buttonText) buttonText.textContent = 'Out of Stock';
          addBtn.classList.add('disabled');
        } else {
          if (buttonText) buttonText.textContent = 'Add to Cart';
          addBtn.classList.remove('disabled');
        }
      }

      // Disable quantity controls if no stock
      if (stock <= 0) {
        if (qtyWrap) qtyWrap.style.opacity = '0.5';
        if (qtyUpBtn) (qtyUpBtn as HTMLButtonElement).disabled = true;
        if (qtyDownBtn) (qtyDownBtn as HTMLButtonElement).disabled = true;
      }

      // Only add event listeners if item is in stock
      if (stock > 0) {
        // Quantity up button
        qtyUpBtn?.addEventListener('click', () => {
          if (currentQty < maxQuantity) {
            currentQty = currentQty + 1;
            if (qtyCountEl) qtyCountEl.textContent = currentQty.toString();
          }
        });

        // Quantity down button
        qtyDownBtn?.addEventListener('click', () => {
          if (currentQty > 1) {
            currentQty = currentQty - 1;
            if (qtyCountEl) qtyCountEl.textContent = currentQty.toString();
          }
        });

        // Update the upsell add to cart handler:
        const debouncedAddUpsell = debounce((...args: unknown[]) => {
          // Type assertion to expected argument types
          const [upsellId, title, price, qty, variantId] = args as [
            string,
            string,
            number,
            number,
            string,
          ];
          addUpsellToCart(upsellId, title, price, qty, variantId);
        }, 500);

        addBtn?.addEventListener('click', () => {
          if (!addBtn.classList.contains('disabled')) {
            // Immediate visual feedback
            addBtn.classList.add('processing');

            // Debounced add to cart
            debouncedAddUpsell(upsellId, u?.title || 'Add-on', price, currentQty, u?.id || '');

            // Remove processing class after debounce period
            setTimeout(() => {
              addBtn.classList.remove('processing');
            }, 1000);
          }
        });
      }

      // Add the upsell element to the list
      upsellContainer.appendChild(upsellEl);
    });
  } else if (upsellContainer) {
    upsellContainer.parentElement?.classList.add('hide');
  }

  // Form state management
  const formState = {
    participant: '', // 'self' or 'other'
    requirePlayerName: false,
    requirePokemonId: false,
    requireTcgAccount: false,
  };

  // Update the updateFieldVisibility function
  const updateFieldVisibility = () => {
    console.log(p);
    // Player name fields
    const playerNameSection = document.querySelector<HTMLElement>('[data-role="player-name"]');
    if (playerNameSection) {
      // Only show and require for "other"
      const isOther = formState.participant === 'other';

      // Toggle hide class instead of style.display
      if (isOther) {
        playerNameSection.classList.remove('hide');
      } else {
        playerNameSection.classList.add('hide');
      }

      formState.requirePlayerName = isOther;

      // Update required attributes on inputs
      const inputs = playerNameSection.querySelectorAll('input');
      inputs.forEach((input) => {
        input.required = isOther;
      });
    }

    // Pokemon ID field
    const pokemonIdSection = document.querySelector<HTMLElement>('[data-role="pokemon-id"]');
    if (pokemonIdSection) {
      // Show only for Pokemon game type
      const isPokemon = (p.gameType?.value || '').toLowerCase() === 'pokemon';

      // Toggle hide class
      if (isPokemon) {
        pokemonIdSection.classList.remove('hide');
      } else {
        pokemonIdSection.classList.add('hide');
      }

      formState.requirePokemonId = isPokemon;

      // Update required attribute
      const pokemonIdInput = pokemonIdSection.querySelector('input');
      if (pokemonIdInput) {
        pokemonIdInput.required = isPokemon;
      }
    }

    // TCG Account field
    const tcgAccountSection = document.querySelector<HTMLElement>('[data-role="tcg-account"]');
    if (tcgAccountSection) {
      // Show only for Bandai products
      const isBandai = !!p.bandai;

      // Toggle hide class
      if (isBandai) {
        tcgAccountSection.classList.remove('hide');
      } else {
        tcgAccountSection.classList.add('hide');
      }

      formState.requireTcgAccount = isBandai;
    }
  };

  // Set up event listeners for form fields
  const setupFormListeners = () => {
    // Participant selection (self/other)
    const selfRadio = document.getElementById('self') as HTMLInputElement;
    const otherRadio = document.getElementById('other') as HTMLInputElement;

    if (selfRadio && otherRadio) {
      selfRadio.addEventListener('change', () => {
        if (selfRadio.checked) {
          formState.participant = 'self';
          updateFieldVisibility();
        }
      });

      otherRadio.addEventListener('change', () => {
        if (otherRadio.checked) {
          formState.participant = 'other';
          updateFieldVisibility();
        }
      });

      // Default selection
      if (selfRadio.checked) formState.participant = 'self';
      if (otherRadio.checked) formState.participant = 'other';
    }

    // Pre-select "self" by default
    if (selfRadio && !selfRadio.checked && !otherRadio?.checked) {
      selfRadio.checked = true;
      formState.participant = 'self';
    }
  };

  // Update validateForm function to handle conditional validation
  const validateForm = (): { valid: boolean; error?: string } => {
    if (!chosenVariantId) {
      return { valid: false, error: 'This event is sold out.' };
    }

    // Check first name & last name conditionally
    if (formState.requirePlayerName) {
      const firstName = getFormValue('field-first-name');
      const lastName = getFormValue('field-last-name');

      if (!firstName) {
        return { valid: false, error: "Please enter the player's first name." };
      }

      if (!lastName) {
        return { valid: false, error: "Please enter the player's last name." };
      }
    }

    // Check Pokemon ID conditionally
    if (formState.requirePokemonId) {
      const pokemonId = getFormValue('field-pokemon-id');
      if (!pokemonId) {
        return { valid: false, error: 'Please enter your Pokémon ID.' };
      }
    }

    // Check TCG Account conditionally
    if (formState.requireTcgAccount) {
      const hasTcgAccount = document.querySelector('input[name="tcg-account"]:checked');
      if (!hasTcgAccount) {
        return { valid: false, error: 'Please indicate if you have a TCG Plus account.' };
      }
    }

    return { valid: true };
  };

  // Update createEventCart function to include all form fields
  const createEventCart = async () => {
    // Gather player details
    const firstName = getFormValue('field-first-name');
    const lastName = getFormValue('field-last-name');
    const playerName = `${firstName} ${lastName}`.trim();

    const pokemonId = formState.requirePokemonId ? getFormValue('field-pokemon-id') : '';

    // Get TCG account status
    let tcgAccountStatus = '';
    if (formState.requireTcgAccount) {
      const tcgTrue = document.getElementById('true') as HTMLInputElement;
      const tcgFalse = document.getElementById('false') as HTMLInputElement;
      if (tcgTrue?.checked) tcgAccountStatus = 'Yes';
      if (tcgFalse?.checked) tcgAccountStatus = 'No';
    }

    const lines = [
      {
        merchandiseId: chosenVariantId!,
        quantity: 1,
        attributes: [
          { key: 'Game', value: p.gameType?.value || '' },
          { key: 'Format', value: p.format?.value || '' },
          {
            key: 'Participant',
            value: formState.participant.charAt(0).toUpperCase() + formState.participant.slice(1),
          },
        ],
      },
    ];

    // Add conditional attributes for main event
    if (formState.participant === 'other' && firstName && lastName) {
      lines[0].attributes.push({ key: 'Player Name', value: playerName });
    }
    if (pokemonId) {
      lines[0].attributes.push({ key: 'Pokémon ID', value: pokemonId });
    }
    if (tcgAccountStatus) {
      lines[0].attributes.push({ key: 'TCG Plus Account', value: tcgAccountStatus });
    }

    // Add upsell items from cart
    cartItems.forEach((item) => {
      if (item.id !== 'event' && item.variantId) {
        lines.push({
          merchandiseId: item.variantId,
          quantity: item.quantity || 1,
          attributes: [],
        });
      }
    });

    return createCartWithLines(lines);
  };

  // Initialize form state and visibility
  setTimeout(() => {
    setupFormListeners();
    updateFieldVisibility();
  }, 0);

  // ---- Form submit → cartCreate ----
  const form = document.querySelector<HTMLFormElement>('[data-role="event-form"]');
  const submitBtn = document.querySelector<HTMLButtonElement>('[data-role="submit"]');
  const errBox = document.querySelector<HTMLElement>('[data-role="error"]');

  // Function to ensure submit button is enabled
  const enableSubmitButton = () => {
    if (submitBtn && submitBtn.disabled) {
      submitBtn.disabled = false;
      console.log('Submit button re-enabled');
    }
  };

  // Ensure submit button is enabled on page load
  enableSubmitButton();

  // Re-enable submit button when user makes any change to the form
  if (form) {
    form.addEventListener('input', enableSubmitButton);
    form.addEventListener('change', enableSubmitButton);
  }

  // Re-enable when page becomes visible again (user returns from another tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      enableSubmitButton();
    }
  });

  // Re-enable on window focus (user returns to the window)
  window.addEventListener('focus', enableSubmitButton);

  const getFormValue = (sel: string) =>
    (document.querySelector<HTMLInputElement>(`[data-role="${sel}"]`)?.value || '').trim();

  // Update the form submission event listener (around line 560):
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear and hide error box initially
    if (errBox) {
      errBox.textContent = '';
      errBox.classList.add('hide');
    }

    // Validate form inputs
    const validation = validateForm();
    if (!validation.valid) {
      if (errBox) {
        errBox.textContent = validation.error || 'Validation error';
        errBox.classList.remove('hide'); // Show error box
      }
      return;
    }

    // Disable submit button during processing
    if (submitBtn) submitBtn.disabled = true;

    try {
      // Create cart with event registration
      const cart = await createEventCart();

      // Redirect to checkout
      const url = cart?.checkoutUrl;
      if (!url) throw new Error('Could not create checkout.');
      window.location.href = url;
    } catch (err) {
      console.error('[events] checkout error', err);
      if (errBox) {
        errBox.textContent = 'Something went wrong. Please try again.';
        errBox.classList.remove('hide'); // Show error box
      }
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
