# maddierochovansky.com

Personal portfolio site for Madison Rochovansky - operations, process improvement, and frontend development.

## Live Site
[maddierochovansky.com](https://maddierochovansky.com)

---

## Pages

- `index.html` - main portfolio
- `projects.html` - full projects listing with search and filters
- `work-with-me.html` - freelance services
- `404.html` - custom error page

---

## Stack

HTML, CSS, JavaScript
Hosted on Cloudflare with a custom domain

---

## Structure

```
/
├── style.css                  # Shared styles for all pages
├── script.js                  # Shared JS - nav, starfield, meteors, animations, modal
├── chat.js                    # Ask Maddie chatbot (index.html only)
├── work-with-me.js            # Work With Me page scripts
│
├── data/
│   └── projects.js            # Project data - loaded by projects.html
│
├── projects/
│   └── [slug].html            # Individual project pages (20 total)
│
└── assets/                    # Images and resume
    ├── photo.jpg
    ├── og-image.png
    └── madison_rochovansky_resume.pdf
```
