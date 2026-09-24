# NEET-PG 2026 Result Finder

A tiny static website that searches a large PDF-derived result dataset.

## Architecture

PDF (33.66 MB)
  -> Python + PyMuPDF (run once)
  -> compressed JSON chunks
  -> Netlify static hosting
  -> browser fetches only the relevant chunk

The PDF itself is NOT deployed.

## 1. Install Python dependency

```bash
cd extractor
python -m venv .venv

# macOS/Linux
source .venv/bin/activate

# Windows
# .venv\Scripts\activate

pip install -r requirements.txt
```

## 2. Put your PDF somewhere

For example:

```text
project/
  neet_pg_2026.pdf
  extractor/
  site/
```

## 3. Extract the PDF

From the extractor directory:

```bash
python extract_pdf.py ../neet_pg_2026.pdf ../site/data
```

This creates:

```text
site/data/
  index.json
  chunk-0000.json
  chunk-0001.json
  ...
```

The website only downloads the chunk containing the requested roll number.

## 4. Test locally

From the project root:

```bash
python -m http.server 8000 --directory site
```

Open:

http://localhost:8000

Do not open index.html directly with file:// because browsers block some fetch requests.

## 5. Deploy to Netlify

Deploy the `site` folder as the publish directory.

If using Netlify CLI:

```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

For a production deployment:

```bash
netlify deploy --prod
```

When prompted, choose `site` as the publish directory.

## If extraction returns zero rows

Inspect a real page:

```bash
python extractor/inspect_page.py neet_pg_2026.pdf 1
```

If the text layout differs from the expected format, adjust ROW_RE in:

```text
extractor/extract_pdf.py
```

## Expected result

Searching:

```text
26661000013
```

should produce:

```text
Roll Number        26661000013
Application Number PG26215216
Score              514 / 720
NEET-PG Rank       8,434
```
