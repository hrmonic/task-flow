/**
 * Pictogrammes SVG et rubriques par métier pour les tableaux TaskFlow.
 * Les clés historiques (design, product, …) restent pour compatibilité des données existantes.
 */

/** @type {Record<string, { label: string, svg: string }>} */
export const BOARD_ICON_LIBRARY = {
  none: { label: "Aucun pictogramme", svg: "" },

  fs_fe_ui_design: { label: "UI Design", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2.5" fill="#EEF2FF" stroke="#6366F1" stroke-width="1.5"/><rect x="5.5" y="7" width="6.5" height="3" rx="1" fill="#A5B4FC"/><rect x="13" y="7" width="5.5" height="8" rx="1" fill="#C7D2FE"/><rect x="5.5" y="11" width="6.5" height="4" rx="1" fill="#818CF8"/><path d="M8 20h8" stroke="#4F46E5" stroke-width="1.5" stroke-linecap="round"/></svg>` },
  fs_fe_ux_design: { label: "UX Design", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12c0-4.4 3.6-8 8-8h7v7c0 4.4-3.6 8-8 8H4v-7Z" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.5"/><circle cx="10" cy="10" r="2" fill="#38BDF8"/><path d="M14 14c-1 .9-2.2 1.4-3.8 1.4" stroke="#0EA5E9" stroke-width="1.5" stroke-linecap="round"/><circle cx="18" cy="6" r="2.2" fill="#FDBA74"/></svg>` },
  fs_fe_accessibility: { label: "Accessibilité front", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="5.3" r="2.3" fill="#34D399"/><path d="M5 9h14M12 9v10M8.8 19l3.2-5 3.2 5" stroke="#059669" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="#10B981" stroke-width="1.5"/></svg>` },
  fs_fe_state_management: { label: "State Management", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="2.3" fill="#60A5FA"/><circle cx="18" cy="6" r="2.3" fill="#A78BFA"/><circle cx="12" cy="18" r="2.5" fill="#F472B6"/><path d="M8.2 7.2 10.8 16M15.8 7.2 13.2 16M8.2 6h7.6" stroke="#6366F1" stroke-width="1.6" stroke-linecap="round"/></svg>` },
  fs_fe_testing: { label: "Tests Front-end", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2.2" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5"/><path d="m8 12 2.2 2.2L16 8.5" stroke="#F59E0B" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 16h10" stroke="#B45309" stroke-width="1.4" stroke-linecap="round"/></svg>` },
  fs_be_api_design: { label: "API Design", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" fill="#ECFEFF" stroke="#0891B2" stroke-width="1.5"/><path d="M9 9h6M9 12h6M9 15h3" stroke="#06B6D4" stroke-width="1.7" stroke-linecap="round"/><path d="m15.2 14.8 2.5 2.5m0-2.5-2.5 2.5" stroke="#0E7490" stroke-width="1.5" stroke-linecap="round"/></svg>` },
  fs_be_database: { label: "Base de données", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="6.5" rx="6.5" ry="2.8" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.5"/><path d="M5.5 6.5v8c0 1.5 2.9 2.8 6.5 2.8s6.5-1.3 6.5-2.8v-8" stroke="#3B82F6" stroke-width="1.5"/><path d="M5.5 10.5c0 1.5 2.9 2.8 6.5 2.8s6.5-1.3 6.5-2.8" stroke="#60A5FA" stroke-width="1.4"/></svg>` },
  fs_be_auth: { label: "Auth & Sessions", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2.2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.5"/><path d="M8 10V8.4a4 4 0 0 1 8 0V10" stroke="#8B5CF6" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="15" r="1.4" fill="#A78BFA"/></svg>` },
  fs_be_security: { label: "Sécurité back-end", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 7 3v5.8c0 4.5-2.9 7.6-7 9.2-4.1-1.6-7-4.7-7-9.2V6l7-3Z" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.5"/><path d="m9.2 12.4 1.8 1.8 3.8-3.8" stroke="#22C55E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  fs_be_performance: { label: "Performance API", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 16a7 7 0 1 1 14 0" stroke="#F97316" stroke-width="1.8" stroke-linecap="round"/><path d="M12 12 8.5 15.5" stroke="#EA580C" stroke-width="1.9" stroke-linecap="round"/><circle cx="12" cy="16" r="1.3" fill="#FB923C"/><path d="M7 18h10" stroke="#FDBA74" stroke-width="1.6" stroke-linecap="round"/></svg>` },
  fs_devops_ci_cd: { label: "CI / CD", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2.4" fill="#ECFCCB" stroke="#65A30D" stroke-width="1.5"/><path d="m8 12 2.3 2.3L16 8.6" stroke="#84CC16" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 16h10" stroke="#4D7C0F" stroke-width="1.5" stroke-linecap="round"/></svg>` },
  fs_devops_docker: { label: "Docker & Containers", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="8" width="3" height="3" rx=".6" fill="#60A5FA"/><rect x="8.8" y="8" width="3" height="3" rx=".6" fill="#3B82F6"/><rect x="12.6" y="8" width="3" height="3" rx=".6" fill="#2563EB"/><rect x="8.8" y="11.8" width="3" height="3" rx=".6" fill="#93C5FD"/><rect x="12.6" y="11.8" width="3" height="3" rx=".6" fill="#60A5FA"/><path d="M3.8 14.7c0 2.7 2.1 4.6 5.7 4.6h4.6c3.8 0 6.1-2.2 6.1-5.5 1-.1 1.8-1 1.8-2.2-.8.3-1.5.2-2.1-.2-.5-.4-.7-.9-.8-1.4-.6 1.2-1.7 1.9-3.1 1.9H9.2c-3.3 0-5.4 1.4-5.4 2.8Z" fill="#1D4ED8"/></svg>` },
  fs_devops_monitoring: { label: "Monitoring", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="14" rx="2.3" fill="#F0FDFA" stroke="#0F766E" stroke-width="1.5"/><path d="M6.5 14h2.3l1.7-3.8 2.2 5.6 1.8-3.1h3.1" stroke="#14B8A6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17.5" cy="19.2" r="1.3" fill="#0D9488"/></svg>` },
  fs_qa_unit: { label: "Tests unitaires", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 4h8v2.2l-2.6 3v7.1a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V9.2L6.4 6.2V4Z" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.5"/><path d="m9.8 12 1.8 1.8 2.6-2.6" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  fs_qa_e2e: { label: "Tests E2E", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5" width="7.5" height="6.8" rx="1.5" fill="#FAE8FF" stroke="#A21CAF" stroke-width="1.5"/><rect x="13" y="12.2" width="7.5" height="6.8" rx="1.5" fill="#F5D0FE" stroke="#C026D3" stroke-width="1.5"/><path d="M10.5 8.4h3M13.5 8.4l-1.1-1.1M13.5 8.4l-1.1 1.1" stroke="#D946EF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  fs_qa_audit: { label: "Audit Qualité", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4.5" width="11" height="15" rx="2" fill="#FEF9C3" stroke="#CA8A04" stroke-width="1.5"/><path d="M8 8.5h5M8 11.5h5M8 14.5h3" stroke="#EAB308" stroke-width="1.6" stroke-linecap="round"/><circle cx="17.8" cy="16.8" r="2.2" fill="#FDE68A" stroke="#A16207" stroke-width="1.4"/><path d="m19.3 18.3 1.8 1.8" stroke="#A16207" stroke-width="1.4" stroke-linecap="round"/></svg>` },
  fs_features: { label: "Fonctionnalités & périmètre", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4 5 7.5v4c0 3.5 2.8 6.5 7 8 4.2-1.5 7-4.5 7-8v-4L12 4Z" fill="#EEF2FF" stroke="#6366F1" stroke-width="1.4"/><path d="M9.5 10.5h5M9.5 13.5h3.5" stroke="#818CF8" stroke-width="1.3" stroke-linecap="round"/><circle cx="16" cy="7.5" r="2" fill="#C7D2FE" stroke="#4F46E5" stroke-width="1.1"/><path d="M15.3 7.5 16 8.2l1.4-1.6" stroke="#4F46E5" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  fs_acceptance: { label: "Critères d’acceptation & DoD", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="4" width="12" height="16" rx="2" fill="#F0FDFA" stroke="#0F766E" stroke-width="1.4"/><path d="m9 10.5 2 2 4-4" stroke="#14B8A6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 15h6M9 18h4" stroke="#5EEAD4" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  fs_feature_flags: { label: "Feature flags & rollout", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="8" width="16" height="8" rx="4" fill="#E0E7FF" stroke="#4338CA" stroke-width="1.3"/><circle cx="14" cy="12" r="3" fill="#6366F1"/><path d="M8 12h.01" stroke="#A5B4FC" stroke-width="2" stroke-linecap="round"/><path d="M4 6h6l2 2h8" stroke="#818CF8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },

  design: { label: "Palette créative", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.7 0 3-1.1 3-2.5 0-.8-.4-1.5-1-2 .9-.2 1.8-.5 2.6-1 1.4-.8 2.4-2.2 2.4-3.9 0-4.7-3.8-8.6-8.6-8.6H12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="7.7" cy="10" r="1.1" fill="currentColor"/><circle cx="10.3" cy="7.2" r="1.1" fill="currentColor"/><circle cx="14.1" cy="7.5" r="1.1" fill="currentColor"/></svg>` },
  accounting: { label: "Comptabilité", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19h14M7 16V8m5 8V5m5 11v-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M15 5.2c.5-.5 1.3-.7 2-.4.7.3 1.2.9 1.2 1.7 0 1.4-1.4 2.2-3.2 2.5M9 8.2c.5-.5 1.3-.7 2-.4.7.3 1.2.9 1.2 1.7 0 1.4-1.4 2.2-3.2 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>` },
  communication: { label: "Communication", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16v9H8l-4 4V7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m7 10 5 3 5-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  management: { label: "Management", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="7" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M6 20a6 6 0 0 1 12 0M4 13l2 2 3-3M20 13l-2 2-3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  strategy: { label: "Stratégie", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20V5m0 15h15m-9-4 3-3 2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  marketing: { label: "Marketing", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 14c2.2-2.2 5.6-2.2 7.8 0M3 10.2c4.4-4.4 11.6-4.4 16 0M7.8 18.2a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  product: { label: "Produit", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21 4 16.5v-9L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m4 7.5 8 4.5 8-4.5" stroke="currentColor" stroke-width="1.8"/></svg>` },
  hr: { label: "Ressources humaines", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="8" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 19a4.5 4.5 0 0 1 9 0M11.5 19a4.5 4.5 0 0 1 9 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  legal: { label: "Juridique", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16M7 7h10M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 7 4 12h6L7 7Zm10 0-3 5h6l-3-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
  operations: { label: "Opérations", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  it: { label: "IT / Développement", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 9-3 3 3 3m8-6 3 3-3 3M10 19l4-14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  finance: { label: "Finance", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19h16M6 16V9m4 7V5m4 11v-8m4 8v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  sales: { label: "Commercial", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 15h4l2-6 3 9 2-5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  education: { label: "Éducation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3 8 9-4 9 4-9 4-9-4Zm3 3.5v4.8c0 .5.2.9.6 1.1 3.6 2.1 7.2 2.1 10.8 0 .4-.2.6-.6.6-1.1v-4.8" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
  health: { label: "Santé", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20s-6.5-3.9-8.6-7.7C1.8 9.4 3.2 6 6.6 6c2.1 0 3.3 1.2 4.1 2.4.8-1.2 2-2.4 4.1-2.4 3.4 0 4.8 3.4 3.2 6.3C18.5 16.1 12 20 12 20Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
  logistics: { label: "Logistique", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7h13v8H3zM16 10h3l2 2v3h-5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7" cy="17" r="1.8" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="17" r="1.8" stroke="currentColor" stroke-width="1.8"/></svg>` },

  ds_brand_guide: { label: "Charte & identité", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1.5"/><circle cx="9" cy="9" r="2" fill="#A78BFA"/><rect x="13" y="7" width="5" height="4" rx="0.8" fill="#C4B5FD"/></svg>` },
  ds_logo_sketch: { label: "Logo & symboles", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="#8B5CF6" stroke-width="1.5"/><path d="M8 14c2-3 6-3 8 0" stroke="#6D28D9" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="10" r="1" fill="#7C3AED"/></svg>` },
  ds_color_tokens: { label: "Couleurs & tokens", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="6" width="5" height="12" rx="1" fill="#EF4444"/><rect x="9.5" y="6" width="5" height="12" rx="1" fill="#F59E0B"/><rect x="15" y="6" width="5" height="12" rx="1" fill="#10B981"/></svg>` },
  ds_typography: { label: "Typographie", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 18V6h3l2.5 8 2.5-8h3v12" stroke="#4F46E5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 14h6" stroke="#6366F1" stroke-width="1.4" stroke-linecap="round"/></svg>` },
  ds_wireframe: { label: "Wireframes", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3 2"/><rect x="7" y="7" width="10" height="3" rx="0.5" fill="#CBD5E1"/><rect x="7" y="12" width="4" height="5" rx="0.5" fill="#E2E8F0"/><rect x="13" y="12" width="4" height="5" rx="0.5" fill="#E2E8F0"/></svg>` },
  ds_mockup_ui: { label: "Maquettes UI", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="2" fill="#EEF2FF" stroke="#6366F1" stroke-width="1.5"/><rect x="8" y="6" width="8" height="5" rx="1" fill="#A5B4FC"/><circle cx="12" cy="14" r="1.5" fill="#818CF8"/></svg>` },
  ds_design_system: { label: "Design system", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="6" height="6" rx="1" fill="#FDE68A" stroke="#D97706" stroke-width="1.2"/><rect x="14" y="5" width="6" height="6" rx="1" fill="#BFDBFE" stroke="#2563EB" stroke-width="1.2"/><rect x="4" y="13" width="6" height="6" rx="1" fill="#BBF7D0" stroke="#16A34A" stroke-width="1.2"/><rect x="14" y="13" width="6" height="6" rx="1" fill="#FECACA" stroke="#DC2626" stroke-width="1.2"/></svg>` },
  ds_handoff_dev: { label: "Handoff développeurs", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h7v8H4z" fill="#E0E7FF" stroke="#4F46E5" stroke-width="1.4"/><path d="m14 12 4-3v6l-4-3" fill="#C7D2FE"/><path d="M16 9v6" stroke="#312E81" stroke-width="1.2" stroke-linecap="round"/></svg>` },

  acc_general_ledger: { label: "Grand livre", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="1.5" fill="#F0FDF4" stroke="#15803D" stroke-width="1.5"/><path d="M8 7h8M8 11h8M8 15h5" stroke="#22C55E" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  acc_journal: { label: "Journal & écritures", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" fill="#FFFBEB" stroke="#B45309" stroke-width="1.5"/><path d="M8 8h8M8 12h6M8 16h4" stroke="#D97706" stroke-width="1.4" stroke-linecap="round"/><path d="M17 9v6l2-2" stroke="#CA8A04" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  acc_balance_sheet: { label: "Bilan & balance", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V5m0 14h16" stroke="#0F766E" stroke-width="1.6" stroke-linecap="round"/><path d="M7 16V9m5 7V7m5 9v-5" stroke="#14B8A6" stroke-width="2" stroke-linecap="round"/></svg>` },
  acc_invoice_flow: { label: "Factures clients / fourn.", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="1.5" fill="#F8FAFC" stroke="#475569" stroke-width="1.5"/><path d="M9 8h6M9 12h6M9 16h4" stroke="#64748B" stroke-width="1.2" stroke-linecap="round"/><circle cx="15" cy="6" r="2" fill="#22C55E"/></svg>` },
  acc_vat: { label: "TVA & déclarations", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2" fill="#FEF3C7" stroke="#B45309" stroke-width="1.5"/><path d="M8 10h8M8 14h5" stroke="#92400E" stroke-width="1.3" stroke-linecap="round"/><path d="M9 7.5h6v3H9z" fill="#FDE68A" stroke="#B45309" stroke-width="0.8"/></svg>` },
  acc_payroll_decl: { label: "Paie & charges sociales", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" fill="#EEF2FF" stroke="#4338CA" stroke-width="1.5"/><circle cx="12" cy="10" r="2.5" stroke="#6366F1" stroke-width="1.4"/><path d="M8 16c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" stroke="#6366F1" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  acc_closing: { label: "Clôtures & provisions", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#1E3A8A" stroke-width="1.5"/><path d="M12 7v5l3 2" stroke="#3B82F6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 19h10" stroke="#60A5FA" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  acc_assets_fixed: { label: "Immobilisations", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="9" rx="1" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="1.4"/><path d="M8 10V7h8v3" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="5" r="1.5" fill="#60A5FA"/></svg>` },

  com_editorial: { label: "Rédaction & éditorial", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 4h9l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="#FDF4FF" stroke="#A21CAF" stroke-width="1.4"/><path d="M8 10h8M8 14h6" stroke="#C026D3" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  com_pr_media: { label: "Relations presse", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="6" width="18" height="11" rx="1.5" fill="#ECFEFF" stroke="#0891B2" stroke-width="1.4"/><circle cx="12" cy="11.5" r="3" stroke="#06B6D4" stroke-width="1.3"/><path d="M5 8h2M5 11h2M5 14h2" stroke="#0E7490" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  com_social_content: { label: "Réseaux & communauté", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="7" height="7" rx="1.5" fill="#FBCFE8" stroke="#DB2777" stroke-width="1.2"/><rect x="13" y="5" width="7" height="7" rx="1.5" fill="#DDD6FE" stroke="#7C3AED" stroke-width="1.2"/><rect x="8.5" y="12" width="7" height="7" rx="1.5" fill="#BFDBFE" stroke="#2563EB" stroke-width="1.2"/></svg>` },
  com_video_podcast: { label: "Vidéo & podcast", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="7" width="10" height="10" rx="2" fill="#FEF3C7" stroke="#D97706" stroke-width="1.4"/><path d="M17 10v4a2 2 0 0 0 2 2h0" stroke="#B45309" stroke-width="1.4" stroke-linecap="round"/><circle cx="10" cy="12" r="2" fill="#F59E0B"/></svg>` },
  com_internal_com: { label: "Communication interne", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h11v9H8l-4 3v-3H4z" fill="#F1F5F9" stroke="#475569" stroke-width="1.4"/><circle cx="8" cy="12" r="1.2" fill="#64748B"/><circle cx="11.5" cy="12" r="1.2" fill="#64748B"/></svg>` },
  com_crisis_com: { label: "Crise & réputation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-3Z" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.4"/><path d="M12 8v4M12 15h.01" stroke="#B91C1C" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  com_event_com: { label: "Événementiel", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 4v3M17 4v3" stroke="#7C3AED" stroke-width="1.6" stroke-linecap="round"/><rect x="5" y="7" width="14" height="14" rx="2" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="1.4"/><path d="M9 12h6M9 16h4" stroke="#6D28D9" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  com_influence: { label: "Influence & partenariats médias", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="10" r="3" stroke="#EC4899" stroke-width="1.4"/><circle cx="16" cy="11" r="2.5" stroke="#F472B6" stroke-width="1.3"/><path d="M4 19c1.5-3 4.5-5 8-5s6.5 2 8 5" stroke="#DB2777" stroke-width="1.3" stroke-linecap="round"/></svg>` },

  mgt_vision: { label: "Vision & direction", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v3M12 18v3M4 12h3M17 12h3" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="5" fill="#FFFBEB" stroke="#D97706" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="#F59E0B"/></svg>` },
  mgt_team_lead: { label: "Animation d’équipe", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="2.5" stroke="#2563EB" stroke-width="1.4"/><circle cx="16" cy="8" r="2" stroke="#3B82F6" stroke-width="1.3"/><path d="M5 19c0-3 2.5-5 4-5s4 2 4 5M13 19c0-2 1.5-3.5 3-4" stroke="#1D4ED8" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  mgt_coaching: { label: "Coaching & feedback", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4c-2.5 3-4 6.5-4 10a4 4 0 0 0 8 0c0-3.5-1.5-7-4-10Z" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.4"/><path d="M12 9v4M12 15h.01" stroke="#15803D" stroke-width="1.5" stroke-linecap="round"/></svg>` },
  mgt_decision: { label: "Décision & arbitrage", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.8 6.4 19.5l2.1-6.7L3 8.8h6.8L12 2Z" fill="#FEF9C3" stroke="#CA8A04" stroke-width="1.3"/></svg>` },
  mgt_okr: { label: "OKR & performance", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="14" width="4" height="6" rx="0.5" fill="#93C5FD"/><rect x="10" y="10" width="4" height="10" rx="0.5" fill="#60A5FA"/><rect x="16" y="6" width="4" height="14" rx="0.5" fill="#2563EB"/><path d="M4 20h16" stroke="#1E3A8A" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  mgt_org_design: { label: "Organisation & rôles", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="10" y="3" width="4" height="4" rx="0.5" fill="#E9D5FF" stroke="#7C3AED" stroke-width="1.2"/><rect x="4" y="14" width="4" height="4" rx="0.5" fill="#DDD6FE" stroke="#6D28D9" stroke-width="1.2"/><rect x="16" y="14" width="4" height="4" rx="0.5" fill="#DDD6FE" stroke="#6D28D9" stroke-width="1.2"/><path d="M12 7v3M12 10H8M12 10h4M8 13v1M16 13v1" stroke="#8B5CF6" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  mgt_meeting: { label: "Rituels & réunions", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" fill="#F1F5F9" stroke="#64748B" stroke-width="1.4"/><circle cx="9" cy="11" r="1.5" fill="#94A3B8"/><circle cx="15" cy="11" r="1.5" fill="#94A3B8"/><path d="M8 15c1 1 2.5 1.5 4 1.5s3-.5 4-1.5" stroke="#475569" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  mgt_change: { label: "Conduite du changement", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5v14" stroke="#0D9488" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="#CCFBF1" stroke="#0F766E" stroke-width="1.3"/><path d="M15 9l3-3M9 15l-3 3" stroke="#14B8A6" stroke-width="1.2" stroke-linecap="round"/></svg>` },

  str_roadmap: { label: "Roadmap & horizons", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 18V6m0 12h16" stroke="#1E40AF" stroke-width="1.5" stroke-linecap="round"/><path d="M7 15V9l3 4 3-6 3 5 3-3v6" stroke="#3B82F6" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  str_okr_cascade: { label: "OKR & alignement", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="4" width="12" height="4" rx="1" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.2"/><rect x="8" y="10" width="8" height="3.5" rx="0.8" fill="#BFDBFE" stroke="#1D4ED8" stroke-width="1.1"/><rect x="10" y="15" width="4" height="3" rx="0.6" fill="#93C5FD" stroke="#1E40AF" stroke-width="1"/></svg>` },
  str_portfolio: { label: "Portfolio projets", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="5" height="14" rx="1" fill="#EDE9FE" stroke="#6D28D9" stroke-width="1.2"/><rect x="9.5" y="8" width="5" height="11" rx="1" fill="#DDD6FE" stroke="#7C3AED" stroke-width="1.2"/><rect x="15" y="11" width="5" height="8" rx="1" fill="#C4B5FD" stroke="#5B21B6" stroke-width="1.2"/></svg>` },
  str_market_analysis: { label: "Études de marché", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="#0369A1" stroke-width="1.4"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="#0EA5E9" stroke-width="1.2" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.2"/></svg>` },
  str_competitive: { label: "Veille concurrentielle", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19V5m0 14h14" stroke="#475569" stroke-width="1.4" stroke-linecap="round"/><path d="M8 16V10l3 3 2-4 3 6 2-2v3" stroke="#F97316" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  str_positioning: { label: "Positionnement & offre", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l2.5 7H22l-6 4.5 2.3 7L12 16.5 5.7 20.5 8 13.5 2 9h7.5L12 2Z" fill="#FEF3C7" stroke="#D97706" stroke-width="1.2"/></svg>` },
  str_partnership: { label: "Partenariats stratégiques", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="#059669" stroke-width="1.4"/><path d="M5 20c1-3 3.5-5 6-5s5 2 6 5M13 20c1-2 2.5-3.5 4-4" stroke="#10B981" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  str_scenario: { label: "Scénarios & options", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6h5v5H6zM13 6h5v5h-5zM6 13h5v5H6zM13 13h5v5h-5z" fill="#F1F5F9" stroke="#64748B" stroke-width="1.2"/></svg>` },

  mkt_acquisition: { label: "Acquisition (SEO / SEA)", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6" stroke="#EA580C" stroke-width="1.5"/><path d="M16 16l4 4" stroke="#C2410C" stroke-width="1.8" stroke-linecap="round"/><path d="M8 11h6M11 8v6" stroke="#FB923C" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  mkt_content_hub: { label: "Content marketing", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" fill="#FFF7ED" stroke="#EA580C" stroke-width="1.4"/><path d="M8 9h8M8 13h6M8 17h4" stroke="#F97316" stroke-width="1.2" stroke-linecap="round"/><circle cx="17" cy="7" r="2" fill="#FDBA74"/></svg>` },
  mkt_email_crm: { label: "E-mail & automation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" fill="#EEF2FF" stroke="#4F46E5" stroke-width="1.4"/><path d="m4 8 8 5 8-5" stroke="#6366F1" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  mkt_social_ads: { label: "Social & display", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="10" rx="1.5" fill="#FCE7F3" stroke="#DB2777" stroke-width="1.3"/><path d="M9 18h6M12 15v3" stroke="#BE185D" stroke-width="1.4" stroke-linecap="round"/><circle cx="10" cy="10" r="1.5" fill="#EC4899"/><path d="M13 9h3M13 12h2" stroke="#9D174D" stroke-width="1" stroke-linecap="round"/></svg>` },
  mkt_analytics: { label: "Analytics & attribution", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" fill="#F0FDFA" stroke="#0F766E" stroke-width="1.3"/><path d="M7 16V12m3 4V9m3 7v-5m3 5v-8" stroke="#14B8A6" stroke-width="1.6" stroke-linecap="round"/></svg>` },
  mkt_conversion: { label: "CRO & landing pages", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" fill="#F8FAFC" stroke="#334155" stroke-width="1.3"/><rect x="8" y="7" width="8" height="3" rx="0.5" fill="#CBD5E1"/><circle cx="12" cy="14" r="2" fill="#22C55E"/><path d="M10 18h4" stroke="#64748B" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  mkt_brand_campaign: { label: "Campagnes & notoriété", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10c0-2 2-4 8-4s8 2 8 4-2 4-8 4-8-2-8-4Z" fill="#FEF9C3" stroke="#CA8A04" stroke-width="1.3"/><path d="M4 10v6c0 2 2 4 8 4" stroke="#EAB308" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  mkt_growth_loop: { label: "Growth & rétention", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5a7 7 0 1 1-6.3 4" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/><path d="M6 9V5h4" stroke="#6D28D9" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2" fill="#C4B5FD"/></svg>` },

  prd_discovery: { label: "Découverte & recherche", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="5" stroke="#7C3AED" stroke-width="1.5"/><path d="M14 14l5 5" stroke="#6D28D9" stroke-width="1.6" stroke-linecap="round"/><path d="M8 10h4M10 8v4" stroke="#A78BFA" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  prd_problem_solution: { label: "Problème & valeur", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3C8 7 6 10 6 13a6 6 0 0 0 12 0c0-3-2-6-6-10Z" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.3"/><path d="M12 9v4M12 15h.01" stroke="#B91C1C" stroke-width="1.5" stroke-linecap="round"/></svg>` },
  prd_backlog: { label: "Backlog & priorisation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="5" width="12" height="3" rx="0.8" fill="#E0E7FF" stroke="#4338CA" stroke-width="1.1"/><rect x="6" y="10.5" width="12" height="3" rx="0.8" fill="#C7D2FE" stroke="#4F46E5" stroke-width="1.1"/><rect x="6" y="16" width="8" height="3" rx="0.8" fill="#A5B4FC" stroke="#3730A3" stroke-width="1.1"/></svg>` },
  prd_roadmap: { label: "Roadmap produit", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h4l2-4 2 8 2-5 2 3h4" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="12" r="1.5" fill="#3B82F6"/><circle cx="14" cy="12" r="1.5" fill="#60A5FA"/></svg>` },
  prd_prd_specs: { label: "Specs & critères d’acceptation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" fill="#F8FAFC" stroke="#475569" stroke-width="1.3"/><path d="M8 9h8M8 13h8M8 17h5" stroke="#64748B" stroke-width="1.1" stroke-linecap="round"/><path d="m8 11 1.5 1.5L11 10" stroke="#22C55E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  prd_launch: { label: "Lancement & go-to-market", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v9M12 3l3 3M12 3 9 6" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 21c0-4 2.5-7 6-7s6 3 6 7" stroke="#D97706" stroke-width="1.4" stroke-linecap="round"/></svg>` },
  prd_metrics: { label: "Métriques produit", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" fill="#ECFDF5" stroke="#15803D" stroke-width="1.3"/><path d="M8 16V11m4 5V8m4 8v-4" stroke="#22C55E" stroke-width="1.6" stroke-linecap="round"/></svg>` },
  prd_stakeholders: { label: "Parties prenantes", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="9" r="2.2" stroke="#0EA5E9" stroke-width="1.3"/><circle cx="16" cy="8" r="2" stroke="#38BDF8" stroke-width="1.2"/><path d="M4 18c0-2.5 2-4.5 4-4.5M12 18c1-2 2.5-3 4-3" stroke="#0284C7" stroke-width="1.2" stroke-linecap="round"/></svg>` },

  hr_sourcing: { label: "Sourcing & marque employeur", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3" stroke="#4F46E5" stroke-width="1.5"/><path d="M6 20c0-3.5 2.5-6 6-6s6 2.5 6 6" stroke="#6366F1" stroke-width="1.4" stroke-linecap="round"/><path d="M16 5l2 2M18 5l2 2" stroke="#818CF8" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  hr_interview: { label: "Entretiens & sélection", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" fill="#F5F3FF" stroke="#6D28D9" stroke-width="1.3"/><circle cx="10" cy="11" r="1.5" fill="#A78BFA"/><path d="M12.5 10.5h4M12.5 13h3" stroke="#7C3AED" stroke-width="1.1" stroke-linecap="round"/></svg>` },
  hr_offer: { label: "Offre & intégration", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 4h12v16H6z" fill="#ECFDF5" stroke="#15803D" stroke-width="1.3"/><path d="M9 9h6M9 13h6M9 17h4" stroke="#22C55E" stroke-width="1.1" stroke-linecap="round"/><circle cx="16" cy="6" r="2" fill="#4ADE80"/></svg>` },
  hr_onboarding: { label: "Onboarding & parcours", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h3l2-4 2 8 2-3h5" stroke="#0D9488" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5" cy="12" r="1.5" fill="#14B8A6"/><circle cx="19" cy="12" r="1.5" fill="#5EEAD4"/></svg>` },
  hr_learning: { label: "Formation & compétences", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h11v10H4z" fill="#FEF3C7" stroke="#B45309" stroke-width="1.3"/><path d="M15 9l5-2v10l-5-2" fill="#FDE68A" stroke="#D97706" stroke-width="1.2"/></svg>` },
  hr_performance: { label: "Entretiens annuels & perf.", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v3M12 18v3M5 8l2 2M17 16l2 2M5 16l2-2M17 8l2-2" stroke="#DC2626" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="12" r="4" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.3"/></svg>` },
  hr_comp_benefits: { label: "Rémunération & avantages", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="#CA8A04" stroke-width="1.4"/><path d="M12 8v8M9 10c0-1 1.5-2 3-2s3 1 3 2v4c0 1-1.5 2-3 2s-3-1-3-2" stroke="#EAB308" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  hr_relations: { label: "Relations sociales & IRP", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 10h8v8H8z" fill="#E0E7FF" stroke="#3730A3" stroke-width="1.3"/><path d="M10 7V5h4v2M12 14v2" stroke="#4F46E5" stroke-width="1.3" stroke-linecap="round"/></svg>` },

  leg_contract: { label: "Contrats & négociation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h8l3 3v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill="#F8FAFC" stroke="#334155" stroke-width="1.3"/><path d="M9 9h6M9 13h6M9 17h4" stroke="#64748B" stroke-width="1.1" stroke-linecap="round"/></svg>` },
  leg_nda_ip: { label: "NDA & propriété intellectuelle", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" fill="#EDE9FE" stroke="#5B21B6" stroke-width="1.4"/><path d="M9 12h6M12 9v6" stroke="#7C3AED" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  leg_compliance: { label: "Conformité & politiques", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" fill="#ECFDF5" stroke="#15803D" stroke-width="1.3"/><path d="m9 12 2 2 4-4" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  leg_litigation: { label: "Contentieux & précontentieux", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 4 6v5c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-3Z" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.3"/><path d="M12 8v5M12 16h.01" stroke="#B91C1C" stroke-width="1.6" stroke-linecap="round"/></svg>` },
  leg_gdpr: { label: "Données personnelles / RGPD", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="1.3"/><circle cx="12" cy="12" r="3" stroke="#2563EB" stroke-width="1.3"/><path d="M12 10v2.5l1.5 1" stroke="#3B82F6" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  leg_corporate: { label: "Droit des sociétés & gouvernance", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l8 4v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-4Z" fill="#F1F5F9" stroke="#475569" stroke-width="1.3"/><path d="M12 8v5M9 11h6" stroke="#64748B" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  leg_regulatory: { label: "Veille réglementaire", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="#B45309" stroke-width="1.4"/><path d="M16 16l4 4" stroke="#D97706" stroke-width="1.6" stroke-linecap="round"/><path d="M11 8v4l2 2" stroke="#F59E0B" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  leg_policy_internal: { label: "Politiques & règlements internes", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 3h10l2 2v16a1 1 0 0 1-1 1H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill="#F1F5F9" stroke="#475569" stroke-width="1.3"/><path d="M10 9h8M10 13h6M10 17h5" stroke="#64748B" stroke-width="1" stroke-linecap="round"/></svg>` },

  ops_process: { label: "Processus & SOP", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="2" fill="#93C5FD" stroke="#2563EB" stroke-width="1.2"/><circle cx="18" cy="6" r="2" fill="#93C5FD" stroke="#2563EB" stroke-width="1.2"/><circle cx="12" cy="18" r="2" fill="#93C5FD" stroke="#2563EB" stroke-width="1.2"/><path d="M7.5 7.5 10 12M14 12l2.5-4.5M12 14v3" stroke="#3B82F6" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  ops_sla: { label: "SLA & qualité de service", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2" fill="#F0FDFA" stroke="#0F766E" stroke-width="1.3"/><path d="M8 12h8M8 16h5" stroke="#14B8A6" stroke-width="1.2" stroke-linecap="round"/><circle cx="17" cy="9" r="2" fill="#5EEAD4"/></svg>` },
  ops_incident: { label: "Incidents & continuité", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" fill="#FEF3C7" stroke="#D97706" stroke-width="1.3"/></svg>` },
  ops_supply: { label: "Supply chain & achats", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 10h4l2-3h6l2 3h4v8H3z" fill="#E0E7FF" stroke="#4338CA" stroke-width="1.3"/><circle cx="8" cy="18" r="1.5" fill="#6366F1"/><circle cx="16" cy="18" r="1.5" fill="#6366F1"/></svg>` },
  ops_inventory: { label: "Stocks & inventaires", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="6" width="5" height="12" rx="1" fill="#FED7AA" stroke="#EA580C" stroke-width="1.2"/><rect x="11" y="9" width="5" height="9" rx="1" fill="#FDBA74" stroke="#C2410C" stroke-width="1.2"/><rect x="17" y="12" width="2" height="6" rx="0.5" fill="#FB923C"/></svg>` },
  ops_vendor: { label: "Fournisseurs & contrats ops", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7h12v10H8z" fill="#F1F5F9" stroke="#64748B" stroke-width="1.3"/><path d="M4 9h4v8H4z" fill="#CBD5E1" stroke="#475569" stroke-width="1.2"/><circle cx="14" cy="12" r="2" stroke="#334155" stroke-width="1.2"/></svg>` },
  ops_customer_ops: { label: "Customer ops & support", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h16v9H8l-3 3v-3H4z" fill="#EFF6FF" stroke="#2563EB" stroke-width="1.3"/><circle cx="12" cy="12" r="1.5" fill="#3B82F6"/><path d="M9 12h6" stroke="#60A5FA" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  ops_sourcing: { label: "Sourcing & appels d’offres", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h6v8H4zM14 6h6v10h-6z" fill="#F1F5F9" stroke="#64748B" stroke-width="1.3"/><path d="M10 12h4M12 10v4" stroke="#3B82F6" stroke-width="1.4" stroke-linecap="round"/><circle cx="7" cy="12" r="1" fill="#22C55E"/></svg>` },

  itg_server: { label: "Infrastructure & serveurs", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="5" rx="1" fill="#E2E8F0" stroke="#475569" stroke-width="1.2"/><rect x="4" y="10" width="16" height="5" rx="1" fill="#CBD5E1" stroke="#475569" stroke-width="1.2"/><circle cx="7" cy="6.5" r="0.8" fill="#22C55E"/><circle cx="7" cy="12.5" r="0.8" fill="#22C55E"/></svg>` },
  itg_cloud: { label: "Cloud & hébergement", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 18h11a4 4 0 0 0 0-8 5 5 0 0 0-9.7-1.5A3.5 3.5 0 0 0 7 18Z" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.3"/></svg>` },
  itg_network: { label: "Réseau & télécom", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="12" r="2" stroke="#0891B2" stroke-width="1.3"/><circle cx="18" cy="8" r="2" stroke="#06B6D4" stroke-width="1.3"/><circle cx="18" cy="16" r="2" stroke="#06B6D4" stroke-width="1.3"/><path d="M8 12h6M14 10l4-2M14 14l4 2" stroke="#0E7490" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  itg_security: { label: "Sécurité IT & accès", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="10" width="10" height="9" rx="1.5" fill="#FEF3C7" stroke="#B45309" stroke-width="1.3"/><path d="M9 10V7a3 3 0 0 1 6 0v3" stroke="#D97706" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="14.5" r="1" fill="#F59E0B"/></svg>` },
  itg_helpdesk: { label: "Support & helpdesk", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#7C3AED" stroke-width="1.4"/><path d="M9.5 9.5a3 3 0 0 1 5 2c0 2-2 2-2 4M12 17h.01" stroke="#A78BFA" stroke-width="1.4" stroke-linecap="round"/></svg>` },
  itg_assets: { label: "Parc & actifs IT", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="4" width="12" height="14" rx="2" fill="#F1F5F9" stroke="#64748B" stroke-width="1.3"/><path d="M9 8h6M9 12h4" stroke="#94A3B8" stroke-width="1.1" stroke-linecap="round"/><rect x="8" y="15" width="8" height="1.5" rx="0.5" fill="#CBD5E1"/></svg>` },
  itg_project: { label: "Projets IT & cadrage", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h14" stroke="#1E40AF" stroke-width="1.4" stroke-linecap="round"/><circle cx="18" cy="6" r="2" fill="#3B82F6"/><circle cx="14" cy="12" r="2" fill="#60A5FA"/></svg>` },
  itg_bi_support: { label: "Outils métiers & analytics", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" fill="#ECFDF5" stroke="#15803D" stroke-width="1.2"/><path d="M8 16V11m4 5V8m4 8v-3" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round"/></svg>` },

  fin_treasury: { label: "Trésorerie & cash", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="7" rx="7" ry="3" fill="#FEF9C3" stroke="#CA8A04" stroke-width="1.3"/><path d="M5 7v5c0 1.5 3 3 7 3s7-1.5 7-3V7" stroke="#EAB308" stroke-width="1.2"/><circle cx="12" cy="7" r="1.5" fill="#F59E0B"/></svg>` },
  fin_planning: { label: "Budgets & prévisionnels", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V5m0 14h16" stroke="#0F172A" stroke-width="1.4" stroke-linecap="round"/><path d="M7 15V10m4 5V7m4 8v-4m4 4V9" stroke="#3B82F6" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  fin_reporting: { label: "Reporting & consolidation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" fill="#F8FAFC" stroke="#334155" stroke-width="1.3"/><path d="M8 8h8M8 12h6M8 16h4" stroke="#64748B" stroke-width="1.1" stroke-linecap="round"/><path d="M16 6v4l1.5-1 1.5 1" stroke="#22C55E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  fin_control: { label: "Contrôle de gestion", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="#7C3AED" stroke-width="1.4"/><path d="M12 8v4l3 2" stroke="#A78BFA" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 16h8" stroke="#6D28D9" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  fin_investment: { label: "Investissements & M&A", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16V8l4 3 4-5 4 3 4-4v11" stroke="#059669" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 20h16" stroke="#10B981" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  fin_risk: { label: "Risques & conformité finance", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 4 6v6c0 4 2.5 7.5 8 9 5.5-1.5 8-5 8-9V6l-8-3Z" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.3"/><path d="M12 8v5M12 15h.01" stroke="#B91C1C" stroke-width="1.5" stroke-linecap="round"/></svg>` },
  fin_relations: { label: "Relations banques & investisseurs", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="7" width="16" height="11" rx="1.5" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="1.3"/><path d="M8 7V5h8v2" stroke="#2563EB" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="13" r="2" stroke="#3B82F6" stroke-width="1.2"/></svg>` },
  fin_margin: { label: "Marges & rentabilité", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V5m0 14h16" stroke="#64748B" stroke-width="1.3" stroke-linecap="round"/><path d="M7 14V9m4 5V7m4 4v5m4-3v4" stroke="#8B5CF6" stroke-width="1.6" stroke-linecap="round"/></svg>` },

  sls_pipeline: { label: "Pipeline & prospection", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16v4H4zM4 14h12v4H4z" fill="#FEF3C7" stroke="#D97706" stroke-width="1.2"/><circle cx="18" cy="16" r="2" fill="#F59E0B"/></svg>` },
  sls_qualif: { label: "Qualification & discovery", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3" stroke="#2563EB" stroke-width="1.4"/><path d="M6 20c0-3.5 3-6 6-6s6 2.5 6 6" stroke="#3B82F6" stroke-width="1.3" stroke-linecap="round"/><path d="M15 5l3 2" stroke="#60A5FA" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  sls_demo: { label: "Démo & proof", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="10" rx="1.5" fill="#EEF2FF" stroke="#4F46E5" stroke-width="1.3"/><path d="M10 18h4" stroke="#6366F1" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="10" r="2" fill="#A5B4FC"/></svg>` },
  sls_proposal: { label: "Proposition & pricing", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="1.5" fill="#FFF7ED" stroke="#EA580C" stroke-width="1.3"/><path d="M9 8h6M9 12h6M9 16h4" stroke="#F97316" stroke-width="1.1" stroke-linecap="round"/><path d="M15 6v3h3" stroke="#C2410C" stroke-width="1.1" stroke-linecap="round"/></svg>` },
  sls_negotiate: { label: "Négociation & closing", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 12h8M12 8v8" stroke="#16A34A" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="6" stroke="#22C55E" stroke-width="1.4"/><path d="m10 12 2 2 4-4" stroke="#15803D" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  sls_account: { label: "Comptes stratégiques & farming", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 11c2.2 0 4-1.3 4-3s-1.8-3-4-3-4 1.3-4 3 1.8 3 4 3Z" fill="#CFFAFE" stroke="#0891B2" stroke-width="1.2"/><path d="M6 19c0-2.5 2.2-4.5 6-4.5s6 2 6 4.5" stroke="#06B6D4" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  sls_partner: { label: "Partenaires & canaux", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="10" r="2.5" stroke="#7C3AED" stroke-width="1.3"/><circle cx="16" cy="8" r="2" stroke="#A78BFA" stroke-width="1.2"/><path d="M4 18c1-2.5 2.5-4 4-4M12 18c1-1.5 2.5-2.5 4-3" stroke="#6D28D9" stroke-width="1.2" stroke-linecap="round"/><path d="M14 14h4l2 2" stroke="#8B5CF6" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  sls_cs: { label: "Customer success", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 11c2.5 0 4.5-1.5 4.5-3.5S14.5 4 12 4 7.5 5.5 7.5 7.5 9.5 11 12 11Z" fill="#CCFBF1" stroke="#0D9488" stroke-width="1.2"/><path d="M5 19c0-3 3.5-5.5 7-5.5s7 2.5 7 5.5" stroke="#14B8A6" stroke-width="1.3" stroke-linecap="round"/><path d="M16 5l2 2" stroke="#5EEAD4" stroke-width="1.2" stroke-linecap="round"/></svg>` },

  edu_curriculum: { label: "Programmes & curricula", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2" fill="#FEF3C7" stroke="#B45309" stroke-width="1.3"/><path d="M9 7h6M9 11h6M9 15h4" stroke="#D97706" stroke-width="1.1" stroke-linecap="round"/><path d="M12 3v18" stroke="#CA8A04" stroke-width="0.8" stroke-dasharray="2 2"/></svg>` },
  edu_classroom: { label: "Cours & classe", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="8" width="18" height="10" rx="1.5" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.3"/><path d="M8 8V6h8v2" stroke="#0EA5E9" stroke-width="1.2" stroke-linecap="round"/><circle cx="9" cy="13" r="1" fill="#38BDF8"/><circle cx="15" cy="13" r="1" fill="#38BDF8"/></svg>` },
  edu_assessment: { label: "Évaluation & certifications", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 11 11 13 15 9" stroke="#16A34A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="8" stroke="#22C55E" stroke-width="1.4"/><path d="M8 17h8" stroke="#15803D" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  edu_digital: { label: "LMS & classe hybride", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="10" rx="1.5" fill="#F5F3FF" stroke="#6D28D9" stroke-width="1.3"/><circle cx="10" cy="10" r="1.5" fill="#A78BFA"/><path d="M13 9h4M13 12h3" stroke="#7C3AED" stroke-width="1" stroke-linecap="round"/><path d="M8 18h8" stroke="#8B5CF6" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  edu_support: { label: "Accompagnement & orientation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5c-2 3-4 5.5-4 9a4 4 0 0 0 8 0c0-3.5-2-6-4-9Z" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.3"/><circle cx="12" cy="11" r="1" fill="#22C55E"/></svg>` },
  edu_institution: { label: "Administration scolaire", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="4" width="12" height="16" rx="2" fill="#F1F5F9" stroke="#64748B" stroke-width="1.3"/><path d="M9 8h6M9 12h6M9 16h4" stroke="#94A3B8" stroke-width="1.1" stroke-linecap="round"/><rect x="8" y="6" width="8" height="2" rx="0.5" fill="#CBD5E1"/></svg>` },
  edu_family: { label: "Familles & communauté", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="2" stroke="#EC4899" stroke-width="1.3"/><circle cx="16" cy="10" r="1.8" stroke="#F472B6" stroke-width="1.2"/><path d="M4 19c0-2 2-3.5 5-3.5M11 19c0-1.5 2-2.5 5-3" stroke="#DB2777" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  edu_schedule: { label: "Emploi du temps & planning", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" fill="#FEF3C7" stroke="#B45309" stroke-width="1.3"/><path d="M8 3v4M16 3v4M4 10h16" stroke="#D97706" stroke-width="1.2" stroke-linecap="round"/><circle cx="9" cy="14" r="1" fill="#F59E0B"/><circle cx="15" cy="14" r="1" fill="#EAB308"/></svg>` },

  hlth_clinical: { label: "Soins & clinique", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16M8 8h8M8 16h8" stroke="#DC2626" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.3"/></svg>` },
  hlth_patient: { label: "Parcours patient", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3" stroke="#0891B2" stroke-width="1.4"/><path d="M6 20c0-3 2.5-5.5 6-5.5s6 2.5 6 5.5" stroke="#06B6D4" stroke-width="1.3" stroke-linecap="round"/><path d="M8 12h8" stroke="#0E7490" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  hlth_pharmacy: { label: "Pharmacie & médicaments", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="6" width="8" height="12" rx="1" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.3"/><path d="M10 10h4M12 8v4" stroke="#22C55E" stroke-width="1.4" stroke-linecap="round"/></svg>` },
  hlth_lab: { label: "Laboratoire & imagerie", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="6" width="14" height="12" rx="2" fill="#EEF2FF" stroke="#4338CA" stroke-width="1.3"/><circle cx="12" cy="12" r="3" stroke="#6366F1" stroke-width="1.2"/><path d="M9 12h6" stroke="#818CF8" stroke-width="1" stroke-linecap="round"/></svg>` },
  hlth_prevention: { label: "Prévention & santé publique", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-4.5 7-10a7 7 0 0 0-14 0c0 5.5 7 10 7 10Z" fill="#FEF3C7" stroke="#D97706" stroke-width="1.3"/><path d="M12 8v5M9 11h6" stroke="#F59E0B" stroke-width="1.3" stroke-linecap="round"/></svg>` },
  hlth_admin: { label: "Planning & dossiers médicaux", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" fill="#F8FAFC" stroke="#475569" stroke-width="1.3"/><path d="M8 8h8M8 12h6M8 16h4" stroke="#64748B" stroke-width="1.1" stroke-linecap="round"/><circle cx="16" cy="7" r="1.5" fill="#3B82F6"/></svg>` },
  hlth_quality_sys: { label: "Qualité & accréditation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 5 6v5c0 4 2.5 7 7 9 4.5-2 7-5 7-9V6l-7-3Z" fill="#ECFDF5" stroke="#15803D" stroke-width="1.3"/><path d="m9 12 2 2 4-4" stroke="#22C55E" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  hlth_telehealth: { label: "Télémédecine & suivi", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="7" width="10" height="8" rx="1.5" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.3"/><path d="M14 10c2 0 4 1.2 4 3v2h-3" stroke="#0EA5E9" stroke-width="1.3" stroke-linecap="round"/><circle cx="19" cy="9" r="2" fill="#38BDF8"/></svg>` },

  log_warehouse: { label: "Entrepôt & picking", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10 12 4l8 6v10H4z" fill="#FED7AA" stroke="#EA580C" stroke-width="1.3"/><rect x="9" y="14" width="6" height="6" fill="#FDBA74" stroke="#C2410C" stroke-width="1.1"/></svg>` },
  log_transport: { label: "Transport & livraison", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 14h12v4H3zM15 12h4l2 2v4h-6" fill="#E0E7FF" stroke="#4338CA" stroke-width="1.3"/><circle cx="7" cy="18" r="1.5" fill="#6366F1"/><circle cx="17" cy="18" r="1.5" fill="#6366F1"/></svg>` },
  log_inventory: { label: "Stocks & flux", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="7" width="5" height="10" rx="0.8" fill="#BBF7D0" stroke="#16A34A" stroke-width="1.2"/><rect x="11" y="10" width="5" height="7" rx="0.8" fill="#86EFAC" stroke="#15803D" stroke-width="1.2"/><path d="M17 8v9" stroke="#22C55E" stroke-width="1.4" stroke-linecap="round"/></svg>` },
  log_customs: { label: "Douanes & international", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="1.5" fill="#F1F5F9" stroke="#0F172A" stroke-width="1.3"/><path d="M4 10h16M12 5v14" stroke="#334155" stroke-width="1.1"/><circle cx="9" cy="8" r="1" fill="#3B82F6"/><circle cx="15" cy="13" r="1" fill="#EF4444"/></svg>` },
  log_planning: { label: "Planification & S&OP", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V5m0 14h16" stroke="#64748B" stroke-width="1.3" stroke-linecap="round"/><path d="M7 15V11l3 2 2-3 3 5 3-4v4" stroke="#0EA5E9" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  log_reverse: { label: "Retours & reverse logistics", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M8 9l-3 3 3 3" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="6" width="6" height="6" rx="1" fill="#EDE9FE" stroke="#6D28D9" stroke-width="1.2"/></svg>` },
  log_incoterm: { label: "Incoterms & docs transport", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="1.5" fill="#FFF7ED" stroke="#EA580C" stroke-width="1.3"/><path d="M8 9h8M8 13h5" stroke="#F97316" stroke-width="1.1" stroke-linecap="round"/><path d="M14 16l3-2v4" stroke="#C2410C" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  log_packaging: { label: "Emballage & unitisation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="8" width="12" height="10" rx="1.2" fill="#FEF3C7" stroke="#B45309" stroke-width="1.3"/><path d="M6 11h12M9 8v10M15 8v10" stroke="#D97706" stroke-width="1.1" stroke-linecap="round"/><path d="M8 6h8l1 2H7l1-2Z" fill="#FDE68A" stroke="#CA8A04" stroke-width="1"/></svg>` },

  adt_plan: { label: "Plan de mission", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" fill="#FFFBEB" stroke="#B45309" stroke-width="1.3"/><path d="M8 8h8M8 12h6M8 16h4" stroke="#D97706" stroke-width="1.1" stroke-linecap="round"/><circle cx="16" cy="6" r="1.5" fill="#F59E0B"/></svg>` },
  adt_fieldwork: { label: "Travaux sur le terrain", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2 4 7v5c0 4 3 8 8 10 5-2 8-6 8-10V7l-8-5Z" fill="#E0F2FE" stroke="#0369A1" stroke-width="1.3"/><circle cx="12" cy="10" r="2" fill="#38BDF8"/></svg>` },
  adt_evidence: { label: "Preuves & échantillonnage", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="5" width="12" height="14" rx="1.5" fill="#F8FAFC" stroke="#475569" stroke-width="1.3"/><path d="m9 11 2 2 4-4" stroke="#22C55E" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 15h6" stroke="#64748B" stroke-width="1.1" stroke-linecap="round"/></svg>` },
  adt_risk: { label: "Risques & contrôles internes", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.3"/><path d="M12 8v5M12 16h.01" stroke="#B91C1C" stroke-width="1.5" stroke-linecap="round"/></svg>` },
  adt_report: { label: "Rapport & recommandations", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h8l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill="#F5F3FF" stroke="#6D28D9" stroke-width="1.3"/><path d="M9 12h6M9 16h4" stroke="#7C3AED" stroke-width="1.1" stroke-linecap="round"/></svg>` },
  adt_it_audit: { label: "Audit SI & données", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="10" rx="1.5" fill="#ECFEFF" stroke="#0891B2" stroke-width="1.3"/><path d="M8 18h8" stroke="#06B6D4" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="10" r="2" stroke="#0E7490" stroke-width="1.2"/></svg>` },
  adt_esg: { label: "Audit ESG & durabilité", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3c-4 4-6 7-6 10a6 6 0 0 0 12 0c0-3-2-6-6-10Z" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.3"/><path d="M12 7v6M9 10h6" stroke="#22C55E" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  adt_followup: { label: "Suivi des actions", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12a8 8 0 1 1 3.3 6.5" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round"/><path d="M4 16v-4h4" stroke="#4F46E5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" stroke="#22C55E" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>` },

  uxa_research: { label: "Recherche utilisateur", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="4" stroke="#7C3AED" stroke-width="1.4"/><path d="M14 14l5 5" stroke="#6D28D9" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="10" r="1" fill="#A78BFA"/></svg>` },
  uxa_journey: { label: "Parcours & cartographie", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="12" r="2" fill="#BFDBFE" stroke="#2563EB" stroke-width="1.2"/><circle cx="12" cy="8" r="2" fill="#93C5FD" stroke="#1D4ED8" stroke-width="1.2"/><circle cx="18" cy="14" r="2" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.2"/><path d="M8 11l3-2M14 9l3 3" stroke="#60A5FA" stroke-width="1.1" stroke-linecap="round"/></svg>` },
  uxa_usability: { label: "Tests d’utilisabilité", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="10" rx="1.5" fill="#FEF3C7" stroke="#D97706" stroke-width="1.3"/><circle cx="10" cy="10" r="1" fill="#F59E0B"/><path d="M13 9h3M13 12h2" stroke="#B45309" stroke-width="1" stroke-linecap="round"/></svg>` },
  uxa_wcag: { label: "WCAG & critères", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" fill="#ECFDF5" stroke="#15803D" stroke-width="1.3"/><path d="M8 12h8M12 8v8" stroke="#22C55E" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#BBF7D0"/></svg>` },
  uxa_screen_reader: { label: "Lecteurs d’écran & sémantique", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6h10v8H8z" fill="#E0E7FF" stroke="#4338CA" stroke-width="1.3"/><circle cx="11" cy="10" r="1" fill="#6366F1"/><path d="M13 10h3" stroke="#818CF8" stroke-width="1" stroke-linecap="round"/><path d="M6 18h12" stroke="#4F46E5" stroke-width="1.4" stroke-linecap="round"/></svg>` },
  uxa_contrast: { label: "Contraste & lisibilité", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.4"/><path d="M12 4a8 8 0 0 1 0 16" fill="#0F172A"/><circle cx="12" cy="12" r="3" stroke="#fff" stroke-width="1" fill="none"/></svg>` },
  uxa_inclusive: { label: "Design inclusif & i18n", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="2.5" stroke="#EC4899" stroke-width="1.3"/><circle cx="16" cy="10" r="2" stroke="#F472B6" stroke-width="1.2"/><path d="M4 19c1-3 3.5-5 5-5M12 19c1-2 3-3.5 5-4" stroke="#DB2777" stroke-width="1.2" stroke-linecap="round"/><path d="M12 5v2M18 7l-1.5 1.5" stroke="#F9A8D4" stroke-width="1.2" stroke-linecap="round"/></svg>` },
  uxa_i18n: { label: "Internationalisation (i18n)", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#0369A1" stroke-width="1.4"/><path d="M3 12h18M12 3c-2.5 4-2.5 14 0 18M12 3c2.5 4 2.5 14 0 18" stroke="#0EA5E9" stroke-width="1.1" stroke-linecap="round"/></svg>` },
};

export const BOARD_JOB_CATALOG = {
  general: { label: "Général", icons: ["none", "product", "strategy", "management"] },
  fullstack: {
    label: "Développeur full stack",
    sections: [
      { id: "fs_fe", label: "Front-end", icons: ["fs_fe_ui_design", "fs_fe_ux_design", "fs_fe_accessibility", "fs_fe_state_management", "fs_fe_testing"] },
      { id: "fs_be", label: "Back-end", icons: ["fs_be_api_design", "fs_be_database", "fs_be_auth", "fs_be_security", "fs_be_performance"] },
      { id: "fs_features", label: "Features", icons: ["fs_features", "fs_acceptance", "fs_feature_flags"] },
      { id: "fs_devops", label: "DevOps", icons: ["fs_devops_ci_cd", "fs_devops_docker", "fs_devops_monitoring"] },
      { id: "fs_qa", label: "Qualité & Tests", icons: ["fs_qa_unit", "fs_qa_e2e", "fs_qa_audit"] },
    ],
  },
  design: {
    label: "Design",
    sections: [
      { id: "ds_brand", label: "Identité & fondations", icons: ["ds_brand_guide", "ds_logo_sketch", "ds_color_tokens", "ds_typography"] },
      { id: "ds_ui", label: "Interface & livrables", icons: ["ds_wireframe", "ds_mockup_ui", "ds_design_system", "ds_handoff_dev"] },
    ],
  },
  accounting: {
    label: "Comptabilité",
    sections: [
      { id: "acc_core", label: "Tenue & états", icons: ["acc_general_ledger", "acc_journal", "acc_balance_sheet", "acc_invoice_flow"] },
      { id: "acc_compliance", label: "Fiscal, social & clôture", icons: ["acc_vat", "acc_payroll_decl", "acc_closing", "acc_assets_fixed"] },
    ],
  },
  communication: {
    label: "Communication",
    sections: [
      { id: "com_content", label: "Contenus & RP", icons: ["com_editorial", "com_pr_media", "com_social_content", "com_video_podcast"] },
      { id: "com_stakeholders", label: "Interne, crise & événements", icons: ["com_internal_com", "com_crisis_com", "com_event_com", "com_influence"] },
    ],
  },
  management: {
    label: "Management",
    sections: [
      { id: "mgt_lead", label: "Leadership", icons: ["mgt_vision", "mgt_team_lead", "mgt_coaching", "mgt_decision"] },
      { id: "mgt_exec", label: "Exécution & organisation", icons: ["mgt_okr", "mgt_org_design", "mgt_meeting", "mgt_change"] },
    ],
  },
  strategy: {
    label: "Stratégie",
    sections: [
      { id: "str_plan", label: "Planification & portefeuille", icons: ["str_roadmap", "str_okr_cascade", "str_portfolio", "str_scenario"] },
      { id: "str_market", label: "Marché & partenariats", icons: ["str_market_analysis", "str_competitive", "str_positioning", "str_partnership"] },
    ],
  },
  marketing: {
    label: "Marketing",
    sections: [
      { id: "mkt_growth", label: "Acquisition & notoriété", icons: ["mkt_acquisition", "mkt_content_hub", "mkt_social_ads", "mkt_brand_campaign"] },
      { id: "mkt_ops", label: "Activation & données", icons: ["mkt_email_crm", "mkt_conversion", "mkt_analytics", "mkt_growth_loop"] },
    ],
  },
  product: {
    label: "Produit",
    sections: [
      { id: "prd_discovery", label: "Découverte & vision", icons: ["prd_discovery", "prd_problem_solution", "prd_backlog", "prd_roadmap"] },
      { id: "prd_delivery", label: "Livraison & impact", icons: ["prd_prd_specs", "prd_launch", "prd_metrics", "prd_stakeholders"] },
    ],
  },
  hr: {
    label: "Ressources humaines",
    sections: [
      { id: "hr_talent", label: "Talent & intégration", icons: ["hr_sourcing", "hr_interview", "hr_offer", "hr_onboarding"] },
      { id: "hr_develop", label: "Développement & relations", icons: ["hr_learning", "hr_performance", "hr_comp_benefits", "hr_relations"] },
    ],
  },
  legal: {
    label: "Juridique",
    sections: [
      { id: "leg_transactions", label: "Contrats & actifs juridiques", icons: ["leg_contract", "leg_nda_ip", "leg_compliance", "leg_litigation"] },
      { id: "leg_governance", label: "Conformité & veille", icons: ["leg_gdpr", "leg_corporate", "leg_regulatory", "leg_policy_internal"] },
    ],
  },
  operations: {
    label: "Opérations",
    sections: [
      { id: "ops_excellence", label: "Excellence opérationnelle", icons: ["ops_process", "ops_sla", "ops_incident", "ops_customer_ops"] },
      { id: "ops_supply", label: "Supply & achats", icons: ["ops_supply", "ops_inventory", "ops_vendor", "ops_sourcing"] },
    ],
  },
  it: {
    label: "IT / Infrastructure",
    sections: [
      { id: "itg_infra", label: "Infrastructure & sécurité", icons: ["itg_server", "itg_cloud", "itg_network", "itg_security"] },
      { id: "itg_services", label: "Services & projets", icons: ["itg_helpdesk", "itg_assets", "itg_project", "itg_bi_support"] },
    ],
  },
  finance: {
    label: "Finance",
    sections: [
      { id: "fin_core", label: "Pilotage & reporting", icons: ["fin_treasury", "fin_planning", "fin_reporting", "fin_control"] },
      { id: "fin_advanced", label: "Investissements & relations", icons: ["fin_investment", "fin_risk", "fin_relations", "fin_margin"] },
    ],
  },
  sales: {
    label: "Commercial",
    sections: [
      { id: "sls_funnel", label: "Pipeline & closing", icons: ["sls_pipeline", "sls_qualif", "sls_demo", "sls_proposal"] },
      { id: "sls_growth", label: "Comptes & partenaires", icons: ["sls_negotiate", "sls_account", "sls_partner", "sls_cs"] },
    ],
  },
  education: {
    label: "Éducation",
    sections: [
      { id: "edu_pedagogy", label: "Pédagogie", icons: ["edu_curriculum", "edu_classroom", "edu_assessment", "edu_digital"] },
      { id: "edu_ecosystem", label: "Écosystème & admin.", icons: ["edu_support", "edu_institution", "edu_family", "edu_schedule"] },
    ],
  },
  health: {
    label: "Santé",
    sections: [
      { id: "hlth_care", label: "Soins & médical", icons: ["hlth_clinical", "hlth_patient", "hlth_pharmacy", "hlth_lab"] },
      { id: "hlth_system", label: "Organisation & prévention", icons: ["hlth_prevention", "hlth_admin", "hlth_quality_sys", "hlth_telehealth"] },
    ],
  },
  logistics: {
    label: "Logistique",
    sections: [
      { id: "log_physical", label: "Entrepôt & transport", icons: ["log_warehouse", "log_transport", "log_inventory", "log_reverse"] },
      { id: "log_plan", label: "Planification & international", icons: ["log_planning", "log_customs", "log_incoterm", "log_packaging"] },
    ],
  },
  audit: {
    label: "Audit",
    sections: [
      { id: "adt_mission", label: "Mission & terrain", icons: ["adt_plan", "adt_fieldwork", "adt_evidence", "adt_risk"] },
      { id: "adt_outputs", label: "Livrables & spécialisations", icons: ["adt_report", "adt_it_audit", "adt_esg", "adt_followup"] },
    ],
  },
  ux_accessibility: {
    label: "UX & Accessibilité",
    sections: [
      { id: "uxa_ux", label: "Expérience utilisateur", icons: ["uxa_research", "uxa_journey", "uxa_usability", "uxa_inclusive"] },
      { id: "uxa_a11y", label: "Accessibilité", icons: ["uxa_wcag", "uxa_screen_reader", "uxa_contrast", "uxa_i18n"] },
    ],
  },
};

export const ICON_TO_JOB = (() => {
  const map = {};
  Object.entries(BOARD_JOB_CATALOG).forEach(([jobKey, job]) => {
    const sections = Array.isArray(job.sections)
      ? job.sections
      : [{ id: "default", label: "Tous", icons: job.icons || [] }];
    sections.forEach((section) =>
      (section.icons || []).forEach((iconKey) => {
        if (!map[iconKey]) map[iconKey] = jobKey;
      }),
    );
  });
  return map;
})();

export const ICON_TO_RUBRIC = (() => {
  const map = {};
  Object.entries(BOARD_JOB_CATALOG).forEach(([jobKey, job]) => {
    const sections = Array.isArray(job.sections)
      ? job.sections
      : [{ id: "default", label: "Tous", icons: job.icons || [] }];
    map[jobKey] = {};
    sections.forEach((section) => {
      (section.icons || []).forEach((iconKey) => {
        if (!map[jobKey][iconKey]) map[jobKey][iconKey] = section.id;
      });
    });
  });
  return map;
})();
