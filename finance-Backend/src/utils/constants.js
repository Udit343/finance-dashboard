import { config } from "dotenv"

const CONFIG = {

  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,


  ROLES: {
    VIEWER: "viewer",
    ANALYST: "analyst",
    ACCOUNTANT: "accountant",
    ADMIN: "admin",
  },

  RECORD_TYPES: ["income", "expense"],

  CATEGORIES: [
    "salary",
    "freelance",
    "investment",
    "rent",
    "utilities",
    "food",
    "transport",
    "healthcare",
    "education",
    "entertainment",
    "other",
  ],

  // sort options allowed in queries — prevents injection via sort param
  ALLOWED_SORT_FIELDS: ["amount", "date", "createdAt", "category", "type"],

}

export default CONFIG;