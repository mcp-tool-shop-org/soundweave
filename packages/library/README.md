# @soundweave/library

Templates, snapshots, branches, favorites, collections, and entity comparison for Soundweave.

## What It Owns

- Template creation, instantiation, filtering, and search
- Snapshot creation, restoration, and querying
- Branch creation, instantiation, and lineage tracing
- Favorite management and entity bookmarking
- Collection CRUD and resolution
- Entity comparison and diffing

## Key Exports

### Templates (`templates.ts`)
- `createTemplate(id, name, kind, data, options?)` — create a reusable template
- `instantiateTemplate(template, newId)` — produce new entity data from template
- `templatesOfKind` / `searchTemplates` / `templatesByTag`

### Snapshots (`snapshots.ts`)
- `takeSnapshot(id, label, entityId, entityKind, data, notes?)` — freeze entity state
- `restoreSnapshot(snapshot)` — recover entity data
- `snapshotsForEntity` / `snapshotsOfKind` / `latestSnapshot` / `snapshotCounts`

### Branches (`branches.ts`)
- `createBranch(id, name, sourceSnapshot, newEntityId, notes?)` — branch from snapshot
- `instantiateBranch(snapshot, branch)` — produce new entity data from branch
- `branchesFromSnapshot` / `branchesOfKind` / `traceLineage` / `descendantBranches`

### Favorites (`favorites.ts`)
- `createFavorite(id, entityId, entityKind, notes?)` — bookmark an entity
- `isFavorited(favorites, entityId)` — check if bookmarked
- `favoritesOfKind` — filter by entity kind
- `createCollection` / `addToCollection` / `removeFromCollection` / `resolveCollection` / `searchCollections`

### Compare (`compare.ts`)
- `compareEntities(a, b, entityKind, labelA, labelB)` — field-by-field diff
- `areEqual(a, b)` — structural equality check
- `diffCount(a, b)` — number of differing fields
- `promoteVersion(a, b, choice)` — pick a winner

## What It Does Not Own

- Entity persistence or storage
- UI components
- Playback or rendering

## Dependencies

- `@soundweave/schema` — types for templates, snapshots, branches, favorites, collections
