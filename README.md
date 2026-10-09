# maddierochovansky.com

Personal portfolio site for Madison Rochovansky - business operations, process automation, and AI workflows.

## Live Site
[maddierochovansky.com](https://maddierochovansky.com)

---

## Pages

- `index.html` - main portfolio
- `projects.html` - project listing with category filters
- `projects/[slug].html` - individual project write-ups
- `404.html` - custom error page

---

## Stack

HTML, CSS, JavaScript. No frameworks, no build step.
Hosted on Cloudflare Workers static assets with a custom domain.

---

## Structure

```
/
├── style.css                  # Shared styles for all pages
├── script.js                  # Shared JS - nav, starfield, animations, data rendering, modal
├── chat.js                    # Ask Maddie chatbot (index.html only)
│
├── data/
│   ├── experience.js          # Work history - rendered into the Experience section
│   ├── toolkit.js             # Tools grouped by area - rendered into the Toolkit section
│   ├── projects.js            # Project data - featured cards on index, full list on /projects
│   └── certifications.js      # Certifications - featured cards + full list
│
├── projects/
│   └── [slug].html            # Individual project pages
│
├── assets/                    # Images and resume
│   ├── photo.jpg
│   ├── og-image.png
│   └── madison_rochovansky_resume.pdf
│
├── _redirects                 # Redirects for retired URLs
└── .assetsignore              # Repo files that are not served publicly
```

## Updating content

- **New job or bullet:** edit `data/experience.js`
- **New tool:** edit `data/toolkit.js`
- **New project:** add it to `data/projects.js`, create `projects/[slug].html`, and add it to `sitemap.xml`
- **Resume:** replace `assets/madison_rochovansky_resume.pdf`
