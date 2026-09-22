import { MenuItem, CustomPage } from '../types';

export interface FlatMenuOption {
  id: string;
  title: string;
  depth: number;
  path: string;
  url: string;
}

/**
 * Recursively flattens the menu tree for select dropdowns,
 * including depth level and breadcrumb path.
 */
export function flattenMenuTree(
  items: MenuItem[],
  depth: number = 0,
  parentPath: string = ''
): FlatMenuOption[] {
  const result: FlatMenuOption[] = [];

  for (const item of items) {
    const currentPath = parentPath ? `${parentPath} > ${item.title}` : item.title;
    result.push({
      id: item.id,
      title: item.title,
      depth,
      path: currentPath,
      url: item.url
    });

    if (item.children && item.children.length > 0) {
      result.push(...flattenMenuTree(item.children, depth + 1, currentPath));
    }
  }

  return result;
}

/**
 * Recursively find an item in the menu tree.
 */
export function findInMenuTree(items: MenuItem[], id: string): MenuItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children && item.children.length > 0) {
      const found = findInMenuTree(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Recursively removes an item by ID from the menu tree.
 */
export function removeFromMenuTree(items: MenuItem[], id: string): MenuItem[] {
  return items
    .filter(item => item.id !== id)
    .map(item => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: removeFromMenuTree(item.children, id)
        };
      }
      return item;
    });
}

/**
 * Inserts or updates an item in the tree at targetParentId.
 * If targetParentId is null or not found, adds to root.
 */
export function insertOrUpdateInMenuTree(
  items: MenuItem[],
  newItem: MenuItem,
  targetParentId?: string | null
): MenuItem[] {
  // First, remove existing item if already in tree
  const cleaned = removeFromMenuTree(items, newItem.id);

  if (!targetParentId) {
    // Add to root
    return [...cleaned, { ...newItem, parentId: null }];
  }

  // Helper to recursively attach to target parent
  let inserted = false;
  const attachRecursive = (list: MenuItem[]): MenuItem[] => {
    return list.map(item => {
      if (item.id === targetParentId) {
        inserted = true;
        const currentChildren = item.children || [];
        return {
          ...item,
          children: [...currentChildren, { ...newItem, parentId: targetParentId }]
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: attachRecursive(item.children)
        };
      }
      return item;
    });
  };

  const updated = attachRecursive(cleaned);
  if (!inserted) {
    // If target parent not found, fall back to root
    return [...cleaned, { ...newItem, parentId: null }];
  }
  return updated;
}

/**
 * Syncs a CustomPage to the menu tree.
 * If page has parentMenuId, it is linked under that menu item.
 * Otherwise, removes any stale auto-generated menu link.
 */
export function syncPageToMenuTree(items: MenuItem[], page: CustomPage): MenuItem[] {
  const pageMenuId = `menu-page-${page.id}`;
  const pageUrl = `/sayfa/${page.slug}`;

  // 1. Remove any old link for this page anywhere in the tree
  const cleaned = items
    .filter(item => item.id !== pageMenuId && item.url !== pageUrl)
    .map(function cleanChild(item): MenuItem {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: item.children
            .filter(c => c.id !== pageMenuId && c.url !== pageUrl)
            .map(cleanChild)
        };
      }
      return item;
    });

  if (!page.parentMenuId) {
    return cleaned;
  }

  // 2. Attach page to the selected parent menu item
  const pageMenuItem: MenuItem = {
    id: pageMenuId,
    title: page.title,
    url: pageUrl,
    type: 'page',
    target: '_self',
    isActive: page.isPublished,
    order: 99,
    parentId: page.parentMenuId
  };

  let attached = false;
  const attachToParent = (list: MenuItem[]): MenuItem[] => {
    return list.map(item => {
      if (item.id === page.parentMenuId) {
        attached = true;
        const existingChildren = item.children || [];
        return {
          ...item,
          children: [...existingChildren, pageMenuItem]
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: attachToParent(item.children)
        };
      }
      return item;
    });
  };

  const finalTree = attachToParent(cleaned);
  return finalTree;
}

/**
 * Reconstructs a full recursive menu tree from an array of menu items that might
 * be partially or fully flat, or have orphan parentId pointers.
 * Ensures all children are correctly nested under their respective parents.
 */
export function normalizeMenuTree(items: MenuItem[]): MenuItem[] {
  if (!Array.isArray(items) || items.length === 0) return [];

  // 1. Flatten the entire tree first so we have all items in a single collection
  const allItemsMap = new Map<string, MenuItem>();

  function collect(list: MenuItem[]) {
    for (const item of list) {
      if (!allItemsMap.has(item.id)) {
        // Clone item with fresh children array
        allItemsMap.set(item.id, {
          ...item,
          children: item.children ? [...item.children] : []
        });
      }
      if (item.children && item.children.length > 0) {
        collect(item.children);
      }
    }
  }

  collect(items);

  // 2. Build map of items with empty children arrays
  const cleanMap = new Map<string, MenuItem>();
  for (const [id, item] of allItemsMap.entries()) {
    cleanMap.set(id, {
      ...item,
      children: []
    });
  }

  const rootItems: MenuItem[] = [];

  // 3. Place each item either in root or under its parent
  for (const item of cleanMap.values()) {
    if (item.parentId && cleanMap.has(item.parentId) && item.parentId !== item.id) {
      const parent = cleanMap.get(item.parentId)!;
      parent.children = parent.children || [];
      if (!parent.children.some(c => c.id === item.id)) {
        parent.children.push(item);
      }
    } else {
      rootItems.push(item);
    }
  }

  // 4. Sort all levels recursively by order
  function sortLevel(list: MenuItem[]): MenuItem[] {
    return list
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(node => ({
        ...node,
        children: node.children && node.children.length > 0 ? sortLevel(node.children) : []
      }));
  }

  return sortLevel(rootItems);
}

