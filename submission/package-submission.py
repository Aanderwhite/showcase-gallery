"""Package source without secrets and collect currently verified evidence."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import pypdfium2 as pdfium
from PIL import Image

repo = Path(__file__).resolve().parents[1]
out = repo.parent / 'output'
out.mkdir(exist_ok=True)
excluded = {'.git', 'node_modules', 'dist', '.vercel', 'evidence', '__pycache__'}
with ZipFile(out / 'ShowCase-Sarmiento-Source.zip', 'w', ZIP_DEFLATED) as z:
    for f in repo.rglob('*'):
        rel = f.relative_to(repo)
        if not f.is_file() or any(p in excluded for p in rel.parts):
            continue
        if (f.name.startswith('.env') and f.name != '.env.example') or f.suffix in {'.pdf', '.log'}:
            continue
        z.write(f, str(rel))
for activity, pdf, label in [(2, 'Activity-2-Sarmiento.pdf', 'Submission'), (3, 'Activity-3-Sarmiento.pdf', 'Submission')]:
    with ZipFile(out / f'Activity-{activity}-Sarmiento-{label}.zip', 'w', ZIP_DEFLATED) as z:
        z.write(repo / 'submission' / pdf, pdf)
        for f in (repo / 'submission/evidence').glob(f'activity{activity}-*'):
            z.write(f, 'evidence/' + f.name)
        z.write(repo / 'submission/SUBMISSION-CHECKLIST.md', 'SUBMISSION-CHECKLIST.md')
        z.write(repo / 'submission/READ-BEFORE-SUBMITTING.md', 'READ-BEFORE-SUBMITTING.md')
    doc = pdfium.PdfDocument(repo / 'submission' / pdf)
    thumbs = []
    for i in range(len(doc)):
        im = doc[i].render(scale=0.7).to_pil().convert('RGB')
        thumbs.append(im)
    sheet = Image.new('RGB', (thumbs[0].width * 3, thumbs[0].height * ((len(thumbs)+2)//3)), 'white')
    for i, im in enumerate(thumbs):
        sheet.paste(im, ((i%3)*im.width, (i//3)*im.height))
    sheet.save(out / f'Activity-{activity}-review.jpg')
print('Source ZIP, Activity 2 submission, and Activity 3 draft packaged without .env or dependencies.')
