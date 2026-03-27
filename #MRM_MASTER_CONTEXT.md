This is the complete, high-level technical documentation and configuration file for your VS Code Workspace. Save this as MRM_MASTER_CONTEXT.md in your project root.

It is designed so that Gemini Code Assistant (or any LLM) understands the deep logic of your staffing tool, the relationship between data files, and the strict UI requirements.

📑 MASTER DOCUMENTATION: MRM BOGOTÁ CREATIVE CREDENTIALS
🎯 1. THE 3 PILLARS OF THE ARCHITECTURE
To handle this app correctly, the AI must treat these three entities as a unified ecosystem:

I. The Credential Pillar (Historical Memory)
Source: Projects_Database.csv

Identifier: P-IDs (format: P###, e.g., P001).

Role: Represents the agency’s proven experience.

Narrative Focus: Every project must display the "Execution Trilogy": Lo Pedido (The Ask), Lo Hecho (The Work), and Lo Logrado (The Result).

II. The Talent Pillar (Human Capital)
Source: Talent_Database.csv

Identifier: T-IDs (format: T###, e.g., T101).

Role: Represents the active creative workforce.

Metadata: Roles, Skills, Contact info, and Avatars.

III. The Bridge (Relational Mapping)
Logic: The Projects_Database.csv contains a column named TeamIDs.

The Match: This column stores a string of T-IDs (e.g., "T101, T105"). The application must parse this string to fetch the corresponding talent objects from the Talent Pillar to populate the project's sidebar.

📊 2. DATA ONTOLOGY & FILE READING
The AI must strictly follow these data transformation rules:

File Paths: All CSVs reside in /public/datacenter/.

Sanitization: Use PapaParse with transformHeader to remove BOM characters and trim whitespace from headers.

ID Strictness: * P-IDs belong to Projects.

T-IDs belong to Talent.

NEVER compare a P-ID with a T-ID.

The Parsing Regex: When reading TeamIDs, use /[;,]+/ to split strings, ensuring support for both commas and semicolons. Always .trim() every ID before matching.

🏷️ 3. SKILLS & TAGGING SYSTEM (CHIPS)
Skills and Tags are treated as Dynamic Iterable Arrays, not just strings.

Transformation: Raw CSV strings (e.g., "UX, UI, Figma") → Array (e.g., ['UX', 'UI', 'Figma']).

Project Modal (Tags): Displayed as categorization chips (Industry, Format, Tech) at the bottom of the 70% section.

Talent Modal (Skills): Displayed as professional competencies in a centered grid.

UI Implementation: Rendered as <span> elements with:

Background: white/5 or zinc-900.

Border: white/10 or 7D68F6/30.

Text: uppercase font-black tracking-widest text-[10px].

🎨 4. UI/UX SPECIFICATIONS (THE 70/30 RULE)
The interface follows a strict "Premium Dark" aesthetic.

The 70/30 Project Modal
The 70% (Main Canvas): Left side. High-res image carousel (ImageURLs) → Project Metadata → The Trilogy Columns → Tags Chips.

The 30% (Sticky Sidebar): Right side. Displays the Linked Talent. Only show users whose T-IDs appear in the project's TeamIDs.

Hover Physics & "Ring Clipping" Fix
The Visual Goal: All talent and project cards must show a ring-2 ring-[#7D68F6] on hover.

The Technical Bug: Contained areas with overflow-y-auto will "clip" (hide) the outer glow/ring.

The Mandatory Fix: Every scrollable container housing hoverable cards MUST have p-2 -mx-2 (internal padding and negative external margin) to allow the ring to be fully visible.

🤖 5. AI CHATBOT ENGINE LOGIC
Model: gemini-2.5-flash.

Context Injection: Gemini must be fed two separate blocks: [PROJECT_CONTEXT] and [TALENT_CONTEXT].

Response Format: Strictly JSON.

match_ids: Must contain P-IDs.

talent_names: Must contain Talent Names.

Ordering: Recommended talent is limited to Max 4 people in a 2-column grid.