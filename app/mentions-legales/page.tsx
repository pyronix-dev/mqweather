import Link from "next/link"

export const metadata = {
  title: "Mentions légales – Météo Martinique",
  robots: "noindex, follow",
}

export default function MentionsLegales() {
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
          Mentions légales – www.meteo-martinique.fr
        </h1>

        <p className="text-slate-600 leading-relaxed mb-8">
          L'utilisation du site <strong>www.meteo-martinique.fr</strong> implique l'acceptation pleine et entière des
          présentes mentions légales et de la politique de confidentialité. Ces informations peuvent être modifiées à
          tout moment. Les utilisateurs sont invités à les consulter régulièrement afin de rester informés des
          évolutions.
        </p>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">1. Présentation du site</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Conformément à l'article 6 de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique,
            il est précisé aux utilisateurs du site <strong>www.meteo-martinique.fr</strong> l'identité des différents
            intervenants :
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <p className="font-semibold text-slate-800">Propriétaire :</p>
              <p className="text-slate-600">
                <strong>Météo Martinique</strong>
                <br />
                Chemin Raynal – 31200 Toulouse – France
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Responsable de la publication :</p>
              <p className="text-slate-600">
                Arnaud BILLAL
                <br />
                <a href="mailto:bonjour@meteo-martinique.fr" className="text-slate-800 underline">
                  bonjour@meteo-martinique.fr
                </a>
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Création et développement :</p>
              <p className="text-slate-600">Arnaud BILLAL</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Hébergeur :</p>
              <p className="text-slate-600">
                O2SWITCH
                <br />
                222 Boulevard Gustave Flaubert – 63000 Clermont-Ferrand – France
                <br />
                Site web :{" "}
                <a
                  href="https://www.o2switch.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 underline"
                >
                  www.o2switch.fr
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">2. Conditions générales d'utilisation</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            L'accès au site <strong>www.meteo-martinique.fr</strong> est libre et gratuit. L'utilisation du site
            implique l'acceptation pleine et entière des présentes conditions générales d'utilisation.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Le site est normalement accessible à tout moment. Toutefois, <strong>Météo Martinique</strong> se réserve le
            droit d'interrompre l'accès pour maintenance technique, en s'efforçant d'en informer préalablement les
            utilisateurs.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Ces conditions peuvent être modifiées à tout moment. L'utilisateur est invité à les consulter régulièrement.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">3. Description des services</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Le site <strong>www.meteo-martinique.fr</strong> a pour objectif de fournir des informations météorologiques
            relatives à la Martinique (prévisions, tendances, informations générales, alertes et contenus associés).
          </p>
          <p className="text-slate-600 leading-relaxed">
            L'éditeur s'efforce de fournir des informations à jour et exactes, mais ne peut garantir l'exactitude, la
            complétude ou la mise à jour permanente des contenus. Ces informations sont données à titre indicatif et
            peuvent évoluer à tout moment sans préavis.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">4. Propriété intellectuelle</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Tous les éléments du site (textes, images, graphismes, logos, icônes, sons, logiciels, etc.) sont la
            propriété exclusive de <strong>Météo Martinique</strong> ou font l'objet d'une autorisation d'utilisation.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, du contenu
            du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de{" "}
            <strong>Météo Martinique</strong>.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Toute exploitation non autorisée du site ou de son contenu sera considérée comme constitutive d'une
            contrefaçon et poursuivie conformément aux articles L.335-2 et suivants du Code de la propriété
            intellectuelle.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">5. Limitations de responsabilité</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            <strong>Météo Martinique</strong> ne pourra être tenue responsable :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>des dommages matériels liés à l'utilisation du site,</li>
            <li>d'un accès au site à l'aide d'un matériel obsolète, non sécurisé ou infecté par un virus,</li>
            <li>des interruptions de service pour maintenance ou mise à jour,</li>
            <li>
              ou encore de tout dommage indirect (perte de marché, perte de chance, etc.) résultant de l'utilisation du
              site.
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            Les espaces interactifs (formulaire de contact, etc.) sont mis à la disposition des utilisateurs.{" "}
            <strong>Météo Martinique</strong> se réserve le droit de supprimer sans préavis tout contenu contrevenant à
            la législation française.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">6. Politique de confidentialité (RGPD)</h2>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">6.1 Données collectées</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Lors de votre navigation sur <strong>www.meteo-martinique.fr</strong>, nous pouvons collecter certaines
            données :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>
              <strong>Informations techniques :</strong> adresse IP, navigateur, appareil, pages visitées, durée de
              consultation, etc.
            </li>
            <li>
              <strong>Informations de contact :</strong> nom, adresse e-mail, numéro de téléphone, et tout autre
              renseignement que vous fournissez volontairement via un formulaire.
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            Aucune donnée sensible (origine raciale, opinions politiques, santé, etc.) n'est collectée.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">6.2 Finalité du traitement</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les données personnelles collectées ont pour finalités :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>le traitement des demandes formulées via le formulaire de contact,</li>
            <li>la gestion des relations utilisateurs,</li>
            <li>l'amélioration du site et de l'expérience utilisateur,</li>
            <li>l'envoi de communications commerciales ou informatives (uniquement sur consentement préalable).</li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            Les données ne sont utilisées qu'à des fins internes et ne sont jamais revendues à des tiers.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">6.3 Base légale du traitement</h3>
          <p className="text-slate-600 leading-relaxed mb-4">Le traitement des données personnelles repose sur :</p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>le consentement explicite de l'utilisateur (formulaire de contact, newsletter, etc.),</li>
            <li>
              l'intérêt légitime de <strong>Météo Martinique</strong> pour améliorer ses services et sa communication,
            </li>
            <li>et le respect des obligations légales applicables.</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">6.4 Durée de conservation</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les données sont conservées pendant la durée strictement nécessaire à la réalisation des finalités pour
            lesquelles elles ont été collectées :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>
              <strong>Données du formulaire de contact :</strong> 12 mois maximum après le dernier échange,
            </li>
            <li>
              <strong>Données commerciales :</strong> 3 ans maximum après le dernier contact,
            </li>
            <li>
              <strong>Cookies et données analytiques :</strong> 13 mois maximum.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">6.5 Droits des utilisateurs</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>Droit d'accès à vos données,</li>
            <li>Droit de rectification ou de suppression,</li>
            <li>Droit d'opposition et de retrait du consentement,</li>
            <li>Droit à la portabilité de vos données,</li>
            <li>Droit à la limitation du traitement.</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mb-2">
            Pour exercer ces droits, il vous suffit d'adresser un e-mail à :{" "}
            <a href="mailto:bonjour@meteo-martinique.fr" className="text-slate-800 underline">
              bonjour@meteo-martinique.fr
            </a>
          </p>
          <p className="text-slate-600 leading-relaxed">
            ou un courrier postal à : Météo Martinique – Chemin Raynal – 31200 Toulouse – France
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Toute demande doit être accompagnée d'une pièce d'identité valide.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">6.6 Sécurité des données</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            <strong>Météo Martinique</strong> met en œuvre toutes les mesures techniques et organisationnelles
            nécessaires pour assurer la sécurité, la confidentialité et l'intégrité des données collectées (serveur
            sécurisé, chiffrement SSL, mots de passe robustes, etc.).
          </p>
          <p className="text-slate-600 leading-relaxed">
            En cas de violation de données, les autorités compétentes et les utilisateurs concernés seront informés
            conformément à la réglementation en vigueur.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">6.7 Cookies</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Le site <strong>www.meteo-martinique.fr</strong> utilise des cookies afin d'améliorer votre expérience
            utilisateur et d'analyser la fréquentation du site.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">Ces cookies peuvent être :</p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>
              <strong>techniques</strong> (indispensables au fonctionnement du site),
            </li>
            <li>
              <strong>analytiques</strong> (Google Analytics ou équivalent),
            </li>
            <li>
              <strong>fonctionnels</strong> (pour mémoriser vos préférences de navigation).
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed mb-4">
            Vous pouvez à tout moment accepter ou refuser les cookies via le bandeau d'information ou les paramètres de
            votre navigateur.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
            <p className="font-semibold mb-2">Paramétrage des cookies :</p>
            <p>Chrome : Menu → Paramètres → Confidentialité et sécurité → Cookies.</p>
            <p>Firefox : Menu → Options → Vie privée → Cookies.</p>
            <p>Safari : Menu → Préférences → Confidentialité.</p>
            <p>Edge : Paramètres → Cookies et autorisations de site.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">7. Liens hypertextes</h2>
          <p className="text-slate-600 leading-relaxed">
            Le site <strong>www.meteo-martinique.fr</strong> peut contenir des liens vers d'autres sites.{" "}
            <strong>Météo Martinique</strong> ne peut être tenue responsable du contenu de ces sites externes ni des
            dommages résultant de leur consultation.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
            8. Droit applicable et juridiction compétente
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Tout litige relatif à l'utilisation du site <strong>www.meteo-martinique.fr</strong> est soumis au droit
            français. La juridiction compétente est celle des tribunaux de Paris.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">9. Textes de référence</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>Loi n°78-17 du 6 janvier 1978 modifiée, dite « Informatique et Libertés »</li>
            <li>Loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique</li>
            <li>Règlement (UE) 2016/679 du 27 avril 2016 (RGPD)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">10. Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            Pour toute question relative aux mentions légales ou à la politique de confidentialité, vous pouvez nous
            contacter à l'adresse suivante :
            <br />
            <a href="mailto:bonjour@meteo-martinique.fr" className="text-slate-800 underline">
              bonjour@meteo-martinique.fr
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
