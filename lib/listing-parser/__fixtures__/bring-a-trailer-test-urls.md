# BaT Parser Test URLs

Manual regression set for `lib/listing-parser/bring-a-trailer.ts`. Run each through the analyze page after parser changes; expected `listing_status` listed.

| URL | Expected status | Coverage |
|---|---|---|
| https://bringatrailer.com/listing/1971-porsche-911t-targa-60/ | live | Pre-1981 chassis (non-17-char), 911 |
| https://bringatrailer.com/listing/1988-porsche-911-carrera-coupe-89/ | (varies) | 17-char VIN, 911 coupe |
| https://bringatrailer.com/listing/1987-porsche-911-carrera-cabriolet/ | (varies) | 911 cabriolet body style |
| https://bringatrailer.com/listing/2024-porsche-718-cayman-gt4-rs-23/ | live | Modern (post-2010), non-911 Porsche |
| https://bringatrailer.com/listing/2009-porsche-cayman-46/ | sold | Sold auction, non-911 Porsche |
| https://bringatrailer.com/listing/2012-porsche-cayman-r-78/ | sold | No-reserve sold (regression case) |
| https://bringatrailer.com/listing/2001-ferrari-360-spider-89/ | no-sale | Reserve Not Met, non-Porsche (architecture validation) |

## Notes
- Status values can change as live auctions end. Verify against the actual BaT page before treating a status mismatch as a bug.
- "varies" entries: status was live when added, will eventually flip to sold/no-sale.