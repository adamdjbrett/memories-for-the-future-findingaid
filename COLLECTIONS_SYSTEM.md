# Dynamic Collections System Documentation

## Overview

The partials system has been completely simplified. You can now add new 11ty collections by simply creating a new folder in `/content` - **no manual partial file creation needed**.

## Summary

- Create a folder in `/content` and add items; the collection sidebar and listings update automatically.
- Collection item pages use `collection-post.njk` and show a dynamic sidebar with the current collection expanded.
- Collection landing pages use `collection-index.njk` to list all items for that collection.
- Sidebar metadata is generated from `_data/collectionsData.js` (titles, keys, related collections).

## How It Works

### 1. Add a New Collection
Create a new folder in `/content` with your collection name (e.g., `/content/mycollection`). That's it! Everything else is automatic.

Example:
```bash
mkdir /content/mycollection
# Add files to /content/mycollection/
```

### 2. Dynamic Metadata Generation
The system automatically discovers all collection folders and generates sidebar metadata on build.

- **File**: `_data/collectionsData.js`
- **Purpose**: Reads `/content` directory and generates sidebar metadata for each collection
- **Features**:
  - Auto-generates display titles from folder names
  - Auto-assigns keyboard shortcut keys
  - Creates related collection lists
  - No manual configuration needed

**Note**: Named `collectionsData.js` (not `collections.js`) to avoid conflict with Eleventy's reserved `collections` property.

### 3. Simplified Sidebar System

#### For Collection Pages (e.g., `/content/mycollection/myfile.md`)
The `collection-post.njk` layout automatically renders a sidebar showing:
- Home (collapsed)
- Current collection (expanded with active page highlighting)
- Related collections (next 2 in sorted order)

**How it works**:
1. Content in a collection folder automatically uses `collection-post.njk` layout (via `content.11tydata.js`)
2. The layout extracts the collection name from the file path
3. `sidebar-collections.njk` renders based on that collection name
4. All data comes from the dynamically generated `collectionsData.js`

#### For Homepage (`/content/home/`)
The home/collections.njk renders all collections dynamically by iterating through the generated collection metadata.

## Files Changed

### New Files
- `_data/collectionsData.js` - Dynamic collection metadata generator
- `_includes/collection-post.njk` - Universal collection post template
- `_includes/collection-index.njk` - Collection landing page template
- `_includes/partials/sidebar-collections.njk` - Dynamic sidebar partial
- `_includes/partials/article_print.njk` - Universal print template
- `_includes/partials/home/post.njk` - Home collection post template
- `_includes/partials/home/article_print.njk` - Home collection print template

### Updated Files
- `_data/metadata.yaml` - Removed hardcoded collection sidebar configs
- `content/content.11tydata.js` - Automatic layout assignment for collection files
- `_includes/partials/home/collections.njk` - Now uses dynamic collection iteration via collectionsData
- All `content/*/\*.11tydata.js` - Updated to use universal `collection-post.njk` layout
- Collection landing pages (e.g., `content/emrip.md`, `content/general.md`) now use `collection-index.njk`

### Deleted Files (180+ collection-specific partial files)
All these are NO LONGER NEEDED:
- `_includes/partials/*/post.njk` (all collections)
- `_includes/partials/*/article_print.njk` (all collections)
- `_includes/partials/*/collections_*.njk` (all collections)

## Configuration

### Customizing Collection Titles & Keys
Edit `_data/collectionsData.js`:

```javascript
const keyMap = {
  'mycollection': 'x',  // Add custom key
  'another': 'y'
};
```

### Customizing Collection Display
If a collection needs a custom title or key, add it to the `keyMap` in `collectionsData.js`.

## How to Add a New Collection

### Step 1: Create the folder
```bash
mkdir /content/mynewcollection
# Create /content/mynewcollection/11tydata.js (optional, for collection config)
```

### Step 2 (Optional): Customize in collectionsData.js
```javascript
// _data/collectionsData.js
const keyMap = {
  'mynewcollection': 'x',  // Custom keyboard shortcut
  // ... rest
};
```

### Step 3: Add content
```bash
# Create markdown files in /content/mynewcollection/
echo "---
title: My First Item
---
Content here" > /content/mynewcollection/item1.md
```

**That's it!** The sidebar will automatically appear on:
- Individual item pages (from `collection-post.njk`)
- Homepage (from dynamically generated home/collections.njk)

## Benefits

✅ **No Manual Partial Files** - No more creating post.njk, collections_*.njk for each collection
✅ **Scalable** - Add unlimited collections without touching templates
✅ **Maintainable** - Single source of truth for sidebar navigation
✅ **Consistent** - All collections use the same standard template
✅ **Dynamic** - Homepage automatically lists all collections
✅ **Customizable** - Easy to adjust keys/titles in collections.js

## Technical Details

### Collection Discovery
- Location: `_data/collectionsData.js`
- Excludes: `feed`, `home`, `pages` (special folders)
- Includes: All other folders in `/content`

### Layout Assignment
- Location: `content/content.11tydata.js`
- Logic: Files in collection folders get `collection-post.njk`
- Files in `home` or `pages` use default layout

### Related Collections
Each collection shows the next 2 related collections in alphabetical order on its sidebar.

## Example: Adding "my-research"

1. Create folder:
   ```bash
   mkdir /content/my-research
   ```

2. Add files:
   ```bash
   echo "---\ntitle: Research 1\n---\nContent" > /content/my-research/item1.md
   ```

3. **DONE!** The sidebar automatically appears with:
   - Home (collapsed)
   - My Research (expanded, current collection)
   - Next 2 alphabetical collections

## Chat

Q: How do I add a new collection landing page?  
A: Create `/content/<collection>.md` with `layout: "collection-index.njk"` and `eleventyExcludeFromCollections: true`.

Q: Why don’t I see items under a collection in the sidebar?  
A: Confirm the collection tag matches the folder name or `collectionsData.js` mapping and that the page uses `collection-post.njk`.
