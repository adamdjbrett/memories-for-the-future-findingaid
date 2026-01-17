import { DateTime } from "luxon";

export default function(eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format) => {
		if (!dateObj) return "";
		const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
		return DateTime.fromJSDate(date, { zone: "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	// Filter ini yang dicari oleh sitemap.xml.njk
	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		if (!dateObj) return "";
		const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
		return DateTime.fromJSDate(date, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array)) return [];
		return (n < 0) ? array.slice(n) : array.slice(0, n);
	});

	eleventyConfig.addFilter("filterTagList", function(tags) {
		if(!Array.isArray(tags)) return [];
		return tags.filter(tag => {
			const excluded = ["all", "recipes", "pets", "portfolios", "homepages", "general",
			"testting", "pages", "author", "authors"];
			return typeof tag === 'string' && excluded.indexOf(tag) === -1;
		});
	});

	eleventyConfig.addFilter("getKeys", target => {
		return target ? Object.keys(target) : [];
	});
};