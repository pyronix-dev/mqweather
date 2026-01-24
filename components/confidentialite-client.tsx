// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Confidentialite({ initialUser }: { initialUser: any }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header initialUser={initialUser} />

      {}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Politique de Confidentialité
          </h1>
          <p className="text-emerald-100 text-lg sm:text-xl font-medium max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            Votre vie privée est notre priorité. Découvrez comment nous protégeons vos données.
          </p>
        </div>
      </div>

      <main className="flex-1 -mt-10 relative z-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors mb-10 group font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              Retour à l'accueil
            </Link>

            <div className="prose prose-slate prose-lg max-w-none">
              <p className="lead text-slate-600 mb-10">
                La présente politique de confidentialité explique comment <strong>Météo Martinique</strong> (ci-après « nous
                ») collecte, utilise et protège vos données personnelles lorsque vous utilisez le site{" "}
                <strong>www.meteo-martinique.fr</strong> (ci-après « le Site »).
              </p>

              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Responsable</p>
                  <p className="font-semibold text-slate-800">Météo Martinique</p>
                </div>
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Siège</p>
                  <p className="font-semibold text-slate-800">Toulouse, France</p>
                </div>
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">DPO / Contact</p>
                  <a href="mailto:bonjour@meteo-martinique.fr" className="font-semibold text-emerald-600 hover:underline">bonjour@meteo-martinique.fr</a>
                </div>
              </div>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  1. Données que nous collectons
                </h2>
                <p className="text-slate-600 mb-4">Selon votre utilisation du Site, nous pouvons collecter les catégories de données suivantes :</p>

                <div className="grid sm:grid-cols-2 gap-6 mb-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">1.1 Volontairement</h3>
                    <ul className="text-slate-600 text-sm space-y-2">
                      <li>• Nom / prénom (si vous le renseignez)</li>
                      <li>• Adresse e-mail</li>
                      <li>• Numéro de téléphone (si vous le renseignez)</li>
                      <li>• Contenu du message (contact, e-mail)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">1.2 Automatiquement</h3>
                    <ul className="text-slate-600 text-sm space-y-2">
                      <li>• Données techniques (IP, navigateur, OS)</li>
                      <li>• Données de navigation (pages, durée)</li>
                      <li>• Cookies & Traceurs (voir section 9)</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-slate-500 italic text-center">
                  <strong>Nous ne collectons pas de données sensibles</strong> (origine, opinions politiques, religion, santé, etc.).
                </p>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  2. Finalités de la collecte
                </h2>
                <p className="text-slate-600 mb-4">Nous utilisons vos données personnelles uniquement pour :</p>
                <ul className="list-disc list-inside text-slate-600 ml-4">
                  <li>Répondre à vos demandes (formulaire de contact / e-mail)</li>
                  <li>Assurer le bon fonctionnement, la sécurité et la maintenance du Site</li>
                  <li>Mesurer l'audience et améliorer le contenu et l'expérience utilisateur</li>
                  <li>Vous envoyer des informations si vous y avez consenti (ex : newsletter, alertes e-mail, offres)</li>
                  <li>Gérer des Services payants éventuels (commande, facturation, support)</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  3. Bases légales (RGPD)
                </h2>
                <p className="text-slate-600 mb-4">Le traitement de vos données repose sur une ou plusieurs des bases légales suivantes :</p>
                <ul className="list-disc list-inside text-slate-600 ml-4">
                  <li><strong>Votre consentement</strong> (ex : newsletter, certains cookies, formulaire)</li>
                  <li><strong>L'exécution d'un contrat</strong> (ex : fourniture d'un service payant, support client)</li>
                  <li><strong>L'intérêt légitime</strong> (sécurité, amélioration du Site, statistiques d'audience non excessives)</li>
                  <li><strong>Une obligation légale</strong> (ex : obligations comptables si vente)</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  4. Destinataires des données
                </h2>
                <p className="text-slate-600 mb-4">
                  Vos données sont destinées à <strong>Météo Martinique</strong> et peuvent être accessibles à des
                  prestataires techniques strictement nécessaires au fonctionnement du Site (ex : hébergement, outils de
                  mesure d'audience, emailing), dans la limite de leurs missions.
                </p>
                <p className="font-semibold text-emerald-700">Nous ne vendons jamais vos données.</p>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  5. Transferts hors Union Européenne
                </h2>
                <p className="text-slate-600">
                  Certains outils (ex : mesure d'audience, services d'emailing) peuvent entraîner un traitement de données en
                  dehors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont mises en
                  place (ex : clauses contractuelles types, mesures de sécurité).
                </p>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  6. Durées de conservation
                </h2>
                <p className="text-slate-600 mb-4">Nous conservons vos données uniquement pendant la durée nécessaire aux finalités :</p>
                <ul className="list-disc list-inside text-slate-600 ml-4">
                  <li><strong>Contact / demandes :</strong> 12 mois maximum après le dernier échange</li>
                  <li><strong>Données commerciales (si services payants) :</strong> 3 ans après le dernier contact / relation</li>
                  <li><strong>Données de facturation :</strong> durée légale applicable (obligations comptables)</li>
                  <li><strong>Cookies et traceurs :</strong> 13 mois maximum (selon configuration et consentement)</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  7. Vos Droits (RGPD)
                </h2>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6">
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                      "Droit d'accès", "Droit de rectification", "Droit à l'effacement (« oubli »)", "Droit d'opposition", "Droit de limitation", "Droit à la portabilité", "Droit de retrait du consentement"
                    ].map((right, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {right}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-slate-600 mb-3">Pour exercer vos droits, contactez-nous :</p>
                    <a href="mailto:bonjour@meteo-martinique.fr" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      bonjour@meteo-martinique.fr
                    </a>
                    <p className="text-slate-500 text-sm mt-4">Pour des raisons de sécurité, une preuve d'identité peut être demandée en cas de doute.</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Vous pouvez également introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" className="underline">www.cnil.fr</a>
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  8. Sécurité
                </h2>
                <p className="text-slate-600">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
                  (accès restreint, mesures de sécurité serveur, chiffrement SSL, etc.). Malgré ces efforts, aucun système
                  n'offre une sécurité absolue.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  9. Cookies & Traceurs
                </h2>
                <p className="text-slate-600 mb-4">
                  Le Site peut utiliser des cookies et/ou technologies similaires. Un cookie est un petit fichier stocké sur votre appareil permettant notamment de faciliter la navigation et de mesurer l'audience.
                </p>
                <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">9.1 Types de cookies</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm text-center mb-6">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="block font-bold text-slate-800 mb-1">Techniques</span>
                    Indispensables au fonctionnement
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="block font-bold text-slate-800 mb-1">Analytiques</span>
                    Statistiques de fréquentation (Google Analytics...)
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="block font-bold text-slate-800 mb-1">Fonctionnels</span>
                    Préférences utilisateur
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">9.2 Gestion du consentement</h3>
                <p className="text-slate-600 mb-4">Selon la configuration du Site, vous pouvez accepter/refuser les cookies via un bandeau de consentement ou via votre navigateur :</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
                  <p className="font-semibold mb-2">Paramétrage (exemples) :</p>
                  <p>Chrome : Paramètres → Confidentialité et sécurité → Cookies</p>
                  <p>Firefox : Options → Vie privée → Cookies</p>
                  <p>Safari : Préférences → Confidentialité</p>
                  <p>Edge : Paramètres → Cookies et autorisations de site</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  10. Services météo (Info. indicatives)
                </h2>
                <p className="text-slate-600 mb-4">
                  Les informations, données météorologiques, prévisions, tendances, alertes, contenus et outils proposés sur le Site sont fournis <strong>à titre indicatif</strong>. Elles sont issues de sources susceptibles d'évoluer et ne peuvent être garanties comme exactes, exhaustives ou mises à jour en temps réel.
                </p>
                <p className="text-slate-600 mb-4">
                  <strong>Météo Martinique ne saurait être tenue responsable</strong> des décisions prises sur la base des informations fournies ni des dommages directs ou indirects qui pourraient en résulter.
                </p>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-sm">
                  <p className="font-bold mb-1">⚠️ Vigilances et Sécurité</p>
                  Pour les bulletins officiels, vigilances et consignes de sécurité, référez-vous exclusivement aux sites officiels : <strong>Météo-France</strong>, la <strong>Préfecture de Martinique</strong> et les autorités locales.
                </div>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  11. Liens vers des sites tiers
                </h2>
                <p className="text-slate-600">
                  Le Site peut contenir des liens vers des sites tiers. Nous ne contrôlons pas ces sites et ne sommes pas responsables de leurs pratiques ou politiques de confidentialité.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  12. Mise à jour de la politique
                </h2>
                <p className="text-slate-600">
                  Nous pouvons modifier la présente politique de confidentialité à tout moment afin de refléter l'évolution du Site, de nos pratiques, ou des obligations légales. La version en vigueur est celle publiée sur cette page.
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}