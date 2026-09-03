# Brand and content rights

The MIT license applies to the website's code. Eleven Capital's name, logos,
company copy, and Shixi Lin's portrait are included for this official website
and remain the property of their respective rights holders. Their inclusion
does not grant permission to impersonate the company or reuse its identity.

- `public/assets/logo.png` and `favicon.png`: owner-supplied original logos.
- `public/assets/favicon-tree.png`: unmodified evergreen tree emoji (U+1F332)
  from [Twemoji](https://github.com/jdecked/twemoji), artwork by Twitter, Inc.
  and other contributors, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  [Original PNG](https://raw.githubusercontent.com/jdecked/twemoji/main/assets/72x72/1f332.png);
  the license text is included as `public/assets/twemoji-LICENSE.txt`.
- `public/assets/favicon-christmas-tree.png`: unmodified Christmas tree emoji
  (U+1F384), the current browser tab icon, from the same Twemoji project under
  CC BY 4.0. [Original PNG](https://raw.githubusercontent.com/jdecked/twemoji/main/assets/72x72/1f384.png).
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

`public/assets/fonts/` contains self-hosted subsets derived from Noto Sans and
Noto Serif SC/TC/JP/KR, Inter and Source Serif 4 for English/French/German,
and Noto Sans Arabic and Noto Naskh Arabic for Arabic. They are renamed
Eleven Sans/Serif SC/TC/JP/KR/Latin/Arabic and remain under
the SIL Open Font License 1.1. Each source license is included beside the files.
The manifest records upstream sources, versions, hashes and covered characters.
System fallbacks are referenced by name only, not distributed.

After changing copy, build the HTML and use `scripts/prepare-fonts.py` with
`fonttools[woff]` and the licensed source fonts to refresh the subsets. Supply
the SC/TC/JP/KR variable fonts through `--source-dir` and Inter, Source Serif 4,
Noto Sans Arabic and Noto Naskh Arabic through `--latin-source-dir`. Subsets
follow each language group's actual copy and preserve shaping tables. Rebuild
afterward to include the updated WOFF2 assets. The production build uses the
checked-in font assets and does not need Python or a font service.

Partner artwork remains unmodified. All six original files are PNGs with real
alpha transparency and are displayed in a transparent container. White details
inside the ALUX and Xiaomi marks are part of their artwork and are preserved.
