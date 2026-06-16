# 02 — Business model, pricing & unit economics

> ⚠️ Tous les chiffres ci-dessous sont des **hypothèses de travail à valider** par la traction réelle. Ils servent à cadrer le modèle, pas à promettre un résultat.

## 1. Sources de revenus

Latitude combine **trois flux**, dont deux récurrents — c'est ce qui rend le modèle valorisable :

| # | Flux | Nature | Niveau |
|---|------|--------|--------|
| 1 | **Abonnement entreprise** | Récurrent (SaaS) | 290 € / 690 € / devis / mois |
| 2 | **Commission sur mission** | Récurrent (usage) | 10–15 % entreprise + 5–8 % nomade |
| 3 | **Marge FX** | Récurrent (usage) | ~1 % sur les payouts cross-border |
| + | **One-shot** | Ponctuel | Commission majorée (~20 %), sans abo |

On **ne vend pas** de la mise en relation à l'acte : la mise en relation est le début, la **continuité** est le produit.

## 2. Pricing — abonnement entreprise

| Plan | Prix | Inclus | Cible |
|------|------|--------|-------|
| **Studio** | ~290 €/mois | 1 mission active, accès profils vettés, contrats B2B, paiements | Tester Latitude, 1 besoin |
| **Continu** ⭐ | ~690 €/mois | Jusqu'à **3 missions**, **Binôme inclus**, support prioritaire | Cœur de cible récurrent |
| **Scale** | sur devis | Missions illimitées, account manager, SLA, facturation consolidée | Agences / scale-ups |

> Le **Binôme** (redondance < 4 h) est l'argument qui justifie le passage Studio → Continu. C'est notre principal levier d'expansion de revenu (« land & expand »).

## 3. Commission & take rate

Pour chaque mission, Latitude prélève des deux côtés (marketplace classique) + FX :

- **Côté entreprise** : 10–15 % (médiane retenue : **12 %**)
- **Côté nomade** : 5–8 % (médiane retenue : **6 %**)
- **FX** : ~1 % sur le payout sortant

**Take rate « commission » blended ≈ 18–20 % du GMV par mission.**
En ajoutant l'abonnement amorti, le **take rate all-in** d'un compte actif se situe autour de **25–28 %** du GMV (cf. exemple §5).

## 4. Unit economics — exemple chiffré (par mission/mois)

**Hypothèse** : une mission « type » = un nomade facture **2 800 € / mois** à l'entreprise (relation par livrables, équivalent ~mi-temps senior).

| Poste | Calcul | Montant |
|-------|--------|---------|
| GMV (payé par l'entreprise au nomade) | — | **2 800 €** |
| Commission entreprise | 12 % × 2 800 | +336 € |
| Commission nomade | 6 % × 2 800 | +168 € |
| Marge FX | ~1 % × 2 800 | +28 € |
| **Revenu commission / mission** | | **532 €** |
| Abonnement amorti (plan Continu, 3 missions) | 690 / 3 | +230 € |
| **Revenu Latitude / mission active** | | **≈ 762 €** |

**Côté nomade** : encaisse 2 800 − 168 = **2 632 €** (avant ses propres charges locales). Un revenu **excellent** dans la plupart des hubs nomades (Bali, Bangkok, Mexico, Medellín, Lisbonne…), **récurrent et prévisible**.

**Côté entreprise** : un senior pour **2 800 € + commission**, soit ~**3 136 € all-in**, **zéro charge patronale**, vs ~4 000–6 000 € de coût chargé pour un équivalent salarié FR senior. **~40–50 % d'économie** avec une fiabilité garantie.

## 5. ARPA & scénario de cohorte (illustratif)

| Compte | Composition | Revenu mensuel Latitude |
|--------|-------------|-------------------------|
| Studio | abo 290 + 1 mission (532) | **822 €** |
| Continu | abo 690 + 3 missions (3 × 532) | **2 286 €** |

**Scénario à 50 entreprises actives** (60 % Continu / 40 % Studio) :

- 30 Continu × 2 286 € = 68 580 €
- 20 Studio × 822 € = 16 440 €
- **Revenu mensuel ≈ 85 000 €** → **~1,0 M€ de run-rate annuel**
- GMV correspondant : ~110 missions × 2 800 € ≈ **308 000 €/mois** (~3,7 M€/an)
- Take rate all-in ≈ **27 %** du GMV

> Distinction importante : l'**abonnement** est du MRR « pur » ; la **commission** est récurrente mais *usage-based* (dépend du nombre de missions actives). On pilote donc deux métriques : MRR abo **et** GMV récurrent.

## 6. Coûts & marge

| Poste de coût | Ordre de grandeur | Note |
|---------------|-------------------|------|
| Paiement (Stripe Connect/Billing) | ~1,5 % du GMV + frais fixes | Répercuté en partie via la marge FX |
| Réserve « continuité » (Binôme) | ~2–3 % du GMV mis en réserve | Couvre l'activation du backup ; rarement consommé |
| Ops / vetting / support | variable, ↓ avec l'échelle | Coût d'acquisition **supply** (vetting humain) |
| Infra (Supabase, Vercel) | négligeable au démarrage | Scale linéaire et faible |

**Marge brute cible : 70–80 %** (modèle logiciel + ops légères). La réserve Binôme est le poste spécifique à surveiller — il finance la promesse de continuité.

## 7. LTV / CAC (cadre cible)

- **CAC entreprise** : viser quelques centaines à ~1 500 € sur un ICP étroit (contenu + outbound ciblé + bouche-à-oreille). Cf. `docs/04`.
- **CAC nomade** (supply) : surtout du temps de vetting + communautés ; faible en cash.
- **LTV** : ARPA Continu ≈ 2 286 €/mois × marge brute 75 % × durée de vie. Même à **12–18 mois** de rétention, la LTV se chiffre en **dizaines de k€**.
- **Objectifs santé** : **LTV/CAC > 3**, **payback < 6 mois**.

## 8. Leviers de défendabilité du revenu

1. **Récurrence** (abo + missions continues) → prévisibilité, valorisation.
2. **Expansion** (Studio → Continu → Scale) → croissance net-revenue-retention > 100 %.
3. **Anti-désintermédiation** (cf. `docs/03` & `docs/04`) → on protège le GMV : valeur post-intro (Binôme, paie, litiges) + réputation portable perdue si on triche.
4. **Marge FX** → revenu silencieux, structurellement lié au cross-border (notre raison d'être).
