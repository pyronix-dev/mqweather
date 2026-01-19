import Link from "next/link"

export const metadata = {
  title: "Politique de confidentialité – Météo Martinique",
  robots: "noindex, follow",
}

export default function Confidentialite() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l'accueil
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-8">
          Politique de confidentialité – www.meteo-martinique.fr
        </h1>

        <p className="text-slate-600 leading-relaxed mb-8">
          La présente politique de confidentialité explique comment <strong>Météo Martinique</strong> (ci-après « nous
          ») collecte, utilise et protège vos données personnelles lorsque vous utilisez le site{" "}
          <strong>www.meteo-martinique.fr</strong> (ci-après « le Site »).
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-10">
          <p>
            <strong>Responsable du traitement :</strong> Météo Martinique
          </p>
          <p>
            <strong>Adresse :</strong> Chemin Raynal – 31200 Toulouse – France
          </p>
          <p>
            <strong>Contact :</strong>{" "}
            <a href="mailto:bonjour@meteo-martinique.fr" className="text-slate-800 underline">
              bonjour@meteo-martinique.fr
            </a>
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">1. Données que nous collectons</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Selon votre utilisation du Site, nous pouvons collecter les catégories de données suivantes :
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">1.1 Données fournies volontairement</h3>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>Nom / prénom (si vous le renseignez)</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone (si vous le renseignez)</li>
            <li>Contenu de votre message (formulaire de contact, e-mail)</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">1.2 Données collectées automatiquement</h3>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>Données techniques : adresse IP, type de navigateur, système d'exploitation, type d'appareil</li>
            <li>Données de navigation : pages consultées, date/heure de visite, durée de consultation, provenance</li>
            <li>Données liées aux cookies et traceurs (voir section Cookies)</li>
          </ul>

          <p className="text-slate-600 leading-relaxed">
            <strong>Nous ne collectons pas de données sensibles</strong> (origine, opinions politiques, religion, santé,
            etc.).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">2. Finalités de la collecte</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Nous utilisons vos données personnelles uniquement pour :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>Répondre à vos demandes (formulaire de contact / e-mail)</li>
            <li>Assurer le bon fonctionnement, la sécurité et la maintenance du Site</li>
            <li>Mesurer l'audience et améliorer le contenu et l'expérience utilisateur</li>
            <li>Vous envoyer des informations si vous y avez consenti (ex : newsletter, alertes e-mail, offres)</li>
            <li>Gérer des Services payants éventuels (commande, facturation, support)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">3. Bases légales (RGPD)</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Le traitement de vos données repose sur une ou plusieurs des bases légales suivantes :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>
              <strong>Votre consentement</strong> (ex : newsletter, certains cookies, formulaire)
            </li>
            <li>
              <strong>L'exécution d'un contrat</strong> (ex : fourniture d'un service payant, support client)
            </li>
            <li>
              <strong>L'intérêt légitime</strong> (sécurité, amélioration du Site, statistiques d'audience non
              excessives)
            </li>
            <li>
              <strong>Une obligation légale</strong> (ex : obligations comptables si vente)
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">4. Destinataires des données</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Vos données sont destinées à <strong>Météo Martinique</strong> et peuvent être accessibles à des
            prestataires techniques strictement nécessaires au fonctionnement du Site (ex : hébergement, outils de
            mesure d'audience, emailing), dans la limite de leurs missions.
          </p>
          <p className="text-slate-600 leading-relaxed font-semibold">Nous ne vendons jamais vos données.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">5. Transferts hors Union Européenne</h2>
          <p className="text-slate-600 leading-relaxed">
            Certains outils (ex : mesure d'audience, services d'emailing) peuvent entraîner un traitement de données en
            dehors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont mises en
            place (ex : clauses contractuelles types, mesures de sécurité).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">6. Durées de conservation</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Nous conservons vos données uniquement pendant la durée nécessaire aux finalités :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>
              <strong>Contact / demandes :</strong> 12 mois maximum après le dernier échange
            </li>
            <li>
              <strong>Données commerciales (si services payants) :</strong> 3 ans après le dernier contact / relation
            </li>
            <li>
              <strong>Données de facturation :</strong> durée légale applicable (obligations comptables)
            </li>
            <li>
              <strong>Cookies et traceurs :</strong> 13 mois maximum (selon configuration et consentement)
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">7. Vos droits</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>Droit d'accès</li>
            <li>Droit de rectification</li>
            <li>Droit d'effacement (« droit à l'oubli »)</li>
            <li>Droit d'opposition</li>
            <li>Droit de limitation</li>
            <li>Droit à la portabilité</li>
            <li>Droit de retrait du consentement à tout moment (pour les traitements fondés sur le consentement)</li>
          </ul>

          <p className="text-slate-600 leading-relaxed mb-2">
            Pour exercer vos droits, contactez-nous :{" "}
            <a href="mailto:bonjour@meteo-martinique.fr" className="text-slate-800 underline">
              bonjour@meteo-martinique.fr
            </a>
          </p>
          <p className="text-slate-500 text-sm mb-4">
            Pour des raisons de sécurité, une preuve d'identité peut être demandée en cas de doute sur l'identité du
            demandeur.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Vous pouvez également introduire une réclamation auprès de la CNIL :{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 underline"
            >
              www.cnil.fr
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">8. Sécurité</h2>
          <p className="text-slate-600 leading-relaxed">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
            (accès restreint, mesures de sécurité serveur, chiffrement SSL, etc.). Malgré ces efforts, aucun système
            n'offre une sécurité absolue.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">9. Cookies et traceurs</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Le Site peut utiliser des cookies et/ou technologies similaires. Un cookie est un petit fichier stocké sur
            votre appareil permettant notamment de faciliter la navigation et de mesurer l'audience.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">9.1 Types de cookies</h3>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>
              <strong>Cookies techniques</strong> : indispensables au fonctionnement du Site
            </li>
            <li>
              <strong>Cookies de mesure d'audience</strong> : statistiques de fréquentation (ex : Google Analytics ou
              équivalent, si activé)
            </li>
            <li>
              <strong>Cookies fonctionnels</strong> : mémorisation de préférences (langue, choix d'affichage…)
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">9.2 Gestion du consentement</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Selon la configuration du Site, vous pouvez accepter/refuser les cookies via un bandeau de consentement.
            Vous pouvez également gérer les cookies depuis votre navigateur.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
            <p className="font-semibold mb-2">Paramétrage (exemples) :</p>
            <p>Chrome : Paramètres → Confidentialité et sécurité → Cookies</p>
            <p>Firefox : Options → Vie privée → Cookies</p>
            <p>Safari : Préférences → Confidentialité</p>
            <p>Edge : Paramètres → Cookies et autorisations de site</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
            10. Services météo : informations indicatives
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les informations, données météorologiques, prévisions, tendances, alertes, contenus et outils proposés sur
            le Site sont fournis <strong>à titre indicatif</strong>. Elles sont issues de sources susceptibles d'évoluer
            et ne peuvent être garanties comme exactes, exhaustives ou mises à jour en temps réel.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            En conséquence, l'utilisation du Site et des informations publiées se fait sous la seule responsabilité de
            l'Utilisateur. <strong>Météo Martinique ne saurait être tenue responsable</strong> des décisions prises sur
            la base des informations fournies ni des dommages directs ou indirects qui pourraient en résulter.
          </p>
          <p className="text-slate-600 leading-relaxed">
            <strong>
              Pour les bulletins officiels, vigilances et consignes de sécurité, référez-vous exclusivement aux sites
              officiels
            </strong>
            , notamment <strong>Météo-France</strong>, la <strong>Préfecture de Martinique</strong> et les autorités
            locales.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">11. Liens vers des sites tiers</h2>
          <p className="text-slate-600 leading-relaxed">
            Le Site peut contenir des liens vers des sites tiers. Nous ne contrôlons pas ces sites et ne sommes pas
            responsables de leurs pratiques ou politiques de confidentialité. Nous vous recommandons de consulter leurs
            documents dédiés.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">12. Mise à jour de la politique</h2>
          <p className="text-slate-600 leading-relaxed">
            Nous pouvons modifier la présente politique de confidentialité à tout moment afin de refléter l'évolution du
            Site, de nos pratiques, ou des obligations légales. La version en vigueur est celle publiée sur cette page.
          </p>
        </section>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p>
            <strong>Contact :</strong>{" "}
            <a href="mailto:bonjour@meteo-martinique.fr" className="text-slate-800 underline">
              bonjour@meteo-martinique.fr
            </a>
          </p>
          <p className="text-sm text-slate-500 mt-2">
            <strong>Dernière mise à jour :</strong> <em>17/01/2026</em>
          </p>
        </div>
      </div>
    </main>
  )
}
