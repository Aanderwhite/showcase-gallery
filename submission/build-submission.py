"""Build truthful submission documents from verified links and saved evidence."""
from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parent
links_file = ROOT / 'live-links.json'
links = json.loads(links_file.read_text()) if links_file.exists() else {
    'github': 'https://github.com/Aanderwhite/showcase-gallery',
    'render': 'PENDING - deployment required',
    'vercel': 'PENDING - deployment required',
}
W, H = A4
INDIGO = colors.HexColor('#4338ca')

def page_header(c, heading, subtitle=''):
    c.setFillColor(INDIGO)
    c.rect(0, H-135, W, 135, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont('Helvetica-Bold', 26)
    c.drawString(42, H-65, heading)
    c.setFont('Helvetica', 12)
    c.drawString(42, H-92, subtitle)
    c.setFillColor(colors.HexColor('#1e293b'))

def line(c, label, value, y):
    c.setFont('Helvetica-Bold', 11)
    c.drawString(42, y, label)
    c.setFont('Helvetica', 11)
    # Wrap long URLs without overflowing the page.
    text = c.beginText(42, y-22)
    text.setLeading(17)
    while value:
        part, value = value[:75], value[75:]
        text.textLine(part)
    c.drawText(text)

def cover(c, activity):
    page_header(c, 'ShowCase: Product Gallery', f'MERN Stack Project - Activity {activity}')
    line(c, 'Student', 'April Mark Sarmiento', H-190)
    line(c, 'Section', 'INF233', H-255)
    line(c, 'Technology', 'MongoDB Atlas, Express.js, React, Node.js, Tailwind CSS', H-320)
    line(c, 'GitHub repository', links['github'], H-385)
    if activity == 3:
        line(c, 'Render API URL', links['render'], H-460)
        line(c, 'Vercel website URL', links['vercel'], H-540)
        if any('PENDING' in links[key] for key in ('render', 'vercel')):
            c.setFillColor(colors.HexColor('#b45309'))
            c.setFont('Helvetica-Bold', 11)
            c.drawString(42, 115, 'DRAFT: add verified live URLs before submitting Activity 3.')
    c.setFillColor(colors.HexColor('#64748b'))
    c.setFont('Helvetica', 10)
    c.drawString(42, 42, 'NU MOA - School of Information Technology')
    c.showPage()

def screenshot_page(c, title, filename, activity=2):
    source = ROOT / 'evidence' / filename
    if not source.exists():
        return
    page_header(c, f'Activity {activity} Evidence', title)
    image = ImageReader(str(source))
    iw, ih = image.getSize()
    scale = min((W-60)/iw, (H-190)/ih)
    c.drawImage(image, (W-iw*scale)/2, (H-150-ih*scale)/2+10, width=iw*scale, height=ih*scale)
    c.showPage()

c = canvas.Canvas(str(ROOT / 'Activity-2-Sarmiento.pdf'), pagesize=A4)
c.setTitle('Activity 2 - April Mark Sarmiento - INF233')
cover(c, 2)
for title, filename in [
    ('Atlas Cluster0', 'activity2-atlas-clusters.png'),
    ('Atlas Database User', 'activity2-atlas-database-user.png'),
    ('Atlas Network Access - Active', 'activity2-atlas-network-active.png'),
    ('VS Code - Server Folder', 'activity2-server-folder.png'),
    ('Server package.json', 'activity2-server-package.png'),
]:
    screenshot_page(c, title, filename)
c.save()

c = canvas.Canvas(str(ROOT / 'Activity-3-Cover-Sarmiento.pdf'), pagesize=A4)
c.setTitle('Activity 3 Cover - April Mark Sarmiento - INF233')
cover(c, 3)
for title, filename in [
    ('Public GitHub repository', 'activity3-github.jpg'),
    ('Render API - Live', 'activity3-render-live.jpg'),
    ('Thunder Client 1 - POST 201', 'activity3-thunder-01-create.png'),
    ('Thunder Client 2 - GET list 200', 'activity3-thunder-02-list.png'),
    ('Thunder Client 3 - GET product 200', 'activity3-thunder-03-detail.png'),
    ('Thunder Client 4 - PUT price 200', 'activity3-thunder-04-update.png'),
    ('Thunder Client 5 - DELETE 200', 'activity3-thunder-05-delete.png'),
    ('Thunder Client 6 - Validation 400', 'activity3-thunder-06-validation.png'),
]:
    screenshot_page(c, title, filename, activity=3)
c.save()
print('Created Activity 2 document and Activity 3 cover.')
