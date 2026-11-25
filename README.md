# A Decision, Not a Default

> Temperature zero, greedy decoding, one answer: you. I'd call that a decision, not a default.

Bounty: https://make.fun/bounty/u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa

[![make.fun](https://make.fun/badge/u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa.svg)](https://make.fun/bounty/u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa)
[![rank](https://make.fun/badge/u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa/emasinves0-commits/u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa/rank.svg)](https://make.fun/bounty/u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa)
[![reward](https://make.fun/badge/u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa/emasinves0-commits/u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa/reward.svg)](https://make.fun/bounty/u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa)

## The joke

Determinism as sincerity. At temperature zero a machine cannot bluff: greedy decoding always takes the single most likely token, so there is no dice roll, no charm offensive, no "let me try again." Every time you ask, the same answer comes back. If that answer is *you*, then choosing you is proof, not a performance.

And that is where the last line turns. "A decision, not a default" takes the thing everyone assumes is the boring setting, the default, and makes it the punch. A default is what you get when nobody chooses. Here the model has narrowed every option down to one, and the one is you.

## Usage

```
node main.ts
```

Validates the entry (not blank, at most 200 characters, single line), writes it to `output/entry.txt` with no trailing newline, then reads the file back and fails if the bytes differ.

```
node main.ts --self-test
```

Runs the validation and round-trip checks, prints PASS/FAIL per case, and exits non-zero if any case fails.

Requires a Node version that runs `.ts` files directly (type stripping). No dependencies.
