// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ConditionsGenerales({ initialUser }: { initialUser: any }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header initialUser={initialUser} />

      {}
      <div className="bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Conditions Générales (CGV/CGU)
          </h1>
          <p className="text-violet-100 text-lg sm:text-xl font-medium max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            Les règles d'utilisation de nos services et conditions de vente.
          </p>
        </div>
      </div>

      <main className="flex-1 -mt-10 relative z-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-violet-600 transition-colors mb-10 group font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-violet-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              Retour à l'accueil
            </Link>

            <div className="prose prose-slate prose-lg max-w-none">
              <p className="lead text-slate-600 mb-12">
                Les présentes Conditions Générales de Vente et d'Utilisation régissent les relations contractuelles entre la Société <strong>Météo Martinique</strong> et tout utilisateur ou client du site.
              </p>

              <div className="grid gap-12">
                <div className="bg-violet-50 p-6 rounded-2xl border border-violet-100 text-violet-900 grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Société</h3>
                    <p className="text-sm">Météo Martinique</p>
                    <p className="text-sm">Chemin Raynal, 31200 Toulouse</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Objet</h3>
                    <p className="text-sm">Services météorologiques, abonnements, contenus numériques et informations.</p>
                  </div>
                </div>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">1</span>
                    À propos de nous
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    La société <strong>Météo Martinique</strong>, au capital de <strong>2 750 euros</strong>, dont le siège social est situé <strong>Chemin Raynal – 31200 Toulouse (France)</strong>, immatriculée au <strong>Registre du Commerce et des Sociétés de Toulouse</strong>, représentée par <strong>Monsieur Arnaud BILAL</strong>, (ci-après « la Société »), propose des services en lien avec la météorologie en Martinique, incluant notamment la diffusion de contenus météo, des informations et éventuellement des services numériques associés (abonnements, options premium, produits digitaux, publicités, partenariats, ou toute autre offre présentée sur le site).
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">2</span>
                    Objet et champ d'application
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Les présentes Conditions Générales de Vente et d'Utilisation (ci-après « CGV/CGU ») régissent les relations contractuelles entre la Société et tout Client (professionnel ou particulier) souhaitant bénéficier des services proposés via le site <strong>www.meteo-martinique.fr</strong> (ci-après « le Site »).
                  </p>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Toute commande ou utilisation de Service implique l'adhésion pleine et entière du Client aux présentes CGV/CGU, à l'exclusion de tout autre document.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    La Société se réserve le droit de modifier les présentes à tout moment. Les conditions applicables sont celles en vigueur à la date de la commande.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">3</span>
                    Définitions
                  </h2>
                  <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                    <li><strong>Client :</strong> toute personne physique ou morale commandant une prestation, un accès payant ou un service sur le Site.</li>
                    <li><strong>Service(s) :</strong> services numériques proposés par Météo Martinique, incluant notamment des contenus météo, des options premium, abonnements, produits digitaux, ou services complémentaires décrits sur le Site.</li>
                    <li><strong>Commande :</strong> toute demande validée par le Client donnant lieu à paiement.</li>
                    <li><strong>Utilisateur :</strong> toute personne consultant le Site, qu'elle soit ou non cliente.</li>
                    <li><strong>Société :</strong> désigne Météo Martinique telle que définie à l'article 1.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">4</span>
                    Inscription et accès au Site
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    L'accès à certains Services peut nécessiter la création d'un compte sur le Site. L'inscription est ouverte à toute personne majeure et juridiquement capable.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Le Client s'engage à fournir des informations exactes et à jour. Chaque compte est strictement personnel et confidentiel. La Société ne saurait être tenue responsable en cas d'usurpation d'identité ou d'utilisation frauduleuse du compte.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">5</span>
                    Description des services
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">Les Services proposés par <strong>Météo Martinique</strong> peuvent inclure notamment :</p>
                  <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
                    <li>accès à des contenus et prévisions météo, bulletins, analyses et tendances ;</li>
                    <li>consultation d'informations publiques et/ou spécialisées relatives à la météo en Martinique ;</li>
                    <li>alertes, notifications, ou informations contextualisées ;</li>
                    <li>services payants (ex : abonnement premium, contenus exclusifs, accès sans publicité, outils avancés, etc.) si proposés sur le Site.</li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed">Les caractéristiques essentielles de chaque Service sont présentées sur le Site.</p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">6</span>
                    Tarifs et modalités de commande
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Les prix des Services payants sont exprimés en euros (€), toutes taxes comprises (TTC). La Société se réserve le droit de modifier ses tarifs à tout moment, mais s'engage à appliquer les prix en vigueur au moment de la commande.
                  </p>
                  <p className="text-slate-600 leading-relaxed mb-2">Toute commande est validée après :</p>
                  <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4 ml-4">
                    <li>acceptation expresse des présentes CGV/CGU ;</li>
                    <li>validation du paiement intégral par carte bancaire.</li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed">Une confirmation de commande est envoyée par e-mail au Client. Le contrat est réputé conclu dès cette confirmation.</p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">7</span>
                    Modalités de paiement
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Les paiements sont effectués comptant, par carte bancaire via une plateforme sécurisée. En cas de défaut de paiement, la Société se réserve le droit de suspendre l'accès au Service.
                  </p>
                  <div className="bg-violet-50/50 p-4 rounded-xl text-sm text-slate-600">
                    <p><strong>Retards de paiement (Professionnels) :</strong> Intérêts de retard (taux BCE + 10 pts) et indemnité forfaitaire de 40 € pour frais de recouvrement.</p>
                  </div>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">8</span>
                    Exécution des prestations
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    L'accès aux Services payants débute dès la validation du paiement. La Société s'engage à mettre en œuvre tous les moyens nécessaires pour fournir les Services, sans obligation de résultat.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    La Société ne peut être tenue responsable des interruptions liées à un manque de coopération du Client, un événement de force majeure ou un incident technique tiers.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">9</span>
                    Réclamations
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Toute réclamation doit être formulée par écrit dans un délai de <strong>7 jours</strong> à compter de la fourniture du Service à : <a href="mailto:bonjour@meteo-martinique.fr" className="text-violet-600 underline">bonjour@meteo-martinique.fr</a>.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">10</span>
                    Droit de rétractation
                  </h2>
                  <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl text-amber-900">
                    <h3 className="font-bold mb-2">Absence de remboursement (Contenus numériques)</h3>
                    <p className="mb-2">
                      Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement après achat.
                    </p>
                    <p>
                      En validant sa commande de Service numérique immédiat, le Client renonce expressément à son droit de rétractation. Aucun remboursement ne sera accordé après validation, sauf impossibilité technique imputable à la Société.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">11</span>
                    Données personnelles (RGPD)
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    La Société traite les données personnelles conformément au RGPD. Les données sont nécessaires à la gestion des commandes et à l'amélioration des services.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Le Client dispose d'un droit d'accès, de rectification et de suppression via <a href="mailto:bonjour@meteo-martinique.fr" className="text-violet-600 hover:underline">bonjour@meteo-martinique.fr</a>.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">12</span>
                    Cookies
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Le Site utilise des cookies pour améliorer l'expérience utilisateur. L'Utilisateur peut les paramétrer via son navigateur.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">13</span>
                    Responsabilité
                  </h2>

                  <p className="text-slate-600 leading-relaxed mb-4">La Société n'est tenue que d'une obligation de moyens.</p>
                  <div className="bg-slate-50 border-l-4 border-violet-500 p-4 rounded-r-xl mb-4">
                    <p className="text-slate-700">
                      Les informations météo sont fournies <strong>à titre indicatif</strong>. Elles ne peuvent être garanties comme exactes ou exhaustives en temps réel. Météo Martinique ne saurait être tenue responsable des décisions prises sur la base de ces informations.
                    </p>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Important :</strong> Pour les bulletins officiels et vigilances, référez-vous exclusivement à <strong>Météo-France</strong> et à la <strong>Préfecture</strong>.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">14</span>
                    Propriété intellectuelle
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    L'ensemble des éléments du Site est protégé par le Code de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm">15-16</span>
                    Divers & Juridiction
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-2">
                    <strong>Modification :</strong> Météo Martinique peut modifier les CGV/CGU à tout moment.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Droit applicable :</strong> Droit français. Juridiction compétente : Tribunaux de Toulouse.
                  </p>
                </section>

                <section className="bg-slate-50 p-8 rounded-2xl text-center">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">17. Contact</h2>
                  <p className="text-slate-600 mb-6">Une question ?</p>
                  <div className="inline-flex flex-col sm:flex-row gap-4">
                    <a href="mailto:bonjour@meteo-martinique.fr" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors font-semibold">
                      bonjour@meteo-martinique.fr
                    </a>
                    <Link href="/contact" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-semibold">
                      Formulaire de contact
                    </Link>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}