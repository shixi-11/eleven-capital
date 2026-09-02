# Brand and content rights

The MIT license applies to the website's code. Eleven Capital's name, logos,
company copy, and Shixi Lin's portrait are included for this official website
and remain the property of their respective rights holders. Their inclusion
does not grant permission to impersonate the company or reuse its identity.

- `public/assets/logo.png` and `favicon.png`: owner-supplied original logos.
- `public/assets/shixi-lin.jpg`: owner-supplied professional portrait, used
  without retouching or cropping. Portrait rights are reserved.
- `public/assets/hong-kong.png`: AI-generated architectural illustration for
  geographic atmosphere, created for this site. It is not documentary evidence
  of a specific property, office, or location operated by Eleven Capital.
- `public/assets/partners/`: six owner-supplied, unmodified partner logo files
  for ALUX, ConcurSys, Mineski, HOFAN, Xiaomi and Solaire. Logos link to the
  official URLs listed on the original website. Third-party names and trademarks
  belong to their respective owners and are excluded from the MIT license.

No private source directories, account credentials, design mockups, or original
website archives are included in the public repository.

## Web fonts

`public/assets/fonts/` contains self-hosted subsets derived from Noto Sans SC/TC
and Noto Serif SC/TC, plus Inter and Source Serif 4 for English. They are renamed
Eleven Sans/Serif SC/TC/Latin and remain under
the SIL Open Font License 1.1. Each source license is included beside the files.
The manifest records upstream sources, versions, hashes and covered characters.
System fallbacks are referenced by name only, not distributed.

After changing copy, build the HTML and use `scripts/prepare-fonts.py` with
`fonttools[woff]` and the licensed source fonts to refresh the subsets. Rebuild
afterward to include the updated WOFF2 assets. The production build uses the
checked-in font assets and does not need Python or a font service.

Partner artwork remains unmodified. CSS blend mode integrates white artwork
backgrounds into the site's paper color; no cropped or retouched logo is used.
