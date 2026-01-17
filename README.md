# 11ty Library Research Guide Theme
Designed to be a Free and Open Source (FOSS) theme in the style of a research guide hosted by a university library.

This project is FOSS and databseless, prioritizng longevity and portability. 

## Features
+ 11ty Eleventy
+ Bootstrap UI
+ The Power of metadata for all setup
+ Simply Change Themes color in metadata
+ Simply RSS and Add List URL on metadata
+ Pagefind Search Functional
+ Beauty Print CSS
+ List of Collections
+ Article Details
+ Article Pagination
+ Auto SEO Injection Scripts
+ Accesskey Functional
+ The Power of Sidebar Menu
+ Author Profile on Sidebar
+ Print article page detail
+ Print Article with Author
+ Tags List
+ Tags Detail Article
+ Update Date
+ Static Page
+ Breadcumb
+ Header Logo
+ Header Title
+ Header Sub Title
+ Header Information
+ Footer Menu Nav
+ Footer Copyrights
+ Creative Commons Image
+ Creative Commons Text
+ Contact Form
+ Footer notes for print and url link


## Scores
In Google Lighthouse for mobile the theme has 4 100s for Performance, Accessibility, Best Practices, and SEO.
![Screenshot of four 100s for Performance, Accessibility, Best Practices, SEO in Google Lighthouse for Mobile browsers](/mobile.png)

In Google Lighthouse for desktop the theme has 4 100s for Performance, Accessibility, Best Practices, and SEO.
![Screenshot of four 100s for Performance, Accessibility, Best Practices, SEO in Google Lighthouse for Desktop Browsers](/desktop.png)


Developer [Adam Dj Brett](https://adamdjbrett.com)

## Image Credit
Image by <a href="https://pixabay.com/users/openclipart-vectors-30363/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=156019">OpenClipart-Vectors</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=156019">Pixabay</a>

---
## CHANGELOG
### Instructions.
0. install as you usually do
```bash
npm install
npx @11ty/eleventy --serve --incremental
```
1. convert metadata.xlsx to markdown posts
2. front matter use template demo.md
3. all metadata.xlsx rows become a page. the columns explain what the format should be
    1. collection this is the folder the pages should be created in
        - create md files named after the slug column and stored in the directory in /content that matches the collection column
    2. slug this should be the filename.md. if it doesnt have one make one.  example yanapaq.md
        1. slugs cannot be longer than 50 characters and (.md is 3 so 47 characters). 
        2. no capitals
        3. numbers only when necessary
        4. we use ```-``` hypens not underscores. no special characters.
        - to make slug, use first fifteen letters of title hypens only all lowercase
        5. the rest of the columns are front matter
4. once collections are populated with data remove demo files and update metadat.yaml to reflect category names etc and make sure the sidebar and homepage look pretty
### TRACK CHANGES below

- 20260116crowcodes
- starting migration of metadata.csv to md files
- TO DO fix content hanging off left side of viewport when witdth is below 600px
-created yanapaq.md, does not seem to populate properly in the site when searched x
