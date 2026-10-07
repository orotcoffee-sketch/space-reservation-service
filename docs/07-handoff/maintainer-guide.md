# Maintainer Guide

How a developer or Claude session should begin:

1. Read `PROJECT_STATUS.md`.
2. Read `CLAUDE.md`.
3. Identify the current phase.
4. Inspect the relevant architecture/contract document.
5. Reproduce the reported error.
6. Modify only the responsible layer.
7. Run verification.
8. Update status/documentation.

Do not solve a localized bug by rebuilding the entire application unless evidence demonstrates that the architecture itself is defective.
