// Génère un contrat de prestation B2B à partir d'une mission + d'un nomade.
// Reflète docs/03 : relation par livrables, aucune subordination/horaire imposé,
// multi-client, PI cédée au paiement, continuité (Binôme). NON juridique.

export type ContractInput = {
  reference: string;
  date: string;
  companyName: string;
  nomadHeadline: string;
  nomadLocation: string;
  missionTitle: string;
  brief: string;
  vertical: string;
  budgetEur: number | null;
  overlapWindow: string;
  role: "primary" | "backup";
};

const VLABEL: Record<string, string> = {
  video: "Vidéo / montage",
  dev: "Dev / no-code / product",
  growth: "Marketing / growth / contenu",
};

export function buildMissionContract(i: ContractInput): string {
  const budget = i.budgetEur != null ? `${i.budgetEur} € HT / mois` : "à convenir entre les Parties";
  const overlap = i.overlapWindow || "à convenir entre les Parties";
  const vertical = VLABEL[i.vertical] ?? i.vertical ?? "prestation";

  return `CONTRAT DE PRESTATION DE SERVICES B2B
Référence : ${i.reference}
Date : ${i.date}

ENTRE LES SOUSSIGNÉS
• Le Client : ${i.companyName} (ci-après « le Client ») ;
• Le Prestataire : travailleur indépendant — ${i.nomadHeadline}, basé à ${i.nomadLocation} (ci-après « le Prestataire ») ;
mis en relation via la plateforme Latitude, tiers de confiance.

Rôle dans la mission : ${i.role === "backup" ? "Binôme (redondance / continuité de service)" : "Prestataire principal"}.

ARTICLE 1 — OBJET
Le Prestataire réalise, en toute indépendance, une prestation de ${vertical} :
« ${i.missionTitle} ».
La prestation est définie par LIVRABLES :
${i.brief || "Livrables précisés dans l'annexe technique."}

ARTICLE 2 — INDÉPENDANCE & ABSENCE DE SUBORDINATION
Le Prestataire est un indépendant : il organise librement l'exécution de la prestation.
Le présent contrat exclut tout lien de subordination. Le Client NE PEUT PAS imposer d'horaires
de travail. Le Prestataire reste libre de travailler pour d'autres clients. La relation est
régie par les RÉSULTATS (livrables), non par le temps de présence.

ARTICLE 3 — FENÊTRE DE CHEVAUCHEMENT
Les Parties conviennent librement d'une fenêtre de disponibilité commune (non imposée) :
${overlap}. Il s'agit d'une simple modalité de collaboration asynchrone.

ARTICLE 4 — RÉMUNÉRATION & FACTURATION
Rémunération : ${budget}. Le Prestataire facture le Client en qualité d'indépendant.
Les paiements transitent par Latitude (séquestre), libérés à la validation des livrables.

ARTICLE 5 — PROPRIÉTÉ INTELLECTUELLE
Les droits sur les livrables sont cédés au Client au fur et à mesure de leur PAIEMENT intégral.

ARTICLE 6 — CONFIDENTIALITÉ & RGPD
Chaque Partie s'engage à la confidentialité des informations échangées et au respect du RGPD.

ARTICLE 7 — CONTINUITÉ (BINÔME)
En cas d'indisponibilité du Prestataire principal, Latitude peut activer un Binôme briefé pour
assurer la continuité de service, sans interruption pour le Client.

ARTICLE 8 — DURÉE & RÉSILIATION
Effet à la date ci-dessus, pour la durée de la mission. Chaque Partie peut y mettre fin moyennant
un préavis raisonnable, sans préjudice des livrables en cours.

ARTICLE 9 — LOI APPLICABLE
Droit français. Tout litige passe par la médiation de Latitude avant toute action contentieuse.

—
⚠️ Document généré automatiquement par Latitude, à des fins de démonstration. Il NE CONSTITUE PAS
un conseil juridique et doit être validé par un conseil qualifié avant signature.`;
}
