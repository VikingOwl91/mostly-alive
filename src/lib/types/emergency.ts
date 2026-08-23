export interface RegionalEmergencyProfile {
	countryCode: string;
	countryName: Record<'en' | 'de', string>;
	generalEmergency: string;
	police: string;
	fireMedical: string;
	poisonControl?: string;
	poisonControlName?: string;
	nonEmergencyMedical?: string;
	authorityNotes?: Record<'en' | 'de', string>;
	officialSource: {
		name: string;
		url: string;
	};
}

export const EMERGENCY_REGISTRY: Record<string, RegionalEmergencyProfile> = {
	de: {
		countryCode: 'de',
		countryName: { en: 'Germany', de: 'Deutschland' },
		generalEmergency: '112',
		police: '110',
		fireMedical: '112',
		poisonControl: '+49 30 19240',
		poisonControlName: 'Giftnotruf Berlin / Bundesweites Giftinformationszentrum',
		nonEmergencyMedical: '116 117',
		authorityNotes: {
			en: '112 reaches fire and emergency medical dispatch directly. 110 is police.',
			de: '112 verbindet direkt mit Feuerwehr und Rettungsdienst. 110 ist die Polizei.'
		},
		officialSource: {
			name: 'BBK (Bundesamt für Bevölkerungsschutz und Katastrophenhilfe)',
			url: 'https://www.bbk.bund.de/'
		}
	},
	us: {
		countryCode: 'us',
		countryName: { en: 'United States', de: 'Vereinigte Staaten' },
		generalEmergency: '911',
		police: '911',
		fireMedical: '911',
		poisonControl: '1-800-222-1222',
		poisonControlName: 'Poison Help (American Association of Poison Control Centers)',
		authorityNotes: {
			en: '911 handles all emergency services. Poison Help provides 24/7 toxic guidance.',
			de: '911 koordiniert alle Notdienste. Poison Help bietet rund um die Uhr toxikologische Beratung.'
		},
		officialSource: {
			name: 'Federal Communications Commission (FCC) 911 Services',
			url: 'https://www.fcc.gov/general/9-1-1-and-e9-1-1-services'
		}
	},
	uk: {
		countryCode: 'uk',
		countryName: { en: 'United Kingdom', de: 'Vereinigtes Königreich' },
		generalEmergency: '999',
		police: '999',
		fireMedical: '999',
		nonEmergencyMedical: '111',
		authorityNotes: {
			en: '999 is standard; 112 also works. NHS 111 for urgent but non-life-threatening medical advice.',
			de: '999 ist Standard; 112 funktioniert ebenfalls. NHS 111 für dringende, nicht lebensgefährliche Fälle.'
		},
		officialSource: {
			name: 'NHS UK Emergency and Urgent Care Services',
			url: 'https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/'
		}
	},
	au: {
		countryCode: 'au',
		countryName: { en: 'Australia', de: 'Australien' },
		generalEmergency: '000',
		police: '000',
		fireMedical: '000',
		poisonControl: '13 11 26',
		poisonControlName: 'Poisons Information Centre Australia',
		authorityNotes: {
			en: 'Triple Zero (000) connects to police, fire, or ambulance. 112 works on digital mobile phones.',
			de: 'Triple Zero (000) verbindet Polizei, Feuerwehr oder Rettungsdienst. 112 funktioniert im Mobilfunk.'
		},
		officialSource: {
			name: 'Australian Government Emergency Services (Triple Zero)',
			url: 'https://www.triplezero.gov.au/'
		}
	},
	eu: {
		countryCode: 'eu',
		countryName: { en: 'European Union (Standard)', de: 'Europäische Union (Standard)' },
		generalEmergency: '112',
		police: '112',
		fireMedical: '112',
		authorityNotes: {
			en: '112 is the single European emergency number valid across all EU member states, toll-free.',
			de: '112 ist die einheitliche europäische Notrufnummer, in allen EU-Staaten gebührenfrei erreichbar.'
		},
		officialSource: {
			name: 'European Commission 112 Emergency Number',
			url: 'https://digital-strategy.ec.europa.eu/en/policies/112'
		}
	}
};
