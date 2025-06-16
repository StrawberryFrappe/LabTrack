# LabTrack Frontend - TODO Implementation Plan
## Target: TRL3 (Experimental Proof of Concept) - 3 User System

## ✅ Recently Completed

### **Compound View Toggle (Cards/Table)**
- [x] Created CompoundTable.vue component with responsive table layout
- [x] Added view mode toggle in CompoundList.vue (grid/list views)
- [x] Implemented responsive design with mobile-friendly column hiding
- [x] Added accessibility improvements (ARIA labels, better focus states)
- [x] Enhanced visual feedback for view toggle buttons
- [x] Maintained consistent event handling between views

## 🚨 Critical Missing Functionality

### 1. **Basic Authentication & User Management**
- [ ] Simple login/logout system
- [ ] Two-role system: Admin (write) and Visitor (read-only)
- [ ] Basic session management
- [ ] Simple user profile display in header

### 2. **API Integration & Data Management**
- [ ] Replace all mock data with real API calls
- [ ] Implement HTTP client (Axios) with basic error handling
- [ ] Add loading states throughout app
- [ ] Basic error handling and user feedback

### 3. **Spreadsheet Import/Export**
- [ ] CSV/Excel import for compounds
- [ ] CSV/Excel export for compounds and inventory data
- [ ] Basic data validation during import
- [ ] Export templates for easy data entry

## 📋 Core Feature Implementation

### Compound Management (Admin Only)
- [ ] Add compound form/modal with basic validation
- [ ] Edit compound functionality
- [ ] Delete compound with confirmation
- [ ] Basic search and filtering (existing filters work well)

### Inventory Count System
- [ ] Complete count session workflow
- [ ] Manual count entry (no barcode scanning needed for TRL3)
- [ ] Basic discrepancy reporting
- [ ] Simple count session reports

### Dashboard & Reporting
- [ ] Current dashboard stats (working with real data)
- [ ] Basic inventory reports (current stock, low stock, expiring)
- [ ] Simple count session summaries

## 🎨 Essential UI/UX Improvements

### Components & Layout
- [ ] Basic loading states for forms and data loading
- [ ] Simple notification/toast system for user feedback
- [ ] Confirmation dialogs for delete operations
- [ ] Basic modal/dialog system for forms

### Form Validation
- [ ] Client-side form validation for compound data
- [ ] Required field validation
- [ ] Data format validation (numbers, dates, etc.)

## 🔧 Technical Requirements

### Core Functionality
- [ ] CRUD operations for compounds
- [ ] Inventory count session management
- [ ] Basic error handling and user feedback
- [ ] Data persistence through backend API

### Quality & Reliability
- [ ] Input validation and sanitization
- [ ] Basic error logging
- [ ] Simple backup/restore via export/import

## 📊 Basic Reporting

### Essential Reports
- [ ] Current inventory status
- [ ] Low stock items report
- [ ] Expiring items report
- [ ] Count session summary reports
- [ ] Basic CSV export for all data

## ❌ REMOVED/DEFERRED FEATURES

### Not Needed for TRL3 (3-user system):
- ~~Role-based access control beyond Admin/Visitor~~
- ~~User registration system~~
- ~~Password reset functionality~~
- ~~Real-time collaboration~~
- ~~Advanced analytics and forecasting~~
- ~~Mobile PWA features~~
- ~~Barcode scanning (manual entry sufficient)~~
- ~~Integration with external systems~~
- ~~Advanced security features~~
- ~~Internationalization (single language sufficient)~~
- ~~Dark mode/theming~~
- ~~Performance optimization for large datasets~~
- ~~Advanced caching strategies~~
- ~~Service workers/offline support~~
- ~~Push notifications~~
- ~~Email notifications~~
- ~~Compliance and audit features~~
- ~~SDS management~~
- ~~Temperature monitoring~~
- ~~Supplier management~~
- ~~Purchase order tracking~~
- ~~Advanced location mapping~~

### Simplified/Reduced Scope:
- Authentication: Simple 2-role system instead of complex RBAC
- Reporting: Basic exports instead of advanced analytics
- UI: Functional interface instead of highly polished UX
- Search: Basic filtering instead of advanced search
- Import/Export: CSV/Excel only instead of multiple formats
- Error Handling: Basic user feedback instead of comprehensive logging

---

## 📝 Realistic Implementation Priority (TRL3)

### Phase 1 (Essential - 2-3 weeks)
1. Basic API integration for compounds CRUD
2. Simple authentication (admin/visitor roles)
3. Compound add/edit/delete forms
4. Basic error handling and loading states

### Phase 2 (Core Features - 2-3 weeks)
1. Inventory count workflow completion
2. CSV/Excel import/export functionality
3. Basic reporting and data export
4. Form validation and user feedback

### Phase 3 (Polish - 1-2 weeks)
1. UI polish and consistent styling
2. Confirmation dialogs and notifications
3. Basic documentation and user guide
4. Testing and bug fixes

**Total Estimated Timeline: 5-8 weeks for TRL3 completion**

---

## 🎯 Success Criteria for TRL3

- [ ] 3 users can log in with appropriate permissions
- [ ] Admin can manage compound inventory (add/edit/delete)
- [ ] Visitor can view inventory with read-only access
- [ ] Users can conduct manual inventory counts
- [ ] Data can be imported from and exported to spreadsheets
- [ ] Basic reports show current inventory status
- [ ] System works reliably for small dataset (100-500 compounds)
- [ ] Clean, functional interface that replaces spreadsheet workflow

**Note**: This simplified scope focuses on creating a functional "glorified spreadsheet" that demonstrates the core concept and provides immediate value to the 3-user laboratory team, serving as a proof of concept for potential future development.
