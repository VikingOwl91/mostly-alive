import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { ImmediateActionStep } from '../src/lib/types/content.js';

const CONTENT_DIR = path.resolve('content/articles');

export const actionCatalog: Record<
	string,
	{
		en: ImmediateActionStep[];
		de: ImmediateActionStep[];
	}
> = {
	'allergy-escalating-rather-quickly': {
		en: [
			{
				title: 'INJECT EPINEPHRINE (ADRENALINE) IMMEDIATELY',
				instruction:
					'If the person has a prescribed auto-injector (EpiPen, Jext, Auvi-Q), use it immediately at the first sign of airway swelling, breathing difficulty, or dizziness.',
				substeps: [
					'Grasp the auto-injector with a fist (never place thumb over needle end) and pull off the safety cap.',
					'Push needle tip firmly into the outer mid-thigh at a 90-degree angle (can be given through clothing).',
					'Hold firmly in place for 3 to 5 seconds (or per device manual) until the dose is delivered.',
					'Remove injector and gently massage injection site for 10 seconds.'
				]
			},
			{
				title: 'CALL 911 / 112 IMMEDIATELY',
				instruction:
					'State clearly to emergency dispatch: "Anaphylaxis / severe allergic shock, adrenaline auto-injector administered."'
			},
			{
				title: 'PROPER POSITIONING (CRITICAL)',
				instruction: 'Support circulation and breathing according to the person’s symptoms:',
				variants: [
					{
						condition: 'Faint / Pale / Shock',
						action: 'Lay flat on back and elevate legs (increases venous return to the heart).'
					},
					{
						condition: 'Breathing Difficulty',
						action: 'Allow to sit up slightly in a supported position to ease respiration.'
					},
					{
						condition: 'Unconscious + Breathing',
						action: 'Place in the recovery position.'
					},
					{
						condition: 'Pregnant',
						action: 'Lay on left side to relieve vena cava compression.'
					}
				]
			},
			{
				title: 'SECOND DOSE IF NO IMPROVEMENT',
				instruction:
					'If symptoms fail to improve or worsen after 5 to 15 minutes and emergency services have not arrived, administer a second auto-injector into the opposite thigh.'
			}
		],
		de: [
			{
				title: 'ADRENALIN-AUTOINJEKTOR SOFORT ANWENDEN',
				instruction:
					'Bei den ersten Anzeichen von Atemnot, Zuschwellen des Rachens oder Schwindel unverzüglich den verordneten Autoinjektor (z. B. EpiPen, Jext, FastJekt) einsetzen.',
				substeps: [
					'Den Autoinjektor mit der Faust umfassen (Daumen niemals auf die Öffnung/Nadelspitze legen!) und Sicherheitskappe abziehen.',
					'Die Nadelspitze im 90-Grad-Winkel kräftig gegen die Außenseite des mittleren Oberschenkels drücken (kann durch Kleidung hindurch erfolgen).',
					'Für 3 bis 5 Sekunden fest angedrückt halten, bis der Mechanismus auslöst und das Medikament abgegeben ist.',
					'Injektor entfernen und die Injektionsstelle 10 Sekunden lang sanft massieren.'
				]
			},
			{
				title: 'NOTRUF 112 WÄHLEN',
				instruction:
					'Der Leitstelle klar melden: „Schwere Anaphylaxie / allergischer Schock, Adrenalin verabreicht.“'
			},
			{
				title: 'KORREKTE LAGERUNG (LEBENSWICHTIG)',
				instruction: 'Lagerung an die Symptome anpassen:',
				variants: [
					{
						condition: 'Schwindel / Blässe / Schock',
						action:
							'Flach auf den Rücken legen und Beine hochlagern (Schocklage zur Sicherung des Blutrückflusses).'
					},
					{
						condition: 'Atemnot im Vordergrund',
						action: 'Oberkörper leicht erhöht positionieren, um die Atmung zu erleichtern.'
					},
					{
						condition: 'Bewusstlos mit Atmung',
						action: 'Stabile Seitenlage zur Sicherung der Atemwege.'
					},
					{
						condition: 'Schwangerschaft',
						action: 'Linksseitenlage zur Entlastung der Vena cava.'
					}
				]
			},
			{
				title: 'ZWEITGABE BEI AUSBLEIBENDER BESSERUNG',
				instruction:
					'Tritt nach 5 bis 15 Minuten keine deutliche Besserung ein oder verschlechtert sich der Zustand und der Rettungsdienst ist noch nicht da, einen zweiten Autoinjektor in den anderen Oberschenkel injizieren.'
			}
		]
	},
	'person-no-longer-breathing-for-some-reason': {
		en: [
			{
				title: 'CHECK RESPONSIVENESS AND BREATHING (10 SEC MAX)',
				instruction: 'Quickly assess for responsiveness and normal breathing:',
				substeps: [
					'Shake the shoulders firmly and shout: "Are you okay?"',
					'Tilt the head back gently and lift the chin to open airway; look and listen for normal breathing (max 10s).',
					'Agonal gasps = Cardiac Arrest: Slow, snoring, irregular gasps are NOT normal breathing; act immediately.'
				]
			},
			{
				title: 'CALL 911 / 112 AND GET AN AED',
				instruction:
					'Put phone on speakerphone with emergency dispatch and direct a bystander to bring an Automated External Defibrillator.'
			},
			{
				title: 'START CHEST COMPRESSIONS IMMEDIATELY',
				instruction: 'Deliver high-quality chest compressions in the center of the chest:',
				substeps: [
					'Heel of one hand on lower breastbone, second hand interlocked on top, elbows locked straight.',
					'Push hard and fast: 5 to 6 cm depth at 100 to 120 compressions per minute (tempo of "Stayin’ Alive").',
					'Allow complete chest recoil between compressions without leaning.',
					'Compression-Only CPR is fully effective; if trained, alternate 30 compressions : 2 rescue breaths.'
				]
			},
			{
				title: 'ATTACH AED AS SOON AS IT ARRIVES',
				instruction: 'Power on the AED and follow clear voice prompts without delay:',
				substeps: [
					'Apply adhesive pads to bare chest: Upper right collarbone and lower left side below armpit.',
					'Stand clear: Ensure NO ONE touches the person during analysis or shock delivery.',
					'Resume chest compressions immediately after shock or if no shock is advised.'
				]
			}
		],
		de: [
			{
				title: 'BEWUSSTSEIN UND ATMUNG PRÜFEN (MAX 10 SEKUNDEN)',
				instruction: 'Reaktion und normale Atmung unverzüglich überprüfen:',
				substeps: [
					'An den Schultern rütteln und laut ansprechen: „Hallo, hören Sie mich?“',
					'Kopf sanft nach hinten überstrecken, Kinn anheben und max. 10 Sekunden auf normale Atmung prüfen.',
					'Schnappatmung = Herzstillstand: Einzelne, röchelnde oder unregelmäßige Atemzüge sind KEINE normale Atmung; sofort handeln!'
				]
			},
			{
				title: 'NOTRUF 112 WÄHLEN UND AED HOLEN LASSEN',
				instruction:
					'Sofort Notruf 112 anrufen (Lautsprecher an) und Umstehende gezielt anweisen, den nächsten Defibrillator (AED) zu holen.'
			},
			{
				title: 'SOFORT MIT DER HERZDRUCKMASSAGE BEGINNEN',
				instruction:
					'Herzdruckmassage in der Mitte des Brustkorbs mit hoher Qualität durchführen:',
				substeps: [
					'Handballen auf die untere Brustbeinhälfte, zweite Hand verschränken, Arme durchdrücken.',
					'5 bis 6 cm tief und schnell drücken: 100 bis 120 Mal pro Minute (im Takt von „Stayin’ Alive“).',
					'Nach jedem Druck vollständig entlasten, ohne den Kontakt zum Brustkorb zu verlieren.',
					'Reine Herzdruckmassage (Hands-Only CPR) ist für Ungeübte vollkommen ausreichend; Geschulte: 30:2.'
				]
			},
			{
				title: 'AED SOFORT EINSCHALTEN, SOBALD ER DA IST',
				instruction: 'Defibrillator einschalten und den automatischen Sprachanweisungen folgen:',
				substeps: [
					'Elektroden aufkleben: Rechts unter das Schlüsselbein, links unter die Achselhöhle.',
					'Abstand halten: Niemand berührt die Person während der Rhythmusanalyse oder Schockabgabe.',
					'Nach Schock oder Ansage sofort ohne Pause mit der Herzdruckmassage fortfahren.'
				]
			}
		]
	},
	'person-currently-choking': {
		en: [
			{
				title: 'ASSESS SEVERITY AND ENCOURAGE COUGHING',
				instruction: 'Determine if the airway obstruction is mild or severe:',
				variants: [
					{
						condition: 'Mild Obstruction (Can speak/cough)',
						action: 'Encourage continuous coughing; do NOT perform back blows or thrusts.'
					},
					{
						condition: 'Severe Obstruction (Cannot speak/cough)',
						action: 'Proceed immediately to back blows and abdominal thrusts.'
					}
				]
			},
			{
				title: 'DELIVER 5 SHARP BACK BLOWS',
				instruction: 'Deliver sharp blows between the shoulder blades:',
				substeps: [
					'Stand slightly behind and to the side of the person.',
					'Support their chest with one hand and lean them well forward.',
					'Deliver up to 5 sharp blows between the shoulder blades with the heel of your other hand.'
				]
			},
			{
				title: 'DELIVER 5 ABDOMINAL THRUSTS (HEIMLICH)',
				instruction: 'If back blows fail, perform abdominal thrusts:',
				substeps: [
					'Stand behind the person and wrap both arms around their upper abdomen.',
					'Clench a fist and place thumb side against their abdomen, between navel and ribcage.',
					'Grasp fist with your other hand and pull sharply inward and upward up to 5 times.'
				]
			},
			{
				title: 'REPEAT 5+5 CYCLE OR BEGIN CPR',
				instruction:
					'Alternate 5 back blows and 5 abdominal thrusts until object is expelled or help arrives:',
				variants: [
					{
						condition: 'If Person Becomes Unresponsive',
						action: 'Lower carefully to the floor, call 911/112, and start CPR immediately.'
					}
				]
			}
		],
		de: [
			{
				title: 'SCHWEREGRAD PRÜFEN & ZUM HUSTEN AUFFORDERN',
				instruction: 'Unterscheiden, ob eine milde oder schwere Atemwegsverlegung vorliegt:',
				variants: [
					{
						condition: 'Milde Verlegung (Sprechen/Husten möglich)',
						action: 'Zum kräftigen Weiterhusten auffordern; keine Schläge oder Manöver durchführen.'
					},
					{
						condition: 'Schwere Verlegung (Kein Sprechen/Husten)',
						action: 'Sofort mit Rückenschlägen und Oberbauchkompressionen beginnen.'
					}
				]
			},
			{
				title: '5 KRÄFTIGE RÜCKENSCHLÄGE DURCHFÜHREN',
				instruction: 'Kräftige Schläge zwischen die Schulterblätter abgeben:',
				substeps: [
					'Seitlich leicht hinter die Person treten.',
					'Brustkorb mit einer Hand stützen und den Oberkörper weit nach vorne beugen.',
					'Mit dem Handballen der anderen Hand bis zu 5 kräftige Schläge zwischen die Schulterblätter setzen.'
				]
			},
			{
				title: '5 OBERBAUCHKOMPRESSIONEN (HEIMLICH-HANDGRIFF)',
				instruction: 'Falls erfolglos, Oberbauchkompressionen durchführen:',
				substeps: [
					'Hinter die Person treten und beide Arme um den oberen Bauch legen.',
					'Eine Faust ballen und mit der Daumenseite mittig zwischen Bauchnabel und Brustbein ansetzen.',
					'Faust mit der anderen Hand fassen und bis zu 5-mal kräftig nach hinten-oben ziehen.'
				]
			},
			{
				title: '5+5-ZYKLUS WIEDERHOLEN ODER CPR STARTEN',
				instruction:
					'Abwechselnd 5 Rückenschläge und 5 Oberbauchkompressionen wiederholen, bis der Fremdkörper gelöst ist:',
				variants: [
					{
						condition: 'Bei Bewusstlosigkeit',
						action:
							'Sofort flach auf den Boden legen, Notruf 112 wählen und unverzüglich CPR starten.'
					}
				]
			}
		]
	},
	'bleeding-more-than-is-generally-recommended': {
		en: [
			{
				title: 'APPLY DIRECT UNRELENTING PRESSURE',
				instruction: 'Firm, continuous pressure is the primary tool to stop external hemorrhage:',
				substeps: [
					'Place a clean cloth, sterile gauze, or gloved hands directly over the bleeding point.',
					'Press firmly with both hands, using your body weight.',
					'Do not release pressure to check the wound for at least 5 minutes.'
				]
			},
			{
				title: 'PACK DEEP CAVITY WOUNDS (WOUND PACKING)',
				instruction: 'For deep junctional wounds in groin, armpit, or neck where pressure fails:',
				substeps: [
					'Tightly pack hemostatic or sterile gauze directly into the wound cavity down to the bone/vessel.',
					'Maintain direct two-handed compression over the packed wound for at least 3 minutes.'
				]
			},
			{
				title: 'APPLY TOURNIQUET FOR SEVERE LIMB BLEEDING',
				instruction: 'If severe arterial bleeding on an arm or leg cannot be controlled with pressure:',
				substeps: [
					'Place a commercial windlass tourniquet 5 to 7 cm (2 to 3 inches) above the wound (not over a joint).',
					'Tighten the windlass rod until the arterial bleeding completely stops and distal pulse vanishes.',
					'Lock the rod into the clip and record the exact application time on the band.'
				]
			},
			{
				title: 'CALL 911 / 112 AND PREVENT HYPOTHERMIA',
				instruction:
					'Contact emergency dispatch immediately, keep patient lying flat, and wrap in blankets to prevent coagulopathy.'
			}
		],
		de: [
			{
				title: 'DIREKTEN, UNUNTERBROCHENEN DRUCK AUSÜBEN',
				instruction:
					'Ununterbrochener manueller Druck ist das wichtigste Mittel zur Blutstillung:',
				substeps: [
					'Ein sauberes Tuch, sterile Kompressen oder die behandschuhte Hand direkt auf die Wundstelle pressen.',
					'Mit beiden Händen und dem vollen Körpergewicht kontinuierlich Druck ausüben.',
					'Den Druck mindestens 5 Minuten lang keinesfalls anheben, um nachzuschauen.'
				]
			},
			{
				title: 'TIEFE WUNDEN AUSSTOPFEN (WUNDTAMPONADE)',
				instruction:
					'Bei tiefen Wunden an Leiste, Achsel oder Hals, wo einfacher Druck nicht ausreicht:',
				substeps: [
					'Verbandstoff oder Hämostyptikum fest und tief in die Wundhöhle bis zum verletzten Gefäß stopfen.',
					'Anschließend mindestens 3 Minuten lang mit vollem manuellem Druck komprimieren.'
				]
			},
			{
				title: 'TOURNIQUET BEI KRITISCHER GLIEDMASSENBLUTUNG',
				instruction: 'Wenn eine spritzende oder strömende Blutung an Arm oder Bein unstillbar ist:',
				substeps: [
					'Tourniquet 5 bis 7 cm oberhalb der Wunde (nicht auf einem Gelenk) um die Gliedmaße legen.',
					'Knebelschraube zudrehen, bis die arterielle Blutung vollständig stoppt und kein Puls mehr tastbar ist.',
					'Knebel im Verschluss sichern und die genaue Uhrzeit der Anlage auf dem Band notieren.'
				]
			},
			{
				title: 'NOTRUF 112 WÄHLEN & WÄRME ERHALTEN',
				instruction:
					'Rettungsdienst unverzüglich alarmieren, Patient flach lagern und mit Rettungsdecke warm halten, um Gerinnungsstörungen zu verhindern.'
			}
		]
	},
	'blood-sugar-has-left-the-chat': {
		en: [
			{
				title: 'ASSESS CONSCIOUSNESS & SWALLOWING REFLEX',
				instruction: 'Determine if the person can safely swallow without risk of fatal aspiration:',
				variants: [
					{
						condition: 'Conscious and Alert',
						action: 'Administer fast-acting oral carbohydrates immediately.'
					},
					{
						condition: 'Drowsy, Confused, or Unconscious',
						action:
							'Strictly ZERO oral liquids or foods. Place in recovery position and call 911/112.'
					}
				]
			},
			{
				title: 'APPLY THE "RULE OF 15" FOR CONSCIOUS PATIENTS',
				instruction: 'Deliver 15 to 20 grams of fast-acting simple glucose:',
				substeps: [
					'Give 150–200 ml (half a glass) of fruit juice/regular soda, or 3–4 glucose tablets, or 1 tablespoon of sugar/honey.',
					'Avoid chocolate, milk, or pastries (fat delays gastric glucose absorption by 20–30 min).',
					'Wait 15 minutes and re-test blood glucose. If still < 70 mg/dL (3.9 mmol/L), repeat 15g sugar dose.'
				]
			},
			{
				title: 'EMERGENCY GLUCAGON & 911/112 FOR UNCONSCIOUS PATIENT',
				instruction: 'For severe hypoglycemia with altered mental status or unconsciousness:',
				substeps: [
					'Administer prescribed emergency glucagon (nasal Baqsimi spray 3 mg or intramuscular injection) if trained.',
					'Call 911 / 112 immediately and state: "Severe diabetic hypoglycemia with unconsciousness."',
					'Monitor breathing continuously until paramedics take over.'
				]
			}
		],
		de: [
			{
				title: 'BEWUSSTSEIN & SCHLUCKREFLEX PRÜFEN',
				instruction:
					'Überprüfen, ob die Person gefahrlos schlucken kann (Aspirationsgefahr bei Schläfrigkeit):',
				variants: [
					{
						condition: 'Person ansprechbar & wach',
						action: 'Sofort schnell wirksame Kohlenhydrate oral verabreichen.'
					},
					{
						condition: 'Schläfrig, verwirrt oder bewusstlos',
						action:
							'Niemals Flüssigkeiten/Essen einflößen! Stabile Seitenlage und Notruf 112 wählen.'
					}
				]
			},
			{
				title: '„15ER-REGEL“ BEI WACHEN PERSONEN ANWENDEN',
				instruction: '15 bis 20 Gramm schnell wirksamen Einfachzucker verabreichen:',
				substeps: [
					'150–200 ml Fruchtsaft / normale Limonade, 4 Traubenzucker-Plättchen oder 1 Esslöffel Zucker/Honig geben.',
					'Keine Schokolade, Milch oder Kuchen (Fett verzögert die Magenentleerung um 20–30 Minuten).',
					'15 Minuten warten und Blutzucker erneut messen. Liegt er weiter unter 70 mg/dl (3,9 mmol/l): Erneut 15 g Zucker geben.'
				]
			},
			{
				title: 'NOTFALL-GLUKAGON & NOTRUF 112 BEI BEWUSSTLOSIGKEIT',
				instruction: 'Bei schwerer Unterzuckerung mit Bewusstseinsverlust:',
				substeps: [
					'Notfall-Glukagon (z. B. Baqsimi Nasenspray 3 mg oder intramuskuläre Spritze) verabreichen, falls verordnet/geschult.',
					'Sofort Notruf 112 wählen: „Schwere diabetische Hypoglykämie, Person bewusstlos.“',
					'Atmung kontinuierlich überwachen bis der Notarzt eintrifft.'
				]
			}
		]
	},
	'chest-feeling-unreasonably-heavy': {
		en: [
			{
				title: 'CALL 911 / 112 IMMEDIATELY',
				instruction:
					'Report suspected acute coronary syndrome (heart attack) and put dispatch on speakerphone.'
			},
			{
				title: 'POSITION IN COMFORTABLE UPRIGHT POSITION',
				instruction:
					'Seat the person with their upper body elevated and supported to reduce mechanical cardiac workload (preload).'
			},
			{
				title: 'ENFORCE COMPLETE PHYSICAL REST',
				instruction: 'Loosen tight clothing and strictly prohibit walking, standing, or exertion.'
			},
			{
				title: 'PREPARE AED & MONITOR FOR ARREST',
				instruction: 'Have a defibrillator ready and monitor responsiveness:',
				variants: [
					{
						condition: 'If Person Loses Consciousness and Normal Breathing',
						action: 'Lower flat to the floor and begin CPR 30:2 immediately.'
					}
				]
			}
		],
		de: [
			{
				title: 'SOFORT NOTRUF 112 WÄHLEN',
				instruction:
					'Verdacht auf Herzinfarkt (akutes Koronarsyndrom) melden und Telefon auf Lautsprecher stellen.'
			},
			{
				title: 'OBERKÖRPER HOCHLAGERN (HERZENTLASTUNG)',
				instruction:
					'Person mit erhöhtem Oberkörper bequem und abgestützt hinsetzen, um die Vorlast des Herzens mechanisch zu senken.'
			},
			{
				title: 'ABSOLUTE KÖRPERLICHE RUHE DURCHSETZEN',
				instruction:
					'Enge Kleidung lockern; jedes Gehen, Stehen oder Anstrengen strikt verbieten.'
			},
			{
				title: 'AED BEREITHALTEN & ATMUNG ÜBERWACHEN',
				instruction: 'Defibrillator griffbereit halten und Bewusstsein überwachen:',
				variants: [
					{
						condition: 'Bei Bewusstlosigkeit und Atemstillstand',
						action: 'Sofort flach auf den Boden legen und unverzüglich CPR 30:2 starten.'
					}
				]
			}
		]
	},
	'face-doing-something-weird-on-one-side': {
		en: [
			{
				title: 'PERFORM FAST STROKE ASSESSMENT',
				instruction: 'Quickly evaluate the four critical stroke criteria:',
				substeps: [
					'Face: Ask the person to smile. Does one side of the mouth or face droop?',
					'Arms: Ask them to raise both arms forward with palms up. Does one arm drift downward?',
					'Speech: Ask them to repeat a simple sentence. Is speech slurred or incomprehensible?',
					'Time: Note the exact minute symptoms began. Time is Brain!'
				]
			},
			{
				title: 'CALL 911 / 112 IMMEDIATELY',
				instruction:
					'Report suspected acute stroke, time of symptom onset, and request immediate transport to a certified Stroke Unit.'
			},
			{
				title: 'POSITION PATIENT & RESTRICT ALL ORAL INTAKE',
				instruction:
					'Position the patient with their upper body slightly elevated (~30°) and prohibit food, water, or medication due to silent dysphagia risk.',
				variants: [
					{
						condition: 'If Unconscious with Normal Breathing',
						action: 'Place in recovery position with the paralyzed side upwards.'
					}
				]
			}
		],
		de: [
			{
				title: 'FAST-SCHNELLTEST DURCHFÜHREN',
				instruction: 'Die vier Kriterien des Schlaganfall-Schemas unverzüglich prüfen:',
				substeps: [
					'Face (Gesicht): Person lächeln lassen. Hängt ein Mundwinkel oder eine Gesichtshälfte herab?',
					'Arms (Arme): Beide Arme nach vorne anheben lassen. Sinkt ein Arm ab oder dreht sich?',
					'Speech (Sprache): Einen einfachen Satz nachsprechen lassen. Klingt die Sprache verwaschen oder unverständlich?',
					'Time (Zeit): Notiere die genaue Uhrzeit des Symptombeginns. Time is Brain!'
				]
			},
			{
				title: 'SOFORT NOTRUF 112 WÄHLEN',
				instruction:
					'Verdacht auf akuten Schlaganfall und Symptombeginn melden; Zielklinik mit Stroke Unit anfordern.'
			},
			{
				title: 'PATIENTEN LAGERN & ORALE AUFNAHME VERBIETEN',
				instruction:
					'Oberkörper leicht erhöht (~30°) lagern und strikt keine Getränke oder Medikamente geben (hohe Erstickungsgefahr durch Schlucklähmung).',
				variants: [
					{
						condition: 'Bei Bewusstlosigkeit mit normaler Atmung',
						action: 'In die stabile Seitenlage bringen (gelähmte Seite nach oben).'
					}
				]
			}
		]
	},
	'asthma-inhaler-not-doing-the-job': {
		en: [
			{
				title: 'ADOPT TRIPOD POSITION (KUTSCHERSITZ)',
				instruction:
					'Sit upright leaning forward with hands or elbows braced against knees to mobilize accessory respiratory muscles.'
			},
			{
				title: 'ADMINISTER RESCUE INHALER WITH SPACER',
				instruction: 'Use prescribed short-acting beta-2 agonist (Salbutamol / Albuterol):',
				substeps: [
					'Inhale 4 to 10 puffs using a spacer chamber, waiting 30 to 60 seconds between single puffs.',
					'Use pursed-lip breathing (slow exhale against lightly closed lips) to keep small airways open.'
				]
			},
			{
				title: 'CALL 911 / 112 IF NO IMMEDIATE RELIEF',
				instruction:
					'Call emergency dispatch immediately if speech is fragmented, chest is silent, lips turn blue, or inhaler fails after 5 minutes.'
			}
		],
		de: [
			{
				title: 'KUTSCHERSITZ / TORWARTHALTUNG EINNEHMEN',
				instruction:
					'Aufrecht hinsetzen, Oberkörper leicht nach vorne beugen und Hände auf den Knien aufstützen (aktiviert die Atemhilfsmuskulatur).'
			},
			{
				title: 'NOTFALL-INHALATOR MIT SPACER INHALIEREN',
				instruction: 'Verordnetes Notfallspray (Salbutamol / Fenoterol) unverzüglich einsetzen:',
				substeps: [
					'4 bis 10 Hübe über eine Inhalierhilfe (Spacer) verabreichen, jeweils 30–60 Sekunden Pause zwischen einzelnen Hüben.',
					'Lippenbremse anwenden: Langsam gegen die leicht geschlossenen Lippen ausatmen, um die Bronchien offen zu halten.'
				]
			},
			{
				title: 'NOTRUF 112 WÄHLEN BEI FEHLENDER BESSERUNG',
				instruction:
					'Rettungsdienst sofort rufen bei Unfähigkeit ganze Sätze zu sprechen, blauen Lippen, Stillem Thorax oder ausbleibender Wirkung nach 5 Minuten.'
			}
		]
	},
	'person-unconscious-but-inconveniently-still-breathing': {
		en: [
			{
				title: 'VERIFY UNRESPONSIVENESS & NORMAL BREATHING',
				instruction:
					'Gently shake shoulders, shout loudly, and tilt head back to check breathing for up to 10 seconds.'
			},
			{
				title: 'CALL 911 / 112 IMMEDIATELY',
				instruction:
					'Report an unresponsive patient with confirmed normal breathing, putting dispatch on speaker.'
			},
			{
				title: 'PLACE IN RECOVERY POSITION (STABLE SIDE POSITION)',
				instruction: 'Protect airway from supine flaccid tongue blockage and gastric aspiration:',
				substeps: [
					'Kneel beside patient. Place near arm at a right angle (90°) with palm facing up.',
					'Bring far arm across chest, placing back of their hand against their near cheek.',
					'Grasp far knee and pull leg up, then roll patient toward you onto their side.',
					'Tilt head back gently to open airway and point mouth downward so fluids drain.'
				]
			},
			{
				title: 'CONTINUOUSLY MONITOR BREATHING',
				instruction: 'Keep hand on chest to feel regular breaths until emergency medical arrival:',
				variants: [
					{
						condition: 'If Breathing Stops or Becomes Agonal',
						action: 'Turn patient flat onto their back and begin CPR 30:2 immediately.'
					}
				]
			}
		],
		de: [
			{
				title: 'BEWUSSTLOSIGKEIT & NORMALE ATMUNG ÜBERPRÜFEN',
				instruction:
					'Laut ansprechen, an den Schultern rütteln, Kopf nackenwärts überstrecken und max. 10 Sekunden auf normale Atmung prüfen.'
			},
			{
				title: 'NOTRUF 112 WÄHLEN',
				instruction:
					'Rettungsleitstelle melden: „Bewusstlose Person mit vorhandener normaler Atmung.“'
			},
			{
				title: 'IN DIE STABILE SEITENLAGE BRINGEN',
				instruction:
					'Atemwege vor Zurückfallen der Zunge und Aspiration von Mageninhalt sichern:',
				substeps: [
					'Neben die Person knien. Den nahen Arm im 90-Grad-Winkel nach oben abwinkeln (Handfläche nach oben).',
					'Den fernen Arm über die Brust legen und den Handrücken an die Wange der nahen Seite halten.',
					'Das ferne Knie greifen und hochziehen, dann die Person zu sich herüber auf die Seite rollen.',
					'Kopf sanft nach hinten überstrecken, Mund leicht öffnen und nach unten ausrichten.'
				]
			},
			{
				title: 'ATMUNG KONTINUIERLICH ÜBERWACHEN',
				instruction: 'Hand auf den Brustkorb legen und Atemzüge kontinuierlich überwachen:',
				variants: [
					{
						condition: 'Bei Aussetzen der normalen Atmung',
						action:
							'Sofort auf den Rücken drehen und unverzüglich mit der Herzdruckmassage (CPR) beginnen.'
					}
				]
			}
		]
	},
	'open-chest-wound-sucking-sound': {
		en: [
			{
				title: 'EXPOSE AND SEAL WOUND IMMEDIATELY',
				instruction: 'Quickly expose puncture wound and cover immediately with a gloved hand during exhale.'
			},
			{
				title: 'APPLY VENTED CHEST SEAL',
				instruction:
					'Apply a commercial vented chest seal (with one-way flutter valve) centered over the puncture.',
				substeps: [
					'Wipe blood and sweat from skin to ensure adhesive sticks.',
					'Place one-way valve directly over hole to let air escape during exhalation and block ingress during inhalation.'
				]
			},
			{
				title: 'POSITION PATIENT & CALL 911 / 112',
				instruction:
					'Allow the patient to sit semi-upright or lean toward the injured side to maximize lung expansion.'
			},
			{
				title: 'MONITOR FOR TENSION PNEUMOTHORAX',
				instruction: 'Watch for sudden worsening of dyspnea, tracheal deviation, or cyanosis:',
				variants: [
					{
						condition: 'If Tension Pneumothorax Develops',
						action: 'Immediately peel back/burp the chest seal to release trapped intrapleural pressure.'
					}
				]
			}
		],
		de: [
			{
				title: 'WUNDE FREILEGEN & SOFORT ABDICHTEN',
				instruction:
					'Brustkorbwunde sofort freilegen und während des Ausatmens mit der behandschuhten Hand abdichten.'
			},
			{
				title: 'VENTIL-BRUSTPFLASTER (CHEST SEAL) ANBRINGEN',
				instruction:
					'Ein ventiliertes Chest Seal (mit Einweg-Flatterventil) mittig über der Einstichstelle aufkleben:',
				substeps: [
					'Haut um die Wunde kurz von Blut und Schweiß befreien, damit die Klebefläche haftet.',
					'Einwegventil über der Wunde platzieren: Lässt Überdruck beim Ausatmen entweichen und sperrt beim Einatmen.'
				]
			},
			{
				title: 'PATIENTEN LAGERN & NOTRUF 112 WÄHLEN',
				instruction:
					'Oberkörper erhöht oder leicht zur verletzten Seite geneigt lagern, um die gesunde Lunge zu entlasten.'
			},
			{
				title: 'AUF SPANNUNGSPNEUMOTHORAX ÜBERWACHEN',
				instruction:
					'Auf zunehmende Atemnot, Zyanose (blaue Lippen) und Kollaps achten:',
				variants: [
					{
						condition: 'Bei Zeichen eines Spannungspneumothorax',
						action:
							'Das Pflaster sofort an einer Ecke anheben (Burping), um gefangene Überdruckluft abzulassen.'
					}
				]
			}
		]
	},
	'person-currently-having-a-seizure': {
		en: [
			{
				title: 'PROTECT FROM TRAUMA & CLEAR AREA',
				instruction:
					'Move sharp, hard, or dangerous objects away from the convulsing person and place a soft jacket under their head.'
			},
			{
				title: 'NEVER RESTRAIN OR INSERT OBJECTS INTO MOUTH',
				instruction:
					'Allow the seizure to run its course. Forcing spoons, fingers, or objects between teeth causes broken teeth and airway obstruction.'
			},
			{
				title: 'TIME SEIZURE & CALL 911 / 112',
				instruction: 'Note start time; call emergency dispatch immediately:',
				variants: [
					{
						condition: 'Seizure lasts > 5 minutes or repeats',
						action: 'High-priority status epilepticus emergency: Dispatch paramedics immediately.'
					},
					{
						condition: 'First-time seizure, pregnancy, or injury',
						action: 'Requires immediate emergency transport.'
					}
				]
			},
			{
				title: 'POST-ICTAL RECOVERY POSITION',
				instruction:
					'Once motor convulsions stop, roll the person into the recovery position, clear fluids from mouth, and stay until fully awake.'
			}
		],
		de: [
			{
				title: 'VOR VERLETZUNGEN SCHÜTZEN & UMGEBUNG RÄUMEN',
				instruction:
					'Harte und scharfkantige Gegenstände wegräumen; den Kopf mit einem weichen Kleidungsstück unterpolstern.'
			},
			{
				title: 'KEINESFALLS FESTHALTEN ODER ETWAS IN DEN MUND STECKEN',
				instruction:
					'Den Anfall ablaufen lassen. Finger, Löffel oder Beißkeile im Mund brechen Zähne und blockieren die Atemwege.'
			},
			{
				title: 'ANFALLSDAUER STOPPEN & NOTRUF 112 WÄHLEN',
				instruction: 'Genaue Uhrzeit notieren und Rettungsdienst alarmieren:',
				variants: [
					{
						condition: 'Anfall dauert > 5 Minuten oder wiederholt sich',
						action:
							'Status epilepticus (akute Lebensgefahr): Höchste Notarzt-Priorität melden.'
					},
					{
						condition: 'Erster Anfall, Schwangerschaft oder Begleitverletzung',
						action: 'Sofortige klinische Notfallversorgung anfordern.'
					}
				]
			},
			{
				title: 'POSTIKTALE STABILE SEITENLAGE',
				instruction:
					'Nach Ende der Muskelkrämpfe die Person in die stabile Seitenlage bringen und bei ihr bleiben, bis sie voll orientiert ist.'
			}
		]
	},
	'head-recently-met-something-solid': {
		en: [
			{
				title: 'IMMOBILIZE CERVICAL SPINE & RESTRICT MOVEMENT',
				instruction:
					'Keep head, neck, and spine aligned in a neutral position. Avoid turning or tilting the neck.'
			},
			{
				title: 'EVALUATE RED-FLAG NEUROLOGICAL SIGNS',
				instruction: 'Check for high-risk indicators of intracranial hemorrhage or fracture:',
				substeps: [
					'Any loss of consciousness or amnesia surrounding the impact.',
					'Unequal pupil size, repeated vomiting, or worsening severe headache.',
					'Clear watery fluid or blood draining from ears or nose.'
				]
			},
			{
				title: 'CALL 911 / 112 AND ENFORCE REST',
				instruction:
					'If any red flags are present, call emergency services immediately. Keep patient awake, calm, and strictly avoid alcohol or sedatives.'
			}
		],
		de: [
			{
				title: 'HALSWIRBELSÄULE RUHIGSTELLEN & BEWEGUNG STOPPEN',
				instruction:
					'Kopf, Nacken und Wirbelsäule in neutraler Achse halten. Unnötiges Drehen oder Bewegen des Kopfes verhindern.'
			},
			{
				title: 'AUF NEUROLOGISCHE ALARMZEICHEN PRÜFEN',
				instruction: 'Auf lebensgefährliche Warnzeichen einer Hirnblutung achten:',
				substeps: [
					'Jede Bewusstlosigkeit oder Gedächtnislücke um das Unfallereignis.',
					'Ungleich große Pupillen, wiederholtes Erbrechen oder rapide stärker werdende Kopfschmerzen.',
					'Austritt von klarer Flüssigkeit (Hirnwasser) oder Blut aus Nase oder Ohren.'
				]
			},
			{
				title: 'NOTRUF 112 WÄHLEN & RUHE DURCHSETZEN',
				instruction:
					'Bei Vorliegen von Alarmzeichen sofort Notruf wählen. Person ruhig lagern, nicht alleine lassen und keine Schmerzmittel/Alkohol geben.'
			}
		]
	},
	'person-looking-alarmingly-pale-after-something-bad-happened': {
		en: [
			{
				title: 'CALL 911 / 112 & IDENTIFY SHOCK CAUSE',
				instruction:
					'Report severe circulatory shock and immediately address triggers (e.g. compress external bleeding, remove allergen).'
			},
			{
				title: 'POSITION IN PASSIVE LEG RAISE (SHOCK POSITION)',
				instruction: 'Elevate legs 20 to 30 cm (8 to 12 inches) to autotransfuse venous blood to heart and brain:',
				variants: [
					{
						condition: 'Hypovolemic / Anaphylactic Shock',
						action: 'Flat on back with elevated legs.'
					},
					{
						condition: 'Cardiogenic Shock / Chest Pain',
						action: 'Semi-seated with elevated upper body (do NOT raise legs).'
					},
					{
						condition: 'Breathing Difficulty',
						action: 'Supported upright sitting.'
					}
				]
			},
			{
				title: 'PREVENT HYPOTHERMIA & STRICTLY PROHIBIT ORAL INTAKE',
				instruction:
					'Wrap patient in a rescue blanket (gold side outward) and give zero liquids or food due to gastric stasis and aspiration risk.'
			}
		],
		de: [
			{
				title: 'NOTRUF 112 WÄHLEN & URSACHE BEKÄMPFEN',
				instruction:
					'Schockzustand melden und sofort die Schockursache stoppen (z. B. starke Blutung abdrücken, Allergenzufuhr stoppen).'
			},
			{
				title: 'SCHOCKLAGERUNG DURCHFÜHREN (BEINE HOCH)',
				instruction:
					'Beine um 20 bis 30 cm anheben, um ca. 300–500 ml venöses Blut zum Körperkern zurückzuführen:',
				variants: [
					{
						condition: 'Volumenmangel- / Allergischer Schock',
						action: 'Flach auf dem Rücken mit erhöhten Beinen lagern.'
					},
					{
						condition: 'Kardiogener Schock / Herzbeschwerden',
						action: 'Oberkörper erhöht lagern (Beine NICHT hochlagern).'
					},
					{
						condition: 'Atemnot im Vordergrund',
						action: 'Sitzende, aufrechte Haltung unterstützen.'
					}
				]
			},
			{
				title: 'WÄRME ERHALTEN & ORALE AUFNAHME VERBIETEN',
				instruction:
					'Mit Rettungsdecke warm einpacken und strikt keine Getränke oder Nahrung geben (Gefahr des Magenstillstands und der Aspiration).'
			}
		]
	},
	'something-important-is-no-longer-attached': {
		en: [
			{
				title: 'CONTROL LIFE-THREATENING BLEEDING FIRST',
				instruction:
					'Apply direct pressure, pack wound, or place a windlass tourniquet 5–7 cm proximal on the stump.'
			},
			{
				title: 'CALL 911 / 112 IMMEDIATELY',
				instruction:
					'Notify dispatch of traumatic amputation so a specialized replantation center can be prepared.'
			},
			{
				title: 'PACKAGE AMPUTATED PART (3-LAYER RULE)',
				instruction: 'Preserve tissue viability without causing irreversible frostbite necrosis:',
				substeps: [
					'Layer 1: Wrap severed part in clean, dry sterile gauze (never soak in water).',
					'Layer 2: Place wrapped part into a watertight sealed plastic bag.',
					'Layer 3: Place sealed bag into an outer container with an ice-water slurry at ~4°C (never put part directly on ice).'
				]
			}
		],
		de: [
			{
				title: 'LEBENSBEDROHLICHE BLUTUNG ZUERST STILLEN',
				instruction:
					'Stumpf mit direktem Druck abdrücken, tamponieren oder Tourniquet 5–7 cm oberhalb am Gliedmaßenstumpf anlegen.'
			},
			{
				title: 'NOTRUF 112 WÄHLEN & REPLANTATION ANMELDEN',
				instruction:
					'Traumatische Amputation melden, damit der Rettungsdienst ein Replantationszentrum ansteuern kann.'
			},
			{
				title: 'AMPUTAT NACH DEM 3-SCHICHTEN-PRINZIP SICHERN',
				instruction: 'Amputat kühl lagern, ohne Gefriernekrosen durch direkten Eiskontakt zu erzeugen:',
				substeps: [
					'Schicht 1: Amputat trocken in sterile Kompressen oder ein sauberes Tuch wickeln (nicht waschen).',
					'Schicht 2: Das eingewickelte Amputat in einen wasserdichten Plastikbeutel geben und verschließen.',
					'Schicht 3: Den Beutel in einen Behälter mit Eiswasser-Gemisch (~4°C) legen (niemals direkt auf Eis legen).'
				]
			}
		]
	},
	'body-part-pointing-in-a-new-and-unapproved-direction': {
		en: [
			{
				title: 'IMMOBILIZE IN FOUND POSITION',
				instruction:
					'Support and splint the injured limb in the exact position found. Never attempt amateur bone or joint realignment.'
			},
			{
				title: 'ASSESS CIRCULATION, SENSATION & MOTOR FUNCTION (CSM)',
				instruction:
					'Check distal pulse, capillary refill (<2s), skin warmth, finger/toe sensation, and movement.'
			},
			{
				title: 'COVER OPEN WOUNDS & CALL 911 / 112',
				instruction:
					'Cover exposed bone sterilely (never push bone fragments back into tissue) and call emergency dispatch.'
			}
		],
		de: [
			{
				title: 'IN DER VORGEFUNDENEN POSITION RUHIGSTELLEN',
				instruction:
					'Gliedmaße in der bestehenden Fehlstellung mit Polstermaterial oder Schiene fixieren. Niemals Gelenke eigenmächtig einrenken.'
			},
			{
				title: 'DURCHBLUTUNG, MOTORIK & SENSIBILITÄT PRÜFEN (pDMS)',
				instruction:
					'Peripheren Puls tasten, Rekapillarisierungszeit (<2 Sek.) prüfen, Gefühl und Finger-/Zehenbeweglichkeit testen.'
			},
			{
				title: 'OFFENE BRÜCHE STERIL ABDECKEN & NOTRUF 112',
				instruction:
					'Herausragende Knochenteile steril abdecken (keinesfalls zurück in die Wunde drücken) und Rettungsdienst alarmieren.'
			}
		]
	},
	'sudden-crushing-headache-like-thunder': {
		en: [
			{
				title: 'CALL 911 / 112 IMMEDIATELY',
				instruction:
					'Report sudden onset thunderclap headache reaching maximum severity within seconds (suspected subarachnoid hemorrhage).'
			},
			{
				title: 'ENFORCE ABSOLUTE PHYSICAL REST',
				instruction:
					'Lay patient quietly with upper body slightly elevated in a dark, calm room; strictly prohibit exertion.'
			},
			{
				title: 'MONITOR CONSCIOUSNESS & PROHIBIT ASPIRIN',
				instruction:
					'Do not give aspirin or NSAIDs (which worsen intracranial bleeding). Prepare recovery position if consciousness declines.'
			}
		],
		de: [
			{
				title: 'SOFORT NOTRUF 112 WÄHLEN',
				instruction:
					'Schlagartig aufgetretenen Vernichtungskopfschmerz (Donnerschlagkopfschmerz) als neurologischen Notfall melden.'
			},
			{
				title: 'ABSOLUTE KÖRPERLICHE RUHE EINHALTEN',
				instruction:
					'Oberkörper leicht erhöht in abgedunkelter, ruhiger Umgebung lagern; jede Anstrengung strikt verbieten.'
			},
			{
				title: 'BEWUSSTSEIN ÜBERWACHEN & KEIN ASPIRIN GEBEN',
				instruction:
					'Keine blutverdünnenden Schmerzmittel (wie Aspirin) verabreichen. Bei Eintrübung stabile Seitenlage vorbereiten.'
			}
		]
	},
	'heat-cramps-and-exhaustion-escalating': {
		en: [
			{
				title: 'MOVE TO COOL ENVIRONMENT & LOOSEN CLOTHING',
				instruction:
					'Stop all activity immediately and move to air conditioning or deep shade.'
			},
			{
				title: 'ORAL REHYDRATION WITH ELECTROLYTES',
				instruction: 'Sip electrolyte sports drinks or salt-water solution (never chug large amounts of salt-free water).'
			},
			{
				title: 'ACTIVE EXTERNAL COOLING & MONITOR FOR HEAT STROKE',
				instruction: 'Apply cool wet towels to neck, armpits, and groin:',
				variants: [
					{
						condition: 'If Confusion, Seizures, or Temp > 40°C Occurs',
						action:
							'Call 911/112 immediately for Heat Stroke: Begin aggressive cold-water immersion.'
					}
				]
			}
		],
		de: [
			{
				title: 'IN DEN SCHATTEN BRINGEN & KLEIDUNG LOCKERN',
				instruction:
					'Körperliche Belastung sofort stoppen und in kühle, schattige oder klimatisierte Umgebung wechseln.'
			},
			{
				title: 'ELEKTROLYTHALTIGE FLÜSSIGKEIT ZUFÜHREN',
				instruction:
					'Schluckweise elektrolytreiche Getränke oder leicht gesalzenes Wasser trinken (keine reinen Wassermengen stürzen).'
			},
			{
				title: 'AKTIV KÜHLEN & AUF HITZSCHLAG ÜBERWACHEN',
				instruction: 'Feuchte Tücher auf Nacken, Achseln und Leisten auflegen:',
				variants: [
					{
						condition: 'Bei Verwirrtheit, Krämpfen oder Körpertemp > 40°C',
						action:
							'Sofort Notruf 112 wegen Hitzschlag: Aggressive Ganzkörperkühlung mit Eiswasser einleiten.'
					}
				]
			}
		]
	},
	'frostbite-turning-fingers-waxy-and-solid': {
		en: [
			{
				title: 'SEEK WARM SHELTER & PREVENT FURTHER FREEZING',
				instruction:
					'Move indoors, remove wet constricting gloves/boots, and shelter from wind.'
			},
			{
				title: 'NEVER REWARM IF RISK OF REFREEZING EXISTS',
				instruction:
					'A freeze-thaw-refreeze cycle causes total irreversible tissue death. If walking on frostbitten feet is required to reach shelter, delay rewarming.'
			},
			{
				title: 'CONTROLLED WARM WATER BATH REWARMING',
				instruction:
					'Immerse frostbitten tissue in warm water (37°C to 39°C / 98.6°F to 102.2°F) for 15 to 30 minutes until skin softens and pink color returns.',
				substeps: [
					'Never rub with snow or massage frozen tissue (internal ice crystals shred capillaries).',
					'Never use dry heat (radiators, campfires, blowdryers) due to severe numbness burn risks.'
				]
			},
			{
				title: 'PROTECT WITH STERILE DRESSING & CALL 911 / 112',
				instruction:
					'Place dry sterile gauze between toes/fingers, elevate limb, and seek hospital burn/frostbite treatment.'
			}
		],
		de: [
			{
				title: 'WARMEN SCHUTZRAUM AUFSUCHEN & NÄSSE ENTFERNEN',
				instruction:
					'In ein warmes Gebäude wechseln, nasse und einschnürende Kleidung vorsichtig ausziehen.'
			},
			{
				title: 'NIEMALS AUFTAUEN, WENN WIEDEREINFRIEREN DROHT',
				instruction:
					'Ein Auftau-Wiedereinfrier-Zyklus führt zu vollständiger Gewebenekrose. Müssen erfrorene Füße zur Rettung noch benutzt werden, erst am endgültigen Zufluchtsort erwärmen.'
			},
			{
				title: 'KONTROLLIERTES WARMES WASSERBAD (37–39°C)',
				instruction:
					'Betroffene Gliedmaßen für 15 bis 30 Minuten in körperwarmes Wasser (37 bis 39°C) tauchen, bis das Gewebe weich wird:',
				substeps: [
					'Erfrierungen niemals mit Schnee abreiben (Eiskristalle zerschneiden feine Blutgefäße).',
					'Keine trockene Hitze (Heizkörper, Föhn, Feuer) verwenden (hohe Verbrennungsgefahr bei tauber Haut).'
				]
			},
			{
				title: 'STERIL POLSTERN & ÄRZTLICHE HILFE SUCHEN',
				instruction:
					'Sterile Verbandwatte zwischen Finger/Zehen legen, Gliedmaße hochlagern und Notarzt/Klinik aufsuchen.'
			}
		]
	},
	'hair-suddenly-vertical': {
		en: [
			{
				title: 'LEAVE EXPOSED TERRAIN IMMEDIATELY',
				instruction: 'Vertical hair indicates you are inside an active electrostatic streamer channel:',
				substeps: [
					'Move off ridges, hilltops, open fields, golf courses, and water surfaces immediately.',
					'Stay clear of lone trees, flagpoles, metal fences, and tall isolated structures.'
				]
			},
			{
				title: 'SEEK SUBSTANTIAL ENCLOSED SHELTER',
				instruction:
					'Enter a substantial enclosed building with plumbing/wiring or a hard-topped metal vehicle.',
				substeps: [
					'Fully enclosed metal vehicles with windows rolled up act as a safe Faraday cage.',
					'Avoid open shelters like gazebos, picnic pavilions, or tents.'
				]
			},
			{
				title: 'EMERGENCY CROUCH (LAST RESORT IF STRANDED)',
				instruction: 'If caught in open terrain with no shelter reachable in time:',
				substeps: [
					'Crouch down low on the balls of your feet with heels pressed firmly together.',
					'Tuck head between knees and cover ears with hands.',
					'Minimize contact with soil; touching heels keeps ground current away from your heart.'
				],
				note: 'The crouch is a desperate last-resort mitigation, not a substitute for enclosed shelter.'
			}
		],
		de: [
			{
				title: 'EXPONIERTES GELÄNDE SOFORT VERLASSEN',
				instruction:
					'Senkrecht stehende Haare bedeuten, dass du dich in einem aktiven elektrostatischen Vorentladungskanal befindest:',
				substeps: [
					'Berggipfel, Grate, Freiflächen, Golfplätze und Wasserflächen ohne Sekunde Verzögerung verlassen.',
					'Weit weg von einzelnen Bäumen, Masten, Metallzäunen und hohen Objekten bewegen.'
				]
			},
			{
				title: 'FESTES GEBÄUDE ODER VOLLMETALL-FAHRZEUG AUFSUCHEN',
				instruction:
					'In ein Gebäude mit Blitzschutz/Leitungen oder ein geschlossenes Metallfahrzeug flüchten.',
				substeps: [
					'Fahrzeuge mit geschlossenen Fenstern wirken als schützender Faradayscher Käfig.',
					'Offene Unterstände wie Pavillons, Carports oder Zelte bieten keinen Schutz.'
				]
			},
			{
				title: 'NOTFALL-KAUERSTELLUNG (WENN KEIN SCHUTZ ERREICHBAR)',
				instruction: 'Wenn man im freien Gelände ohne rettendes Gebäude überrascht wird:',
				substeps: [
					'In die Hocke gehen, auf die Fußballen stellen und die Fersen fest aneinanderpressen.',
					'Kopf einziehen, zwischen die Knie nehmen und Ohren mit den Händen zuhalten.',
					'Bodenkontakt minimieren; geschlossene Fersen leiten Schrittspannung vom Herzen weg.'
				],
				note: 'Die Kauerstellung ist eine Notmaßnahme und kein vollwertiger Ersatz für Schutzräume.'
			}
		]
	},
	'tree-suspiciously-alone-during-a-thunderstorm': {
		en: [
			{
				title: 'EVACUATE TREE VICINITY IMMEDIATELY',
				instruction:
					'Move away from any solitary tree to a distance of at least twice the tree’s total height to avoid deadly side-flashes.'
			},
			{
				title: 'SEEK ENCLOSED BUILDING OR METAL VEHICLE',
				instruction:
					'Head directly to a substantial building or hard-topped vehicle; if in a forest, seek a uniform stand of shorter trees away from edges.'
			},
			{
				title: 'CROUCH WITH FEET TOGETHER IF CAUGHT IN OPEN',
				instruction:
					'Squat low on the balls of your feet with heels touching to minimize step potential.'
			}
		],
		de: [
			{
				title: 'BAUMUMGEBUNG SOFORT WEITRÄUMIG VERLASSEN',
				instruction:
					'Mindestens die doppelte Baumhöhe Abstand zu jedem freistehenden Baum einnehmen, um lebensgefährliche Überschläge zu vermeiden.'
			},
			{
				title: 'FESTES GEBÄUDE ODER METALLFAHRZEUG AUFSUCHEN',
				instruction:
					'Direkt in ein geschlossenes Gebäude oder Auto flüchten; im Wald in gleichmäßig dichten Jungbaumbeständen Schutz suchen.'
			},
			{
				title: 'IN DER HOCKE FÜSSE ZUSAMMENSTELLEN (STEP POTENTIAL)',
				instruction:
					'Auf die Fußballen hocken und Fersen fest aneinanderstellen, um die elektrische Schrittspannung zu minimieren.'
			}
		]
	},
	'building-has-started-moving-without-permission': {
		en: [
			{
				title: 'DROP, COVER, AND HOLD ON',
				instruction: 'Protect yourself under sturdy furniture immediately during seismic shaking:',
				substeps: [
					'DROP onto hands and knees to prevent being thrown down.',
					'COVER head and neck (and entire body if possible) under a sturdy table or desk.',
					'HOLD ON to shelter with one hand and stay prepared to move with it until shaking stops.'
				]
			},
			{
				title: 'STAY INDOORS AWAY FROM EXTERIOR FAÇADES',
				instruction:
					'Do NOT run outside during shaking. Falling glass, bricks, and architectural façade elements create a fatal perimeter kill zone.'
			},
			{
				title: 'EVACUATE VIA STAIRS AFTER SHAKING CEASES',
				instruction:
					'Exit building carefully on foot using stairwells (never elevators), check for gas/water leaks, and move to open spaces.'
			}
		],
		de: [
			{
				title: 'DROP, COVER, AND HOLD ON (DUCKEN, SCHÜTZEN, FESTHALTEN)',
				instruction: 'Bei Erdbebenstößen unverzüglich Schutz unter stabilem Mobiliar suchen:',
				substeps: [
					'DROP: Auf Hände und Knie fallen, um nicht umgeworfen zu werden.',
					'COVER: Kopf und Nacken unter einem stabilen Tisch oder Schreibtisch schützen.',
					'HOLD ON: Den Tisch mit einer Hand festhalten und mitwandern, bis die Erschütterung endet.'
				]
			},
			{
				title: 'IM GEBÄUDE BLEIBEN & FASSADEN MEIDEN',
				instruction:
					'Während des Bebens keinesfalls ins Freie rennen (herabstürzende Dachziegel, Fassadenteile und Glassplitter bilden eine Todeszone).'
			},
			{
				title: 'NACH DEM BEBEN ÜBER TREPPEN EVAKUIEREN',
				instruction:
					'Gebäude nach dem Beben zügig über Treppen (niemals Aufzüge!) verlassen, Gas/Strom prüfen und Freiflächen aufsuchen.'
			}
		]
	},
	'sky-is-rotating-more-than-usual': {
		en: [
			{
				title: 'SEEK LOWEST INTERIOR ROOM IMMEDIATELY',
				instruction:
					'Move to a basement or storm cellar; if unavailable, choose a small interior room on the lowest floor (bathroom, closet) away from windows.'
			},
			{
				title: 'COVER HEAD AND BODY WITH HEAVY PROTECTION',
				instruction:
					'Protect against flying debris using a mattress, heavy blankets, sleeping bags, or bicycle/sports helmets.'
			},
			{
				title: 'EVACUATE MOBILE HOMES AND VEHICLES',
				instruction:
					'Never stay inside a mobile home or attempt to outrun a tornado in a car. Evacuate to a sturdy shelter or lie flat in a low ravine.'
			}
		],
		de: [
			{
				title: 'TIEFSTEN INNENRAUM IM GEBÄUDE AUFSUCHEN',
				instruction:
					'In den Keller oder Schutzraum flüchten; andernfalls in einen fensterlosen Innenraum im Erdgeschoss (Bad, Flur) begeben.'
			},
			{
				title: 'KOPF & KÖRPER VOR TRÜMMERN SCHÜTZEN',
				instruction:
					'Mit Matratzen, dicken Decken oder Helmen vor durch die Luft geschleuderten Trümmerteilen schützen.'
			},
			{
				title: 'WOHNWAGEN UND FAHRZEUGE SOFORT VERLASSEN',
				instruction:
					'Keinesfalls in Wohnwagen bleiben oder im Auto vor dem Tornado fliehen. In ein festes Gebäude oder eine tiefe Bodenmulde flüchten.'
			}
		]
	},
	'cold-excessive': {
		en: [
			{
				title: 'SEEK SHELTER & REMOVE WET CLOTHING',
				instruction:
					'Move out of wind and cold, strip off wet garments, and insulate body with dry layers and windproof blankets.'
			},
			{
				title: 'HANDLE PATIENT GENTLY WITH ZERO EXERTION',
				instruction:
					'Keep hypothermic patient lying flat and motionless. Rough physical movement or sudden standing triggers fatal ventricular fibrillation.'
			},
			{
				title: 'ACTIVE CORE REWARMING ONLY',
				instruction:
					'Apply warm packs to the chest, neck, armpits, and groin. Never rub limbs or apply direct heat to extremities.'
			},
			{
				title: 'CALL 911 / 112 & MONITOR AIRWAY',
				instruction:
					'Summon advanced life support and perform continuous respiratory checks (prepare CPR if breathing ceases).'
			}
		],
		de: [
			{
				title: 'SCHUTZ SUCHEN & NASSE KLEIDUNG ENTFERNEN',
				instruction:
					'Windgeschützten, warmen Raum aufsuchen, nasse Kleidung vorsichtig aufschneiden/ausziehen und trocken einpacken.'
			},
			{
				title: 'PATIENTEN VORSICHTIG BEHANDELN (KEINE BEWEGUNG)',
				instruction:
					'Unterkühlte flach lagern und jede Eigenbewegung verbieten (plötzliches Bewegen spült eiskaltes Blut zum Herzen und löst Kammerflimmern aus).'
			},
			{
				title: 'NUR DEN KÖRPERKERN AKTIV ERWÄRMEN',
				instruction:
					'Wärmepads nur auf Brust, Nacken, Achseln und Leisten auflegen. Arme und Beine niemals massieren oder direkt beheizen.'
			},
			{
				title: 'NOTRUF 112 WÄHLEN & ATMUNG ÜBERWACHEN',
				instruction:
					'Notarzt rufen und Atmung kontinuierlich kontrollieren (bei Atemstillstand sofort Reanimation einleiten).'
			}
		]
	},
	'heat-excessive': {
		en: [
			{
				title: 'CALL 911 / 112 IMMEDIATELY (HEAT STROKE EMERGENCY)',
				instruction:
					'Report severe hyperthermia / heat stroke if altered mental state, confusion, or seizures are present.'
			},
			{
				title: 'AGGRESSIVE RAPID WHOLE-BODY COOLING',
				instruction:
					'Immerse in cold water bath if available, or douse body with cold water and fan continuously while applying ice packs to neck, armpits, and groin.'
			},
			{
				title: 'MONITOR AIRWAY & PROHIBIT ORAL FLUIDS IF DROWSY',
				instruction:
					'Place in recovery position if consciousness declines; never give fluids to a confused patient due to choking risks.'
			}
		],
		de: [
			{
				title: 'SOFORT NOTRUF 112 WÄHLEN (HITZSCHLAG-NOTFALL)',
				instruction:
					'Hitzschlag mit Bewusstseinstrübung, Desorientierung oder Krämpfen als lebensbedrohlichen Notfall melden.'
			},
			{
				title: 'AGGRESSIVE GANZKÖRPERKÜHLUNG DURCHFÜHREN',
				instruction:
					'In kaltes Wasserbad tauchen (falls vorhanden) oder mit kaltem Wasser übergießen, intensiv fächeln und Eisbeutel auf Nacken, Achseln und Leisten legen.'
			},
			{
				title: 'ATEMWEGE FREIHALTEN & TRINKEN BEI BENOMMENHEIT VERBIETEN',
				instruction:
					'Bei Eintrübung in stabile Seitenlage bringen; schläfrigen Personen niemals Flüssigkeiten einflößen.'
			}
		]
	},
	'wildfire-is-now-considerably-less-distant': {
		en: [
			{
				title: 'EVACUATE IMMEDIATELY ALONG DESIGNATED ROUTES',
				instruction:
					'Leave early before smoke blocks roads. Drive downhill with headlights on and windows closed.'
			},
			{
				title: 'WEAR 100% NATURAL FIBER PROTECTIVE CLOTHING',
				instruction:
					'Wear heavy cotton/wool clothing, leather gloves, and a damp cotton mask; avoid synthetic fabrics that melt into skin.'
			},
			{
				title: 'SHELTER-IN-PLACE ONLY AS A LAST RESORT',
				instruction:
					'If trapped, stay inside a building or vehicle with windows sealed until the main flame front passes; never run into uphill brush.'
			}
		],
		de: [
			{
				title: 'SOFORT ENTLANG DER FLUCHTROUTEN EVAKUIEREN',
				instruction:
					'Frühzeitig aufbrechen, bevor Rauch die Straßen blockiert. Bergab fahren, Scheinwerfer einschalten und Fenster schließen.'
			},
			{
				title: 'SCHÜTZENDE KLEIDUNG AUS NATURFASERN TRAGEN',
				instruction:
					'Dicke Baumwoll-/Wollkleidung, Lederhandschuhe und feuchtes Baumwolltuch tragen; synthetische Kunstfasern schmelzen auf der Haut.'
			},
			{
				title: 'NUR IM ÄUSSERSTEN NOTFALL VOR ORT VERHARREN',
				instruction:
					'Wenn Flucht unmöglich ist: In festem Gebäude oder Auto mit geschlossenen Fenstern verbleiben, bis die Hauptflammenfront vorüber ist.'
			}
		]
	},
	'sea-suspiciously-missing': {
		en: [
			{
				title: 'RECOGNIZE THE TSUNAMI WARNING & RUN',
				instruction:
					'A rapidly receding shoreline, roaring ocean sound, or ground tremor means a tsunami is imminent. Move immediately without waiting for sirens.'
			},
			{
				title: 'MOVE TO HIGH GROUND OR INLAND',
				instruction:
					'Head on foot to at least 30 meters (100 ft) elevation or 3 kilometers (2 miles) inland away from rivers and beaches.'
			},
			{
				title: 'VERTICAL EVACUATION AS LAST RESORT',
				instruction:
					'If unable to reach high terrain, climb to the 4th floor or higher of a reinforced concrete building. Never return after the first wave.'
			}
		],
		de: [
			{
				title: 'TSUNAMI-WARNZEICHEN ERKENNEN & SOFORT FLIEHEN',
				instruction:
					'Zurückweichendes Meer, grollendes Meeresrauschen oder Erdbeben bedeuten akute Tsunami-Gefahr. Ohne Warten auf Sirenen sofort loslaufen!'
			},
			{
				title: 'HÖHER GELEGENES GELÄNDE ODER INLAND AUFSUCHEN',
				instruction:
					'Zu Fuß mindestens 30 Meter über den Meeresspiegel oder 3 Kilometer ins Landesinnere flüchten (Flussmündungen meiden).'
			},
			{
				title: 'VERTIKALE EVAKUIERUNG ALS LETZTER AUSWEG',
				instruction:
					'Wenn Anhöhen unerreichbar sind: In den 4. Stock oder höher eines massiven Stahlbetongebäudes steigen. Niemals nach der 1. Welle zurückkehren.'
			}
		]
	},
	'car-unexpectedly-becoming-a-boat': {
		en: [
			{
				title: 'SEATBELTS OFF & OPEN WINDOWS IMMEDIATELY',
				instruction: 'Execute within the first 60 seconds before vehicle submerges and electrical power fails:',
				substeps: [
					'Unbuckle driver and passenger seatbelts immediately.',
					'Roll down or break side windows before water pressure seals them.'
				]
			},
			{
				title: 'UNBUCKLE CHILDREN FROM OLDEST TO YOUNGEST',
				instruction:
					'Release older children first so they can assist younger siblings or exit directly through windows.'
			},
			{
				title: 'ESCAPE THROUGH WINDOWS ONTO CAR ROOF',
				instruction:
					'Climb out open windows onto the vehicle roof, never waste time pushing submerged doors against water pressure.'
			}
		],
		de: [
			{
				title: 'GURTE LÖSEN & FENSTER SOFORT ÖFFNEN',
				instruction: 'Innerhalb der ersten 60 Sekunden handeln, bevor das Fahrzeug versinkt:',
				substeps: [
					'Sicherheitsgurte aller Insassen unverzüglich lösen.',
					'Seitenfenster sofort herunterkurbeln oder mit Nothammer/Kopfstütze einschlagen.'
				]
			},
			{
				title: 'KINDER VON GROSS NACH KLEIN ABSCHNALLEN',
				instruction:
					'Ältere Kinder zuerst abschnallen, damit sie beim Bergen jüngerer Geschwister helfen oder herausklettern können.'
			},
			{
				title: 'DURCH DIE FENSTER AUFS AUTODACH FLÜCHTEN',
				instruction:
					'Durch die offenen Fenster nach draußen aufs Fahrzeugdach klettern; keine Zeit mit dem Aufdrücken von Türen gegen den Wasserdruck verschwenden.'
			}
		]
	},
	'ice-no-longer-supporting-you': {
		en: [
			{
				title: 'CONTROL BREATHING & COMBAT COLD SHOCK',
				instruction:
					'Keep head above water and suppress the initial 60-second hyperventilation panic reflex.'
			},
			{
				title: 'KICK LEGS TO HORIZONTAL & PULL ONTO ICE',
				instruction: 'Turn back toward the solid edge you came from and propel yourself forward:',
				substeps: [
					'Place forearms flat on the ice edge and kick legs vigorously to horizontal plane.',
					'Pull body forward onto ice like a seal, distributing weight broadly.'
				]
			},
			{
				title: 'ROLL AWAY ACROSS ICE WITHOUT STANDING',
				instruction:
					'Roll body across ice spread-eagled to distribute weight; never stand up on feet until reaching solid shore.'
			}
		],
		de: [
			{
				title: 'ATMUNG KONTROLLIEREN & KÄLTESCHOCK ÜBERWINDEN',
				instruction:
					'Kopf über Wasser halten und die 60-sekündige Schnappatmungs-Panikphase bewusst überwinden.'
			},
			{
				title: 'BEINE IN DIE WAAGERECHTE BRINGEN & AUFS EIS ZIEHEN',
				instruction: 'In Richtung der Einbruchsstelle zurückdrehen und flach herausziehen:',
				substeps: [
					'Unterarme flach auf die Eiskante stützen und mit den Beinen kräftig in die Horizontale paddeln.',
					'Mit Schwung wie eine Robbe flach auf die feste Eisfläche ziehen.'
				]
			},
			{
				title: 'FLACH WEGROLLEN & KEINESFALLS AUFSTEHEN',
				instruction:
					'Flach mit ausgebreiteten Armen und Beinen vom Einbruchloch wegrollen; erst am Ufer aufstehen.'
			}
		]
	},
	'person-has-inhaled-more-water-than-recommended': {
		en: [
			{
				title: 'RESCUE SAFELY FROM WATER',
				instruction:
					'Reach with a pole or throw a flotation device; keep victim’s airway clear during extraction.'
			},
			{
				title: 'ASSESS BREATHING (10 SEC MAX)',
				instruction:
					'Tilt head and lift chin. If breathing is absent or agonal, call 911/112 immediately.'
			},
			{
				title: 'START HYPOXIC CPR PROTOCOL WITH 5 RESCUE BREATHS',
				instruction: 'Drowning causes primary hypoxic cardiac arrest:',
				substeps: [
					'Deliver 5 initial rescue breaths to oxygenate lungs.',
					'Follow with cycles of 30 chest compressions and 2 rescue breaths (30:2).'
				]
			},
			{
				title: 'RECOVERY POSITION & REWARMING FOR BREATHING VICTIMS',
				instruction:
					'If breathing, place in recovery position, remove wet clothes, wrap warmly, and transport to hospital (danger of secondary pulmonary edema).'
			}
		],
		de: [
			{
				title: 'EIGENSCHUTZ BEI WASSERRETTUNG BEACHTEN',
				instruction:
					'Rettungsring oder Stange reichen; Person schnell und mit freiem Mund aus dem Wasser bergen.'
			},
			{
				title: 'ATMUNG ÜBERPRÜFEN (MAX 10 SEKUNDEN)',
				instruction:
					'Kopf überstrecken und Kinn anheben. Bei fehlender oder unregelmäßiger Atmung sofort Notruf 112 absetzen.'
			},
			{
				title: 'ERTRINKUNGS-CPR MIT 5 INITIALEN BEATMUNGEN STARTEN',
				instruction: 'Ertrinkungsunfälle führen zu hypoxischem Herzstillstand:',
				substeps: [
					'5 initiale Beatmungshübe geben, um Sauerstoff in die Lungen zu bringen.',
					'Anschließend im Standardrhythmus 30 Herzdruckmassagen : 2 Beatmungen fortfahren.'
				]
			},
			{
				title: 'STABILE SEITENLAGE & KLINIKTRANSPORT BEI ATMUNG',
				instruction:
					'Atmende Personen in stabile Seitenlage bringen, nasses Zeug ausziehen, wärmen und immer ins Krankenhaus einliefern (Gefahr des sekundären Lungenödems).'
			}
		]
	},
	'oil-currently-on-fire': {
		en: [
			{
				title: 'NEVER POUR WATER ON BURNING OIL',
				instruction:
					'Water boils instantly into steam, atomizing burning grease into a catastrophic fireball explosion.'
			},
			{
				title: 'SLIDE METAL LID OR FIRE BLANKET OVER PAN',
				instruction:
					'Slide a matching metal lid or fire blanket smoothly from the side over the burning pan to cut off oxygen supply.'
			},
			{
				title: 'TURN OFF STOVE & LEAVE PAN IN PLACE',
				instruction:
					'Switch off heat source immediately. Do NOT move or transport the hot pan until completely cooled.'
			}
		],
		de: [
			{
				title: 'NIEMALS WASSER IN BRENNENDES FETT GIESSEN',
				instruction:
					'Wasser verdampft schlagartig und erzeugt eine meterhohe, tödliche Fettexplosions-Feuersäule.'
			},
			{
				title: 'METALLDECKEL ODER LÖSCHDECKE SEITLICH AUFSCHIEBEN',
				instruction:
					'Passenden Topfdeckel von der Seite auf die brennende Pfanne schieben, um dem Feuer den Sauerstoff zu entziehen.'
			},
			{
				title: 'HERD AUSSCHALTEN & TOPF KEINESFALLS BEWEGEN',
				instruction:
					'Kochplatte ausschalten und den Topf an Ort und Stelle belassen, bis er vollkommen abgekühlt ist.'
			}
		]
	},
	'smoke-entering-places-smoke-should-not-be': {
		en: [
			{
				title: 'CRAWL LOW UNDER THE SMOKE LAYER',
				instruction:
					'Drop to hands and knees where breathable air and visibility are highest beneath toxic smoke strata.'
			},
			{
				title: 'FEEL DOORS WITH BACK OF HAND BEFORE OPENING',
				instruction:
					'If door or handle feels warm, keep door closed and find an alternate escape window/route.'
			},
			{
				title: 'EVACUATE BUILDING & CALL 911 / 112',
				instruction:
					'Close doors behind you to slow flame spread, never use elevators, and never re-enter a burning structure.'
			}
		],
		de: [
			{
				title: 'TIEF AM BODEN UNTER DEM RAUCH KRIECHEN',
				instruction:
					'Auf Händen und Knien kriechen, da Sauerstoff und Sichtbarkeit in Bodennähe am höchsten sind.'
			},
			{
				title: 'TÜREN MIT DEM HANDRÜCKEN AUF HITZE PRÜFEN',
				instruction:
					'Ist die Tür oder Klinke heiß, Tür geschlossen halten und alternativen Fluchtweg wählen.'
			},
			{
				title: 'GEBÄUDE VERLASSEN & NOTRUF 112 WÄHLEN',
				instruction:
					'Türen hinter sich schließen, niemals Aufzüge nutzen und ein brennendes Gebäude keinesfalls wieder betreten.'
			}
		]
	},
	'car-currently-on-fire': {
		en: [
			{
				title: 'PULL OVER, TURN OFF IGNITION & EVACUATE',
				instruction:
					'Steer to shoulder safely, cut ignition to stop fuel pumps, and exit all passengers immediately.'
			},
			{
				title: 'MOVE 30 METERS UPWIND BEHIND GUARDRAILS',
				instruction:
					'Stand uphill and upwind away from traffic, toxic fumes, and potential tire explosions.'
			},
			{
				title: 'CALL 911 / 112 & NEVER OPEN BURNING HOOD',
				instruction:
					'Report vehicle fire to dispatch; opening the engine hood introduces sudden oxygen resulting in a dangerous fireball backdraft.'
			}
		],
		de: [
			{
				title: 'ANHALTEN, ZÜNDUNG AUSSCHALTEN & AUSSTEIGEN',
				instruction:
					'Fahrzeug auf den Standstreifen lenken, Motor abstellen (stoppt Kraftstoffpumpe) und alle Insassen sofort evakuieren.'
			},
			{
				title: '30 METER WEIT GEGEN DEN WIND HINTER DIE LEITPLANKE',
				instruction:
					'Gegen die Windrichtung und bergauf in sichere Distanz zum fließenden Verkehr und giftigen Dämpfen treten.'
			},
			{
				title: 'NOTRUF 112 WÄHLEN & MOTORHAUBE NIEMALS ÖFFNEN',
				instruction:
					'Autobahnbrand melden; Motorhaube keinesfalls öffnen (plötzliche Sauerstoffzufuhr führt zu Stichflammen ins Gesicht).'
			}
		]
	},
	'power-line-inconveniently-on-the-ground': {
		en: [
			{
				title: 'STAY AT LEAST 10 METERS (33 FT) AWAY',
				instruction:
					'Treat every downed line as fully energized. Keep clear of lines, fences, and wet ground.'
			},
			{
				title: 'SHUFFLE FEET TOGETHER IF TRAPPED IN VOLTAGE ZONE',
				instruction:
					'Keep feet pressed tightly together and shuffle across ground without lifting soles to prevent lethal step potential.'
			},
			{
				title: 'CALL 911 / 112 & WARN OTHERS TO STAY CLEAR',
				instruction:
					'Alert emergency dispatch and utility grid operators to de-energize line before approaching.'
			}
		],
		de: [
			{
				title: 'MINDESTENS 10 METER ABSTAND HALTEN',
				instruction:
					'Jede am Boden liegende Stromleitung als spannungsführend betrachten. Zäune, Trümmer und nasse Böden meiden.'
			},
			{
				title: 'IM SPANNUNGSBEREICH NUR IM SCHLURF-SCHRITT BEWEGEN',
				instruction:
					'Füße eng aneinanderstellen und schlurfend über den Boden gleiten, ohne die Füße abzuheben (Schrittspannung verhindern).'
			},
			{
				title: 'NOTRUF 112 WÄHLEN & UMSTEHENDE WARNEN',
				instruction:
					'Gefahrenbereich absichern und Energieversorger zur Abschaltung des Netzes alarmieren.'
			}
		]
	},
	'electricity-currently-using-a-person-as-a-wire': {
		en: [
			{
				title: 'NEVER TOUCH VICTIM DIRECTLY WHILE IN CIRCUIT',
				instruction:
					'Current will pass through your body. Disconnect power at main circuit breaker or unplug cord immediately.'
			},
			{
				title: 'SEPARATE WITH DRY NON-CONDUCTIVE OBJECT (LOW VOLTAGE ONLY)',
				instruction:
					'For 120V/230V household current only: Use dry wooden broom handle or plastic rod to dislodge wire/victim. High voltage: Stay 10m away.'
			},
			{
				title: 'CALL 911 / 112 & PREPARE CPR / AED',
				instruction:
					'Electric shock frequently causes ventricular fibrillation. Check breathing once freed and start CPR immediately if unresponsive.'
			}
		],
		de: [
			{
				title: 'PERSON BEI STROMKONTAKT KEINESFALLS BERÜHREN',
				instruction:
					'Der Strom fließt auf den Ersthelfer über. Stromkreis sofort am Hauptschalter/Sicherungskasten unterbrechen.'
			},
			{
				title: 'NUR MIT NICHT-LEITENDEM GEGENSTAND TRENNEN (NIEDERSPANNUNG)',
				instruction:
					'Nur bei 230V-Haushaltsstrom: Mit trockenem Holzbesenstiel oder Kunststoffrohr trennen. Bei Hochspannung: 10 m Abstand halten.'
			},
			{
				title: 'NOTRUF 112 WÄHLEN & REANIMATION / AED VORBEREITEN',
				instruction:
					'Stromschläge lösen häufig Kammerflimmern aus. Nach Trennung Atmung prüfen und bei Atemstillstand sofort CPR starten.'
			}
		]
	},
	'vehicle-currently-touching-a-power-line': {
		en: [
			{
				title: 'STAY INSIDE THE VEHICLE (FARADAY CAGE)',
				instruction:
					'The vehicle body is an equipotential Faraday cage and safe as long as you stay completely inside.'
			},
			{
				title: 'HONK HORN & WARN BYSTANDERS TO STAY 10M AWAY',
				instruction:
					'Warn bystanders not to touch the vehicle or approach through energized ground.'
			},
			{
				title: 'JUMP-CLEAR LEAP ONLY IF VEHICLE CATCHES FIRE',
				instruction: 'If fire forces evacuation, jump without touching car and ground simultaneously:',
				substeps: [
					'Jump cleanly with both feet together so you land with feet touching.',
					'Never step out or touch metal body and ground at the same time.',
					'Shuffle with feet together for at least 10 meters away from the vehicle.'
				]
			}
		],
		de: [
			{
				title: 'IM FAHRZEUG SITZEN BLEIBEN (FARADAYSCHER KÄFIG)',
				instruction:
					'Die Metallkarosserie bildet einen sicheren Faradayschen Käfig, solange man vollständig im Inneren bleibt.'
			},
			{
				title: 'HUPEN & PASSANTEN AUF 10 METER DISTANZ HALTEN',
				instruction:
					'Umstehende lautstark warnen, das Auto nicht zu berühren oder in den Spannungsbereich zu treten.'
			},
			{
				title: 'NUR BEI FAHRZEUGBRAND MIT BEIDBEINIGEM SPRUNG FLIEHEN',
				instruction: 'Nur wenn das Auto brennt, mit einem sauberen Sprung evakuieren:',
				substeps: [
					'Mit beiden Füßen gleichzeitig abspringen und geschlossen landen.',
					'Keinesfalls Karosserie und Boden gleichzeitig berühren.',
					'Im engen Schlurfschritt mindestens 10 Meter vom Fahrzeug wegbewegen.'
				]
			}
		]
	},
	'gas-noticeably-existing-indoors': {
		en: [
			{
				title: 'NO SWITCHES, PHONES, OR OPEN FLAMES',
				instruction:
					'Do not operate light switches, doorbells, appliances, or mobile phones inside the gas-filled area (sparks trigger explosions).'
			},
			{
				title: 'OPEN WINDOWS & EVACUATE BUILDING ON FOOT',
				instruction:
					'Open accessible windows, leave doors open, and evacuate all occupants outside immediately.'
			},
			{
				title: 'CALL 911 / 112 & GAS UTILITY FROM OUTSIDE',
				instruction:
					'Make emergency calls from a safe distance outside; shut off outdoor main gas valve if accessible.'
			}
		],
		de: [
			{
				title: 'KEINE SCHALTER, TELEFONE ODER FLAMMEN BEDIENEN',
				instruction:
					'Keine Lichtschalter, Klingeln oder Elektrogeräte betätigen (jeder kleinste Funke löst eine Gasexplosion aus).'
			},
			{
				title: 'FENSTER ÖFFNEN & GEBÄUDE ZU FUSS EVAKUIEREN',
				instruction:
					'Fenster im Vorbeigehen öffnen, Türen offen lassen und alle Personen unverzüglich ins Freie bringen.'
			},
			{
				title: 'NOTRUF 112 & GASVERSORGER VON DRAUSSEN RUFEN',
				instruction:
					'Notrufe erst in sicherer Entfernung außerhalb des Gebäudes absetzen; Hauptgashahn draußen schließen.'
			}
		]
	},
	'carbon-monoxide-quietly-ruining-everyones-afternoon': {
		en: [
			{
				title: 'EVACUATE EVERYONE TO OUTDOOR FRESH AIR IMMEDIATELY',
				instruction:
					'Carbon monoxide is invisible and odorless. Move all occupants and pets into open air immediately.'
			},
			{
				title: 'CALL 911 / 112 FOR HAZMAT & MEDICAL CREWS',
				instruction:
					'Report suspected CO poisoning so emergency crews arrive with gas detection and normobaric oxygen equipment.'
			},
			{
				title: 'KEEP PATIENTS RESTING & ADMINISTER 100% OXYGEN',
				instruction:
					'Keep victims calm and still; paramedics will deliver 100% high-flow oxygen to displace CO from hemoglobin.'
			}
		],
		de: [
			{
				title: 'ALLE PERSONEN SOFORT AN DIE FRISCHE LUFT BRINGEN',
				instruction:
					'Kohlenmonoxid ist unsichtbar und geruchlos. Alle Bewohner und Haustiere sofort ins Freie bringen.'
			},
			{
				title: 'NOTRUF 112 FÜR FEUERWEHR & RETTUNGSDIENST WÄHLEN',
				instruction:
					'Verdacht auf CO-Vergiftung melden, damit Einsatzkräfte mit Messgeräten und Sauerstoff ausrücken.'
			},
			{
				title: 'PATIENTEN RUHIG LAGERN & SAUERSTOFF VERABREICHEN',
				instruction:
					'Patienten ruhig hinsetzen; Rettungsdienst verabreicht 100 % hochdosierten Sauerstoff zur CO-Verdrängung.'
			}
		]
	},
	'cleaning-products-have-formed-an-alliance': {
		en: [
			{
				title: 'EVACUATE ROOM IMMEDIATELY TO FRESH AIR',
				instruction:
					'Mixing bleach with acids or ammonia produces lethal chlorine or chloramine gas. Inhale zero fumes and leave door open.'
			},
			{
				title: 'NEVER POUR WATER ON ACTIVE CHEMICAL REACTION',
				instruction:
					'Adding water can cause exothermic boiling and dangerous chemical spattering.'
			},
			{
				title: 'CALL POISON CONTROL / 911 / 112',
				instruction:
					'Report products involved; seek emergency medical care if coughing, chest tightness, or eye burning persists.'
			}
		],
		de: [
			{
				title: 'RAUM SOFORT VERLASSEN & AN DIE FRISCHE LUFT GEHEN',
				instruction:
					'Mischen von Bleichmitteln mit Säuren/Ammoniak erzeugt tödliches Chlor- oder Chloramingas. Dämpfe nicht einatmen.'
			},
			{
				title: 'KEINESFALLS WASSER IN DIE CHEMISCHE REAKTION GIESSEN',
				instruction:
					'Wasserzugabe kann heftige Hitzeentwicklung und gefährliche Verätzungs-Spritzer auslösen.'
			},
			{
				title: 'GIFTNOTRUF / 112 WÄHLEN',
				instruction:
					'Gemischte Produkte nennen; bei Hustenreiz, Atemnot oder brennenden Augen unverzüglich ärztlich untersuchen lassen.'
			}
		]
	},
	'elevator-has-stopped-being-an-elevator': {
		en: [
			{
				title: 'PRESS EMERGENCY ALARM / CALL INTERCOM',
				instruction:
					'Use the yellow alarm bell button or phone icon to connect directly with 24/7 elevator dispatch.'
			},
			{
				title: 'STAY INSIDE CABIN & NEVER PRY DOORS OPEN',
				instruction:
					'Cabin is ventilated and held by multiple safety cables/wedges. Prying doors and climbing between floors is the #1 cause of fatal elevator accidents.'
			},
			{
				title: 'SIT ON FLOOR AND WAIT FOR PROFESSIONAL TECHNICIANS',
				instruction:
					'Remain calm, conserve battery, and await trained technical rescue personnel.'
			}
		],
		de: [
			{
				title: 'NOTRUFKNOPF DRÜCKEN & SPRECHVERBINDUNG NUTZEN',
				instruction:
					'Den gelben Glocken- oder Telefonschalter mindestens 3–5 Sekunden drücken, um die Notrufzentrale zu erreichen.'
			},
			{
				title: 'IN DER KABINE BLEIBEN & TÜREN NIEMALS AUFSTEMMEN',
				instruction:
					'Die Kabine ist belüftet und sturzsicher gebremst. Eigenmächtiges Aufhebeln der Türen ist die häufigste tödliche Unfallursache.'
			},
			{
				title: 'AUF DEN BODEN SETZEN & AUF DIE FEUERWEHR WARTEN',
				instruction:
					'Ruhe bewahren, Handyakku schonen und auf geschulte Aufzugstechniker/Feuerwehr warten.'
			}
		]
	},
	'escalator-currently-eating-something': {
		en: [
			{
				title: 'HIT EMERGENCY STOP BUTTON IMMEDIATELY',
				instruction:
					'Press prominent red STOP button located at top or bottom landing posts.'
			},
			{
				title: 'PREVENT MOTOR RESTART & CLEAR ESCALATOR',
				instruction:
					'Ensure no bystander restarts the unit; guide people to walk off escalator.'
			},
			{
				title: 'FREE ENTRAPPED OBJECT & CALL 911 / 112 IF INJURED',
				instruction:
					'Cut trapped clothing/shoelaces; call emergency services if limb or skin is trapped in comb plate.'
			}
		],
		de: [
			{
				title: 'SOFORT DEN NOT-HALT-SCHALTER DRÜCKEN',
				instruction:
					'Den großen roten NOT-AUS-Schalter am oberen oder unteren Handlauf-Sockel kräftig drücken.'
			},
			{
				title: 'WIEDEREINSCHALTEN VERHINDERN & TREPPE RÄUMEN',
				instruction:
					'Zugang absichern, damit niemand die Treppe versehentlich wieder anlaufen lässt.'
			},
			{
				title: 'EINGEKLEMMTEN GEGENSTAND BEFREIEN & 112 WÄHLEN',
				instruction:
					'Kleidung/Schnürsenkel zügig aufschneiden; bei Quetschungen von Gliedmaßen sofort Rettungsdienst alarmieren.'
			}
		]
	},
	'floodwater-looking-surprisingly-drivable': {
		en: [
			{
				title: 'TURN AROUND, DON’T DROWN',
				instruction:
					'Never drive into standing or moving water. Just 30 cm (12 in) floats passenger cars, 60 cm (24 in) sweeps heavy SUVs.'
			},
			{
				title: 'IF ENGINE STALLS IN RISING WATER: EVACUATE IMMEDIATELY',
				instruction:
					'Unbuckle seatbelts, open/break window, climb onto vehicle roof, and call 911/112.'
			},
			{
				title: 'MOVE TO HIGHER GROUND ON FOOT',
				instruction:
					'Wade carefully away from hidden open manholes, submerged storm drains, and downed electrical lines.'
			}
		],
		de: [
			{
				title: 'UMDREHEN – KEINESFALLS DURCH FLUTWASSER FAHREN',
				instruction:
					'Niemals in stehendes oder fließendes Hochwasser steuern. Bereits 30 cm Wasser heben PKWs an, 60 cm reißen SUVs mit.'
			},
			{
				title: 'WENN DER MOTOR IM WASSER STIRBT: SOFORT EVAKUIEREN',
				instruction:
					'Abschnallen, Fenster sofort öffnen/einschlagen, aufs Autodach klettern und Notruf 112 wählen.'
			},
			{
				title: 'ZU FUSS AUF HÖHERES GELÄNDE FLÜCHTEN',
				instruction:
					'Abstand von weggespülten Kanaldeckeln, reißenden Gräben und untergetauchten Stromleitungen halten.'
			}
		]
	},
	'something-is-stuck-in-a-person': {
		en: [
			{
				title: 'NEVER REMOVE THE IMPALED OBJECT',
				instruction:
					'The object acts as an internal biological plug tamponading lacerated major blood vessels. Removal causes fatal hemorrhage.'
			},
			{
				title: 'STABILIZE OBJECT IN PLACE WITH BULKY PADDING',
				instruction:
					'Place donut-ring bandages, rolled towels, or sterile dressing rolls on both sides of the object to prevent any movement.'
			},
			{
				title: 'CALL 911 / 112 & CONTROL EXTERNAL BLEEDING',
				instruction:
					'Apply direct pressure around the object base without pushing or leveraging the object inward.'
			}
		],
		de: [
			{
				title: 'DEN EINGESPIESSTEN GEGENSTAND NIEMALS HERAUSZIEHEN',
				instruction:
					'Der Gegenstand wirkt als Gefäßstopfen und dichtet verletzte Arterien ab. Herausziehen führt zu massiver tödlicher Verblutung.'
			},
			{
				title: 'GEGENSTAND MIT POLSTERMATERIAL BEIDSEITIG FIXIEREN',
				instruction:
					'Verbandstoffrollen, Handtücher oder Krawatten ringförmig um den Gegenstand legen und fest anwickeln, um jede Hebelwirkung zu verhindern.'
			},
			{
				title: 'NOTRUF 112 WÄHLEN & UM DIE WUNDE HERUM ABDRÜCKEN',
				instruction:
					'Druck um die Einstichstelle herum ausüben, ohne den Fremdkörper tiefer hineinzudrücken.'
			}
		]
	},
	'animal-has-made-an-unplanned-hole-in-you': {
		en: [
			{
				title: 'WASH VIGOROUSLY WITH SOAP & WATER FOR 15 MINUTES',
				instruction:
					'Copious mechanical washing with soap and running water immediately destroys the lipid envelope of rabies virus and flushes bacteria.'
			},
			{
				title: 'DISINFECT WITH POVIDONE-IODINE OR ALCOHOL',
				instruction:
					'Apply povidone-iodine antiseptic or 70% alcohol solution and dress loosely with sterile gauze.'
			},
			{
				title: 'SEEK URGENT MEDICAL EVALUATION (RABIES PEP & ANTIBIOTICS)',
				instruction:
					'Rabies Post-Exposure Prophylaxis is 100% effective when initiated promptly before symptoms occur. Check tetanus status.'
			}
		],
		de: [
			{
				title: 'WUNDE 15 MINUTEN LANG MIT SEIFE & WASSER AUSWASCHEN',
				instruction:
					'Gründliches mechanisches Spülen mit Seifenwasser zerstört die Fetthülle von Tollwutviren und schwemmt Erreger aus.'
			},
			{
				title: 'MIT POVIDON-IOD ODER ALKOHOL DESINFIZIEREN',
				instruction:
					'Wunddesinfektionsmittel auftragen und mit sterilem Verband locker abdecken.'
			},
			{
				title: 'SOFORT ARZT AUFSUCHEN (TOLLWUT-PEP & ANTIBIOTIKA)',
				instruction:
					'Tollwut-Postexpositionsprophylaxe muss vor Symptombeginn erfolgen. Tetanusschutz prüfen und Katzenbisse wegen Pasteurellen antibiotisch behandeln lassen.'
			}
		]
	},
	'snake-has-expressed-an-opinion': {
		en: [
			{
				title: 'MOVE OUT OF STRIKE RANGE & REMAIN COMPLETELY STILL',
				instruction:
					'Keep calm and motionless; physical activity accelerates lymphatic venom spread throughout the bloodstream by over 70%.'
			},
			{
				title: 'IMMOBILIZE BITTEN LIMB AT HEART LEVEL & REMOVE JEWELRY',
				instruction:
					'Splint the limb and remove rings, watches, and tight shoes immediately before massive swelling begins.'
			},
			{
				title: 'CALL 911 / 112 FOR ANTIVENOM EVALUATION',
				instruction:
					'Transport calmly to hospital emergency department. NEVER cut, suck, apply ice, or use arterial tourniquets on snakebites.'
			}
		],
		de: [
			{
				title: 'AUS DER REICHWEITE TRETEN & RUHE BEWAHREN',
				instruction:
					'Ruhig bleiben und jede Muskelbewegung minimieren; Anstrengung beschleunigt den Gifttransport im Lymphsystem um über 70 %.'
			},
			{
				title: 'GLIEDMASSE AUF HERZHÖHE RUHIGSTELLEN & SCHMUCK ENTFERNEN',
				instruction:
					'Arm/Bein schienen und Ringe, Uhren und enge Schuhe sofort ausziehen, bevor starke Schwellungen einsetzen.'
			},
			{
				title: 'NOTRUF 112 WÄHLEN & GEGENGIFT-KLINIK ANSTEUERN',
				instruction:
					'Liegend ins Krankenhaus transportieren lassen. Niemals ausschneiden, aussaugen, kühlen oder abbinden!'
			}
		]
	},
	'someone-ate-something-they-really-should-not-have': {
		en: [
			{
				title: 'SPIT OUT RESIDUE & RINSE MOUTH',
				instruction:
					'Spit out any remaining substance in mouth, rinse with a small sip of water, and keep original packaging/container.'
			},
			{
				title: 'CALL POISON CONTROL / 911 / 112 IMMEDIATELY',
				instruction:
					'State exact substance name, estimated swallowed quantity, patient weight, and elapsed time.'
			},
			{
				title: 'NEVER INDUCE VOMITING',
				instruction:
					'Vomiting re-burns the esophagus with caustic acids/alkalis or creates lethal foaming chemical aspiration into lungs.'
			}
		],
		de: [
			{
				title: 'RESTE AUSSPUCKEN & MUND AUSSPÜLEN',
				instruction:
					'Reste sofort ausspucken, Mund mit etwas Wasser ausspülen und Originalverpackung/Flasche sichern.'
			},
			{
				title: 'GIFTNOTRUF / NOTRUF 112 UNVERZÜGLICH WÄHLEN',
				instruction:
					'Genaue Produktbezeichnung, geschätzte Menge, Körpergewicht und Einnahmezeitpunkt durchgeben.'
			},
			{
				title: 'NIEMALS ERBRECHEN HERBEIFÜHREN',
				instruction:
					'Erbrechen verätzt die Speiseröhre ein zweites Mal oder führt bei Schaumbildnern/Lösungsmitteln zum Ersticken durch Lungenaspiration.'
			}
		]
	},
	'tick-currently-attached-and-dining': {
		en: [
			{
				title: 'GRASP TICK CLOSE TO SKIN WITH FINE-TIPPED TWEEZERS',
				instruction:
					'Grip tick head and mouthparts as close to the skin surface as possible without squeezing the swollen abdomen.'
			},
			{
				title: 'PULL STRAIGHT UPWARD WITH STEADY EVEN FORCE',
				instruction:
					'Pull slowly and straight out without twisting, jerking, or applying butter, oil, glue, or nail polish.'
			},
			{
				title: 'DISINFECT BITE SITE & NOTE DATE ON CALENDAR',
				instruction:
					'Clean with alcohol or povidone-iodine; monitor for expanding circular red rash (Erythema migrans) over next 30 days.'
			}
		],
		de: [
			{
				title: 'ZEECKE MIT PINZETTE HAUTNAH GREIFEN',
				instruction:
					'Zecke mit einer feinen Pinzette oder Zeckenzange direkt an der Hautoberfläche an den Mundwerkzeugen fassen (nicht am vollen Hinterleib quetschen).'
			},
			{
				title: 'GERADE UND GLEICHMÄSSIG HERAUSZIEHEN',
				instruction:
					'Langsam und gerade nach oben ziehen, ohne Drehen, Rucken oder den Einsatz von Öl, Klebstoff oder Nagellack.'
			},
			{
				title: 'BISSSTELLE DESINFIZIEREN & DATUM NOTIEREN',
				instruction:
					'Mit Wunddesinfektion säubern; in den nächsten 30 Tagen auf eine wandernde kreisrunde Rötung (Wanderröte / Borreliose) achten.'
			}
		]
	},
	'tooth-violently-evicted-from-mouth': {
		en: [
			{
				title: 'HANDLE TOOTH BY CROWN ONLY (NEVER TOUCH ROOT)',
				instruction:
					'Touch only the enamel chewing surface. The root is lined with living periodontal ligament cells essential for replantation.'
			},
			{
				title: 'GENTLE COLD MILK / SALINE RINSE IF SOILED',
				instruction:
					'Rinse max 10 seconds in cold milk or sterile saline; never scrub, soap, dry, or wrap in tissue paper.'
			},
			{
				title: 'RE-IMPLANT IMMEDIATELY OR STORE IN DENTOSAFE / COLD MILK',
				instruction:
					'Push back into empty tooth socket and bite gently on gauze, or store in cell-culture Dentosafe rescue box or cold whole milk.'
			},
			{
				title: 'RUSH TO DENTIST WITHIN 30 TO 60 MINUTES',
				instruction:
					'Periodontal root cells die rapidly; replantation success drops sharply after 60 minutes of dry time.'
			}
		],
		de: [
			{
				title: 'ZAHN NUR AN DER KRONE ANFASSEN (WURZEL TABU)',
				instruction:
					'Ausschließlich an der weißen Zahnkrone greifen; die Zahnwurzel mit ihren lebenden Wurzelhautzellen niemals berühren.'
			},
			{
				title: 'NUR BEI VERSCHMUTZUNG KURZ IN KALTE MILCH TAUCHEN',
				instruction:
					'Maximal 10 Sekunden in kalte Milch oder Kochsalzlösung tauchen; niemals abreiben, mit Seife waschen oder in Papiertücher wickeln.'
			},
			{
				title: 'SOFORT ZURÜCKSTECKEN ODER IN ZAHNRETTUNGSBOX LAGERN',
				instruction:
					'Vorsichtig ins Zahnfach zurückstecken und auf Mull beißen, oder in einer Zahnrettungsbox (Dentosafe) / kalter H-Milch lagern.'
			},
			{
				title: 'INNERHALB VON 30–60 MINUTEN ZUM ZAHNARZT',
				instruction:
					'Wurzelhautzellen sterben schnell ab; nach 60 Minuten sinkt die Chance auf erfolgreiches Einheilen drastisch.'
			}
		]
	},
	'skin-recently-perforated-by-hypodermic-needle': {
		en: [
			{
				title: 'ENCOURAGE SPONTANEOUS BLEEDING UNDER WATER',
				instruction:
					'Rinse puncture site with running water and gentle soap, allowing blood to flow freely without aggressive tissue squeezing.'
			},
			{
				title: 'DISINFECT FOR AT LEAST 5 MINUTES',
				instruction:
					'Apply alcohol-based antiseptic or povidone-iodine solution and maintain contact for 5 continuous minutes.'
			},
			{
				title: 'SEEK URGENT MEDICAL EVALUATION WITHIN 2 HOURS',
				instruction:
					'Go to hospital emergency department immediately: HIV Post-Exposure Prophylaxis (PEP) is most effective within 2 hours; evaluate Hepatitis B/C and Tetanus.'
			}
		],
		de: [
			{
				title: 'BLUTUNG UNTER FLIESSENDEM WASSER ANREGEN',
				instruction:
					'Einstichstelle mit Wasser und Seife waschen, Blut ohne starkes Quetschen für 1–2 Minuten frei fließen lassen.'
			},
			{
				title: 'MINDESTENS 5 MINUTEN INTENSIV DESINFIZIEREN',
				instruction:
					'Hautdesinfektionsmittel auf Alkohol- oder PVP-Iod-Basis auftragen und mindestens 5 Minuten feucht einwirken lassen.'
			},
			{
				title: 'INNERHALB VON 2 STUNDEN NOTFALLPRAXIS / KLINIK AUFSUCHEN',
				instruction:
					'Sofort Notaufnahme aufsuchen: Eine HIV-Postexpositionsprophylaxe (PEP) ist am wirksamsten bei Start innerhalb von 2 Stunden; Hepatitis B/C- und Tetanusschutz prüfen.'
			}
		]
	},
	'skin-recently-introduced-to-too-much-heat': {
		en: [
			{
				title: 'STOP THE BURNING PROCESS IMMEDIATELY',
				instruction:
					'Extinguish flames, disconnect from heat/electricity, and remove non-adherent hot clothing and metallic jewelry.'
			},
			{
				title: 'COOL WITH RUNNING TAP WATER FOR 10 TO 20 MINUTES',
				instruction:
					'Use clean running tap water at 15°C to 20°C (59°F to 68°F). Never use ice, ice water, butter, oils, or toothpaste.'
			},
			{
				title: 'COVER WITH STERILE DRESSING OR CLING WRAP',
				instruction:
					'Apply loose sterile dressing or clean plastic cling wrap without compression; keep patient warm to prevent hypothermia.'
			},
			{
				title: 'CALL 911 / 112 FOR CRITICAL / LARGE BURNS',
				instruction:
					'Seek immediate hospital emergency care if burn involves face, hands, joints, genitals, covers > 10% body area, or in children.'
			}
		],
		de: [
			{
				title: 'VERBRENNUNGSVORGANG SOFORT STOPPEN',
				instruction:
					'Flammen löschen, Hitzequelle trennen und nicht haftende heiße Kleidung sowie Metallschmuck vorsichtig ausziehen.'
			},
			{
				title: 'MIT FLIESSENDEM LEITUNGSWASSER 10–20 MIN KÜHLEN',
				instruction:
					'Leitungswasser mit ca. 15 bis 20°C verwenden. Niemals Eis, Eiswasser, Butter, Mehl oder Zahnpasta auf Brandwunden schmieren!'
			},
			{
				title: 'LOCKER STERIL ABDECKEN & WÄRMEN',
				instruction:
					'Brandwunde locker mit steriler Wundauflage oder sauberer Frischhaltefolie abdecken; Patient mit Decke vor Unterkühlung schützen.'
			},
			{
				title: 'NOTRUF 112 BEI SCHWEREN / GROSSEN VERBRENNUNGEN',
				instruction:
					'Notarzt rufen bei Verbrennungen an Gesicht, Händen, Gelenken, Genitalien, Verbrennungen über 10 % Körperoberfläche oder bei Kindern.'
			}
		]
	},
	'eye-recently-contacted-by-angry-chemical': {
		en: [
			{
				title: 'FLUSH EYE IMMEDIATELY WITH RUNNING WATER (15–20 MIN)',
				instruction:
					'Every second counts. Hold eyelids open and flush eye under gently running tap water or saline for 15 to 20 continuous minutes from inner corner outwards.'
			},
			{
				title: 'CALL 911 / 112 DURING IRRIGATION',
				instruction:
					'Alert emergency dispatch while continuing eye flush without stopping. Identify chemical (alkali burns are especially dangerous).'
			},
			{
				title: 'COVER EYE LOOSELY & TRANSPORT TO EYE CLINIC',
				instruction:
					'Cover both eyes loosely with sterile pads to minimize sympathetic eye movements and rush to specialized ophthalmology care.'
			}
		],
		de: [
			{
				title: 'AUGE SOFORT 15–20 MINUTEN MIT WASSER SPÜLEN',
				instruction:
					'Jede Sekunde zählt. Augenlider spreizen und das verätzte Auge unter sanftem Leitungs- oder Spülwasser 15 bis 20 Minuten lang von innen nach außen spülen.'
			},
			{
				title: 'WÄHREND DES SPÜLENS NOTRUF 112 WÄHLEN',
				instruction:
					'Spülung keinesfalls unterbrechen; Umstehende Notruf wählen lassen. Chemikalie (Säure oder Lauge) nennen.'
			},
			{
				title: 'BEIDE AUGEN LOCKER ABDECKEN & AUGENKLINIK ANSTEUERN',
				instruction:
					'Beide Augen locker steril abdecken (verhindert synchrone Augenbewegungen) und sofort in einer Augenklinik vorstellen.'
			}
		]
	}
};

export function updateAll50Articles() {
	const enDir = path.join(CONTENT_DIR, 'en');
	const deDir = path.join(CONTENT_DIR, 'de');

	let count = 0;
	for (const [slug, data] of Object.entries(actionCatalog)) {
		const enPath = path.join(enDir, `${slug}.md`);
		const dePath = path.join(deDir, `${slug}.md`);

		if (fs.existsSync(enPath) && fs.existsSync(dePath)) {
			const enParsed = matter(fs.readFileSync(enPath, 'utf-8'));
			const deParsed = matter(fs.readFileSync(dePath, 'utf-8'));

			enParsed.data.immediate_action = data.en;
			deParsed.data.immediate_action = data.de;

			fs.writeFileSync(enPath, matter.stringify(enParsed.content.trim() + '\n', enParsed.data));
			fs.writeFileSync(dePath, matter.stringify(deParsed.content.trim() + '\n', deParsed.data));
			count++;
		} else {
			console.error(`Missing markdown files for slug: ${slug}`);
		}
	}
	console.log(`✅ Successfully updated all ${count} articles in EN and DE with complete semantic action hierarchy!`);
}

if (process.argv[1].endsWith('update-all-50-articles.ts')) {
	updateAll50Articles();
}
