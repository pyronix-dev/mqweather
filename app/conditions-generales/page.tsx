import Link from "next/link"

export const metadata = {
  title: "CGV/CGU – Météo Martinique",
  robots: "noindex, follow",
}

export default function ConditionsGenerales() {
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
          Conditions Générales de Vente et d'Utilisation (CGV/CGU) – Météo Martinique
        </h1>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">1. À propos de nous</h2>
          <p className="text-slate-600 leading-relaxed">
            La société <strong>Météo Martinique</strong>, au capital de <strong>2 750 euros</strong>, dont le siège
            social est situé <strong>Chemin Raynal – 31200 Toulouse (France)</strong>, immatriculée au{" "}
            <strong>Registre du Commerce et des Sociétés de Toulouse</strong>, représentée par{" "}
            <strong>Monsieur Arnaud BILAL</strong>, (ci-après « la Société »), propose des services en lien avec la
            météorologie en Martinique, incluant notamment la diffusion de contenus météo, des informations et
            éventuellement des services numériques associés (abonnements, options premium, produits digitaux,
            publicités, partenariats, ou toute autre offre présentée sur le site).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">2. Objet et champ d'application</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les présentes Conditions Générales de Vente et d'Utilisation (ci-après « CGV/CGU ») régissent les relations
            contractuelles entre la Société et tout Client (professionnel ou particulier) souhaitant bénéficier des
            services proposés via le site <strong>www.meteo-martinique.fr</strong> (ci-après « le Site »).
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Toute commande ou utilisation de Service implique l'adhésion pleine et entière du Client aux présentes
            CGV/CGU, à l'exclusion de tout autre document.
          </p>
          <p className="text-slate-600 leading-relaxed">
            La Société se réserve le droit de modifier les présentes à tout moment. Les conditions applicables sont
            celles en vigueur à la date de la commande.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">3. Définitions</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>
              <strong>Client</strong> : toute personne physique ou morale commandant une prestation, un accès payant ou
              un service sur le Site.
            </li>
            <li>
              <strong>Service(s)</strong> : services numériques proposés par Météo Martinique, incluant notamment des
              contenus météo, des options premium, abonnements, produits digitaux, ou services complémentaires décrits
              sur le Site.
            </li>
            <li>
              <strong>Commande</strong> : toute demande validée par le Client donnant lieu à paiement.
            </li>
            <li>
              <strong>Utilisateur</strong> : toute personne consultant le Site, qu'elle soit ou non cliente.
            </li>
            <li>
              <strong>Société</strong> : désigne Météo Martinique telle que définie à l'article 1.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">4. Inscription et accès au Site</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            L'accès à certains Services peut nécessiter la création d'un compte sur le Site. L'inscription est ouverte à
            toute personne majeure et juridiquement capable.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Le Client s'engage à fournir des informations exactes et à jour. Chaque compte est strictement personnel et
            confidentiel. La Société ne saurait être tenue responsable en cas d'usurpation d'identité ou d'utilisation
            frauduleuse du compte.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">5. Description des services</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les Services proposés par <strong>Météo Martinique</strong> peuvent inclure notamment :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>accès à des contenus et prévisions météo, bulletins, analyses et tendances ;</li>
            <li>consultation d'informations publiques et/ou spécialisées relatives à la météo en Martinique ;</li>
            <li>alertes, notifications, ou informations contextualisées ;</li>
            <li>
              services payants (ex : abonnement premium, contenus exclusifs, accès sans publicité, outils avancés, etc.)
              si proposés sur le Site.
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            Les caractéristiques essentielles de chaque Service sont présentées sur le Site.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">6. Tarifs et modalités de commande</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les prix des Services payants sont exprimés en euros (€), toutes taxes comprises (TTC). La Société se
            réserve le droit de modifier ses tarifs à tout moment, mais s'engage à appliquer les prix en vigueur au
            moment de la commande.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">Toute commande est validée après :</p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>acceptation expresse des présentes CGV/CGU ;</li>
            <li>validation du paiement intégral par carte bancaire (ou autre moyen disponible sur le Site).</li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            Une confirmation de commande est envoyée par e-mail au Client. Le contrat est réputé conclu dès cette
            confirmation.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">7. Modalités de paiement</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les paiements sont effectués comptant, par carte bancaire via une plateforme sécurisée.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            En cas de défaut de paiement ou de rejet de transaction, la Société se réserve le droit de suspendre l'accès
            au Service jusqu'à régularisation.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les retards de paiement pour les Clients professionnels entraîneront l'application :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>d'intérêts de retard au taux de la BCE majoré de 10 points (article L441-10 du Code de commerce) ;</li>
            <li>et d'une indemnité forfaitaire de 40 € pour frais de recouvrement.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
            8. Exécution des prestations / accès aux services
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            L'accès aux Services payants débute dès la validation du paiement.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            La Société s'engage à mettre en œuvre tous les moyens nécessaires pour fournir les Services, sans obligation
            de résultat, notamment en raison de la nature des informations météorologiques (données dépendantes de
            sources externes et de modèles de prévision).
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Le Client s'engage à fournir toutes les informations nécessaires si un Service le requiert (ex : e-mail
            valide, paramètres, etc.). Tout retard ou omission dans la communication de ces éléments peut suspendre
            l'exécution ou l'accès aux Services.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            La Société ne peut être tenue responsable des retards ou dysfonctionnements dus à :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>un manque de coopération du Client,</li>
            <li>un événement extérieur indépendant de sa volonté,</li>
            <li>
              ou un incident technique lié à des prestataires tiers (hébergeur, fournisseurs de données météo, réseaux,
              etc.).
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">9. Réclamations</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Toute réclamation doit être formulée par écrit dans un délai de <strong>7 jours</strong> à compter de la
            fourniture du Service ou de l'accès, à l'adresse e-mail suivante :{" "}
            <a href="mailto:bonjour@meteo-martinique.fr" className="text-slate-800 underline">
              bonjour@meteo-martinique.fr
            </a>
          </p>
          <p className="text-slate-600 leading-relaxed">
            La Société analysera chaque demande de bonne foi. En cas de dysfonctionnement avéré, une solution
            corrective, un prolongement d'accès ou un geste commercial pourra être proposé, sans obligation de
            remboursement sauf mention contraire prévue par la loi.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
            10. Droit de rétractation et absence de remboursement
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Conformément à l'article <strong>L221-28</strong> du Code de la consommation, le droit de rétractation ne
            s'applique pas notamment :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>aux contenus numériques fournis immédiatement après achat,</li>
            <li>aux prestations exécutées avant la fin du délai de rétractation,</li>
            <li>aux services pleinement exécutés avant la fin du délai de rétractation, avec accord du Client.</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mb-4">
            Lorsque le Client commande un Service numérique (accès premium, contenu digital, abonnement activé
            immédiatement), il reconnaît que l'exécution commence dès validation du paiement et renonce, le cas échéant,
            à son droit de rétractation.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Aucun remboursement, total ou partiel, ne sera accordé après validation de la commande, sauf en cas
            d'impossibilité totale d'exécution imputable à la Société.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">11. Données personnelles (RGPD)</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            La Société collecte et traite les données personnelles des Utilisateurs conformément au Règlement (UE)
            2016/679 (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">Les données collectées sont nécessaires à :</p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>la gestion des commandes,</li>
            <li>la communication avec le Client,</li>
            <li>l'amélioration du site et des Services.</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mb-4">
            Le Client peut exercer ses droits d'accès, de rectification et de suppression en écrivant à :{" "}
            <a href="mailto:bonjour@meteo-martinique.fr" className="text-slate-800 underline">
              bonjour@meteo-martinique.fr
            </a>
          </p>
          <p className="text-slate-600 leading-relaxed">
            Les données ne sont ni revendues, ni transférées à des tiers sans consentement, sauf obligation légale.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">12. Cookies</h2>
          <p className="text-slate-600 leading-relaxed">
            Le Site utilise des cookies afin d'améliorer l'expérience utilisateur. L'Utilisateur peut configurer son
            navigateur pour bloquer ou supprimer les cookies, mais certaines fonctionnalités peuvent alors être
            limitées.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">13. Responsabilité</h2>
          <p className="text-slate-600 leading-relaxed mb-4">La Société n'est tenue que d'une obligation de moyens.</p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les informations, données météorologiques, prévisions, tendances, alertes, contenus, services et outils
            proposés sur le Site <strong>www.meteo-martinique.fr</strong> sont fournis{" "}
            <strong>à titre indicatif</strong>, sur la base de sources pouvant évoluer, et{" "}
            <strong>ne peuvent être garantis comme exacts, exhaustifs ou mis à jour en temps réel</strong>.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            En conséquence, ces informations <strong>ne sauraient engager la responsabilité de Météo Martinique</strong>
            , notamment en cas :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>d'erreur, d'omission, d'inexactitude ou de retard de mise à jour,</li>
            <li>de divergence entre les prévisions affichées et la météo réellement observée,</li>
            <li>
              de dommages directs ou indirects résultant de l'utilisation, de l'interprétation ou de la confiance
              accordée aux informations publiées,
            </li>
            <li>
              de conséquences liées à une décision prise par l'Utilisateur (déplacements, activités nautiques,
              randonnées, événements extérieurs, etc.).
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed mb-4">
            L'Utilisateur reconnaît utiliser le Site sous sa seule responsabilité. Il lui appartient de vérifier les
            informations avant toute décision importante et d'adapter son comportement aux conditions réelles
            constatées.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            <strong>
              Pour les bulletins officiels, alertes, vigilances météorologiques et consignes de sécurité, l'Utilisateur
              est invité à se référer exclusivement aux sites et communications des autorités compétentes
            </strong>
            , notamment :
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
            <li>
              <strong>Météo-France</strong> (vigilance, bulletins officiels),
            </li>
            <li>
              <strong>La Préfecture de Martinique</strong>,
            </li>
            <li>
              <strong>Les services de secours et autorités locales</strong>.
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            La Société ne pourra être tenue responsable en cas de dysfonctionnement résultant de l'intervention d'un
            tiers (fournisseur de données, hébergeur, opérateur internet, etc.).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">14. Propriété intellectuelle</h2>
          <p className="text-slate-600 leading-relaxed">
            L'ensemble des éléments du Site (textes, logos, charte graphique, contenus, visuels) est protégé par le Code
            de la propriété intellectuelle. Toute reproduction, diffusion ou utilisation non autorisée expose son auteur
            à des poursuites civiles et pénales.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">15. Modifications des CGV/CGU</h2>
          <p className="text-slate-600 leading-relaxed">
            Météo Martinique se réserve le droit de modifier les présentes à tout moment. La version applicable est
            celle publiée sur le Site au jour de la commande.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
            16. Droit applicable et juridiction compétente
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Les présentes CGV/CGU sont soumises au droit français. Tout litige sera soumis, à défaut d'accord amiable,
            aux tribunaux compétents de <strong>Toulouse (France)</strong>.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Le Client consommateur peut recourir à un médiateur indépendant via le site officiel :{" "}
            <a
              href="https://www.mediateurfevad.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 underline"
            >
              www.mediateurfevad.fr
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">17. Contact</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <p className="text-slate-600">
              <strong>Météo Martinique</strong>
              <br />
              Chemin Raynal – 31200 Toulouse
              <br />
              <a href="mailto:bonjour@meteo-martinique.fr" className="text-slate-800 underline">
                bonjour@meteo-martinique.fr
              </a>
              <br />
              <a
                href="https://www.meteo-martinique.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-800 underline"
              >
                www.meteo-martinique.fr
              </a>
            </p>
          </div>

          <p className="text-sm text-slate-500 mt-4">
            Dernière mise à jour : <em>17/01/2026</em>
          </p>
        </section>
      </div>
    </main>
  )
}
