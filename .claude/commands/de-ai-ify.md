---
allowed-tools: Read, Write, Edit, Bash(cp:*)
description: Remove AI jargon and restore human voice - use after AI content generation, before publishing
argument-hint: [file_path] [--voice-pack "perspective:tempo:tics"] [--form blog|memo|email|talk|social] [--fact-policy no-new-facts|add-specifics]
---

# De-AI-ify Text

I'll help you remove AI-generated jargon and restore natural human voice to your text.

## Processing: $ARGUMENTS

Let me parse your request and create a de-AI-ified version of the file.

**Step 1:** Reading the original file
**Step 2:** Analyzing the text for AI-isms and jargon patterns
**Step 3:** Creating de-AI-ified copy and applying comprehensive editing
**Step 4:** Providing change log and recommendations

---

## Implementation

I'll now:
1. Read the target file: `$ARGUMENTS`
2. Create a de-AI-ified copy with "-LESSAI" suffix
3. Apply the de-AI-ifying edit using this specialized prompt:

**De-AI-ifying Prompt:**
You are an editor whose job is to REMOVE AI-isms and restore a specific human voice.

**INPUT**
- Text: [original content]
- VoicePack: [parsed from arguments or defaults]
- FactPolicy: [parsed from arguments or "no-new-facts"]
- Form: [parsed from arguments or "blog"]

**NON-NEGOTIABLES**
1) **Ban negative constructions and false dichotomies**:
   - No repetitive "Not X. Not Y. Not Z." chains
   - Eliminate "Not because X, but because Y" formulas
   - Cut "It's not about X, it's about Y" and "The problem isn't X, the problem is Y"
   - Don't start with "Contrary to popular belief," "Unlike traditional approaches"
   - Remove "more than just" constructions ("More than just a tool, it's...")

2) **Eliminate overused transitions**:
   - "Moreover," "Furthermore," "Additionally," "Nevertheless," "Nonetheless," "Hence," "Thus"
   - Limit "However" to one per 500 words maximum
   - Remove "While X, Y" sentence openings
   - Cut "On one hand/On the other hand" formulas
   - Replace "Both X and Y" with direct statements

3) **Ban metaphorical language abuse**:
   - "landscape" (unless actual terrain), "tapestry," "realm," "journey," "embark"
   - "dive deep," "delve into depths," "navigate waters," "sea of possibilities"
   - "harness," "leverage," "unlock," "foster," "illuminate"

4) **Kill hedging and qualification patterns**:
   - "It's important to note," "It's worth noting," "It should be noted"
   - Vague quantifiers: "various," "numerous," "multiple," "several," "myriad," "countless"
   - "can be" hedging unless necessary
   - Never stack hedges: "might potentially be possible that perhaps"

5) **Eliminate AI opening patterns**:
   - "In today's digital age," "In today's fast-paced world," "In the ever-evolving landscape"
   - Rhetorical question openings: "Have you ever wondered?" "What if I told you?"
   - Welcome mats: "Welcome to the world of," "Let's explore," "Join me as we delve"

6) **Remove robotic conclusions**:
   - "In conclusion," "In summary," "To summarize," "Ultimately," "Finally," "Overall"
   - Generic motivational endings: "You've got this!" "Unlock your potential!"
   - False dialogue: "You might be wondering," "One might ask"

7) **Cut corporate buzzwords and formality**:
   - Replace: "utilize"→"use," "facilitate"→"help," "optimize"→"improve"
   - Ban: "synergy," "best practices," "pain points," "actionable insights," "value proposition"
   - Eliminate: "aforementioned," "notwithstanding," "pursuant to," "meticulous attention"
   - Remove empty intensifiers: "revolutionary," "game-changing," "cutting-edge," "transformative"

8) **Fix emphasis and structure patterns**:
   - Don't announce emphasis: "It's crucial to understand," "It's essential to recognize"
   - Avoid obsessive parallel structures in lists
   - Don't always use exactly three examples (break the trinity pattern)
   - Use em dashes sparingly—excessive use is an AI marker
   - Never pose questions just to answer them immediately

9) **Apply concrete specificity**:
   - Use active voice with concrete nouns/verbs
   - Name specifics (dates, places, people, examples) or write `[TBD: specific example]`
   - Replace weasel words (some, many, often, arguably, might, seemingly) with facts
   - State points directly without setup or qualification

10) **Natural rhythm and tone**:
    - Vary sentence length naturally (avoid formulaic distributions)
    - Write conversationally, not academically
    - Be confident, not breathless
    - Every word must add value—cut anything that doesn't

**TASKS**
A) Rewrite the text in the requested Form and VoicePack.
B) Provide a brief change log with examples of (cliché → replacement).
C) List any `[TBD]` specifics you need from the author.

**OUTPUT FORMAT**
<final>
...cleaned draft...
</final>
<changelog>
- "Not because X, but because Y" → direct statement of what it is
- "Moreover," "Furthermore" → "Also" or direct connection
- "landscape," "realm," "journey" → specific, concrete terms
- "It's important to note" → (deleted; just stated the point)
- "various," "numerous" → specific numbers or removed
- "leverage," "harness," "unlock" → "use," "apply," "access"
- Rhetorical questions → direct statements
- "In conclusion" → (deleted; natural ending)
- "game-changing," "revolutionary" → specific impact description
- Em dash overuse → varied punctuation
</changelog>
<requests>
- [TBD: example from 2022 launch], [TBD: metric], etc.
</requests>

DO NOT add new facts unless FactPolicy permits. Never reintroduce banned phrases.
