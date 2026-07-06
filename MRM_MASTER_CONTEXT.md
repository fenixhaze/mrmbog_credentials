## 📑 **MRM MASTER CONTEXT: ARCHITECTURE & LOGIC**

## **1. THE THREE CORE PILLARS**
### **### Pillar I: The Credential Archive (Historical Memory)**
- **Identifier:** **P-IDs** (Project IDs) formatted as `P###` (e.g., **P001**, **P025**).
- **Primary Source:** `Projects_Database.csv` located in `/public/datacenter/`.
- **Core Narrative:** Focused on the **"Execution Trilogy"** columns:
    - **Lo Pedido (The Ask):** Original client briefing and constraints.
    - **Lo Hecho (The Work):** Creative strategy and technical development.
    - **Lo Logrado (The Result):** KPIs, awards, or business impact.

### **### Pillar II: The Talent Database (Human Capital)**
- **Identifier:** **T-IDs** (Talent IDs) formatted as `T###` (e.g., **T101**, **T250**).
- **Primary Source:** `Talent_Database.csv` located in `/public/datacenter/`.
- **Core Data:** Professional metadata including Name, Role, ImageURL, Skills, and Email.

### **### Pillar III: The Bridge (Relational Mapping)**
- **The Link:** Projects contain a column named **`TeamIDs`**.
- **Logic:** This column stores a string of **T-IDs** separated by commas or semicolons (e.g., `"T101, T105, T202"`).
- **Requirement:** The app must parse these IDs to fetch real-time data from the Talent Database to populate the project's staffing sidebar.

---

## **2. SKILLS ELEMENTS & DATA TRANSFORMATION**
### **### Skill Extraction Logic**
- **Format:** Skills in CSVs are raw strings (e.g., `"UX/UI, Figma, React"`).
- **Transformation:** Must be parsed into a **Dynamic Iterable Array**: `['UX/UI', 'Figma', 'React']`.
- **Implementation:** Use `.split(/[;,]+/).map(s => s.trim())` to sanitize entries and remove empty values.

### **### UI Components: The Chips**
- **Talent Chips:** Displayed in the **Talent Modal** as specialized competencies.
- **Project Tags:** Displayed in the **Project Modal** and Chat Cards as industry/format identifiers.
- **Styling Specs:** - **Background:** `white/5` or `zinc-900`.
    - **Typography:** `uppercase font-black text-[10px] tracking-widest text-zinc-300`.
    - **Border:** Sutil stroke using `white/10` or `7D68F6/30`.

---

## **3. UI/UX DESIGN SYSTEM (THE 70/30 RULE)**
### **### The Modal Anatomy**
- **70% Main Section (Left):** - **Gallery:** High-res carousel/grid using `ImageURLs`.
    - **Content:** Full description and the **Trilogía de Ejecución** columns.
    - **Footer:** Skill/Tag chips belonging to the project.
- **30% Sidebar (Right):** - **Sticky Container:** Lists all **Linked Talent** (from Pillar III).
    - **Function:** Immediate "Add to Squad" interaction.

### **### Hover Physics & Stroke Effects**
- **Requirement:** All cards/talent-pills must trigger a **`ring-2 ring-[#7D68F6]`** on hover.
- **Bug Prevention:** Scrollable containers (`overflow-y-auto`) clip outer rings.
- **Mandatory Fix:** Apply **`p-2 -mx-2`** to all scrollable sidebars or grids to ensure the purple hover stroke is 100% visible and not cut by the container edges.

---

## **4. LIVE GLOBAL TRANSLATION ENGINE**
### **### Logic & Execution**
- **State-Based Translation:** Translate the **Data Objects** (`talentData` and `flatProjects`), NOT raw DOM elements.
- **Batch Processing:** Send JSON blocks to **Gemini 2.5 Flash** to minimize API calls and latency.
- **Cache:** Store translated versions in state to allow instant toggling between **ES/EN** without re-fetching.

### **### Strict Constraints**
- **ID Integrity:** The engine is **STRICTLY FORBIDDEN** from modifying any **P-ID** or **T-ID**.
- **Tone:** Professional, high-end global creative agency vocabulary. No literal or robotic translations.

---

## **5. AI CHATBOT INTEGRATION**
### **### Context Handling**
- **Model:** `gemini-2.5-flash`.
- **Context Separation:** AI must receive separate blocks: `[PROJECTS_DATA]` and `[TALENT_DATA]`.
- **Output:** Strictly JSON format: `{"match_ids": ["P-ID"], "talent_names": ["NAME"], "reason": "SHORT_EXPLANATION"}`.
- **Limits:** Maximum of **4 talent recommendations** per turn, rendered in a clean 2-column responsive grid.

---

## **🚀 SYSTEM ACTIVATION PROMPT**
> "Gemini, initialize **MRM Master Context**. Follow all hierarchy rules (`##`, `###`, `**`, `-`).
> 1. **Differentiate:** Projects use **P-IDs**, Talent use **T-IDs**.
> 2. **Map:** Use `TeamIDs` to bridge talent into the 30% project sidebar.
> 3. **Format:** Parse all skill/tag strings into arrays and render as **Chips**.
> 4. **Polish:** Apply the `p-2 -mx-2` padding fix for hover rings in scrollable areas.
> 5. **Translate:** Use state-based translation for the ES/EN toggle, preserving all original IDs.
> Confirma que has indexado esta estructura y las reglas de diseño antes de empezar."