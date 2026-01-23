---
name: vercel-react-best-practices
description: Apply React and Next.js performance optimization patterns from Vercel Engineering. Use when writing, reviewing, or refactoring React components, Next.js pages, data fetching logic, or optimizing bundle size and load times. Triggers on performance reviews, component architecture decisions, and Next.js API routes.
---

# Vercel React Best Practices

Performance optimization guide for React and Next.js applications containing 45 rules across 8 categories, prioritized by impact.

## When to Apply

Use these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring React/Next.js code
- Optimizing bundle size or load times

## Rule Categories by Priority

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Eliminating Waterfalls | CRITICAL |
| 2 | Bundle Size Optimization | CRITICAL |
| 3 | Server-Side Performance | HIGH |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH |
| 5 | Re-render Optimization | MEDIUM |
| 6 | Rendering Performance | MEDIUM |
| 7 | JavaScript Performance | LOW-MEDIUM |
| 8 | Advanced Patterns | LOW |

## Critical Rules Summary

### Eliminating Waterfalls

1. **Defer await until needed** - Move `await` into branches where actually used
2. **Promise.all for independent ops** - Execute concurrent operations in parallel
3. **Suspense boundaries** - Use Suspense to stream content, show wrapper UI faster

### Bundle Size Optimization

1. **Avoid barrel imports** - Import directly from source files
   ```tsx
   // Bad: imports entire library
   import { Check } from 'lucide-react'
   
   // Good: imports only what you need
   import Check from 'lucide-react/dist/esm/icons/check'
   ```

2. **Dynamic imports for heavy components** - Use `next/dynamic` for large components
   ```tsx
   const MonacoEditor = dynamic(
     () => import('./monaco-editor').then(m => m.MonacoEditor),
     { ssr: false }
   )
   ```

3. **Defer non-critical libraries** - Load analytics/logging after hydration

### Server-Side Performance

1. **Authenticate Server Actions** - Always verify auth inside each Server Action
2. **Minimize RSC serialization** - Only pass fields the client actually uses
3. **React.cache()** - Deduplicate within a request
4. **LRU cache** - Deduplicate across requests
5. **after()** - Schedule non-blocking operations after response

### Re-render Optimization

1. **Functional setState** - Use `setItems(curr => [...curr, newItem])` for stable callbacks
2. **Lazy state initialization** - `useState(() => expensiveComputation())`
3. **Narrow effect dependencies** - Use primitives, not objects
4. **startTransition** - Mark non-urgent updates as transitions

### Rendering Performance

1. **content-visibility: auto** - Defer off-screen rendering for long lists
2. **Hoist static JSX** - Extract static elements outside components
3. **Animate SVG wrappers** - Wrap SVG in div for hardware acceleration

### JavaScript Performance

1. **Set/Map for lookups** - O(1) instead of O(n) with array.includes()
2. **toSorted() over sort()** - Immutable sorting prevents React bugs
3. **Early length check** - Compare array lengths before expensive operations
4. **Cache repeated calls** - Module-level Map for expensive function results

## Detailed Reference

For complete explanations and code examples, read the full compiled document: [AGENTS.md](./AGENTS.md)

### Individual Rule Files

Each rule has a dedicated file in the `rules/` directory:

**Critical (Waterfalls & Bundle)**
- `async-parallel.md` - Promise.all() for independent operations
- `async-defer-await.md` - Defer await until needed
- `async-suspense-boundaries.md` - Strategic Suspense placement
- `bundle-barrel-imports.md` - Avoid barrel file imports
- `bundle-dynamic-imports.md` - Dynamic imports for heavy components

**High (Server)**
- `server-auth-actions.md` - Authenticate Server Actions
- `server-serialization.md` - Minimize RSC serialization
- `server-cache-react.md` - React.cache() deduplication
- `server-cache-lru.md` - Cross-request LRU caching
- `server-after-nonblocking.md` - Non-blocking operations

**Medium (Re-renders & Rendering)**
- `rerender-functional-setstate.md` - Functional setState updates
- `rerender-lazy-state-init.md` - Lazy state initialization
- `rerender-memo.md` - Extract to memoized components
- `rendering-content-visibility.md` - CSS content-visibility
- `rendering-hoist-jsx.md` - Hoist static JSX

**Low-Medium (JavaScript)**
- `js-set-map-lookups.md` - Set/Map for O(1) lookups
- `js-tosorted-immutable.md` - Immutable sorting
- `js-cache-function-results.md` - Cache expensive function results

## Quick Checklist

Before submitting React/Next.js code, verify:

- [ ] No sequential awaits that could be parallelized
- [ ] Heavy components use dynamic imports
- [ ] Server Actions have authentication checks
- [ ] RSC props only include needed fields
- [ ] No barrel file imports from large libraries
- [ ] State updates use functional form when based on previous state
- [ ] Effects have minimal, primitive dependencies
- [ ] Long lists use content-visibility or virtualization
