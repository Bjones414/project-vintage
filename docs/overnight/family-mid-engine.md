# Mid-Engine Family — Boxster / Cayman / 718

*Doc type: per-family | Generated: 2026-05-18 | Source: models.ts + overnight reference corpus*
*DO NOT modify catalog, code, or DB from this file. Research and gap documentation only.*

All mid-engine Porsche variants from 986 (1997) through 982/718 (2017–present). Five platform generations, two body styles (Roadster / Coupé). All models are rear-wheel drive.

---

## Generation Architecture

| Platform | genIds (catalog) | MY Range | Engine Family | Displacement | IMS Risk |
|---|---|---|---|---|---|
| 986 | `986` | 1997–2004 | M96 | 2.5L / 2.7L / 3.2L | **YES** |
| 987.1 | `987.1-boxster`, `987.1-cayman` | 2005–2008 | M97 | 2.7L / 3.4L | **YES** |
| 987.2 | `987.2-boxster`, `987.2-cayman` | 2009–2012 | 9A1 DFI | 2.9L / 3.4L | NO |
| 981 | `981-boxster`, `981-cayman` | 2012–2016 | 9A1 / 9A2 NA | 2.7L / 3.4L / 3.8L | NO |
| 982/718 | `982-boxster`, `982-cayman` | 2017–pres. | 9A2 flat-4T + flat-6 NA | 2.0L / 2.5L / 4.0L | NO |

**IMS scope:** M96/M97 engines only — 986 (all) and 987.1 (all). The 987.2 and later use the 9A1 engine with no intermediate shaft; IMS risk is zero. Bore scoring (coolant ingestion) is a separate risk on 3.4L M97 engines (987.1 Boxster S MY2007+, all 987.1 Cayman S); the 2.5L, 2.7L, and 3.2L M96 engines are largely immune. AOS (air-oil separator) failure applies to all M96/M97 cars.

---

## Section A — Catalog Extract

*All models are RWD — Drive column omitted. [V] = VERIFY. (nc) = not in catalog (field absent from models.ts). "(not in catalog)" in Status = trim exists in production but is absent from models.ts.*

---

### 986 Boxster
`genId: 986 | model: 'Boxster' | yearStart: 1997 | yearEnd: 2004 | trims: ['Base', 'S']`

| Trim | Status | MY | Body | Engine | HP | Trans | Prod | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base | In catalog | 1997–2004 | Roadster | M96 2.5→2.7L | 201→228 | 5MT / 5AT | (nc) | (nc) | ~$40k [V] | IMS; AOS; top mechanism | 2.7L (MY2000+) preferred; avoid early 2.5L |
| S | In catalog | 2000–2004 | Roadster | M96 3.2L | 252→260 | 5MT / 5AT | (nc) | (nc) | ~$50k [V] | IMS; AOS; top mechanism | 3.2L bore score risk lower than 3.4L M97 |
| 550 Spyder Anniversary | **(not in catalog)** | 2004 | Roadster | M96 3.2L | 260 | 5MT | 1,953 [V] | 500 US [V] | ~$55k [V] | IMS | Numbered plaque; ET-silver/red; strong collector premium |
| S 50th Anniversary | **(not in catalog)** | 2004 | Roadster | M96 3.2L | 260 | 5MT / 5AT | [VERIFY] | [VERIFY] | ~$52k [V] | IMS | Guards Red or Aqua Blue exclusive spec |

---

### 987.1 Boxster
`genId: 987.1-boxster | model: 'Boxster' | yearStart: 2005 | yearEnd: 2008 | trims: ['Base', 'S']`

| Trim | Status | MY | Body | Engine | HP | Trans | Prod | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base | In catalog | 2005–2008 | Roadster | M97 2.7L | 240→245 | 5MT / Tip | (nc) | (nc) | ~$46k [V] | IMS; AOS; top mechanism | Last M97 Boxster generation |
| S | In catalog | 2005–2008 | Roadster | M97 3.4L | 280→295 | 5MT / Tip | (nc) | (nc) | ~$55k [V] | IMS; bore score (3.4L elevated MY2007+); AOS | Bore score risk elevated vs. base |
| RS 60 Spyder | **(not in catalog)** | 2008 | Roadster | M97 3.4L | 303 [V] | 6MT [V] | ~1,960 [V] | ~500 US [V] | ~$63k [V] | IMS; bore score | 60th anniv Spyder; silver/red; auction fixture; needs own trim |

*Note: Boxster S Porsche Design Edition 2 is listed in the task scope as a 987.1 variant but internal reference docs confirm MY2009 (9A1 engine) — reclassified to 987.2. See Section C.4.*

---

### 987.1 Cayman
`genId: 987.1-cayman | model: 'Cayman' | yearStart: 2006 | yearEnd: 2008 | trims: ['Base', 'S']`

| Trim | Status | MY | Body | Engine | HP | Trans | Prod | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base | In catalog | 2006–2008 | Coupé | M97 2.7L | 245 [V] | 5MT / Tip | (nc) | (nc) | ~$45k [V] | IMS; AOS | Coupe debut for mid-engine platform |
| S | In catalog | 2006–2008 | Coupé | M97 3.4L | 295 | 5MT / Tip | (nc) | (nc) | ~$58k [V] | IMS; bore score (3.4L); AOS | Mid-cycle update MY2008 |
| S Sport | **(not in catalog)** | 2008 | Coupé | M97 3.4L | 303 [V] | 6MT [V] | [VERIFY] | [VERIFY] | ~$62k [V] | IMS; bore score | Sport exhaust, PASM std [V]; distinct comp pool from S |

---

### 987.2 Boxster
`genId: 987.2-boxster | model: 'Boxster' | yearStart: 2009 | yearEnd: 2011 | trims: ['Base', 'S', 'Spyder']`
⚠ yearEnd 2011 is incorrect — Spyder and Black Edition ran through MY2012 (see Section C.1)

| Trim | Status | MY | Body | Engine | HP | Trans | Prod | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base | In catalog | 2009–2012 | Roadster | 9A1 DFI 2.9L | 255 | 6MT / PDK | (nc) | (nc) | ~$47k [V] | Top mechanism (updated MY2009) | 9A1: no IMS, DFI |
| S | In catalog | 2009–2012 | Roadster | 9A1 DFI 3.4L | 310 | 6MT / PDK | (nc) | (nc) | ~$57k [V] | — | Gen best-value variant |
| Spyder | In catalog | 2010–2012 | Roadster | 9A1 DFI 3.4L | 320 | 6MT | ~2,444 [V] | (nc) | ~$61k [V] | — | Manual only; fabric tonneau; ~2,444 total [V] |
| S Black Edition | **(not in catalog)** | 2011–2012 | Roadster | 9A1 DFI 3.4L | 310 | 6MT / PDK | [VERIFY] | [VERIFY] | ~$62k [V] | — | Black cosmetic pkg; limited |
| S PDE2 | **(not in catalog)** | 2009 | Roadster | 9A1 DFI 3.4L | 310 [V] | 6MT / PDK [V] | [VERIFY] | [VERIFY] | ~$60k [V] | — | Porsche Design Edition 2 — 9A1 confirms 987.2 classification (see C.4) |

---

### 987.2 Cayman
`genId: 987.2-cayman | model: 'Cayman' | yearStart: 2009 | yearEnd: 2012 | trims: ['Base', 'S', 'R']`

| Trim | Status | MY | Body | Engine | HP | Trans | Prod | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base | In catalog | 2009–2012 | Coupé | 9A1 DFI 2.9L | 265 | 6MT / PDK | (nc) | (nc) | ~$48k [V] | — | 10hp over Boxster base (coupe aero) |
| S | In catalog | 2009–2012 | Coupé | 9A1 DFI 3.4L | 320 | 6MT / PDK | (nc) | (nc) | ~$58k [V] | — | Handling benchmark of generation |
| R | In catalog | 2011–2012 | Coupé | 9A1 DFI 3.4L | 330 | 6MT / PDK | 1,421–1,621 [V] | 624 NA [V] | ~$68k [V] | — | Stripped weight; roll bar delete option; strong collector demand |
| S Black Edition | **(not in catalog)** | 2011–2012 | Coupé | 9A1 DFI 3.4L | 320 | 6MT / PDK | [VERIFY] | [VERIFY] | ~$62k [V] | — | Black cosmetic pkg; limited |

---

### 981 Boxster
`genId: 981-boxster | model: 'Boxster' | yearStart: 2012 | yearEnd: 2016 | trims: ['Base', 'S', 'GTS', 'Spyder']`

| Trim | Status | MY | Body | Engine | HP | Trans | Prod | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base | In catalog | 2012–2016 | Roadster | 9A1 2.7L | 265 | 6MT / PDK | (nc) | (nc) | ~$50k [V] | — | Entry point 981 gen |
| S | In catalog | 2012–2016 | Roadster | 9A1 3.4L | 315 | 6MT / PDK | (nc) | (nc) | ~$60k [V] | — | — |
| GTS | In catalog | 2014–2016 | Roadster | 9A1 3.4L | 330 | 6MT / PDK | (nc) | (nc) | ~$74k [V] | — | PDCC, PASM Sport std; popular spec |
| Spyder | In catalog | 2015–2016 | Roadster | 9A1 3.8L | 375 | 6MT | ~2,486 [V] | ~850 US [V] | ~$84k [V] | — | Manual only; 3.8L shared with GT4; last analog Boxster |
| Black Edition | **(not in catalog)** | 2016 | Roadster | 9A1 3.4L [V] | 315 [V] | 6MT / PDK | [VERIFY] | [VERIFY] | ~$63k [V] | — | 981 final-year limited edition |

---

### 981 Cayman
`genId: 981-cayman | model: 'Cayman' | yearStart: 2013 | yearEnd: 2016 | trims: ['Base', 'S', 'GTS', 'GT4']`
*981 Cayman GT4 RS does NOT exist — confirmed. GT4 RS is 982/718 only. Trim correctly absent from current catalog.*

| Trim | Status | MY | Body | Engine | HP | Trans | Prod | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base | In catalog | 2013–2016 | Coupé | 9A1 2.7L | 275 | 6MT / PDK | (nc) | (nc) | ~$53k [V] | — | 10hp over Boxster base (coupe) |
| S | In catalog | 2013–2016 | Coupé | 9A1 3.4L | 325 | 6MT / PDK | (nc) | (nc) | ~$63k [V] | — | — |
| GTS | In catalog | 2015–2016 | Coupé | 9A1 3.4L | 340 | 6MT / PDK | (nc) | (nc) | ~$77k [V] | — | Highest NA output from 3.4L; handling benchmark |
| GT4 | In catalog | 2015–2016 | Coupé | 9A1 3.8L | 385 | 6MT | ~2,500 [V] | ~1,250 US [V] | ~$86k [V] | — | Manual only; 991 GT3 engine; grail car; strong appreciation |
| Black Edition | **(not in catalog)** | 2016 | Coupé | 9A1 2.7L [V] | 275 [V] | 6MT / PDK | [VERIFY] | [VERIFY] | ~$55k [V] | — | 981 final-year limited edition |

---

### 982/718 Boxster
`genId: 982-boxster | model: '718 Boxster' | yearStart: 2017 | yearEnd: PRESENT | trims: ['Base', 'S', 'GTS 4.0', 'Spyder']`

| Trim | Status | MY | Body | Engine | HP | Trans | Prod | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base | In catalog | 2017–pres. | Roadster | 9A2 flat-4T 2.0L | 300 | 6MT / PDK | (nc) | (nc) | ~$57k [V] | Flat-4 sound controversy | Controversial flat-4 vs. prior flat-6 |
| S | In catalog | 2017–pres. | Roadster | 9A2 flat-4T 2.5L | 350 | 6MT / PDK | (nc) | (nc) | ~$67k [V] | — | VTG turbo on 2.5L |
| GTS 4.0 | In catalog | 2020–pres. | Roadster | 9A2 flat-6 NA 4.0L | 394 | 6MT / PDK | (nc) | (nc) | ~$87k [V] | — | Flat-six return; near-GT4 experience |
| Spyder | In catalog | 2020–pres. | Roadster | 9A2 flat-6 NA 4.0L | 414 | 6MT | (nc) | (nc) | ~$97k [V] | — | Manual only; fabric tonneau; top 718 roadster (prior to RS) |
| GTS (2.5T) | **(not in catalog)** | 2018–2019 | Roadster | 9A2 flat-4T 2.5L | 365 | 6MT / PDK | [VERIFY] | [VERIFY] | ~$82k [V] | — | Distinct engine/era from GTS 4.0; **different comp pool** |
| Spyder RS | **(not in catalog)** | 2024–pres. | Roadster | 9A2 flat-6 NA 4.0L+ | 500 [V] | PDK | [VERIFY] | [VERIFY] | ~$139k [V] | — | PDK only; 500hp [V]; entirely separate price tier from Spyder |
| 25 Jahre Boxster | **(not in catalog)** | 2021 | Roadster | 9A2 flat-6 NA 4.0L [V] | 414 [V] | PDK [V] | ~1,250 [V] | [VERIFY] | ~$99k [V] | — | 25th anniversary; ET-Boxster heritage colors; collector edition |

---

### 982/718 Cayman
`genId: 982-cayman | model: '718 Cayman' | yearStart: 2017 | yearEnd: PRESENT | trims: ['Base', 'S', 'GTS 4.0', 'GT4', 'GT4 RS']`

| Trim | Status | MY | Body | Engine | HP | Trans | Prod | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Base | In catalog | 2017–pres. | Coupé | 9A2 flat-4T 2.0L | 300 | 6MT / PDK | (nc) | (nc) | ~$56k [V] | Flat-4 sound controversy | — |
| S | In catalog | 2017–pres. | Coupé | 9A2 flat-4T 2.5L | 350 | 6MT / PDK | (nc) | (nc) | ~$66k [V] | — | — |
| GTS 4.0 | In catalog | 2020–pres. | Coupé | 9A2 flat-6 NA 4.0L | 394 | 6MT / PDK | (nc) | (nc) | ~$86k [V] | — | Flat-six return in Cayman |
| GT4 | In catalog | 2019–pres. | Coupé | 9A2 flat-6 NA 4.0L | 414 | 6MT / PDK | (nc) | (nc) | ~$99k [V] | — | MY2019 launch; PDK added later model years |
| GT4 RS | In catalog | 2022–pres. | Coupé | 9A2 flat-6 NA 4.0L (race-derived) | 493 | PDK | ~7,000 [V-est] | [VERIFY] | ~$149k [V] | — | PDK only; Weissach pkg; ~7k worldwide est [V] |
| GTS (2.5T) | **(not in catalog)** | 2018–2019 | Coupé | 9A2 flat-4T 2.5L | 365 | 6MT / PDK | [VERIFY] | [VERIFY] | ~$81k [V] | — | Flat-four GTS era; distinct from GTS 4.0; **different comp pool** |
| T | **(not in catalog)** | 2019 | Coupé | 9A2 flat-4T 2.0L | 300 | 6MT [V] | [VERIFY] | [VERIFY] | ~$64k [V] | — | Track focus; manual priority; limited production [V] |

---

## Section B — Canonical Production Table

*All production trims regardless of catalog status. Units = worldwide unless noted. [V] = VERIFY. (nc) = not in catalog.*

| Gen | Trim | Body | MY | Engine | HP | Units | US Alloc | MSRP | Catalog Status |
|---|---|---|---|---|---|---|---|---|---|
| 986 | Boxster | Roadster | 1997–2004 | M96 2.5→2.7L | 201→228 | ~164,863 total gen [V] | (nc) | ~$40k [V] | In catalog (Base) |
| 986 | Boxster S | Roadster | 2000–2004 | M96 3.2L | 252→260 | incl. above | (nc) | ~$50k [V] | In catalog (S) |
| 986 | 550 Spyder Anniversary | Roadster | 2004 | M96 3.2L | 260 | 1,953 [V] | 500 [V] | ~$55k [V] | **(not in catalog)** |
| 986 | S 50th Anniversary | Roadster | 2004 | M96 3.2L | 260 | [VERIFY] | [VERIFY] | ~$52k [V] | **(not in catalog)** |
| 987.1 | Boxster | Roadster | 2005–2008 | M97 2.7L | 240→245 | (nc) | (nc) | ~$46k [V] | In catalog (Base) |
| 987.1 | Boxster S | Roadster | 2005–2008 | M97 3.4L | 280→295 | (nc) | (nc) | ~$55k [V] | In catalog (S) |
| 987.1 | Boxster RS 60 Spyder | Roadster | 2008 | M97 3.4L | 303 [V] | ~1,960 [V] | ~500 US [V] | ~$63k [V] | **(not in catalog)** |
| 987.1 | Cayman | Coupé | 2006–2008 | M97 2.7L | 245 [V] | (nc) | (nc) | ~$45k [V] | In catalog (Base) |
| 987.1 | Cayman S | Coupé | 2006–2008 | M97 3.4L | 295 | (nc) | (nc) | ~$58k [V] | In catalog (S) |
| 987.1 | Cayman S Sport | Coupé | 2008 | M97 3.4L | 303 [V] | [VERIFY] | [VERIFY] | ~$62k [V] | **(not in catalog)** |
| 987.2 | Boxster | Roadster | 2009–2012 | 9A1 DFI 2.9L | 255 | (nc) | (nc) | ~$47k [V] | In catalog (Base) |
| 987.2 | Boxster S | Roadster | 2009–2012 | 9A1 DFI 3.4L | 310 | (nc) | (nc) | ~$57k [V] | In catalog (S) |
| 987.2 | Boxster Spyder | Roadster | 2010–2012 | 9A1 DFI 3.4L | 320 | ~2,444 [V] | [VERIFY] | ~$61k [V] | In catalog (Spyder) |
| 987.2 | Boxster S Black Edition | Roadster | 2011–2012 | 9A1 DFI 3.4L | 310 | [VERIFY] | [VERIFY] | ~$62k [V] | **(not in catalog)** |
| 987.2 | Boxster S PDE2 | Roadster | 2009 | 9A1 DFI 3.4L | 310 [V] | [VERIFY] | [VERIFY] | ~$60k [V] | **(not in catalog)** |
| 987.2 | Cayman | Coupé | 2009–2012 | 9A1 DFI 2.9L | 265 | (nc) | (nc) | ~$48k [V] | In catalog (Base) |
| 987.2 | Cayman S | Coupé | 2009–2012 | 9A1 DFI 3.4L | 320 | (nc) | (nc) | ~$58k [V] | In catalog (S) |
| 987.2 | Cayman R | Coupé | 2011–2012 | 9A1 DFI 3.4L | 330 | 1,421–1,621 [V] | 624 NA [V] | ~$68k [V] | In catalog (R) |
| 987.2 | Cayman S Black Edition | Coupé | 2011–2012 | 9A1 DFI 3.4L | 320 | [VERIFY] | [VERIFY] | ~$62k [V] | **(not in catalog)** |
| 981 | Boxster | Roadster | 2012–2016 | 9A1 2.7L | 265 | ~54,374 total gen [V] | (nc) | ~$50k [V] | In catalog (Base) |
| 981 | Boxster S | Roadster | 2012–2016 | 9A1 3.4L | 315 | incl. above | (nc) | ~$60k [V] | In catalog (S) |
| 981 | Boxster GTS | Roadster | 2014–2016 | 9A1 3.4L | 330 | incl. above | (nc) | ~$74k [V] | In catalog (GTS) |
| 981 | Boxster Spyder | Roadster | 2015–2016 | 9A1 3.8L | 375 | ~2,486 [V] | ~850 US [V] | ~$84k [V] | In catalog (Spyder) |
| 981 | Boxster Black Edition | Roadster | 2016 | 9A1 3.4L [V] | 315 [V] | [VERIFY] | [VERIFY] | ~$63k [V] | **(not in catalog)** |
| 981 | Cayman | Coupé | 2013–2016 | 9A1 2.7L | 275 | (nc) | (nc) | ~$53k [V] | In catalog (Base) |
| 981 | Cayman S | Coupé | 2013–2016 | 9A1 3.4L | 325 | (nc) | (nc) | ~$63k [V] | In catalog (S) |
| 981 | Cayman GTS | Coupé | 2015–2016 | 9A1 3.4L | 340 | (nc) | (nc) | ~$77k [V] | In catalog (GTS) |
| 981 | Cayman GT4 | Coupé | 2015–2016 | 9A1 3.8L | 385 | ~2,500 [V] | ~1,250 US [V] | ~$86k [V] | In catalog (GT4) |
| 981 | Cayman Black Edition | Coupé | 2016 | 9A1 2.7L [V] | 275 [V] | [VERIFY] | [VERIFY] | ~$55k [V] | **(not in catalog)** |
| 982 | 718 Boxster | Roadster | 2017–pres. | 9A2 2.0T | 300 | (nc) | (nc) | ~$57k [V] | In catalog (Base) |
| 982 | 718 Boxster S | Roadster | 2017–pres. | 9A2 2.5T | 350 | (nc) | (nc) | ~$67k [V] | In catalog (S) |
| 982 | 718 Boxster GTS (2.5T) | Roadster | 2018–2019 | 9A2 2.5T | 365 | [VERIFY] | [VERIFY] | ~$82k [V] | **(not in catalog)** |
| 982 | 718 Boxster GTS 4.0 | Roadster | 2020–pres. | 9A2 4.0L NA | 394 | (nc) | (nc) | ~$87k [V] | In catalog (GTS 4.0) |
| 982 | 718 Boxster Spyder | Roadster | 2020–pres. | 9A2 4.0L NA | 414 | (nc) | (nc) | ~$97k [V] | In catalog (Spyder) |
| 982 | 718 Boxster Spyder RS | Roadster | 2024–pres. | 9A2 4.0L NA+ | 500 [V] | [VERIFY] | [VERIFY] | ~$139k [V] | **(not in catalog)** |
| 982 | 25 Jahre Boxster | Roadster | 2021 | 9A2 4.0L NA [V] | 414 [V] | ~1,250 [V] | [VERIFY] | ~$99k [V] | **(not in catalog)** |
| 982 | 718 Cayman | Coupé | 2017–pres. | 9A2 2.0T | 300 | (nc) | (nc) | ~$56k [V] | In catalog (Base) |
| 982 | 718 Cayman S | Coupé | 2017–pres. | 9A2 2.5T | 350 | (nc) | (nc) | ~$66k [V] | In catalog (S) |
| 982 | 718 Cayman T | Coupé | 2019 | 9A2 2.0T | 300 | [VERIFY] | [VERIFY] | ~$64k [V] | **(not in catalog)** |
| 982 | 718 Cayman GTS (2.5T) | Coupé | 2018–2019 | 9A2 2.5T | 365 | [VERIFY] | [VERIFY] | ~$81k [V] | **(not in catalog)** |
| 982 | 718 Cayman GTS 4.0 | Coupé | 2020–pres. | 9A2 4.0L NA | 394 | (nc) | (nc) | ~$86k [V] | In catalog (GTS 4.0) |
| 982 | 718 Cayman GT4 | Coupé | 2019–pres. | 9A2 4.0L NA | 414 | (nc) | (nc) | ~$99k [V] | In catalog (GT4) |
| 982 | 718 Cayman GT4 RS | Coupé | 2022–pres. | 9A2 4.0L NA (race-derived) | 493 | ~7,000 [V-est] | [VERIFY] | ~$149k [V] | In catalog (GT4 RS) |

---

## Section C — Gap Analysis

### C.1 Confirmed Errors in Current Catalog

| Issue | genId | Current Value | Correct Value | Source | Priority |
|---|---|---|---|---|---|
| `yearEnd` wrong | `987.2-boxster` | 2011 | **2012** | Spyder and Black Edition ran through MY2012 | HIGH |
| 981 Cayman GT4 RS never existed | `981-cayman` | Not in current trims (already removed) | N/A — correct | REVIEW.md | DONE |

### C.2 Missing Trims by Generation

**986 — `genId: 986`**
- `550 Spyder Anniversary` (2004): 1,953 units [V] / 500 US — numbered commemorative; major BaT/C&B auction presence; distinct comp pool from standard S; needs own trim for accurate comps
- `S 50th Anniversary` (2004): production [VERIFY]; Guards Red / Aqua Blue exclusive — collector edition; add if volume is sufficient to affect comps

**987.1 — `genId: 987.1-boxster`, `987.1-cayman`**
- `RS 60 Spyder` (boxster, 2008): ~1,960 units [V] / ~500 US — silver/red heritage spec; 60th anniversary; distinct auction segment; needs own trim
- `Cayman S Sport` (cayman, 2008): production [VERIFY] — higher-output S variant; different comp pool from standard S

**987.2 — `genId: 987.2-boxster`, `987.2-cayman`**
- `Boxster S Black Edition` (2011–2012): [VERIFY units] — cosmetic package; modest comp impact; confirm whether volume warrants separate trim
- `Cayman S Black Edition` (2011–2012): [VERIFY units] — same; confirm volume
- `Boxster S PDE2` (2009): [VERIFY units] — Porsche Design Edition 2 (see C.4)

**981 — `genId: 981-boxster`, `981-cayman`**
- `Boxster Black Edition` (2016): [VERIFY units] — final-year edition; likely cosmetic only; confirm volume
- `Cayman Black Edition` (2016): [VERIFY units] — final-year edition

**982/718 — `genId: 982-boxster`, `982-cayman`**
- `718 Boxster GTS` (2.5T, 2018–2019): distinct engine (flat-four 365hp) vs. GTS 4.0 (flat-six 394hp); different market perception and value trajectory; **HIGH PRIORITY** — current `GTS 4.0` trim could incorrectly match 2018–2019 cars in comp engine
- `718 Cayman GTS` (2.5T, 2018–2019): same issue — entirely different engine era from GTS 4.0; **HIGH PRIORITY**
- `718 Cayman T` (2019): manual-priority track model; distinct positioning and comp pool vs. base
- `718 Boxster Spyder RS` (2024+): 500hp [V]; PDK-only; separate price tier from Spyder; comp engine cannot distinguish Spyder from Spyder RS with current catalog; **HIGH PRIORITY**
- `25 Jahre Boxster` (2021): ~1,250 units [V] — 25th anniversary; ET-Boxster heritage colorways; collector premium expected
- `718 Boxster T` (2021): ~56 units [V — forum estimate only]; existence uncertain — confirm before adding to catalog

### C.3 Year Boundary Issues

| genId | Field | Current | Correct | Comp Impact |
|---|---|---|---|---|
| `987.2-boxster` | yearEnd | 2011 | **2012** | MY2012 Spyder and Black Edition fall outside current gen window — comp mismatches |
| `981-boxster` | yearStart | 2012 | 2012 | Correct — 981 launched MY2012 |
| `981-cayman` | yearStart | 2013 | 2013 | Correct |
| `982-boxster` | yearStart | 2017 | 2017 | Correct — first deliveries late 2016, MY2017 |

### C.4 Classification Issues

**Boxster S Porsche Design Edition 2 — Wrong Generation in Task Scope**
- Task scope listed PDE2 under 987.1 (2005–2008)
- Internal reference docs (`docs/reference/porsche_2000s_reference.md`) confirm PDE2 is MY2009
- MY2009 Boxster S uses the 9A1 DFI engine — this is definitively 987.2, not 987.1
- Action: if PDE2 is added to catalog, it belongs in `genId: 987.2-boxster`; do not add to `987.1-boxster`

**718 GTS Naming Ambiguity — Two Distinct Cars Under One Name**
- Catalog trim `GTS 4.0` in `982-boxster` and `982-cayman` correctly names the MY2020+ 4.0L flat-six variant (394hp)
- The original 718 GTS (MY2018–2019) used the 2.5L flat-four at 365hp — different engine, different sound, different market perception, different depreciation curve
- Comp engine generating results for `GTS 4.0` may incorrectly surface 2018–2019 flat-four GTS listings
- Action: add `GTS` trim (distinct from `GTS 4.0`) to both `982-boxster` and `982-cayman` with yearStart: 2018 / yearEnd: 2019

### C.5 IMS Bearing Generation Matrix (Mid-Engine)

| Generation | Engine | IMS Risk | Bore Score Risk | AOS Failure Risk |
|---|---|---|---|---|
| 986 Base (M96 2.5/2.7L) | M96 | YES — dual-row <1% or single-row ~8% by vintage | LOW (2.5/2.7L largely immune) | YES |
| 986 S (M96 3.2L) | M96 | YES | LOW-MOD (3.2L lower risk than 3.4L M97) | YES |
| 987.1 Base (M97 2.7L) | M97 | YES | LOW | YES |
| 987.1 S / Cayman S (M97 3.4L MY2007+) | M97 | YES | **ELEVATED** | YES |
| 987.2+ (9A1 DFI) | 9A1 | **NO — no intermediate shaft** | LOW | LOW (updated sealing) |
| 981 (9A1/9A2 NA) | 9A1/9A2 | **NO** | LOW | LOW |
| 982/718 (9A2) | 9A2 | **NO** | LOW | LOW |

### C.6 Data Confidence Summary

| Data Type | Confidence | Note |
|---|---|---|
| 986 total production | MOD | ~164,863 (Stuttcars); per-trim split unavailable |
| 986 550 Spyder Anniv units | MOD | 1,953 worldwide / 500 US widely cited; not Porsche AG official |
| 987.2 Boxster Spyder units | MOD | ~2,444 widely cited; not official |
| 987.2 Cayman R units | MOD | 1,421–1,621 range; 624 NA — confirm range |
| 981 Boxster total | MOD | ~54,374; per-trim split unavailable |
| 981 Boxster Spyder units | MOD | ~2,486 total / ~850 US |
| 981 Cayman GT4 units | MOD | ~2,500 / ~1,250 US |
| 982/718 GT4 RS units | LOW | ~7,000 enthusiast estimate; no Porsche AG official figure |
| 25 Jahre Boxster units | LOW | ~1,250 forum estimate only |
| 718 Boxster T existence/units | VERY LOW | ~56 units from single forum post; existence unverified |
| All MSRP figures | LOW | All approximate; require primary source verification |
| 987.1 RS 60 Spyder HP | LOW | 303hp cited; verify against Porsche AG spec sheet |
| 987.1 Cayman S Sport HP | LOW | 303hp assumed; [VERIFY] |
| 718 Spyder RS HP | MOD | 500hp widely reported; verify against current spec sheet |

---

## Sources

- `lib/porsche/models.ts` — catalog current state (GENERATION_DEFS)
- `docs/overnight/canonical-porsche-production.md` — production figures (sections 11, 13, 17, 21)
- `docs/overnight/trim-list-audit.md` — catalog gap analysis (sections 3.10 Boxster, 3.11 Cayman)
- `docs/overnight/production-counts.md` — supplementary production data
- `docs/overnight/REVIEW.md` — confirmed errors (981 GT4 RS removal, 987.2 yearEnd)
- `docs/reference/defects/01_engine_m96_m97.md` — IMS bearing and bore scoring scope
- `docs/reference/defects/07_body_cabriolet.md` — Boxster top mechanism failure modes
- `docs/reference/porsche_2000s_reference.md` — confirms PDE2 = MY2009 / 987.2 generation
- `docs/reference/porsche_2010s_reference.md` — 981/982 era context
- Stuttcars production registry — 986 total ~164,863 (cited in canonical-porsche-production.md)
- Porsche Klassik, Excellence Magazine, PCA Panorama — corroborating sources for production figures and trim histories
