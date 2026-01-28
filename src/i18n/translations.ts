export type Language = 'de' | 'en';

export interface Translations {
  // App
  appTitle: string;
  appSubtitle: string;
  relaisCount: string;
  lastUpdate: string;

  // Search
  searchPlaceholder: string;

  // Filter Panel
  filter: string;
  reset: string;
  band: string;
  type: string;
  state: string;
  status: string;
  active: string;
  inactive: string;
  unknown: string;

  // Relais List
  noRelaisFound: string;
  tryAdjustFilters: string;

  // Relais Popup
  txLabel: string;
  rxLabel: string;
  shiftLabel: string;
  ctcssLabel: string;
  dcsLabel: string;
  dmrIdLabel: string;
  colorCodeLabel: string;
  dstarModuleLabel: string;
  echolinkLabel: string;
  altitudeLabel: string;
  operatorLabel: string;

  // Loading & Error
  loadingData: string;
  loadingError: string;
  retry: string;

  // Footer
  dataSources: string;
  disclaimer: string;
  disclaimerText: string;
  weeklyUpdate: string;
  noGuarantee: string;
  thanksForData: string;

  // Legal links
  imprint: string;
  privacy: string;
  close: string;

  // Parent site
  partOfTools: string;

  // Imprint Modal
  imprintTitle: string;
  imprintInfo: string;
  imprintOperator: string;
  imprintOperatorName: string;
  imprintOperatorCallsign: string;
  imprintOperatorAddress: string;
  imprintOperatorCountry: string;
  imprintContact: string;
  imprintContactEmail: string;
  imprintLiabilityTitle: string;
  imprintLiabilityText: string;
  imprintCopyrightTitle: string;
  imprintCopyrightText: string;

  // Privacy Modal
  privacyTitle: string;
  privacyIntro: string;
  privacyNoDataTitle: string;
  privacyNoDataText: string;
  privacyNoDataForms: string;
  privacyNoDataCookies: string;
  privacyNoDataTracking: string;
  privacyNoDataServer: string;
  privacyLocalStorageTitle: string;
  privacyLocalStorageText: string;
  privacyCloudflareTitle: string;
  privacyCloudflareText: string;
  privacyRightsTitle: string;
  privacyRightsText: string;
  privacyContactTitle: string;
  privacyContactText: string;
}

export const translations: Record<Language, Translations> = {
  de: {
    // App
    appTitle: 'Relaisblick',
    appSubtitle: 'Österreichische Relais-Karte',
    relaisCount: '{filtered} von {total} Relais',
    lastUpdate: 'Stand: {date}',

    // Search
    searchPlaceholder: 'Suche nach Rufzeichen, Standort...',

    // Filter Panel
    filter: 'Filter',
    reset: 'Zurücksetzen',
    band: 'Band',
    type: 'Typ',
    state: 'Bundesland',
    status: 'Status',
    active: 'aktiv',
    inactive: 'inaktiv',
    unknown: 'unbekannt',

    // Relais List
    noRelaisFound: 'Keine Relais gefunden',
    tryAdjustFilters: 'Versuche die Filter anzupassen',

    // Relais Popup
    txLabel: 'TX',
    rxLabel: 'RX',
    shiftLabel: 'Shift',
    ctcssLabel: 'CTCSS',
    dcsLabel: 'DCS',
    dmrIdLabel: 'DMR ID',
    colorCodeLabel: 'Color Code',
    dstarModuleLabel: 'D-STAR Modul',
    echolinkLabel: 'EchoLink',
    altitudeLabel: 'Seehöhe',
    operatorLabel: 'Betreiber',

    // Loading & Error
    loadingData: 'Lade Daten...',
    loadingError: 'Fehler beim Laden',
    retry: 'Erneut versuchen',

    // Footer
    dataSources: 'Datenquellen',
    disclaimer: 'Disclaimer',
    disclaimerText: 'Die FM-Relaisdaten stammen vom ÖVSV UKW-Referat (repeater.oevsv.at). Die Daten für DMR, D-STAR und C4FM stammen von OE8VIK (Michi) via dmraustria.at, dstaraustria.at und c4fmaustria.at.',
    weeklyUpdate: 'Die Daten werden wöchentlich automatisch aktualisiert.',
    noGuarantee: 'Alle Angaben ohne Gewähr. Bei Fehlern oder Änderungswünschen bitte direkt an die jeweilige Datenquelle wenden.',
    thanksForData: 'Besten Dank für die Bereitstellung der Daten!',

    // Legal links
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    close: 'Schließen',

    // Parent site
    partOfTools: 'Teil von {name} Tools',

    // Imprint Modal
    imprintTitle: 'Impressum',
    imprintInfo: 'Angaben gemäß § 5 ECG und § 25 MedienG',
    imprintOperator: 'Betreiber',
    imprintOperatorName: 'Michael Linder',
    imprintOperatorCallsign: 'OE8YML',
    imprintOperatorAddress: 'Nötsch 219, 9611 Nötsch',
    imprintOperatorCountry: 'Österreich',
    imprintContact: 'Kontakt',
    imprintContactEmail: 'oe8yml@rednil.at',
    imprintLiabilityTitle: 'Haftung für Inhalte',
    imprintLiabilityText: 'Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr. Diese Website dient der Darstellung von Amateurfunk-Relais in Österreich.',
    imprintCopyrightTitle: 'Urheberrecht',
    imprintCopyrightText: 'Die durch den Betreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem österreichischen Urheberrecht. Der Quellcode ist unter der MIT-Lizenz auf GitHub verfügbar.',

    // Privacy Modal
    privacyTitle: 'Datenschutzerklärung',
    privacyIntro: 'Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert Sie über die Datenverarbeitung auf dieser Website.',
    privacyNoDataTitle: 'Keine Datenerhebung',
    privacyNoDataText: 'Diese Website ist ein reines Client-Side-Tool und erhebt, speichert oder verarbeitet keine personenbezogenen Daten. Es gibt:',
    privacyNoDataForms: 'Keine Formulare oder Benutzereingaben',
    privacyNoDataCookies: 'Keine Cookies (außer der Spracheinstellung im localStorage)',
    privacyNoDataTracking: 'Kein Tracking oder Analytics',
    privacyNoDataServer: 'Keine serverseitige Datenverarbeitung',
    privacyLocalStorageTitle: 'Lokale Speicherung',
    privacyLocalStorageText: 'Die einzige gespeicherte Information ist Ihre Sprachpräferenz, die lokal in Ihrem Browser gespeichert wird. Diese Daten werden nicht an Server übertragen und können jederzeit durch Löschen der Browser-Daten entfernt werden.',
    privacyCloudflareTitle: 'Cloudflare',
    privacyCloudflareText: 'Diese Website wird über Cloudflare bereitgestellt. Cloudflare kann technisch notwendige Verbindungsdaten verarbeiten. Weitere Informationen finden Sie in der Datenschutzerklärung von Cloudflare.',
    privacyRightsTitle: 'Ihre Rechte',
    privacyRightsText: 'Da wir keine personenbezogenen Daten erheben, entfallen die üblichen DSGVO-Rechte wie Auskunft, Berichtigung oder Löschung. Bei Fragen können Sie uns dennoch kontaktieren.',
    privacyContactTitle: 'Kontakt',
    privacyContactText: 'Bei Fragen zur Datenverarbeitung wenden Sie sich an:',
  },
  en: {
    // App
    appTitle: 'Relaisblick',
    appSubtitle: 'Austrian Repeater Map',
    relaisCount: '{filtered} of {total} repeaters',
    lastUpdate: 'Updated: {date}',

    // Search
    searchPlaceholder: 'Search by callsign, location...',

    // Filter Panel
    filter: 'Filter',
    reset: 'Reset',
    band: 'Band',
    type: 'Type',
    state: 'State',
    status: 'Status',
    active: 'active',
    inactive: 'inactive',
    unknown: 'unknown',

    // Relais List
    noRelaisFound: 'No repeaters found',
    tryAdjustFilters: 'Try adjusting the filters',

    // Relais Popup
    txLabel: 'TX',
    rxLabel: 'RX',
    shiftLabel: 'Shift',
    ctcssLabel: 'CTCSS',
    dcsLabel: 'DCS',
    dmrIdLabel: 'DMR ID',
    colorCodeLabel: 'Color Code',
    dstarModuleLabel: 'D-STAR Module',
    echolinkLabel: 'EchoLink',
    altitudeLabel: 'Altitude',
    operatorLabel: 'Operator',

    // Loading & Error
    loadingData: 'Loading data...',
    loadingError: 'Error loading data',
    retry: 'Try again',

    // Footer
    dataSources: 'Data sources',
    disclaimer: 'Disclaimer',
    disclaimerText: 'FM repeater data is from ÖVSV UKW department (repeater.oevsv.at). Data for DMR, D-STAR and C4FM is from OE8VIK (Michi) via dmraustria.at, dstaraustria.at and c4fmaustria.at.',
    weeklyUpdate: 'Data is updated automatically every week.',
    noGuarantee: 'All information without guarantee. For errors or change requests, please contact the respective data source directly.',
    thanksForData: 'Many thanks for providing the data!',

    // Legal links
    imprint: 'Imprint',
    privacy: 'Privacy',
    close: 'Close',

    // Parent site
    partOfTools: 'Part of {name} Tools',

    // Imprint Modal
    imprintTitle: 'Imprint',
    imprintInfo: 'Information according to § 5 ECG and § 25 MedienG (Austrian law)',
    imprintOperator: 'Operator',
    imprintOperatorName: 'Michael Linder',
    imprintOperatorCallsign: 'OE8YML',
    imprintOperatorAddress: 'Nötsch 219, 9611 Nötsch',
    imprintOperatorCountry: 'Austria',
    imprintContact: 'Contact',
    imprintContactEmail: 'oe8yml@rednil.at',
    imprintLiabilityTitle: 'Liability for Content',
    imprintLiabilityText: 'The contents of this website have been created with the greatest care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content. This website serves to display amateur radio repeaters in Austria.',
    imprintCopyrightTitle: 'Copyright',
    imprintCopyrightText: 'The content and works created by the operator on this website are subject to Austrian copyright law. The source code is available under the MIT license on GitHub.',

    // Privacy Modal
    privacyTitle: 'Privacy Policy',
    privacyIntro: 'The protection of your personal data is important to us. This privacy policy informs you about data processing on this website.',
    privacyNoDataTitle: 'No Data Collection',
    privacyNoDataText: 'This website is a pure client-side tool and does not collect, store, or process any personal data. There are:',
    privacyNoDataForms: 'No forms or user inputs',
    privacyNoDataCookies: 'No cookies (except language preference in localStorage)',
    privacyNoDataTracking: 'No tracking or analytics',
    privacyNoDataServer: 'No server-side data processing',
    privacyLocalStorageTitle: 'Local Storage',
    privacyLocalStorageText: 'The only stored information is your language preference, which is saved locally in your browser. This data is not transmitted to servers and can be removed at any time by clearing browser data.',
    privacyCloudflareTitle: 'Cloudflare',
    privacyCloudflareText: "This website is served via Cloudflare. Cloudflare may process technically necessary connection data. For more information, see Cloudflare's privacy policy.",
    privacyRightsTitle: 'Your Rights',
    privacyRightsText: 'Since we do not collect personal data, the usual GDPR rights such as access, correction, or deletion do not apply. If you have questions, you can still contact us.',
    privacyContactTitle: 'Contact',
    privacyContactText: 'For questions about data processing, contact:',
  },
};
