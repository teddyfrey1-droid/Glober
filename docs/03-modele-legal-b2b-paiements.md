# 03 — Modèle légal B2B & paiements

> ⚠️ **Ce document n'est pas un conseil juridique.** C'est une note de structuration produit à **faire valider par un avocat** (droit du travail FR + droit international + fiscalité) avant toute mise en production.

## 1. Principe directeur : 100 % B2B

Le nomade **facture en tant qu'indépendant** (entreprise/structure locale) à l'entreprise cliente, via Latitude. **Aucun lien de salariat** n'est créé, ni avec Latitude, ni avec le client.

La conformité n'est pas une rustine : c'est une **contrainte de design** intégrée au produit.

## 2. Le risque n°1 : la requalification en salariat déguisé (FR)

En droit français, une relation peut être requalifiée en contrat de travail si l'on caractérise un **lien de subordination**, indépendamment de l'intitulé du contrat. Les indices classiques :

- **Horaires imposés** par le client
- **Lieu de travail imposé** / intégration dans les locaux
- **Exclusivité** de fait (un seul donneur d'ordre)
- **Pouvoir de direction et de sanction** (instructions détaillées, contrôle hiérarchique)
- **Fourniture des outils** et intégration dans l'organisation

## 3. Comment Latitude neutralise ce risque *par design*

| Risque | Garde-fou produit | Implémentation |
|--------|-------------------|----------------|
| Horaires imposés | **Interdits dans le produit.** On ne capture jamais d'« horaires ». | Le modèle de données n'a **aucun champ `horaires`** — uniquement une **`overlap_window` négociée** (fenêtre de chevauchement). Cf. `docs/06`. |
| Lien de subordination | Relation **par livrables**, pas par temps | Les missions sont décrites en livrables/jalons ; UI orientée résultats |
| Exclusivité | **Multi-client encouragé** | Le profil peut servir plusieurs clients ; le produit le valorise |
| Pouvoir de sanction | Pas de hiérarchie : une **notation mutuelle** structurée | Reviews bilatérales (cf. Nomad Score), pas de « management » |
| Intégration | Indépendant fournissant un service | Contrat de prestation B2B, facturation indépendante |

> **Règle d'or produit** : *aucune fonctionnalité ne doit permettre au client d'imposer un horaire.* On négocie une **fenêtre de chevauchement** (« 3 h communes/jour pour les syncs »), jamais un planning.

## 4. Architecture contractuelle (« coffre-fort de conformité »)

Trois niveaux, **générés automatiquement** :

1. **CGU / contrat-cadre Latitude ↔ Entreprise** (abonnement, commission, responsabilités).
2. **CGU / contrat-cadre Latitude ↔ Nomade** (indépendant, notation, paiements, anti-désintermédiation).
3. **Contrat de mission B2B Entreprise ↔ Nomade** (par mission) : objet = **livrables**, durée, prix, fenêtre de chevauchement négociée, PI/IP, confidentialité, RGPD, clause de continuité (Binôme).

Mentions clés du contrat de mission : indépendance réaffirmée, absence de subordination, multi-client autorisé, transfert de PI au paiement, juridiction/loi applicable.

## 5. Flux de paiement

```
Entreprise ──(abonnement)──► Stripe Billing ──► Latitude
Entreprise ──(montant mission)──► Stripe Connect (escrow) ──► payout nomade
                                          │
                                          ├─► commission entreprise (Latitude)
                                          ├─► commission nomade (Latitude)
                                          └─► marge FX (Latitude)
```

- **Stripe Billing** : abonnements récurrents (Studio/Continu/Scale).
- **Stripe Connect** : marketplace + **escrow** (séquestre). Les fonds de mission sont retenus puis libérés à la validation du livrable/jalon → protège les deux parties et **sécurise le GMV contre la désintermédiation**.
- **FX** : conversion € → devise locale du nomade ; petite marge transparente.
- **Facturation** : génération automatique des factures (Latitude→Entreprise pour abo/commission ; Nomade→Entreprise pour la prestation).

## 6. TVA & fiscalité internationale (à cadrer avec un fiscaliste)

- **Abonnement & commission** (services Latitude, B2B) : règles TVA UE B2B (autoliquidation intra-UE le cas échéant).
- **Prestation nomade → entreprise FR** : régime dépendant du pays du prestataire (hors UE : importation de services, autoliquidation par le preneur ; à confirmer).
- **Québec / Belgique / Suisse** : règles propres (TPS/TVQ, TVA BE, TVA CH) → à traiter par juridiction.
- ⚠️ Chaque corridor pays-nomade × pays-client doit être validé. On démarre sur un **nombre restreint de corridors** (cf. hubs concentrés, `docs/04`).

## 7. KYC / AML, RGPD & données

- **KYC/AML** : porté par Stripe Connect (vérification d'identité des bénéficiaires de payout).
- **RGPD** : hébergement **Supabase région `eu-west-3` (Paris)**. DPA, minimisation des données, base légale (exécution contractuelle), droits des personnes, durées de conservation.
- **Sécurité** : RLS Postgres (Row Level Security) systématique ; clé **publishable** côté client uniquement (jamais de service-role exposée) ; secrets via variables d'environnement.

## 8. Désintermédiation : défense contractuelle + produit

- **Contractuelle** : clause de non-contournement dans le contrat-cadre nomade (durée définie).
- **Produit** (plus fort que le contrat) : la **valeur est post-intro** — Binôme, escrow, gestion des litiges, paie cross-border, et surtout une **réputation portable (Nomad Score) qui disparaît si on contourne**. On rend le contournement *économiquement perdant*, pas seulement interdit.

## 9. Disclaimer

Rappel : structuration indicative, **non contractuelle et non juridique**. À valider par des conseils qualifiés (droit social FR, droit des contrats, fiscalité internationale, réglementation des paiements) avant lancement commercial.
