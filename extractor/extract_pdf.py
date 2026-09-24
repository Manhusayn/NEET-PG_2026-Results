import sys
import re
import pymupdf


ROLL_PATTERN = re.compile(r"2666\d{7}")


def get_page_rolls(doc, page_index):
    text = doc[page_index].get_text("text")
    return ROLL_PATTERN.findall(text)


def get_result(pdf_path, roll_number):
    roll_number = str(roll_number).strip()

    if not re.fullmatch(r"2666\d{7}", roll_number):
        return {"error": "Invalid roll number"}

    target = int(roll_number)

    doc = pymupdf.open(pdf_path)

    low = 0
    high = len(doc) - 1

    while low <= high:
        mid = (low + high) // 2

        rolls = get_page_rolls(doc, mid)

        if not rolls:
            high = mid - 1
            continue

        first_roll = int(rolls[0])
        last_roll = int(rolls[-1])

        if target < first_roll:
            high = mid - 1

        elif target > last_roll:
            low = mid + 1

        else:
            # Roll number should be on this page.
            text = doc[mid].get_text("text")
            lines = [x.strip() for x in text.splitlines() if x.strip()]

            for i, line in enumerate(lines):
                if line == roll_number:
                    application = lines[i - 1]
                    score = lines[i + 1]
                    rank = lines[i + 2]

                    doc.close()

                    return {
                        "roll_number": roll_number,
                        "application_number": application,
                        "score": score,
                        "rank": rank,
                        "page": mid + 1
                    }

            doc.close()

            return {
                "error": "Roll number not found",
                "page": mid + 1
            }

    doc.close()

    return {
        "error": "Roll number not found"
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
