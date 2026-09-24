import sys
import re
import pymupdf

def get_result(pdf_path, roll_number):
    roll_number = str(roll_number).strip()

    if not re.fullmatch(r"266610\d{5}", roll_number):
        return {"error": "Invalid roll number"}

    serial = int(roll_number[-5:])
    page_index = (serial - 1) // 50

    doc = pymupdf.open(pdf_path)

    if page_index >= len(doc):
        doc.close()
        return {"error": "Roll number is outside the PDF"}

    text = doc[page_index].get_text("text")
    doc.close()

    lines = [x.strip() for x in text.splitlines() if x.strip()]

    for i, line in enumerate(lines):
        if line == roll_number:
            application = lines[i - 1]
            score = lines[i + 1]
            rank = lines[i + 2]

            if (
                re.fullmatch(r"PG\d+", application)
                and score.isdigit()
                and rank.isdigit()
            ):
                return {
                    "roll_number": roll_number,
                    "application_number": application,
                    "score": int(score),
                    "rank": int(rank),
                    "page": page_index + 1
                }

    return {
        "error": "Roll number not found",
        "page": page_index + 1
    }


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python extract_pdf.py NEET-PG.pdf ROLL_NUMBER")
        sys.exit(1)

    result = get_result(sys.argv[1], sys.argv[2])

    print()
    print("=" * 40)
    print("       NEET-PG 2026 RESULT")
    print("=" * 40)

    if "error" in result:
        print("Error       :", result["error"])
        if "page" in result:
            print("PDF Page    :", result["page"])
    else:
        print("Roll Number :", result["roll_number"])
        print("Application :", result["application_number"])
        print("Score       :", result["score"], "/ 720")
        print("Rank        :", result["rank"])
        print("PDF Page    :", result["page"])

    print("=" * 40)
