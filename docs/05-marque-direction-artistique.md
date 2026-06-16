# 05 — Marque & direction artistique

## 1. Nom : **Latitude**

**Pourquoi Latitude.** Double sens parfait en français :
- la **latitude géographique** → la liberté de travailler d'où l'on veut ;
- « avoir de la **latitude** » → la marge, la liberté d'action **encadrée**.

Le nom dit donc **les deux faces de la marque en un seul mot** : *liberté* **et** *cadre*. Il porte naturellement toute la DA (cartographie, lignes de latitude, fuseaux).

> ⚠️ Vigilance opérationnelle : « Latitude » est un mot courant (Dell Latitude, Latitude Financial…). Prévoir une **recherche d'antériorité de marque** (INPI/EUIPO) et viser un **domaine** dédié (variante ou `.fr`/extension claire) + un **wordmark distinctif** pour l'appropriabilité.

**Pistes écartées (gardées en réserve)** : *Méridien* (risque marque hôtelière Marriott), *Tandem* (déjà très utilisé), *Cairn* (trop abstrait pour une cible B2B).

## 2. Vibe

> **« Liberté ancrée dans le sérieux. »**

**Airbnb** (chaleur, désir, confiance) **× Stripe / Linear** (précision, rigueur, premium).
Jamais le cliché **plage + cocktail**. On vend du **sérieux qui rend libre**, pas des vacances.

## 3. Palette

| Rôle | Nom | Hex | Usage |
|------|-----|-----|-------|
| Fond / texte sombre | **Encre nuit** | `#0E1A2B` | Fonds premium, texte, nav |
| Accent principal | **Corail** | `#FF6B5B` | CTA, accents chauds, désir |
| Accent secondaire | **Ambre** | `#F5A623` | Badges, highlights, jauges |
| Fond clair | **Sable** | `#F7F4EE` | Fonds de sections, respiration |
| Signal positif | **Jade** | `#1FAE8B` | Succès, « Binôme actif », validation |

**Règles d'usage**
- Encre nuit = base sérieuse ; Corail = le seul vrai CTA (rareté = puissance).
- Sable pour aérer (chaleur, pas de blanc clinique).
- Jade réservé aux signaux de confiance/continuité (cohérence sémantique).
- **Contraste AA minimum** : tester Corail/Ambre sur fond clair pour le texte (utiliser Encre nuit pour le texte courant ; Corail surtout sur surfaces, pas en petit texte sur blanc).

### Tokens (préfiguration Tailwind, Phase 1)
```
ink     #0E1A2B
coral   #FF6B5B
amber   #F5A623
sand    #F7F4EE
jade    #1FAE8B
```

## 4. Typographie

- **Titres** : **Space Grotesk** (caractère, précision géométrique, premium « tech »).
- **UI / texte** : **Inter** (lisibilité, neutralité chaleureuse).
- Chargement via **`next/font/google`** (perf + pas de FOUT).
- Hiérarchie : titres serrés (tracking légèrement négatif), corps généreux (interligne confortable).

## 5. Ton de voix

**Tutoiement chaleureux mais exigeant.** On parle à des gens sérieux, on les respecte, on ne les infantilise pas — mais on est chaleureux.

**À faire** ✅
- Phrases courtes, concrètes, orientées bénéfice.
- Assumer l'exigence : « La liberté, ça se gagne. »
- Reframer les objections en atouts : « Ton dev bosse pendant que tu dors, ton bug est réglé à ton réveil. »

**À éviter** ❌
- Jargon corporate, superlatifs creux.
- Imagerie « digital nomad » clichée (plage, cocktail, hamac).
- Promesses non tenues (on vend la **continuité**, on doit la **prouver**).

**Exemples de copy**
- Hero (Entreprise) : *« Un senior au prix d'un junior. Et il ne tombe jamais en panne. »*
- Hero (Nomade) : *« Gagne ta liberté par la rigueur. Des missions premium, un revenu € stable. »*
- Binôme : *« Vol annulé, panne, fièvre ? Un binôme briefé reprend en moins de 4 h. »*
- Time-Sync : *« Le décalage horaire devient ton équipe de nuit. »*

**Tagline principale** : **« La liberté, ça se gagne. »**
Alternatives : *« Ton talent n'a plus de fuseau. »* · *« Le sérieux qui rend libre. »*

## 6. Briques UI signature (pièces maîtresses)

### a) Carte profil « façon Airbnb » (pièce maîtresse du hero)
Composants :
- **Avatar** + nom + métier (verticale).
- **Ville + fuseau** (ex. « Bali · GMT+8 »).
- **Chip Time-Sync** (recouvrement avec le fuseau du client).
- **Nomad Score** : **3 jauges** (ponctualité · qualité · disponibilité).
- **Badges** : « **Premium Nomad** », « **Binôme actif** » (en Jade).
- Mention prix : « **dès X €/mois** ».
- Look : coins arrondis généreux, ombre douce, fond Sable/blanc cassé, accent Corail.

### b) Sélecteur Entreprise / Nomade
- Un **toggle** qui bascule **tout le discours du hero** en un clic (titre, sous-titre, CTA, et la mise en avant de la carte profil).
- État par défaut : **Entreprise** (côté payeur), bascule fluide vers **Nomade**.

## 7. Motif de marque

Fines **lignes de latitude / méridiens** (cartographie) en arrière-plan : discret, premium, sémantiquement juste (géographie + précision). Évite tout pictogramme « avion/valise/plage ».

## 8. Logo (brief Figma — Phase 4)

- Direction : **wordmark** « Latitude » en Space Grotesk customisé + un signe simple évoquant une **ligne de latitude** (trait horizontal traversant un point/globe stylisé).
- Décliné mono (Encre nuit) + accent Corail.
- Variantes : horizontal, icône seule (favicon/app), versions claire/sombre.
- Production des visuels et du logo : **Phase 4** via le connecteur Figma (skill `/figma-use` avant `use_figma`).
