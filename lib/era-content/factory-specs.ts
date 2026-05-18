type FactorySpec = {
  hp: string
  torque: string
  zero_to_sixty: string
  engine?: string
  curb_weight_lb?: string
  top_speed_mph?: string
  redline_rpm?: string
}

// Key: `${generation_id}:${normalizedTrimPrefix}` where normalization is:
//   lowercase → spaces to underscores → strip non-alphanumeric/underscore
// Lookup: exact match first, then longest-prefix match with word-boundary (_) awareness.
const SPECS: Record<string, FactorySpec> = {
  // 993 (1994–1998 air-cooled)
  '993:turbo_s':     { hp: '450 hp', torque: '398 lb-ft', zero_to_sixty: '4.0s', engine: '3.6L M64 twin-turbo flat-six',       curb_weight_lb: '3,395 lb', top_speed_mph: '186 mph', redline_rpm: '6,500 rpm' },
  '993:turbo':       { hp: '408 hp', torque: '398 lb-ft', zero_to_sixty: '4.5s', engine: '3.6L M64 twin-turbo flat-six',       curb_weight_lb: '3,307 lb', top_speed_mph: '180 mph', redline_rpm: '6,500 rpm' },
  '993:gt2':         { hp: '430 hp', torque: '398 lb-ft', zero_to_sixty: '4.4s', engine: '3.6L M64 twin-turbo flat-six',       curb_weight_lb: '3,042 lb', top_speed_mph: '183 mph', redline_rpm: '6,500 rpm' },
  '993:rs':          { hp: '300 hp', torque: '262 lb-ft', zero_to_sixty: '5.0s', engine: '3.8L M64 flat-six',                  curb_weight_lb: '2,844 lb', top_speed_mph: '168 mph', redline_rpm: '6,600 rpm' },
  '993:carrera_4s':  { hp: '285 hp', torque: '250 lb-ft', zero_to_sixty: '5.1s', engine: '3.6L M64 flat-six (Varioram)',       curb_weight_lb: '3,197 lb', top_speed_mph: '168 mph', redline_rpm: '6,100 rpm' },
  '993:carrera_s':   { hp: '285 hp', torque: '250 lb-ft', zero_to_sixty: '5.1s', engine: '3.6L M64 flat-six (Varioram)',       curb_weight_lb: '3,064 lb', top_speed_mph: '168 mph', redline_rpm: '6,100 rpm' },
  '993:carrera_4':   { hp: '272 hp', torque: '243 lb-ft', zero_to_sixty: '5.6s', engine: '3.6L M64 flat-six',                  curb_weight_lb: '3,108 lb', top_speed_mph: '161 mph', redline_rpm: '6,100 rpm' },
  '993:targa':       { hp: '272 hp', torque: '243 lb-ft', zero_to_sixty: '5.8s', engine: '3.6L M64 flat-six (Varioram)',       curb_weight_lb: '3,086 lb', top_speed_mph: '161 mph', redline_rpm: '6,100 rpm' },
  '993:carrera':     { hp: '272 hp', torque: '243 lb-ft', zero_to_sixty: '5.6s', engine: '3.6L M64 flat-six',                  curb_weight_lb: '3,031 lb', top_speed_mph: '161 mph', redline_rpm: '6,100 rpm' },

  // 996.1 (1998–2001)
  '996.1:turbo':     { hp: '415 hp', torque: '413 lb-ft', zero_to_sixty: '4.1s', engine: '3.6L Mezger twin-turbo flat-six',    curb_weight_lb: '3,263 lb', top_speed_mph: '186 mph', redline_rpm: '6,750 rpm' },
  '996.1:gt3':       { hp: '360 hp', torque: '273 lb-ft', zero_to_sixty: '4.8s', engine: '3.6L Mezger flat-six',               curb_weight_lb: '2,976 lb', top_speed_mph: '187 mph', redline_rpm: '8,000 rpm' },
  '996.1:carrera_4': { hp: '296 hp', torque: '258 lb-ft', zero_to_sixty: '5.3s', engine: '3.4L M96 flat-six',                  curb_weight_lb: '3,109 lb', top_speed_mph: '174 mph', redline_rpm: '6,750 rpm' },
  '996.1:carrera':   { hp: '296 hp', torque: '258 lb-ft', zero_to_sixty: '5.2s', engine: '3.4L M96 flat-six',                  curb_weight_lb: '2,976 lb', top_speed_mph: '174 mph', redline_rpm: '6,750 rpm' },

  // 996.2 (2002–2005)
  '996.2:turbo_s':   { hp: '450 hp', torque: '457 lb-ft', zero_to_sixty: '3.9s', engine: '3.6L Mezger twin-turbo flat-six',    curb_weight_lb: '3,395 lb', top_speed_mph: '190 mph', redline_rpm: '6,750 rpm' },
  '996.2:turbo':     { hp: '415 hp', torque: '413 lb-ft', zero_to_sixty: '4.1s', engine: '3.6L Mezger twin-turbo flat-six',    curb_weight_lb: '3,285 lb', top_speed_mph: '189 mph', redline_rpm: '6,750 rpm' },
  '996.2:gt2':       { hp: '483 hp', torque: '472 lb-ft', zero_to_sixty: '3.9s', engine: '3.6L Mezger twin-turbo flat-six',    curb_weight_lb: '3,197 lb', top_speed_mph: '196 mph', redline_rpm: '6,800 rpm' },
  '996.2:gt3_rs':    { hp: '381 hp', torque: '284 lb-ft', zero_to_sixty: '4.4s', engine: '3.6L Mezger flat-six',               curb_weight_lb: '2,998 lb', top_speed_mph: '186 mph', redline_rpm: '8,200 rpm' },
  '996.2:gt3':       { hp: '381 hp', torque: '284 lb-ft', zero_to_sixty: '4.5s', engine: '3.6L Mezger flat-six',               curb_weight_lb: '2,998 lb', top_speed_mph: '190 mph', redline_rpm: '8,200 rpm' },
  '996.2:carrera_4s':{ hp: '320 hp', torque: '273 lb-ft', zero_to_sixty: '5.0s', engine: '3.6L M96 flat-six',                  curb_weight_lb: '3,208 lb', top_speed_mph: '174 mph', redline_rpm: '6,750 rpm' },
  '996.2:carrera_s': { hp: '320 hp', torque: '273 lb-ft', zero_to_sixty: '5.0s', engine: '3.6L M96 flat-six',                  curb_weight_lb: '3,042 lb', top_speed_mph: '174 mph', redline_rpm: '6,750 rpm' },
  '996.2:carrera_4': { hp: '320 hp', torque: '273 lb-ft', zero_to_sixty: '5.2s', engine: '3.6L M96 flat-six',                  curb_weight_lb: '3,109 lb', top_speed_mph: '174 mph', redline_rpm: '6,750 rpm' },
  '996.2:carrera':   { hp: '320 hp', torque: '273 lb-ft', zero_to_sixty: '5.2s', engine: '3.6L M96 flat-six',                  curb_weight_lb: '2,976 lb', top_speed_mph: '174 mph', redline_rpm: '6,750 rpm' },
  // [VERIFY] torque, 0-60, and top-speed against Porsche AG X51 Power Kit press sheet — X51 primarily improves high-rpm output; torque gain is modest
  '996.2:40_jahre_911': { hp: '345 hp', torque: '284 lb-ft', zero_to_sixty: '5.0s', engine: '3.6L M96/03 flat-six X51 Power Kit (narrow-body RWD, LSD, M030 suspension — 1,963 units MY2004)', curb_weight_lb: '2,976 lb', top_speed_mph: '177 mph', redline_rpm: '6,750 rpm' },

  // 997.1 (2005–2008)
  '997.1:turbo':     { hp: '480 hp', torque: '457 lb-ft', zero_to_sixty: '3.9s', engine: '3.6L Mezger twin-turbo flat-six',    curb_weight_lb: '3,494 lb', top_speed_mph: '193 mph', redline_rpm: '6,750 rpm' },
  '997.1:gt2':       { hp: '523 hp', torque: '502 lb-ft', zero_to_sixty: '3.7s', engine: '3.6L Mezger twin-turbo flat-six',    curb_weight_lb: '3,175 lb', top_speed_mph: '204 mph', redline_rpm: '6,800 rpm' },
  '997.1:gt3_rs':    { hp: '415 hp', torque: '298 lb-ft', zero_to_sixty: '4.2s', engine: '3.6L Mezger flat-six',               curb_weight_lb: '3,042 lb', top_speed_mph: '193 mph', redline_rpm: '8,400 rpm' },
  '997.1:gt3':       { hp: '415 hp', torque: '298 lb-ft', zero_to_sixty: '4.3s', engine: '3.6L Mezger flat-six',               curb_weight_lb: '3,042 lb', top_speed_mph: '193 mph', redline_rpm: '8,400 rpm' },
  '997.1:carrera_4s':{ hp: '355 hp', torque: '295 lb-ft', zero_to_sixty: '4.8s', engine: '3.8L M97 flat-six',                  curb_weight_lb: '3,373 lb', top_speed_mph: '182 mph', redline_rpm: '7,300 rpm' },
  '997.1:carrera_s': { hp: '355 hp', torque: '295 lb-ft', zero_to_sixty: '4.8s', engine: '3.8L M97 flat-six',                  curb_weight_lb: '3,307 lb', top_speed_mph: '182 mph', redline_rpm: '7,300 rpm' },
  '997.1:targa_4s':  { hp: '355 hp', torque: '295 lb-ft', zero_to_sixty: '4.9s', engine: '3.8L M97 flat-six',                  curb_weight_lb: '3,439 lb', top_speed_mph: '178 mph', redline_rpm: '7,300 rpm' },
  '997.1:carrera_4': { hp: '325 hp', torque: '273 lb-ft', zero_to_sixty: '5.1s', engine: '3.6L M97 flat-six',                  curb_weight_lb: '3,373 lb', top_speed_mph: '177 mph', redline_rpm: '7,300 rpm' },
  '997.1:targa_4':   { hp: '325 hp', torque: '273 lb-ft', zero_to_sixty: '5.2s', engine: '3.6L M97 flat-six',                  curb_weight_lb: '3,439 lb', top_speed_mph: '175 mph', redline_rpm: '7,300 rpm' },
  '997.1:carrera':   { hp: '325 hp', torque: '273 lb-ft', zero_to_sixty: '5.0s', engine: '3.6L M97 flat-six',                  curb_weight_lb: '3,197 lb', top_speed_mph: '177 mph', redline_rpm: '7,300 rpm' },

  // 997.2 (2009–2012)
  '997.2:gt2_rs':    { hp: '620 hp', torque: '516 lb-ft', zero_to_sixty: '3.4s', engine: '3.8L Mezger twin-turbo flat-six',    curb_weight_lb: '3,042 lb', top_speed_mph: '211 mph', redline_rpm: '6,800 rpm' },
  '997.2:turbo_s':   { hp: '530 hp', torque: '516 lb-ft', zero_to_sixty: '3.3s', engine: '3.8L Mezger twin-turbo flat-six',    curb_weight_lb: '3,549 lb', top_speed_mph: '194 mph', redline_rpm: '6,750 rpm' },
  '997.2:turbo':     { hp: '500 hp', torque: '479 lb-ft', zero_to_sixty: '3.7s', engine: '3.8L Mezger twin-turbo flat-six',    curb_weight_lb: '3,494 lb', top_speed_mph: '192 mph', redline_rpm: '6,750 rpm' },
  '997.2:gt2':       { hp: '523 hp', torque: '502 lb-ft', zero_to_sixty: '3.6s', engine: '3.6L Mezger twin-turbo flat-six',    curb_weight_lb: '3,175 lb', top_speed_mph: '204 mph', redline_rpm: '6,800 rpm' },
  '997.2:gt3_rs_40': { hp: '500 hp', torque: '339 lb-ft', zero_to_sixty: '3.8s', engine: '4.0L Mezger flat-six',               curb_weight_lb: '3,042 lb', top_speed_mph: '193 mph', redline_rpm: '8,500 rpm' },
  '997.2:gt3_rs':    { hp: '450 hp', torque: '317 lb-ft', zero_to_sixty: '3.9s', engine: '3.8L Mezger flat-six',               curb_weight_lb: '3,086 lb', top_speed_mph: '193 mph', redline_rpm: '8,500 rpm' },
  '997.2:gt3':       { hp: '435 hp', torque: '317 lb-ft', zero_to_sixty: '4.1s', engine: '3.8L Mezger flat-six',               curb_weight_lb: '3,042 lb', top_speed_mph: '188 mph', redline_rpm: '8,400 rpm' },
  // [VERIFY] Sport Classic and Speedster 0-60 and top_speed_mph — no Porsche-published SAE figures in source docs
  '997.2:sport_classic': { hp: '408 hp', torque: '310 lb-ft', zero_to_sixty: '4.6s', engine: '3.8L 9A1 + X51 flat-six (6MT only; Sport Classic Grey only; 250 units worldwide; no US allocation — RoW Porsche Exclusive)', curb_weight_lb: '3,263 lb', top_speed_mph: '180 mph', redline_rpm: '7,500 rpm' },
  '997.2:speedster':     { hp: '408 hp', torque: '310 lb-ft', zero_to_sixty: '4.4s', engine: '3.8L 9A1 + X51 flat-six (7-spd PDK only; 356 units worldwide; wide C4 body on RWD; ~108 US allocation; tribute to Porsche 356)', curb_weight_lb: '3,197 lb', top_speed_mph: '188 mph', redline_rpm: '7,500 rpm' },
  '997.2:carrera_4s':{ hp: '385 hp', torque: '310 lb-ft', zero_to_sixty: '4.5s', engine: '3.8L 9A1 flat-six',                  curb_weight_lb: '3,373 lb', top_speed_mph: '188 mph', redline_rpm: '7,500 rpm' },
  '997.2:carrera_s': { hp: '385 hp', torque: '310 lb-ft', zero_to_sixty: '4.5s', engine: '3.8L 9A1 flat-six',                  curb_weight_lb: '3,307 lb', top_speed_mph: '188 mph', redline_rpm: '7,500 rpm' },
  '997.2:targa_4s':  { hp: '385 hp', torque: '310 lb-ft', zero_to_sixty: '4.6s', engine: '3.8L 9A1 flat-six',                  curb_weight_lb: '3,395 lb', top_speed_mph: '185 mph', redline_rpm: '7,500 rpm' },
  '997.2:carrera_4': { hp: '345 hp', torque: '288 lb-ft', zero_to_sixty: '5.0s', engine: '3.6L 9A1 flat-six',                  curb_weight_lb: '3,373 lb', top_speed_mph: '180 mph', redline_rpm: '7,500 rpm' },
  '997.2:targa_4':   { hp: '345 hp', torque: '288 lb-ft', zero_to_sixty: '5.1s', engine: '3.6L 9A1 flat-six',                  curb_weight_lb: '3,395 lb', top_speed_mph: '178 mph', redline_rpm: '7,500 rpm' },
  '997.2:carrera':   { hp: '345 hp', torque: '288 lb-ft', zero_to_sixty: '4.9s', engine: '3.6L 9A1 flat-six',                  curb_weight_lb: '3,197 lb', top_speed_mph: '180 mph', redline_rpm: '7,500 rpm' },

  // 991.1 (2012–2015)
  '991.1:turbo_s':   { hp: '560 hp', torque: '516 lb-ft', zero_to_sixty: '3.1s', engine: '3.8L twin-turbo flat-six',           curb_weight_lb: '3,461 lb', top_speed_mph: '197 mph', redline_rpm: '7,200 rpm' },
  '991.1:turbo':     { hp: '520 hp', torque: '487 lb-ft', zero_to_sixty: '3.4s', engine: '3.8L twin-turbo flat-six',           curb_weight_lb: '3,417 lb', top_speed_mph: '194 mph', redline_rpm: '7,200 rpm' },
  '991.1:gt3_rs':    { hp: '500 hp', torque: '339 lb-ft', zero_to_sixty: '3.3s', engine: '4.0L flat-six',                      curb_weight_lb: '3,042 lb', top_speed_mph: '194 mph', redline_rpm: '8,800 rpm' },
  '991.1:gt3':       { hp: '475 hp', torque: '325 lb-ft', zero_to_sixty: '3.5s', engine: '3.8L flat-six',                      curb_weight_lb: '3,064 lb', top_speed_mph: '197 mph', redline_rpm: '8,800 rpm' },
  '991.1:carrera_4s':{ hp: '400 hp', torque: '325 lb-ft', zero_to_sixty: '4.3s', engine: '3.8L flat-six',                      curb_weight_lb: '3,351 lb', top_speed_mph: '188 mph', redline_rpm: '7,800 rpm' },
  '991.1:carrera_s': { hp: '400 hp', torque: '325 lb-ft', zero_to_sixty: '4.3s', engine: '3.8L flat-six',                      curb_weight_lb: '3,307 lb', top_speed_mph: '188 mph', redline_rpm: '7,800 rpm' },
  '991.1:targa_4s':  { hp: '400 hp', torque: '325 lb-ft', zero_to_sixty: '4.4s', engine: '3.8L flat-six',                      curb_weight_lb: '3,439 lb', top_speed_mph: '185 mph', redline_rpm: '7,800 rpm' },
  '991.1:carrera_4': { hp: '350 hp', torque: '288 lb-ft', zero_to_sixty: '4.9s', engine: '3.4L flat-six',                      curb_weight_lb: '3,351 lb', top_speed_mph: '182 mph', redline_rpm: '7,800 rpm' },
  '991.1:targa_4':   { hp: '350 hp', torque: '288 lb-ft', zero_to_sixty: '5.0s', engine: '3.4L flat-six',                      curb_weight_lb: '3,439 lb', top_speed_mph: '179 mph', redline_rpm: '7,800 rpm' },
  '991.1:carrera':   { hp: '350 hp', torque: '288 lb-ft', zero_to_sixty: '4.8s', engine: '3.4L flat-six',                      curb_weight_lb: '3,042 lb', top_speed_mph: '182 mph', redline_rpm: '7,800 rpm' },
  // [VERIFY: curb_weight and 0-60 interpolated from Targa 4S baseline (3,439 lb) + GTS tune; primary Targa 4 GTS spec sheet not confirmed]
  '991.1:targa_4_gts':              { hp: '430 hp', torque: '325 lb-ft', zero_to_sixty: '4.2s', engine: '3.8L NA flat-six',                                   curb_weight_lb: '3,461 lb', top_speed_mph: '182 mph', redline_rpm: '7,800 rpm' },
  // [VERIFY: curb_weight estimated from Carrera S + wide-body offset; wide-body RWD platform; 0-60 not primary-sourced; 1,963 units MY2013]
  '991.1:50th_anniversary_edition': { hp: '430 hp', torque: '325 lb-ft', zero_to_sixty: '4.2s', engine: '3.8L NA flat-six (X51, wide-body RWD, 1,963 units)', curb_weight_lb: '3,351 lb', top_speed_mph: '188 mph', redline_rpm: '7,800 rpm' },

  // 991.2 (2016–2019)
  '991.2:turbo_s':   { hp: '580 hp', torque: '553 lb-ft', zero_to_sixty: '2.9s', engine: '3.8L twin-turbo flat-six',           curb_weight_lb: '3,571 lb', top_speed_mph: '205 mph', redline_rpm: '7,200 rpm' },
  '991.2:turbo':     { hp: '540 hp', torque: '487 lb-ft', zero_to_sixty: '3.0s', engine: '3.8L twin-turbo flat-six',           curb_weight_lb: '3,527 lb', top_speed_mph: '198 mph', redline_rpm: '7,200 rpm' },
  '991.2:gt2_rs':    { hp: '700 hp', torque: '553 lb-ft', zero_to_sixty: '2.7s', engine: '3.8L twin-turbo flat-six',           curb_weight_lb: '3,241 lb', top_speed_mph: '211 mph', redline_rpm: '7,200 rpm' },
  '991.2:gt3_rs':    { hp: '520 hp', torque: '346 lb-ft', zero_to_sixty: '3.0s', engine: '4.0L flat-six',                      curb_weight_lb: '3,109 lb', top_speed_mph: '193 mph', redline_rpm: '9,000 rpm' },
  '991.2:gt3':       { hp: '500 hp', torque: '339 lb-ft', zero_to_sixty: '3.4s', engine: '4.0L flat-six',                      curb_weight_lb: '3,064 lb', top_speed_mph: '198 mph', redline_rpm: '9,000 rpm' },
  '991.2:r':         { hp: '500 hp', torque: '338 lb-ft', zero_to_sixty: '3.7s', engine: '4.0L flat-six',                      curb_weight_lb: '3,042 lb', top_speed_mph: '200 mph', redline_rpm: '8,500 rpm' },
  '991.2:speedster': { hp: '500 hp', torque: '339 lb-ft', zero_to_sixty: '4.0s', engine: '4.0L flat-six',                      curb_weight_lb: '3,175 lb', top_speed_mph: '192 mph', redline_rpm: '9,000 rpm' },
  '991.2:gts':       { hp: '450 hp', torque: '406 lb-ft', zero_to_sixty: '3.8s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,263 lb', top_speed_mph: '193 mph', redline_rpm: '7,500 rpm' },
  // [VERIFY: curb_weight and 0-60 interpolated from Targa 4S baseline (3,395 lb) + GTS tune; primary Targa 4 GTS spec sheet not confirmed]
  '991.2:targa_4_gts':  { hp: '450 hp', torque: '406 lb-ft', zero_to_sixty: '3.9s', engine: '3.0L twin-turbo flat-six',       curb_weight_lb: '3,439 lb', top_speed_mph: '187 mph', redline_rpm: '7,500 rpm' },
  '991.2:carrera_4s':{ hp: '420 hp', torque: '368 lb-ft', zero_to_sixty: '4.1s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,373 lb', top_speed_mph: '190 mph', redline_rpm: '7,500 rpm' },
  '991.2:carrera_s': { hp: '420 hp', torque: '368 lb-ft', zero_to_sixty: '4.1s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,241 lb', top_speed_mph: '191 mph', redline_rpm: '7,500 rpm' },
  '991.2:targa_4s':  { hp: '420 hp', torque: '368 lb-ft', zero_to_sixty: '4.2s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,395 lb', top_speed_mph: '188 mph', redline_rpm: '7,500 rpm' },
  '991.2:carrera_4': { hp: '370 hp', torque: '331 lb-ft', zero_to_sixty: '4.6s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,307 lb', top_speed_mph: '183 mph', redline_rpm: '7,500 rpm' },
  '991.2:targa_4':   { hp: '370 hp', torque: '331 lb-ft', zero_to_sixty: '4.6s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,373 lb', top_speed_mph: '180 mph', redline_rpm: '7,500 rpm' },
  '991.2:carrera':      { hp: '370 hp', torque: '331 lb-ft', zero_to_sixty: '4.6s', engine: '3.0L 9A2 twin-turbo flat-six',    curb_weight_lb: '3,131 lb', top_speed_mph: '183 mph', redline_rpm: '7,500 rpm' },
  '991.2:carrera_t':    { hp: '370 hp', torque: '331 lb-ft', zero_to_sixty: '4.4s', engine: '3.0L 9A2 twin-turbo flat-six',    curb_weight_lb: '3,064 lb', top_speed_mph: '183 mph', redline_rpm: '7,500 rpm' },
  '991.2:gt3_touring':  { hp: '500 hp', torque: '339 lb-ft', zero_to_sixty: '3.4s', engine: '4.0L NA flat-six (6MT only)',     curb_weight_lb: '3,064 lb', top_speed_mph: '198 mph', redline_rpm: '9,000 rpm' },

  // 992.1 (MY2020–2023) — DB generation_id matches after split migration
  '992.1:turbo_s':   { hp: '640 hp', torque: '590 lb-ft', zero_to_sixty: '2.7s', engine: '3.8L twin-turbo flat-six',           curb_weight_lb: '3,725 lb', top_speed_mph: '205 mph', redline_rpm: '7,000 rpm' },
  '992.1:turbo':     { hp: '572 hp', torque: '553 lb-ft', zero_to_sixty: '2.8s', engine: '3.8L twin-turbo flat-six',           curb_weight_lb: '3,638 lb', top_speed_mph: '198 mph', redline_rpm: '7,000 rpm' },
  '992.1:gt3_rs':    { hp: '518 hp', torque: '346 lb-ft', zero_to_sixty: '3.0s', engine: '4.0L flat-six',                      curb_weight_lb: '3,373 lb', top_speed_mph: '184 mph', redline_rpm: '9,000 rpm' },
  '992.1:gt3':       { hp: '502 hp', torque: '347 lb-ft', zero_to_sixty: '3.4s', engine: '4.0L flat-six',                      curb_weight_lb: '3,263 lb', top_speed_mph: '198 mph', redline_rpm: '9,000 rpm' },
  '992.1:gts':       { hp: '473 hp', torque: '420 lb-ft', zero_to_sixty: '3.5s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,373 lb', top_speed_mph: '193 mph', redline_rpm: '7,500 rpm' },
  '992.1:carrera_4s':{ hp: '443 hp', torque: '390 lb-ft', zero_to_sixty: '3.8s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,505 lb', top_speed_mph: '190 mph', redline_rpm: '7,500 rpm' },
  '992.1:carrera_s': { hp: '443 hp', torque: '390 lb-ft', zero_to_sixty: '3.8s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,417 lb', top_speed_mph: '191 mph', redline_rpm: '7,500 rpm' },
  '992.1:targa_4s':  { hp: '443 hp', torque: '390 lb-ft', zero_to_sixty: '3.9s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,549 lb', top_speed_mph: '188 mph', redline_rpm: '7,500 rpm' },
  '992.1:carrera_4': { hp: '379 hp', torque: '331 lb-ft', zero_to_sixty: '4.2s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,461 lb', top_speed_mph: '182 mph', redline_rpm: '7,500 rpm' },
  '992.1:targa_4':   { hp: '379 hp', torque: '331 lb-ft', zero_to_sixty: '4.2s', engine: '3.0L twin-turbo flat-six',           curb_weight_lb: '3,527 lb', top_speed_mph: '181 mph', redline_rpm: '7,500 rpm' },
  '992.1:carrera':       { hp: '379 hp', torque: '331 lb-ft', zero_to_sixty: '4.2s', engine: '3.0L 9A2 Evo twin-turbo flat-six', curb_weight_lb: '3,351 lb', top_speed_mph: '182 mph', redline_rpm: '7,500 rpm' },
  '992.1:carrera_t':     { hp: '379 hp', torque: '331 lb-ft', zero_to_sixty: '4.2s', engine: '3.0L 9A2 Evo twin-turbo flat-six', curb_weight_lb: '3,263 lb', top_speed_mph: '182 mph', redline_rpm: '7,500 rpm' },
  '992.1:gt3_touring':   { hp: '502 hp', torque: '347 lb-ft', zero_to_sixty: '3.4s', engine: '4.0L NA flat-six',               curb_weight_lb: '3,263 lb', top_speed_mph: '198 mph', redline_rpm: '9,000 rpm' },
  '992.1:targa_4_gts':   { hp: '473 hp', torque: '420 lb-ft', zero_to_sixty: '3.6s', engine: '2.9L twin-turbo flat-six',       curb_weight_lb: '3,549 lb', top_speed_mph: '188 mph', redline_rpm: '7,500 rpm' },
  '992.1:sport_classic': { hp: '543 hp', torque: '442 lb-ft', zero_to_sixty: '3.5s', engine: '3.7L 9A2 Evo twin-turbo flat-six (7MT, wide-body)', curb_weight_lb: '3,373 lb', top_speed_mph: '196 mph', redline_rpm: '7,000 rpm' },
  '992.1:dakar':         { hp: '473 hp', torque: '420 lb-ft', zero_to_sixty: '3.5s', engine: '3.0L 9A2 Evo twin-turbo flat-six', curb_weight_lb: '3,527 lb', top_speed_mph: '150 mph', redline_rpm: '7,500 rpm' },
  '992.1:st':            { hp: '525 hp', torque: '347 lb-ft', zero_to_sixty: '3.2s', engine: '4.0L NA flat-six (GT3 RS engine, 6MT short-ratio)', curb_weight_lb: '3,263 lb', top_speed_mph: '193 mph', redline_rpm: '9,000 rpm' },

  // 992.2 (MY2024–present) — T-Hybrid refresh
  '992.2:turbo_s':    { hp: '701 hp', torque: '590 lb-ft', zero_to_sixty: '2.5s', engine: '3.8L twin-turbo flat-six',          curb_weight_lb: '3,793 lb', top_speed_mph: '210 mph', redline_rpm: '7,000 rpm' },
  '992.2:turbo':      { hp: '640 hp', torque: '590 lb-ft', zero_to_sixty: '2.7s', engine: '3.8L twin-turbo flat-six',          curb_weight_lb: '3,725 lb', top_speed_mph: '198 mph', redline_rpm: '7,000 rpm' },
  '992.2:gt3_rs':     { hp: '525 hp', torque: '346 lb-ft', zero_to_sixty: '3.0s', engine: '4.0L flat-six',                     curb_weight_lb: '3,417 lb', top_speed_mph: '184 mph', redline_rpm: '9,000 rpm' },
  '992.2:gt3':        { hp: '502 hp', torque: '347 lb-ft', zero_to_sixty: '3.4s', engine: '4.0L flat-six',                     curb_weight_lb: '3,307 lb', top_speed_mph: '198 mph', redline_rpm: '9,000 rpm' },
  '992.2:gts':        { hp: '541 hp', torque: '449 lb-ft', zero_to_sixty: '3.1s', engine: '3.6L 9A3 T-Hybrid flat-six',        curb_weight_lb: '3,417 lb', top_speed_mph: '193 mph', redline_rpm: '7,500 rpm' },
  '992.2:carrera_4s': { hp: '473 hp', torque: '390 lb-ft', zero_to_sixty: '3.8s', engine: '3.0L 9A2 Evo twin-turbo flat-six', curb_weight_lb: '3,527 lb', top_speed_mph: '190 mph', redline_rpm: '7,500 rpm' },
  '992.2:carrera_s':  { hp: '473 hp', torque: '390 lb-ft', zero_to_sixty: '3.8s', engine: '3.0L 9A2 Evo twin-turbo flat-six', curb_weight_lb: '3,461 lb', top_speed_mph: '191 mph', redline_rpm: '7,500 rpm' },
  '992.2:carrera_4':  { hp: '388 hp', torque: '331 lb-ft', zero_to_sixty: '4.2s', engine: '3.0L 9A2 Evo twin-turbo flat-six', curb_weight_lb: '3,505 lb', top_speed_mph: '182 mph', redline_rpm: '7,500 rpm' },
  '992.2:carrera':       { hp: '388 hp', torque: '331 lb-ft', zero_to_sixty: '4.2s', engine: '3.0L 9A2 Evo twin-turbo flat-six', curb_weight_lb: '3,373 lb', top_speed_mph: '182 mph', redline_rpm: '7,500 rpm' },
  '992.2:carrera_t':     { hp: '388 hp', torque: '331 lb-ft', zero_to_sixty: '4.2s', engine: '3.0L 9A2 Evo twin-turbo flat-six (7MT only)', curb_weight_lb: '3,263 lb', top_speed_mph: '182 mph', redline_rpm: '7,500 rpm' },
  '992.2:targa_4s':      { hp: '473 hp', torque: '390 lb-ft', zero_to_sixty: '3.8s', engine: '3.0L 9A2 Evo twin-turbo flat-six', curb_weight_lb: '3,527 lb', top_speed_mph: '188 mph', redline_rpm: '7,500 rpm' },
  '992.2:targa_4_gts':   { hp: '541 hp', torque: '449 lb-ft', zero_to_sixty: '3.2s', engine: '3.6L 9A3 T-Hybrid flat-six',    curb_weight_lb: '3,571 lb', top_speed_mph: '190 mph', redline_rpm: '7,500 rpm' },
  '992.2:gt3_touring':   { hp: '503 hp', torque: '347 lb-ft', zero_to_sixty: '3.4s', engine: '4.0L NA flat-six',               curb_weight_lb: '3,307 lb', top_speed_mph: '198 mph', redline_rpm: '9,000 rpm' },

  // 911-pre-a (1964 O-series launch cars — aluminum crankcase, Solex/Weber 2.0L)
  '911-pre-a:901':  { hp: '130 hp', torque: '128 lb-ft', zero_to_sixty: '9.1s', engine: '2.0L Type 901/01 flat-six (Solex 40PI carbs, aluminum case)',                              curb_weight_lb: '2,094 lb', top_speed_mph: '130 mph', redline_rpm: '6,200 rpm' },
  '911-pre-a:911':  { hp: '130 hp', torque: '128 lb-ft', zero_to_sixty: '9.1s', engine: '2.0L Type 901/01 flat-six (Weber 40 IDA3C from Feb 1966, aluminum case)',                  curb_weight_lb: '2,094 lb', top_speed_mph: '130 mph', redline_rpm: '6,200 rpm' },

  // 911-f-body (1965–1973 long-hood — 2.0L / 2.2L / 2.4L / 2.7RS)
  // Catch-all entries (no displacement suffix) resolve to the 2.4L F-series as most-produced final year
  '911-f-body:s':                     { hp: '190 hp', torque: '159 lb-ft', zero_to_sixty: '6.6s',  engine: '2.4L Type 911/53 flat-six (Bosch MFI; Type 915 gearbox)',                                     curb_weight_lb: '2,271 lb', top_speed_mph: '144 mph', redline_rpm: '7,200 rpm' },
  '911-f-body:e':                     { hp: '165 hp', torque: '153 lb-ft', zero_to_sixty: '7.8s',  engine: '2.4L Type 911/52 flat-six (Bosch MFI; Type 915 gearbox)',                                     curb_weight_lb: '2,249 lb', top_speed_mph: '130 mph', redline_rpm: '6,200 rpm' },
  '911-f-body:t':                     { hp: '130 hp', torque: '144 lb-ft', zero_to_sixty: '9.0s',  engine: '2.4L Type 911/57 flat-six (carb RoW) / 911/91 (K-Jet US 1973.5)',                             curb_weight_lb: '2,249 lb', top_speed_mph: '125 mph', redline_rpm: '5,800 rpm' },
  // 2.0L variants (O/A/B-series, 1965–1969)
  '911-f-body:s_20':                  { hp: '160 hp', torque: '132 lb-ft', zero_to_sixty: '7.6s',  engine: '2.0L Type 901/02 flat-six (Weber 40 IDS; Bosch MFI B-series 170 hp)',                         curb_weight_lb: '2,116 lb', top_speed_mph: '131 mph', redline_rpm: '7,200 rpm' },
  '911-f-body:e_20':                  { hp: '140 hp', torque: '129 lb-ft', zero_to_sixty: '8.5s',  engine: '2.0L Type 901/09 flat-six (Bosch MFI)',                                                       curb_weight_lb: '2,094 lb', top_speed_mph: '119 mph', redline_rpm: '6,200 rpm' },
  '911-f-body:t_20':                  { hp: '110 hp', torque: '116 lb-ft', zero_to_sixty: '10.5s', engine: '2.0L Type 901/03 flat-six (Weber carbs)',                                                     curb_weight_lb: '2,094 lb', top_speed_mph: '112 mph', redline_rpm: '5,500 rpm' },
  '911-f-body:l':                     { hp: '130 hp', torque: '128 lb-ft', zero_to_sixty: '9.1s',  engine: '2.0L Type 901/06 / 901/14 flat-six (1968 MY only, US/RoW)',                                  curb_weight_lb: '2,094 lb', top_speed_mph: '119 mph', redline_rpm: '5,800 rpm' },
  // 2.2L variants (C/D-series MY1970–1971)
  '911-f-body:s_22':                  { hp: '180 hp', torque: '145 lb-ft', zero_to_sixty: '7.0s',  engine: '2.2L Type 911/02 flat-six (Bosch MFI)',                                                       curb_weight_lb: '2,182 lb', top_speed_mph: '137 mph', redline_rpm: '7,200 rpm' },
  '911-f-body:e_22':                  { hp: '155 hp', torque: '135 lb-ft', zero_to_sixty: '8.2s',  engine: '2.2L Type 911/01 flat-six (Bosch MFI)',                                                       curb_weight_lb: '2,138 lb', top_speed_mph: '125 mph', redline_rpm: '6,200 rpm' },
  '911-f-body:t_22':                  { hp: '125 hp', torque: '122 lb-ft', zero_to_sixty: '9.8s',  engine: '2.2L Type 911/03 flat-six (Weber carbs; Type 901 gearbox)',                                   curb_weight_lb: '2,116 lb', top_speed_mph: '119 mph', redline_rpm: '5,800 rpm' },
  // 2.4L variants (E/F-series MY1972–1973)
  '911-f-body:s_24':                  { hp: '190 hp', torque: '159 lb-ft', zero_to_sixty: '6.6s',  engine: '2.4L Type 911/53 flat-six (Bosch MFI; Type 915 gearbox)',                                     curb_weight_lb: '2,271 lb', top_speed_mph: '144 mph', redline_rpm: '7,200 rpm' },
  '911-f-body:e_24':                  { hp: '165 hp', torque: '153 lb-ft', zero_to_sixty: '7.8s',  engine: '2.4L Type 911/52 flat-six (Bosch MFI; Type 915 gearbox)',                                     curb_weight_lb: '2,249 lb', top_speed_mph: '130 mph', redline_rpm: '6,200 rpm' },
  '911-f-body:t_24':                  { hp: '130 hp', torque: '144 lb-ft', zero_to_sixty: '9.0s',  engine: '2.4L Type 911/57 flat-six (carb RoW) / 911/91 (K-Jet US 1973.5)',                             curb_weight_lb: '2,249 lb', top_speed_mph: '125 mph', redline_rpm: '5,800 rpm' },
  // 1973 Carrera RS 2.7
  '911-f-body:carrera_rs_27_sport':   { hp: '210 hp', torque: '188 lb-ft', zero_to_sixty: '5.8s',  engine: '2.7L Type 911/83 flat-six (Bosch MFI) — M471 Lightweight ~975 kg',                           curb_weight_lb: '2,149 lb', top_speed_mph: '149 mph', redline_rpm: '7,000 rpm' },
  '911-f-body:carrera_rs_27_touring': { hp: '210 hp', torque: '188 lb-ft', zero_to_sixty: '6.3s',  engine: '2.7L Type 911/83 flat-six (Bosch MFI) — M472 Touring ~1,075 kg',                             curb_weight_lb: '2,370 lb', top_speed_mph: '146 mph', redline_rpm: '7,000 rpm' },
  '911-f-body:carrera_rs':            { hp: '210 hp', torque: '188 lb-ft', zero_to_sixty: '6.3s',  engine: '2.7L Type 911/83 flat-six (Bosch MFI)',                                                       curb_weight_lb: '2,370 lb', top_speed_mph: '149 mph', redline_rpm: '7,000 rpm' },
  // 911 R (1967–1968, 24 cars)
  '911-f-body:r':                     { hp: '210 hp', torque: '152 lb-ft', zero_to_sixty: '6.1s',  engine: '2.0L Type 901/22 flat-six (Weber 46 IDA3C, twin-plug, titanium rods) ~810 kg',               curb_weight_lb: '1,786 lb', top_speed_mph: '137 mph', redline_rpm: '7,800 rpm' },

  // g-series-2.7 (1974–1977 G/H/I/J-series impact-bumper 911 — 2.7L K-Jet and 3.0L NA)
  // Catch-all 's' and base entries default to the 1974 launch-year specification
  'g-series-2.7:base':                { hp: '150 hp', torque: '127 lb-ft', zero_to_sixty: '9.5s',  engine: '2.7L Type 911/92 (RoW) / 911/93 (US) flat-six (K-Jet; MY1974–1975 only)',                    curb_weight_lb: '2,381 lb', top_speed_mph: '130 mph', redline_rpm: '5,700 rpm' },
  'g-series-2.7:s':                   { hp: '175 hp', torque: '152 lb-ft', zero_to_sixty: '7.8s',  engine: '2.7L Type 911/82 flat-six (K-Jet; 165 hp from MY1975 emissions detuning)',                    curb_weight_lb: '2,370 lb', top_speed_mph: '140 mph', redline_rpm: '6,200 rpm' },
  'g-series-2.7:lux':                 { hp: '165 hp', torque: '152 lb-ft', zero_to_sixty: '8.2s',  engine: '2.7L Type 911/81 flat-six (K-Jet; Euro/RoW name for 911 S from MY1976)',                      curb_weight_lb: '2,381 lb', top_speed_mph: '140 mph', redline_rpm: '6,100 rpm' },
  'g-series-2.7:carrera_27_mfi':      { hp: '207 hp', torque: '188 lb-ft', zero_to_sixty: '5.9s',  engine: '2.7L Type 911/83 flat-six (Bosch MFI — same engine as 1973 Carrera RS 2.7)',                  curb_weight_lb: '2,315 lb', top_speed_mph: '149 mph', redline_rpm: '6,200 rpm' },
  'g-series-2.7:carrera_27_kjet':     { hp: '175 hp', torque: '152 lb-ft', zero_to_sixty: '7.8s',  engine: '2.7L K-Jet flat-six (US-spec wide-arch Carrera; 911 S drivetrain)',                           curb_weight_lb: '2,645 lb', top_speed_mph: '133 mph', redline_rpm: '5,700 rpm' },
  'g-series-2.7:carrera_30':          { hp: '200 hp', torque: '188 lb-ft', zero_to_sixty: '6.3s',  engine: '3.0L Type 930/02 flat-six (K-Jet NA; Euro/RoW only MY1976–1977)',                             curb_weight_lb: '2,425 lb', top_speed_mph: '149 mph', redline_rpm: '6,100 rpm' },
  'g-series-2.7:silver_anniversary':  { hp: '165 hp', torque: '152 lb-ft', zero_to_sixty: '8.2s',  engine: '2.7L Type 911/82 flat-six (K-Jet — same as MY1975 H-series 911 S)',                           curb_weight_lb: '2,381 lb', top_speed_mph: '140 mph', redline_rpm: '6,100 rpm' },
  // Catch-all 'carrera' resolves to MFI as the highest-value configuration; confirm via engine code
  'g-series-2.7:carrera':             { hp: '207 hp', torque: '188 lb-ft', zero_to_sixty: '5.9s',  engine: '2.7L Type 911/83 flat-six (Bosch MFI) — verify MFI vs K-Jet via engine code',                 curb_weight_lb: '2,315 lb', top_speed_mph: '149 mph', redline_rpm: '6,200 rpm' },

  // 911-sc (1978–1983 — 3.0L aluminum-case K-Jet, all bodies)
  '911-sc:sc':                        { hp: '180 hp', torque: '175 lb-ft', zero_to_sixty: '6.8s',  engine: '3.0L Type 930/03 (US) / 930/02 (RoW) flat-six (K-Jet, aluminum case)',                        curb_weight_lb: '2,558 lb', top_speed_mph: '141 mph', redline_rpm: '5,900 rpm' },
  '911-sc:cabriolet':                 { hp: '180 hp', torque: '175 lb-ft', zero_to_sixty: '6.9s',  engine: '3.0L Type 930/04 (US CA) flat-six (K-Jet) — MY1983 only',                                    curb_weight_lb: '2,580 lb', top_speed_mph: '141 mph', redline_rpm: '5,900 rpm' },
  '911-sc:sc_rs':                     { hp: '255 hp', torque: '210 lb-ft', zero_to_sixty: '5.2s',  engine: '3.0L Type 930/18 flat-six (Kugelfischer mech. injection) — 21 Group B homologation cars',      curb_weight_lb: '2,315 lb', top_speed_mph: '155 mph', redline_rpm: '7,000 rpm' },

  // 356-pre-a (1948–1955) — all DIN hp; torque and 0–60 are period road-test estimates
  '356-pre-a:gmund':       { hp: '40 hp',  torque: '54 lb-ft',  zero_to_sixty: '19.5s', engine: '1.1L Type 369 flat-four (VW-derived)',                curb_weight_lb: '1,344 lb', top_speed_mph: '87 mph',  redline_rpm: '4,200 rpm' },
  '356-pre-a:1100':        { hp: '40 hp',  torque: '54 lb-ft',  zero_to_sixty: '19.5s', engine: '1.1L Type 369 flat-four',                            curb_weight_lb: '1,432 lb', top_speed_mph: '87 mph',  redline_rpm: '4,200 rpm' },
  '356-pre-a:1300':        { hp: '44 hp',  torque: '60 lb-ft',  zero_to_sixty: '17.0s', engine: '1.3L Type 506 flat-four',                            curb_weight_lb: '1,499 lb', top_speed_mph: '90 mph',  redline_rpm: '4,400 rpm' },
  '356-pre-a:1500':        { hp: '55 hp',  torque: '71 lb-ft',  zero_to_sixty: '14.5s', engine: '1.5L Type 527 flat-four',                            curb_weight_lb: '1,609 lb', top_speed_mph: '95 mph',  redline_rpm: '4,500 rpm' },
  '356-pre-a:1500_super':  { hp: '70 hp',  torque: '75 lb-ft',  zero_to_sixty: '12.5s', engine: '1.5L Type 528 Super flat-four',                      curb_weight_lb: '1,609 lb', top_speed_mph: '103 mph', redline_rpm: '5,000 rpm' },
  '356-pre-a:carrera':     { hp: '100 hp', torque: '84 lb-ft',  zero_to_sixty: '10.5s', engine: '1.5L Type 547 GS Carrera four-cam',                  curb_weight_lb: '1,654 lb', top_speed_mph: '115 mph', redline_rpm: '6,800 rpm' },

  // 356a (1955–1959)
  '356a:1300':             { hp: '44 hp',  torque: '60 lb-ft',  zero_to_sixty: '17.0s', engine: '1.3L Type 506A flat-four',                           curb_weight_lb: '1,499 lb', top_speed_mph: '90 mph',  redline_rpm: '4,400 rpm' },
  '356a:1600':             { hp: '60 hp',  torque: '73 lb-ft',  zero_to_sixty: '14.0s', engine: '1.6L Type 616/1 flat-four',                          curb_weight_lb: '1,609 lb', top_speed_mph: '95 mph',  redline_rpm: '4,500 rpm' },
  '356a:1600_super':       { hp: '75 hp',  torque: '83 lb-ft',  zero_to_sixty: '12.5s', engine: '1.6L Type 616/2 Super flat-four',                    curb_weight_lb: '1,609 lb', top_speed_mph: '103 mph', redline_rpm: '5,000 rpm' },
  '356a:speedster':        { hp: '60 hp',  torque: '73 lb-ft',  zero_to_sixty: '13.5s', engine: '1.6L Type 616/1 flat-four (lighter Speedster body)', curb_weight_lb: '1,565 lb', top_speed_mph: '99 mph',  redline_rpm: '4,500 rpm' },
  '356a:carrera':          { hp: '100 hp', torque: '84 lb-ft',  zero_to_sixty: '11.0s', engine: '1.5L Type 547/1 GS Carrera four-cam',                curb_weight_lb: '1,654 lb', top_speed_mph: '115 mph', redline_rpm: '6,800 rpm' },

  // 356b (1959–1963) — T5 and T6 bodies
  '356b:1600':             { hp: '60 hp',  torque: '73 lb-ft',  zero_to_sixty: '14.0s', engine: '1.6L Type 616/1 flat-four',                          curb_weight_lb: '1,720 lb', top_speed_mph: '95 mph',  redline_rpm: '4,500 rpm' },
  '356b:1600_s':           { hp: '75 hp',  torque: '83 lb-ft',  zero_to_sixty: '12.5s', engine: '1.6L Type 616/2 Super flat-four',                    curb_weight_lb: '1,720 lb', top_speed_mph: '103 mph', redline_rpm: '5,000 rpm' },
  '356b:1600_s90':         { hp: '90 hp',  torque: '82 lb-ft',  zero_to_sixty: '11.0s', engine: '1.6L Type 616/7 Super 90 flat-four',                 curb_weight_lb: '1,742 lb', top_speed_mph: '109 mph', redline_rpm: '5,500 rpm' },
  '356b:carrera_2':        { hp: '130 hp', torque: '107 lb-ft', zero_to_sixty: '9.5s',  engine: '2.0L Type 587/1 Carrera 2 four-cam',                 curb_weight_lb: '1,808 lb', top_speed_mph: '125 mph', redline_rpm: '6,200 rpm' },

  // 356c (1963–1965)
  '356c:1600_c':           { hp: '75 hp',  torque: '80 lb-ft',  zero_to_sixty: '13.0s', engine: '1.6L Type 616/15 C flat-four',                       curb_weight_lb: '1,764 lb', top_speed_mph: '99 mph',  redline_rpm: '4,500 rpm' },
  '356c:1600_sc':          { hp: '95 hp',  torque: '87 lb-ft',  zero_to_sixty: '11.0s', engine: '1.6L Type 616/16 SC flat-four',                      curb_weight_lb: '1,764 lb', top_speed_mph: '110 mph', redline_rpm: '5,500 rpm' },
  '356c:carrera_2':        { hp: '130 hp', torque: '107 lb-ft', zero_to_sixty: '9.5s',  engine: '2.0L Type 587/1 Carrera 2 four-cam',                 curb_weight_lb: '1,808 lb', top_speed_mph: '125 mph', redline_rpm: '6,200 rpm' },

  // 986 (Boxster 986, 1997–2004)
  '986:550_spyder': { hp: '264 hp', torque: '221 lb-ft', zero_to_sixty: '5.5s', engine: '3.2L M96/21 flat-six (MY2004 special edition — 1,953 units)',                                                      curb_weight_lb: '2,888 lb', top_speed_mph: '155 mph', redline_rpm: '6,800 rpm' },
  '986:s':          { hp: '258 hp', torque: '213 lb-ft', zero_to_sixty: '5.7s', engine: '3.2L M96/21 flat-six (MY2000–2004 Boxster S)',                                                                     curb_weight_lb: '2,867 lb', top_speed_mph: '155 mph', redline_rpm: '6,800 rpm' },
  '986:base':       { hp: '228 hp', torque: '177 lb-ft', zero_to_sixty: '6.4s', engine: '2.7L M96/22 flat-six (MY2000–2004 base; 217 hp MY2000–2002)',                                                      curb_weight_lb: '2,756 lb', top_speed_mph: '149 mph', redline_rpm: '6,800 rpm' },
  '986:base_25':    { hp: '201 hp', torque: '181 lb-ft', zero_to_sixty: '6.9s', engine: '2.5L M96/20 flat-six (MY1997–1999 original spec)',                                                                 curb_weight_lb: '2,734 lb', top_speed_mph: '140 mph', redline_rpm: '6,800 rpm' },

  // 987.1-boxster (Boxster 987.1, 2005–2008)
  // s_early = MY2005–2006 (3.2L M96/26, 280 hp); s = MY2007–2008 (3.4L M97/21, 295 hp, VarioCam Plus)
  '987.1-boxster:rs_60_spyder': { hp: '303 hp', torque: '251 lb-ft', zero_to_sixty: '5.1s', engine: '3.4L M97/21 flat-six (MY2008, 1,960 units, ECU remap)',        curb_weight_lb: '2,866 lb', top_speed_mph: '162 mph', redline_rpm: '6,800 rpm' },
  '987.1-boxster:s':            { hp: '295 hp', torque: '251 lb-ft', zero_to_sixty: '5.2s', engine: '3.4L M97/21 flat-six (VarioCam Plus, MY2007–2008)',             curb_weight_lb: '2,888 lb', top_speed_mph: '162 mph', redline_rpm: '6,800 rpm' },
  '987.1-boxster:s_early':      { hp: '280 hp', torque: '236 lb-ft', zero_to_sixty: '5.4s', engine: '3.2L M96/26 flat-six (MY2005–2006, pre-VarioCam Plus)',         curb_weight_lb: '2,888 lb', top_speed_mph: '159 mph', redline_rpm: '6,800 rpm' },
  '987.1-boxster:base':         { hp: '240 hp', torque: '199 lb-ft', zero_to_sixty: '6.0s', engine: '2.7L M96/25 flat-six',                                          curb_weight_lb: '2,822 lb', top_speed_mph: '155 mph', redline_rpm: '6,800 rpm' },

  // 987.1-cayman (Cayman 987.1, 2006–2008)
  '987.1-cayman:s_sport':          { hp: '303 hp', torque: '251 lb-ft', zero_to_sixty: '5.0s', engine: '3.4L M97/21 flat-six (MY2008, ECU remap, PASM standard — ~700 worldwide, ~100 US)', curb_weight_lb: '2,866 lb', top_speed_mph: '165 mph', redline_rpm: '7,200 rpm' },
  '987.1-cayman:design_edition_1': { hp: '295 hp', torque: '251 lb-ft', zero_to_sixty: '5.1s', engine: '3.4L M97/21 flat-six (MY2008 appearance edition — ~770 worldwide, ~240 US)',        curb_weight_lb: '2,888 lb', top_speed_mph: '165 mph', redline_rpm: '7,200 rpm' },
  '987.1-cayman:s':                { hp: '295 hp', torque: '251 lb-ft', zero_to_sixty: '5.1s', engine: '3.4L M97/21 flat-six (VarioCam Plus)',                                                curb_weight_lb: '2,888 lb', top_speed_mph: '165 mph', redline_rpm: '7,200 rpm' },
  '987.1-cayman:base':             { hp: '245 hp', torque: '199 lb-ft', zero_to_sixty: '5.9s', engine: '2.7L M96 flat-six (MY2007–2008)',                                                    curb_weight_lb: '2,866 lb', top_speed_mph: '149 mph', redline_rpm: '6,800 rpm' },

  // 987.2-boxster (Boxster 987.2, 2009–2012)
  '987.2-boxster:spyder':           { hp: '320 hp', torque: '273 lb-ft', zero_to_sixty: '5.1s', engine: '3.4L 9A1 flat-six (manual canvas top, aluminum doors/decklid)',                       curb_weight_lb: '2,734 lb', top_speed_mph: '166 mph', redline_rpm: '7,200 rpm' },
  '987.2-boxster:black_edition':    { hp: '320 hp', torque: '266 lb-ft', zero_to_sixty: '5.1s', engine: '3.4L 9A1 flat-six (MY2011, ~990 units, ECU remap +10 hp)',                            curb_weight_lb: '2,866 lb', top_speed_mph: '166 mph', redline_rpm: '7,200 rpm' },
  '987.2-boxster:porsche_design_2': { hp: '310 hp', torque: '266 lb-ft', zero_to_sixty: '5.1s', engine: '3.4L 9A1 flat-six (MY2009, Carrara White, 250–500 units worldwide)',                  curb_weight_lb: '2,866 lb', top_speed_mph: '162 mph', redline_rpm: '7,200 rpm' },
  '987.2-boxster:s':                { hp: '310 hp', torque: '266 lb-ft', zero_to_sixty: '5.1s', engine: '3.4L 9A1 flat-six',                                                                   curb_weight_lb: '2,866 lb', top_speed_mph: '162 mph', redline_rpm: '7,200 rpm' },
  '987.2-boxster:base':             { hp: '255 hp', torque: '207 lb-ft', zero_to_sixty: '5.9s', engine: '2.9L 9A1 flat-six',                                                                   curb_weight_lb: '2,822 lb', top_speed_mph: '155 mph', redline_rpm: '7,200 rpm' },

  // 987.2-cayman (Cayman 987.2, 2009–2012)
  '987.2-cayman:r':            { hp: '330 hp', torque: '273 lb-ft', zero_to_sixty: '4.7s', engine: '3.4L 9A1 flat-six (MY2012, manual only, aluminum doors/decklid, mech LSD, ~55 kg lighter)', curb_weight_lb: '2,690 lb', top_speed_mph: '171 mph', redline_rpm: '7,400 rpm' },
  '987.2-cayman:black_edition': { hp: '330 hp', torque: '273 lb-ft', zero_to_sixty: '5.0s', engine: '3.4L 9A1 flat-six (MY2012 final-run — ~500 US, manual or PDK)',                            curb_weight_lb: '2,844 lb', top_speed_mph: '168 mph', redline_rpm: '7,400 rpm' },
  '987.2-cayman:s':            { hp: '320 hp', torque: '273 lb-ft', zero_to_sixty: '5.0s', engine: '3.4L 9A1 flat-six',                                                                          curb_weight_lb: '2,844 lb', top_speed_mph: '168 mph', redline_rpm: '7,400 rpm' },
  '987.2-cayman:base':         { hp: '265 hp', torque: '221 lb-ft', zero_to_sixty: '5.8s', engine: '2.9L 9A1 flat-six',                                                                          curb_weight_lb: '2,778 lb', top_speed_mph: '162 mph', redline_rpm: '7,200 rpm' },

  // 981-boxster (Boxster 981, 2012–2016)
  '981-boxster:spyder':{ hp: '375 hp', torque: '310 lb-ft', zero_to_sixty: '4.5s', engine: '3.8L flat-six',    curb_weight_lb: '2,712 lb', top_speed_mph: '166 mph', redline_rpm: '7,400 rpm' },
  '981-boxster:gts':   { hp: '330 hp', torque: '273 lb-ft', zero_to_sixty: '4.5s', engine: '3.4L flat-six',    curb_weight_lb: '2,800 lb', top_speed_mph: '163 mph', redline_rpm: '7,400 rpm' },
  '981-boxster:s':     { hp: '315 hp', torque: '266 lb-ft', zero_to_sixty: '4.7s', engine: '3.4L flat-six',    curb_weight_lb: '2,822 lb', top_speed_mph: '164 mph', redline_rpm: '7,400 rpm' },
  '981-boxster:base':  { hp: '265 hp', torque: '206 lb-ft', zero_to_sixty: '5.5s', engine: '2.7L flat-six',    curb_weight_lb: '2,811 lb', top_speed_mph: '155 mph', redline_rpm: '7,400 rpm' },

  // 981-cayman (Cayman 981, 2013–2016)
  '981-cayman:gt4':          { hp: '385 hp', torque: '310 lb-ft', zero_to_sixty: '4.2s', engine: '3.8L flat-six (991.1 Carrera S engine, 991 GT3 brakes/suspension, manual only)', curb_weight_lb: '3,009 lb', top_speed_mph: '183 mph', redline_rpm: '7,800 rpm' },
  '981-cayman:gts':          { hp: '340 hp', torque: '280 lb-ft', zero_to_sixty: '4.4s', engine: '3.4L flat-six (MY2015–2016, Sport Chrono + PASM standard)',                       curb_weight_lb: '2,910 lb', top_speed_mph: '174 mph', redline_rpm: '7,400 rpm' },
  '981-cayman:black_edition': { hp: '275 hp', torque: '213 lb-ft', zero_to_sixty: '5.3s', engine: '2.7L 9A1 NA flat-six (MY2015 appearance package)',                              curb_weight_lb: '2,933 lb', top_speed_mph: '165 mph', redline_rpm: '7,400 rpm' },
  '981-cayman:s':            { hp: '325 hp', torque: '273 lb-ft', zero_to_sixty: '4.6s', engine: '3.4L flat-six',                                                                   curb_weight_lb: '2,866 lb', top_speed_mph: '174 mph', redline_rpm: '7,400 rpm' },
  '981-cayman:base':         { hp: '275 hp', torque: '213 lb-ft', zero_to_sixty: '5.3s', engine: '2.7L flat-six',                                                                   curb_weight_lb: '2,844 lb', top_speed_mph: '165 mph', redline_rpm: '7,400 rpm' },

  // 982-boxster (718 Boxster 982, 2017–2024; ICE ended October 2025)
  // spyder_rs = MY2024 (992 GT3 engine, PDK only); spyder = MY2020–2023 (manual or PDK)
  '982-boxster:spyder_rs': { hp: '500 hp', torque: '309 lb-ft', zero_to_sixty: '3.4s', engine: '4.0L NA flat-six (992 GT3 engine, PDK only, MY2024)',                curb_weight_lb: '3,131 lb', top_speed_mph: '184 mph', redline_rpm: '9,000 rpm' },
  '982-boxster:spyder':    { hp: '414 hp', torque: '309 lb-ft', zero_to_sixty: '4.0s', engine: '4.0L NA flat-six (6MT or PDK, MY2020–2023)',                         curb_weight_lb: '3,119 lb', top_speed_mph: '180 mph', redline_rpm: '8,000 rpm' },
  '982-boxster:gts_40':    { hp: '394 hp', torque: '309 lb-ft', zero_to_sixty: '4.2s', engine: '4.0L NA flat-six (MY2020+, 991.2 GT3-derived)',                      curb_weight_lb: '3,131 lb', top_speed_mph: '178 mph', redline_rpm: '8,000 rpm' },
  '982-boxster:gts':       { hp: '365 hp', torque: '317 lb-ft', zero_to_sixty: '4.0s', engine: '2.5L flat-four turbo (MY2018–2019 flat-four GTS)',                   curb_weight_lb: '3,153 lb', top_speed_mph: '174 mph', redline_rpm: '6,500 rpm' },
  '982-boxster:s':         { hp: '350 hp', torque: '309 lb-ft', zero_to_sixty: '4.4s', engine: '2.5L flat-four turbo',                                               curb_weight_lb: '3,131 lb', top_speed_mph: '170 mph', redline_rpm: '6,500 rpm' },
  '982-boxster:base':      { hp: '300 hp', torque: '280 lb-ft', zero_to_sixty: '4.9s', engine: '2.0L flat-four turbo',                                               curb_weight_lb: '3,075 lb', top_speed_mph: '163 mph', redline_rpm: '6,500 rpm' },

  // 982-cayman (718 Cayman 982, 2017–2025; ICE ended October 2025)
  '982-cayman:gt4_rs_weissach': { hp: '493 hp', torque: '309 lb-ft', zero_to_sixty: '3.4s', engine: '4.0L flat-six (992 GT3-derived, 9,000 rpm — Weissach: magnesium wheels, titanium exhaust, CFRP panels)', curb_weight_lb: '3,042 lb', top_speed_mph: '196 mph', redline_rpm: '9,000 rpm' },
  '982-cayman:gt4_rs':          { hp: '493 hp', torque: '309 lb-ft', zero_to_sixty: '3.4s', engine: '4.0L NA flat-six (992 GT3-derived, individual throttle bodies, 9,000 rpm, PDK only)',                     curb_weight_lb: '3,064 lb', top_speed_mph: '196 mph', redline_rpm: '9,000 rpm' },
  '982-cayman:gt4':             { hp: '414 hp', torque: '309 lb-ft', zero_to_sixty: '4.4s', engine: '4.0L NA flat-six (MY2020–2023, 8,000 rpm, 6MT or PDK)',                                                   curb_weight_lb: '3,075 lb', top_speed_mph: '188 mph', redline_rpm: '8,000 rpm' },
  '982-cayman:gts_40':          { hp: '394 hp', torque: '309 lb-ft', zero_to_sixty: '4.2s', engine: '4.0L NA flat-six (MY2020+, 6MT or PDK)',                                                                  curb_weight_lb: '3,109 lb', top_speed_mph: '180 mph', redline_rpm: '8,000 rpm' },
  '982-cayman:style_edition':   { hp: '300 hp', torque: '280 lb-ft', zero_to_sixty: '4.9s', engine: '2.0L flat-four turbo (MY2023 appearance package)',                                                        curb_weight_lb: '3,086 lb', top_speed_mph: '165 mph', redline_rpm: '6,500 rpm' },
  '982-cayman:gts':             { hp: '365 hp', torque: '317 lb-ft', zero_to_sixty: '4.2s', engine: '2.5L flat-four turbo (MY2018–2019)',                                                                      curb_weight_lb: '3,153 lb', top_speed_mph: '177 mph', redline_rpm: '6,500 rpm' },
  '982-cayman:s':               { hp: '350 hp', torque: '309 lb-ft', zero_to_sixty: '4.4s', engine: '2.5L flat-four turbo VTG',                                                                               curb_weight_lb: '3,175 lb', top_speed_mph: '177 mph', redline_rpm: '6,500 rpm' },
  '982-cayman:base':            { hp: '300 hp', torque: '280 lb-ft', zero_to_sixty: '4.9s', engine: '2.0L flat-four turbo',                                                                                    curb_weight_lb: '3,086 lb', top_speed_mph: '168 mph', redline_rpm: '6,500 rpm' },

  // 911-3.2-carrera (1984–1989 G-body Carrera 3.2)
  // US power: 207 hp (1984-1986 Type 915) / 214-217 hp (1987-1989 G50). RoW: 231 hp all years.
  // Catch-all resolves to the G50 era as the more numerous and more traded specification.
  '911-3.2-carrera:speedster':            { hp: '217 hp', torque: '195 lb-ft', zero_to_sixty: '6.1s', engine: '3.2L Type 930/21 flat-six (Bosch Motronic, G50 5MT — 1989 only)',             curb_weight_lb: '2,822 lb', top_speed_mph: '155 mph', redline_rpm: '6,400 rpm' },
  '911-3.2-carrera:club_sport':           { hp: '217 hp', torque: '195 lb-ft', zero_to_sixty: '5.9s', engine: '3.2L Type 930/21 blueprinted flat-six (hollow valves, 6,840 rpm — G50 5MT)', curb_weight_lb: '2,712 lb', top_speed_mph: '149 mph', redline_rpm: '6,840 rpm' },
  '911-3.2-carrera:turbo_look':           { hp: '217 hp', torque: '195 lb-ft', zero_to_sixty: '6.1s', engine: '3.2L Type 930/21 flat-six (Bosch Motronic — M491 wide-body, G50 5MT)',        curb_weight_lb: '2,997 lb', top_speed_mph: '152 mph', redline_rpm: '6,400 rpm' },
  '911-3.2-carrera:carrera_g50':          { hp: '217 hp', torque: '195 lb-ft', zero_to_sixty: '6.1s', engine: '3.2L Type 930/21 flat-six (Bosch Motronic, G50 5MT — MY1987–1989)',           curb_weight_lb: '2,855 lb', top_speed_mph: '152 mph', redline_rpm: '6,400 rpm' },
  '911-3.2-carrera:carrera_915':          { hp: '207 hp', torque: '192 lb-ft', zero_to_sixty: '6.3s', engine: '3.2L Type 930/21 flat-six (Bosch Motronic, Type 915 5MT — MY1984–1986)',      curb_weight_lb: '2,822 lb', top_speed_mph: '149 mph', redline_rpm: '6,200 rpm' },
  '911-3.2-carrera:carrera':              { hp: '217 hp', torque: '195 lb-ft', zero_to_sixty: '6.1s', engine: '3.2L Type 930/21 flat-six (Bosch Motronic, G50 5MT)',                          curb_weight_lb: '2,855 lb', top_speed_mph: '152 mph', redline_rpm: '6,400 rpm' },

  // 930 (1975–1989 — 3.0L and 3.3L Turbo)
  // US power: 3.0L 234 hp (1976-1977); 3.3L 265 hp (US 1978-79); 282 hp (US 1986-89). RoW: 245 / 300 hp.
  // Catch-all resolves to the federalised 3.3L four-speed — the most common US trading specification.
  '930:turbo_g50':     { hp: '282 hp', torque: '288 lb-ft', zero_to_sixty: '5.1s', engine: '3.3L Type 930/68 flat-six (K-Jet, KKK turbo, G50/50 5MT — 1989 only)',  curb_weight_lb: '3,197 lb', top_speed_mph: '165 mph', redline_rpm: '6,200 rpm' },
  '930:turbo_30':      { hp: '234 hp', torque: '245 lb-ft', zero_to_sixty: '6.5s', engine: '3.0L Type 930/51 flat-six (K-Jet, KKK turbo, 4MT — US 1976–1977)',       curb_weight_lb: '2,833 lb', top_speed_mph: '155 mph', redline_rpm: '5,500 rpm' },
  '930:slantnose':     { hp: '282 hp', torque: '288 lb-ft', zero_to_sixty: '5.4s', engine: '3.3L Type 930/68 flat-six (K-Jet, KKK turbo — M505 Slantnose US spec)',   curb_weight_lb: '3,295 lb', top_speed_mph: '165 mph', redline_rpm: '6,200 rpm' },
  '930:cabriolet':     { hp: '282 hp', torque: '288 lb-ft', zero_to_sixty: '5.5s', engine: '3.3L Type 930/68 flat-six (K-Jet, KKK turbo — Cabriolet MY1987–1989)',    curb_weight_lb: '3,307 lb', top_speed_mph: '162 mph', redline_rpm: '6,200 rpm' },
  '930:targa':         { hp: '282 hp', torque: '288 lb-ft', zero_to_sixty: '5.5s', engine: '3.3L Type 930/68 flat-six (K-Jet, KKK turbo — Targa MY1987–1989)',        curb_weight_lb: '3,307 lb', top_speed_mph: '162 mph', redline_rpm: '6,200 rpm' },
  '930:turbo':         { hp: '282 hp', torque: '288 lb-ft', zero_to_sixty: '5.4s', engine: '3.3L Type 930/68 flat-six (K-Jet, KKK turbo, 4MT — US federalised)',      curb_weight_lb: '3,175 lb', top_speed_mph: '162 mph', redline_rpm: '5,750 rpm' },

  // 964 (1989–1994)
  // NA Carrera: 247 hp / 250 PS. Turbo 3.3: 320 hp. Turbo 3.6: 355 hp. Turbo S Leichtbau: 381 hp.
  '964:turbo_s_leichtbau': { hp: '381 hp', torque: '369 lb-ft', zero_to_sixty: '4.6s', engine: '3.3L M30/69 SL turbo flat-six (Weissach spec — 86 cars)',                                    curb_weight_lb: '2,954 lb', top_speed_mph: '174 mph', redline_rpm: '5,750 rpm' },
  '964:turbo_s':            { hp: '380 hp', torque: '369 lb-ft', zero_to_sixty: '4.7s', engine: '3.6L turbo flat-six X88 spec (Turbo 3.6 S Flachbau / Package — MY1994 Exclusiv)',           curb_weight_lb: '3,109 lb', top_speed_mph: '174 mph', redline_rpm: '5,750 rpm' },
  '964:turbo_36':           { hp: '355 hp', torque: '384 lb-ft', zero_to_sixty: '4.7s', engine: '3.6L M64-derived single-turbo flat-six (MY1993–1994)',                                      curb_weight_lb: '3,131 lb', top_speed_mph: '174 mph', redline_rpm: '5,750 rpm' },
  '964:turbo_33':           { hp: '320 hp', torque: '332 lb-ft', zero_to_sixty: '4.8s', engine: '3.3L Type 930/60 single-turbo flat-six (K-Jet — MY1991–1992)',                              curb_weight_lb: '3,197 lb', top_speed_mph: '162 mph', redline_rpm: '5,500 rpm' },
  '964:turbo':              { hp: '320 hp', torque: '332 lb-ft', zero_to_sixty: '4.8s', engine: '3.3L Type 930/60 single-turbo flat-six (K-Jet — catch-all, resolves to Turbo 3.3)',         curb_weight_lb: '3,197 lb', top_speed_mph: '162 mph', redline_rpm: '5,500 rpm' },
  '964:rs_38':              { hp: '300 hp', torque: '266 lb-ft', zero_to_sixty: '5.1s', engine: '3.8L M64/04 flat-six (Weissach hand-built, widebody — 55 cars MY1993)',                      curb_weight_lb: '2,601 lb', top_speed_mph: '174 mph', redline_rpm: '6,100 rpm' },
  '964:rs':                 { hp: '260 hp', torque: '240 lb-ft', zero_to_sixty: '5.4s', engine: '3.6L M64/03 flat-six (Lightweight / Touring M002 / N/GT M003 — Europe only MY1992)',         curb_weight_lb: '2,789 lb', top_speed_mph: '162 mph', redline_rpm: '6,100 rpm' },
  '964:rs_america':         { hp: '247 hp', torque: '228 lb-ft', zero_to_sixty: '5.7s', engine: '3.6L M64 flat-six (standard Carrera 2 spec — M030 suspension, whale-tail)',                  curb_weight_lb: '3,020 lb', top_speed_mph: '162 mph', redline_rpm: '5,900 rpm' },
  '964:carrera_4':          { hp: '247 hp', torque: '228 lb-ft', zero_to_sixty: '5.7s', engine: '3.6L M64 flat-six (AWD — electronically-controlled viscous centre diff)',                     curb_weight_lb: '3,175 lb', top_speed_mph: '162 mph', redline_rpm: '5,900 rpm' },
  '964:carrera_2':          { hp: '247 hp', torque: '228 lb-ft', zero_to_sixty: '5.7s', engine: '3.6L M64 flat-six (RWD — G50 5MT or Tiptronic 4AT)',                                        curb_weight_lb: '3,020 lb', top_speed_mph: '162 mph', redline_rpm: '5,900 rpm' },
  '964:speedster':          { hp: '247 hp', torque: '228 lb-ft', zero_to_sixty: '5.8s', engine: '3.6L M64 flat-six (Carrera 2 spec — steeply-raked windscreen, MY1993–1994)',                 curb_weight_lb: '3,042 lb', top_speed_mph: '162 mph', redline_rpm: '5,900 rpm' },
  '964:carrera':            { hp: '247 hp', torque: '228 lb-ft', zero_to_sixty: '5.7s', engine: '3.6L M64 flat-six (Carrera 2 RWD — catch-all)',                                              curb_weight_lb: '3,020 lb', top_speed_mph: '162 mph', redline_rpm: '5,900 rpm' },
}

function normalizeTrim(trim: string): string {
  return trim.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
}

export function lookupFactorySpecs(
  generationId: string | null | undefined,
  trim: string | null | undefined,
): FactorySpec | null {
  if (!generationId) return null

  const normalizedTrim = trim ? normalizeTrim(trim) : ''

  // Exact match
  const exactKey = `${generationId}:${normalizedTrim}`
  if (SPECS[exactKey]) return SPECS[exactKey]

  // Longest-prefix match with word-boundary enforcement:
  // stored trim must equal key trim OR start with keyTrim + '_'
  const genPrefix = `${generationId}:`
  let bestMatch: FactorySpec | null = null
  let bestLen = 0

  for (const key of Object.keys(SPECS)) {
    if (!key.startsWith(genPrefix)) continue
    const keyTrim = key.slice(genPrefix.length)
    if (normalizedTrim === keyTrim || normalizedTrim.startsWith(keyTrim + '_')) {
      if (keyTrim.length > bestLen) {
        bestMatch = SPECS[key]
        bestLen = keyTrim.length
      }
    }
  }

  return bestMatch
}
