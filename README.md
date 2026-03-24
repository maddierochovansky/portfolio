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
Hosted on GitHub Pages with a custom domain via Cloudflare DNS
 
---
 
## Structure
 
```
/
├── style.css                  # Shared styles
├── script.js                  # Shared JS - nav, starfield, meteors, animations
├── chat.js                    # Ask Maddie chatbot
├── projects-render.js         # Renders project cards from data
├── work-with-me.js            # Work with me page scripts
│
├── data/
│   ├── projects.js            # Project data
│   ├── certifications.js      # Certifications and education
│   └── experience.js          # Work history
│
├── projects/
│   └── [slug].html            # Individual project pages
│
└── assets/                    # Images and resume
```