# Implementation Plan: Shopping Cart & N8N Chat

## Overview

Two major features to implement:

1. **Shopping Cart** - Full cart functionality for authenticated users
2. **AI Chat Support** - N8N-powered chat for support + product recommendations

**Priority:** Cart first, then chat

---

## Part 1: Shopping Cart

### What We Have
- ✅ Database model (CartItem) already exists
- ✅ Stripe payment fully integrated
- ✅ Checkout API route works
- ✅ Zustand (v5.0.2) already installed

### What We Need to Build

#### 1. State Management
**File:** `/src/stores/cart-store.ts`
- Zustand store for cart state
- Actions: addItem, updateQuantity, removeItem, clearCart
- Auto-sync with localStorage + database

#### 2. API Routes
- `GET /api/cart` - Fetch user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[itemId]` - Update quantity
- `DELETE /api/cart/[itemId]` - Remove item

#### 3. Cart Page
**File:** `/src/app/cart/page.tsx`
- Display all cart items with images
- Quantity controls (+/- buttons)
- Delete icon (trash bin) for each item
- Empty cart state
- Subtotal calculation
- "Proceed to Checkout" button → redirects to Stripe

#### 4. Integration Points
- **ProductDetail:** Implement `handleAddToCart()` function
- **Header:** Add cart badge showing item count

### User Flow
```
Product Page → Add to Cart → Cart Page → Checkout → Stripe Payment → Order Success
```

---

## Part 2: N8N AI Chat

### What We Have
- ✅ N8N instance running (localhost:5678)
- ✅ Webhook pattern established (from video generation)
- ✅ React Toastify for notifications

### What We Need to Build

#### 1. Database Models
Add to `prisma/schema.prisma`:
- `ChatConversation` - User chat sessions
- `ChatMessage` - Individual messages (USER/ASSISTANT)

Run migration: `npx prisma migrate dev --name add_chat_models`

#### 2. N8N Workflow
**File:** `/apps/n8n/workflows/ai-chat-workflow.json`

**Flow:**
```
Webhook Trigger → Fetch User Context → AI Model (OpenAI/Claude) → Save Response → Return
```

**Features:**
- Product catalog context for recommendations
- User purchase history for personalization
- Both support questions and product suggestions

#### 3. API Routes
- `POST /api/chat` - Send message, trigger N8N
- `GET /api/chat` - Fetch conversation messages (for polling)
- `POST /api/chat/messages` - N8N callback to save AI responses

#### 4. Chat UI
**File:** `/src/components/ChatWidget.tsx`

**Features:**
- Floating chat button (bottom-right)
- Collapsible chat window
- Message history
- Polling every 2 seconds for AI responses
- Typing indicator while waiting
- Product recommendation cards (clickable)

**Integration:**
- Chat icon button in Header
- Pre-filled messages from product pages

### User Flow
```
User sends message → API saves & triggers N8N → N8N calls AI → AI response saved to DB → Polling fetches response → Display in chat
```

---

## Implementation Phases

### Phase 1: Shopping Cart (Implement First)
1. Create Zustand cart store
2. Create cart API routes
3. Build cart page UI
4. Update ProductDetail (add to cart button)
5. Update Header (cart badge)
6. Test full flow

**Testing:**
- [ ] Add product to cart
- [ ] Cart persists after refresh
- [ ] Update quantities
- [ ] Remove items
- [ ] Checkout integration works
- [ ] Stripe payment successful

### Phase 2: N8N Chat (Implement Second)
1. Add database models (migration)
2. Create N8N workflow
3. Create chat API routes
4. Build ChatWidget component
5. Integrate into Header
6. Test full flow

**Testing:**
- [ ] Send message to chat
- [ ] AI response appears
- [ ] Product recommendations work
- [ ] Chat history persists
- [ ] Polling works correctly

---

## Files to Create

### Shopping Cart
- `/src/stores/cart-store.ts`
- `/src/app/cart/page.tsx`
- `/src/app/api/cart/route.ts`
- `/src/app/api/cart/[itemId]/route.ts`
- `/src/components/CartItemCard.tsx`
- `/src/components/CartSummary.tsx`
- `/src/components/EmptyCart.tsx`

### N8N Chat
- `/src/components/ChatWidget.tsx`
- `/src/app/api/chat/route.ts`
- `/src/app/api/chat/messages/route.ts`
- `/apps/n8n/workflows/ai-chat-workflow.json`

## Files to Modify

### Shopping Cart
- `/src/components/Header.tsx` (cart badge)
- `/src/components/ProductDetail.tsx` (implement handleAddToCart)

### N8N Chat
- `/src/components/Header.tsx` (chat button)
- `/prisma/schema.prisma` (add chat models)

---

## Key Technical Decisions

### Cart
- **State:** Zustand (simple, lightweight, already installed)
- **Storage:** Hybrid (localStorage + database for persistence)
- **Updates:** Optimistic (instant UI feedback)
- **Auth:** Authenticated users only (no guest cart)

### Chat
- **Communication:** Webhook + Polling (simple, reliable)
- **Polling Interval:** 2-3 seconds
- **AI:** OpenAI or Claude (via N8N)
- **Context:** Product catalog + user history + chat history

---

## Environment Variables

Add to `.env`:
```
N8N_CHAT_WEBHOOK_URL=http://n8n:5678/webhook/ai-chat
```

Add to `docker-compose.yml` (n8n service):
```yaml
- OPENAI_API_KEY=${OPENAI_API_KEY}
- DATABASE_URL=${DATABASE_URL}
- WEB_API_URL=http://web:3000
```

---

## Success Criteria

### Shopping Cart ✅
- Users can add products to cart
- Cart badge shows item count
- Cart page displays all items correctly
- Users can modify quantities or remove items
- Cart persists across sessions
- Checkout integration works
- Stripe payment successful

### N8N Chat ✅
- Chat widget accessible from all pages
- Users can send messages
- AI provides helpful responses
- Product recommendations are clickable
- Chat history persists
- Supports both support questions and recommendations

---

## Notes

**Stripe Payment:** Already integrated and working. Cart will use existing checkout flow.

**N8N Patterns:** Our approach aligns with standard n8n webhook patterns used by the community.

**UI/UX:**
- Cart uses trash bin icon (not "Remove" text)
- Chat uses polling (not WebSocket) for simplicity
- All errors show toast notifications
- Optimistic updates for better UX

**Performance:**
- Cart store optimized with shallow equality
- Chat polling only active when chat is open
- Product images lazy-loaded in recommendations
