import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginTOC from 'eleventy-plugin-toc';
import yaml from "js-yaml";
import CleanCSS from "clean-css";
import { execSync } from 'child_process';
import pluginFilters from "./_config/filters.js";
import { DateTime } from "luxon";
import csv from "csvtojson";

const TIME_ZONE = "America/New_York";

export default async function(eleventyConfig) {
// 1. DATA EXTENSIONS (CSV & YAML)
eleventyConfig.addDataExtension("csv", async (contents) => {
    return await csv({
        noheader: false,
        trim: true,
    }).fromString(contents);
});
eleventyConfig.addFilter("filterByCollection", function(collection, targetTag) {
    if (!targetTag) return [];
    
    return collection.filter(item => {
      // Ambil tag dari MD
      const itemTags = item.data.tags || [];
      const isMD = itemTags.includes(targetTag);
      
      // Ambil collection dari CSV (Pastikan ada dan cocok persis)
      const isCSV = item.data.entry && 
                   item.data.entry.collection && 
                   item.data.entry.collection.trim() === targetTag.trim();
                   
      return isMD || isCSV;
    });
  });
	eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

	// 2. DATE PARSING
	eleventyConfig.addDateParsing(function(dateValue) {
		if(typeof dateValue === "string" && !dateValue.match(/^\d{4}-\d{2}-\d{2}/)) {
			return;
		}
		
		let localDate;
		if(dateValue instanceof Date) {
			localDate = DateTime.fromJSDate(dateValue, { zone: "utc" }).setZone(TIME_ZONE, { keepLocalTime: true });
		} else if(typeof dateValue === "string") {
			localDate = DateTime.fromISO(dateValue, { zone: TIME_ZONE });
		}
		if (localDate?.isValid === false) {
			throw new Error(`Invalid date value (${dateValue})`);
		}
		return localDate;
	});

	// 3. PREPROCESSORS
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});
	
	eleventyConfig.addFilter("filterByTag", function(collection, tag) {
    if (!tag) return [];
    return collection.filter(item => item.data.tags && item.data.tags.includes(tag));
});


// subfolder
eleventyConfig.addCollection("subFolders", function(collectionApi) {
  return collectionApi.getAll().filter(item => item.data.layout === "collection-index.njk");
});

	// 4. PLUGINS
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginFilters);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
	eleventyConfig.addPlugin(IdAttributePlugin);

	eleventyConfig.addPlugin(pluginTOC, {
		tags: ['h2', 'h3', 'h4', 'h5'],
		id: 'toci',  
		class: 'sidebar-nav-item',
		ul: true,
		flat: false,
		wrapper: 'div'
	});

	// 5. ASSETS & WATCH TARGETS
	eleventyConfig.addPassthroughCopy({ "./public/": "/" });
	eleventyConfig.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");
	
	eleventyConfig.addBundle("css", { toFileDirectory: "dist" });
	eleventyConfig.addBundle("js", { toFileDirectory: "dist" });

	eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

	// 6. RSS FEED
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		templateData: {
			eleventyNavigation: { key: "Feed", order: 4 }
		},
		collection: {
			name: "texts",
			limit: 10,
		},
		metadata: {
			language: "en",
			title: "Title",
			subtitle: "Sub title",
			base: "https://example.com/",
			author: { name: "Your Name" }
		}
	});

	// 7. PAGEFIND INDEXING
	eleventyConfig.on('eleventy.after', () => {
		try {
			execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
		} catch (error) {
			console.log('[11ty] Pagefind indexing skipped');
		}
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});
};

export const config = {
	templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	dir: {
		input: "content",
		includes: "../_includes",
		data: "../_data",
		output: "_site"
	},
};