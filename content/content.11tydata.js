export default {
	layout: "default.njk",
	// Sub-collections in numbered folders use the universal collection-post layout
	eleventyComputed: {
		layout: (data) => {
			// Don't apply layout to XML files (sitemap, feed) or files that explicitly set layout: false
			if (data.layout === false || data.page.url.endsWith('.xml')) {
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
