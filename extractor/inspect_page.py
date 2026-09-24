import fitz
import sys

if len(sys.argv) != 3:
    print("Usage: python inspect_page.py RESULT.pdf PAGE_NUMBER")
    raise SystemExit(1)

pdf = fitz.open(sys.argv[1])
page_no = int(sys.argv[2])

text = pdf[page_no - 1].get_text("text")
print(text)
