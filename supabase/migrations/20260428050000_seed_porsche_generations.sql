BEGIN;

-- =============================================================================
-- Phase 4, Task 2: Seed porsche_generations
-- Coverage: 356 (pre-A through C), air-cooled 911 (0-series through 993),
-- water-cooled 911 (996.1 through 992), Boxster (986–982), Cayman (987.1–982),
-- Cayenne (955–9Y0), Macan (95B + EV), Panamera (970–971), Taycan (J1)
-- 34 rows total.
-- Idempotent: ON CONFLICT updates core structural fields and fills NULL
-- model_family / production_count without overwriting manually-set values.
-- =============================================================================

INSERT INTO porsche_generations (
  generation_id,
  model,
  year_start,
  year_end,
  body_styles,
  engine_type,
  notes,
  model_family,
  production_count
)
VALUES

  -- -------------------------------------------------------------------------
  -- 356 (4 rows)
  -- -------------------------------------------------------------------------

  (
    '356-pre-a', '356', 1948, 1955,
    ARRAY['Coupe', 'Cabriolet', 'Speedster'],
    'Air-cooled',
    'Origins of Porsche; includes the Gmünd aluminum-body cars (1948–1950) and early Stuttgart steel-body production. Hand-built in very small numbers. The rarest and most historically significant 356s.',
    '356', NULL
  ),
  (
    '356a', '356', 1955, 1959,
    ARRAY['Coupe', 'Cabriolet', 'Speedster'],
    'Air-cooled',
    'First formally designated generation; announced at the 1955 Paris Salon. Introduced the Carrera four-cam engine option. Speedster achieved iconic status in this era.',
    '356', NULL
  ),
  (
    '356b', '356', 1959, 1963,
    ARRAY['Coupe', 'Cabriolet', 'Roadster'],
    'Air-cooled',
    'Most-produced 356 variant. Notable styling revisions including raised headlights and revised bumpers. Roadster replaced the Speedster. Carrera 2 engine introduced.',
    '356', NULL
  ),
  (
    '356c', '356', 1963, 1965,
    ARRAY['Coupe', 'Cabriolet'],
    'Air-cooled',
    'Final 356 generation; introduced four-wheel disc brakes across the range. Carrera 2 remained the performance flagship. The cleanest and most refined 356.',
    '356', NULL
  ),

  -- -------------------------------------------------------------------------
  -- Air-cooled 911 (5 rows)
  -- -------------------------------------------------------------------------

  (
    '911-0', '911', 1963, 1965,
    ARRAY['Coupe'],
    'Air-cooled',
    'The original 911s built before the series-letter system began. Earliest examples carry 901 badging. Pre-A cars differ from the F-series in engine spec, interior, and detail fittings; prized by purists for their rarity.',
    '911', NULL
  ),
  (
    '911-f', '911', 1966, 1973,
    ARRAY['Coupe', 'Targa'],
    'Air-cooled',
    'Long-hood era spanning Porsche internal series A through F. Wheelbase lengthened 57 mm for the 1969 D-series. Culminates in the legendary 2.7 RS (1973), the most desirable long-hood variant for collectors.',
    '911', NULL
  ),
  (
    '911-g', '911', 1974, 1989,
    ARRAY['Coupe', 'Targa', 'Cabriolet'],
    'Air-cooled',
    'Impact-bumper era spanning 15 years; covers the 2.7, SC, and 3.2 Carrera engine families. Cabriolet introduced for 1983. The Carrera 3.2 (1984–1989) is the most refined and reliable G-series car.',
    '911', NULL
  ),
  (
    '964', '911', 1989, 1994,
    ARRAY['Coupe', 'Targa', 'Cabriolet', 'Speedster'],
    'Air-cooled',
    'First major structural revision of the 911; 85% new over the G-series. Introduced Carrera 4 AWD, Tiptronic, and coil-spring suspension. Speedster and America Roadster are the collector-grade variants.',
    '911', NULL
  ),
  (
    '993', '911', 1994, 1998,
    ARRAY['Coupe', 'Targa', 'Cabriolet', 'Speedster'],
    'Air-cooled',
    'Last air-cooled 911 and widely regarded as the apex of the analog 911 formula. Introduced VarioRam and multi-link rear suspension. Free of the IMS bearing concern. Twin-turbo and GT2 are blue-chip collectibles.',
    '911', NULL
  ),

  -- -------------------------------------------------------------------------
  -- Water-cooled 911 (7 rows)
  -- -------------------------------------------------------------------------

  (
    '996.1', '911', 1998, 2001,
    ARRAY['Coupe', 'Cabriolet', 'Targa'],
    'Water-cooled',
    'First water-cooled 911 (Gen 1). Introduced ovoid headlights shared with the 986 Boxster. M96 engine carries IMS bearing risk on high-mileage examples; RMS seal is a known maintenance item. GT3 uses a Mezger engine and is unaffected by IMS.',
    '911', NULL
  ),
  (
    '996.2', '911', 2002, 2005,
    ARRAY['Coupe', 'Cabriolet', 'Targa'],
    'Water-cooled',
    'Facelifted 996 (Gen 2); redesigned headlights, revised interior, and detail improvements. IMS bearing concern remains for M96/97 engines; Mezger-engined GT3, GT3 RS, and Turbo variants are unaffected.',
    '911', NULL
  ),
  (
    '997.1', '911', 2005, 2008,
    ARRAY['Coupe', 'Cabriolet', 'Targa'],
    'Water-cooled',
    'Return to traditional 911 styling with round headlights; widely considered the best-looking water-cooled 911. Naturally-aspirated M96/97 flat-six; IMS bearing present but failure rates lower than early 996. GT3 RS is the standout driver variant.',
    '911', NULL
  ),
  (
    '997.2', '911', 2009, 2013,
    ARRAY['Coupe', 'Cabriolet', 'Targa'],
    'Water-cooled',
    'Revised with direct fuel injection (DFI); IMS bearing redesigned and concern essentially eliminated. GT3 RS 4.0 (2011) is a benchmark naturally-aspirated modern 911. Last 997 GT cars produced into 2013 MY.',
    '911', NULL
  ),
  (
    '991.1', '911', 2012, 2015,
    ARRAY['Coupe', 'Cabriolet', 'Targa'],
    'Water-cooled',
    'First 991-generation 911; introduced electric power steering and PDK as standard on base Carrera. Naturally-aspirated 3.4 (Carrera) and 3.8 (Carrera S). Longest wheelbase in 911 history.',
    '911', NULL
  ),
  (
    '991.2', '911', 2016, 2019,
    ARRAY['Coupe', 'Cabriolet', 'Targa', 'Speedster'],
    'Water-cooled',
    'Turbocharged flat-six introduced to base Carrera, replacing the NA engine. GT cars (GT3, GT3 RS, GT3 Touring, R, Speedster) remain naturally-aspirated and are among the most collectible modern Porsches.',
    '911', NULL
  ),
  (
    '992', '911', 2019, NULL,
    ARRAY['Coupe', 'Cabriolet', 'Targa'],
    'Water-cooled',
    'Current 911 generation; wider body standard across Carrera variants. All Carrera powertrains turbocharged. GT3 retains a high-revving naturally-aspirated flat-six.',
    '911', NULL
  ),

  -- -------------------------------------------------------------------------
  -- Boxster (5 rows)
  -- -------------------------------------------------------------------------

  (
    '986', 'Boxster', 1997, 2004,
    ARRAY['Roadster'],
    'Water-cooled',
    'First-generation Boxster; launched the modern mid-engine Porsche sports car. Shares M96 engine family with the 996, carrying the same IMS bearing and RMS considerations. The S variant is the preferred choice.',
    'Boxster', NULL
  ),
  (
    '987.1-boxster', 'Boxster', 2005, 2008,
    ARRAY['Roadster'],
    'Water-cooled',
    'Second-generation Boxster with improved interior quality, stiffer chassis, and more powerful engines. Shares M97 engine; IMS concern significantly mitigated. RS 60 Spyder limited edition is the collector variant.',
    'Boxster', NULL
  ),
  (
    '987.2-boxster', 'Boxster', 2009, 2012,
    ARRAY['Roadster'],
    'Water-cooled',
    'Refresh with direct fuel injection and updated interior. DFI engines largely free of IMS concerns. Spyder (2010+) brings the Carrera S engine and stripped-down brief, making it the standout driver-focused variant.',
    'Boxster', NULL
  ),
  (
    '981-boxster', 'Boxster', 2012, 2016,
    ARRAY['Roadster'],
    'Water-cooled',
    'Third-generation Boxster; fully revised with independent-wishbone front suspension, new 2.7/3.4 flat-six engines, and a significantly more rigid structure. Last naturally-aspirated Boxster. GTS and Spyder are the top-spec variants.',
    'Boxster', NULL
  ),
  (
    '982-boxster', '718 Boxster', 2017, NULL,
    ARRAY['Roadster'],
    'Water-cooled',
    'Rebranded 718 Boxster. Controversial switch from flat-six to turbocharged 2.0/2.5 flat-four. GTS 4.0 and Spyder 4.0 (2020+) reinstated the naturally-aspirated flat-six and became immediately sought-after.',
    '718', NULL
  ),

  -- -------------------------------------------------------------------------
  -- Cayman (4 rows)
  -- -------------------------------------------------------------------------

  (
    '987.1-cayman', 'Cayman', 2006, 2008,
    ARRAY['Coupe'],
    'Water-cooled',
    'First Cayman; coupe variant on the 987 platform. Launched initially as Cayman S (3.4L) only; base Cayman (2.7L) followed in 2007. Mid-engine coupe dynamics drew immediate critical acclaim.',
    'Cayman', NULL
  ),
  (
    '987.2-cayman', 'Cayman', 2009, 2012,
    ARRAY['Coupe'],
    'Water-cooled',
    'Refresh with direct fuel injection and updated interior, matching the 987.2 Boxster update. DFI engines largely free of IMS concerns. R variant (2011) is the stripped, driver-focused 987.2 Cayman.',
    'Cayman', NULL
  ),
  (
    '981-cayman', 'Cayman', 2013, 2016,
    ARRAY['Coupe'],
    'Water-cooled',
    'Fully redesigned 981-platform Cayman with new flat-six engines and stiffer structure. GT4 (2015) brings the Carrera S engine and GT-derived suspension, establishing the Cayman as a serious track tool. Last naturally-aspirated Cayman.',
    'Cayman', NULL
  ),
  (
    '982-cayman', '718 Cayman', 2017, NULL,
    ARRAY['Coupe'],
    'Water-cooled',
    'Rebranded 718 Cayman alongside the 718 Boxster; flat-four engines standard. GT4 and GT4 RS reinstated naturally-aspirated flat-six. GT4 RS (2021+) uses the 911 GT3-sourced 4.0L engine and is the pinnacle of the 718 lineup.',
    '718', NULL
  ),

  -- -------------------------------------------------------------------------
  -- Cayenne (4 rows)
  -- -------------------------------------------------------------------------

  (
    '955', 'Cayenne', 2003, 2006,
    ARRAY['SUV'],
    'Water-cooled',
    'First Cayenne; co-developed with VW on the Phaeton/Touareg platform. Available in V6, V8, S, Turbo, and Turbo S. Established Porsche SUV credibility. The Turbo S is the desirable performance variant.',
    'Cayenne', NULL
  ),
  (
    '957', 'Cayenne', 2007, 2010,
    ARRAY['SUV'],
    'Water-cooled',
    'Facelift of the 955 platform with revised styling, improved interior quality, and direct-injection engines from 2008. Meaningful handling and efficiency gains over the 955. Turbo S and GTS are the sought-after variants.',
    'Cayenne', NULL
  ),
  (
    '958', 'Cayenne', 2011, 2018,
    ARRAY['SUV'],
    'Water-cooled',
    'All-new second generation on a Porsche-dominant platform; significantly improved dynamics and a more athletic character. Diesel and Cayenne S Hybrid introduced. 958.2 facelift in 2015. Turbo S is the performance benchmark.',
    'Cayenne', NULL
  ),
  (
    '9y0', 'Cayenne', 2019, NULL,
    ARRAY['SUV', 'Coupe'],
    'Water-cooled',
    'Third-generation Cayenne; introduced the Cayenne Coupe body style for 2020 MY. Wide powertrain range including V6, V8, and plug-in hybrid variants. Turbo S E-Hybrid is the most powerful Cayenne to date.',
    'Cayenne', NULL
  ),

  -- -------------------------------------------------------------------------
  -- Macan (2 rows)
  -- -------------------------------------------------------------------------

  (
    '95b', 'Macan', 2015, 2023,
    ARRAY['SUV'],
    'Water-cooled',
    'First-generation Macan on the MLB Evo platform (shared with Audi Q5). Turbocharged four-cylinder and V6 options. GTS and Turbo are the collector-relevant variants. 2019 facelift treated as part of the same generation.',
    'Macan', NULL
  ),
  (
    'macan-ev', 'Macan', 2024, NULL,
    ARRAY['SUV'],
    'Electric',
    'All-electric second-generation Macan on the PPE platform co-developed with Audi. Fully independent architecture from the combustion 95B. Standard and Turbo variants; Turbo rated at 630 hp in launch control.',
    'Macan', NULL
  ),

  -- -------------------------------------------------------------------------
  -- Panamera (2 rows)
  -- -------------------------------------------------------------------------

  (
    '970', 'Panamera', 2010, 2016,
    ARRAY['Sedan'],
    'Water-cooled',
    'First Panamera; introduced Porsche to the full-size executive sedan segment. Available in V6, V8, Turbo, and Turbo S. First Panamera S Hybrid introduced in 2012. Turbo S is the collector-grade variant.',
    'Panamera', NULL
  ),
  (
    '971', 'Panamera', 2017, NULL,
    ARRAY['Sedan', 'Sport Turismo'],
    'Water-cooled',
    'Fully redesigned second generation with dramatically improved dynamics and styling. Sport Turismo estate variant added for 2018 MY. Turbo S E-Hybrid is the flagship and most powerful Panamera.',
    'Panamera', NULL
  ),

  -- -------------------------------------------------------------------------
  -- Taycan (1 row)
  -- -------------------------------------------------------------------------

  (
    'j1', 'Taycan', 2020, NULL,
    ARRAY['Sedan', 'Sport Turismo', 'Cross Turismo'],
    'Electric',
    'Porsche first production EV on the 800V J1 platform shared with the Audi e-tron GT. Offered in sedan, Sport Turismo, and Cross Turismo variants. Turbo S produces the highest factory output of any production Porsche.',
    'Taycan', NULL
  )

ON CONFLICT (generation_id) DO UPDATE SET
  model            = EXCLUDED.model,
  year_start       = EXCLUDED.year_start,
  year_end         = EXCLUDED.year_end,
  body_styles      = EXCLUDED.body_styles,
  engine_type      = EXCLUDED.engine_type,
  notes            = COALESCE(porsche_generations.notes, EXCLUDED.notes),
  model_family     = COALESCE(porsche_generations.model_family, EXCLUDED.model_family),
  production_count = COALESCE(porsche_generations.production_count, EXCLUDED.production_count),
  updated_at       = now();

COMMIT;
