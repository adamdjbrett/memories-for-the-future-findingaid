export default {
	layout: "default.njk",
	published: true,
	// Accept common typo `flase` as false to prevent accidental publishing.
	eleventyComputed: {
		published: (data) => {
			const value = data.published;
			if (value === false) return false;
			if (typeof value === "string") {
				const normalized = value.trim().toLowerCase();
				if (normalized === "false" || normalized === "flase") return false;
			}
			return value ?? true;
		},
		permalink: (data) => {
			const value = data.published;
			const isUnpublished =
				value === false ||
				(typeof value === "string" &&
					["false", "flase"].includes(value.trim().toLowerCase()));

			// Do not publish or add to collections when published is false/flase.
			if (isUnpublished) return false;
			return data.permalink;
		},
		eleventyExcludeFromCollections: (data) => {
			const value = data.published;
			const isUnpublished =
				value === false ||
				(typeof value === "string" &&
					["false", "flase"].includes(value.trim().toLowerCase()));
			return isUnpublished ? true : data.eleventyExcludeFromCollections;
		},
		layout: (data) => {
			const pageUrl = typeof data?.page?.url === "string" ? data.page.url : "";

			// Don't apply layout to XML files (sitemap, feed) or files that explicitly set layout: false
			if (data.layout === false || pageUrl.endsWith(".xml")) {
				return false;
			}
			
			// If the file is in a numbered folder (collection), use the universal collection post layout
			const pathParts = data.page.filePathStem.split('/').filter(Boolean);
			if (pathParts.length > 1 && !['home', 'pages', 'feed'].includes(pathParts[0])) {
				return 'collection-post.njk';
			}
			return data.layout || 'default.njk';
		}
	}
};
