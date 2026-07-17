<!--
  Project README for the Mila marketing site.
  Covers local preview and Vercel deployment.
-->

# Mila — Landing page

Static marketing site for **Mila**, the skincare companion app by STELYA.

## Structure

```
frontend/           # Site root served by Vercel
  index.html        # Landing page
  privacy.html      # Privacy policy
  cgu.html          # Terms of use (CGU)
  css/ js/ assets/
vercel.json         # Vercel static hosting config
```

## Local preview

```bash
cd frontend
python3 -m http.server 8765
```

Open [http://127.0.0.1:8765](http://127.0.0.1:8765).

## Deploy on Vercel

1. Import this GitHub repository in [Vercel](https://vercel.com/new).
2. Framework Preset: **Other**.
3. Leave Install / Build commands empty (already set in `vercel.json`).
4. Output Directory: `frontend` (already set in `vercel.json`).
5. Deploy.

Legal pages will be available at:

- `/privacy` (or `/privacy.html`)
- `/cgu` (or `/cgu.html`)

## Notes

- No build step and no runtime dependencies.
- HTML / CSS / JS are strictly separated under `frontend/`.
