# LabTrack Frontend Cleanup Todo

## Phase 1: Understand What You Have (1-2 days)
- [ ] Map out which composables depend on each other (draw it out)
- [ ] List all the singleton patterns (`isInitialized`, shared state)
- [ ] Find all localStorage usage across composables
- [ ] Document what each composable actually manages (one sentence each)

## Phase 2: Decouple the Tangled Bits (3-4 days)
- [ ] Move all shared state from composables to Pinia stores
  - [ ] compounds store (compounds array, filters)
  - [ ] instances store (instances array, locations)
  - [ ] transactions store (transaction history)
  - [ ] ui store (modals, toasts, loading states)
- [ ] Replace direct composable imports with store usage
- [ ] Remove circular dependencies between useCompounds and useCompoundInstances

## Phase 3: Clean Up API Layer (2-3 days)
- [ ] Audit all service files - what endpoints do they expect?
- [ ] Create a single API config file for base URLs and headers
- [ ] Add proper error handling that doesn't assume JSON Server responses
- [ ] Mock the expected backend API structure (even if just comments)

## Phase 4: Simplify the Giants (3-4 days)
- [ ] Break up useValidation.js:
  - [ ] Extract validation rules to config file
  - [ ] Separate field validation from form validation
  - [ ] Move async validators to their own module
- [ ] Split useInventory.js:
  - [ ] Transaction recording logic
  - [ ] Stock calculations
  - [ ] Transaction history management
- [ ] Refactor useAdvancedSearch.js:
  - [ ] Extract search operators to config
  - [ ] Separate filter logic from UI state

## Phase 5: Prepare for Backend (2-3 days)
- [ ] Create environment variables for API endpoints
- [ ] Add request/response interceptors for auth tokens
- [ ] Build a feature flag system for gradual backend migration
- [ ] Set up proper error boundaries for when API calls fail
- [ ] Create fallback UI states for offline/error scenarios

## Phase 6: Testing & Documentation (ongoing)
- [ ] Write a simple test for each major composable function
- [ ] Document expected API request/response formats
- [ ] Create a migration guide for switching services
- [ ] Test with mock backend responses

## Quick Wins (can do anytime)
- [ ] Remove unused imports and dead code
- [ ] Consolidate duplicate logic (multiple loading states, error handlers)
- [ ] Fix the "kitchen sink" imports - only import what you need
- [ ] Add JSDoc comments to complex functions

## Backend Integration Checklist
When the backend arrives, you should be able to:
- [ ] Change API endpoints in one config file
- [ ] Update service methods without touching composables
- [ ] Handle different response formats with minimal changes
- [ ] Toggle between mock and real data with feature flags
- [ ] Roll back if something breaks

## Red Flags to Fix Now
- [ ] Hardcoded API responses in composables
- [ ] Business logic mixed with API calls
- [ ] State that lives in multiple places
- [ ] Composables that know too much about each other