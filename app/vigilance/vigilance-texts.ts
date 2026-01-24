// Developed by Omar Rafik (OMX) - omx001@proton.me
export interface VigilanceContent {
    headline: string;
    description: string;
    showSubscription?: boolean;
    impacts?: string[];
    recommendations?: string[];
    footer?: string;
}

export const VIGILANCE_TEXTS: Record<string, VigilanceContent> = {
    vert: {
        headline: "La Martinique est actuellement placée en vigilance verte.",
        description: `Cela signifie qu’aucun phénomène météorologique dangereux n’est prévu sur le territoire dans l’immédiat et que les conditions restent globalement favorables.

Le temps observé et attendu correspond à une situation météo habituelle pour la saison, avec des conditions généralement stables. Les déplacements et les activités du quotidien peuvent donc se dérouler normalement, tout comme les sorties et les événements en extérieur, sous réserve de respecter les règles élémentaires de prudence.

Cependant, même en vigilance verte, la météo peut évoluer. Il est donc recommandé de rester attentif, notamment en cas d’averses ponctuelles, de rafales isolées ou d’une mer parfois un peu agitée selon les secteurs.`,
        recommendations: [
            "Restez informés via les bulletins météo officiels et les canaux habituels de communication.",
            "Adaptez vos activités extérieures en fonction de l’évolution du temps, surtout en fin de journée ou en zones exposées.",
            "En mer, maintenez les précautions usuelles : vérification du matériel, prudence lors des sorties et respect des consignes de sécurité."
        ],
        footer: "À ce stade, aucune restriction particulière n’est en vigueur et aucune mesure spécifique n’est nécessaire.\nNous vous invitons simplement à conserver une vigilance normale et à suivre les informations qui pourraient être diffusées en cas d’évolution de la situation."
    },
    jaune: {
        headline: "La Martinique est actuellement placée en vigilance jaune.",
        description: `Cela signifie que des phénomènes météorologiques pouvant présenter un risque limité sont possibles sur le territoire. La situation ne nécessite pas de mesures particulières à ce stade, mais elle demande une attention renforcée, notamment lors des activités en extérieur.

Le temps observé et attendu peut être marqué par des conditions moins stables, avec la possibilité d’averses localement soutenues, de rafales ponctuelles ou d’une mer parfois agitée selon les secteurs. Ces phénomènes peuvent entraîner des désagréments (routes glissantes, visibilité réduite, conditions de navigation moins favorables).

Les déplacements et les activités du quotidien peuvent généralement se poursuivre, mais il est recommandé de faire preuve de prudence, en particulier dans les zones exposées et lors des périodes les plus actives.`,
        showSubscription: true,
        footer: "Il est donc conseillé de rester vigilant et de suivre l’évolution de la situation, notamment en consultant régulièrement les bulletins météorologiques officiels.",
        recommendations: [
            "Limitez les activités sensibles à la météo (randonnées, sorties en mer, chantiers en extérieur) si les conditions se dégradent.",
            "Redoublez de prudence sur la route en cas de pluie (aquaplaning, chaussée glissante).",
            "En mer, reportez ou adaptez vos sorties selon l’état de la houle et du vent."
        ]
    },
    orange: {
        headline: "La Martinique est actuellement placée en vigilance orange.",
        description: `Cela signifie que des phénomènes météorologiques dangereux sont prévus sur le territoire et peuvent entraîner des conséquences importantes sur les personnes, les biens et les activités.

La situation météorologique nécessite une grande prudence. Selon l’évolution observée, des conditions dégradées peuvent se manifester par des pluies fortes et persistantes, des orages actifs, des rafales soutenues, ainsi qu’une mer dangereuse ou une dégradation rapide des conditions de circulation.

Dans ce contexte, il est fortement recommandé de limiter les déplacements et de reporter les activités extérieures. Les événements en plein air, les chantiers, les randonnées ainsi que les activités nautiques doivent être évités, en particulier dans les zones exposées.`,
        showSubscription: true,
        impacts: [
            "inondations localisées, ruissellements importants, montée rapide des eaux",
            "chutes d’arbres ou de branches, objets emportés par le vent",
            "coupures d’électricité ou perturbations des réseaux",
            "routes difficiles ou dangereuses, glissements de terrain dans certains secteurs"
        ],
        recommendations: [
            "Restez chez vous autant que possible et évitez toute sortie non indispensable.",
            "Mettez à l’abri les objets pouvant être emportés par le vent (mobilier, bacs, outils).",
            "Ne vous engagez jamais sur une route inondée et évitez les abords des ravines.",
            "Évitez le littoral en cas de houle/mer agitée et ne prenez pas la mer.",
            "Tenez-vous informés en suivant les bulletins météo officiels et les consignes des autorités."
        ],
        footer: "La vigilance orange implique une surveillance renforcée : la situation peut évoluer rapidement.\nIl est donc essentiel de rester attentif aux informations diffusées et d’adapter son comportement en conséquence."
    },
    rouge: {
        headline: "La Martinique est actuellement placée en vigilance rouge.",
        description: `Cela signifie qu’un phénomène météorologique exceptionnel et très dangereux est en cours ou imminent, pouvant entraîner des conséquences majeures pour la population, les infrastructures et les activités.

La situation nécessite une vigilance maximale et le respect strict des consignes de sécurité. Les conditions météorologiques attendues peuvent être particulièrement violentes, avec notamment des pluies torrentielles, des orages très actifs, des rafales intenses, une mer très dangereuse et des risques importants d’inondations, de glissements de terrain et de dégâts matériels.

Dans ce contexte, il est fortement recommandé de rester à l’abri et de limiter strictement tous les déplacements. Toute sortie non indispensable peut mettre votre sécurité en danger. Les activités extérieures, nautiques et les déplacements sur les zones exposées doivent être évités.`,
        showSubscription: true,
        impacts: [
            "inondations soudaines, montée rapide des eaux, ruissellements extrêmes",
            "coupures d’électricité, perturbations des réseaux de communication",
            "routes impraticables, chutes d’arbres, coulées de boue",
            "dangers majeurs sur le littoral, vagues fortes et submersion possible selon les secteurs",
            "risques pour les personnes, notamment en zones vulnérables"
        ],
        recommendations: [
            "Restez confinés et ne vous déplacez qu’en cas d’urgence absolue.",
            "Éloignez-vous des ravines, des rivières, des pentes instables et des zones inondables.",
            "Ne vous engagez jamais sur une route inondée, même partiellement.",
            "Mettez en sécurité vos biens (objets extérieurs, documents importants, matériel sensible).",
            "Évitez totalement le littoral et ne prenez pas la mer.",
            "Suivez les consignes des autorités et les bulletins météo officiels."
        ],
        footer: "La vigilance rouge implique un danger imminent ou en cours. La situation peut évoluer rapidement et exiger des mesures supplémentaires.\nRestez informés en continu et appliquez immédiatement les consignes de sécurité."
    },
    violet: {
        headline: "La Martinique est actuellement placée en vigilance violette.",
        description: `Cela correspond à un niveau d’alerte exceptionnel, indiquant une situation extrêmement dangereuse et imminente. Un phénomène météorologique majeur est en cours ou sur le point de toucher le territoire, nécessitant une mobilisation maximale et l’application immédiate des consignes de sécurité.

Les conditions attendues peuvent être extrêmes, avec des impacts potentiellement très lourds : vents violents, pluies diluviennes, orages intenses, houle dangereuse, risques importants d’inondations rapides, de glissements de terrain, de submersion marine et de dégâts majeurs sur les infrastructures.

Dans ce contexte, il est impératif de rester à l’abri et de stopper toute activité extérieure.
Les déplacements doivent être strictement évités, sauf urgence vitale. Toute sortie peut mettre votre vie en danger.`,
        showSubscription: true,
        impacts: [
            "inondations soudaines et généralisées, montée rapide des eaux",
            "coupures d’électricité, ruptures de communication, réseaux perturbés",
            "routes impraticables, chutes d’arbres, coulées de boue",
            "submersion marine et vagues dangereuses sur le littoral",
            "dégâts importants sur les habitations et infrastructures"
        ],
        recommendations: [
            "Restez confinés et ne sortez sous aucun prétexte non vital.",
            "Éloignez-vous des fenêtres, mettez-vous dans une pièce sûre et protégez-vous des projectiles.",
            "Ne vous engagez pas sur les routes, ne traversez pas les zones inondées.",
            "Évitez ravines, rivières, pentes instables et tout secteur à risque.",
            "N’approchez pas du littoral et ne prenez absolument pas la mer.",
            "Suivez en continu les consignes des autorités et les bulletins météo officiels."
        ],
        footer: "La vigilance violette implique un danger extrême : la situation peut évoluer très rapidement.\nRestez informés en continu et appliquez immédiatement toutes les consignes de sécurité."
    },
    gris: {
        headline: "La Martinique est actuellement placée en vigilance grise.",
        description: `Cela signifie qu’il n’y a pas de phénomène dangereux clairement identifié à cette heure, mais que la situation météo reste incertaine, nécessitant une surveillance attentive. Cette vigilance est généralement utilisée lorsque les conditions peuvent évoluer rapidement ou lorsque des phénomènes localisés sont possibles, sans certitude sur leur intensité.

Le temps observé et attendu peut être marqué par une variabilité importante, avec des averses ponctuelles, des rafales isolées ou une mer parfois agitée selon les zones. Des phénomènes limités mais soudains peuvent provoquer des désagréments localisés (routes glissantes, visibilité réduite, conditions de navigation moins favorables).

Les déplacements et les activités peuvent généralement se poursuivre, mais il est recommandé de rester prudent et de se tenir informé, notamment si vous prévoyez des activités en extérieur ou en mer.`,
        showSubscription: true,
        footer: "Il est conseillé de suivre l’évolution de la situation à travers les bulletins météorologiques officiels et les informations diffusées par les autorités.",
        recommendations: [
            "Restez attentifs à l’évolution du temps, surtout en zones exposées.",
            "Adaptez vos déplacements en cas d’averses ou de rafales ponctuelles.",
            "En mer, maintenez les précautions habituelles et adaptez vos sorties selon l’état de la houle et du vent."
        ]
    },
    erreur: {
        headline: "Données indisponibles",
        description: "Oups, quelque chose ne va pas... Impossible de récupérer les données de vigilance pour le moment.",
        footer: "Veuillez vérifier votre connexion internet ou réessayer plus tard."
    }
}