# Business scope, rules and test specifications

Use this method when clarifying or reviewing business content in the selected permitted scope. It does not grant product writes, new actions, task transitions, approval or execution. The public helper limitations in SKILL.md still apply. A separately authorized authoring exercise is not helper-driven product execution.

## Scope and a useful slice

Read the established Feature Map, relevant decisions and actual source documents, not only their labels/hashes. For an existing product distinguish observed implementation from desired behavior; do not redefine requirements to fit code. Keep the original Human request or its source reference separate from interpretation.

Establish who uses the product, the result they need, included/excluded behavior, public/private data, permissions and material platform/operational constraints. Keep MVP/Future/Idea as Human-selected categories; uncertainty is not selection. Ask whether A/B is relevant, but do not add experiments by default or specify Future deeply. Batch all currently identifiable material decisions, execution permissions and verification limits in one understandable package with short examples. After approval perform the covered work continuously; ask again only for a genuinely new decision, conflict, permission or limit. Approval of a plan is not approval of its unseen outputs.

Find shared responsibilities from actual callers, owned state, invariants and input/output contracts; matching names alone do not justify merging. Prefer keeping single-use behavior in its Feature unless a state invariant genuinely crosses boundaries. Propose a small user-result slice with the shared dependencies needed to describe it correctly, including downstream change obligations. Human approval of the boundaries/slice may be batched with scope when ready; it does not approve unwritten rules. Do not wait for every future shared area to be specified before an independent slice.

Use the project's existing source layout. An index holds IDs/descriptions/links, not a second current-task/approval tracker. Product rules remain in product documents; supported review/context records retain workflow evidence. Do not impose a directory/file for every rule or invent a new schema.

## Make behavior decidable

For new content describe actor/trigger/purpose, input and output meanings and valid domains, units/precision/null/absent handling when relevant. Describe condition → observable result and changed/unchanged state, invalid cases and invariants. Stateful behavior needs a before/event/condition/after table and a responsible authority. Stateless behavior does not need artificial state.

Read reused contracts fully and link the exact section rather than copying a second rule. A flow table is the source for branches, results and next step/end, linking rules without restating them. A diagram, if useful, is derived from that table. If combined invalid conditions affect the observable result, establish precedence instead of inventing it; do not universalize one flow's first-error order.

Where the domain includes retries, concurrency or asynchronous changes, distinguish a historical outcome from current state, an unknown result from final rejection, and observed derived data from mutation authority. Specify admissible state outcomes and recovery obligations without prematurely choosing locks, brokers or storage. Missing controlling facts remain OPEN and block only the dependent conclusions; do not supply an expected result without a basis.

AC are observable acceptance conditions, not implementation tasks. Each business-test case has an ID, exact rule/AC link, initial state, input/event or sequence, expected result/final state and relevant invariant. These are specifications until actually executed against a product. Test counts, a valid link or a successful helper write do not establish semantic completeness.

## Coverage and change impact

Enumerate obligations first: finite result branches/transitions, domain boundaries, permissions, invariants and real shared contracts. List finite variants explicitly where tractable. Add sequences, retry, concurrent orderings and interruption cases where outcomes differ. Explain excluded impossible combinations and the risk rationale for other sampling; do not assume three examples or pairwise coverage proves a whole Feature.

Every expected result must follow from the approved sources. Report missing coverage and distinguish specification review, deterministic checks, independent AI behavior and actual product tests. Preserve failures/partial results and bind any test claim to the bytes and environment actually tested.

Keep forward links and reverse references to exact sections with their purpose. On a rule change, search the scoped sources for ID/links to catch missing backlinks, read affected callers and contracts, and record changed/not affected with reasons. Propagate only observable semantic impact, using a visited set to avoid loops. Update affected rule/flow/diagram/AC/test/index together under the grant; reconcile review evidence through supported procedures, never silently preserve approval of changed meaning.

Present a content package only when required dependencies are grounded, relevant OPEN items resolved and coverage honestly stated. Human accepts concrete outputs; a child package never automatically closes the parent step or authorizes deployment.
