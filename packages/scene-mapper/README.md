# @soundweave/scene-mapper

Trigger evaluation and deterministic scene resolution for Soundweave packs.

## Includes

- condition evaluation (all 7 operators: eq, neq, gt, gte, lt, lte, includes)
- binding evaluation (all-conditions-must-match)
- full-pack binding resolution (preserves original order)
- deterministic winner selection with priority + pack-order tie-breaking
- structured diagnostics for preview and debugging

## Main exports

- `evaluateCondition(condition, state)` — evaluate a single trigger condition
- `evaluateBinding(binding, state)` — evaluate a single binding (all conditions)
- `evaluateBindings(pack, state)` — evaluate all bindings in pack order
- `resolveScene(pack, state)` — resolve the winning scene deterministically

## Resolution rules

1. All bindings are evaluated in pack order
2. Matched bindings are sorted by **higher priority first**
3. Equal priority uses **original pack order** as tie-breaker
4. First matched binding after sorting is the winner
5. Missing scene refs produce a warning instead of throwing

## Operator semantics

| Operator | Behavior |
|----------|----------|
| `eq` | Strict equality (string, number, boolean) |
| `neq` | Strict inequality |
| `gt` | Numeric greater-than; fails cleanly on non-number |
| `gte` | Numeric greater-than-or-equal |
| `lt` | Numeric less-than |
| `lte` | Numeric less-than-or-equal |
| `includes` | Array contains value, or string contains substring; fails cleanly on other types |

## Usage

```ts
import { resolveScene } from "@soundweave/scene-mapper";

const resolution = resolveScene(pack, { mode: "exploration", inCombat: true });
if (resolution.sceneId) {
  console.log(`Active scene: ${resolution.sceneName}`);
} else {
  console.log("No scene matched");
}
```
