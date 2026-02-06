#!/usr/bin/env python3
"""Add review frontmatter block to all content pages under content/docs/.

Inserts a review block into existing YAML frontmatter:
  review:
    status: unreviewed
    method: []
    notes: ""
    date: ""

Skips:
- vetting-plan.md (the plan itself)
- review-progress.md (the dashboard)
- glossary.md (reference page, not reviewable content)
- Any file that already has a 'review:' key in frontmatter
"""

import os
import re
import sys

CONTENT_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), "content", "docs")

SKIP_FILES = {"vetting-plan.md", "review-progress.md", "glossary.md"}

REVIEW_BLOCK = """review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
"""

def process_file(filepath):
    """Add review frontmatter to a single file. Returns True if modified."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Must start with YAML frontmatter
    if not content.startswith("---"):
        print(f"  SKIP (no frontmatter): {filepath}")
        return False

    # Find the closing ---
    # The frontmatter is between the first --- and the next ---
    second_marker = content.index("---", 3)
    frontmatter = content[3:second_marker]

    # Check if review block already exists
    if "review:" in frontmatter:
        print(f"  SKIP (already has review): {filepath}")
        return False

    # Insert the review block before the closing ---
    # Ensure there's a newline before the review block
    if not frontmatter.endswith("\n"):
        frontmatter += "\n"

    new_content = "---" + frontmatter + REVIEW_BLOCK + "---" + content[second_marker + 3:]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True


def main():
    modified = 0
    skipped = 0
    errors = 0

    for dirpath, dirnames, filenames in os.walk(CONTENT_ROOT):
        for filename in filenames:
            if not filename.endswith(".md"):
                continue

            if filename in SKIP_FILES:
                print(f"  SKIP (excluded): {filename}")
                skipped += 1
                continue

            filepath = os.path.join(dirpath, filename)
            try:
                if process_file(filepath):
                    modified += 1
                else:
                    skipped += 1
            except Exception as e:
                print(f"  ERROR: {filepath}: {e}")
                errors += 1

    print(f"\nDone. Modified: {modified}, Skipped: {skipped}, Errors: {errors}")


if __name__ == "__main__":
    main()
