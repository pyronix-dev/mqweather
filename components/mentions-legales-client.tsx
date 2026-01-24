// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function MentionsLegales({ initialUser }: { initialUser: any }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header initialUser={initialUser} />

      {}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Mentions Légales
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl font-medium max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            Informations légales et réglementaires concernant l'utilisation de www.meteo-martinique.fr
          </p>
        </div>
      </div>

      <main className="flex-1 -mt-10 relative z-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-10 group font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              Retour à l'accueil
            </Link>

            <div className="prose prose-slate prose-lg max-w-none">
              <p className="lead text-slate-600 mb-12">
                L'utilisation du site <strong>www.meteo-martinique.fr</strong> implique l'acceptation pleine et entière des
                présentes mentions légales et de la politique de confidentialité. Ces informations peuvent être modifiées à
                tout moment. Les utilisateurs sont invités à les consulter régulièrement afin de rester informés des
                évolutions.
              </p>

              <div className="grid gap-12">
                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm">1</span>
                    Présentation du site
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Conformément à l'article 6 de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique,
                    il est précisé aux utilisateurs du site <strong>www.meteo-martinique.fr</strong> l'identité des différents
                    intervenants :
                  </p>
                  <div className="bg-slate-50/50 rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div>
                        <p className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Propriétaire</p>
                        <p className="font-semibold text-slate-800 text-lg">Météo Martinique</p>
                        <p className="text-slate-600">Chemin Raynal<br />31200 Toulouse – France</p>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Responsable publication</p>
                        <p className="font-semibold text-slate-800 text-lg">Arnaud BILLAL</p>
                        <a href="mailto:bonjour@meteo-martinique.fr" className="text-blue-600 hover:underline">bonjour@meteo-martinique.fr</a>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Création & Dév.</p>
                        <p className="text-slate-600">Arnaud BILLAL</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Hébergement</p>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800">O2SWITCH</p>
                            <p className="text-slate-600">222 Boulevard Gustave Flaubert<br />63000 Clermont-Ferrand – France</p>
                            <a href="https://www.o2switch.fr" target="_blank" className="text-sm text-blue-600 hover:underline">www.o2switch.fr</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm">2</span>
                    Conditions générales d'utilisation
                  </h2>
                  <div className="text-slate-600 space-y-4">
                    <p>
                      L'accès au site <strong>www.meteo-martinique.fr</strong> est libre et gratuit. L'utilisation du site
                      implique l'acceptation pleine et entière des présentes conditions générales d'utilisation.
                    </p>
                    <p>
                      Le site est normalement accessible à tout moment. Toutefois, <strong>Météo Martinique</strong> se réserve le droit d'interrompre l'accès pour maintenance technique, en s'efforçant d'en informer préalablement les utilisateurs.
                    </p>
                    <p>
                      Ces conditions peuvent être modifiées à tout moment. L'utilisateur est invité à les consulter régulièrement.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm">3</span>
                    Description des services
                  </h2>
                  <div className="text-slate-600 space-y-4">
                    <p>
                      Le site <strong>www.meteo-martinique.fr</strong> a pour objectif de fournir des informations météorologiques
                      relatives à la Martinique (prévisions, tendances, informations générales, alertes et contenus associés).
                    </p>
                    <p>
                      L'éditeur s'efforce de fournir des informations à jour et exactes, mais ne peut garantir l'exactitude, la
                      complétude ou la mise à jour permanente des contenus. Ces informations sont données à titre indicatif et
                      peuvent évoluer à tout moment sans préavis.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm">4</span>
                    Propriété intellectuelle
                  </h2>
                  <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-900 mb-4">
                    <p className="font-medium">
                      Tous les éléments du site (textes, images, graphismes, logos, icônes, sons, logiciels, etc.) sont la propriété exclusive de <strong>Météo Martinique</strong> ou font l'objet d'une autorisation d'utilisation.
                    </p>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, du contenu du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de <strong>Météo Martinique</strong>.
                  </p>
                  <p className="text-slate-600">
                    Toute exploitation non autorisée du site ou de son contenu sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux articles L.335-2 et suivants du Code de la propriété intellectuelle.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm">5</span>
                    Limitations de responsabilité
                  </h2>
                  <p className="text-slate-600 mb-4"><strong>Météo Martinique</strong> ne pourra être tenue responsable :</p>
                  <ul className="grid sm:grid-cols-2 gap-3 mb-4">
                    {[
                      "des dommages matériels liés à l'utilisation du site",
                      "d'un accès au site à l'aide d'un matériel obsolète, non sécurisé ou infecté par un virus",
                      "des interruptions de service pour maintenance ou mise à jour",
                      "de tout dommage indirect (perte de marché, perte de chance, etc.) résultant de l'utilisation du site"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">
                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-slate-600">
                    Les espaces interactifs (formulaire de contact, etc.) sont mis à la disposition des utilisateurs. <strong>Météo Martinique</strong> se réserve le droit de supprimer sans préavis tout contenu contrevenant à la législation française.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm">6</span>
                    Politique de confidentialité (RGPD)
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">6.1 Données collectées</h3>
                      <p className="text-slate-600 mb-2">Lors de votre navigation sur <strong>www.meteo-martinique.fr</strong>, nous pouvons collecter certaines données :</p>
                      <ul className="list-disc list-inside text-slate-600 ml-4 mb-2">
                        <li><strong>Informations techniques :</strong> adresse IP, navigateur, appareil, pages visitées, durée de consultation, etc.</li>
                        <li><strong>Informations de contact :</strong> nom, adresse e-mail, numéro de téléphone, et tout autre renseignement que vous fournissez volontairement via un formulaire.</li>
                      </ul>
                      <p className="text-slate-600">Aucune donnée sensible (origine raciale, opinions politiques, santé, etc.) n'est collectée.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">6.2 Finalité du traitement</h3>
                      <p className="text-slate-600 mb-2">Les données personnelles collectées ont pour finalités :</p>
                      <ul className="list-disc list-inside text-slate-600 ml-4 mb-2">
                        <li>le traitement des demandes formulées via le formulaire de contact,</li>
                        <li>la gestion des relations utilisateurs,</li>
                        <li>l'amélioration du site et de l'expérience utilisateur,</li>
                        <li>l'envoi de communications commerciales ou informatives (uniquement sur consentement préalable).</li>
                      </ul>
                      <p className="text-slate-600">Les données ne sont utilisées qu'à des fins internes et ne sont jamais revendues à des tiers.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">6.3 Base légale du traitement</h3>
                      <p className="text-slate-600 mb-2">Le traitement des données personnelles repose sur :</p>
                      <ul className="list-disc list-inside text-slate-600 ml-4">
                        <li>le consentement explicite de l'utilisateur (formulaire de contact, newsletter, etc.),</li>
                        <li>l'intérêt légitime de <strong>Météo Martinique</strong> pour améliorer ses services et sa communication,</li>
                        <li>et le respect des obligations légales applicables.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">6.4 Durée de conservation</h3>
                      <p className="text-slate-600 mb-2">Les données sont conservées pendant la durée strictement nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées :</p>
                      <ul className="list-disc list-inside text-slate-600 ml-4">
                        <li><strong>Données du formulaire de contact :</strong> 12 mois maximum après le dernier échange,</li>
                        <li><strong>Données commerciales :</strong> 3 ans maximum après le dernier contact,</li>
                        <li><strong>Cookies et données analytiques :</strong> 13 mois maximum.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">6.5 Droits des utilisateurs</h3>
                      <p className="text-slate-600 mb-2">Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
                      <ul className="list-disc list-inside text-slate-600 ml-4 mb-4">
                        <li>Droit d'accès à vos données,</li>
                        <li>Droit de rectification ou de suppression,</li>
                        <li>Droit d'opposition et de retrait du consentement,</li>
                        <li>Droit à la portabilité de vos données,</li>
                        <li>Droit à la limitation du traitement.</li>
                      </ul>
                      <p className="text-slate-600 mb-1">Pour exercer ces droits, il vous suffit d'adresser un e-mail à : <a href="mailto:bonjour@meteo-martinique.fr" className="text-blue-600 hover:underline">bonjour@meteo-martinique.fr</a></p>
                      <p className="text-slate-600 text-sm">ou un courrier postal à : Météo Martinique – Chemin Raynal – 31200 Toulouse – France</p>
                      <p className="text-slate-500 text-sm mt-1">Toute demande doit être accompagnée d'une pièce d'identité valide.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">6.6 Sécurité des données</h3>
                      <p className="text-slate-600 mb-2"><strong>Météo Martinique</strong> met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour assurer la sécurité, la confidentialité et l'intégrité des données collectées (serveur sécurisé, chiffrement SSL, mots de passe robustes, etc.).</p>
                      <p className="text-slate-600">En cas de violation de données, les autorités compétentes et les utilisateurs concernés seront informés conformément à la réglementation en vigueur.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">6.7 Cookies</h3>
                      <p className="text-slate-600 mb-2">Le site <strong>www.meteo-martinique.fr</strong> utilise des cookies afin d'améliorer votre expérience utilisateur et d'analyser la fréquentation du site.</p>
                      <p className="text-slate-600 mb-2">Ces cookies peuvent être :</p>
                      <ul className="list-disc list-inside text-slate-600 ml-4 mb-2">
                        <li><strong>techniques</strong> (indispensables au fonctionnement du site),</li>
                        <li><strong>analytiques</strong> (Google Analytics ou équivalent),</li>
                        <li><strong>fonctionnels</strong> (pour mémoriser vos préférences de navigation).</li>
                      </ul>
                      <p className="text-slate-600 mb-4">Vous pouvez à tout moment accepter ou refuser les cookies via le bandeau d'information ou les paramètres de votre navigateur.</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
                        <p className="font-semibold mb-2">Paramétrage des cookies :</p>
                        <p>Chrome : Menu → Paramètres → Confidentialité et sécurité → Cookies.</p>
                        <p>Firefox : Menu → Options → Vie privée → Cookies.</p>
                        <p>Safari : Menu → Préférences → Confidentialité.</p>
                        <p>Edge : Paramètres → Cookies et autorisations de site.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm">7</span>
                    Liens hypertextes
                  </h2>
                  <p className="text-slate-600">
                    Le site <strong>www.meteo-martinique.fr</strong> peut contenir des liens vers d'autres sites. <strong>Météo Martinique</strong> ne peut être tenue responsable du contenu de ces sites externes ni des dommages résultant de leur consultation.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm">8</span>
                    Droit applicable et juridiction compétente
                  </h2>
                  <p className="text-slate-600">
                    Tout litige relatif à l'utilisation du site <strong>www.meteo-martinique.fr</strong> est soumis au droit français. La juridiction compétente est celle des tribunaux de Paris.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm">9</span>
                    Textes de référence
                  </h2>
                  <ul className="list-disc list-inside text-slate-600 ml-4">
                    <li>Loi n°78-17 du 6 janvier 1978 modifiée, dite « Informatique et Libertés »</li>
                    <li>Loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique</li>
                    <li>Règlement (UE) 2016/679 du 27 avril 2016 (RGPD)</li>
                  </ul>
                </section>

                <section>
                  <div className="bg-slate-900 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">10. Contact (Une question ?)</h2>
                    <p className="text-slate-300 mb-6">Pour toute question relative aux mentions légales ou à la politique de confidentialité, vous pouvez nous contacter à l'adresse suivante :</p>
                    <a href="mailto:bonjour@meteo-martinique.fr" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-semibold">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      bonjour@meteo-martinique.fr
                    </a>
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