// tone sets the chip color for each group (see .tone-* in style.css)
const TOOLKIT = [
  {
    name: "AI &amp; Automation",
    tone: "blue",
    tools: ["Claude (API, Skills, Projects, agents, MCP connectors)", "Make", "Power Automate", "Apps Script", "Office Scripts"],
  },
  {
    name: "Data &amp; Technical",
    tone: "purple",
    tools: ["Excel (advanced)", "Google Sheets", "Power BI", "SQL", "JavaScript", "TypeScript", "VBA", "REST &amp; GraphQL APIs"],
  },
  {
    name: "Platforms",
    tone: "teal",
    tools: ["monday.com", "Airtable", "Asana", "Google Workspace", "Google Cloud Console", "Microsoft 365", "Loom", "Fireflies", "Calendly"],
  },
  {
    name: "Finance",
    tone: "orange",
    tools: ["Stripe", "SAP", "QuickBooks Online", "Gusto", "AP &amp; AR", "Billing &amp; reconciliation", "Monthly close"],
    // Extra names used as experience chips, so they pick up this group's color
    aliases: ["AP", "AR", "Month-End Close", "Collections", "SAP ERP"],
  },
  {
    name: "IT &amp; Security",
    tone: "sand",
    tools: ["User access management", "Microsoft Intune", "Apple Business Manager", "SharePoint", "SOC 2 compliance"],
    aliases: ["Intune", "SOC 2"],
  },
  {
    name: "Operations",
    tone: "green",
    tools: ["Project management", "Process improvement", "SOPs &amp; training", "Vendor management", "KPI dashboards"],
  },
];
