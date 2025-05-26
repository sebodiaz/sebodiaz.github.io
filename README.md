# Sebo Diaz - Personal Portfolio Website

This is the repository for my personal academic and professional website..

The website is designed to be clean, responsive, and easy to navigate, built with HTML, CSS (Bulma framework), and vanilla JavaScript. Heavily inspired from 

## Table of Contents

-   [Features](#features)
-   [Folder Structure](#folder-structure)
-   [Development](#development)
-   [License](#license)
-   [Acknowledgments](#acknowledgments)

## Features

* **Responsive Design:** Adapts to various screen sizes (mobile, tablet, desktop).
* **Dynamic Publications Section:** Publications are loaded dynamically from a JavaScript array, making it easy to add/update new entries.
* **Image Lightbox:** Click on publication images to view them in a larger, detailed pop-up.
* **Professional Links:** Direct links to Email, Twitter, GitHub, LinkedIn, and Resume.
* **Customizable Highlight Color:** Unique text selection highlight color for a personalized touch.

## Folder Structure

The project is organized into clear, modular directories for easy management.

```
├── css/
│   └── styles.css        # Custom CSS rules and overrides
├── js/
│   └── script.js         # All JavaScript logic, including publication data and lightbox functionality
├── images/
│   ├── favicons/         # All favicon and site icon files
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-96x96.png
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   └── site.webmanifest
│   ├── profile/          # Profile picture
│   │   └── headshot.jpg
│   └── publications/     # Images related to publications
│       ├── pub_1.png
│       └── pub_n.png
├── files/
│   └── resume.pdf        # Your resume file
└── index.html            # The main entry point of the website
```

---

## Development

### Adding/Updating Publications

To add a new publication or modify an existing one:

1.  **Open `js/script.js`.**
2.  Locate the `publicationsData` array at the top of the file.
3.  Add a new JavaScript object to this array, following the existing structure, or modify an existing entry. Ensure the `imageSrc` property correctly points to the image's path within `images/publications/`.
4.  If adding a new image, place the image file in the `images/publications/` directory.

### Customizing Styles

1.  **Open `css/styles.css`.**
2.  All custom styles and overrides for the website's appearance are defined here. Feel free to modify existing rules or add new ones to change the design.

### Updating Personal Information and Links

1.  **Open `index.html`.**
2.  Edit the text content in the "About Me" section or update the `href` attributes for your social and resume links.


---

## Acknowledgments

* Design heavily inspired by [http://horwitz.ai](http://horwitz.ai).
* Built with [Bulma CSS Framework](https://bulma.io/).